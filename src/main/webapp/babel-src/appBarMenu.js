import React from "react";
import {UI_STRINGS, EXPORT_TYPES} from "./util";
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';


export class AppBarMenu extends React.Component {

    constructor(props){
        super(props);
    }
    
    render() {
        return (
            <IconMenu
                iconButtonElement={<IconButton  iconStyle={{color: "white"}}><MoreVertIcon/></IconButton>}
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem
                    primaryText={UI_STRINGS.EXPORT_TEXT}
                    menuItems={EXPORT_TYPES.map(exportType => <MenuItem value={exportType} primaryText={"to " + exportType} onClick={() => this.props.onSelectExport(exportType)}/>)}
                />
                <MenuItem
                    primaryText="Select a new program"
                    onClick={() => this.props.onSelectProgramChange(undefined)}
                />
            </IconMenu>
        );
    }
}