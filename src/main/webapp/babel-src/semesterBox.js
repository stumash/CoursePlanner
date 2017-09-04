import React from "react";
import { UI_STRINGS, ITEM_TYPES, renderCourseDiv } from "./util";
import Course from "./course";
import OrList from "./orList";
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
            let position = {
                "yearIndex": this.props.yearIndex,
                "season": this.props.season,
                "courseListIndex": courseIndex
            };
            if(courseObj.length > 0){
                let courseList = courseObj;
                return (
                    <OrList courseList={courseList}
                            position={position}
                            isDraggable={true}
                            onOrListSelection={this.props.onOrListSelection}
                            onCourseClick={this.props.onSelectCourse}
                            onChangeDragState={this.props.onChangeDragState}
                            key={courseList.map(courseObj => courseObj.id).join()}/>
                );
                return this.renderOrList(courseObj, courseIndex);
            } else {
                return (
                    <Course courseObj={courseObj}
                                position={position}
                                isDraggable={true}
                                onCourseClick={this.props.onSelectCourse}
                                onChangeDragState={this.props.onChangeDragState}
                                key={courseObj.id}/>
                );
            }
        });
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

        if(monitor.getItem().position && monitor.getItem().position.season === props.season && monitor.getItem().position.yearIndex === props.yearIndex){
            return false;
        }

        let canDrop = true;

        if (monitor.getItemType() === ITEM_TYPES.COURSE) {

            for(let i = 0; i < props.semester.courseList.length; i++){
                let tCourse = props.semester.courseList[i];
                if(tCourse.code && tCourse.code === monitor.getItem().courseObj.code){
                    canDrop = false;
                }
            }

        }

        return canDrop;
    },
    drop(props, monitor, component){

        let draggedItem = monitor.getItem();

        let newPosition = {
            "yearIndex": props.yearIndex,
            "season": props.season,
            "courseListIndex": 0
        };

        // no course position means the course was dragged from the IOPanel
        if(!draggedItem.position){
            props.onAddCourse(draggedItem.courseObj, newPosition);
        } else {
            props.onMoveCourse(draggedItem.position, newPosition);
        }
    }
};


function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

export default DropTarget([ITEM_TYPES.COURSE, ITEM_TYPES.OR_LIST], semesterTarget, collectTarget)(SemesterBox);