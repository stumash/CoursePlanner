import React from "react";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from 'material-ui/MenuItem';

import {UI_STRINGS} from "./util";
import {SearchBox} from "./searchBox";
import Course from "./course";
import {CourseInfoCard} from "./courseInfoCard";
import {SequenceValidationCard} from "./sequenceValidationCard";

/*
 *  Rectangular area which contains widgets/views relevant to user input and output
 *
 *  Expects props:
 *
 *  allSequences - array containing the name of all recommended sequences available in DB
 *
 *  chosenProgram - string representing the recommended sequence chosen by the user
 *
 *  courseInfo - json object containing the info of a course - directly pulled from DB
 *
 *  loadingExport - boolean which tells us if were currently waiting for an export to finish
 *
 *  onChangeChosenProgram - see MainPage.updateChosenProgram
 *  exportSequence - see MainPage.exportSequence
 *  onSearchCourse - see MainPage.loadCourseInfo
 *
 */
export class IOPanel extends React.Component {

    constructor(props){
        super(props);

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        // this.handleSequenceSelection = this.handleSequenceSelection.bind(this);
    }

    // handleSequenceSelection(event, index, value){
    //     this.props.onChangeChosenProgram(value);
    // }

    // renderSelectionBox(){
    //
    //     let sequences = [];
    //
    //     if(this.props.allSequences.length > 0){
    //         sequences = this.props.allSequences.map((sequenceName) => <MenuItem key={sequenceName} value={sequenceName} primaryText={sequenceName} />);
    //     } else {
    //         sequences = <MenuItem primaryText={UI_STRINGS.LIST_LOADING} />;
    //     }
    //
    //     return (
    //         <DropDownMenu value={this.props.chosenProgram}
    //                       onChange={this.handleSequenceSelection}>
    //             {sequences}
    //         </DropDownMenu>
    //     );
    // }

    render() {
        return (
            <div className="ioPanel">
                <SearchBox onConfirmSearch={this.props.onSearchCourse}/>
                <div className="outputPanel">
                    <CourseInfoCard courseInfo={this.props.courseInfo}/>
                    <SequenceValidationCard/>
                </div>
            </div>
        );
    }
}