/*
 *  Add mock data to be used in unit tests to this file.
 *  Never remove or change the contents of the variables. Only add new content.
 *
 */

export const MOCK_COURSE_INFO_OBJECTS = {
    NO_PREREQS_NO_COREQS: {
        "_id": "ENGR 201",
        "code": "ENGR 201",
        "name": "Professional Practice and Responsibility",
        "credits": "1.5",
        "description": "Health and safety issues for engineering projects: Quebec and Canadian legislation; safe work practices; general laboratory safety common to all engineering disciplines, and specific laboratory safety pertaining to particular engineering disciplines. Review of the legal framework in Quebec, particularly the Professional Code and the Engineers Act, as well as professional ethics. ",
        "lectureHours": "one and a half hours per week",
        "tutorialHours": "one hour per week, alternate weeks",
        "requirements": {
            "prereqs": [],
            "coreqs": []
        }
    },
    PREREQS_ONLY: {
        "_id": "COMP 232",
        "code": "COMP 232",
        "name": "Mathematics for Computer Science",
        "credits": "3",
        "description": "Sets. Propositional logic and predicate calculus. Functions and relations. Elements of number theory. Mathematical reasoning. Proof techniques: direct proof, indirect proof, proof by contradiction, proof by induction. ",
        "lectureHours": "three hours per week",
        "tutorialHours": "two hours per week",
        "note": "Students who have received credit for COMP 238 or COEN 231 may not take this course for credit.",
        "requirements": {
            "prereqs": [["MATH 203"], ["MATH 204"]],
            "coreqs": []
        }
    },
    COREQS_ONLY: {
        "_id": "COMP 248",
        "code": "COMP 248",
        "name": "Object-Oriented Programming I",
        "credits": "3.5",
        "description": "Introduction to programming. Basic data types, variables, expressions, assignments, control flow. Classes, objects, methods. Information hiding, public vs. private visibility, data abstraction and encapsulation. References. Arrays. ",
        "lectureHours": "three hours per week",
        "tutorialHours": "two hours per week",
        "labHours": "one hour per week",
        "requirements": {
            "prereqs": [],
            "coreqs": [["MATH 204"]]
        }
    },
    PREREQS_AND_COREQS: {
        "_id": "ELEC 275",
        "code": "ELEC 275",
        "name": "Principles of Electrical Engineering",
        "credits": "3.5",
        "description": "Fundamentals of electric circuits: Kirchoff?s laws, voltage and current sources, Ohm?s law, series and parallel circuits. Nodal and mesh analysis of DC circuits. Superposition theorem, Thevenin and Norton Equivalents. Use of operational amplifiers. Transient analysis of simple RC, RL and RLC circuits. Steady state analysis: Phasors and impedances, power and power factor. Single and three phase circuits. Magnetic circuits and transformers. Power generation and distribution. ",
        "lectureHours": "three hours per week",
        "tutorialHours": "two hours per week",
        "labHours": "15 hours total",
        "requirements": {
            "prereqs": [["PHYS 205"]],
            "coreqs": [["ENGR 213"]]
        }
    }
};

export const MOCK_POSITION_OBJECTS = {
    FALL_0_COURSE_0: {
        season: "fall",
        yearIndex: 0,
        courseIndex: 0
    },
    FALL_0_COURSE_0_ORLIST_0: {
        season: "fall",
        yearIndex: 0,
        courseIndex: 0,
        orListIndex: 0
    }
};

export const MOCK_SEARCH_BOX_INPUT = {
    INCOMPLETE_0: "com",
    INCOMPLETE_1: "comp 24",
    INCOMPLETE_2: "comp 249",
    COMPLETE_0: "COMP 249"
};

export const MOCK_SEARCH_RESULTS = {
    com: ["COMM 210","COMM 222","COMM 223","COMM 225","COMM 308","COMP 108","COMP 201","COMP 208","COMP 218","COMP 228","COMP 232","COMP 233","COMP 248","COMP 249","COMP 326","COMP 335","COMP 339","COMP 345","COMP 346","COMP 348","COMP 352","COMP 353","COMP 354","COMP 361","COMP 367"],
    COMP_249: ["COMP 249"]
};

