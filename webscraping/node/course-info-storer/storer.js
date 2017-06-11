/**
 * storer.js description:
 *   After scrape-course-data.r scrapes and outputs json to
 *   the files in webscraping/r/course-info-jsonfiles/, storer.js
 *   takes those jsonfiles and persists their contents to the database.
 *
 * storer.js is also written in a bad imperative accent
 */

var fs = require('fs');

const jsonFilesDir = '../../r/course-info-jsonfiles/';
const jsonFilenameRegex = /_document.json/;

var peristCourseToDb = function(courseJson) {

};

var main = (function() {
    var jsonfiles = fs.readdirSync(jsonFilesDir).filter(function(filename) {
        return jsonFilenameRegex.test(filename);
    })

    jsonfiles.forEach(function(file) {
        console.log(file);
    });
    console.log();

    //TODO: for each json file, parse and store
})();
