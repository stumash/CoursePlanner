#!/usr/bin/env bash

cd /home/david/CoursePlanner/webscraping/node/
COURSE_PLANNER_HOME="/opt/tomcat/webapps/courses" node driver.js -v

chown tomcat /opt/tomcat/webapps/courses/sequences/
chgrp tomcat /opt/tomcat/webapps/courses/sequences/
