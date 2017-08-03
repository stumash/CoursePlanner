import React from "react";

/*
 *  Box which represents one single semester;  Contains a list of (draggable) course boxes.
 *
 *  Expects props:
 *
 *  semester - json object which represents a single semester; contains array courseList and string isWorkTerm
 *
 *  onSelectCourse(courseCode) - function to call in the event that the user selects a course such as by clicking on it
 *      param courseCode - the code of the chosen course
 *
 */
export class SemesterBox extends React.Component {

    constructor(props){
        super(props);
        this.handleCourseSelection = this.handleCourseSelection.bind(this);
    }

    handleCourseSelection(event){
        this.props.onSelectCourse(event.target.innerHTML.substring(0,8));
    }

    renderCourseList(){

        let courseList = this.props.semester.courseList || [];
        let isWorkTerm = this.props.semester.isWorkTerm || "false";

        if(isWorkTerm !== "false") {
            return <div className="workTermIndicator text-center">Work Term</div>;
        }

        if(courseList.length === 0) {
            return <div className="noCoursesIndicator text-center">No Courses</div>;
        }

        return courseList.map((courseObj, courseIndex) => {
            if(courseObj.length > 0){
                return (
                    <div className="semesterItem courseOrBlock" key={courseIndex}>
                        {courseObj.map((courseOrObj, courseOrIndex) =>
                            <div className="text-center" title={courseObj.name} onClick={this.handleCourseSelection} key={courseOrIndex}>
                                {this.getCourseText(courseOrObj)}
                            </div>
                        )}
                    </div>
                )
            } else {
                return (
                    <div className="semesterItem text-center" title={courseObj.name} onClick={this.handleCourseSelection} key={courseIndex}>
                        {this.getCourseText(courseObj)}
                    </div>
                );
            }
        });
    }

    getCourseText(courseObj){
        if(courseObj.isElective === "false"){
            return courseObj.code + ", " + courseObj.credits;
        } else {
            return courseObj.electiveType + " Elective";
        }
    }

    render() {
        return (
            <div className={"semesterBox"}>
                <div className="row">
                    <div className="courseList col-xs-10 col-xs-offset-1">
                        {this.renderCourseList()}
                    </div>
                </div>
            </div>
        );
    }
}