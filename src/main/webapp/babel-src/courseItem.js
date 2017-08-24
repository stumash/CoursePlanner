import React from "react";
import { DragSource } from 'react-dnd';
import { ITEM_TYPES } from "./util";

/*
 *  Box which represents one single course;  can be made draggable vis isDraggable.
 *  May be located in an orList (see SemesterBox.renderOrList)
 *
 *  Expects props:
 *
 *  courseObj - json object which represents the course
 *
 *  coursePosition - json object indicating the absolute position of the course within the sequence
 *                   required properties: yearIndex, season, courseListIndex
 *                   optional properties: orListIndex
 *
 *  isDraggable - boolean which denotes whether this course item can be dragged around the page
 *
 *  onCourseClick - see MainPage.loadCourseInfo/MainPage.setOrListCourseSelected
 *
 */
class CourseItem extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleCourseClick = this.handleCourseClick.bind(this);
    }

    handleCourseClick(){
        this.props.onCourseClick(this.props.coursePosition);
    }

    render() {

        let extraClassNames = " ";
        if(this.props.isBeingDragged) {
            extraClassNames += "beingDragged ";
        }
        if(this.props.isDraggable){
            extraClassNames += "grabbable ";
        }

        let courseObj = this.props.courseObj;

        return this.props.connectDragSource(
            <div className={"course" + extraClassNames} title={courseObj.name} onClick={this.handleCourseClick}>
                <div className="courseCode">
                    { (courseObj.isElective === "false") ? courseObj.code : (courseObj.electiveType + " Elective") }
                </div>
                <div className="courseCredits">
                    { (courseObj.isElective === "false") ? courseObj.credits : "3" }
                </div>
            </div>
        );
    }
}

/*
 * Below lies react-dnd-specific code & configs used to turn CourseItem into a drag source
 */

let courseSource = {
    beginDrag(props, monitor, component) {
        return {
            "coursePosition": props.coursePosition
        };
    },
    endDrag(props, monitor, component){
    },
    canDrag(props, monitor){
        return props.isDraggable;
    }
};

function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isBeingDragged: monitor.isDragging()
    };
}

export default DragSource(ITEM_TYPES.COURSE, courseSource, collectSource)(CourseItem);