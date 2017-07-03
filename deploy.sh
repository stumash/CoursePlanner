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

# tell the user what's going on
echo "Building & deploying project..."

# get ID of current commit
commitHash=$(git rev-parse HEAD) &&
commitAuthor=$(git --no-pager show -s --format='%an <%ae>' HEAD) &&
# add a comment to the html that indicates the current commit
sed -i "4i\<!--This site was built against the source of the following commit: $commitHash ($commitAuthor) -->" ./src/main/webapp/index.html &&
sed -i "4i\<!--This site was built against the source of the following commit: $commitHash ($commitAuthor) -->" ./src/main/webapp/sequenceBuilder.html &&
gitTagInserted=true

# build project
mvn clean install -q &&
mvnCleanInstallSuccessful=true

if $gitTagInserted
then # remove git tag
    # we do not want our deploy script to change our source files,
    # only the deployed version of them
    sed -i "4d" ./src/main/webapp/index.html &&
    sed -i "4d" ./src/main/webapp/sequenceBuilder.html
fi

if ! $mvnCleanInstallSuccessful
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

