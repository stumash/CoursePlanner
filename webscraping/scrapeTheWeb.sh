#!/usr/bin/env bash

# This is our script for running our webscraping activites. It it to be run in a cron script.
# Example: 0 0 * * * sh /home/david/CoursePlanner/webscraping/scrapeTheWeb.sh

pushd `dirname $0` > /dev/null
webscrapedir=$(pwd)
popd > /dev/null

# Course Sequences:

# delete and remake the directory to hold scraped course sequence json files
rm -r $webscrapedir/course-seq/scraped-json; mkdir $webscrapedir/course-seq/scraped-json

# Make sure any new dependencies are installed
npm install

# run scraper for course sequences
cd $webscrapedir/course-seq/scraping
node scraper.js

# run storer for course sequences
cd $webscrapedir/course-seq/storing
node storer.js "${1}"

# Course Info:

# delete and remake the directory to hold scraped course-info json files
rm -r $webscrapedir/course-info/scraped-json; mkdir $webscrapedir/course-info/scraped-json

# run scraper for course data
cd "$webscrapedir/course-info/scraping"
Rscript scrape-course-info.r

# run storer for course data
cd "$webscrapedir/course-info/storing"
node storer.js "${1}"
