import React from "react";
import {EXPORT_TYPES} from "./util";
import {UI_STRINGS} from "./util";

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
 *  onChangeChosenProgram - see MainPage.updateChosenProgram
 *
 */
export class IOPanel extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleSequenceSelection = this.handleSequenceSelection.bind(this);
    }

    handleSequenceSelection(event){
        this.props.onChangeChosenProgram(event.currentTarget.value);
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
                    <option>{UI_STRINGS.PROGRAM_LIST_LOADING}</option>
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
                                                UI_STRINGS.COURSE_INFO_HINT}
            </pre>
        );
    }

    render() {
        return (
            <div className="ioCenter">
                <div className="logoContainer panel panel-default text-center">
                    <div className="panel-body">{UI_STRINGS.SITE_NAME}</div>
                </div>
                <div className="courseInfoPanel panel panel-default">
                    <div className="panel-heading">{UI_STRINGS.COURSE_INFO_HEADER}</div>
                    <div className="panel-body">
                        {this.renderCourseInfo()}
                    </div>
                </div>
                <div className="validationResultsPanel panel panel-default">
                    <div className="panel-heading">{UI_STRINGS.VALIDATION_HEADER}</div>
                    <div className="panel-body">
                        {UI_STRINGS.VALIDATION_SUCCESS_MSG}
                    </div>
                </div>
                <div className="programSelect">
                    {this.renderSelectionBox()}
                </div>
                <div className="export btn-group">
                    <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown">
                        {UI_STRINGS.EXPORT_BTN_TEXT} <span className="caret"></span>
                    </button>
                    <ul className="dropdown-menu">
                        {EXPORT_TYPES.map((exportType) =>
                            <li key={exportType}><a onClick={() => this.exportSequence(exportType)}>to {exportType}</a></li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }

    /*
    *  Backend API calls:
    */

    exportSequence(exportType){
        console.log("Should export to " + exportType);
    }

}