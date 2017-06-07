var remove = require("remove");
var fs = require("fs");
var sequenceScraper = require("./main.js");

function validateScrapedSequenceJSON(sequenceJSON, onComplete){

    var issues = [];

    // loop through all the data, pushing any issues found the the issues array
    for(var sIndex = 0; sIndex < sequenceJSON.semesterList.length; sIndex++){

        var semester = sequenceJSON.semesterList[sIndex];
        var courseList = semester.courseList;
        var emptyRegex =  /^\s*$/;

        issues.push(validateValueRegex("semester season", semester.season, /WINTER|SUMMER|FALL/));

        if(semester.isWorkTerm === "false" || semester.isWorkTerm === false){

            if(!courseList.length > 0){
                issues.push("Invalid number of courses in work term (semester " + sIndex + "): " + courseList.length);
            }

            for(var cIndex = 0; cIndex < courseList.length; cIndex++){

                var course = courseList[cIndex];
                var locationRef = "(semester " + (sIndex + 1) + ", course " + (cIndex + 1) + ")";

                if(course.isElective === "false" || course.isElective === false){

                    issues.push(validateValueRegex("course code " + locationRef, course.code, /\w{4}\s*\d{3}/));

                    issues.push(validateValueRegex("course elective type " + locationRef, course.electiveType, emptyRegex));

                    // commented out as these properties can be derived from our course data db
                    //issues.push(validateValueRegex("course name", course.name, /\w*\s+\w*/));
                    //issues.push(validateValueRegex("course credits " + locationRef, course.credits, /\d+/));

                } else {

                    issues.push(validateValueRegex("course code " + locationRef, course.code, emptyRegex));

                    issues.push(validateValueRegex("course elective type " + locationRef, course.electiveType, /SCIENCE|GENERAL|PROGRAM/));

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
        console.log("cleaned up sequences dir");
    } catch (err) {
        console.error(err);
    }
}

// RUN OUR BEAUTIFUL FUNCTIONS:

console.log("running sequence scraper...");

// scrape data
sequenceScraper.updateData("./", true, function(){

    console.log("validating sequence data");

    var seqFolder = './sequences/';
    var numVerified = 0;

    // read all files in sequence folder and pass them through the validator
    fs.readdir(seqFolder, function(err, files){
        files.forEach(function(file){
            fs.readFile(seqFolder + file, "utf-8", function(err, fileContent) {
                var sequenceJSON = JSON.parse(fileContent);
                if (err) {
                    throw err;
                }
                validateScrapedSequenceJSON(sequenceJSON, function(isValid, issues){
                    numVerified++;
                    if(!isValid){
                        console.log(file + " CONTAINS ISSUES: ");
                        console.log(issues);
                    } else {
                        console.log(file + ": OK");
                    }
                    if(numVerified == files.length){
                        cleanUp();
                    }
                });
            });
        });
    });
});