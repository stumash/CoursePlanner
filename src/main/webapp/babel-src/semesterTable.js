import React from "react";
import {SemesterBox} from "./semesterBox";
import {SEASON_NAMES} from "./util";
import {SEASON_NAMES_PRETTY} from "./util";

/*
 *  Table which contains all courses of current sequence
 *  Alternative to the SemesterList view. To be displayed for larger screens (>=sm)
 *
 *  Expects props:
 *
 *  courseSequenceObject - the json object which contains all necessary data for the sequence we want to display
 *
*/
export class SemesterTable extends React.Component {

    generateTableBody(){

        if(!this.props.courseSequenceObject.isLoading){

            const yearList = this.props.courseSequenceObject.yearList;

            return yearList.map((year, yearIndex) =>
                <tr key={yearIndex}>
                    <td className="text-center">{(yearIndex + 1)}</td>
                    {SEASON_NAMES.map((season) =>
                        <td key={season}>
                            <SemesterBox semester={yearList[yearIndex][season]}/>
                        </td>
                    )}
                </tr>
            );
        }
    }

    generateTableHead(){
        return (
            <tr>
                <th className="text-center">Year</th>
                {SEASON_NAMES_PRETTY.map((season) =>
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