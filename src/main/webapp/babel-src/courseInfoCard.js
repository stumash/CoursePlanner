import React from "react";
import {UI_STRINGS} from "./util";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';


export class CourseInfoCard extends React.Component {

    constructor(props){
        super(props);
    }
    
    renderCardHeader(courseInfo) {
        let title, subtitle, showExpandableButton;

        if(courseInfo.isLoading){
            title = "Course Loading";
            showExpandableButton = false;
        } else if(!courseInfo.code){
            title = UI_STRINGS.COURSE_INFO_HINT;
            showExpandableButton = false;
        } else {
            title = courseInfo.code;
            subtitle = courseInfo.credits + " credits";
            showExpandableButton = true;
        }
        
        return (
                <CardHeader
                    title={title}
                    subtitle={subtitle}
                    actAsExpander={true}
                    showExpandableButton={showExpandableButton}
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
                <h4>Description</h4>
                {courseInfo.description}
            </div>
        );
        
        if(courseInfo.requirements.prereqs.length > 0){
            prerequisites = (
                <div className="prereqsList">
                    <h4>Pre-requisites</h4>
                    <List>{courseInfo.requirements.prereqs.map((prereqList, index) => <ListItem key={index} primaryText={prereqList.join(" or ")} />)}</List>
                </div>
            );
        }

        if(courseInfo.requirements.coreqs.length > 0){
            corequisites = (
                <div className="coreqsList">
                    <h4>Co-requisites</h4>
                    <List>{courseInfo.requirements.coreqs.map((coreqList, index) => <ListItem key={index} primaryText={coreqList.join(" or ")} />)}</List>
                </div>
            );
        }
        
        return (
            <CardText expandable={true}>
                {description}
                {prerequisites}
                {corequisites}
            </CardText>
        );
    }

    render() {
        let courseInfo = this.props.courseInfo;

        // if(courseInfo.isLoading){
        //     return (
        //         <Card className="courseInfoCard">
        //             <CardHeader
        //                 title={"Course Loading"}
        //                 actAsExpander={true}
        //                 showExpandableButton={false}
        //             />
        //             <div className="text-center"><span className="smallLoadingSpinner glyphicon glyphicon-refresh glyphicon-spin"></span></div>
        //         </Card>
        //     );
        // }
        //
        // if(!courseInfo.code){
        //     return (
        //         <Card className="courseInfoCard">
        //             <CardHeader
        //                 title={UI_STRINGS.COURSE_INFO_HINT}
        //                 showExpandableButton={false}
        //             />
        //         </Card>
        //     );
        // }

        return (
            <Card className="courseInfoCard">
                {this.renderCardHeader(courseInfo)}
                {/*<CardHeader*/}
                    {/*title={courseInfo.code}*/}
                    {/*subtitle={courseInfo.credits + " credits"}*/}
                    {/*actAsExpander={true}*/}
                    {/*showExpandableButton={true}*/}
                {/*/>*/}
                {/*<CardActions>*/}
                {/*<FlatButton label="View description" />*/}
                {/*</CardActions>*/}
                {this.renderCardText(courseInfo)}
                {/*<CardText expandable={true}>*/}
                    {/*<h4>Description</h4>*/}
                    {/*{courseInfo.description}*/}
                    {/*<h4>Pre-requisites</h4>*/}
                    {/*<List>{courseInfo.requirements.prereqs.map((prereqList, index) => <ListItem key={index} primaryText={prereqList.join(" or ")} />)}</List>*/}
                    {/*<h4>Co-requisites</h4>*/}
                    {/*<List>{courseInfo.requirements.coreqs.map((coreqList, index) => <ListItem key={index} primaryText={coreqList.join(" or ")} />)}</List>*/}
                {/*</CardText>*/}
                {courseInfo.isLoading && <div className="text-center"><span className="smallLoadingSpinner glyphicon glyphicon-refresh glyphicon-spin"></span></div>}
            </Card>
        );
    }
}