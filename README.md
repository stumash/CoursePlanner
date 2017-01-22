## Drag and Drop Course Planner Functionality
#### Frontend
* When you click on a course, it gives you scheduling and other information about the course.
* When you drag and drop a class to another semester, it will
    * Snap course to end of courses in that semester
    * updates all relevant information on the page (how many courses/credits in that semester...)
    * Sends the new state of the schedule to the server
#### Backend
* Uses the received schedule state to validate the schedule
* Sends the client any schedule errors it detects such as
    * Prereq conflicts
    * Course in invalid semester (fall/winter)
    * Too many/too few credits in a semester

