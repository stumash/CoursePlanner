import React from "react";
import { DragSource } from 'react-dnd';
import { DropdownButton, MenuItem } from "react-bootstrap";

import Course from "./course";
import { UI_STRINGS, ITEM_TYPES, SEMESTER_ITEM_CLASS_MAP, collectSource, createDragSourceSpec } from "../../util/util";


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

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleSelectedCourseClick = this.handleSelectedCourseClick.bind(this)
    }

    handleSelectedCourseClick(selectedCourseObj){
        this.props.onCourseClick(selectedCourseObj, this.props.position);
    }

    /*
     *  Render a div which represents an orList of courses.
     *      extraClassNames: array which contains class names
     */
    renderOrListDiv(courseList, extraClassNames, position){
        return (
            <div className={"orList input-group " + extraClassNames.join(" ")}>
                <DropdownButton title=""
                                id="dropdown-basic">
                    {courseList.map((courseObj, courseIndex) =>
                        <MenuItem key={courseObj.id}>
                            <Course courseObj={courseObj}
                                    position={position}
                                    allowClickPropagation={true}
                                    onCourseClick={() => {
                                        this.props.onOrListSelection({
                                            "yearIndex": position.yearIndex,
                                            "season": position.season,
                                            "courseIndex": position.courseIndex,
                                            "orListIndex": courseIndex
                                        });
                                    }}/>
                        </MenuItem>
                    )}
                </DropdownButton>
                <div className="input-group-addon">
                    {this.renderSelectedOrCourse(courseList)}
                </div>
            </div>
        );
    }

    /*
     *  Render a course div to the right of the drop down arrow within an orList item.
     *  Represents the currently selected course of the orList.
     *      courseList: the list of courses that the orList contains
     */
    renderSelectedOrCourse(courseList){
        let selectedCourse = undefined;

        courseList.forEach((courseObj) => {
            (courseObj.isSelected) && (selectedCourse = courseObj);
        });

        let onClickNoneSelected = (event) => {
          event.stopPropagation();
          this.handleSelectedCourseClick(undefined);
        };

        return (!selectedCourse) ? <div className="orListNoneSelected"
                                        title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP}
                                        onClick={onClickNoneSelected}>
                                        {UI_STRINGS.LIST_NONE_SELECTED}
                                    </div> :
                                    <Course courseObj={selectedCourse}
                                            onCourseClick={this.handleSelectedCourseClick}/>;
    }

    render() {
        // TODO: find a better alternative to this; perhaps npm 'classnames'
        let extraClassNames = Object.keys(SEMESTER_ITEM_CLASS_MAP).map((key) =>
            this.props[key] ? SEMESTER_ITEM_CLASS_MAP[key] : undefined
        ).filter((element) => {
            return element !== undefined;
        });
        let orListDiv = this.renderOrListDiv(this.props.courseList, extraClassNames, this.props.position);
        return this.props.isDraggable ? this.props.connectDragSource(orListDiv) : orListDiv;
    }
}

export default DragSource(ITEM_TYPES.OR_LIST, createDragSourceSpec(ITEM_TYPES.OR_LIST), collectSource)(OrList);