import React from "react";

import { UI_STRINGS, EXPORT_TYPES, URLS } from "../util/util";
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

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

    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null
        };

        this.handleVertMenuClick = this.handleVertMenuClick.bind(this);
    }

    handleVertMenuClick(event) {
        this.setState({ anchorEl: event.currentTarget });
    }

    handleVertMenuClose() {
        this.setState({ anchorEl: null });
    }

    render() {
        let exportSubMenu = Object.keys(EXPORT_TYPES).map(exportType =>
            <MenuItem value={EXPORT_TYPES[exportType]}
                      primaryText={"to " + EXPORT_TYPES[exportType]}
                      onClick={() => this.props.onSelectExport(EXPORT_TYPES[exportType])}/>);

        return (
            <div>
                <IconButton onClick={this.handleVertMenuClick}>
                    <MoreVertIcon/>
                </IconButton>
                <Menu anchorEl={this.state.anchorEl}
                      open={!!this.state.anchorEl}
                      onClose={this.handleVertMenuClose}>
                    <MenuItem menuItems={exportSubMenu}>
                        {UI_STRINGS.EXPORT_TEXT}
                    </MenuItem>
                    <MenuItem onClick={() => this.props.onSelectProgramChange(undefined)}>
                        {UI_STRINGS.SELECT_NEW_PROGRAM}
                    </MenuItem>
                    <MenuItem onClick={this.props.onSelectFeedback}>
                        {UI_STRINGS.FEEDBACK_TEXT}
                    </MenuItem>
                    <MenuItem onClick={() => {window.open(URLS.REPO)}}>
                        {UI_STRINGS.REPO_LINK_TEXT}
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}
