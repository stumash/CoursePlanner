import React from "react";
import {DEFAULT_PROGRAM} from "./rootComponent";

export class ControlCenter extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            "sequenceList" : []
        };
        this.handleSequenceChange = this.handleSequenceChange.bind(this);
    }

    handleSequenceChange(event){
        this.props.onChangeSequenceType(event.target.value);
    }

    componentDidMount() {
        this.loadSequenceList();
    }

    loadSequenceList(){
        $.ajax({
            type: "GET",
            url: "sequencelist",
            success: (response) => {
                this.setState({"sequenceList" : JSON.parse(response)});
            }
        });
    }

    renderSelectionBox(){
        if(this.state.sequenceList.length > 0){
            return (
                <select className="form-control" onChange={this.handleSequenceChange} value={this.props.sequenceType}>
                    {this.state.sequenceList.map((sequenceName) =>
                        <option key={sequenceName}>{sequenceName}</option>
                    )}
                </select>
            );
        } else {
            return (
                <select className="form-control" onChange={this.handleSequenceChange} disabled="disabled">
                    <option>Loading...</option>
                </select>
            );
        }
    }

    render() {
        return (
            <div className="controlCenter">
                <div className="row">
                    <div className="col-xs-12">
                        <div>
                            Logo
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div>
                            Controls/TextArea 1
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div>
                            Controls/TextArea 2
                        </div>
                    </div>
                    <div className="col-xs-12">
                        {this.renderSelectionBox()}
                    </div>
                </div>
            </div>
        );
    }
}