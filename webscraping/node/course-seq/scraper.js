'use strict';

let fs = require('fs');
let request = require('request');
let cheerio = require('cheerio');
let assert = require('assert');
let courseCodeRegex = /\w{4}\s?\d{3}/;

const SEASON_NAMES = ["fall", "winter", "summer"];

let programs = {
    "SOEN": "Software Engineering",
    "COMP": "Computer Science",
    "BLDG": "Building Engineering",
    "CIVI": "Civil Engineering",
    "INDU": "Industrial Engineering",
    "MECH": "Mechanical Engineering"
};

let programOptions = {
    "General": "General Program",
    "Games": "Computer Games",
    "Realtime": "Real-time, Embedded and Avionics Software ",
    "Web": "Web Services and Applications",
    "Apps": "Computer Applications",
    "CompSys": "Computer Systems",
    "InfoSys": "Information Systems",
    "Stats": "Mathematics and Statistics",
    "SoftSys": "Software Systems"
};

let entryTypes = {
    "Sept": "September",
    "Jan": "January",
    "Coop": "Coop September"
};

// pull all html documents from sequenceUrls.json and write to appropriate .json files
let scrapeAllUrls = (function (){

    let outputDir = "./sequences/";
    let numStarted = 0, numCompleted = 0;

    fs.readFile("./sequenceUrls.json", function (err, data) {
        if (err) {
            console.error("ERROR reading sequenceUrls.json");
            process.exit(1);
        }

        let sequenceUrls = JSON.parse(data.toString());

        // do some logging each time a sequence is finished with
        let completionCallback = function(){
            numCompleted++;
            console.log(numCompleted + "/" + numStarted + " file writes completed");
            if(numCompleted == numStarted){
                console.log("All file writes have been completed.");
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
                for(let sequenceVariant in subList){
                    let url = subList[sequenceVariant];
                    let plainFileName =  program + "-" + sequenceVariant + ".json";
                    numStarted++;
                    scrapeEncsSequenceUrl(url, outputDir, plainFileName, completionCallback);
                }
            }
        }
    });
})();

