import React from "react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';

import {UI_STRINGS} from "./util";
import Course from "./course";

export class CourseInfoCard extends React.Component {

    constructor(props){
        super(props);
    }

    renderCardHeader(courseInfo) {
        let title, subtitle, showExpandableButton, loadingIcon;

        if(courseInfo.isLoading){
            title = "Getting course info";
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
        
        let title, description, prerequisites, corequisites;

        let listItemStyle = {padding: "8px 0", height: "32px", marginLeft: "16px", fontSize: "14px"};

        // title = (
        //     <CardTitle title={courseInfo.name} subtitle={courseInfo.credits + " credits"} expandable={true} />
        // );
        
        description = (
            <div className="courseDescription">
                <div className="courseInfoHeading">Description</div>
                {courseInfo.description}
            </div>
        );
        
        if(courseInfo.requirements.prereqs.length > 0){
            prerequisites = (
                <div className="prereqsList">
                    <div className="courseInfoHeading">Pre-requisites</div>
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
                    <div className="courseInfoHeading">Co-requisites</div>
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
        let courseInfo = this.props.courseInfo;

        return (
            <Card className="courseInfoCard">
                {this.renderCardHeader(courseInfo)}
                {this.renderCardText(courseInfo)}
            </Card>
        );
    }
}