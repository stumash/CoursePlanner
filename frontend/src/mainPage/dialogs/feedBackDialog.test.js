import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from "jquery";
import { FeedBackDialog } from "./feedBackDialog";
import { MUI_THEME, UI_STRINGS, FEEDBACK_CHAR_LIMIT } from "../../util/util";
import { MOCK_FEEDBACK } from "../../util/mock";

let mockFeedbackClone;

beforeEach(() => {
    mockFeedbackClone = cloneObject(MOCK_FEEDBACK.MEAN_GUY);
});

let generateLongFeedbackMsg = () => {
    let feedback = "";
    for(let i = 0; i < FEEDBACK_CHAR_LIMIT; i++){
        feedback += "$";
    }
    return feedback;
};

describe("class functions", () => {
    let feedBackDialogClass, mockOnRequestClose;

    beforeEach(() => {
        mockOnRequestClose = jest.fn();
        feedBackDialogClass = new FeedBackDialog({
            isOpen: false,
            onRequestClose: mockOnRequestClose
        });
        feedBackDialogClass.setState = jest.fn();
    });

    describe("constructor", () => {
        test("should initialize state variables", () => {
            expect(feedBackDialogClass.state).toEqual({
                feedBackMsg: "",
                errorMsg: "",
                snackBar: {
                    isShowing: false,
                    message: ""
                }
            });
        });
    });

    describe("updateTextField", () => {
        let feedback, setStateCalls;
        let performTest = () => {
            feedBackDialogClass.updateTextField(null, feedback);
            setStateCalls = feedBackDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
        };

        beforeEach(() => {
            feedback = mockFeedbackClone;
        });

        test("should update the feedBackMsg and errorMsg state variables", () => {
            performTest();
            expect(Object.keys(setStateCalls[0][0])).toEqual(["feedBackMsg", "errorMsg"]);
        });

        describe("if the entered text is less than the character limit", () => {
            beforeEach(() => {
                expect(mockFeedbackClone.length).toBeLessThan(FEEDBACK_CHAR_LIMIT);
            });

            test("should set the feedBackMsg state variable to the entered text as is", () => {
                expect(setStateCalls[0][0].feedBackMsg).toBe(mockFeedbackClone);
            });

            test("should set the errorMsg state variable to an empty string", () => {
                expect(setStateCalls[0][0].errorMsg).toBe("");
            });
        });

        describe("if the entered text is >= FEEDBACK_CHAR_LIMIT" +
                 "should shorten value to character limit and set error message state variable to UI_STRINGS.FEEDBACK_CHAR_LIMIT_ERROR_MSG", () => {
            beforeEach(() => {
                feedback = generateLongFeedbackMsg();
                expect(feedback.length).toEqual(FEEDBACK_CHAR_LIMIT);
            });

            test("entered text == FEEDBACK_CHAR_LIMIT", () => {
                performTest();
                expect(setStateCalls[0][0].feedBackMsg).toBe(feedback.slice(0, FEEDBACK_CHAR_LIMIT));
                expect(setStateCalls[0][0].errorMsg).toBe(UI_STRINGS.FEEDBACK_CHAR_LIMIT_ERROR_MSG);
            });

            test("entered text > FEEDBACK_CHAR_LIMIT", () => {
                feedback += "$";
                performTest();
                expect(setStateCalls[0][0].feedBackMsg).toBe(feedback.slice(0, FEEDBACK_CHAR_LIMIT));
                expect(setStateCalls[0][0].errorMsg).toBe(UI_STRINGS.FEEDBACK_CHAR_LIMIT_ERROR_MSG);
            });
        });
    });

    describe("handleCloseSnackBar", () => {
        test("should set state.snackBar.isShowing to false and state.snackBar.message to an empty string", () => {
            feedBackDialogClass.handleCloseSnackBar();
            let setStateCalls = feedBackDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0][0]).toEqual({
                snackBar: { isShowing: false, message: "" }
            });
        });
    });

    describe("handleCloseFeedBackBox", () => {
        test("should call onRequestClose", () => {
            feedBackDialogClass.handleCloseFeedBackBox();
            expect(mockOnRequestClose.mock.calls.length).toBe(1);
        });

        test("should set state.feedBackMsg and state.errorMsg to empty strings", () => {
            feedBackDialogClass.handleCloseFeedBackBox();
            let setStateCalls = feedBackDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0][0]).toEqual({ feedBackMsg: "", errorMsg: "" });
        });
    });

    describe("handleSubmit", () => {
        beforeEach(() => {
            feedBackDialogClass.sendFeedBackMsg = jest.fn();
            feedBackDialogClass.handleCloseFeedBackBox = jest.fn();
        });

        test("if feedBackMsg state varible is an empty string, should do nothing", () => {
            feedBackDialogClass.state.feedBackMsg = "";
            feedBackDialogClass.handleSubmit();
            expect(feedBackDialogClass.sendFeedBackMsg.mock.calls.length).toBe(0);
            expect(feedBackDialogClass.handleCloseFeedBackBox.mock.calls.length).toBe(0);
        });

        test("if feedBackMsg state varible is not an empty string, should call sendFeedBackMsg and handleCloseFeedBackBox", () => {
            feedBackDialogClass.state.feedBackMsg = "NON EMPTY STRING";
            feedBackDialogClass.handleSubmit();
            expect(feedBackDialogClass.sendFeedBackMsg.mock.calls.length).toBe(1);
            expect(feedBackDialogClass.handleCloseFeedBackBox.mock.calls.length).toBe(1);
        });
    });

    describe("sendFeedBackMsg", () => {
        test("should perform a POST request at api/feedback", () => {
            feedBackDialogClass.state.feedBackMsg = mockFeedbackClone;
            feedBackDialogClass.sendFeedBackMsg();

            let mockCalls = $.ajax.mock.calls;
            expect(mockCalls.length).toBe(1);

            let ajaxArgs = mockCalls[0][0];
            expect(ajaxArgs.type).toBe("POST");
            expect(ajaxArgs.url).toBe("api/feedback");
            expect(ajaxArgs.data).toBe(JSON.stringify({ message: mockFeedbackClone }));
            expect(ajaxArgs.success).toBe(feedBackDialogClass.handleSendFeedBackSuccess);
            expect(ajaxArgs.error).toBe(feedBackDialogClass.handleSendFeedBackError);
        });
    });

    describe("handleSendFeedBackSuccess", () => {
        let setStateCalls;
        let performTest = (serverResponse) => {
            feedBackDialogClass.handleSendFeedBackSuccess(JSON.stringify(serverResponse));
            setStateCalls = feedBackDialogClass.setState.mock.calls;
        };

        describe("if the server responded with a success property with the value true", () => {
            test("should set state.snackBar.isShowing to true and state.snackBar.message to UI_STRINGS.FEEDBACK_SEND_SUCCESS_MSG", () => {
                performTest({ success: true });
                expect(setStateCalls.length).toBe(1);
                expect(setStateCalls[0][0]).toEqual({
                    snackBar: { isShowing: true, message: UI_STRINGS.FEEDBACK_SEND_SUCCESS_MSG }
                });
            });
        });

        describe("if the server did not respond with a success property with the value true", () => {
            test("should call handleSendFeedBackError", () => {
                feedBackDialogClass.handleSendFeedBackError = jest.fn();
                performTest({ success: false });
                expect(setStateCalls.length).toBe(0);
                expect(feedBackDialogClass.handleSendFeedBackError.mock.calls.length).toBe(1);
            });
        });
    });

    describe("handleSendFeedBackError", () => {
        test("should set state.snackBar.isShowing to true and state.snackBar.message to UI_STRINGS.FEEDBACK_SEND_ERROR_MSG", () => {
            feedBackDialogClass.handleSendFeedBackError();
            let setStateCalls = feedBackDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0][0]).toEqual({
                snackBar: { isShowing: true, message: UI_STRINGS.FEEDBACK_SEND_ERROR_MSG }
            });
        });
    });
});

