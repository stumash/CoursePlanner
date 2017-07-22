import React from "react";

const DUMMY_COURSES = ["COMP 248", "COMP 249", "COMP 352", "COMP 348"];

export class SemesterBox extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div className={"semesterBox"}>
                <div className="row">
                    <div className="semesterList col-xs-10 col-xs-offset-1">
                        {DUMMY_COURSES.map((course) =>
                            <div className="semesterItem text-center" key={course}>
                                {course + ", 3.0"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}