#!/usr/bin/env bash

# tell the user what's going on
echo "Building & deploying project..." &&

# get ID of current commit
commitHash=$(git rev-parse HEAD) &&
commitAuthor=$(git --no-pager show -s --format='%an <%ae>' HEAD) &&

# add a comment to the html that indicates the current commit
sed -i "4i\<!--This site was built against the source of the following commit: $commitHash ($commitAuthor) -->" ./src/main/webapp/index.html &&
sed -i "4i\<!--This site was built against the source of the following commit: $commitHash ($commitAuthor) -->" ./src/main/webapp/sequenceBuilder.html &&

# build project
mvn clean install -q &&

# remove commit logging script from html
# we do not want our deploy script to change our source files
sed -i "4d" ./src/main/webapp/index.html &&
sed -i "4d" ./src/main/webapp/sequenceBuilder.html &&

echo "Project build complete. Transferring war file to VM" &&

# transfer the built project onto the VM
# this will trigger Tomcat to reload the site content
scp target/courseplanner.war david@138.197.6.26:/opt/tomcat/webapps/courseplanner.war

# if ends with error code 0 (success) then print deployment complete, else deployment failed
if [ "$?" = "0" ];
then
	echo -e "\nDeployment completed at: $(date)"
else
	echo -e "\nDeployment failed at: $(date)" 1>&2
	exit 1
fi
