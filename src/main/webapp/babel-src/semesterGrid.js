import React from "react";

export class SemesterGridView extends React.Component {

    constructor(props){
        super(props);
        this.numberOfYears = 4;
    }

    generateYearRows(){
        let yearArray = [];
        for(let i = 1; i <= this.numberOfYears; i++){
            yearArray.push(i);
        }
        return yearArray.map((yearID) =>
            <YearRow yearNum={yearID} key={yearID}/>
        );
    }

    render() {
        return (
            <div>
                {this.generateYearRows()}
            </div>
        );
    }
}

class YearRow extends React.Component {

    constructor(props){
        super(props);
        this.seasons = ["fall", "winter", "summer"];
    }

    generateYearRow(){
        return this.seasons.map((season) => {
            let semesterID = season + " " + this.props.yearNum;
            return <SemesterBox semesterID={semesterID} key={semesterID} season={season}/>;
        });
    }

    render(){
        return (
            <div className="row">
                {this.generateYearRow()}
            </div>
        );
    }
}

class SemesterBox extends React.Component {

    generateSemesterItems(){
        let courses = ["COMP 248", "COMP 249", "COMP 352", "COMP 348"];
        return courses.map((course) => {
            return <SemesterItem course={course} key={course} />
        });
    }

    render() {
        //let offset = (this.props.season === "fall") ? "col-lg-offset-3 col-md-offset-3 col-sm-offset-3" : "";
        return (
            <div className={"semesterBox col-lg-4 col-md-4 col-sm-4 col-xs-12"}>
                <div className="semesterList">
                    {this.generateSemesterItems()}
                </div>
            </div>
        );
    }
}

class SemesterItem extends React.Component {
    render() {
        return (
            <div className="semesterItem">
                {this.props.course + ", 3.0"}
            </div>
        );
    }
}