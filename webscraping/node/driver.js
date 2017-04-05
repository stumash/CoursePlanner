var shouldBeVerbose = false;
var programArgument = process.argv[2];
var coursePlannerHome = process.env.COURSE_PLANNER_HOME;
if(programArgument) {
    if (programArgument.indexOf("-v") >= 0 || programArgument.indexOf("--verbose") >= 0){
        shouldBeVerbose = true;
    }
}

if(coursePlannerHome){
    var sequenceScraper = require("./main.js");
    sequenceScraper.updateData(coursePlannerHome, shouldBeVerbose);
    //sequenceScraper.scrapeSingleUrl("https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/coop-comp-sys.html");

    // here, run tests on sequences to ensure there are no problems with the JSON
} else {
    console.error("ERROR(webscraper): COURSE_PLANNER_HOME not defined");
}
