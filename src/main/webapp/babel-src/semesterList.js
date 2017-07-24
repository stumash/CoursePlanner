import React from "react";
import {SemesterBox} from "./semesterBox";
import {SEASON_NAMES} from "./util";

/*
 *  List which contains all courses of current sequence
 *  This view is to be displayed for smaller screens (<sm)
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

            return yearList.map((year, yearNumber) =>
                {SEASON_NAMES.map((season) =>
                    <div className="semesterListItem col-xs-12" key={season + "" + yearNumber}>
                        <div className="semesterID text-center col-xs-8 col-xs-offset-2">{season + " " + yearNumber}</div>
                        <SemesterBox year={yearNumber} season={season} semester={yearList[yearNumber][season]}/>
                    </div>
                )}
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