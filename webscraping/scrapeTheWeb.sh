#!/usr/bin/env bash

pushd `dirname $0` > /dev/null
webscrapedir=$(pwd)
popd > /dev/null

# run scraper for course sequences
cd "$webscrapedir/node/course-seq-scraper"
node scrapeAndValidate.js

# run scraper for course data
cd "$webscrapedir/r"
Rscript scrape-course-data.r
cd "$webscrapedir/node/course-info-storer"
node storer.js
