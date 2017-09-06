#!/usr/bin/env bash

# This is the deploy script for the CoursePlanner webapp. To run it you will need to have maven installed and have permissions to scp the war file to the remote VM.

# parse arguments and handle bad arguments
if [ $# -ge 1 ] && [ $# -le 2 ] # if there >=1 and <=2 args
then
    # parse the first argument, either a dev's name or the string "prod"
    if [ "${1}" == "prod" ]
    then
        devname=""
        prod=true
        echo "deploy chosen: production"
    else
        echo "deploy chosen: $1 development"
        devname="${1:0:1}"
        prod=false
    fi
    # parse the second argument, which must be empty or be the string "--verbose"
    if [ "${2}" == "--verbose" ]
    then
        verbose=""
    else
        if [ "${2}" == "" ] # if the --verbose argument isn't given, silence npm and maven
        then
            verbose="1> /dev/null 2>&1"
        else
            echo "optional second argument must be the string \"--verbose\""
            echo "deploy.sh failed"
            exit 1
        fi
    fi
else
    echo "deploy.sh takes one required argument: the name of the dev or \"prod\""
    echo "deploy.sh takes an optional second argument: \"--verbose\" to print npm and maven output"
    echo "deploy.sh failed"
    exit 1
fi

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
    echo "deploy.sh failed"
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
    echo "deploy.sh failed"
    exit 1
fi

echo ""

# transfer the built project onto the VM
# this will trigger Tomcat to reload the site content
deployToServerCommand="scp ./target/courseplanner.war david@138.197.6.26:/opt/tomcat/webapps/"
if $prod
then
    finalWarName="ROOT.war"
else
    finalWarName="courseplanner${devname}.war"
fi
echo "copying .war file to server..."
if eval $deployToServerCommand$finalWarName $verbose # run the deployment command and react to exit code
then
    echo "copying ${finalWarName} to server successful at: $(date)"
else
    echo "copying ${finalWarName} to server failed at: $(date)"
    echo "deploy.sh failed"
    exit 1
fi
