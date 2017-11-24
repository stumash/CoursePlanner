#!/usr/bin/env bash

# This is our script for running our webscraping activites. It it to be run in a cron script.

pushd `dirname $0` > /dev/null
webscrapedir=$(pwd)
popd > /dev/null

# Course Sequences:

# delete and remake the directory to hold scraped course sequence json files
rm -r $webscrapedir/courseSequences/scrapedJson; mkdir $webscrapedir/courseSequences/scrapedJson

# Make sure any new dependencies are installed
npm install

# run scraper for course sequences
cd $webscrapedir/courseSequences/scraping
node scraper.js

# run storer for course sequences
cd $webscrapedir/courseSequences/storing
node storer.js "$@"

# Course Info:

# delete and remake the directory to hold scraped course-info json files
rm -r $webscrapedir/courseInfo/scrapedJson; mkdir $webscrapedir/courseInfo/scrapedJson;

# copy manually entered course json file into scrapedJson to be stored by storer.js
cp $webscrapedir/courseInfo/storing/manualEntry.json $webscrapedir/courseInfo/scrapedJson/manualEntry_document.json

# run scraper for course data
cd "$webscrapedir/courseInfo/scraping"
Rscript scrapeCourseInfo.r

# run storer for course data
cd "$webscrapedir/courseInfo/storing"
node storer.js "$@"
