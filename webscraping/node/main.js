var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

function scrape(url, callback){

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);

            var semesterList = [];
            var courseList = [];
            var currentSeason = "";
            var hasStartedScraping = false;

            $(".concordia-table.table-condensed tbody > tr").each(function(i, el){
                var $row = $(this);

                if(i === 0){
                    var seasonText = $(this).children().html().toLowerCase();
                    currentSeason = parseSeason(seasonText);
                }

                if($row.children().length === 3){
                    $row.each(function(i, el){
                        var $rowCell = $(this);
                        var containsBoldText = $rowCell.children()[0].children[0].name === "b";
                        if(!containsBoldText){
                            var code = "", name = "", isElective = "false", electiveType = "", credits = "", foundACourse = false;
                            var firstCellText = $rowCell.find("p").text() || $rowCell.find("td").text();
                            firstCellText = firstCellText.toLowerCase().trim();
                            if(firstCellText.indexOf("work term") >= 0){
                                semesterList.push({
                                    "season": currentSeason,
                                    "courseList": courseList,
                                    "isWorkTerm": "true"
                                });
                            } else if(firstCellText === "basic science") {
                                isElective = "true";
                                electiveType = "Science";
                                foundACourse = true;
                            } else if(firstCellText === "general education elective") {
                                isElective = "true";
                                electiveType = "General";
                                foundACourse = true;
                            } else if(firstCellText.indexOf("elective") >= 0) {
                                    isElective = "true";
                                    electiveType = "Program";
                                    foundACourse = true;
                            } else {
                                // add a course to the course list
                                $rowCell.children().each(function(i, el){
                                    var cellText = $(this).children().text();
                                    switch(i){
                                        case 0:
                                            code = cellText;
                                            break;
                                        case 1:
                                            name = cellText;
                                            break;
                                        case 2:
                                            credits = cellText;
                                            break;
                                    }
                                });
                                foundACourse = true;
                            }
                            if(foundACourse){
                                courseList.push({
                                    "code": code,
                                    "name": name,
                                    "isElective": isElective,
                                    "electiveType": electiveType,
                                    "credits": credits
                                });
                            }
                        }
                    });
                } else if($row.children().length === 1 && $row.children().text().toLowerCase().indexOf("year") >= 0) {
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

            var sequenceObject = {"semesterList" : semesterList};
            console.log("Finished scraping from url: " + url);
            callback(sequenceObject);

        }
    });
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

var sitesToTest = [
    //software engineering
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soen-general.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-soen-general.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/co-op-soen-general.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soen-games.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-soen-games.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/co-op-soen-games.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soen-real-time.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-soen-real-time.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/co-op-soen-real-time.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soen-web.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-soen-web.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/co-op-soen-web.html",
    //computer science
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-general.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-general.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-general.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-comp-apps.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-comp-apps.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-comp-apps.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-comp-games.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-comp-games.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-comp-games.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-comp-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-comp-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-comp-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-info-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-info-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-info-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-math-stat.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-math-stat.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soft-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-soft-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-soft-sys.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-web-svcs.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/jan-web-svcs.html",
    "https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-web-svcs.html",
    //building engineering
    "https://www.concordia.ca/encs/bcee/students/undergraduate/course-sequences/sept.html",
    "https://www.concordia.ca/encs/bcee/students/undergraduate/course-sequences/jan.html",
    "https://www.concordia.ca/encs/bcee/students/undergraduate/course-sequences/co-op.html",
    //civil engineering
    "https://www.concordia.ca/encs/bcee/students/undergraduate/course-sequences/sept1.html",
    "https://www.concordia.ca/encs/bcee/students/undergraduate/course-sequences/jan1.html",
    "https://www.concordia.ca/encs/bcee/students/undergraduate/course-sequences/co-op1.html",
    //industrial engineering
    "https://www.concordia.ca/encs/mechanical-industrial/students/undergraduate/course-sequences/sept-indu.html",
    "https://www.concordia.ca/encs/mechanical-industrial/students/undergraduate/course-sequences/jan-indu.html",
    "https://www.concordia.ca/encs/mechanical-industrial/students/undergraduate/course-sequences/co-op-indu.html",
    //mechanical engineering
    "https://www.concordia.ca/encs/mechanical-industrial/students/undergraduate/course-sequences/sept-mech.html",
    "https://www.concordia.ca/encs/mechanical-industrial/students/undergraduate/course-sequences/jan-mech.html",
    "https://www.concordia.ca/encs/mechanical-industrial/students/undergraduate/course-sequences/co-op-mech.html"
];

var fileCounter = 1;
var writeJSON = function(sequenceObject){
    var outPath = "out/sequence" + fileCounter + ".json";
    fs.writeFile(outPath, JSON.stringify(sequenceObject, null, 4), function(err){
        if(err){
            console.log("ERROR writing to a file: " + outPath);
        } else {
            console.log("Done writing to file at: " + outPath);
        }
    });
    fileCounter++;
};

fs.mkdir("out", function(err) {
    for(var i = 0; i < sitesToTest.length; i++){
        console.log("Started scraping from url: " + sitesToTest[i]);
        scrape(sitesToTest[i], writeJSON);
    }
});