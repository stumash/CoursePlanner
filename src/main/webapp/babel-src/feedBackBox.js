import React from "react";
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import { FEEDBACK_SNACKBAR_AUTOHIDE_DURATION,
         FEEDBACK_CHAR_LIMIT,
         FEEDBACK_ROWS_MAX,
         UI_STRINGS,
         INLINE_STYLES} from './util';

export class FeedBackBox extends React.Component {
    constructor(props) {
        super(props);

        this.feedBackMsg = "";
        this.state = {
            charCtr: 0,
            errorMsg: "",
            sendSuccess: false,
            sendError: false
        };

        this.updateTextField = this.updateTextField.bind(this);
        this.handleCloseSnackBar = this.handleCloseSnackBar.bind(this);
        this.handleCloseFeedBackBox = this.handleCloseFeedBackBox.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendFeedBackMsg = this.sendFeedBackMsg.bind(this);
    }

    updateTextField(event,value) {

        if (value.length < FEEDBACK_CHAR_LIMIT) {
            this.feedBackMsg = value;
            this.setState({
               charCtr: value.length,
               errorMsg: ""
            });
        } else {
            this.setState({
                charCtr: FEEDBACK_CHAR_LIMIT,
                errorMsg: UI_STRINGS.FEEDBACK_CHAR_LIMIT_ERROR_MSG
            })
        }
    }

    handleCloseSnackBar() {
        this.setState({
            sendSuccess: false,
            sendError: false
        });
    }

    handleCloseFeedBackBox() {
        this.props.onRequestClose();
        this.setState({
            charCtr: 0,
            errorMsg: ''
        });
    }

    handleSubmit() {
        if (this.feedBackMsg !== "") {
            this.sendFeedBackMsg();
            this.handleCloseFeedBackBox();
        }
    }

    render() {
        const actions = [
            <FlatButton
                label="Cancel"
                primary={false}
                onClick={this.handleCloseFeedBackBox}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                onClick={this.handleSubmit}
            />,
        ];

        return (
            <div>
                <Dialog
                    title={UI_STRINGS.FEEDBACK_BOX_TITLE}
                    actions={actions}
                    onRequestClose={this.handleCloseFeedBackBox}
                    open={this.props.open}
                >
                    <TextField
                        fullWidth={true}
                        multiLine={true}
                        rowsMax={FEEDBACK_ROWS_MAX}
                        maxLength={FEEDBACK_CHAR_LIMIT}
                        hintText={UI_STRINGS.FEEDBACK_PLACEHOLDER}
                        onChange={this.updateTextField}
                        errorText={this.state.errorMsg}
                        errorStyle={INLINE_STYLES.betterYellow}
                    />
                    <p className="charLimitIndicator">{this.state.charCtr}/{FEEDBACK_CHAR_LIMIT}</p>
                </Dialog>
                <Snackbar
                    open={this.state.sendSuccess}
                    message={UI_STRINGS.FEEDBACK_SEND_SUCCESS_MSG}
                    autoHideDuration={FEEDBACK_SNACKBAR_AUTOHIDE_DURATION}
                    onRequestClose={this.handleCloseSnackBar}
                />
                <Snackbar
                    open={this.state.sendError}
                    message={UI_STRINGS.FEEDBACK_SEND_ERROR_MSG}
                    autoHideDuration={FEEDBACK_SNACKBAR_AUTOHIDE_DURATION}
                    onRequestClose={this.handleCloseSnackBar}
                />
            </div>
        );
    }

    /*
     *  Backend API calls:
     */

    sendFeedBackMsg () {
        $.ajax({
            type: "POST",
            url: "api/feedback",
            data: JSON.stringify({message: this.feedBackMsg}),
            success: (response) => {
                let responseObject = JSON.parse(response);

                this.setState({
                    sendSuccess: responseObject.success,
                    sendError: !responseObject.success
                });
            },
            error: (response) => {
                this.setState({
                    sendSuccess: false
                })
            }
        });
    }
}
