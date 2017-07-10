'use strict';
var nodemailer = require('nodemailer');
var remove = require("remove");
var fs = require("fs");
var sequenceScraper = require("./scraper.js");
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var mongoServerUrl = 'mongodb://138.197.6.26:27017/courseplannerdb';
var log = "*** Sequence Validation Log ***<br><br>";
var emptyRegex =  /^\s*$/;

function validateScrapedSequenceJSON(sequenceJSON, onComplete){

    var issues = [];

    // loop through all the data, pushing any issues found the the issues array
    for(var sIndex = 0; sIndex < sequenceJSON.semesterList.length; sIndex++){

        var semester = sequenceJSON.semesterList[sIndex];
        var courseList = semester.courseList;

        issues.push(validateValueRegex("semester season", semester.season, /WINTER|SUMMER|FALL/));

        if(semester.isWorkTerm === "false" || semester.isWorkTerm === false){

            if(!courseList.length > 0){
                issues.push("Invalid number of courses in work term (semester " + sIndex + "): " + courseList.length);
            }

            for(var cIndex = 0; cIndex < courseList.length; cIndex++){

                var locationRef = "(semester " + (sIndex + 1) + ", course " + (cIndex + 1) + ")";
                var course = courseList[cIndex];
                // check if we get an array when we were expecting a plain object. this means that we encountered a list of courses joined by OR
                // rather than an individual course.
                if(course.length >= 2){
                    course.forEach(function(course){
                        var courseIssues = findCourseIssues(course, locationRef);
                        if(courseIssues.length > 0){
                            courseIssues.forEach(function(issue){
                                issues.push(issue);
                            });
                        }
                    });
                } else {

                    var courseIssues = findCourseIssues(course, locationRef);
                    if(courseIssues.length > 0){
                        courseIssues.forEach(function(issue){
                            issues.push(issue);
                        });
                    }
                }
            }

        } else {

            if(courseList.length > 0){
                issues.push("Invalid number of courses in work term (semester " + sIndex + "): " + courseList.length);
            }

        }

    }

    // filter out all undefined values from issues array
    issues = issues.filter(function( element ) {
        return element !== undefined;
    });

    if(issues.length > 0){
        onComplete(false, issues);
    } else {
        onComplete(true);
    }
}

// returns list of issues with the courseObject
function findCourseIssues(course, locationRef){
    var courseIssues = [];

    if(course.isElective === "false" || course.isElective === false){

        courseIssues.push(validateValueRegex("course code " + locationRef, course.code, /^\w{4}\s{1}\d{3}$/));

        courseIssues.push(validateValueRegex("course elective type " + locationRef, course.electiveType, emptyRegex));

        // commented out as these properties can be derived from our course data db
        //courseIssues.push(validateValueRegex("course name", course.name, /\w*\s+\w*/));
        //courseIssues.push(validateValueRegex("course credits " + locationRef, course.credits, /\d+/));

    } else {

        courseIssues.push(validateValueRegex("course code " + locationRef, course.code, emptyRegex));

        courseIssues.push(validateValueRegex("course elective type " + locationRef, course.electiveType, /SCIENCE|GENERAL|PROGRAM/));

    }

    return courseIssues;
}

function validateValueRegex(propertyName, propertyValue, regex){
    propertyValue = propertyValue.toUpperCase();
    var pattern = new RegExp(regex);
    var res = pattern.test(propertyValue);
    if(res){
        return undefined;
    } else {
        return "Invalid value for " + propertyName +" property: " + propertyValue;
    }
}

function isLetter(str) {
    return str.length === 1 && str.match(/[a-z]/i);
}

function isNumeric(str){
    return /^\d+$/.test(str);
}

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

    //  petergranitski@gmail.com , stumash1@gmail.com
    var mailOptions = {
        from: '"Course Planner Debug" <concordiacourseplanner@gmail.com>', // sender address
        to: 'davidhuculak5@gmail.com', // list of receivers
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

// RUN OUR BEAUTIFUL FUNCTIONS:
sequenceScraper.updateData("./", true, function(){

    console.log("validating sequence data");

    var seqFolder = './sequences/';
    var numVerified = 0;

    MongoClient.connect(mongoServerUrl, function(err, db) {
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
                    validateScrapedSequenceJSON(sequenceJSON, function (isValid, issues) {
                        numVerified++;
                        if (!isValid) {
                            logMessage(file + ": FAIL - ");
                            logMessage(issues);
                            foundIssue = true;
                        } else {
                            logMessage(file + ": PASS");

                            // write the json to the db
                            db.collection("courseSequences").update({_id : file}, {$set:sequenceJSON}, {upsert: true}, function(err, result) {
                                assert.equal(err, null);
                                logMessage("Wrote contents of file: " + file + " to db.");
                            });

                        }
                        if (numVerified == files.length) {
                            db.close();
                            cleanUp();
                            if(foundIssue){
                                sendIssueEmail();
                            }
                        }
                    });
                });
            });
        });
    });
});