// pull html document from url and write to appropriate .json files
function scrapeEncsSequenceUrl(url, outPath, plainFileName, onComplete){

    request(url, function(error, response, html){
        if(!error){
            let $ = cheerio.load(html);

            let semesterList = [];
            let courseList = [];
            let currentSeason = "";
            let hasStartedScraping = false;
            let minTotalCredits = $(".section.title .section-header").text().match(/\S*\d+\S*/)[0];

            $(".concordia-table.table-condensed tbody > tr").each(function(i, el){
                let $row = $(this);

                if(i === 0){
                    let seasonText = $(this).children().html().toLowerCase();
                    currentSeason = parseSeason(seasonText);
                }

                if($row.children().length === 3){
                    $row.each(function(i, el){
                        let $rowCell = $(this);
                        let containsBoldText = $rowCell.children()[0].name === "th";
                        if(!containsBoldText){
                            let code = "", name = "", isElective = "false", electiveType = "", credits = "", foundACourse = false;
                            let firstCellText = $rowCell.find("p").text() || $rowCell.find("td").text();
                            firstCellText = firstCellText.toLowerCase().trim();
                            let pattern = new RegExp(/\bor\b/);
                            let courseCodeValue = $($rowCell.children()[0]).text().replace(/\r?\n|\r/g, " ").trim().toLowerCase();

                            if(firstCellText.indexOf("work term") >= 0){
                                semesterList.push({
                                    "season": currentSeason,
                                    "courseList": courseList,
                                    "isWorkTerm": "true"
                                });
                            } else if(pattern.test(courseCodeValue)){
                                let orList = courseCodeValue.split(/\bor\b/);
                                let orCourseList = [];
                                orList.forEach(function(courseCode){
                                    let isElec = "false", elecType = "";
                                    if(firstCellText.indexOf("basic science") >= 0){
                                        courseCode = "";
                                        isElec = "true";
                                        elecType = "Science";
                                    } else if(courseCode.indexOf("general") >= 0){
                                        courseCode = "";
                                        isElec = "true";
                                        elecType = "General";
                                    } else if(courseCode.indexOf("elective") >= 0){
                                        courseCode = "";
                                        isElec = "true";
                                        elecType = "Program";
                                    } else {
                                        courseCode = extractCourseCode(courseCode);
                                    }
                                    courseCode = addMiddleSpaceIfNeeded(courseCode);
                                    orCourseList.push({
                                        "code": courseCode.trim().toUpperCase(),
                                        "isElective": isElec.trim(),
                                        "electiveType": elecType.trim()
                                    });
                                });
                                courseList.push(orCourseList);
                            } else if(firstCellText.indexOf("basic science") >= 0){
                                isElective = "true";
                                electiveType = "Science";
                                foundACourse = true;
                            } else if(firstCellText.indexOf("general") >= 0){
                                isElective = "true";
                                electiveType = "General";
                                foundACourse = true;
                            } else if(firstCellText.indexOf("elective") >= 0){
                                isElective = "true";
                                electiveType = "Program";
                                foundACourse = true;
                            } else {
                                // add a course to the course list
                                code = extractCourseCode($($rowCell.children()[0]).text());
                                foundACourse = true;
                            }
                            if(foundACourse && (code.trim().length > 0) || electiveType.trim().length > 0){
                                code = addMiddleSpaceIfNeeded(code);
                                courseList.push({
                                    "code": code.trim().toUpperCase(),
                                    "isElective": isElective.trim(),
                                    "electiveType": electiveType.trim()
                                });
                            }
                        }
                    });
                } else if(/work term [i]+/g.test($row.children().text().toLowerCase())){
                    semesterList.push({
                        "season": currentSeason,
                        "courseList": courseList,
                        "isWorkTerm": "true"
                    });
                }else if($row.children().text().toLowerCase().indexOf("year") >= 0){
                    if(hasStartedScraping){
                        if(courseList.length > 0){
                            semesterList.push({
                                "season": currentSeason,
                                "courseList": courseList,
                                "isWorkTerm": "false"
                            });
                        }
                        courseList = [];
                        currentSeason = parseSeason($row.children().text().toLowerCase());
                    }
                    hasStartedScraping = true;
                }
            });

            // add residual semester if there is one
            if(courseList.length > 0){
                semesterList.push({
                    "season": currentSeason,
                    "courseList": courseList,
                    "isWorkTerm": "false"
                });
            }

            semesterList = fixMechAndIndu(semesterList, plainFileName);

            let yearList = toYearList(semesterList);

            let sequenceObject = {
                "prettyName": prettifySequenceID(plainFileName.replace(".json", "")),
                "sourceUrl": url,
                "minTotalCredits" : minTotalCredits,
                "yearList" : yearList
            };

            console.log("Finished scraping from url: " + url);

            fs.writeFile(outPath + plainFileName, JSON.stringify(sequenceObject, null, 4), function(err){
                if(err){
                    console.error("ERROR writing to a file: " + plainFileName);
                    process.exit(1);
                } else {
                    console.log("Done writing file: " + plainFileName);
                    onComplete && onComplete();
                }
            });

        }
    });
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

// perform fix for badly formatted INDU sequences
function fixMechAndIndu(semesterList, programID){

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

    if(programID.includes("INDU")){

        // clear messed up semesters
        semesterList.pop();
        if(!programID.includes("Coop")) {
            semesterList.pop();
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

    return semesterList;
}

function addMiddleSpaceIfNeeded(courseCode){
    let pattern = new RegExp(/^\w{4}\d{3}$/);
    let res = pattern.test(courseCode.trim());
    if(res){
        // add space where it needs to go
        return courseCode.substr(0, 4) + " " + courseCode.substr(4);
    } else {
        return courseCode;
    }
}

function extractCourseCode(courseCodeStr){
    let test = courseCodeStr.match(courseCodeRegex);
    return (test) ? test[0] : "";
}

function parseSeason(season){
    if(season.indexOf("fall") >= 0){
        return "fall";
    } else if(season.indexOf("winter") >= 0){
        return "winter";
    } else if(season.indexOf("summer") >= 0){
        return "summer";
    }
    return undefined;
}

function prettifySequenceID(sequenceID){
    let descriptors = sequenceID.split("-");

    if(descriptors.length === 2){
        return (programs[descriptors[0]] + ", " + entryTypes[descriptors[1]] + " entry");
    }
    if(descriptors.length === 3){
        return(programs[descriptors[0]] + ", " + programOptions[descriptors[1]] + " option, " + entryTypes[descriptors[2]] + " entry");
    }

    return "";
}

module.exports.scrapeSingleUrl = function(url, onComplete){
    scrapeEncsSequenceUrl(url, "./", "debug.json", onComplete);
};