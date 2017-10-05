# Some notes regarded the courses that are missing in our DB

[
  "ENGR 418", - addressed
  "FFAR 250", - addressed
  "CART 255", - addressed
  "CART 214", - addressed
  "COMP 393", - addressed
  "COMM 225", - addressed
  "CART 211", - addressed
  "COMM 222", - addressed
  "ELEC 415", - addressed
  "CART 212", - addressed
  "CART 411", - addressed
  "ACCO 220", - addressed
  "COMM 223", - addressed
  "BLDG 471", - addressed
  "ELEC 416", - addressed
  "CART 351", - addressed
  "CART 412", - addressed
  "COMM 210", - addressed
  "COMM 308", - addressed
  "MAST 224", - addressed
  "ENGR 417", - addressed 
  "COEN 451", - addressed
  "MECH 490", - addressed
  "MECH 480", - addressed
  "MECH 482" - addressed
]

## To view the most recent list of missing courses, run the file `webscraping/courseSequences/storing/missingCourses.js`

For all the courses that I found were missing, I either added it to `manualEntry.json` or wrote some notes about it below.

### ENGR 418

found the following info from this page: https://www.concordia.ca/content/dam/encs/docs/curriculum-letters/ELEC2014-2015.pdf

ENGR 418 Integration of Avionics Systems; has been renamed AERO 483
Integration of Avionics Systems

Note that AERO 483 is indeed contained in our DB. Lord knows why they haven't updated the course sequence to account for this change.
 
How can we deal with this problem?

### COMP 393

This course is listed ONLY in [Computer Science, Computer Games option, September entry](https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-comp-games.html), and has the exact same description as the course ENCS 393.
In other words, they made a mistake on the course sequence page and put COMP instead of ENCS lol. Idk how to fix this problem, but the fix would be the same as for ENGR 418.

### ELEC 415

This course has the same name as AERO 480 (Flight Control Systems).. Looks like the course was renamed just like ENGR 418

### ELEC 416

This course has the same name as AERO 482 (Avionic Navigation Systems).. Looks like the course was renamed just like ENGR 418

### MAST 224

This course has the same name as MAST 324 (Introduction to Optimization ).. Looks like the course was renamed just like ENGR 418
I found hard proof for this one. These [two](https://www.concordia.ca/content/dam/artsci/math-stats/docs/Outlines%202014-2015/MAST224_4_14.pdf) [links](https://www.concordia.ca/content/dam/artsci/math-stats/docs/Outlines%202015-2016/MAST324_4_15.pdf) are virtually identical.

### ENGR 417

This course has the same name as ENGR 6421 (Avionic Navigation Systems).. It was changed to be a graduate class and should be entirely removed.

### MECH 480 AND MECH 482

These courses have the same names as AERO 480 and AERO 482 respectively (Flight Control Systems or Avionic Navigation Systems).. Looks like they were renamed just like ENGR 418
I for proof for this one also: compare these [two](https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soen-real-time.html) [links](https://www.concordia.ca/encs/computer-science-software-engineering/students/course-sequences/sept-soen-real-time.html) for year 4 - fall




