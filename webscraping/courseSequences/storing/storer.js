'use strict';

const f = require('util').format;
const nodemailer = require('nodemailer');
const remove = require("remove");
const fs = require("fs");
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const argv = require('minimist')(process.argv.slice(2));
const Ajv = require('ajv');
const ajv = new Ajv({
    "verbose": true,
    "allErrors": true
});
const validate = ajv.compile(JSON.parse(fs.readFileSync('courseSequenceSchema.json', 'utf8')));

// parse password from args or display error message
if(argv._.length < 1 || !argv._[0]){
    return console.error("storer.js takes one required argument: the password for the tranzoneAdmin account on the DB");
}
const username = encodeURIComponent("tranzoneAdmin");
const password = encodeURIComponent(argv._[0]);
const devDbName = "courseplannerdb-dev";
const prodDbName = "courseplannerdb";
const dbName = (argv.prod) ? prodDbName : devDbName;
const dbFullUrl = f('mongodb://%s:%s@conucourseplanner.online:27017/%s?authSource=admin', username, password, dbName);

let log = "*** Sequence Validation Log ***<br><br>";

const storeAllSequences = (function (){

    console.log("Storing + validating sequence json data");

    let seqFolder = '../scrapedJson/';
    let numValidated = 0;

    MongoClient.connect(dbFullUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to db server");

        let foundIssue = false;

        // read all files in sequence folder and pass them through the validator
        fs.readdir(seqFolder, function (err, files) {
            if(files.length < 1){
                db.close();
                return console.error("WARNING: storer found no files in scrapedJson/");
            }
            files.forEach(function (file) {
                fs.readFile(seqFolder + file, "utf-8", function (err, fileContent) {
                    let sequenceJSON = JSON.parse(fileContent);
                    if (err) {
                        throw err;
                    }

                    let isSequenceValid = validate(sequenceJSON);

                    numValidated++;
                    if(!isSequenceValid){
                        logMessage(file + ": FAIL - ");
                        logMessage('<pre>' + JSON.stringify(validate.errors, undefined, 4) + '</pre>');
                        foundIssue = true;
                    } else {
                        logMessage(file + ": PASS");

                        // write the json to the db
                        db.collection("courseSequences").update({_id : file.replace(".json","")}, {$set:sequenceJSON}, {upsert: true}, function(err, result) {
                            assert.equal(err, null);
                            logMessage("Wrote contents of file: " + file + " to db.");
                        });
                    }

                    if (numValidated == files.length) {
                        db.close();
                        if(foundIssue){
                            sendIssueEmail();
                        }
                    }
                });
            });
        });
    });
})();

function cleanUp(){
    try {
        remove.removeSync("../scrapedJson");
        logMessage("cleaned up sequences dir");
    } catch (err) {
        console.error(err);
    }
}

function logMessage(message){
    console.log(message);
    log += message + "<br>"
}

function sendIssueEmail(){

    let message = "The course sequence scraper encountered errors in its most recent execution (" + new Date().toString() + ")<br>" +
                    " Below are the logs from the scrape attempt:<br><br>";
    message += log;

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'concordiacourseplanner@gmail.com',
            pass: 'tranzone'
        }
    });

    let mailOptions = {
        from: '"Course Planner Debug" <concordiacourseplanner@gmail.com>', // sender address
        to: 'davidhuculak5@gmail.com, petergranitski@gmail.com , stumash1@gmail.com', // list of receivers
        subject: 'Course Planner has encountered an issue', // Subject line
        html: message // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            return console.log(error);
        }
        console.log('Message %s sent: %s', info.messageId, info.response);
    });
}
