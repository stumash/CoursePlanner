import React from "react";
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

import {UI_STRINGS, INLINE_STYLES, LOADING_ICON_TYPES} from "../../util/util";
import Course from "../sequenceArea/course";

const REQUISITE_TYPES = {
    prerequisite: {
        listClass: "prereqsList",
        listHeading: UI_STRINGS.COURSE_INFO_HEADING_PREREQUISITES
    },
    corequisite: {
        listClass: "coreqsList",
        listHeading: UI_STRINGS.COURSE_INFO_HEADING_COREQUISITES
    }
};


/*
 *  Material UI Card which displays the currently selected course info
 *  and renders a draggable version of the course to allow the user to add
 *  the course in question to the sequence
 *
 *  Expects props:
 *
 *  courseInfo - see MainPage.state.selectedCourseInfo
 *  onChangeDragState - see MainPage.state.setDragState
 *
 */
export class CourseInfoCard extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            courseBeingDragged: false
        };

        this.handleChangeDragState = this.handleChangeDragState.bind(this);
    }

    handleChangeDragState(isDragging, draggedPosition, draggedItem) {
        this.props.onChangeDragState(isDragging, draggedPosition, draggedItem);
        this.setState({
            courseBeingDragged: isDragging
        });
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
            subtitle = <Course courseObj={courseInfo}
                               isHidden={this.state.courseBeingDragged}
                               isDraggable={true}
                               onChangeDragState={this.handleChangeDragState}
                               onCourseClick={() => undefined}/>;
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

        let prereqData = courseInfo.requirements.prereqs;
        if(prereqData.length > 0){
            prerequisites = (this.renderRequisiteList(REQUISITE_TYPES.prerequisite, prereqData));
        }

        let coreqData = courseInfo.requirements.coreqs;
        if(coreqData.length > 0){
            corequisites = (this.renderRequisiteList(REQUISITE_TYPES.corequisite, coreqData));
        }
        
        return (
            <CardText className="cardText" style={INLINE_STYLES.courseInfoCardText} expandable={true}>
                {description}{prerequisites}{corequisites}
            </CardText>
        );
    }

    renderRequisiteList(type, data) {
        return (
            <div className={type.listClass}>
                <div className="cardHeading">{type.listHeading}</div>
                <List>
                    {data.map((items, index) =>
                        <ListItem primaryText={items.join(" or ")}
                                  innerDivStyle={INLINE_STYLES.courseInfoListItem}
                                  key={index} />
                    )}
                </List>
            </div>
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