import React from "react";

import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from "material-ui/DropDownMenu";
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import {Step, Stepper, StepLabel, StepContent} from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import {UI_STRINGS, PROGRAM_NAMES, PROGRAM_OPTIONS, PROGRAM_ENTRY_TYPES, generatePrettyProgramName} from "./util";

let _ = require("underscore");

/*
 *  Dialog which opens when the user first opens the page
 *  or if they decide to change their selected program
 *
 *  Gives the user an interface through which they can select
 *  their personal program of study
 *
 *  Makes use of the Stepper element from material-ui
 *
 *  Expects props:
 *
 *  allSequences - see MainPage.state.allSequences
 *  isOpen - see MainPage.render
 *  onChangeChosenProgram - see MainPage.updateChosenProgram
 *
 */
export class ProgramSelectionDialog extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            chosenProgram: undefined,
            chosenOption: undefined,
            chosenEntryType: undefined,
            dropdownItems: {
                program: [],
                option: [],
                entryType: []
            },
            finished: false,
            stepIndex: 0
        };

        this.handleProgramNameSelection = this.handleProgramNameSelection.bind(this);
        this.handleOptionSelection = this.handleOptionSelection.bind(this);
        this.handleEntryTypeSelection = this.handleEntryTypeSelection.bind(this);
        this.handlePrev = this.handlePrev.bind(this);
        this.handleNext = this.handleNext.bind(this);
        this.handleConfirmClick = this.handleConfirmClick.bind(this);
        this.handleBackClick = this.handleBackClick.bind(this);
        this.renderStepActions = this.renderStepActions.bind(this);
        this.renderDialogActions = this.renderDialogActions.bind(this);
        this.updateProgramItems = this.updateProgramItems.bind(this);
        this.updateOptionItems = this.updateOptionItems.bind(this);
        this.updateEntryTypeItems = this.updateEntryTypeItems.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if(!_.isEqual(prevProps.allSequences, this.props.allSequences)){
            this.updateProgramItems();
        }
    }

    handleProgramNameSelection(event, index, value) {
        this.setState({
            chosenProgram: value
        }, this.updateOptionItems);
    }

    handleOptionSelection(event, index, value) {
        this.setState({
            chosenOption: value
        }, this.updateEntryTypeItems);
    }

    handleEntryTypeSelection(event, index, value) {
        this.setState({
            chosenEntryType: value
        });
    }

    handleNext() {
        this.setState({
            stepIndex: this.state.stepIndex + 1,
            finished: this.state.stepIndex >= 2,
        });
    }

    handlePrev() {
        if (this.state.stepIndex > 0) {
            this.setState({stepIndex: this.state.stepIndex - 1});
        }
    };

    handleConfirmClick() {
        let chosenSequenceID = this.state.chosenProgram + "-" + this.state.chosenOption + "-" + this.state.chosenEntryType;
        this.props.onChangeChosenProgram(chosenSequenceID);
        this.setState({stepIndex: 0, finished: false});
    }

    handleBackClick() {
        this.setState({stepIndex: 2, finished: false});
    }

    updateProgramItems(){
        let items = [];
        Object.keys(PROGRAM_NAMES).forEach((id) => {
            items.push({
                id: id,
                name: PROGRAM_NAMES[id]
            });
        });
        this.setState({
            chosenProgram: items[0].id,
            dropdownItems: {
                program: items,
                option: this.state.dropdownItems.option,
                entryType: this.state.dropdownItems.entryType
            }
        }, this.updateOptionItems);
    }

    updateOptionItems(){
        let chosenProgram = this.state.chosenProgram;
        let matchedSequences = [];
        this.props.allSequences.forEach((sequenceID) => {
            if(sequenceID.indexOf(chosenProgram) >= 0){
                matchedSequences.push(sequenceID);
            }
        });
        let matchedOptionSet = new Set();
        matchedSequences.forEach((sequenceID) => {
            matchedOptionSet.add(sequenceID.split("-")[1]);
        });
        let items = [];
        matchedOptionSet.forEach((optionID) => {
            items.push({
                id: optionID,
                name: PROGRAM_OPTIONS[optionID]
            });
        });
        this.setState({
            chosenOption: items[0].id,
            dropdownItems: {
                program: this.state.dropdownItems.program,
                option: items,
                entryType: this.state.dropdownItems.entryType
            }
        }, this.updateEntryTypeItems);
    }

    updateEntryTypeItems(){
        let chosenProgram = this.state.chosenProgram;
        let chosenOption = this.state.chosenOption;
        let matchedSequences = [];
        this.props.allSequences.forEach((sequenceID) => {
            if(sequenceID.indexOf(chosenProgram) >= 0 && sequenceID.indexOf(chosenOption) >= 0){
                matchedSequences.push(sequenceID);
            }
        });
        let items = [];
        matchedSequences.forEach((sequenceID) => {
            let entryTypeID = sequenceID.split("-")[2];
            items.push({
                id: entryTypeID,
                name: PROGRAM_ENTRY_TYPES[entryTypeID]
            });
        });
        this.setState({
            chosenEntryType: items[0].id,
            dropdownItems: {
                program: this.state.dropdownItems.program,
                option: this.state.dropdownItems.option,
                entryType: items
            }
        });
    }

    renderDialogActions() {
        let actions = [];

        actions.push(
            <FlatButton label={UI_STRINGS.PROGRAM_SELECTION_BACK_LABEL}
                        primary={false}
                        onClick={this.handleBackClick}
                        disabled={!this.state.finished}/>
        );
        actions.push(
            <FlatButton label={UI_STRINGS.PROGRAM_SELECTION_CONFIRM_LABEL}
                        primary={true}
                        onClick={this.handleConfirmClick}
                        disabled={!this.state.finished}/>
        );
        return actions;
    }

    renderStepActions(step) {
        return (
            <div style={{margin: '12px 0'}}>
                <RaisedButton
                    label={this.state.stepIndex === 2 ? UI_STRINGS.PROGRAM_SELECTION_FINISH_LABEL : UI_STRINGS.PROGRAM_SELECTION_NEXT_LABEL}
                    disableTouchRipple={true}
                    disableFocusRipple={true}
                    primary={true}
                    onClick={this.handleNext}
                    style={{marginRight: 12}}
                />
                {step > 0 && (
                    <FlatButton
                        label={UI_STRINGS.PROGRAM_SELECTION_BACK_LABEL}
                        disabled={this.state.stepIndex === 0}
                        disableTouchRipple={true}
                        disableFocusRipple={true}
                        onClick={this.handlePrev}
                    />
                )}
            </div>
        );
    }

    render() {

        let dialogTitle, dialogContent;

        if(this.props.allSequences.length === 0){
            dialogTitle = UI_STRINGS.PROGRAM_SELECTION_LOADING;
            dialogContent = <CircularProgress size={80} thickness={7} style={{width: "100%", textAlign: "center"}}/>
        } else {
            dialogTitle = UI_STRINGS.PROGRAM_SELECTION_TITLE;
            dialogContent = (
                <div>
                    <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                        <Step>
                            <StepLabel>{UI_STRINGS.PROGRAM_SELECTION_PROGRAM_TITLE}</StepLabel>
                            <StepContent>
                                <DropDownMenu value={this.state.chosenProgram}
                                              onChange={this.handleProgramNameSelection}
                                              disabled={this.state.dropdownItems.program.length <= 1}>
                                    {this.state.dropdownItems.program.map((item) =>
                                        <MenuItem key={item.name}
                                                  value={item.id}
                                                  primaryText={item.name} />
                                    )}
                                </DropDownMenu>
                                {this.renderStepActions(0)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>{UI_STRINGS.PROGRAM_SELECTION_OPTION_TITLE}</StepLabel>
                            <StepContent>
                                <DropDownMenu value={this.state.chosenOption}
                                              onChange={this.handleOptionSelection}
                                              disabled={this.state.dropdownItems.option.length <= 1}>
                                    {this.state.dropdownItems.option.map((item) =>
                                        <MenuItem key={item.name}
                                                  value={item.id}
                                                  primaryText={item.name} />
                                    )}
                                </DropDownMenu>
                                {this.renderStepActions(1)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>{UI_STRINGS.PROGRAM_SELECTION_ENTRY_TYPE_TITLE}</StepLabel>
                            <StepContent>
                                <DropDownMenu value={this.state.chosenEntryType}
                                              onChange={this.handleEntryTypeSelection}
                                              disabled={this.state.dropdownItems.entryType.length <= 1}>
                                    {this.state.dropdownItems.entryType.map((item) =>
                                        <MenuItem key={item.name}
                                                  value={item.id}
                                                  primaryText={item.name} />
                                    )}
                                </DropDownMenu>
                                {this.renderStepActions(2)}
                            </StepContent>
                        </Step>
                    </Stepper>
                    {this.state.finished && (
                        <p style={{margin: '20px 0', textAlign: 'center'}}>
                            {UI_STRINGS.PROGRAM_SELECTION_FINAL_MESSAGE}<br/>
                            {generatePrettyProgramName(this.state.chosenProgram, this.state.chosenOption, this.state.chosenEntryType)}
                        </p>
                    )}
                </div>
            );
        }

        return (
            <Dialog title={dialogTitle}
                    actions={this.renderDialogActions()}
                    modal={true}
                    open={this.props.isOpen}
                    contentStyle={{width: "40%"}}>
                {dialogContent}
            </Dialog>
        );
    }
}