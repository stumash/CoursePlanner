import React from "react";
import { DragSource } from 'react-dnd';
import { UI_STRINGS, ITEM_TYPES, renderCourseDiv, dragSource, collectSource } from "./util";

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

    renderSelectedOrCourse(){

        let selectedCourse = undefined;
        let selectedIndex = -1;

        this.props.courseList.forEach((courseObj, orListIndex) => {
            if(courseObj.isSelected){
                selectedCourse = courseObj;
                selectedIndex = orListIndex;
            }
        });

        return (!selectedCourse) ? <div title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP}>{UI_STRINGS.LIST_NONE_SELECTED}</div> :
                                   renderCourseDiv(selectedCourse, "", () => this.props.onCourseClick(selectedCourse.code));
    }

    render() {

        let extraClassNames = " ";
        if(this.props.isBeingDragged) {
            extraClassNames += "beingDragged ";
        }
        if(this.props.isDraggable){
            extraClassNames += "grabbable ";
        }

        let courseList = this.props.courseList;
        let position = this.props.position;

        return this.props.connectDragSource(
            <div className={"orList input-group" + extraClassNames}>
                <div className="input-group-btn">
                    <button className="btn btn-default dropdown-toggle" title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP} type="button"  data-toggle="dropdown">
                        <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {courseList.map((courseObj, courseIndex) =>
                            <li key={courseObj.id}>
                                {renderCourseDiv(courseObj, "", () => {
                                    this.props.onOrListSelection({
                                        "yearIndex": position.yearIndex,
                                        "season": position.season,
                                        "courseListIndex": position.courseListIndex,
                                        "orListIndex": courseIndex
                                    });
                                })}
                            </li>
                        )}
                    </ul>
                </div>
                <div className="input-group-addon">
                    {this.renderSelectedOrCourse()}
                </div>
            </div>
        );
    }
}

export default DragSource(ITEM_TYPES.OR_LIST, dragSource, collectSource)(OrList);