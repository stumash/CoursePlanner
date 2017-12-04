import React from "react";
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

import {UI_STRINGS, INLINE_STYLES, LOADING_ICON_TYPES} from "./util";
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
            loadingIcon = LOADING_ICON_TYPES.small;
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

        description = (
            <div className="courseDescription">
                <div className="cardHeading">{UI_STRINGS.COURSE_INFO_HEADING_DESCRIPTION}</div>
                {courseInfo.description}
            </div>
        );
        
        if(courseInfo.requirements.prereqs.length > 0){
            prerequisites = (
                <div className="prereqsList">
                    <div className="cardHeading">{UI_STRINGS.COURSE_INFO_HEADING_PREREQUISITES}</div>
                    <List>
                        {courseInfo.requirements.prereqs.map((prereqList, index) =>
                            <ListItem primaryText={prereqList.join(" or ")}
                                      innerDivStyle={INLINE_STYLES.courseInfoListItem}
                                      key={index} />
                        )}
                    </List>
                </div>
            );
        }

        if(courseInfo.requirements.coreqs.length > 0){
            corequisites = (
                <div className="coreqsList">
                    <div className="cardHeading">{UI_STRINGS.COURSE_INFO_HEADING_COREQUISITES}</div>
                    <List>
                        {courseInfo.requirements.coreqs.map((coreqList, index) =>
                            <ListItem primaryText={coreqList.join(" or ")}
                                      innerDivStyle={INLINE_STYLES.courseInfoListItem}
                                      key={index} />
                        )}
                    </List>
                </div>
            );
        }
        
        return (
            <CardText className="cardText" style={INLINE_STYLES.courseInfoCardText} expandable={true}>
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