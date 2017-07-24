import React from "react";
import {SemesterBox} from "./semesterBox";
import {fillMissingSemesters} from "./util";
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

            const semesterList = this.props.courseSequenceObject.semesterList;

            let filledSemesterList = fillMissingSemesters(semesterList);

            let listContent = [];

            for(let year = 1; year <= (Math.ceil(filledSemesterList.length/3)); year++){
                SEASON_NAMES.forEach((season, seasonIndex) =>
                    {
                        let currentSemester = filledSemesterList[((year-1)*3)+seasonIndex] || {};
                        if(currentSemester){
                            listContent.push(
                                <div className="semesterListItem col-xs-12" key={season + "" + year}>
                                    <div className="semesterID text-center col-xs-8 col-xs-offset-2">{season + " " + year}</div>
                                    <SemesterBox year={year} season={season} semester={currentSemester}/>
                                </div>
                            );
                        } else {
                            listContent.push(<td key={season}></td>);
                        }
                    }

                );
            }

            return listContent;
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