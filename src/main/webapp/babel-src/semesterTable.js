import React from "react";
import {SemesterBox} from "./semesterBox";
import {fillMissingSemesters} from "./util";
import {SEASON_NAMES} from "./util";

/*
 *  Table which contains all courses of current sequence
 *  This view is to be displayed for larger screens (>=sm)
 *
 *  Expects props:
 *
 *  courseSequenceObject - the json object which contains all necessary data for the sequence we want to display
 *
*/
export class SemesterTable extends React.Component {

    generateTableBody(){

        if(!this.props.courseSequenceObject.isLoading){

            const semesterList = this.props.courseSequenceObject.semesterList;

            let filledSemesterList = fillMissingSemesters(semesterList);
            let tableContent = [];

            for(let year = 1; year <= (Math.ceil(filledSemesterList.length/3)); year++){
                tableContent.push(
                    <tr key={year}>
                        <td className="text-center">{year}</td>
                        {SEASON_NAMES.map((season, seasonIndex) =>
                            {
                                let currentSemester = filledSemesterList[((year-1)*3)+seasonIndex] || {};
                                if(currentSemester){
                                    return (
                                        <td key={season}>
                                            <SemesterBox year={year} season={season} semester={currentSemester}/>
                                        </td>
                                    );
                                } else {
                                    return (<td key={season}></td>);
                                }
                            }

                        )}
                    </tr>
                );
            }

            return tableContent;
        }
    }

    generateTableHead(){
        return (
            <tr>
                <th className="text-center">Year</th>
                {SEASON_NAMES.map((season) =>
                    <th className="text-center" key={season}>{season}</th>
                )}
            </tr>
        );
    }

    render() {
        return (
            <table className="semesterTable table table-hover table table-bordered" >
                <thead>
                    {this.generateTableHead()}
                </thead>
                <tbody>
                    {this.generateTableBody()}
                </tbody>
            </table>
        );
    }
}