import React from "react";
import {UI_STRINGS, EXPORT_TYPES} from "./util";
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from "material-ui/DropDownMenu";
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';


export class ProgramSelectionDialog extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            chosenProgram: undefined
        };

        this.renderSelectionBox = this.renderSelectionBox.bind(this);
        this.handleSequenceSelection = this.handleSequenceSelection.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleSequenceSelection(event, index, value){
        this.setState({
            chosenProgram: value
        });
    }

    handleClick() {
        this.props.onChangeChosenProgram(this.state.chosenProgram);
    }

    renderSelectionBox(){

        let sequences = [];

        if(this.props.allSequences.length > 0){
            sequences = this.props.allSequences.map((sequenceName) => <MenuItem key={sequenceName} value={sequenceName} primaryText={sequenceName} />);
        } else {
            sequences = <MenuItem primaryText={UI_STRINGS.LIST_LOADING} />;
        }

        return (
            <DropDownMenu value={this.state.chosenProgram} onChange={this.handleSequenceSelection}>
                {sequences}
            </DropDownMenu>
        );
    }

    render() {
        return (
            <Dialog title="Select your program"
                    actions={<FlatButton label="Confirm" primary={true} onClick={this.handleClick} disabled={!this.state.chosenProgram}/>}
                    modal={true}
                    open={this.props.isOpen}
                    contentStyle={{width: "inherit"}}
                    titleStyle={{textAlign: "inherit"}}>
                {this.renderSelectionBox()}
            </Dialog>
        );
    }
}