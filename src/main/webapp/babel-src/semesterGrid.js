import React from "react";

const seasonNames = ["Fall", "Winter", "Summer"];

export class SemesterGridContainer extends React.Component {

    constructor(props){
        super(props);
        this.numberOfYears = 4;
    }

    render() {
        return (
            <div className="semesterGridContainer">
                <div className="row">
                    <div className="columnNames col-xs-12">
                        <div className="columnName text-center col-xs-1 hidden-xs">
                            Year
                        </div>
                        <div className="seasonNames col-xs-11 hidden-xs">
                            <div className="row">
                                {seasonNames.map((season) =>
                                    <div className="columnName text-center col-xs-4" key={season}>
                                        {season}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <SemesterGrid numberOfYears={this.numberOfYears}/>
                </div>
            </div>
        );
    }
}

class SemesterGrid extends React.Component {

    constructor(props){
        super(props);
        this.yearArray = [];
        for(let i = 1; i <= this.props.numberOfYears; i++){
            this.yearArray.push(i);
        }
    }

    render() {
        return (
            <div className="semesterGrid">
                {this.yearArray.map((year) =>
                    <YearRow year={year} key={year}/>
                )}
            </div>
        );
    }
}

class YearRow extends React.Component {
    render(){
        return (
            <div className="row">
                <div className="yearNumber text-center col-xs-1 hidden-xs">
                    {this.props.year}
                </div>
                <div className="col-xs-11">
                    {seasonNames.map((season) =>
                        <SemesterBox key={season} season={season} year={this.props.year}/>
                    )}
                </div>
            </div>
        );
    }
}

class SemesterBox extends React.Component {
    render() {
        return (
            <div className={"semesterBox col-sm-4 col-xs-12"}>
                <div className="row">
                    <div className="yearNumber text-center col-xs-8 col-xs-offset-2 visible-xs">
                        {this.props.season + " " + this.props.year}
                    </div>
                    <div className="semesterList col-xs-10 col-xs-offset-1">
                        {["COMP 248", "COMP 249", "COMP 352", "COMP 348"].map((course) =>
                            <div className="semesterItem text-center" key={course}>
                                {course + ", 3.0"}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}