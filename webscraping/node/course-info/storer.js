/**
 * storer.js description:
 *   After scrape-course-data.r scrapes and outputs json to
 *   the files in webscraping/r/course-info-jsonfiles/, storer.js
 *   takes those jsonfiles and pushes their contents to the database.
 *
 * stumash.js also speaks to people in a bad imperative accent
 */

/**
 * imports
 */
let fs = require('fs');
let assert = require('assert');
let MongoClient = require('mongodb').MongoClient;
let argv = require('minimist')(process.argv.slice(2));

/**
 * constants
 */
const DIR = '../../r/course-info-jsonfiles/';
const jsonFilenameRegex = /_document.json/;//filter by filename
let mongoServerUrl = 'mongodb://138.197.6.26:27017/';
let devDbName = "courseplannerdb-dev";
let prodDbName = "courseplannerdb";
let dbName = (argv.prod) ? prodDbName : devDbName;
let dbFullUrl = mongoServerUrl + dbName;

/**
 * main method
 */
let storeAllCourses = (function() {

    console.log("Storing course data in database...");

    MongoClient.connect(dbFullUrl, function(err, db) {
        assert.equal(null, err);
        console.log("Connected successfully to db server");

        let filesPushed = 0, totalFiles = 0;

        // read all files in Rscript output folder and push to DB
        fs.readdir(DIR, function (err, files) {
            let allDocuments = files.filter(function(filename){
                return jsonFilenameRegex.test(filename);
            });
            allDocuments.forEach(function (file) {
                totalFiles++;
                fs.readFile(DIR + file, "utf-8", function (err, fileContent) {
                    let courseJSON = JSON.parse(fileContent);
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
