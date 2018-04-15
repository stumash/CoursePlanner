/*
 *  Collection of utilities such as constants or functions that may be used by more than one component
 *
 *  All constants should be kept in this file.
 *
 */
import React from "react";
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CircularProgress from 'material-ui/CircularProgress';

// App theme

export const MUI_THEME = getMuiTheme({
    palette: {
        primary1Color: "#6c1540",
        primary2Color: "#3d001a",
        accent1Color: "#f5bb2b",
        pickerHeaderColor: "#6c1540",
    }
});

// Regular old constants
export const SEASON_NAMES_PRETTY = ["Fall", "Winter", "Summer"];
export const SEASON_NAMES = SEASON_NAMES_PRETTY.map((season) => season.toLowerCase());
export const MAX_UNDO_HISTORY_LENGTH = 100;
export const AUTO_SCROLL_PAGE_PORTION = 0.1; // auto scroll on the top and bottom 10% of screen
export const AUTO_SCROLL_STEP = 10;
export const AUTO_SCROLL_DELAY = 20;
export const FEEDBACK_CHAR_LIMIT = 1000;
export const FEEDBACK_SNACKBAR_AUTOHIDE_DURATION = 4000;
export const FEEDBACK_ROWS_MAX = 10;

export const KEY_CODES = {
    SHIFT: 16,
    CTRL: 17,
    Z: 90
};

/*
 * All hardcoded pieces of text which are directly displayed to the user.
 * Add '_T' suffix to property name if it uses sprintf template syntax
 */
export const UI_STRINGS = {

    SITE_NAME: "ConU Course Planner",
    BETA_LABEL: "Beta",

    PROGRAM_SELECTION_LOADING: "Loading list of recommended sequences",
    PROGRAM_SELECTION_TITLE: "Welcome to ConU Course Planner!",
    PROGRAM_SELECTION_PROGRAM_TITLE: "Select your program",
    PROGRAM_SELECTION_OPTION_TITLE: "Select your option",
    PROGRAM_SELECTION_ENTRY_TYPE_TITLE: "Select your entry type",
    PROGRAM_SELECTION_FINAL_MESSAGE: "Your selected program is:",

    PROGRAM_SELECTION_CONFIRM_LABEL: "Confirm",
    PROGRAM_SELECTION_BACK_LABEL: "Back",
    PROGRAM_SELECTION_PREVIOUS_LABEL: "Previous",
    PROGRAM_SELECTION_FINISH_LABEL: "Finish",
    PROGRAM_SELECTION_NEXT_LABEL: "Next",

    WORK_TERM: "Work Term",
    IS_WORK_TERM: "is work term?",
    NO_COURSES: "No Courses",

    DEFAULT_SEARCH_LABEL: "Course search by course code",
    COURSE_SEARCH_HINT: "e.g. comp 248",
    COURSE_SEARCH_FOUND_NONE: "Search returned no results",

    COURSE_INFO_LOADING: "Getting course info",

    COURSE_INFO_HEADING_DESCRIPTION: "Description",
    COURSE_INFO_HEADING_PREREQUISITES: "Pre-requisites",
    COURSE_INFO_HEADING_COREQUISITES: "Co-requisites",

    COURSE_INFO_HINT: "Click on or search for a course to display its info",
    VALIDATION_RESULTS_HINT: "Make changes to your schedule to trigger a validation",

    VALIDATION_LOADING: "Validating course sequence",
    
    VALIDATION_FAILURE_MSG: "Sequence contains issues/warnings",
    VALIDATION_SUCCESS_MSG: "Sequence is valid",

    VALIDATION_MISSING_REQUISITE_T: "%1$s is missing %2$s: %3$s",
    VALIDATION_MISSING_CREDITS_T: "Sequence contains only %1$s of %2$s required credits",
    VALIDATION_REPEATED_COURSE_T: "%1$s is repeated %2$s times in the sequence",
    VALIDATION_NO_OPTION_SELECT_T: "No option selected in %1$s of year %2$s, entry number %3$s",

    EXPORT_TEXT: "Export",
    EXPORTING_SEQUENCE: "Exporting sequence",

    SELECT_NEW_PROGRAM: "Select a new program",

    ELECTIVE_COURSE_TOOLTIP: "Replace me with a real course!",
    ORLIST_CHOICE_TOOLTIP: "Choose course from list of options",
    LIST_LOADING: "Loading...",
    LIST_NONE_SELECTED: "None Selected",

    REPO_LINK_TEXT: "View on Github",

    FEEDBACK_TEXT: "Feedback",
    FEEDBACK_CHAR_LIMIT_ERROR_MSG: "Character limit reached",
    FEEDBACK_PLACEHOLDER: "Insert Feedback here",
    FEEDBACK_BOX_TITLE: "Comments/Concerns? Let us know and we'll see what we can do",
    FEEDBACK_SEND_ERROR_MSG: "An error occurred, message not sent",
    FEEDBACK_SEND_SUCCESS_MSG: "Message sent, thank you for your feedback!"
};

