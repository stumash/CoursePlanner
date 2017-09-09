#!/usr/bin/env bash

# This is the build script for the CoursePlanner webapp. To run it you will need to have maven and node installed.

echo ""

# run frontend build tools
echo "building frontend... (npm)"
if $prod
then
    # build for production (no react dev tools, optimized performance)
    npmCommand="npm run build-prod"
else
    # build for development (with react dev tools, bad performance)
    npmCommand="npm run build-dev"
fi
if eval $npmCommand $verbose # run the npm command and react to exit code
then
    echo "frontend build successful"
else
    echo "frontend build failed"
    exit 1
fi

echo ""

# compile backend sources and package frontend assets
mvnCommand="mvn clean install"
if $prod
then
    mvnProfile="-P prod"
else
    mvnProfile="-P dev"
fi
echo "building backend... (maven)"
if eval $mvnCommand $mvnProfile $verbose
then
    echo "backend build successful"
else
    echo "backend build failed"
    exit 1
fi

