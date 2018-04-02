import React from "react";
import {Card, CardHeader, CardText} from 'material-ui/Card';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import { sprintf } from "sprintf-js";

import {UI_STRINGS, LOADING_ICON_TYPES, COURSE_EXEMPTIONS} from "../../util/util";

const ERROR_ICONS = {
    "issue": <ErrorIcon color="#6c1540"/>,
    "warning": <WarningIcon color="#f5bb2b"/>
};

/*
 *  Material UI Card which displays the results of the most recent sequence validation
 *
 *  Expects props:
 *
 *  validationResults - see MainPage.state.validationResults
 *  onMouseEnterItem - see MainPage.highlightCourses
 *  onMouseLeaveItem - see MainPage.unhighlightCourses
 *
 */
export class SequenceValidationCard extends React.Component {

    constructor(props){
        super(props);
    }

    generateListItems(issues, warnings) {
        let listItems = [];

        // add all issues and warnings to listItems list

        issues && issues.forEach((issue) => {
            let itemType = "issue";

            if(issue.type === "prerequisite" || issue.type === "corequisite"){
                issue.data.unmetRequirements.forEach((requirement) => {
                    let shouldSkip = false;
                    // skip issues that include an exempted courseCode requirement
                    requirement.forEach((courseCode) => {
                        COURSE_EXEMPTIONS.indexOf(courseCode) >= 0 && (shouldSkip = true);
                    });
                    if(!shouldSkip){
                        listItems.push({
                            type: itemType,
                            positionsToHighlight: [issue.data.position],
                            message: sprintf(UI_STRINGS.VALIDATION_MISSING_REQUISITE_T, issue.data.courseCode, issue.type, requirement.join(" or "))
                        });
                    }
                });
            }
            if(issue.type === "creditCount") {
                listItems.push({
                    type: itemType,
                    positionsToHighlight: [],
                    message: sprintf(UI_STRINGS.VALIDATION_MISSING_CREDITS_T, issue.data.actual, issue.data.required)
                });
            }
        });

        warnings && warnings.forEach((warning) => {
            let itemType = "warning";

            if(warning.type === "repeated") {
                listItems.push({
                    type: itemType,
                    positionsToHighlight: warning.data.positions,
                    message: sprintf(UI_STRINGS.VALIDATION_REPEATED_COURSE_T, warning.data.courseCode, warning.data.positions.length)
                });
            }
            if(warning.type === "unselectedOption") {
                listItems.push({
                    type: itemType,
                    positionsToHighlight: [warning.data.position],
                    message: sprintf(UI_STRINGS.VALIDATION_NO_OPTION_SELECT_T, warning.data.position.season,
                                                                               (parseInt(warning.data.position.yearIndex) + 1),
                                                                               (parseInt(warning.data.position.courseIndex) + 1))
                });
            }
        });

        return listItems;
    }
    
    renderCardHeader(isValid, isLoading) {
        let title, loadingIcon, showExpandableButton;

        if(isLoading){
            title = UI_STRINGS.VALIDATION_LOADING;
            loadingIcon = LOADING_ICON_TYPES.small;
            showExpandableButton = true;
        } else if(isValid) {
            title = UI_STRINGS.VALIDATION_SUCCESS_MSG;
            showExpandableButton = false
        } else {
            title = UI_STRINGS.VALIDATION_FAILURE_MSG;
            showExpandableButton = true;
        }
        
        return (
            <CardHeader title={title}
                        actAsExpander={!isValid}
                        showExpandableButton={showExpandableButton}
                        closeIcon={loadingIcon}
                        openIcon={loadingIcon}/>
        );
    }

    renderCardText(listItems) {
        return (
            <CardText expandable={true}>
                {listItems.map((item, index) => (
                    <div className={"validationListItem " + item.type}
                         key={index}
                         onMouseEnter={() => this.props.onMouseEnterItem(item.positionsToHighlight)}
                         onMouseLeave={() => this.props.onMouseLeaveItem(item.positionsToHighlight)}>
                        <div className="validationListIcon">{ERROR_ICONS[item.type]}</div>
                        <div className="validationMessage">{item.message}</div>
                    </div>
                ))}
            </CardText>
        );
    }

    render() {
        let issues = this.props.validationResults.issues;
        let warnings = this.props.validationResults.warnings;
        let listItems = this.generateListItems(issues, warnings);
        let isValid = this.props.validationResults.isValid === "true" || listItems.length === 0;
        let isLoading = this.props.validationResults.isLoading;
        return (
            <Card>
                {this.renderCardHeader(isValid, isLoading)}
                {!isValid && this.renderCardText(listItems)}
            </Card>
        );
    }
}