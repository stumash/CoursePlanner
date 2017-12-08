import React from "react";

import Dialog from 'material-ui/Dialog';
import {List, ListItem} from 'material-ui/List';

/*
 *
 */
export class ExemptionListDialog extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <Dialog title="View Course Exemption List"
                    open={this.props.isOpen}
                    onRequestClose={this.props.onRequestClose}>
                <List>
                    <ListItem primaryText="MATH 201"/>
                    <ListItem primaryText="MATH 202"/>
                    <ListItem primaryText="MATH 203"/>
                    <ListItem primaryText="MATH 204"/>
                </List>
            </Dialog>
        );
    }
}