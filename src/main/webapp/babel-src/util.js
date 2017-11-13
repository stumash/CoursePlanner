/*
 *  Collection of utilities such as constants or functions that may be used by more than one component
 *
 *  All constants should be kept in this file.
 *
 */
import React from "react";

// Regular old constants
export const SEASON_NAMES_PRETTY = ["Fall", "Winter", "Summer"];
export const SEASON_NAMES = SEASON_NAMES_PRETTY.map((season) => season.toLowerCase());
export const DEFAULT_PROGRAM = "SOEN-General-Coop";
export const EXPORT_TYPES = ["PDF", "MD", "TXT"];
export const MAX_UNDO_HISTORY_LENGTH = 100;
export const AUTO_SCROLL_PAGE_PORTION = 0.1; // auto scroll on the top and bottom 10% of screen
export const AUTO_SCROLL_STEP = 10;
export const AUTO_SCROLL_DELAY = 20;

// Item types used for DND
export const ITEM_TYPES = {
    COURSE: "Course",
    OR_LIST: "OrList"
};

// All hardcoded pieces of text which are directly displayed to the user
export const UI_STRINGS = {

    SITE_NAME: "ConU Course Planner",

    WORK_TERM: "Work Term",
    IS_WORK_TERM: "is work term?",
    NO_COURSES: "No Courses",

    DEFAULT_SEARCH_LABEL: "Course search",
    COURSE_SEARCH_HINT: "Search for a course code",
    COURSE_SEARCH_FOUND_NONE: "Search returned no results",

    COURSE_INFO_LOADING: "Getting course info",

    COURSE_INFO_HEADING_DESCRIPTION: "Description",
    COURSE_INFO_HEADING_PREREQUISITES: "Pre-requisites",
    COURSE_INFO_HEADING_COREQUISITES: "Cor-equisites",

    COURSE_INFO_HINT: "Click on or search for a course to display its info",
    VALIDATION_RESULTS_HINT: "Make changes to your schedule to trigger a validation",

    VALIDATION_FAILURE_MSG: "Sequence contains issues",
    VALIDATION_SUCCESS_MSG: "Sequence is valid",

    EXPORT_TEXT: "Export",
    EXPORTING_SEQUENCE: "Exporting sequence",

    SELECT_NEW_PROGRAM: "Select a new program",

    ORLIST_CHOICE_TOOLTIP: "Choose course from list of options",

    LIST_LOADING: "Loading...",
    LIST_NONE_SELECTED: "None Selected",

};

/*
 *  Special object used by react-dnd to register a drag source
 */
export const courseDragSource = {
    beginDrag(props, monitor, component) {

        props.onChangeDragState && props.onChangeDragState(true);

        return {
            "courseObj": props.courseObj,
            "position": props.position
        };
    },
    endDrag(props, monitor, component){
        props.onChangeDragState && props.onChangeDragState(false);
    },
    canDrag(props, monitor){
        return props.isDraggable;
    }
};

/*
 *  Special object used by react-dnd to register a drag source
 */
export const orListDragSource = {
    beginDrag(props, monitor, component) {

        props.onChangeDragState && props.onChangeDragState(true);

        return {
            "courseList": props.courseList,
            "position": props.position
        };
    },
    endDrag(props, monitor, component){
        props.onChangeDragState && props.onChangeDragState(false);
    },
    canDrag(props, monitor){
        return props.isDraggable;
    }
};

/*
 *  Collect function used by react-dnd to inject properties into a drag source
 */
export function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isBeingDragged: monitor.isDragging()
    };
}

/*
 *  Convenience function that allows you to save the file contained at location uri to disk of client machine
 *  currently used for downloading exported PDF file
 */
export function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        document.body.appendChild(link); // Firefox requires the link to be in the body
        link.download = filename;
        link.href = uri;
        link.click();
        document.body.removeChild(link); // remove the link when done
    } else {
        location.replace(uri);
    }
}

/*
 *  For every course and orList in the yearList, we must give it a unique ID.
 *  This is helpful for react to properly respond to changes and
 *  it is especially necessary for the react-dnd module to work properly
 *
 *  The unique ID is formed by appending the course code to the
 */
export function generateUniqueKeys(yearList){
    yearList.forEach((year, yearIndex) => {
        SEASON_NAMES.forEach((season) => {
            year[season].courseList.forEach((courseObj, courseListIndex) => {
                if(courseObj.length > 0){
                    courseObj.forEach((courseOrObj, orListIndex) => {
                        courseOrObj.id = generateUniqueKey(courseOrObj, season, yearIndex, courseListIndex, orListIndex);
                    });
                } else {
                    courseObj.id = generateUniqueKey(courseObj, season, yearIndex, courseListIndex, "");
                }
            });
        });
    });
    return yearList;
}

/*
 *  Form unique ID by combing course code/electiveType with its current position in the yearList
 *  If the course changes its position within the yearList, we do NOT want this id value to change, so we only call this once.
 */
export function generateUniqueKey(courseObj, season, yearIndex, courseListIndex, orListIndex){
    let id = (courseObj.isElective === "true") ? courseObj.electiveType : courseObj.code;
    id += season + yearIndex + courseListIndex + orListIndex;
    return id;
}

/*
 *  Render a div which represents an orList of courses.
 *      extraClassNames: string with a leading space which contains a list of class names separated by spaces
 */
export function renderOrListDiv(courseList, extraClassNames, position, clickHandler, listClickHandler){
    return (
        <div className={"orList input-group" + extraClassNames}>
            <div className="input-group-btn">
                <button className="btn btn-default dropdown-toggle" title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP} type="button"  data-toggle="dropdown">
                    <span className="caret"></span>
                </button>
                <ul className="dropdown-menu">
                    {courseList.map((courseObj, courseIndex) =>
                        <li key={courseObj.id}>
                            {renderCourseDiv(courseObj, "", () => {
                                listClickHandler({
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
                {renderSelectedOrCourse(courseList, clickHandler)}
            </div>
        </div>
    );
}


/*
 *  Render a div which represents a course.
 *      extraClassNames: string which contains a list of class names separated by spaces
 */
export function renderCourseDiv(courseObj, extraClassNames, clickHandler){
    return (
        <div className={"course" + extraClassNames} title={courseObj.name} onClick={clickHandler}>
            <div className="courseCode">
                { (courseObj.isElective === "true") ? (courseObj.electiveType + " Elective") : courseObj.code}
            </div>
            <div className="courseCredits">
                { (courseObj.isElective === "true") ? "3": courseObj.credits }
            </div>
        </div>
    );
}

function renderSelectedOrCourse(courseList, clickHandler){

    let selectedCourse = undefined;
    let selectedIndex = -1;

    courseList.forEach((courseObj, orListIndex) => {
        if(courseObj.isSelected){
            selectedCourse = courseObj;
            selectedIndex = orListIndex;
        }
    });

    return (!selectedCourse) ? <div title={UI_STRINGS.ORLIST_CHOICE_TOOLTIP}>{UI_STRINGS.LIST_NONE_SELECTED}</div> :
                               renderCourseDiv(selectedCourse, "", () => clickHandler(selectedCourse.code));
}