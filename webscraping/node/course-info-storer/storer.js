/**
 * storer.js description:
 *   After scrape-course-data.r scrapes and outputs json to
 *   the files in webscraping/r/course-info-jsonfiles/, storer.js
 *   takes those jsonfiles and pushes their contents to the database.
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
const mongoServerUrl = 'mongodb://138.197.6.26:27017/courseplannerdb';

/**
 * main method
 */
var main = (function() {

    console.log("Storing course data in database...");

    MongoClient.connect(mongoServerUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to db server");

        var filesPushed = 0, totalFiles = 0;

        // read all files in Rscript output folder and push to DB
        fs.readdir(DIR, function (err, files) {
            var allDocuments = files.filter(function(filename){
                return jsonFilenameRegex.test(filename);
            });
            allDocuments.forEach(function (file) {
                totalFiles++;
                fs.readFile(DIR + file, "utf-8", function (err, fileContent) {
                    var courseJSON = JSON.parse(fileContent);
                    if (err) {
                        throw err;
                    }
                    console.log("Writing contents of file: " + file + " to db.");
                    courseJSON.forEach(function(course){
                        // write the json to the db
                        db.collection("courseData").update({_id : course.code}, {$set:course}, {upsert: true}, function(err, result) {
                            assert.equal(err, null);
                            filesPushed++;
                            if(filesPushed == totalFiles){
                                db.close();
                            }
                        });
                    });
                });
            });
        });
    });
})();
