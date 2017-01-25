#!/usr/bin/env bash

mvn clean install &&

scp target/courseplanner.war david@138.197.6.26:/opt/tomcat/webapps/courseplanner.war