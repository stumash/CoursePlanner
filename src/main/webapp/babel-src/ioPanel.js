import React from "react";

/*
 *  Rectangular area which contains widgets/views relevant to user input and output
 *
 *  Expects props:
 *
 *  allSequences - array containing the name of all recommended sequences available in DB
 *
 *  chosenProgram - string representing the recommended sequence chosen by the user
 *
 *  courseInfo - json object containing the info of a course - directly pulled from DB
 *
 *  onChangeChosenProgram(chosenProgram) - function to call in the event that the user changes their chosen program
 *      param chosenProgram - the name of the new program
 *
 */
export class IOPanel extends React.Component {

    constructor(props){
        super(props);
        this.handleSequenceSelection = this.handleSequenceSelection.bind(this);
    }

    handleSequenceSelection(event){
        // event.target.value holds the new value selected by the user
        this.props.onChangeChosenProgram(event.target.value);
    }

    renderSelectionBox(){
        if(this.props.allSequences.length > 0){
            return (
                <select className="form-control" onChange={this.handleSequenceSelection} value={this.props.chosenProgram}>
                    {this.props.allSequences.map((sequenceName) =>
                        <option key={sequenceName}>{sequenceName}</option>
                    )}
                </select>
            );
        } else {
            return (
                <select className="form-control" onChange={this.handleSequenceSelection} disabled="disabled">
                    <option>Loading...</option>
                </select>
            );
        }
    }

    renderCourseInfo(){

        if(this.props.courseInfo.isLoading){
            return <span className="glyphicon glyphicon-refresh glyphicon-spin"></span>;
        }

        return (
            <pre>
                {(this.props.courseInfo.code) ? JSON.stringify(this.props.courseInfo, undefined, 2) :
                                                "Click on or search for a course to display its info"}
            </pre>
        );
    }

    render() {
        return (
            <div className="ioCenter">
                <div className="logoContainer panel panel-default text-center">
                    <div className="panel-body">Conu Course Planner</div>
                </div>
                <div className="courseInfoPanel panel panel-default">
                    <div className="panel-heading">Course Info</div>
                    <div className="panel-body">
                        {this.renderCourseInfo()}
                    </div>
                </div>
                <div className="courseInfoPanel panel panel-default">
                    <div className="panel-heading">Sequence Validation</div>
                    <div className="panel-body">
                        Sequence is valid
                    </div>
                </div>
                <div className="">
                    {this.renderSelectionBox()}
                </div>
            </div>
        );
    }
}