#!/usr/bin/env bash

# This is our script for running our webscraping activites. It it to be run in a cron script.
# Example: 0 0 * * * sh /home/david/CoursePlanner/webscraping/scrapeTheWeb.sh

pushd `dirname $0` > /dev/null
webscrapedir=$(pwd)
popd > /dev/null

# run scraper for course sequences
cd "$webscrapedir/node/course-seq-scraper"
node scrapeAndValidate.js

# run scraper for course data
cd "$webscrapedir/r"
Rscript scrape-course-data.r

# run storer for course data
cd "$webscrapedir/node/course-info-storer"
node storer.js
