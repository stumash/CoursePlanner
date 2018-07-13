import React from "react";
import { DragSource } from 'react-dnd';

import { UI_STRINGS, ITEM_TYPES, SEMESTER_ITEM_CLASS_MAP, collectSource, createDragSourceSpec } from "../../util/util";


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
 *  allowClickPropagation - boolean which indicates whether the click event on the course div should not have its propagation stopped
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

    handleCourseClick(event){
        !this.props.allowClickPropagation && event.stopPropagation();
        let isElective = this.props.courseObj.isElective === "true";
        this.props.onCourseClick(isElective ? "" : this.props.courseObj.code, this.props.position);
    }

    renderCourseDiv(courseObj, extraClassNames){
        return (
            <div className={"course " + extraClassNames.join(" ")} title={courseObj.name || UI_STRINGS.ELECTIVE_COURSE_TOOLTIP} onClick={this.handleCourseClick || (() => {})}>
                <div className="courseCode">
                    { (courseObj.isElective === "true") ? (courseObj.electiveType + " Elective") : courseObj.code }
                </div>
                <div className="courseCredits">{courseObj.credits}</div>
            </div>
        );
    }

    render() {
        // TODO: find a better alternative to this; perhaps npm 'classnames'
        let extraClassNames = Object.keys(SEMESTER_ITEM_CLASS_MAP).map((key) =>
            this.props[key] ? SEMESTER_ITEM_CLASS_MAP[key] : undefined
        ).filter((element) => {
            return element !== undefined;
        });
        let courseDiv = this.renderCourseDiv(this.props.courseObj, extraClassNames);
        return this.props.isDraggable ? this.props.connectDragSource(courseDiv) : courseDiv;
    }
}

export default DragSource(ITEM_TYPES.COURSE, createDragSourceSpec(ITEM_TYPES.COURSE), collectSource)(Course);