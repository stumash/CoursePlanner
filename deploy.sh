#!/usr/bin/env bash

# This is the deploy script for the CoursePlanner webapp. To run it you will need to have maven installed and have permissions to scp the war file to the remote VM.

if [ $# -gt 0 ] # need one arg
then 
    if [ "${1}" == "prod" ]
    then
        devname=""
    else
        devname="${1:0:1}"
    fi
else
    echo "deploy.sh takes one arg, the name of the dev, for deploying dev-specific .war files." 1>&2
    exit 1
fi

# run frontend build tools
echo "Building frontend..." &&
if [ "${2}" == "x" ]
then
    # build for production (no react dev tools, optimized performance)
    npm run build-prod
else
    # build for development (with react dev tools, bad performance)
    npm run build-dev
fi &&

# compile backend sources and package frontend assets
echo "Building backend..." &&
mvn clean install -q &&
projectBuildSuccessful=true

if ! $projectBuildSuccessful
then
    echo "Project build failed" 1>&2
    exit 1
fi
echo "Project build complete. Transferring war file to VM"

# transfer the built project onto the VM
# this will trigger Tomcat to reload the site content
scp "target/courseplanner.war" david@138.197.6.26:/opt/tomcat/webapps/"courseplanner${devname}.war" &&
deploymentSuccessful=true

# if ends with error code 0 (success) then print deployment complete, else deployment failed
if $deploymentSuccessful
then
    echo -e "\nDeployed courseplanner${devname}.war successfully at: $(date)"
else
    echo -e "\nFailed to scp courseplanner${devname}.war at: $(date)"
    exit 1
fi

