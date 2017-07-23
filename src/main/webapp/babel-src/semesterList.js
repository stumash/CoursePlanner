import React from "react";
import {SemesterBox} from "./semesterBox";

const SEASON_NAMES = ["Fall", "Winter", "Summer"];

export class SemesterList extends React.Component {

    constructor(props){
        super(props);
        // Ignore this BS - it will be replaced by a traversal of our json data
        this.numberOfYears = 4;
        this.yearArray = [];
        for(let i = 1; i <= this.numberOfYears; i++){
            this.yearArray.push(i);
        }
    }

    generateListBody(){

        if(!this.props.courseSequenceObject.isLoading){

            const semesterList = this.props.courseSequenceObject.semesterList;

            let filledSemesterList = this.fillMissingSemesters(semesterList);

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
            <div>
                {this.generateListBody()}
                {/*{this.yearArray.map((year) =>*/}
                    {/*{return SEASON_NAMES.map((season) =>*/}
                        {/*<div className="semesterListItem col-xs-12">*/}
                            {/*<div className="semesterID text-center col-xs-8 col-xs-offset-2">*/}
                                {/*{season + " " + year}*/}
                            {/*</div>*/}
                            {/*<SemesterBox key={season + " " + year} year={year} season={season}/>*/}
                        {/*</div>*/}
                    {/*)}*/}
                {/*)}*/}
            </div>
        );
    }
}