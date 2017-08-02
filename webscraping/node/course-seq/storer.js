'use strict';

let nodemailer = require('nodemailer');
let remove = require("remove");
let fs = require("fs");
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let argv = require('minimist')(process.argv.slice(2));
let Ajv = require('ajv');
let ajv = new Ajv({
    "verbose": true,
    "allErrors": true
});

let validate = ajv.compile(JSON.parse(fs.readFileSync('../json-schema/recommendedSequence.json', 'utf8')));
let mongoServerUrl = 'mongodb://138.197.6.26:27017/';
let devDbName = "courseplannerdb-dev";
let prodDbName = "courseplannerdb";
let dbName = (argv.prod) ? prodDbName : devDbName;
let dbFullUrl = mongoServerUrl + dbName;
let log = "*** Sequence Validation Log ***<br><br>";

let storeAllSequences = (function (){

    console.log("Storing + validating sequence json data");

    let seqFolder = './sequences/';
    let numValidated = 0;

    MongoClient.connect(dbFullUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to db server");

        let foundIssue = false;

        // read all files in sequence folder and pass them through the validator
        fs.readdir(seqFolder, function (err, files) {
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
                        logMessage(JSON.stringify(validate.errors, undefined, 4));
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
        remove.removeSync("./sequences");
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

    let message = "The course sequence scraper encountered errors in its most recent execution (" + new Date().toString() + ")\n" +
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
