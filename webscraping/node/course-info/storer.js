/**
 * storer.js description:
 *   take the json output of scrape-course-data.r and validate it
 *   using json-schema/ajv.  If the json passes validation, store it
 *   in the mongodb.
 */

/**
 * imports
 */
let nodemailer = require('nodemailer');
let fs = require("fs-extra");
let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let argv = require('minimist')(process.argv.slice(2));
let Ajv = require('ajv');
let ajv = new Ajv({
    "verbose": true,
    "allErrors": true
});


/**
 * constants
 */
const DIR = '../../r/course-info-json-files/';
const jsonFilenameRegex = /_document.json/;//filter by filename
const mongoServerUrl = 'mongodb://138.197.6.26:27017/';
const devDbName = "courseplannerdb-dev";
const prodDbName = "courseplannerdb";
const dbName = (argv.prod) ? prodDbName : devDbName;
const dbFullUrl = mongoServerUrl + dbName;

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
