/*
 *  Collection of utilities such as constants or functions that may be used by more than one component
 *
 *  All constants should be kept in this file.
 *
 */

export const SEASON_NAMES_PRETTY = ["Fall", "Winter", "Summer"];
export const SEASON_NAMES = SEASON_NAMES_PRETTY.map((season) => season.toLowerCase());
export const DEFAULT_PROGRAM = "SOEN-General-Coop";
export const EXPORT_TYPES = ["PDF", "MD", "TXT"];

// All hardcoded pieces of text which are directly displayed to the user
export const UI_STRINGS = {

    "SITE_NAME": "Conu Course Planner",

    "WORK_TERM": "Work Term",
    "IS_WORK_TERM": " is work term?",
    "NO_COURSES": "No Courses",

    "COURSE_INFO_HEADER": "Course Info",
    "COURSE_INFO_HINT": "Click on or search for a course to display its info",

    "VALIDATION_HEADER": "Validation Results",
    "VALIDATION_SUCCESS_MSG": "Sequence is valid",

    "EXPORT_BTN_TEXT": "Export",

    "ORLIST_CHOICE_TOOLTIP": "Choose course from list of options",

    "LIST_LOADING": "Loading...",
    "LIST_NONE_SELECTED": "None Selected"

};

// convenience function that allows you to save the file contained at location uri to disk of client machine
// currently used for downloading exported PDF file
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