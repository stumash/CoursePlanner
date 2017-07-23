import React from "react";

export class SemesterBox extends React.Component {

    renderCourseList(){
        if(!this.props.semester){
            return;
        }
        let courseList = this.props.semester.courseList || [];
        let isWorkTerm = this.props.semester.isWorkTerm || "false";

        if(isWorkTerm === "false") {
            if(courseList.length > 0){
                return courseList.map((courseObj, courseIndex) => {
                    if(courseObj.length > 0){
                        return (
                            <div className="semesterItem courseOrBlock">
                                {courseObj.map((courseOrObj, courseOrIndex) =>
                                    <div className="text-center" key={courseOrIndex}>
                                        {this.getCourseText(courseOrObj)}
                                    </div>
                                )}
                            </div>
                        )
                    } else {
                        return (
                            <div className="semesterItem text-center" key={courseIndex}>
                                {this.getCourseText(courseObj)}
                            </div>
                        );
                    }
                });
            } else {
                return (
                    <div className="noCoursesIndicator text-center">No Courses</div>
                );
            }
        } else {
            return (
                <div className="workTermIndicator text-center">Work Term</div>
            );
        }
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