export const MOCK_VALIDATION_RESULTS = {
    VALID_NO_EXEMPTIONS: {"isValid":"true"},
    VALID_WITH_EXEMPTIONS: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 228"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"}],"warnings":[],"isValid":"false"},
    ONE_ISSUE_ONLY: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"fall"},"unmetRequirements":[["MATH 205"]],"courseCode":"ENGR 213"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"ENGR 213"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 204"],["MATH 205"]],"courseCode":"ENGR 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"SOEN 228"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"1","season":"winter"},"unmetRequirements":[["PHYS 205"]],"courseCode":"ELEC 275"},"type":"prerequisite"},{"data":{"actual":"119.0","required":"120.0"},"type":"creditCount"}],"warnings":[],"isValid":"false"},
    ONE_WARNING_ONLY: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 228"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"}],"warnings":[{"data":{"positions":[{"yearIndex":"2","courseIndex":"0","season":"fall"},{"yearIndex":"2","courseIndex":"0","season":"winter"}],"courseCode":"ENCS 393"},"type":"repeated"}],"isValid":"false"},
    ONE_ISSUE_ONE_WARNING: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"fall"},"unmetRequirements":[["MATH 205"]],"courseCode":"ENGR 213"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"ENGR 213"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["COMP 248"],["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 204"],["MATH 205"]],"courseCode":"ENGR 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"SOEN 228"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"1","season":"winter"},"unmetRequirements":[["PHYS 205"]],"courseCode":"ELEC 275"},"type":"prerequisite"}],"warnings":[{"data":{"positions":[{"yearIndex":"3","courseIndex":"0","season":"fall"},{"yearIndex":"3","courseIndex":"3","season":"winter"}],"courseCode":"SOEN 490"},"type":"repeated"}],"isValid":"false"},
    ISSUE_TYPE_CREDITS: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"fall"},"unmetRequirements":[["MATH 205"]],"courseCode":"ENGR 213"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"ENGR 213"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 204"],["MATH 205"]],"courseCode":"ENGR 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"SOEN 228"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"1","season":"winter"},"unmetRequirements":[["PHYS 205"]],"courseCode":"ELEC 275"},"type":"prerequisite"},{"data":{"actual":"119.0","required":"120.0"},"type":"creditCount"}],"warnings":[],"isValid":"false"},
    ISSUE_TYPE_PREREQ: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"fall"},"unmetRequirements":[["MATH 205"]],"courseCode":"ENGR 213"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"ENGR 213"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["COMP 248"],["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 204"],["MATH 205"]],"courseCode":"ENGR 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"SOEN 228"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"1","season":"winter"},"unmetRequirements":[["PHYS 205"]],"courseCode":"ELEC 275"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"3","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"MATH 205"},"type":"prerequisite"}],"warnings":[],"isValid":"false"},
    ISSUE_TYPE_COREQ: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"fall"},"unmetRequirements":[["MATH 205"]],"courseCode":"ENGR 213"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"ENGR 213"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 204"],["MATH 205"]],"courseCode":"ENGR 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"SOEN 228"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"summer"},"unmetRequirements":[["COMP 232"]],"courseCode":"COMP 352"},"type":"corequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"1","season":"winter"},"unmetRequirements":[["PHYS 205"]],"courseCode":"ELEC 275"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"3","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"MATH 205"},"type":"prerequisite"}],"warnings":[],"isValid":"false"},
    WARNING_TYPE_UNSELECTED: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"fall"},"unmetRequirements":[["MATH 205"]],"courseCode":"ENGR 213"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"3","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"ENGR 213"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 204"],["MATH 205"]],"courseCode":"ENGR 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"SOEN 228"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"1","courseIndex":"1","season":"winter"},"unmetRequirements":[["PHYS 205"]],"courseCode":"ELEC 275"},"type":"prerequisite"}],"warnings":[{"data":{"position":{"yearIndex":"3","courseIndex":"4","season":"fall"}},"type":"unselectedOption"}],"isValid":"false"},
    WARNING_TYPE_REPEATED: {"issues":[{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"fall"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 232"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"fall"},"unmetRequirements":[["MATH 204"]],"courseCode":"COMP 248"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"0","season":"winter"},"unmetRequirements":[["MATH 203"],["MATH 204"]],"courseCode":"COMP 228"},"type":"corequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"1","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 233"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 203"]],"courseCode":"COMP 249"},"type":"prerequisite"},{"data":{"position":{"yearIndex":"0","courseIndex":"2","season":"winter"},"unmetRequirements":[["MATH 205"]],"courseCode":"COMP 249"},"type":"corequisite"}],"warnings":[{"data":{"positions":[{"yearIndex":"2","courseIndex":"0","season":"fall"},{"yearIndex":"2","courseIndex":"0","season":"winter"}],"courseCode":"ENCS 393"},"type":"repeated"}],"isValid":"false"}
};

export const MOCK_ALL_SEQUENCES = {
    ALL_SEQUENCES: ["AERO-AeroSys-Coop","AERO-AeroSys-Jan","AERO-AeroSys-Sept","AERO-Propulsion-Coop","AERO-Propulsion-Jan","AERO-Propulsion-Sept","AERO-Structures-Coop","AERO-Structures-Jan","AERO-Structures-Sept","BLDG-NoOption-Coop","BLDG-NoOption-Jan","BLDG-NoOption-Sept","CIVI-NoOption-Coop","CIVI-NoOption-Jan","CIVI-NoOption-Sept","COEN-Avionics-Coop","COEN-Avionics-Jan","COEN-Avionics-Sept","COEN-NoOption-Coop","COEN-NoOption-Jan","COEN-NoOption-Sept","COMP-Apps-Coop","COMP-Apps-Jan","COMP-Apps-Sept","COMP-CompArts-Sept","COMP-CompSys-Coop","COMP-CompSys-Jan","COMP-CompSys-Sept","COMP-Games-Coop","COMP-Games-Jan","COMP-Games-Sept","COMP-General-Coop","COMP-General-Jan","COMP-General-Sept","COMP-InfoSys-Coop","COMP-InfoSys-Jan","COMP-InfoSys-Sept","COMP-SoftSys-Coop","COMP-SoftSys-Jan","COMP-SoftSys-Sept","COMP-Stats-Jan","COMP-Stats-Sept","COMP-Web-Coop","COMP-Web-Jan","COMP-Web-Sept","ELEC-Avionics-Coop","ELEC-Avionics-Jan","ELEC-Avionics-Sept","ELEC-Electronics-Coop","ELEC-Electronics-Jan","ELEC-Electronics-Sept","ELEC-NoOption-Coop","ELEC-NoOption-Jan","ELEC-NoOption-Sept","ELEC-Power-Coop","ELEC-Power-Jan","ELEC-Power-Sept","ELEC-Tele-Coop","ELEC-Tele-Jan","ELEC-Tele-Sept","INDU-NoOption-Coop","INDU-NoOption-Jan","INDU-NoOption-Sept","MECH-NoOption-Coop","MECH-NoOption-Jan","MECH-NoOption-Sept","SOEN-Games-Coop","SOEN-Games-Jan","SOEN-Games-Sept","SOEN-General-Coop","SOEN-General-Jan","SOEN-General-Sept","SOEN-Realtime-Coop","SOEN-Realtime-Jan","SOEN-Realtime-Sept","SOEN-Web-Coop","SOEN-Web-Jan","SOEN-Web-Sept"]
};

export const MOCK_FEEDBACK = {
    MEAN_GUY: "YOUR WEBSITE SUCKS"
};