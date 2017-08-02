'use strict';

var nodemailer = require('nodemailer');
var remove = require("remove");
var fs = require("fs");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var argv = require('minimist')(process.argv.slice(2));
var Ajv = require('ajv');
var ajv = new Ajv({
    "verbose": true,
    "allErrors": true
});

var validate = ajv.compile(JSON.parse(fs.readFileSync('../json-schema/recommendedSequence.json', 'utf8')));
var mongoServerUrl = 'mongodb://138.197.6.26:27017/';
var devDbName = "courseplannerdb-dev";
var prodDbName = "courseplannerdb";
var dbName = (argv.prod) ? prodDbName : devDbName;
var dbFullUrl = mongoServerUrl + dbName;
var log = "*** Sequence Validation Log ***<br><br>";

var storeAllSequences = (function (){

    console.log("Storing + validating sequence json data");

    var seqFolder = './sequences/';
    var numValidated = 0;

    MongoClient.connect(dbFullUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to db server");

        var foundIssue = false;

        // read all files in sequence folder and pass them through the validator
        fs.readdir(seqFolder, function (err, files) {
            files.forEach(function (file) {
                fs.readFile(seqFolder + file, "utf-8", function (err, fileContent) {
                    var sequenceJSON = JSON.parse(fileContent);
                    if (err) {
                        throw err;
                    }

                    var isSequenceValid = validate(sequenceJSON);

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

    var message = "The course sequence scraper encountered errors in its most recent execution (" + new Date().toString() + ")\n" +
                    " Below are the logs from the scrape attempt:<br><br>";
    message += log;

    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // secure:true for port 465, secure:false for port 587
        auth: {
            user: 'concordiacourseplanner@gmail.com',
            pass: 'tranzone'
        }
    });

    var mailOptions = {
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
