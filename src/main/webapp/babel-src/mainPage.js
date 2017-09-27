import React from "react";

import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';

import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import {IOPanel} from "./ioPanel";
import {DEFAULT_PROGRAM, MAX_UNDO_HISTORY_LENGTH, saveAs, generateUniqueKey, generateUniqueKeys} from "./util";

let _ = require("underscore");

/*
 *  Root component of our main page
 *
 *  This component loads up the saved/default sequence once it's created
 *
 */
class MainPage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            "courseSequenceObject" : {
                "isLoading" : true
            },
            "chosenProgram" : localStorage.getItem("chosenProgram") || DEFAULT_PROGRAM,
            "allSequences" : [],
            "selectedCourseInfo" : {},
            "loadingExport": false,
            "showingGarbage": false
        };

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.updateChosenProgram = this.updateChosenProgram.bind(this);
        this.loadCourseInfo = this.loadCourseInfo.bind(this);
        this.setOrListCourseSelected = this.setOrListCourseSelected.bind(this);
        this.toggleWorkTerm = this.toggleWorkTerm.bind(this);
        this.exportSequence = this.exportSequence.bind(this);
        this.enableGarbage = this.enableGarbage.bind(this);
        this.moveCourse = this.moveCourse.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    componentDidMount() {
        this.loadCourseSequenceObject();
        this.loadAllSequences();
        this.courseSequenceHistory = {
            "history": [],
            "currentPosition": -1
        };
        this.preventHistoryUpdate = false;
    }

    componentDidUpdate(prevProps, prevState){
        if(!_.isEqual(prevState.courseSequenceObject, this.state.courseSequenceObject) && !this.state.courseSequenceObject.isLoading){
            // save change to local storage
            localStorage.setItem("savedSequence", JSON.stringify(this.state.courseSequenceObject));

            if(!this.preventHistoryUpdate){
                // add deep copy of item to history
                this.courseSequenceHistory.currentPosition++;
                this.courseSequenceHistory.history = this.courseSequenceHistory.history.slice(0, this.courseSequenceHistory.currentPosition);
                this.courseSequenceHistory.history.push(JSON.parse(JSON.stringify(this.state.courseSequenceObject)));
                if(this.courseSequenceHistory.history.length > MAX_UNDO_HISTORY_LENGTH){
                    this.courseSequenceHistory.currentPosition--;
                    this.courseSequenceHistory.history.shift();
                }
            }
            this.preventHistoryUpdate = false;

            console.group("Sequence Object History");
            console.log("history length:", this.courseSequenceHistory.history.length);
            console.log("current history position:", this.courseSequenceHistory.currentPosition);
            console.log("pointing at:", this.courseSequenceHistory.history[this.courseSequenceHistory.currentPosition].yearList);
            console.groupEnd();
        }
    }

    /*
     *  function to call in the event that the user selects a new program of study
     *      param newChosenProgram - the name of the chosen program (e.g. SOEN-General-Coop);
     *                               directly links to _id value of sequence in courseSequences DB
     */
    updateChosenProgram(newChosenProgram){

        // remember the program selected by the user
        localStorage.setItem("chosenProgram", newChosenProgram);
        // clear the saved sequence to force a reloading of the user's chosen program
        // TODO: (INSERT CONFIRM BOX HERE - MAKE SURE USER DOESN'T LOSE THEIR WORK BY ACCIDENTALLY CHANGING PROGRAMS)
        localStorage.removeItem("savedSequence");

        // Must use the callback param of setState to ensure the chosenProgram is changed in time
        this.setState({"chosenProgram": newChosenProgram}, this.loadCourseSequenceObject);
    }

    /*
     *  function to call in the event that the user selects an item from a list of choice courses (AKA orList)
     *      param coursePosition - object indicating the absolute position of the course within the sequence
     *                             required properties: yearIndex, season, courseListIndex, orListIndex
     */
    setOrListCourseSelected(coursePosition){
        this.setState((prevState) => {

            let courseSequenceObjectCopy = JSON.parse(JSON.stringify(prevState.courseSequenceObject));

            // update isSelected property of items in orList in question
            let orList = courseSequenceObjectCopy.yearList[coursePosition.yearIndex][coursePosition.season].courseList[coursePosition.courseListIndex];

            orList = orList.map((courseObj, orListIndex) => {
                courseObj.isSelected = (orListIndex === coursePosition.orListIndex);
                return courseObj;
            });

            // set new state based on changes
            return {
                "courseSequenceObject": courseSequenceObjectCopy
            };
        });
    }

    /*
     *  function to call in the event that the user toggles whether a semester is a work term or not
     *      param yearIndex - index of the year of the semester
     *      param season - the season of the semester
     */
    toggleWorkTerm(yearIndex, season){
        this.setState((prevState) => {

            let courseSequenceObjectCopy = JSON.parse(JSON.stringify(prevState.courseSequenceObject));

            // updated isWorkTerm property of semester in question
            let isWorkTerm = courseSequenceObjectCopy.yearList[yearIndex][season].isWorkTerm;
            courseSequenceObjectCopy.yearList[yearIndex][season].isWorkTerm = (isWorkTerm === "true") ? "false" : "true";

            // set new state based on changes
            return {
                "courseSequenceObject": courseSequenceObjectCopy
            };
        });
    }

    /*
     *  function to call when we want to display the garbage can and allow the user to delete a course
     *      param enabled - should the garbage can be enabled
     */
    enableGarbage(enabled){
        this.setState({
            "showingGarbage": enabled
        });
    }

    /*
     *  function to call in the event that the user drags an existing course into a new position
     *      param oldPosition - object indicating the absolute position of the course within the sequence
     *                          required properties: yearIndex, season, courseListIndex
     *      param newPosition - ''
     */
    moveCourse(oldPosition, newPosition){
        this.setState((prevState) => {

            let courseSequenceObjectCopy = JSON.parse(JSON.stringify(prevState.courseSequenceObject));

            let courseToMove = courseSequenceObjectCopy.yearList[oldPosition.yearIndex][oldPosition.season].courseList[oldPosition.courseListIndex];

            // remove course from old position and insert at new position
            courseSequenceObjectCopy.yearList[oldPosition.yearIndex][oldPosition.season].courseList.splice(oldPosition.courseListIndex, 1);
            courseSequenceObjectCopy.yearList[newPosition.yearIndex][newPosition.season].courseList.splice(newPosition.courseListIndex, 0, courseToMove);

            // set new state based on changes
            return {
                "courseSequenceObject": courseSequenceObjectCopy
            };
        });
    }

    /*
     *  function to call in the event that the user drags a new course into a new position
     *      param courseObj - object representing the course to be added
     *      param newPosition - object indicating the new absolute position of the course within the sequence
     *                          required properties: yearIndex, season, courseListIndex
     */
    addCourse(courseObj, newPosition){
        this.setState((prevState) => {

            // generate a unique key for the course
            courseObj.id = generateUniqueKey(courseObj, newPosition.season, newPosition.yearIndex, newPosition.courseListIndex, "");

            let courseSequenceObjectCopy = JSON.parse(JSON.stringify(prevState.courseSequenceObject));

            // insert course at new position
            courseSequenceObjectCopy.yearList[newPosition.yearIndex][newPosition.season].courseList.splice(newPosition.courseListIndex, 0, courseObj);

            // set new state based on changes
            return {
                "courseSequenceObject": courseSequenceObjectCopy
            };
        });
    }

    /*
     *  function to call in the event that the user wants to remove a course from the sequence
     *      param coursePosition - object indicating the new absolute position of the course within the sequence
     *                             required properties: yearIndex, season, courseListIndex
     */
    removeCourse(coursePosition){
        this.setState((prevState) => {

            let courseSequenceObjectCopy = JSON.parse(JSON.stringify(prevState.courseSequenceObject));

            // remove course at coursePosition
            courseSequenceObjectCopy.yearList[coursePosition.yearIndex][coursePosition.season].courseList.splice(coursePosition.courseListIndex, 1);

            // set new state based on changes
            return {
                "courseSequenceObject": courseSequenceObjectCopy
            };
        });
    }

    /*
     *  event handler for key presses
     */
    handleKeyPress(keyDownEvent){
        if(keyDownEvent.keyCode === 90 && keyDownEvent.ctrlKey){
            let changedCurrentPosition = false;
            if(keyDownEvent.shiftKey){
                // do a redo op
                if(this.courseSequenceHistory.currentPosition < this.courseSequenceHistory.history.length - 1){
                    this.courseSequenceHistory.currentPosition++;
                    changedCurrentPosition = true;
                }
            } else {
                // do an undo op
                if(this.courseSequenceHistory.currentPosition > 0){
                    this.courseSequenceHistory.currentPosition--;
                    changedCurrentPosition = true;
                }
            }
            if(changedCurrentPosition){
                // prevent the componentDidUpdate method from updating our undo history
                this.preventHistoryUpdate = true;
                // update state
                this.setState({
                    "courseSequenceObject": this.courseSequenceHistory.history[this.courseSequenceHistory.currentPosition]
                });
            }
        }
    }

    render() {
        return (
            <div className="row" tabIndex="1" onKeyDown={this.handleKeyPress}>
                <div className="col-md-3 col-sm-12">
                    <IOPanel courseInfo={this.state.selectedCourseInfo}
                             allSequences={this.state.allSequences}
                             chosenProgram={this.state.chosenProgram}
                             loadingExport={this.state.loadingExport}
                             showingGarbage={this.state.showingGarbage}
                             onChangeChosenProgram={this.updateChosenProgram}
                             exportSequence={this.exportSequence}
                             onSearchCourse={this.loadCourseInfo}
                             onRemoveCourse={this.removeCourse}/>
                </div>
                {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                <div className="col-sm-9 hidden-xs hidden-sm">
                    <SemesterTable courseSequenceObject={this.state.courseSequenceObject}
                                   onSelectCourse={this.loadCourseInfo}
                                   onOrListSelection={this.setOrListCourseSelected}
                                   onToggleWorkTerm={this.toggleWorkTerm}
                                   onMoveCourse={this.moveCourse}
                                   onAddCourse={this.addCourse}
                                   onChangeDragState={this.enableGarbage}/>
                </div>
                <div className="col-xs-8 col-xs-offset-2 hidden-md hidden-lg">
                    <SemesterList courseSequenceObject={this.state.courseSequenceObject}
                                  onSelectCourse={this.loadCourseInfo}
                                  onOrListSelection={this.setOrListCourseSelected}
                                  onToggleWorkTerm={this.toggleWorkTerm}
                                  onMoveCourse={this.moveCourse}
                                  onAddCourse={this.addCourse}
                                  onChangeDragState={this.enableGarbage}/>
                </div>
            </div>
        );
    }

    /*
    *  Backend API calls:
    */

    // Load chosen sequence via backend request if we don't find one that's already saved
    loadCourseSequenceObject(){

        // set the courseSequenceObject to loading state then load its data
        this.setState({"courseSequenceObject" : {
            "isLoading": true
        }}, () => {
            let courseSequenceObject = JSON.parse(localStorage.getItem("savedSequence"));

            if(courseSequenceObject === null){

                let requestBody = {
                    "sequenceID": this.state.chosenProgram
                };

                $.ajax({
                    type: "POST",
                    url: "coursesequences",
                    data: JSON.stringify(requestBody),
                    success: (response) => {
                        let courseSequenceObject = JSON.parse(response).response;
                        courseSequenceObject.yearList = generateUniqueKeys(courseSequenceObject.yearList);
                        this.setState({"courseSequenceObject" : courseSequenceObject});
                        localStorage.setItem("savedSequence", JSON.stringify(courseSequenceObject));
                    }
                });

            } else {
                this.setState({"courseSequenceObject" : courseSequenceObject});
            }
        });
    }

    // This function gets called only once, when the page loads
    loadAllSequences(){
        $.ajax({
            type: "GET",
            url: "allsequences",
            success: (response) => {
                this.setState({"allSequences" : JSON.parse(response)});
            }
        });
    }

    /*
     *  function to call in the event that the user selects a course such as by clicking on it
     *      param courseCode - the code of the chosen course
     */
    loadCourseInfo(courseCode){
        this.setState({"selectedCourseInfo" : {
            "isLoading" : true
        }}, () => {
            $.ajax({
                type: "POST",
                url: "courseinfo",
                data: JSON.stringify({"code" : courseCode}),
                success: (response) => {
                    this.setState({"selectedCourseInfo" : JSON.parse(response)});
                }
            });
        });
    }

    /*
     *  function to call in the event that the user wishes to export their current sequence
     *      param exportType - string which indicates what file type to export to
     */
    exportSequence(exportType){
        this.setState({
            "loadingExport": true
        }, () =>{
            $.ajax({
                type: "POST",
                url: "export",
                data: JSON.stringify({"yearList" : this.state.courseSequenceObject.yearList}),
                success: (response) => {

                    let downloadUrl = JSON.parse(response).exportPath;
                    if(exportType === "MD" || exportType === "TXT"){
                        downloadUrl = downloadUrl.replace("pdf", "md");
                    }

                    saveAs(downloadUrl, "MySequence." + exportType.toLowerCase());

                    this.setState({"loadingExport" : false});
                }
            });
        });
    }
}

export default DragDropContext(HTML5Backend)(MainPage);
