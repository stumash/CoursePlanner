import React from "react";
import CircularProgress from 'material-ui/CircularProgress';

import SemesterBox from "./semesterBox";
import {SEASON_NAMES} from "./util";
import {SEASON_NAMES_PRETTY} from "./util";

/*
 *  List which contains all courses of current sequence
 *  Alternative to the SemesterTable view. To be displayed for smaller screens (<sm)
 *
 *  Expects props:
 *
 *  courseSequenceObject - the json object which contains all necessary data for the sequence we want to display
 *
 *  onSelectCourse - see MainPage.loadCourseInfo
 *  onOrListSelection - see MainPage.setOrListCourseSelected
 *  onToggleWorkTerm - see MainPage.toggleWorkTerm
 *  onMoveCourse - see MainPage.moveCourse
 *  onChangeDragState - see MainPage.enableGarbage
 *
 */
export class SemesterList extends React.Component {

    generateListBody(){

        if(this.props.courseSequenceObject.isLoading){
            return <CircularProgress size={80} thickness={7}/>;
        }

        const yearList = this.props.courseSequenceObject.yearList;

        return yearList.map((year, yearIndex) =>
            SEASON_NAMES.map((season, seasonIndex) =>
                <div className="semesterListItem col-xs-12" key={season + "" + yearIndex}>
                    <div className="semesterID text-center col-xs-8 col-xs-offset-2">{SEASON_NAMES_PRETTY[seasonIndex] + " " + (yearIndex + 1)}</div>
                    <SemesterBox yearIndex={yearIndex}
                                 season={season}
                                 semester={yearList[yearIndex][season]}
                                 onSelectCourse={this.props.onSelectCourse}
                                 onOrListSelection={this.props.onOrListSelection}
                                 onToggleWorkTerm={this.props.onToggleWorkTerm}
                                 onMoveCourse={this.props.onMoveCourse}
                                 onAddCourse={this.props.onAddCourse}
                                 onChangeDragState={this.props.onChangeDragState}/>
                </div>
            )
        );
    }

    render() {
        return (
            <div className="semesterList text-center">
                {this.generateListBody()}
            </div>
        );
    }
}