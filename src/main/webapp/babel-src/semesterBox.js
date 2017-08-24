import React from "react";
import { UI_STRINGS, ITEM_TYPES } from "./util";
import CourseItem from "./courseItem";
import { DropTarget } from 'react-dnd';

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
 *  onMoveCourse - see MainPage.moveCourse
 *  onAddCourse - see MainPage.addCourse
 *  onChangeDragState - see MainPage.enableGarbage
 *
 */
class SemesterBox extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleWorkTermToggle = this.handleWorkTermToggle.bind(this);
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
                let coursePosition = {
                    "yearIndex": this.props.yearIndex,
                    "season": this.props.season,
                    "courseListIndex": courseIndex,
                };
                return (
                    <CourseItem courseObj={courseObj}
                                coursePosition={coursePosition}
                                isDraggable={true}
                                onMoveCourse={this.props.onMoveCourse}
                                onCourseClick={this.props.onSelectCourse}
                                onChangeDragState={this.props.onChangeDragState}
                                key={courseObj.id}/>
                );
            }
        });
    }

    renderOrList(orList, courseListIndex){
        return (
            <div className="courseChoiceItem input-group" key={orList.map(courseObj => courseObj.id).join()}>
                <div className="input-group-btn">
                    <button className="btn btn-default dropdown-toggle" title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP} type="button"  data-toggle="dropdown">
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {orList.map((courseObj, courseIndex) =>
                            <li key={courseObj.id}>
                                <CourseItem courseObj={courseObj}
                                            coursePosition={{
                                                "yearIndex": this.props.yearIndex,
                                                "season": this.props.season,
                                                "courseListIndex": courseListIndex,
                                                "orListIndex": courseIndex
                                            }}
                                            isDraggable={false}
                                            onOrCourseClick={this.props.onOrListSelection}/>
                            </li>
                        )}
                    </ul>
                </div>
                <div className="input-group-addon">
                    {this.renderSelectedOrCourse(orList, courseListIndex)}
                </div>
            </div>
        );
    }

    renderSelectedOrCourse(orList, courseListIndex){

        let selectedCourse = undefined;
        let selectedIndex = -1;

        orList.forEach((courseObj, orListIndex) => {
            if(courseObj.isSelected){
                selectedCourse = courseObj;
                selectedIndex = orListIndex;
            }
        });

        let coursePosition = {
            "yearIndex": this.props.yearIndex,
            "season": this.props.season,
            "courseListIndex": courseListIndex,
            "orListIndex": selectedIndex
        };

        return (!selectedCourse) ? <div title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP}>{UI_STRINGS.LIST_NONE_SELECTED}</div> :
                                   <CourseItem courseObj={selectedCourse}
                                               coursePosition={coursePosition}
                                               isDraggable={false}
                                               onCourseClick={this.props.onSelectCourse}/>;
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
        return this.props.connectDropTarget(
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

/*
 * Below lies react-dnd-specific code & configs used to turn SemesterBox into a drag target
 */

let semesterTarget = {
    hover(props, monitor, component) {
    },
    canDrop(props, monitor){

        let semesterContainsCourse = false;

        for(let i = 0; i < props.semester.courseList.length; i++){
            let tCourse = props.semester.courseList[i];
            if(tCourse.code && tCourse.code === monitor.getItem().courseObj.code){
                semesterContainsCourse = true;
            }
        }

        return !semesterContainsCourse;
    },
    drop(props, monitor, component){

        let draggedCourse = monitor.getItem();

        let newCoursePosition = {
            "yearIndex": props.yearIndex,
            "season": props.season,
            "courseListIndex": 0
        };

        if(draggedCourse.coursePosition) {

            if(draggedCourse.coursePosition.season === props.season && draggedCourse.coursePosition.yearIndex === props.yearIndex){
                return;
            }

            // we dropped an existing course into a new semester, move the course into it.
            props.onMoveCourse(draggedCourse.coursePosition, newCoursePosition);

        } else {
            // no course position means the course was dragged from the IOPanel
            props.onAddCourse(draggedCourse.courseObj, newCoursePosition);
        }
    }
};


function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

export default DropTarget(ITEM_TYPES.COURSE, semesterTarget, collectTarget)(SemesterBox);