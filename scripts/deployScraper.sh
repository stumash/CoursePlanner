#!/usr/bin/env bash

echo "syncing up local webscraping dir with server..."

rsync -rav webscraping/* \
    --exclude=node_modules --exclude=courseInfo/scrapedJson --exclude=courseSequences/scrapedJson \
    david@conucourseplanner.online:/opt/cp-webscraping