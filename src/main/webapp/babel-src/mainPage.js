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
        this.updateChosenProgram = this.updateChosenProgram.bind(this);
        this.loadCourseInfo = this.loadCourseInfo.bind(this);
    }

    componentDidMount() {
        this.loadCourseSequenceObject();
        this.loadAllSequences();
    }

    updateChosenProgram(newChosenProgram){

        // remember the program selected by the user
        localStorage.setItem("chosenProgram", newChosenProgram);
        // clear the saved sequence to force a reloading of the user's chosen program
        // (INSERT CONFIRM BOX HERE - MAKE SURE USER DOESN'T LOSE THEIR WORK BY ACCIDENTALLY CHANGING PROGRAMS)
        localStorage.removeItem("savedSequence");

        // Must use the callback param of setState to ensure the chosenProgram is changed in time
        this.setState({"chosenProgram": newChosenProgram}, this.loadCourseSequenceObject);
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-3 col-xs-12">
                    <IOPanel courseInfo={this.state.selectedCourseInfo} allSequences={this.state.allSequences} chosenProgram={this.state.chosenProgram} onChangeChosenProgram={this.updateChosenProgram}/>
                </div>
                {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                <div className="col-sm-9 hidden-xs">
                    <SemesterTable onSelectCourse={this.loadCourseInfo} courseSequenceObject={this.state.courseSequenceObject}/>
                </div>
                <div className="col-xs-12 visible-xs">
                    <SemesterList onSelectCourse={this.loadCourseInfo} courseSequenceObject={this.state.courseSequenceObject}/>
                </div>
            </div>
        );
    }


    /*
    *  Backend API calls:
    */

    // Load chosen sequence via backend request if we don't find one that's already saved
    loadCourseSequenceObject(){

        var courseSequenceObject = JSON.parse(localStorage.getItem("savedSequence"));

        if(courseSequenceObject === null){

            var requestBody = {
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

    loadAllSequences(){
        $.ajax({
            type: "GET",
            url: "allsequences",
            success: (response) => {
                this.setState({"allSequences" : JSON.parse(response)});
            }
        });
    }

    loadCourseInfo(courseCode){
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