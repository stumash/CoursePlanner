import React from "react";
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';


export class SequenceValidationCard extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <Card>
                <CardHeader
                    title="Sequence contains issues"
                    actAsExpander={true}
                    showExpandableButton={true}
                />
                <CardText expandable={true}>
                    <List>
                        <ListItem primaryText="Issue 1" />
                        <ListItem primaryText="Issue 2" />
                        <ListItem primaryText="Issue 3" />
                        <ListItem primaryText="Issue 4" />
                    </List>
                </CardText>
            </Card>
        );
    }
}