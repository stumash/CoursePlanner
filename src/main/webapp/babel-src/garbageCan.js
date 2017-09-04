import React from "react";
import { ITEM_TYPES } from "./util";
import { DropTarget } from 'react-dnd';

/*
 *  Garbage can which allows the user to remove courses from the sequence
 *
 *  Expects props:
 *
 *  onRemoveCourse - see MainPage.removeCourse
 *
 */
class GarbageCan extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        return this.props.connectDropTarget(
            <div className="garbageCan">
                <span className="glyphicon glyphicon-trash"></span>
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
        props.onRemoveCourse(monitor.getItem().position);
    }
};


function collectTarget(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

export default DropTarget(ITEM_TYPES.COURSE, garbageCanTarget, collectTarget)(GarbageCan);