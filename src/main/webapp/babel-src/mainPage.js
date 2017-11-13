import React from "react";

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';
let _ = require("underscore");
import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import {IOPanel} from "./ioPanel";
import DragPreview from "./dragPreview";
import {UI_STRINGS} from "./util";
import GarbageCan from "./garbageCan";
import {ExportMenu} from "./exportMenu";

import { DEFAULT_PROGRAM,
         MAX_UNDO_HISTORY_LENGTH,
         AUTO_SCROLL_PAGE_PORTION,
         AUTO_SCROLL_DELAY,
         AUTO_SCROLL_STEP,
         EXPORT_TYPES,
         generateUniqueKey,
         generateUniqueKeys,
         saveAs } from "./util";


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
            "showingGarbage": false,
            "allowingTextSelection": true
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
        this.changeDragState = this.changeDragState.bind(this);
        this.enableTextSelection = this.enableTextSelection.bind(this);
        this.performAutoScroll = this.performAutoScroll.bind(this);
        this.scrollPage = this.scrollPage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
    }

    componentDidMount() {
        this.loadCourseSequenceObject();
        this.loadAllSequences();
        this.courseSequenceHistory = {
            "history": [],
            "currentPosition": -1
        };
        this.preventHistoryUpdate = false;
        this.isDragging = false;
        this.shouldScroll = false;
        this.scrollDirection = 0;
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
        }
    }

    /*
     *  function to call when the users starts or stops dragging any item
     *      param isDragging - true if the user is dragging something
     */
    changeDragState(isDragging){
        this.enableTextSelection(!isDragging);
        this.enableGarbage(isDragging);
        this.isDragging = isDragging;
    }

    /*
     *  function to call to disable text selection on the page
     *  it is used to fix an issue in firefox where text on the page gets highlighted while dragging a course
     *      param enabled - should the garbage can be enabled
     */
    enableTextSelection(enabled){
        this.setState({
            "allowingTextSelection": enabled
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
            courseObj.isElective = "false";
            courseObj.electiveType = "";

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
    
    handleTouchMove(touchMoveEvent){
        this.performAutoScroll(touchMoveEvent.changedTouches[0].clientY, touchMoveEvent.view.innerHeight);
    }
    
    handleMouseMove(mouseMoveEvent){
        this.performAutoScroll(mouseMoveEvent.clientY, mouseMoveEvent.view.innerHeight);
    }

    /*
     *  function which decides whether or not the page should scroll based on the position of the user's cursor
     *      param y - number indicating the y coordinate of the user's cursor, where the top of the page is y = 0
     *      param pageHeight - number indicating the total height of the page in pixels
     */
    performAutoScroll(y, pageHeight){
      if(this.isDragging) {
        let scrollAreaHeight = pageHeight * AUTO_SCROLL_PAGE_PORTION;

        if(y > scrollAreaHeight && y < pageHeight - scrollAreaHeight){
          this.shouldScroll = false;
          return;
        }

        // don't call scrollPage if it's already running
        if(this.shouldScroll){
          return;
        }

        if (y <= scrollAreaHeight) {
          this.scrollDirection = -1;
          this.shouldScroll = true;
          this.scrollPage();
        }
        if (y >= pageHeight - scrollAreaHeight) {
          this.scrollDirection = 1;
          this.shouldScroll = true;
          this.scrollPage();
        }
      } else {
        this.shouldScroll = false;
      }
    }

    /*
     *  recursive function which continuously scrolls up or down the page until this.shouldScroll becomes false
     */
    scrollPage(){
        setTimeout(() => {
            window.scrollBy(0, this.scrollDirection * AUTO_SCROLL_STEP);
            if(this.shouldScroll){
                this.scrollPage();
            }
        }, AUTO_SCROLL_DELAY);
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
            <div tabIndex="1"
                 className={"mainPage" + (this.state.allowingTextSelection ? "" : " textSelectionOff")}
                 onMouseMove={this.handleMouseMove}
                 onTouchMove={this.handleTouchMove}
                 onKeyDown={this.handleKeyPress}>
                <AppBar
                    title={UI_STRINGS.SITE_NAME}
                    showMenuIconButton={false}
                    iconElementRight={this.state.showingGarbage ? <GarbageCan onRemoveCourse={this.removeCourse}/> : <ExportMenu onSelect={this.exportSequence}/>}
                    className="appBar"
                    style={{
                        zIndex: "0"
                    }}
                />
                <div className="pageContent">
                    <div className="ioPanelContainer">
                        <IOPanel courseInfo={this.state.selectedCourseInfo}
                                 allSequences={this.state.allSequences}
                                 chosenProgram={this.state.chosenProgram}
                                 loadingExport={this.state.loadingExport}
                                 showingGarbage={this.state.showingGarbage}
                                 onChangeChosenProgram={this.updateChosenProgram}
                                 exportSequence={this.exportSequence}
                                 onSearchCourse={this.loadCourseInfo}/>
                    </div>
                    {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                    <div className="semesterTableContainer hidden-xs hidden-sm">
                        <SemesterTable courseSequenceObject={this.state.courseSequenceObject}
                                       onSelectCourse={this.loadCourseInfo}
                                       onOrListSelection={this.setOrListCourseSelected}
                                       onToggleWorkTerm={this.toggleWorkTerm}
                                       onMoveCourse={this.moveCourse}
                                       onAddCourse={this.addCourse}
                                       onChangeDragState={this.changeDragState}/>
                    </div>
                    <div className="semesterListContainer col-xs-8 col-xs-offset-2 hidden-md hidden-lg">
                        <SemesterList courseSequenceObject={this.state.courseSequenceObject}
                                      onSelectCourse={this.loadCourseInfo}
                                      onOrListSelection={this.setOrListCourseSelected}
                                      onToggleWorkTerm={this.toggleWorkTerm}
                                      onMoveCourse={this.moveCourse}
                                      onAddCourse={this.addCourse}
                                      onChangeDragState={this.changeDragState}/>
                    </div>
                    {/* Drag Preview will become visible when dragging occurs */}
                    <DragPreview/>
                    <Dialog title="Exporting sequence"
                            modal={true}
                            open={this.state.loadingExport}
                            contentStyle={{width: "300px"}}
                            titleStyle={{textAlign: "center"}}>
                        <CircularProgress size={80} thickness={7} style={{width: "100%", textAlign: "center"}}/>
                    </Dialog>
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
                    url: "api/recommendedsequence",
                    data: JSON.stringify(requestBody),
                    success: (response) => {
                        let courseSequenceObject = JSON.parse(response).courseSequenceObject;
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
            url: "api/allsequences",
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
                url: "api/courseinfo",
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
                url: "api/export",
                data: JSON.stringify({"courseSequenceObject" : this.state.courseSequenceObject}),
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

export default DragDropContext(TouchBackend({enableMouseEvents: true}))(MainPage);