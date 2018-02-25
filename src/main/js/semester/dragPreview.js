import React from 'react';
import { DragLayer } from 'react-dnd';
import { renderCourseDiv, renderOrListDiv } from "../util/util";

function collect(monitor){
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging()
    }
}

const layerStyles = {
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: 100,
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
};

function getItemStyles(props) {
    const { currentOffset } = props;
    if (!currentOffset) {
        return {
            display: 'none'
        };
    }

    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform: transform,
        WebkitTransform: transform
    };
}

class DragPreview extends React.Component {

    renderCourseList(courseList){

        if(courseList.length === 0) {
            return;
        }

        return courseList.map((courseObj) => {
            if(courseObj.length > 0){
                let courseList = courseObj;
                return (
                    <div key={courseList.map(courseObj => courseObj.id).join()}>
                        {renderOrListDiv(courseList, " dragPreview")}
                    </div>
                );
            } else {
                return (
                    // course dragged from courseInfoCard will not have an id
                    <div key={courseObj.id || courseObj.code}>
                        {renderCourseDiv(courseObj, " dragPreview")}
                    </div>
                );
            }
        });
    }

    render() {

        if (!this.props.isDragging) {
            return null;
        }

        return (
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    {this.renderCourseList(this.props.draggedItems)}
                </div>
            </div>
        );
    }
}

export default DragLayer(collect)(DragPreview);