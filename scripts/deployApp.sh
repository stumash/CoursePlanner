#!/usr/bin/env bash

# This is the deploy script for the CoursePlanner webapp. To run it you will need to have permissions to scp the war file to the remote VM.

echo ""

# transfer the built project onto the VM
# this will trigger Tomcat to reload the site content
deployToServerCommand="scp ./backend/target/courseplanner.war david@conucourseplanner.online:/opt/tomcat/webapps/"
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
    exit 1
fi
