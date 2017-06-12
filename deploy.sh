#!/usr/bin/env bash

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

# if an argument is given, assign the first one to the string $1
if [ $# -gt 0 ]; then devname="${1}"; fi

# transfer the built project onto the VM
# this will trigger Tomcat to reload the site content
scp "target/courseplanner${devname}.war" david@138.197.6.26:/opt/tomcat/webapps/"courseplanner${devname}.war" &&
deploymentSuccessful=true

# if ends with error code 0 (success) then print deployment complete, else deployment failed
if $deploymentSuccessful
then
    echo -e "\nDeployment completed at: $(date)"
else
    echo -e "\nDeployment failed at: $(date)" 1>&2
    exit 1
fi

