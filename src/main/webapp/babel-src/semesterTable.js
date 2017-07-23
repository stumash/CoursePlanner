import React from "react";
import {SemesterBox} from "./semesterBox";

const SEASON_NAMES = ["Fall", "Winter", "Summer"];

export class SemesterTable extends React.Component {

    constructor(props){
        super(props);
    }

    generateTableBody(){

        if(!this.props.courseSequenceObject.isLoading){

            const semesterList = this.props.courseSequenceObject.semesterList;

            let filledSemesterList = this.fillMissingSemesters(semesterList);

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

    fillMissingSemesters(semesterList){
        for(let i = 0; i < semesterList.length; i++){

            let expectedSeason = SEASON_NAMES[i%3].toLowerCase();

            if(!(semesterList[i].season === expectedSeason)){
                semesterList.splice(i, 0, {
                    "courseList" : [],
                    "isWorkTerm" : "false",
                    "season" : expectedSeason
                });
            }

        }
        return semesterList;
    }

    render() {
        return (
            <table className="semesterTable table table-bordered" >
                <thead>
                    <tr>
                        <th className="text-center">Year</th>
                        {SEASON_NAMES.map((season) =>
                            <th className="text-center" key={season}>{season}</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {this.generateTableBody()}
                </tbody>
            </table>
        );
    }
}