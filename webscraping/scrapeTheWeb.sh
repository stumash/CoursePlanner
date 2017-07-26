#!/usr/bin/env bash

# This is our script for running our webscraping activites. It it to be run in a cron script.
# Example: 0 0 * * * sh /home/david/CoursePlanner/webscraping/scrapeTheWeb.sh

pushd `dirname $0` > /dev/null
webscrapedir=$(pwd)
popd > /dev/null

# Course Sequences:

# delete and remake the directory to hold scraped course sequence json files
rm -r $webscrapedir/node/course-seq/sequences; mkdir $webscrapedir/node/course-seq/sequences
cd "$webscrapedir/node/course-seq"

# Make sure any new dependencies are installed

npm install

# run scraper for course sequences
node scraper.js

# run storer for course sequences
node storer.js "${1}"

# Course Data:

# delete and remake the directory to hold scraped course-info json files
rm -r $webscrapedir/r/course-info-jsonfiles; mkdir $webscrapedir/r/course-info-jsonfiles

# run scraper for course data
cd "$webscrapedir/r"
Rscript scrape-course-data.r

# run storer for course data
cd "$webscrapedir/node/course-info"
node storer.js "${1}"