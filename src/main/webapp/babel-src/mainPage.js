import React from "react";
import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import {IOPanel} from "./ioPanel";
import {DEFAULT_PROGRAM} from "./util";

/*
 *  Root component of our main page
 *
 *  This component loads up the saved/default sequence once it's created
 *
 */
export class MainPage extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            "courseSequenceObject" : {
                "isLoading" : true
            },
            "chosenProgram" : localStorage.getItem("chosenProgram") || DEFAULT_PROGRAM,
            "allSequences" : [],
            "selectedCourseInfo" : {}
        };

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.updateChosenProgram = this.updateChosenProgram.bind(this);
        this.loadCourseInfo = this.loadCourseInfo.bind(this);
        this.setOrListCourseSelected = this.setOrListCourseSelected.bind(this);
    }

    componentDidMount() {
        this.loadCourseSequenceObject();
        this.loadAllSequences();
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
        // (INSERT CONFIRM BOX HERE - MAKE SURE USER DOESN'T LOSE THEIR WORK BY ACCIDENTALLY CHANGING PROGRAMS)
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

            // update isSelected property of items in orList in question
            let orList = prevState.courseSequenceObject.yearList[coursePosition.yearIndex][coursePosition.season].courseList[coursePosition.courseListIndex];

            orList = orList.map((courseObj, orListIndex) => {
                courseObj.isSelected = (orListIndex === coursePosition.orListIndex);
                return courseObj;
            });

            // save change to local storage
            localStorage.setItem("savedSequence", JSON.stringify(prevState.courseSequenceObject));

            // set new state based on changes
            return {
                "courseSequenceObject": prevState.courseSequenceObject
            };
        });
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-3 col-xs-12">
                    <IOPanel courseInfo={this.state.selectedCourseInfo}
                             allSequences={this.state.allSequences}
                             chosenProgram={this.state.chosenProgram}
                             onChangeChosenProgram={this.updateChosenProgram}/>
                </div>
                {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                <div className="col-sm-9 hidden-xs">
                    <SemesterTable courseSequenceObject={this.state.courseSequenceObject}
                                   onSelectCourse={this.loadCourseInfo}
                                   onOrListSelection={this.setOrListCourseSelected}/>
                </div>
                <div className="col-xs-12 visible-xs">
                    <SemesterList courseSequenceObject={this.state.courseSequenceObject}
                                  onSelectCourse={this.loadCourseInfo}
                                  onOrListSelection={this.setOrListCourseSelected}/>
                </div>
            </div>
        );
    }

    /*
    *  Backend API calls:
    */

    // Load chosen sequence via backend request if we don't find one that's already saved
    loadCourseSequenceObject(){

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
                    this.setState({"courseSequenceObject" : courseSequenceObject});
                    localStorage.setItem("savedSequence", JSON.stringify(courseSequenceObject));
                }
            });

        } else {
            this.setState({"courseSequenceObject" : courseSequenceObject});
        }
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
        }});
        $.ajax({
            type: "POST",
            url: "courseinfo",
            data: JSON.stringify({"code" : courseCode}),
            success: (response) => {
                this.setState({"selectedCourseInfo" : JSON.parse(response)});
            }
        });
    }

}