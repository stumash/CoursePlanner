var remove = require("remove");
var sequenceScraper = require("./main.js");

// scrape data
sequenceScraper.updateData("./", false, function(){

    // validate the data inside ./sequences
    

    // clean up
    try {
        remove.removeSync("./sequences");
        console.log("cleaned up sequences dir");
    } catch (err) {
        console.error(err);
    }
});