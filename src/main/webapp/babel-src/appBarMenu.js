import React from "react";
import {UI_STRINGS, EXPORT_TYPES} from "./util";
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

/*
 *  Menu which is accessible via clicking a MoreVertIcon.
 *  Gives the user to option to export their sequence or to pick a different program
 *
 *  Expects props:
 *
 *  onSelectExport - see MainPage.exportSequence
 *  onSelectProgramChange - see MainPage.resetProgram
 *
 */
export class AppBarMenu extends React.Component {

    constructor(props){
        super(props);
    }
    
    render() {

        let exportSubMenu = EXPORT_TYPES.map(exportType =>
            <MenuItem value={exportType}
                      primaryText={"to " + exportType}
                      onClick={() => this.props.onSelectExport(exportType)}/>);

        return (
            <IconMenu iconButtonElement={<IconButton  iconStyle={{color: "white"}}><MoreVertIcon/></IconButton>}
                      targetOrigin={{horizontal: 'right', vertical: 'top'}}
                      anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}>
                <MenuItem primaryText={UI_STRINGS.EXPORT_TEXT}
                         menuItems={exportSubMenu}/>
                <MenuItem primaryText={UI_STRINGS.SELECT_NEW_PROGRAM}
                          onClick={() => this.props.onSelectProgramChange(undefined)}/>
            </IconMenu>
        );
    }
}