import React from "react";

/*
 *  Rectangular area which contains widgets/views relevant to user input and output
 *
 *  Expects props:
 *
 *  onChangeChosenProgram(chosenProgram) - function to call in the event that the user changes their chosen program
 *      param chosenProgram - the name of the new program
 *
 */
export class ControlCenter extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            "sequenceList" : []
        };
        this.handleSequenceChange = this.handleSequenceChange.bind(this);
    }

    handleSequenceChange(event){
        // event.target.value holds the new value selected by the user
        this.props.onChangeChosenProgram(event.target.value);
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
                <select className="form-control" onChange={this.handleSequenceChange} value={this.props.chosenProgram}>
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

    // For now, everything here is hardcoded except the sequence selection menu
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