'use strict';

let MongoClient = require('mongodb').MongoClient;
let assert = require('assert');
let argv = require('minimist')(process.argv.slice(2));

let mongoServerUrl = 'mongodb://138.197.6.26:27017/';
let devDbName = "courseplannerdb-dev";
let prodDbName = "courseplannerdb";
let courseSequencesColName = "courseSequences";
let courseInfoColName = "courseData";
let dbName = (argv.prod) ? prodDbName : devDbName;
let dbFullUrl = mongoServerUrl + dbName;

let displayMissingCourses = (() => {
    MongoClient.connect(dbFullUrl, (err, db) => {
        assert.equal(null, err);
        db.collection(courseSequencesColName).find({}).toArray((err, sequences) => {
            assert.equal(err, null);
            findMissingCoursesFromSequences(sequences, db, (missingCourses) => {
                if(missingCourses.length > 0){
                    console.log("The following courses are listed in at least one recommended sequence but are not present in the course info DB");
                    console.log(JSON.stringify(missingCourses, undefined, 2));
                } else {
                    console.log("There are no courses that are listed in at least one recommended sequence but are not present in the course info DB");
                }
                db.close();
            });
        });
    });
})();

function findMissingCoursesFromSequences(sequences, db, onComplete){

    // build Set of all courses
    let courses = [];
    sequences.forEach((sequence) => {
        courses = courses.concat(getAllCoursesFromSequence(sequence));
    });
    let courseSet = new Set(courses);

    // check that each course is in the course info DB
    let missingCourses = [], numStarted = 0, numCompleted = 0;
    let courseInfo = db.collection(courseInfoColName);
    courseSet.forEach((course) => {
        numStarted++;
        courseInfo.find({"_id": course}).toArray((err, coursesRes) => {
            assert.equal(err, null);
            numCompleted++;
            if(coursesRes.length === 0 ){
                missingCourses.push(course);
            }
            if(numStarted == numCompleted && onComplete){
                onComplete(missingCourses);
            }
        });
    });

}

function getAllCoursesFromSequence(sequence){
    let courses = [];
    let SEASON_NAMES = ["fall", "winter", "summer"];
    // iterate though entire yearList and push all courses to array
    sequence.yearList.forEach((year) => {
        SEASON_NAMES.forEach((season) => {
            year[season].courseList.forEach((courseItem) => {
                if(courseItem.length > 0){
                    courseItem.forEach((course) => {
                        course.code && courses.push(course.code);
                    });
                } else {
                    courseItem.code && courses.push(courseItem.code);
                }
            });
        });
    });
    return courses;
}



