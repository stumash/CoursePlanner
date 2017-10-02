import React from 'react';
import { DragLayer } from 'react-dnd';
import { ITEM_TYPES, renderCourseDiv,renderOrListDiv } from "./util";


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

class CourseDragPreview extends React.Component {

    renderItem(type, item) {
        switch (type) {
            case ITEM_TYPES.COURSE:
                return (
                    renderCourseDiv(item.courseObj, " dragPreview")
                );
            case ITEM_TYPES.OR_LIST:
                return (
                    renderOrListDiv(item.courseList, " dragPreview")
                );
            default:
                return "Default Drag Preview";
        }
    }

    render() {
        if (!this.props.isDragging) {
            return null;
        }

        return (
            <div style={layerStyles}>
                <div style={getItemStyles(this.props)}>
                    {this.renderItem(this.props.itemType, this.props.item)}
                </div>
            </div>
        );
    }
}

export default DragLayer(collect)(CourseDragPreview);