import React from "react";
import ReactDOM from "react-dom";
import {SemesterGridView} from "./semesterGrid";
import {ControlCenterView} from "./controlCenter";

class RootComponent extends React.Component {
    render() {
        return (
            <div className="row">
                <div className = "controlCenter col-lg-3 col-md-3 col-sm-3 col-xs-3">
                    <ControlCenterView />
                </div>
                <div className = "semesterGrid col-lg-9 col-md-9 col-sm-9 col-xs-9">
                    <SemesterGridView />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <RootComponent />,
    document.getElementById("root")
);