import React from "react";
import ReactDOM from "react-dom";
import {SemesterGridContainer} from "./semesterGrid";
import {ControlCenter} from "./controlCenter";

class RootComponent extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-sm-3 col-xs-12">
                    <ControlCenter/>
                </div>
                <div className="col-sm-9 col-xs-12">
                    <SemesterGridContainer/>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <RootComponent />,
    document.getElementById("react-root")
);