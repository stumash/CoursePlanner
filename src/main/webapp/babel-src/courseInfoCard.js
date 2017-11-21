import React from "react";
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

import {UI_STRINGS} from "./util";
import Course from "./course";


/*
 *  Material UI Card which displays the currently selected course info
 *  and renders a draggable version of the course to allow the user to add
 *  the course in question to the sequence
 *
 *  Expects props:
 *
 *  courseInfo - see MainPage.state.selectedCourseInfo
 *
 */
export class CourseInfoCard extends React.Component {

    constructor(props){
        super(props);
    }

    renderCardHeader(courseInfo) {
        let title, subtitle, showExpandableButton, loadingIcon;

        if(courseInfo.isLoading){
            title = UI_STRINGS.COURSE_INFO_LOADING;
            loadingIcon = <CircularProgress size={25} thickness={2.5} style={{marginLeft: "-8px", marginTop: "-10px"}}/>;
            showExpandableButton = true;
        } else if(!courseInfo.code){
            title = UI_STRINGS.COURSE_INFO_HINT;
            showExpandableButton = false;
        } else {
            title = courseInfo.name + " - " + courseInfo.credits + " credits";
            subtitle = <Course courseObj={courseInfo} isDraggable={true} onCourseClick={() => undefined}/>;
            showExpandableButton = true;
        }
        
        return (
                <CardHeader
                    title={title}
                    subtitle={subtitle}
                    actAsExpander={true}
                    showExpandableButton={showExpandableButton}
                    closeIcon={loadingIcon}
                    openIcon={loadingIcon}
                />
        );
    }
    
    renderCardText(courseInfo) {

        if(courseInfo.isLoading || !courseInfo.code){
            return undefined;
        }
        
        let description, prerequisites, corequisites;
        let listItemStyle = {padding: "8px 0", height: "32px", marginLeft: "16px", fontSize: "14px"};

        description = (
            <div className="courseDescription">
                <div className="courseInfoHeading">{UI_STRINGS.COURSE_INFO_HEADING_DESCRIPTION}</div>
                {courseInfo.description}
            </div>
        );
        
        if(courseInfo.requirements.prereqs.length > 0){
            prerequisites = (
                <div className="prereqsList">
                    <div className="courseInfoHeading">{UI_STRINGS.COURSE_INFO_HEADING_PREREQUISITES}</div>
                    <List>
                        {courseInfo.requirements.prereqs.map((prereqList, index) =>
                            <ListItem primaryText={prereqList.join(" or ")} innerDivStyle={listItemStyle} key={index} />
                        )}
                    </List>
                </div>
            );
        }

        if(courseInfo.requirements.coreqs.length > 0){
            corequisites = (
                <div className="coreqsList">
                    <div className="courseInfoHeading">{UI_STRINGS.COURSE_INFO_HEADING_COREQUISITES}</div>
                    <List>
                        {courseInfo.requirements.coreqs.map((coreqList, index) =>
                            <ListItem primaryText={coreqList.join(" or ")} innerDivStyle={listItemStyle} key={index} />
                        )}
                    </List>
                </div>
            );
        }
        
        return (
            <CardText className="cardText" style={{paddingTop: "0"}} expandable={true}>
                {description}
                {prerequisites}
                {corequisites}
            </CardText>
        );
    }

    render() {
        return (
            <Card className="courseInfoCard">
                {this.renderCardHeader(this.props.courseInfo)}
                {this.renderCardText(this.props.courseInfo)}
            </Card>
        );
    }
}