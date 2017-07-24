import React from "react";
import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import {ControlCenter} from "./controlCenter";
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
            "chosenProgram" : localStorage.getItem("chosenProgram") || DEFAULT_PROGRAM
        };
        this.updateChosenProgram = this.updateChosenProgram.bind(this);
    }

    componentDidMount() {
        this.loadCourseSequenceObject();
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
                    courseSequenceObject = JSON.parse(response).response;
                    this.setState({"courseSequenceObject" : courseSequenceObject});
                    localStorage.setItem("savedSequence", JSON.stringify(courseSequenceObject));
                }
            });

        } else {
            this.setState({"courseSequenceObject" : courseSequenceObject});
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-sm-3 col-xs-12">
                    <ControlCenter onChangeChosenProgram={this.updateChosenProgram} chosenProgram={this.state.chosenProgram}/>
                </div>
                {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                <div className="col-sm-9 hidden-xs">
                    <SemesterTable courseSequenceObject={this.state.courseSequenceObject}/>
                </div>
                <div className="col-xs-12 visible-xs">
                    <SemesterList courseSequenceObject={this.state.courseSequenceObject}/>
                </div>
            </div>
        );
    }
}