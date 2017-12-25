import React from "react";

import { default as TouchBackend } from 'react-dnd-touch-backend';
import { DragDropContext } from 'react-dnd';

import AppBar from 'material-ui/AppBar';
import Dialog from 'material-ui/Dialog';

let _ = require("underscore");

import update from 'immutability-helper';

update.extend('$auto', function(value, object) {
    return object ?
        update(object, value):
        update({}, value);
});
update.extend('$autoArray', function(value, object) {
    return object ?
        update(object, value):
        update([], value);
});

import {CourseInfoCard} from "./courseInfoCard";
import {SequenceValidationCard} from "./sequenceValidationCard";
import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import DragPreview from "./dragPreview";
import GarbageCan from "./garbageCan";
import {AppBarMenu} from "./appBarMenu";
import {SearchBox} from "./searchBox";
import {ProgramSelectionDialog} from "./programSelectionDialog";
import {FeedBackBox} from "./feedBackBox";

import { MAX_UNDO_HISTORY_LENGTH,
         AUTO_SCROLL_PAGE_PORTION,
         AUTO_SCROLL_DELAY,
         AUTO_SCROLL_STEP,
         EXPORT_TYPES,
         INLINE_STYLES,
         LOADING_ICON_TYPES,
         UI_STRINGS,
         generatePrettyProgramName,
         generateUniqueKey,
         generateUniqueKeys,
         positionToString,
         saveAs } from "./util";


/*
 *  Root component of main page
 *
 */
class MainPage extends React.Component {

    /*
    *  Typical React lifecycle functions:
    */

    constructor(props){
        super(props);

        this.state = {
            courseSequenceObject: {
                isLoading : true
            },
            validationResults: {
                issues: [],
                warnings: [],
                isLoading: false
            },
            positionStyleMap: {},
            chosenProgram: localStorage.getItem("chosenProgram"),
            allSequences: [],
            selectedCourseInfo: {},
            loadingExport: false,
            showingGarbage: false,
            allowingTextSelection: true,
            detachIOPanel: false,
            showingFeedbackBox: false
        };

        this.courseSequenceHistory = {
            history: [],
            currentPosition: -1
        };
        this.preventHistoryUpdate = false;
        this.isDragging = false;
        this.shouldScroll = false;
        this.scrollDirection = 0;

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.updateChosenProgram = this.updateChosenProgram.bind(this);
        this.resetProgram = this.resetProgram.bind(this);
        this.loadCourseInfo = this.loadCourseInfo.bind(this);
        this.setOrListCourseSelected = this.setOrListCourseSelected.bind(this);
        this.highlightCourses = this.highlightCourses.bind(this);
        this.unhighlightCourses = this.unhighlightCourses.bind(this);
        this.toggleCourseSelection = this.toggleCourseSelection.bind(this);
        this.unselectAllCourses = this.unselectAllCourses.bind(this);
        this.toggleWorkTerm = this.toggleWorkTerm.bind(this);
        this.exportSequence = this.exportSequence.bind(this);
        this.validateSequence = this.validateSequence.bind(this);
        this.enableGarbage = this.enableGarbage.bind(this);
        this.moveCourse = this.moveCourse.bind(this);
        this.addCourse = this.addCourse.bind(this);
        this.removeCourse = this.removeCourse.bind(this);
        this.setDragState = this.setDragState.bind(this);
        this.enableTextSelection = this.enableTextSelection.bind(this);
        this.performAutoScroll = this.performAutoScroll.bind(this);
        this.scrollPage = this.scrollPage.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleTouchMove = this.handleTouchMove.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.showFeedbackBox = this.showFeedbackBox.bind(this);
        this.closeFeedBackBox = this.closeFeedBackBox.bind(this);
        this.handleCourseClick = this.handleCourseClick.bind(this);
        this.enableStyleOnPositions = this.enableStyleOnPositions.bind(this);
        this.toggleStyleOnPositions = this.toggleStyleOnPositions.bind(this);
        this.disableStyleOnAllPositions = this.disableStyleOnAllPositions.bind(this);
    }

    /*
     *  When the page first loads, get all the recommended sequences from the backend
     *  and check local storage for a courseSequenceObject.
     */
    componentDidMount() {
        this.loadAllSequences();
        this.loadCourseSequenceObject();
        window.addEventListener("scroll", this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.handleScroll);
    }

