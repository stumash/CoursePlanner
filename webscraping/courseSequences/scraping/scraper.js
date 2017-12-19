'use strict';

const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const assert = require('assert');

const SEASON_NAMES = ["fall", "winter", "summer"];
const outputDir = "../scrapedJson/";

const courseCodeRegex = /\w{4}\s{0,2}\d{3}/;
const minTotalCreditsRegex = /\S*\d+\S*/;
const seasonRegex = /fall|winter|summer/i;
const workTermRegex = /work term/i;
const orListRegex = /\bor\b/i;
const genElectiveRegex = /general/i;
const nextLineSkipRegex = /gen_ed|coen050/i;
const scienceElectiveRegex = /basic science/i;
const programElectiveRegex = /elective/i;
const garbageLineRegex = /^\*|^note:|^suggested|^engineering writing test|^refer/i;

const commonSequenceSelector = ".c-accordion.toggable";
const elecCoenSequenceSelector = ".WordSection1";

let courseCorrectionMap = [];

// pull all html documents from sequenceUrls.json and write to appropriate .json files
let startScrape = (function (){
    fs.readFile("./courseCorrectionMap.json", function (err, data) {
        if (err) {
            console.error("ERROR reading courseCorrectionMap.json");
            process.exit(1);
        }
        
        courseCorrectionMap = JSON.parse(data.toString());
        scrapeAllUrls(courseCorrectionMap);

    });
})();

function scrapeAllUrls(){

    let numStarted = 0, numCompleted = 0;

    console.log("\n** Scraping commonly-formatted sequences from sequenceUrls.json **\n");
    
    fs.readFile("./sequenceUrls.json", function (err, data) {
        if (err) {
            console.error("ERROR reading sequenceUrls.json");
            process.exit(1);
        }

        let sequenceUrls = JSON.parse(data.toString());

        // do some logging each time a sequence is finished with
        let completionCallback = function(plainFileName){
            numCompleted++;
            console.log("Done writing file: " + plainFileName + " (" + numCompleted + "/" + numStarted + ")");
            if(numCompleted == numStarted){

                console.log("\n** Scraping weirdly-formatted sequences from elecCoenHeadings.json **\n");
                startElecCoenScrape();
            }
        }; 

        for (let program in sequenceUrls) {
            let subList = sequenceUrls[program];
            let options = subList.Options;
            // in this case, sequenceVariant/optionType will be either September entry, January entry, or Coop
            if(options){
                for(let optionType in options){
                    let optionSubList = options[optionType];
                    for(let sequenceVariant in optionSubList){
                        let url = optionSubList[sequenceVariant];
                        let plainFileName = program + "-" + optionType + "-" + sequenceVariant + ".json";
                        numStarted++;
                        scrapeEncsSequenceUrl(url, outputDir, plainFileName, completionCallback);
                    }
                }
            } else {
                for (let sequenceVariant in subList) {
                    let url = subList[sequenceVariant];
                    let plainFileName = program + "-NoOption-" + sequenceVariant + ".json";
                    numStarted++;
                    scrapeEncsSequenceUrl(url, outputDir, plainFileName, completionCallback);
                }
            }
        }
    });
}

function startElecCoenScrape(){
    fs.readFile("./elecCoenHeadings.json", function (err, data) {
        if (err) {
            console.error("ERROR reading elecCoenHeadings.json");
            process.exit(1);
        }

        let elecCoen = JSON.parse(data.toString());
        scrapeElecCoenUrl(elecCoen.url, elecCoen.headings, outputDir);

    });
}

