import React from "react";
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {List, ListItem} from 'material-ui/List';

import { UI_STRINGS } from "./util";

/*
 *  Material UI Card which displays the results of the most recent sequence validation
 *
 *  For now this is just a mock-up
 *
 *  Expects props:
 *
 *  n/a
 *
 */
export class SequenceValidationCard extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <Card>
                <CardHeader title={UI_STRINGS.VALIDATION_FAILURE_MSG}
                            actAsExpander={true}
                            showExpandableButton={true}/>
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