import React from "react";

import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

import {UI_STRINGS,
        INLINE_STYLES,
        LOADING_ICON_TYPES,
        PROGRAM_NAMES,
        PROGRAM_OPTIONS,
        PROGRAM_ENTRY_TYPES,
        generatePrettyProgramName} from "../../util/util";

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
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
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

    handleNextClick() {
        let shouldSkipOptionStep = this.state.stepIndex === 0 && this.state.dropdownItems.option.length === 1;
        this.setState({
            stepIndex: this.state.stepIndex + (shouldSkipOptionStep ? 2 : 1),
            finished: this.state.stepIndex >= 2
        });
    }

    handlePrevClick() {
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
            <Button color="secondary"
                    onClick={this.handleBackClick}
                    disabled={!this.state.finished}>
                {UI_STRINGS.PROGRAM_SELECTION_BACK_LABEL}
            </Button>
        );
        actions.push(
            <Button color="primary"
                    onClick={this.handleConfirmClick}
                    disabled={!this.state.finished}>
                {UI_STRINGS.PROGRAM_SELECTION_CONFIRM_LABEL}
            </Button>
        );
        return actions;
    }

    renderStepActions(step) {
        return (
            <div className="programSelectStepButton">
                {/*
                    // <RaisedButton
                    //     label={this.state.stepIndex === 2 ? UI_STRINGS.PROGRAM_SELECTION_FINISH_LABEL : UI_STRINGS.PROGRAM_SELECTION_NEXT_LABEL}
                    //     disableTouchRipple={true} TODO: check ripple
                    //     disableFocusRipple={true} TODO: check ripple
                    //     primary={true}
                    //     onClick={this.handleNextClick}
                    //     style={INLINE_STYLES.programSelectNextButton}
                    // />
                */}
                <Button variant="contained"
                        color="primary"
                        style={INLINE_STYLES.programSelectNextButton}
                        onClick={this.handleNextClick}>
                    {this.state.stepIndex === 2 ? UI_STRINGS.PROGRAM_SELECTION_FINISH_LABEL : UI_STRINGS.PROGRAM_SELECTION_NEXT_LABEL}
                </Button>
                {step > 0 && (
                    // <FlatButton
                    //     label={UI_STRINGS.PROGRAM_SELECTION_PREVIOUS_LABEL}
                    //     disabled={this.state.stepIndex === 0}
                    //     disableTouchRipple={true} TODO: check ripple
                    //     disableFocusRipple={true} TODO: check ripple
                    //     onClick={this.handlePrevClick}
                    // />
                    <Button color="primary"
                            onClick={this.handlePrevClick}
                            disabled={this.state.stepIndex === 0}>
                        {UI_STRINGS.PROGRAM_SELECTION_PREVIOUS_LABEL}
                    </Button>
                )}
            </div>
        );
    }

    render() {

        let dialogTitle, dialogContent;

        if(this.props.allSequences.length === 0){
            dialogTitle = UI_STRINGS.PROGRAM_SELECTION_LOADING;
            dialogContent = LOADING_ICON_TYPES.big;
        } else {
            dialogTitle = UI_STRINGS.PROGRAM_SELECTION_TITLE;
            dialogContent = (
                <div>
                    <Stepper activeStep={this.state.stepIndex} orientation="vertical">
                        <Step>
                            <StepLabel>{UI_STRINGS.PROGRAM_SELECTION_PROGRAM_TITLE}</StepLabel>
                            <StepContent>
                                <Select value={this.state.chosenProgram}
                                              onChange={this.handleProgramNameSelection}
                                              disabled={this.state.dropdownItems.program.length <= 1}>
                                    {this.state.dropdownItems.program.map((item) =>
                                        <MenuItem key={item.name}
                                                  value={item.id}
                                                  primaryText={item.name} />
                                    )}
                                </Select>
                                {this.renderStepActions(0)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>{UI_STRINGS.PROGRAM_SELECTION_OPTION_TITLE}</StepLabel>
                            <StepContent>
                                <Select value={this.state.chosenOption}
                                              onChange={this.handleOptionSelection}
                                              disabled={this.state.dropdownItems.option.length <= 1}>
                                    {this.state.dropdownItems.option.map((item) =>
                                        <MenuItem key={item.name}
                                                  value={item.id}
                                                  primaryText={item.name} />
                                    )}
                                </Select>
                                {this.renderStepActions(1)}
                            </StepContent>
                        </Step>
                        <Step>
                            <StepLabel>{UI_STRINGS.PROGRAM_SELECTION_ENTRY_TYPE_TITLE}</StepLabel>
                            <StepContent>
                                <Select value={this.state.chosenEntryType}
                                              onChange={this.handleEntryTypeSelection}
                                              disabled={this.state.dropdownItems.entryType.length <= 1}>
                                    {this.state.dropdownItems.entryType.map((item) =>
                                        <MenuItem key={item.name}
                                                  value={item.id}
                                                  primaryText={item.name} />
                                    )}
                                </Select>
                                {this.renderStepActions(2)}
                            </StepContent>
                        </Step>
                    </Stepper>
                    {this.state.finished && (
                        <div className="programSelectConfirmMsg">
                            {UI_STRINGS.PROGRAM_SELECTION_FINAL_MESSAGE}<br/>
                            {generatePrettyProgramName(this.state.chosenProgram, this.state.chosenOption, this.state.chosenEntryType)}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Dialog title={dialogTitle}
                    actions={this.renderDialogActions()}
                    modal={true}
                    open={this.props.isOpen}
                    className="programSelectionDialogContent"
                    contentStyle={INLINE_STYLES.programSelectContent}>
                {dialogContent}
            </Dialog>
        );
    }
}