// pull html document from url and write to appropriate .json files
function scrapeEncsSequenceUrl(url, outPath, plainFileName, onComplete){

    request(url, function(error, response, html){
        if(!error){
            let $ = cheerio.load(html);

            let minTotalCredits = $(".section.title .section-header").text().match(minTotalCreditsRegex)[0];

            let sequenceInfo = parseSequenceInfo(plainFileName.replace(".json", ""));

            let semesterList = sequenceTextToSemesterList($(commonSequenceSelector).text());

            semesterList = performHardcodedPatches(semesterList, plainFileName);
            semesterList = correctWrongCourses(semesterList, courseCorrectionMap);

            let yearList = toYearList(semesterList);

            let sequenceObject = {
                "sequenceInfo": sequenceInfo,
                "sourceUrl": url,
                "minTotalCredits" : minTotalCredits,
                "yearList" : yearList
            };

            fs.writeFile(outPath + plainFileName, JSON.stringify(sequenceObject, null, 4), function(err){
                if(err){
                    console.error("ERROR writing to a file: " + plainFileName);
                    process.exit(1);
                } else {
                    onComplete && onComplete(plainFileName);
                }
            });

        }
    });
}

function scrapeElecCoenUrl(url, headings, outPath){

    request(url, function(error, response, html){
        if(!error){
            let $ = cheerio.load(html);

            let pageText = $(elecCoenSequenceSelector).text();

            let sequenceTextObjects = splitElecCoenText(pageText, headings);

            let numCompleted = 0;

            sequenceTextObjects.forEach((sequence, sequenceIndex) => {

                let sequenceInfo = parseSequenceInfo(sequence.id);

                let semesterList = sequenceTextToSemesterList(sequence.sequenceText);

                semesterList = correctWrongCourses(semesterList, courseCorrectionMap);

                // assume 120 credits for engineering
                let minTotalCredits = "120";

                let yearList = toYearList(semesterList);

                let sequenceObject = {
                    "sequenceInfo": sequenceInfo,
                    "sourceUrl": url,
                    "minTotalCredits" : minTotalCredits,
                    "yearList" : yearList
                };

                fs.writeFile(outPath + sequence.id + ".json", JSON.stringify(sequenceObject, null, 4), function(err){
                    if(err){
                        console.error("ERROR writing to a file: " + sequence.id);
                        process.exit(1);
                    } else {
                        numCompleted++;
                        console.log("Done writing file: " + sequence.id + ".json (" + numCompleted + "/" + (sequenceTextObjects.length) + ")");
                    }
                });
            });
        }
    });
}

function splitElecCoenText(pageText, headings){

    let sequenceTextObjects = [];
    let lastHeadingIndex = pageText.indexOf("ELEC Regular, September Entry");

    headings.forEach((heading, headingIndex) => {

        let currentHeadingIndex = pageText.indexOf(heading.heading, lastHeadingIndex);
        let nextHeadingIndex = (headingIndex !== headings.length - 1) ? pageText.indexOf(headings[headingIndex + 1].heading, currentHeadingIndex) : pageText.length - 1;
        let sequenceText = pageText.substring(currentHeadingIndex, nextHeadingIndex);

        lastHeadingIndex = nextHeadingIndex;

        sequenceTextObjects.push({
            "id": heading.id,
            "sequenceText": sequenceText
        });

    });

    return sequenceTextObjects;
}

