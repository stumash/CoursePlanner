/**
 * storer.js description:
 *   After scrape-course-data.r scrapes and outputs json to
 *   the files in webscraping/r/course-info-jsonfiles/, storer.js
 *   takes those jsonfiles and persists their contents to the database.
 *
 * storer.js is also written in a bad imperative accent
 */

/**
 * imports
 */
var fs = require('fs');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;

/**
 * constants
 */
const DIR = '../../r/course-info-jsonfiles/';
const jsonFilenameRegex = /_document.json/;//filter by filename

/**
 * 'static' functions
 */
const readJsonFrom

/**
 * main method
 */
var main = (function() {
    var jsonfilenames = fs.readdirSync(DIR).filter(function(filename) {
        return jsonFilenameRegex.test(filename);
    })

    jsonfilenames.forEach(function(filename) {
        console.log(filename);
    });


})();
