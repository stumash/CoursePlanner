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

    render() {
        return (
            <div className="semesterList">
                {this.yearArray.map((year) =>
                    {return SEASON_NAMES.map((season) =>
                            <div className="semesterListItem col-xs-12">
                                <div className="semesterID text-center col-xs-8 col-xs-offset-2">
                                    {season + " " + year}
                                </div>
                                <SemesterBox key={season + " " + year} year={year} season={season}/>
                            </div>
                    )}
                )}
            </div>
        );
    }
}