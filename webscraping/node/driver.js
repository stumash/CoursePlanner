var shouldBeVerbose = false;
var programArgument = process.argv[2];
if(programArgument === "-v" || programArgument === "--verbose") {
    shouldBeVerbose = true;
}

var sequenceScraper = require("./main.js");
sequenceScraper.updateData(shouldBeVerbose);

// here, run tests on sequences to ensure there are no problems with the JSON