function sequenceTextToSemesterList(sequenceText){

    let semesterList = [];

    let inOrList = false;

    let currentSeason = "";
    let currentCourseList = [];
    let currentIsWorkTerm = "false";

    let allLines = sequenceText.split("\n");
    for(let lineIndex = 0; lineIndex < allLines.length; lineIndex++){
        let line = allLines[lineIndex].trim();
        if(line.length > 0 && !(line.match(garbageLineRegex))){
            let seasonMatch = line.match(seasonRegex);
            if(seasonMatch){

                // flush list
                if(currentSeason.length > 0){
                    semesterList.push({
                        "season": currentSeason,
                        "courseList": currentCourseList,
                        "isWorkTerm": currentIsWorkTerm
                    });
                }

                // change season and restart
                currentSeason = seasonMatch[0].toLowerCase();
                currentCourseList = [];
                currentIsWorkTerm = "false";

            } else {

                // force skip the next line if the current line format calls for it
                if(line.match(nextLineSkipRegex)){
                    lineIndex++;
                }

                let workTermMatch = line.match(workTermRegex);
                if(workTermMatch){
                    currentIsWorkTerm = "true";
                }

                let courseItem = extractCourseObject(line);

                if(courseItem){

                    let orListMatch = line.match(orListRegex);

                    if(orListMatch){

                        let singleLineOrList = line.split(orListRegex);

                        let allValid = true;

                        // check that there are at least two courses
                        singleLineOrList.forEach((orListItem) => {
                            if(!extractCourseObject(orListItem)){
                                allValid = false;
                            }
                        });

                        // This orList is on one line
                        if(singleLineOrList.length > 1 && allValid){

                            let orList = [];
                            singleLineOrList.forEach((courseText) => {
                                let courseOrItem = extractCourseObject(courseText);
                                courseOrItem && orList.push(courseOrItem);
                            });

                            if(orList.length > 1) {
                                currentCourseList.push(orList);
                            }
                        }
                        // This is a multi-line orList, so use inOrList boolean
                        else {

                            if(!inOrList){
                                currentCourseList.push([]);
                                inOrList = true;
                            }

                            if(inOrList){
                                currentCourseList[currentCourseList.length-1].push(courseItem);
                            } else {
                                currentCourseList.push(courseItem);
                            }
                        }
                    }
                    else {
                        if(inOrList){
                            currentCourseList[currentCourseList.length-1].push(courseItem);
                        }
                        else {
                            currentCourseList.push(courseItem);
                        }
                        inOrList = orListMatch;
                    }
                }
            }
        }
    }
    // add residual semester
    semesterList.push({
        "season": currentSeason,
        "courseList": currentCourseList,
        "isWorkTerm": currentIsWorkTerm
    });
    return semesterList;
}

function extractCourseObject(text){

    let genElectiveMatch = text.match(genElectiveRegex);
    let scienceElectiveMatch = text.match(scienceElectiveRegex);
    let programElectiveMatch = text.match(programElectiveRegex);
    let courseMatch = text.match(courseCodeRegex);

    if(scienceElectiveMatch){
        return {
            "code": "",
            "isElective": "true",
            "electiveType": "Science"
        };
    }
    else if(genElectiveMatch){
        return {
            "code": "",
            "isElective": "true",
            "electiveType": "General"
        };
    }
    else if(programElectiveMatch){
        return {
            "code": "",
            "isElective": "true",
            "electiveType": "Program"
        };
    }
    else if(courseMatch){
        return {
            "code": fixCourseCodeSpacing(courseMatch[0].toUpperCase()),
            "isElective": "false",
            "electiveType": ""
        };
    }

    return undefined;
}

// converts a list of semesters into a list of years, ensuring that each year has a fall, winter and summer semester object
function toYearList(semesterList){

    let yearList = [];

    const noCourseSemester = {
        "courseList": [],
        "isWorkTerm": "false",
    };

    // first, fill in missing semesters
    let filledSemesterList = fillMissingSemesters(semesterList);

    // second, form year objects and add them to year list
    for(let year = 1; year <= (Math.ceil(filledSemesterList.length/3)); year++){
        let yearObject = {};
        SEASON_NAMES.forEach((season, seasonIndex) => {
            let currentSemester = filledSemesterList[((year-1)*3)+seasonIndex] || noCourseSemester;

            // remove season property as it has become redundant information
            delete currentSemester.season;

            yearObject[season] = currentSemester;
        });
        yearList.push(yearObject);
    }

    return yearList;
}

// Take an array of semester objects and add in any missing semesters
function fillMissingSemesters(semesterList){
    for(let i = 0; i < semesterList.length; i++){

        let expectedSeason = SEASON_NAMES[i%3];

        if(!(semesterList[i].season === expectedSeason)){
            semesterList.splice(i, 0, {
                "courseList" : [],
                "isWorkTerm" : "false"
            });
        }

    }
    return semesterList;
}

