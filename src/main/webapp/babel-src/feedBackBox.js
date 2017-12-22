import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {FEEDBACK_CHAR_LIMIT, UI_STRINGS, INLINE_STYLES} from './util';

export class FeedBackBox extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            charCtr : 0,
            errorMsg : ''
        };

        // this.updateTextField = this.updateTextField.bind(this);
    }

    updateTextField(event,value) {

        if (value.length < FEEDBACK_CHAR_LIMIT) {
            this.setState({
               charCtr : value.length,
               errorMsg : ''
            });
        } else {
            this.setState({
                charCtr : FEEDBACK_CHAR_LIMIT,
                errorMsg : UI_STRINGS.FEEDBACK_CHAR_LIMIT_ERROR_MSG
            })
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={() => {
                    this.props.onSelectCancel();
                    this.setState({
                        charCtr : 0,
                        errorMsg: ''
                    })}
                }
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onClick={() => {console.log("submit");}}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={UI_STRINGS.FEEDBACK_BOX_TITLE}
                    actions={actions}
                    onRequestClose={() => {
                        this.props.onSelectCancel();
                        this.setState({
                            charCtr : 0,
                            errorMsg: ''
                        })}
                    }
                    open={this.props.open}
                >
                    <TextField
                        fullWidth={true}
                        multiLine={true}
                        rowsMax={10}
                        maxLength={FEEDBACK_CHAR_LIMIT}
                        hintText={UI_STRINGS.FEEDBACK_PLACEHOLDER}
                        onChange={(e,v) => this.updateTextField(e,v)}
                        errorText={this.state.errorMsg}
                        errorStyle={INLINE_STYLES.betterYellow}
                    />
                    <p className="right">{this.state.charCtr}/{FEEDBACK_CHAR_LIMIT}</p>
                </Dialog>
            </div>
        );
    }
}
