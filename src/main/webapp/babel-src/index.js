import React from "react";
import ReactDOM from "react-dom";
import {SemesterTable} from "./semesterTable";
import {SemesterList} from "./semesterList";
import {ControlCenter} from "./controlCenter";

class RootComponent extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-3 col-xs-12">
                    <ControlCenter />
                </div>
                {/* Show the SemesterTable for a normal screen and show the SemesterList for small screen */}
                <div className="col-sm-9 hidden-xs">
                    <SemesterTable />
                </div>
                <div className="col-xs-12 visible-xs">
                    <SemesterList />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <RootComponent />,
    document.getElementById("react-root")
);