import React from "react";
import {EXPORT_TYPES} from "./util";
import {UI_STRINGS} from "./util";
import {SearchBox} from "./searchBox";
import Course from "./course";
import GarbageCan from "./garbageCan"

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
 *  loadingExport - boolean which tells us if were currently waiting for an export to finish
 *
 *  onChangeChosenProgram - see MainPage.updateChosenProgram
 *  exportSequence - see MainPage.exportSequence
 *  onSearchCourse - see MainPage.loadCourseInfo
 *  onRemoveCourse - see MainPage.removeCourse
 *
 */
export class IOPanel extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleSequenceSelection = this.handleSequenceSelection.bind(this);
        this.onClickSearchButton = this.onClickSearchButton.bind(this);
    }

    handleSequenceSelection(event){
        this.props.onChangeChosenProgram(event.currentTarget.value);
    }

    onClickSearchButton(event){
        this.props.onSearchCourse($(".courseSearch .searchBox")[0].value.toUpperCase());
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
                    <option>{UI_STRINGS.LIST_LOADING}</option>
                </select>
            );
        }
    }

    renderCourseInfo(){

        let courseInfo = this.props.courseInfo;

        if(courseInfo.isLoading){
            return <div className="text-center"><span className="smallLoadingSpinner glyphicon glyphicon-refresh glyphicon-spin"></span></div>;
        }

        if(!courseInfo.code){
            return <div className="text-center">{UI_STRINGS.COURSE_INFO_HINT}</div>;
        }

        return (
            <div>
                <Course courseObj={courseInfo}
                        isDraggable={true}
                        onCourseClick={this.props.onSearchCourse}/>
                <pre>{JSON.stringify(this.props.courseInfo, undefined, 2)}</pre>
            </div>
        );
    }

    render() {
        return (
            <div className="ioPanel">
                <div className="logoContainer panel panel-default text-center">
                    <div className="panel-body">
                        {!this.props.showingGarbage ? <div>{UI_STRINGS.SITE_NAME}</div> : <GarbageCan onRemoveCourse={this.props.onRemoveCourse}/>}
                    </div>
                </div>
                <div className="courseSearch input-group">
                    <SearchBox onConfirmSearch={this.props.onSearchCourse}/>
                    <span className="input-group-btn">
                        <button className="btn btn-default" type="button" onClick={this.onClickSearchButton}>
                            <span className="glyphicon glyphicon-search"></span>
                        </button>
                    </span>
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
                            <li key={exportType}><a onClick={() => this.props.exportSequence(exportType)}>to {exportType}</a></li>
                        )}
                    </ul>
                    {this.props.loadingExport && <span className="smallLoadingSpinner glyphicon glyphicon-refresh glyphicon-spin"></span>}
                </div>
            </div>
        );
    }
}