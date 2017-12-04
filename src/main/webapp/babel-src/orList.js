import React from "react";
import { DragSource } from 'react-dnd';
import { UI_STRINGS, ITEM_TYPES, renderOrListDiv, orListDragSource, collectSource } from "./util";

/*
 *  Box which represents a list of courses where one may be selected;  can be made draggable vis isDraggable.
 *  Contains a drop-down menu with the list of options with the selected option next to it
 *
 *  Expects props:
 *
 *  courseList - json array which represents the courses which may be chosen
 *
 *  position - json object indicating the absolute position of the orList within the sequence
 *                   required properties: yearIndex, season, courseListIndex
 *
 *  isDraggable - boolean which denotes whether this course item can be dragged around the page
 *
 *  onCourseClick - see MainPage.loadCourseInfo
 *  onChangeDragState - see MainPage.enableGarbage
 *  onOrListSelection - see MainPage.setOrListCourseSelected
 *
 */

class OrList extends React.Component {

    constructor(props){
        super(props);
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

        let courseList = this.props.courseList;
        let position = this.props.position;

        return this.props.connectDragSource(renderOrListDiv(courseList, extraClassNames.join(" "), position, this.props.onCourseClick, this.props.onOrListSelection));
    }
}

export default DragSource(ITEM_TYPES.OR_LIST, orListDragSource, collectSource)(OrList);