function performHardcodedPatches(semesterList, programID){
    let emptyWinter = {
        "season": "winter",
        "courseList": [],
        "isWorkTerm": "false"
    };
    let programElective = {
        "code": "",
        "isElective": "true",
        "electiveType": "Program"
    };
    let indu490 = {
        "code": "INDU 490",
        "isElective": "false",
        "electiveType": ""
    };
    let mech490 = {
        "code": "MECH 490",
        "isElective": "false",
        "electiveType": ""
    };
    let aero490 = {
        "code": "AERO 490",
        "isElective": "false",
        "electiveType": ""
    };

    if(programID.includes("INDU")){

        // clear messed up semesters
        semesterList.pop();
        semesterList.pop();
        if(!programID.includes("Coop")) {
            semesterList.push(emptyWinter);
        }

        // add 3 electives in final fall and winter semesters
        for(let i = 0; i < 3; i++){
            semesterList[semesterList.length-1].courseList.push(programElective);
            semesterList[semesterList.length-2].courseList.push(programElective);
        }

        // add INDU 490 in final fall and winter semesters
        semesterList[semesterList.length-1].courseList.push(indu490);
        semesterList[semesterList.length-2].courseList.push(indu490);
    }
    if(programID.includes("MECH")){

        // clear messed up semesters
        semesterList.pop();
        semesterList.push(emptyWinter);

        // add electives: 1 in fall and 3 in winter
        semesterList[semesterList.length-2].courseList.push(programElective);
        for(let i = 0; i < 3; i++){
            semesterList[semesterList.length-1].courseList.push(programElective);
        }

        // add MECH 490 in fall and winter
        semesterList[semesterList.length-1].courseList.push(mech490);
        semesterList[semesterList.length-2].courseList.push(mech490);
    }
    if(programID.includes("AERO")){
        let lastWinter = semesterList[semesterList.length-1];
        if(programID.charAt(5) !== "C"){
            semesterList.pop();
            semesterList.pop();
            semesterList.push(lastWinter);
            if(!programID.includes("Coop")){
                lastWinter.courseList.pop();
            }
            lastWinter.courseList.push(aero490);
            semesterList[semesterList.length-2].courseList.push(aero490);
        } else if(!programID.includes("Coop")){
            lastWinter.courseList.pop();
        }
    }

    return semesterList;
}

function correctWrongCourses(semesterList, courseCorrectionMap){
    for(let i = 0; i < semesterList.length; i++){
        let courseList = semesterList[i].courseList;
        for(let j = 0; j < courseList.length; j++){
            let course = courseList[j];
            if(course.length > 0){
                for(let k = 0; k < course.length; k++){
                    let orCourse = course[k];
                    if(courseCorrectionMap[orCourse.code]){
                        orCourse.code = courseCorrectionMap[orCourse.code];
                    }
                    if(courseCorrectionMap[orCourse.code] === ""){
                        course.splice(j, 1);
                    }
                }
            }
            if(courseCorrectionMap[course.code]){
                course.code = courseCorrectionMap[course.code];
            }
            if(courseCorrectionMap[course.code] === ""){
                courseList.splice(j, 1);
            }
        }
    }
    return semesterList;
}

function fixCourseCodeSpacing(courseCode){
    if(courseCode.length === 8){
        return courseCode;
    }
    courseCode = courseCode.replace(String.fromCharCode(160)," ");
    let numSpaces = 0;
    for(let i = 0; i < courseCode.length; i++){
        if(courseCode.charAt(i) === " "){
            numSpaces++;
        }
    }
    return courseCode.substr(0, 4) + " " + courseCode.substr(4 + numSpaces);
}

function parseSequenceInfo(sequenceID){
    let sequenceDescriptors = sequenceID.split("-");
    let programID = sequenceDescriptors[0];
    let optionID = sequenceDescriptors[1];
    let entryTypeID = sequenceDescriptors[2];
    return {
        program: programID,
        option: optionID,
        entryType: entryTypeID
    };
}

module.exports.scrapeSingleUrl = function(url, onComplete){
    scrapeEncsSequenceUrl(url, "./", "debug.json", onComplete);
};