    /*
     *  Each time the courseSequenceObject is updated, we want to trigger a sequence validation,
     *  save the most recent version of courseSequenceObject to local storage,
     *  and add a deep copy of courseSequenceObject to the courseSequenceHistory for undo/redo
     */
    componentDidUpdate(prevProps, prevState){
        if(!_.isEqual(prevState.courseSequenceObject, this.state.courseSequenceObject) && !this.state.courseSequenceObject.isLoading){

            // re-validate the sequence each time it changes
            this.validateSequence();

            // save change to local storage
            localStorage.setItem("savedSequence", JSON.stringify(this.state.courseSequenceObject));

            if(!this.preventHistoryUpdate){
                // add deep copy of current sequence to history
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


    renderAppBarTitle() {
        let siteName = <div className="siteNameLabel">{UI_STRINGS.SITE_NAME}</div>;
        let betaLabel = <div className="betaLabel">{UI_STRINGS.BETA_LABEL}</div>;
        let appBarTitle = <div>{siteName} {betaLabel}</div>;

        return appBarTitle;
    }

    render() {
        let sourceUrl = this.state.courseSequenceObject.sourceUrl;
        let minTotalCredits = this.state.courseSequenceObject.minTotalCredits;
        let sequenceInfo = this.state.courseSequenceObject.sequenceInfo;
        let programPrettyName = (sequenceInfo && !this.state.courseSequenceObject.isLoading) ? generatePrettyProgramName(sequenceInfo.program, sequenceInfo.option, sequenceInfo.entryType, minTotalCredits) : "";

        return (
            <div tabIndex="1"
                 className={"mainPage" + (this.state.allowingTextSelection ? "" : " textSelectionOff")}
                 onMouseMove={this.handleMouseMove}
                 onTouchMove={this.handleTouchMove}
                 onKeyDown={this.handleKeyPress}
                 onClick={this.unselectAllCourses}>
                <AppBar title={this.renderAppBarTitle()}
                        showMenuIconButton={false}
                        className="appBar"
                        style={INLINE_STYLES.appBar}
                        iconElementRight={this.state.showingGarbage ? <GarbageCan onRemoveCourse={this.removeCourse}/> : <AppBarMenu onSelectExport={this.exportSequence}
                                                                                                                                     onSelectProgramChange={this.resetProgram}
                                                                                                                                     onSelectFeedback={this.showFeedbackBox}/>}/>
                <div className="pageContent">
                    <div className={"ioPanelContainer" + (this.state.detachIOPanel ? " detached" : "")}>
                        <div className="ioPanel">
                            <SearchBox onConfirmSearch={this.loadCourseInfo}/>
                            <div className="outputPanel">
                                <CourseInfoCard courseInfo={this.state.selectedCourseInfo}/>
                                <SequenceValidationCard validationResults={this.state.validationResults}
                                                        onMouseEnterItem={this.highlightCourses}
                                                        onMouseLeaveItem={this.unhighlightCourses}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                    <div className="semesterTableContainer hidden-xs hidden-sm">
                        <div className="programPrettyName"><a href={sourceUrl} target="_blank">{programPrettyName}</a></div>
                        <SemesterTable courseSequenceObject={this.state.courseSequenceObject}
                                       positionStyleMap={this.state.positionStyleMap}
                                       onSelectCourse={this.handleCourseClick}
                                       onOrListSelection={this.setOrListCourseSelected}
                                       onToggleWorkTerm={this.toggleWorkTerm}
                                       onMoveCourse={this.moveCourse}
                                       onAddCourse={this.addCourse}
                                       onChangeDragState={this.changeDragState}/>
                    </div>
                    <div className="semesterListContainer col-xs-8 col-xs-offset-2 hidden-md hidden-lg">
                        <div className="programPrettyName"><a href={sourceUrl} target="_blank">{programPrettyName}</a></div>
                        <SemesterList courseSequenceObject={this.state.courseSequenceObject}
                                      positionStyleMap={this.state.positionStyleMap}
                                      onSelectCourse={this.handleCourseClick}
                                      onOrListSelection={this.setOrListCourseSelected}
                                      onToggleWorkTerm={this.toggleWorkTerm}
                                      onMoveCourse={this.moveCourse}
                                      onAddCourse={this.addCourse}
                                      onChangeDragState={this.changeDragState}/>
                    </div>
                    {/* Drag Preview will become visible when dragging occurs */}
                    <DragPreview/>
                    <Dialog title={UI_STRINGS.EXPORTING_SEQUENCE}
                            modal={true}
                            open={this.state.loadingExport}
                            titleStyle={INLINE_STYLES.exportLoadingDialogTitle}
                            contentStyle={INLINE_STYLES.exportLoadingDialogContent}>
                        {LOADING_ICON_TYPES.export}
                    </Dialog>
                    <ProgramSelectionDialog isOpen={!this.state.chosenProgram}
                                            allSequences={this.state.allSequences}
                                            onChangeChosenProgram={this.updateChosenProgram}/>
                    <FeedBackBox open={this.state.showingFeedbackBox}
                                 onRequestClose={this.closeFeedBackBox}/>
                </div>
            </div>
        );
    }

    /*
    *  Course sequence object mutators:
    */

    /*
     *  Function to call in the event that the user drags an existing course into a new position
     *      param oldPosition - object indicating the absolute position of the course within the sequence
     *                          required properties: yearIndex, season, courseIndex
     *      param newPosition - ''
     */
    moveCourse(oldPosition, newPosition){
        this.setState((prevState) => {

            let courseToMove = prevState.courseSequenceObject.yearList[oldPosition.yearIndex][oldPosition.season].courseList[oldPosition.courseIndex];

            let removeCommand = {
                yearList: {
                    [oldPosition.yearIndex]: {
                        [oldPosition.season]: {
                            courseList: {$splice: [[oldPosition.courseIndex, 1]]}
                        }
                    }
                }
            };

            let addCommand = {
                yearList: {
                    [newPosition.yearIndex]: {
                        [newPosition.season]: {
                            courseList: {$splice: [[newPosition.courseIndex, 0, courseToMove]]}
                        }
                    }
                }
            };

            // set new state based on changes
            return {
                courseSequenceObject: update(update(prevState.courseSequenceObject, removeCommand), addCommand)
            };
        });
    }

    /*
     *  Function to call in the event that the user drags a new course into a new position
     *      param courseObj - object representing the course to be added
     *      param newPosition - object indicating the new absolute position of the course within the sequence
     *                          required properties: yearIndex, season, courseIndex
     */
    addCourse(courseObj, newPosition){
        this.setState((prevState) => {

            courseObj.id = generateUniqueKey(courseObj, newPosition.season, newPosition.yearIndex, newPosition.courseIndex, "");
            courseObj.isElective = "false";
            courseObj.electiveType = "";

            let addCommand = {
                yearList: {
                    [newPosition.yearIndex]: {
                        [newPosition.season]: {
                            courseList: {$splice: [[newPosition.courseIndex, 0, courseObj]]}
                        }
                    }
                }
            };

            return {
                courseSequenceObject: update(prevState.courseSequenceObject, addCommand)
            };
        });
    }

    /*
     *  Function to call in the event that the user wants to remove a course from the sequence
     *      param coursePosition - object indicating the new absolute position of the course within the sequence
     *                             required properties: yearIndex, season, courseIndex
     */
    removeCourse(coursePosition){
        this.setState((prevState) => {

            let removeCommand = {
                yearList: {
                    [coursePosition.yearIndex]: {
                        [coursePosition.season]: {
                            courseList: {$splice: [[coursePosition.courseIndex, 1]]}
                        }
                    }
                }
            };

            return {
                courseSequenceObject: update(prevState.courseSequenceObject, removeCommand)
            };
        });
    }

    /*
     *  Performs an undo or redo operation
     *      param isShiftKeyPressed - will do a redo op if shift is pressed, otherwise will do undo op
     */
    performUndoRedo(isShiftKeyPressed){
        let changedCurrentPosition = false;
        if(isShiftKeyPressed){
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
                courseSequenceObject: this.courseSequenceHistory.history[this.courseSequenceHistory.currentPosition]
            });
        }
    }

    /*
     *  Function to call in the event that the user selects an item from a list of choice courses (AKA orList)
     *      param coursePosition - object indicating the absolute position of the course within the sequence
     *                             required properties: yearIndex, season, courseIndex, orListIndex
     */
    setOrListCourseSelected(coursePosition){
        this.setState((prevState) => {

            // update isSelected property of items in orList in question
            let orList = prevState.courseSequenceObject.yearList[coursePosition.yearIndex][coursePosition.season].courseList[coursePosition.courseIndex];

            let orListUpdateCommand = {};

            orList.forEach((courseObj, orListIndex) => {
                orListUpdateCommand[orListIndex] = {
                    isSelected: {$set: (orListIndex === coursePosition.orListIndex)}
                };
            });

            let newOrList = update(orList, orListUpdateCommand);

            let fullUpdateCommand = {
                yearList: {
                    [coursePosition.yearIndex]: {
                        [coursePosition.season]: {
                            courseList: {
                                [coursePosition.courseIndex]: {$set: newOrList}
                            }
                        }
                    }
                }
            };

            return {
                courseSequenceObject: update(prevState.courseSequenceObject, fullUpdateCommand)
            };
        });
    }

    /*
     *  Function to call in the event that the user toggles whether a semester is a work term or not
     *      param yearIndex - index of the year of the semester
     *      param season - the season of the semester
     */
    toggleWorkTerm(yearIndex, season){
        this.setState((prevState) => {
            let newValue = prevState.courseSequenceObject.yearList[yearIndex][season].isWorkTerm === "true" ? "false" : "true";
            return {
                courseSequenceObject: update(prevState.courseSequenceObject, {
                    yearList: {
                        [yearIndex]: {
                            [season]: {
                                isWorkTerm: {$set: newValue}
                            }
                        }
                    }
                })
            };
        });
    }

    /*
    *  Position style map mutators:
    */

    /*
     *  Function to call in the event that the user hovers over a sequence validation results item
     *      param positions - array of objects indicating the absolute position of the course within the sequence
     */
    highlightCourses(positions){
        this.enableStyleOnPositions(positions, "isHighlighted", true);
    }

    /*
     *  Function to call in the event that the user hovers out of a sequence validation results item
     *      param positions - array of objects indicating the absolute position of the course within the sequence
     */
    unhighlightCourses(positions){
        this.enableStyleOnPositions(positions, "isHighlighted", false);
    }

    /*
     *  Function to call in the event that the user clicks on a course
     *      param position - object indicating the absolute position of the course within the sequence
     */
    toggleCourseSelection(position){
        this.toggleStyleOnPositions([position], "isSelected");
    }

    /*
     *  function to call in the event that the user clicks on something other than a course
     */
    unselectAllCourses(){
        this.disableStyleOnAllPositions("isSelected");
    }

    /*
     *  Enable/disable boolean property for a specific position in the positionStyleMap
     *      param position - the position of the item that is to be styled
     *      param styleName - the name of the property
     *      param enabled - the boolean value to assign to the property
     */
    enableStyleOnPositions(positions, styleName, enabled){
        this.setState((prevState) => {
            let updateCommand = {};
            positions.forEach((position) => {
                updateCommand[positionToString(position)] = {$auto: {
                        [styleName]: {$auto: {$set: enabled}}
                    }
                };
            });
            return {
                positionStyleMap: update(prevState.positionStyleMap, updateCommand),
            }
        });
    }

    /*
     *  Toggle boolean property for a specific position in the positionStyleMap
     *      param position - the position of the item that is to be styled
     *      param styleName - the name of the property
     */
    toggleStyleOnPositions(positions, styleName){
        this.setState((prevState) => {
            let updateCommand = {};
            positions.forEach((position) => {
                updateCommand[positionToString(position)] = {$auto: {
                        $toggle: [styleName]
                    }
                };
            });
            return {
                positionStyleMap: update(prevState.positionStyleMap, updateCommand),
            }
        });
    }

    /*
     *  Set boolean property to false on all positions in positionStyleMap
     *      param styleName - the name of the property
     */
    disableStyleOnAllPositions(styleName){
        this.setState((prevState) => {
            let updateCommand = {};
            Object.keys(prevState.positionStyleMap).forEach((positionString) => {
                updateCommand[positionString] = {$auto: {
                        [styleName]: {$auto: {$set: false}}
                    }
                };
            });
            return {
                positionStyleMap: update(prevState.positionStyleMap, updateCommand),
            }
        });
    }

    /*
    *  Event handlers
    */

    /*
     *  Event handler for cursor movement on touch devices
     */
    handleTouchMove(touchMoveEvent){
        this.performAutoScroll(touchMoveEvent.changedTouches[0].clientY, touchMoveEvent.view.innerHeight);
    }

    /*
     *  Event handler for cursor movement on mouse devices
     */
    handleMouseMove(mouseMoveEvent){
        this.performAutoScroll(mouseMoveEvent.clientY, mouseMoveEvent.view.innerHeight);
    }

    /*
     *  Event handler for key presses
     */
    handleKeyPress(keyDownEvent){
        if(keyDownEvent.keyCode === 90 && keyDownEvent.ctrlKey){
            this.performUndoRedo(keyDownEvent.shiftKey);
        }
    }

    /*
     *  Event handler for page scrolling
     */
    handleScroll(){
        // detatch the IOPanel if we scroll lower than 80px
        this.setState({
            detachIOPanel: window.scrollY > 80
        });
    }

    /*
     * Function to call in the event that a course item is clicked on
     *     param courseCode - the code of the clicked course; will load it's info if defined
     *     param coursePosition - the position in the sequence of the course or orList
     */
    handleCourseClick(courseCode, coursePosition){
        this.toggleCourseSelection(coursePosition);
        if(courseCode){
            this.loadCourseInfo(courseCode);
        }
    }

    /*
    *  Auxiliary functions
    */

    /*
     *  Function to call when the users starts or stops dragging any item
     *      param isDragging - true if the user is dragging something
     */
    setDragState(isDragging){
        this.enableTextSelection(!isDragging);
        this.enableGarbage(isDragging);
        this.isDragging = isDragging;
    }

    /*
     *  Function to call to disable text selection on the page
     *  used to fix an issue in firefox where text on the page gets highlighted while dragging a course
     *      param enabled - should the garbage can be enabled
     */
    enableTextSelection(enabled){
        this.setState({
            allowingTextSelection: enabled
        });
    }

    /*
     *  Function to call when we want to display the garbage can and allow the user to delete a course
     *      param enabled - should the garbage can be enabled
     */
    enableGarbage(enabled){
        this.setState({
            showingGarbage: enabled
        });
    }

    /*
     *  Function to call in the event that the user selects a new program of study
     *      param newChosenProgram - the name of the chosen program (e.g. SOEN-General-Coop);
     *                               directly links to _id value of sequence in courseSequences DB
     */
    updateChosenProgram(newChosenProgram){

        // remember the program selected by the user
        newChosenProgram ? localStorage.setItem("chosenProgram", newChosenProgram) :
            localStorage.removeItem("chosenProgram");
        // clear the saved sequence to force a reloading of the user's chosen program
        localStorage.removeItem("savedSequence");

        // Must use the callback param of setState to ensure the chosenProgram is changed in time
        this.setState({chosenProgram: newChosenProgram}, this.loadCourseSequenceObject);
    }

    /*
     *  Function to call in the event that the user wishes to select a different program of study
     *  TODO: (INSERT CONFIRM BOX HERE - MAKE SURE USER DOESN'T LOSE THEIR WORK BY ACCIDENTALLY CHANGING PROGRAMS)
     */
    resetProgram(){
        this.updateChosenProgram(undefined);
    }

    /*
     *  Function to call when we want to display the garbage can and allow the user to delete a course
     *      param enabled - should the garbage can be enabled
     */
    enableGarbage(enabled){
        this.setState({
            showingGarbage: enabled
        });
    }

    /*
     *  Function which decides whether or not the page should scroll based on the position of the user's cursor
     *  and initiates automatic page scrolling accordingly
     *      param y - number indicating the y coordinate of the user's cursor, where the top of the page is y = 0
     *      param pageHeight - number indicating the total height of the page in pixels
     */
    performAutoScroll(y, pageHeight){
        if(this.isDragging){
            let scrollAreaHeight = pageHeight * AUTO_SCROLL_PAGE_PORTION;

            if(y > scrollAreaHeight && y < pageHeight - scrollAreaHeight){
                this.shouldScroll = false;
                return;
            }

            // don't call scrollPage if it's already running
            if(this.shouldScroll){
                return;
            }

            if(y <= scrollAreaHeight){
                this.scrollDirection = -1;
                this.shouldScroll = true;
                this.scrollPage();
            }
            if(y >= pageHeight - scrollAreaHeight){
                this.scrollDirection = 1;
                this.shouldScroll = true;
                this.scrollPage();
            }
        } else {
            this.shouldScroll = false;
        }
    }

    /*
     *  Recursive function which continuously scrolls up or down the page until this.shouldScroll becomes false
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
     *  Function to call when we want to display the feedback box dialog
     */
    showFeedbackBox() {
        this.setState({
            showingFeedbackBox: true
        });
    }

    /*
     *  Function to call when we want to hide the feedback box dialog
     */
    closeFeedBackBox() {
        this.setState({
            showingFeedbackBox: false
        });
    }

    /*
     *  Backend API calls:
     */

    // Load chosen sequence via backend request if we don't find one that's already saved
    loadCourseSequenceObject(){

        if(!this.state.chosenProgram){
            return;
        }

        // set the courseSequenceObject to loading state then load its data
        this.setState({courseSequenceObject : {
            isLoading: true
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
                        this.setState({courseSequenceObject : courseSequenceObject});
                        localStorage.setItem("savedSequence", JSON.stringify(courseSequenceObject));
                    }
                });

            } else {
                this.setState({courseSequenceObject : courseSequenceObject});
            }
        });
    }

    // This function gets called only once, when the page loads
    loadAllSequences(){
        $.ajax({
            type: "GET",
            url: "api/allsequences",
            success: (response) => {
                this.setState({allSequences : JSON.parse(response)});
            }
        });
    }

    /*
     *  function to call in the event that the user selects a course such as by clicking on it
     *      param courseCode - the code of the chosen course
     */
    loadCourseInfo(courseCode){
        this.setState({selectedCourseInfo : {
            isLoading : true
        }}, () => {
            $.ajax({
                type: "POST",
                url: "api/courseinfo",
                data: JSON.stringify({"code" : courseCode}),
                success: (response) => {
                    this.setState({selectedCourseInfo : JSON.parse(response)});
                }
            });
        });
    }

    /*
     *  function to call in the event that the user wishes to export their current sequence
     *      param exportType - string which indicates what file type to export to
     */
    exportSequence(exportType){

        let requestExportType = "";
        if(exportType === EXPORT_TYPES.EXPORT_TYPE_LIST_PDF || exportType === EXPORT_TYPES.EXPORT_TYPE_LIST_MD){
            requestExportType = "list";
        } else if(exportType === EXPORT_TYPES.EXPORT_TYPE_TABLE_PDF || exportType === EXPORT_TYPES.EXPORT_TYPE_TABLE_HTML){
            requestExportType = "table";
        }

        let sequenceInfo = this.state.courseSequenceObject.sequenceInfo;
        let minTotalCredits = this.state.courseSequenceObject.minTotalCredits;
        let programName = generatePrettyProgramName(sequenceInfo.program, sequenceInfo.option, sequenceInfo.entryType, minTotalCredits);

        this.setState({
            loadingExport: true
        }, () =>{
            $.ajax({
                type: "POST",
                url: "api/export",
                data: JSON.stringify({
                    courseSequenceObject : this.state.courseSequenceObject,
                    exportType: requestExportType,
                    programName: programName
                }),
                success: (response) => {

                    let downloadUrl = JSON.parse(response).exportPath;

                    let extension = "pdf";
                    if(exportType === EXPORT_TYPES.EXPORT_TYPE_LIST_MD){
                        extension = "md";
                    }
                    if(exportType === EXPORT_TYPES.EXPORT_TYPE_TABLE_HTML){
                        extension = "html";
                    }

                    downloadUrl = downloadUrl.replace("pdf", extension);

                    saveAs(downloadUrl, "MySequence." + extension);

                    this.setState({loadingExport : false});
                }
            });
        });
    }

    /*
     *  function to call in the event that the user changes their sequence. 
     *  validates the sequence via backend API and update the page state accordingly
     */
    validateSequence(){
        this.setState((prevState) => {
            return {
                validationResults: update(prevState.validationResults, {isLoading: {$set: true}})
            }
        }, () => {
            $.ajax({
                type: "POST",
                url: "api/validate",
                data: JSON.stringify({courseSequenceObject : this.state.courseSequenceObject}),
                success: (res) => {
                    let response = JSON.parse(res);
                    this.setState({
                        validationResults: {
                            issues: response.issues,
                            warnings: response.warnings,
                            isValid: response.isValid,
                            isLoading: false
                        }
                    });
                }
            });
        });
    }
}

export default DragDropContext(TouchBackend({enableMouseEvents: true}))(MainPage);