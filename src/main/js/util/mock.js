/*
 *  Add mock data to be used in unit tests to this file.
 *  Never remove or change the contents of the variables. Only add new content.
 *
 */

export const mockCourseInfoObjects = [
    {
        "_id":"ENGR 201",
        "code":"ENGR 201",
        "name":"Professional Practice and Responsibility",
        "credits":"1.5",
        "description":"Health and safety issues for engineering projects: Quebec and Canadian legislation; safe work practices; general laboratory safety common to all engineering disciplines, and specific laboratory safety pertaining to particular engineering disciplines. Review of the legal framework in Quebec, particularly the Professional Code and the Engineers Act, as well as professional ethics. ",
        "lectureHours":"one and a half hours per week",
        "tutorialHours":"one hour per week, alternate weeks",
        "requirements":{
            "prereqs":[],
            "coreqs":[]
        }
    },
    {
        "_id":"COMP 232",
        "code":"COMP 232",
        "name":"Mathematics for Computer Science",
        "credits":"3",
        "description":"Sets. Propositional logic and predicate calculus. Functions and relations. Elements of number theory. Mathematical reasoning. Proof techniques: direct proof, indirect proof, proof by contradiction, proof by induction. ",
        "lectureHours":"three hours per week",
        "tutorialHours":"two hours per week",
        "note":"Students who have received credit for COMP 238 or COEN 231 may not take this course for credit.",
        "requirements":{
            "prereqs":[["MATH 203"],["MATH 204"]],
            "coreqs":[]
        }
    },
    {
        "_id":"COMP 248",
        "code":"COMP 248",
        "name":"Object-Oriented Programming I",
        "credits":"3.5",
        "description":"Introduction to programming. Basic data types, variables, expressions, assignments, control flow. Classes, objects, methods. Information hiding, public vs. private visibility, data abstraction and encapsulation. References. Arrays. ",
        "lectureHours":"three hours per week",
        "tutorialHours":"two hours per week",
        "labHours":"one hour per week",
        "requirements":{
            "prereqs":[],
            "coreqs":[["MATH 204"]]
        }
    },
    {
        "_id":"ELEC 275",
        "code":"ELEC 275",
        "name":"Principles of Electrical Engineering",
        "credits":"3.5",
        "description":"Fundamentals of electric circuits: Kirchoff?s laws, voltage and current sources, Ohm?s law, series and parallel circuits. Nodal and mesh analysis of DC circuits. Superposition theorem, Thevenin and Norton Equivalents. Use of operational amplifiers. Transient analysis of simple RC, RL and RLC circuits. Steady state analysis: Phasors and impedances, power and power factor. Single and three phase circuits. Magnetic circuits and transformers. Power generation and distribution. ",
        "lectureHours":"three hours per week",
        "tutorialHours":"two hours per week",
        "labHours":"15 hours total",
        "requirements":{
            "prereqs":[["PHYS 205"]],
            "coreqs":[["ENGR 213"]]
        }
    }
];

export const mockPositionObjects = [
    {
        season: "fall",
        yearIndex: 0,
        courseIndex: 0
    },
    {
        season: "fall",
        yearIndex: 0,
        courseIndex: 0,
        orListIndex: 0
    }
];

export const mockSearchBoxInput = [
    "com",
    "comp 24",
    "comp 249",
    "COMP 249"
];

export const mockSearchResults = ["COMM 210","COMM 222","COMM 223","COMM 225","COMM 308","COMP 108","COMP 201","COMP 208","COMP 218","COMP 228","COMP 232","COMP 233","COMP 248","COMP 249","COMP 326","COMP 335","COMP 339","COMP 345","COMP 346","COMP 348","COMP 352","COMP 353","COMP 354","COMP 361","COMP 367"];