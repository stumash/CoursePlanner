rsync -rav webscraping/* \
    --exclude=node_modules --exclude=courseInfo/scrapedJson --exclude=courseSequences/scrapedJson \
    david@138.197.6.26:/opt/cp-webscraping
