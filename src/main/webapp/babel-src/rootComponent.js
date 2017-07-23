import React from "react";
import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import {ControlCenter} from "./controlCenter";

export const DEFAULT_PROGRAM = "SOEN-General-Coop";

export class RootComponent extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            "courseSequenceObject" : {
                "isLoading" : true
            },
            "sequenceType" : localStorage.getItem("sequenceType") || DEFAULT_PROGRAM
        };
        this.updateSequenceType = this.updateSequenceType.bind(this);
    }

    componentDidMount() {
        this.loadCourseSequenceObject();
    }

    updateSequenceType(newSequenceType){

        // INSERT CONFIRM BOX HERE - MAKE SURE USER DOESNT LOSE THEIR WORK

        localStorage.setItem("sequenceType", newSequenceType);
        localStorage.removeItem("savedSequence");

        this.setState({"sequenceType": newSequenceType}, this.loadCourseSequenceObject);
    }

    loadCourseSequenceObject(){

        var courseSequenceObject = JSON.parse(localStorage.getItem("savedSequence"));

        if(courseSequenceObject === null){


            var requestBody = {
                "sequenceID": this.state.sequenceType
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
                    <ControlCenter onChangeSequenceType={this.updateSequenceType} sequenceType={this.state.sequenceType}/>
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