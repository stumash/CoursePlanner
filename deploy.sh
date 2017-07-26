#!/usr/bin/env bash

# This is the deploy script for the CoursePlanner webapp. To run it you will need to have maven installed and have permissions to scp the war file to the remote VM.

# parse arguments and handle bad arguments
if [ "$#" == "1" ]
then 
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
else
    echo "deploy.sh failed"
    echo "deploy.sh takes one argument: the name of the dev or \"prod\""
    exit 1
fi

echo ""

# run frontend build tools
echo "building frontend..."
if $prod
then
    # build for production (no react dev tools, optimized performance)
    npmCommand="npm run build-prod"
else
    # build for development (with react dev tools, bad performance)
    npmCommand="npm run build-dev"
fi
if $npmCommand # run the npm command and react to exit code
then
    echo "frontend build successful"
else
    echo "frontend build failed"
    exit 1
fi

echo ""

# compile backend sources and package frontend assets
echo "building backend..."
if mvn clean install
then
    echo "backend build succssful. Transferring war file to VM"
else
    echo "backend build failed"
    exit 1
fi

echo ""

# transfer the built project onto the VM
# this will trigger Tomcat to reload the site content
deployToServerCommand="scp ./target/courseplanner.war david@138.197.6.26:/opt/tomcat/webapps/courseplanner${devname}.war"
echo "copying .war file to server..."
if $deployToServerCommand # run the deployment command and react to exit code
then
    echo "copying courseplanner${devname}.war to server successful at: $(date)"
else
    echo "copying courseplanner${devname}.war to server failed at: $(date)"
    exit 1
fi