describe("DOM", () => {
    test("type too many characters then submit the result", () => {
        let feedBackDialogWrapper = shallow(
            <MuiThemeProvider muiTheme={MUI_THEME}>
                <FeedBackDialog isOpen={true}
                                onRequestClose={jest.fn()}/>
            </MuiThemeProvider>
        ).dive();
        let feedBackDialogInstance = feedBackDialogWrapper.instance();

        // make snapshot of initial DOM
        expect(feedBackDialogWrapper).toMatchSnapshot();

        // type a short feedback message
        feedBackDialogInstance.updateTextField(null, mockFeedbackClone);
        feedBackDialogWrapper.update();
        expect(feedBackDialogWrapper).toMatchSnapshot();

        // type too many characters
        let longMessage = generateLongFeedbackMsg();
        expect(mockFeedbackClone.length + longMessage.length).toBeGreaterThan(FEEDBACK_CHAR_LIMIT);
        feedBackDialogInstance.updateTextField(null, longMessage);
        feedBackDialogWrapper.update();
        expect(feedBackDialogWrapper).toMatchSnapshot();

        // submit the message and handle successful server response
        feedBackDialogInstance.handleSubmit();
        feedBackDialogInstance.handleSendFeedBackSuccess(JSON.stringify({ success: true }));
        feedBackDialogWrapper.update();
        expect(feedBackDialogWrapper).toMatchSnapshot();

        // handle failed server response
        feedBackDialogInstance.handleSendFeedBackError(JSON.stringify({}));
        feedBackDialogWrapper.update();
        expect(feedBackDialogWrapper).toMatchSnapshot();
    });
});