export const URLS = {
    REPO: "https://github.com/stumash/CoursePlanner"
};

export const PROGRAM_NAMES = {
    SOEN: "Software Engineering",
    COMP: "Computer Science",
    BLDG: "Building Engineering",
    CIVI: "Civil Engineering",
    INDU: "Industrial Engineering",
    MECH: "Mechanical Engineering",
    COEN: "Computer Engineering",
    ELEC: "Electrical Engineering",
    AERO: "Aerospace Engineering"
};

export const PROGRAM_OPTIONS = {
    General: "General Program",
    Games: "Computer Games",
    Realtime: "Real-time, Embedded and Avionics Software ",
    Web: "Web Services and Applications",
    Apps: "Computer Applications",
    CompSys: "Computer Systems",
    InfoSys: "Information Systems",
    Stats: "Mathematics and Statistics",
    SoftSys: "Software Systems",
    CompArts: "Computation Arts",
    NoOption: "None",
    Tele: "Telecommunications",
    Electronics: "Electronics/VLSI",
    Avionics: "Avionics and Control Systems",
    Power: "Power and Renewable Energy",
    Propulsion: "Aerodynamics and Propulsion",
    Structures: "Aerospace Structures and Materials",
    AeroSys: "Avionics and Aerospace Systems"
};

export const PROGRAM_ENTRY_TYPES = {
    Sept: "September",
    Jan: "January",
    Coop: "Coop September"
};

export const EXPORT_TYPES = {
    EXPORT_TYPE_TABLE_PDF: "PDF (table)",
    EXPORT_TYPE_TABLE_HTML: "HTML (table)",
    EXPORT_TYPE_LIST_PDF: "PDF (list)",
    EXPORT_TYPE_LIST_MD: "TEXT (list)"
};

export const COURSE_EXEMPTIONS = [
    "MATH 203",
    "MATH 204",
    "MATH 205",
    "CHEM 205",
    "PHYS 204",
    "PHYS 205"
];

export const INLINE_STYLES = {
    appBar: {
        zIndex: "0"
    },
    appBarVertIcon: {
        color: "white"
    },
    exportLoadingDialogTitle: {
        textAlign: "center"
    },
    exportLoadingDialogContent: {
        width: "300px"
    },
    exportLoadingDialogIcon: {
        width: "100%",
        textAlign: "center"
    },
    autoCompleteContainer: {
        marginLeft: "12px"
    },
    autoCompleteList: {
        maxHeight: "250px",
        overflow: "auto"
    },
    searchLoadingIcon: {
        paddingLeft: "12px"
    },
    courseInfoLoadingIcon: {
        marginLeft: "-8px",
        marginTop: "-10px"
    },
    courseInfoListItem: {
        padding: "8px 0",
        height: "32px",
        marginLeft: "16px",
        fontSize: "14px"
    },
    courseInfoCardText: {
        paddingTop: "0"
    },
    validationLoadingIcon: {
        marginLeft: "-8px",
        marginTop: "-10px"
    },
    allSequencesLoadingIcon: {
        width: "100%",
        textAlign: "center"
    },
    programSelectContent: {
        width: "40%"
    },
    programSelectNextButton: {
        marginRight: "12px"
    },
    betterYellow: {
        color: "#f5bb2b"
    }
};

