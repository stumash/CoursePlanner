import React from "react";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from 'material-ui/MenuItem';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';

import {EXPORT_TYPES, UI_STRINGS} from "./util";
import {SearchBox} from "./searchBox";
import Course from "./course";

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
        this.handleSequenceSelection = this.handleSequenceSelection.bind(this);
    }

    handleSequenceSelection(event, index, value){
        this.props.onChangeChosenProgram(value);
    }

    renderSelectionBox(){
        
        let sequences = [];

        if(this.props.allSequences.length > 0){
            sequences = this.props.allSequences.map((sequenceName) => <MenuItem key={sequenceName} value={sequenceName} primaryText={sequenceName} />);
        } else {
            sequences = <MenuItem primaryText={UI_STRINGS.LIST_LOADING} />;
        }
        
        return (
            <DropDownMenu value={this.props.chosenProgram} onChange={this.handleSequenceSelection}>
                {sequences}
            </DropDownMenu>
        );
    }

    renderCourseInfo(){

        let courseInfo = this.props.courseInfo;

        if(courseInfo.isLoading){
            return <div className="text-center"><span className="smallLoadingSpinner glyphicon glyphicon-refresh glyphicon-spin"></span></div>;
        }

        if(!courseInfo.code){
            return <div className="text-center">{UI_STRINGS.COURSE_INFO_HINT}</div>;
        }

        return (
            <div>
                <Course courseObj={courseInfo}
                        isDraggable={true}
                        onCourseClick={this.props.onSearchCourse}/>
                <pre>{JSON.stringify(this.props.courseInfo, undefined, 2)}</pre>
            </div>
        );
    }

    renderCourseInfoCard(){

        let courseInfo = this.props.courseInfo;

        if(courseInfo.isLoading){
            return (
                <Card>
                    <CardHeader
                        title={"Course Loading"}
                        actAsExpander={true}
                        showExpandableButton={false}
                    />
                    <div className="text-center"><span className="smallLoadingSpinner glyphicon glyphicon-refresh glyphicon-spin"></span></div>
                </Card>
            );
        }

        if(!courseInfo.code){
            return (
                <Card>
                    <CardHeader
                        title={UI_STRINGS.COURSE_INFO_HINT}
                        showExpandableButton={false}
                    />
                </Card>
            );
        }

        return (
            <Card>
                <CardHeader
                    title={courseInfo.code}
                    subtitle={courseInfo.credits + " credits"}
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                {/*<CardActions>*/}
                    {/*<FlatButton label="View description" />*/}
                {/*</CardActions>*/}
                <CardText expandable={true}>
                    <h4>Description</h4>
                    {courseInfo.description}
                    <h4>Pre-requisites</h4>
                    <List>{courseInfo.requirements.prereqs.map((prereqList, index) => <ListItem key={index} primaryText={prereqList.join(" or ")} />)}</List>
                    <h4>Co-requisites</h4>
                    <List>{courseInfo.requirements.coreqs.map((coreqList, index) => <ListItem key={index} primaryText={coreqList.join(" or ")} />)}</List>
                </CardText>
            </Card>
        );
    }

    render() {
        return (
            <div className="ioPanel">
                <div className="controls row">
                    <SearchBox onConfirmSearch={this.props.onSearchCourse}/>
                </div>
                {this.renderCourseInfoCard()}
                <Card>
                    <CardHeader
                        title={UI_STRINGS.VALIDATION_RESULTS_HINT}
                        actAsExpander={true}
                        showExpandableButton={false}
                    />
                </Card>
                <div className="programSelect col-xs-12">
                    {this.renderSelectionBox()}
                </div>
            </div>
        );
    }
}