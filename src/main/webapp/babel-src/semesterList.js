import React from "react";
import {SemesterBox} from "./semesterBox";
import {SEASON_NAMES} from "./util";

/*
 *  List which contains all courses of current sequence
 *  Alternative to the SemesterTable view. To be displayed for smaller screens (<sm)
 *
 *  Expects props:
 *
 *  courseSequenceObject - the json object which contains all necessary data for the sequence we want to display
 *
 */
export class SemesterList extends React.Component {

    generateListBody(){

        if(!this.props.courseSequenceObject.isLoading){

            const yearList = this.props.courseSequenceObject.yearList;

            return yearList.map((year, yearIndex) =>
                SEASON_NAMES.map((season) =>
                    <div className="semesterListItem col-xs-12" key={season + "" + yearIndex}>
                        <div className="semesterID text-center col-xs-8 col-xs-offset-2">{season + " " + (yearIndex + 1)}</div>
                        <SemesterBox semester={yearList[yearIndex][season]}/>
                    </div>
                )
            );
        }
    }

    render() {
        return (
            <div>
                {this.generateListBody()}
            </div>
        );
    }
}