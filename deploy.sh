#!/usr/bin/env bash

mvn clean install &&

scp target/courseplanner david@138.197.6.26:/opt/tomcat/webapps/courseplanner
