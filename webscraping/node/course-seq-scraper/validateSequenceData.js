var remove = require("remove");
var fs = require("fs");
var sequenceScraper = require("./main.js");

function validateScrapedSequenceJSON(sequenceJSON, onComplete){

    var issues = [];

    for(var sIndex = 0; sIndex < sequenceJSON.semesterList.length; sIndex++){

        var semester = sequenceJSON.semesterList[sIndex];
        var courseList = semester.courseList;

        issues.push(validateValueRegex("semester season", semester.season, /WINTER|SUMMER|FALL/));

        if(semester.isWorkTerm === "false" || semester.isWorkTerm === false){

            if(!courseList.length > 0){
                issues.push("Invalid number of courses in non-work term semester: " + courseList.length);
            }

            for(var cIndex = 0; cIndex < courseList.length; cIndex++){

                var course = courseList[cIndex];

                if(course.isElective === "false" || course.isElective === false){

                    issues.push(validateValueRegex("course code", course.code, /\w{4}\s*\d{3}/));

                    issues.push(validateValueRegex("course name", course.name, /\w*\s+\w*/));

                    issues.push(validateValueRegex("course elective type", course.electiveType, /^\s*$/));

                    issues.push(validateValueRegex("course credits", course.credits, /\d+/));

                } else {

                }

            }

        } else {

            if(courseList.length > 0){
                issues.push("Invalid number of courses in work term: " + courseList.length);
            }

        }

    }

    // filter out all undefined values from issues
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
sequenceScraper.updateData("./", false, function(){

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
                        console.log(file + " (" + sequenceJSON.sourceUrl + ")" + " CONTAINS ISSUES: ");
                        console.log(issues);
                    } else {
                        console.log(file + " (" + sequenceJSON.sourceUrl + ")" + ": OK");
                    }
                    if(numVerified == files.length){
                        cleanUp();
                    }
                });
            });
        });
    })
});