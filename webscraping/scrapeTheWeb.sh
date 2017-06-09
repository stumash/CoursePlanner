#!/usr/bin/env bash
webscrapedir=$(pwd)

# run scraper for course sequences
cd /home/david/CoursePlanner/webscraping/node/course-seq-scraper
node scrapeAndValidate.js

cd $webscrapedir
# run scraper for course data
Rscript r/scrape-course-data.r
