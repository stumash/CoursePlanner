[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[![Build Status](https://travis-ci.org/stumash/CoursePlanner.svg?branch=master)](https://travis-ci.org/stumash/CoursePlanner)

[![Waffle.io - Columns and their card count](https://badge.waffle.io/stumash/CoursePlanner.svg?columns=all)](https://waffle.io/stumash/CoursePlanner)

# ConU Course Planner
ConU Hacks Winter 2017 project.  The site is still in development but our beta version is available and kept up to date at: http://conucourseplanner.online.

### What it is

It is a website where engineering students at Concordia can plan the sequence of courses that they will take in each semester of each year of their undergraduate degree. When you first visit the page, you are asked to select your program of study, after which the default reccommended sequence for that program is loaded into a table. You can then drag and drop courses between semesters and add/remove courses from the table via a auto-complete-enabled course search box. For any course available in our database, you can view its relevant information (credits, prerequisites, etc) by clicking on it in the table or manually searching for it. Any time you make a change to your sequence, it checks that all pre-requisite & co-requisite relationships are respected. This validation also checks the sequence for other issues such as duplicate courses, fulfilling of the minimum amount of credits for the program in question, and more. Once you're happy with your sequence, you can export it into a few different formats.

### How it works

In order to obtain the list of reccommended sequences as well as the course information, we run some webscrapers once per 24h which access Concordia's public website ([sequence sample](https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/co-op-soen-general.html), [course sample](https://www.concordia.ca/academics/undergraduate/calendar/current/sec71/71-60.html)) and write the resulting data to a MongoDB database. We provide a [public API](https://github.com/stumash/CoursePlanner/wiki/ConU-Course-Planner-API) through which this data can be obtained and sequence validation & exporting can be performed. The site's frontend uses local storage to achieve persistence accross sessions on the same computer. This also means that we do not store any user-related information in our database.

### Our stack

Frontend: [React](https://reactjs.org/), [Material-UI](https://www.material-ui.com/#/), [React DnD](https://react-dnd.github.io/react-dnd/), [Browserify](http://browserify.org/)

Backend: [Apache Tomcat](http://tomcat.apache.org/), [Apache Maven](https://maven.apache.org/), [MongoDB](https://www.mongodb.com/), [Pandoc](http://pandoc.org/), [wkhtmltopdf](https://wkhtmltopdf.org/)

Webscraping: [Node.js](https://nodejs.org/en/), [R](https://www.r-project.org/), [JSON Schema](http://json-schema.org/)