export const SEMESTER_ITEM_CLASS_MAP = {
    isHidden: "isHidden",
    isDraggable: "grabbable",
    isHighlighted: "highlighted",
    isSelected: "selected",
    isDragPreview: "dragPreview"
};

export const LOADING_ICON_TYPES = {
    big: <CircularProgress size={80} thickness={7}/>,
    small: <CircularProgress size={25} thickness={2.5}/>,
    export: <CircularProgress size={80} thickness={7} style={INLINE_STYLES.exportLoadingDialogIcon}/>
};

export function generatePrettyProgramName(program, option, entryType, minTotalCredits){
    return (
        PROGRAM_NAMES[program] + ", " +
        ((option !== "NoOption") ? PROGRAM_OPTIONS[option] + " Option, " : "") +
        PROGRAM_ENTRY_TYPES[entryType] + " Entry" +
        (minTotalCredits ?  " (" + minTotalCredits + " credits)" : "")
    );
};

/*
 *  Convenience function that allows you to save the file contained at location uri to disk of client machine
 *  currently used for downloading exported PDF file
 */
export function saveAs(uri, filename) {
    const link = document.createElement('a');
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
 */
export function generateUniqueKeys(yearList){
    yearList.forEach((year, yearIndex) => {
        SEASON_NAMES.forEach((season) => {
            year[season].courseList.forEach((courseObj, courseIndex) => {
                if(courseObj.length > 0){
                    courseObj.forEach((courseOrObj, orListIndex) => {
                        courseOrObj.id = generateUniqueKey(courseOrObj, season, yearIndex, courseIndex, orListIndex);
                    });
                } else {
                    courseObj.id = generateUniqueKey(courseObj, season, yearIndex, courseIndex, "");
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
export function generateUniqueKey(courseObj, season, yearIndex, courseIndex, orListIndex, timestamp){
    let id = (courseObj.isElective === "true") ? courseObj.electiveType : courseObj.code;
    id += positionToString({
        season: season,
        yearIndex: yearIndex,
        courseIndex: courseIndex,
        orListIndex: orListIndex
    });
    (timestamp) && (id += (" " + timestamp));
    return id;
}

/*
 * Generate a string from a position object
 *     position: position of the course in the sequence, possibly within an orList
 */
export function positionToString(position){
    return [position.season, position.yearIndex, position.courseIndex].join(" ");
}

/*
 * Generate a position from a position string
 *     positionString: position of the course in the sequence, represented as a string
 */
export function parsePositionString(positionString){
    let subStrings = positionString.split(" ");
    return {
        season: subStrings[0],
        yearIndex: parseInt(subStrings[1]),
        courseIndex: parseInt(subStrings[2])
    };
}

// Item types used for DND
export const ITEM_TYPES = {
    COURSE: "Course",
    OR_LIST: "OrList"
};

/*
 *  Special object used by react-dnd to register a drag source
 */
export function createDragSourceSpec(itemType) {
    let beginDrag = undefined;
    if(itemType === ITEM_TYPES.COURSE) {
        beginDrag = (props, monitor, component) => {
            props.onChangeDragState && props.onChangeDragState(true, props.position, props.courseObj);
            return {
                courseObj: props.courseObj,
                position: props.position
            };
        }
    }
    if(itemType === ITEM_TYPES.OR_LIST) {
        beginDrag = (props, monitor, component) => {
            props.onChangeDragState && props.onChangeDragState(true, props.position);
            return {
                courseList: props.courseList,
                position: props.position
            };
        }
    }
    return {
        beginDrag: beginDrag,
        endDrag(props, monitor, component){
            props.onChangeDragState && props.onChangeDragState(false, props.position);
        },
        canDrag(props, monitor){
            return props.isDraggable;
        }
    };
}

/*
 *  Collect function used by react-dnd to inject properties into a drag source
 */
export function collectSource(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isBeingDragged: monitor.isDragging()
    };
}