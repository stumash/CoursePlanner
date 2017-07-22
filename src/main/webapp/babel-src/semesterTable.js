import React from "react";
import {SemesterBox} from "./semesterBox";

const SEASON_NAMES = ["Fall", "Winter", "Summer"];

export class SemesterTable extends React.Component {

    constructor(props){
        super(props);
        this.numberOfYears = 4;
        this.yearArray = [];
        for(let i = 1; i <= this.numberOfYears; i++){
            this.yearArray.push(i);
        }
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
                    {this.yearArray.map((year) =>
                        <tr key={year}>
                            <td className="text-center">{year}</td>
                            {SEASON_NAMES.map((season) =>
                                <td key={season}>
                                    <SemesterBox year={year} season={season}/>
                                </td>
                            )}
                        </tr>
                    )}
                </tbody>
            </table>
        );
    }
}