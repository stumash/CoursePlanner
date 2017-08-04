/*
 *  Collection of utilities such as constants or functions that may be used by more than one component
 *
 *  All constants should be kept in this file.
 *
 */

export const SEASON_NAMES_PRETTY = ["Fall", "Winter", "Summer"];
export const SEASON_NAMES = SEASON_NAMES_PRETTY.map((season) => season.toLowerCase());
export const DEFAULT_PROGRAM = "SOEN-General-Coop";
export const EXPORT_TYPES = ["PDF", "CSV"];

// All hardcoded pieces of text which are directly displayed to the user
export const UI_STRINGS = {

    "SITE_NAME": "Conu Course Planner",

    "WORK_TERM": "Work Term",
    "NO_COURSES": "No Courses",

    "COURSE_INFO_HEADER": "Course Info",
    "COURSE_INFO_HINT": "Click on or search for a course to display its info",

    "VALIDATION_HEADER": "Validation Results",
    "VALIDATION_SUCCESS_MSG": "Sequence is valid",

    "EXPORT_BTN_TEXT": "Export",

    "PROGRAM_LIST_LOADING": "Loading...",

    "ORLIST_CHOICE_TOOLTIP": "Choose course from list of options",
    "ORLIST_NONE_SELECTED": "None Selected"

};