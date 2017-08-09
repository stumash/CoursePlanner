import React from "react";
import {UI_STRINGS} from "./util";

/*
 *  Box which represents one single semester;  Contains a list of (draggable) course boxes.
 *
 *  Expects props:
 *
 *  semester - json object which represents the semester we're rendering; contains array courseList and string isWorkTerm
 *
 *  yearIndex - number which represents the index of the year during which the semester in question occurs
 *
 *  season - string which represents the season during which the semester in question occurs
 *
 *  onSelectCourse - see MainPage.loadCourseInfo
 *  onOrListSelection - see MainPage.setOrListCourseSelected
 *  onToggleWorkTerm - see MainPage.toggleWorkTerm
 *
 */
export class SemesterBox extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleCourseSelection = this.handleCourseSelection.bind(this);
        this.handleOrListSelection = this.handleOrListSelection.bind(this);
        this.handleWorkTermToggle = this.handleWorkTermToggle.bind(this);
    }

    handleCourseSelection(event){
        this.props.onSelectCourse($(event.currentTarget).find(".courseCode").text());
    }

    handleOrListSelection(coursePosition){
        this.props.onOrListSelection(coursePosition);
    }

    handleWorkTermToggle(){
        this.props.onToggleWorkTerm(this.props.yearIndex, this.props.season);
    }

    renderCourseList(){

        let courseList = this.props.semester.courseList || [];

        if(courseList.length === 0) {
            return <div className="noCoursesIndicator text-center">{UI_STRINGS.NO_COURSES}</div>;
        }

        return courseList.map((courseObj, courseIndex) => {
            if(courseObj.length > 0){
                return this.renderOrList(courseObj, courseIndex);
            } else {
                return (
                    <div className="semesterItem" key={courseIndex}>
                        {this.renderCourse(courseObj, this.handleCourseSelection)}
                    </div>
                );
            }
        });
    }

    renderOrList(orList, courseListIndex){
        return (
            <div className="semesterItem courseChoiceItem input-group" key={courseListIndex}>
                <div className="input-group-btn">
                    <button className="btn btn-default dropdown-toggle" title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP} type="button"  data-toggle="dropdown">
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {orList.map((courseObj, courseIndex) =>
                            <li key={courseIndex}>
                                {this.renderCourse(courseObj, () => {
                                    this.handleOrListSelection({
                                        "yearIndex" : this.props.yearIndex,
                                        "season" : this.props.season,
                                        "courseListIndex": courseListIndex,
                                        "orListIndex": courseIndex
                                    });
                                })}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="input-group-addon">
                    {this.renderSelectedOrCourse(orList)}
                </div>
            </div>
        );
    }

    renderSelectedOrCourse(orList){

        let selectedCourse = undefined;

        orList.forEach((courseObj, orListIndex) => {
            if(courseObj.isSelected){
                selectedCourse = courseObj;
            }
        });

        return (selectedCourse) ? this.renderCourse(selectedCourse, this.handleCourseSelection) :
                                  <div title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP}>{UI_STRINGS.LIST_NONE_SELECTED}</div>;
    }

    renderCourse(courseObj, clickHandler){
        return (
            <div className="course" title={courseObj.name} onClick={clickHandler}>
                <div className="courseCode">
                    { (courseObj.isElective === "false") ? courseObj.code : (courseObj.electiveType + " Elective") }
                </div>
                <div className="courseCredits">
                    { (courseObj.isElective === "false") ? courseObj.credits : "3" }
                </div>
            </div>
        );
    }

    renderCheckBox(){
        return <input type="checkbox"
                      title={UI_STRINGS.IS_WORK_TERM}
                      value="isWorkTerm"
                      onChange={this.handleWorkTermToggle}
                      defaultChecked={(this.props.semester.isWorkTerm === "true")}/>;

    }

    render() {
        return (
            <div className="semesterBox">
                <div className="row">
                    <div className="isWorkTerm col-xs-12">
                        {this.renderCheckBox()}
                    </div>
                    <div className="courseList col-xs-10 col-xs-offset-1">
                        {this.renderCourseList()}
                    </div>
                </div>
            </div>
        );
    }
}