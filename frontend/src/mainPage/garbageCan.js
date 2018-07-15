import React from "react";
import { ITEM_TYPES } from "../util/util";
import { DropTarget } from 'react-dnd';

/*
 *  Garbage can which allows the user to remove courses from the sequence
 *  It exists as its own component as it is a react-dnd DropTarget
 *
 *  Expects props:
 *
 *  onRemoveCourses - see MainPage.removeCourses
 *
 */
class GarbageCan extends React.Component {
    render(){
        return this.props.connectDropTarget(
            <div className="garbageCan">
                <span className="glyphicon glyphicon-trash"/>
            </div>
        );
    }
}

/*
 * Below lies react-dnd-specific code & configs used to turn GarbageCan into a drag target
 */

let garbageCanTarget = {
    hover(props, monitor, component) {
    },
    drop(props, monitor, component){
        props.onRemoveCourses();
    }
};


function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

export default DropTarget([ITEM_TYPES.COURSE, ITEM_TYPES.OR_LIST], garbageCanTarget, collectTarget)(GarbageCan);
