import React from "react";
import { DragSource } from 'react-dnd';

import { ITEM_TYPES, renderCourseDiv, courseDragSource, collectSource } from "./util";

/*
 *  Box which represents one single course;  can be made draggable vis isDraggable.
 *
 *  Expects props:
 *
 *  courseObj - json object which represents the course
 *
 *  position - json object indicating the absolute position of the course within the sequence
 *                   required properties: yearIndex, season, courseListIndex
 *
 *  isDraggable - boolean which denotes whether this course item can be dragged around the page
 *
 *  onCourseClick - see MainPage.loadCourseInfo
 *  onChangeDragState - see MainPage.enableGarbage
 *
 */
class Course extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleCourseClick = this.handleCourseClick.bind(this);
    }

    handleCourseClick(){
        let isElective = this.props.courseObj.isElective === "true";
        this.props.onCourseClick(isElective ? "" : this.props.courseObj.code, this.props.position);
    }

    render() {

        let extraClassNames = [];
        if(this.props.isBeingDragged) {
            extraClassNames.push("beingDragged");
        }
        if(this.props.isDraggable){
            extraClassNames.push("grabbable");
        }
        if(this.props.isHighlighted){
            extraClassNames.push("highlighted");
        }
        if(this.props.isSelected){
            extraClassNames.push("selected");
        }

        return this.props.connectDragSource(renderCourseDiv(this.props.courseObj, extraClassNames.join(" "), this.handleCourseClick));
    }
}

export default DragSource(ITEM_TYPES.COURSE, courseDragSource, collectSource)(Course);