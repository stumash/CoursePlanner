import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { ProgramSelectionDialog } from "./programSelectionDialog";
import { MOCK_ALL_SEQUENCES } from "../../util/mock";
import { MUI_THEME, PROGRAM_NAMES, PROGRAM_OPTIONS, PROGRAM_ENTRY_TYPES } from "../../util/util";

let mockAllSequencesClone;

beforeEach(() => {
    mockAllSequencesClone = cloneObject(MOCK_ALL_SEQUENCES.ALL_SEQUENCES);
});

describe("class functions", () => {
    let programSelectionDialogClass, mockOnChangeChosenProgram;

    beforeEach(() => {
        mockOnChangeChosenProgram = jest.fn();
        programSelectionDialogClass = new ProgramSelectionDialog({
            allSequences: [],
            isOpen: false,
            onChangeChosenProgram: mockOnChangeChosenProgram
        });
        programSelectionDialogClass.setState = jest.fn();
    });

    describe("constructor", () => {
        test("should initialize state variables", () => {
            expect(programSelectionDialogClass.state).toEqual({
                chosenProgram: undefined,
                chosenOption: undefined,
                chosenEntryType: undefined,
                dropdownItems: {
                    program: [],
                    option: [],
                    entryType: []
                },
                finished: false,
                stepIndex: 0
            });
        });
    });

    describe("componentDidUpdate", () => {
        describe("iff allSequences prop has changed, should call updateProgramItems", () => {
            let prevProps;

            beforeEach(() => {
                programSelectionDialogClass.updateProgramItems = jest.fn();
                expect(programSelectionDialogClass.props.allSequences).toEqual([]);
                prevProps = cloneObject(programSelectionDialogClass.props);
            });

            test("allSequences prop has not changed", () => {
                programSelectionDialogClass.componentDidUpdate(prevProps);
                expect(programSelectionDialogClass.updateProgramItems.mock.calls.length).toBe(0);
            });

            test("allSequences prop has changed", () => {
                programSelectionDialogClass.props.allSequences = mockAllSequencesClone;
                programSelectionDialogClass.componentDidUpdate(prevProps);
                expect(programSelectionDialogClass.updateProgramItems.mock.calls.length).toBe(1);
            });
        });
    });

    describe("handleProgramNameSelection", () => {
        let mockProgramName, setStateCalls;

        beforeEach(() => {
            mockProgramName = "SOME_PROGRAM";
            programSelectionDialogClass.handleProgramNameSelection(null, null, mockProgramName);
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0].length).toBe(2);
        });

        test("should set the chosenProgram state variable to the value parameter", () => {
            expect(setStateCalls[0][0].chosenProgram).toBe(mockProgramName);
        });

        test("should pass updateOptionItems as second parameter of setState call", () => {
            expect(setStateCalls[0][1]).toBe(programSelectionDialogClass.updateOptionItems);
        });
    });

    describe("handleOptionSelection", () => {
        let mockOption, setStateCalls;

        beforeEach(() => {
            mockOption = "SOME_OPTION";
            programSelectionDialogClass.handleOptionSelection(null, null, mockOption);
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0].length).toBe(2);
        });

        test("should set the chosenOption state variable to the value parameter", () => {
            expect(setStateCalls[0][0].chosenOption).toBe(mockOption);
        });

        test("should pass updateEntryTypeItems as second parameter of setState call", () => {
            expect(setStateCalls[0][1]).toBe(programSelectionDialogClass.updateEntryTypeItems);
        });
    });

    describe("handleEntryTypeSelection", () => {
        let mockEntryType, setStateCalls;

        beforeEach(() => {
            mockEntryType = "SOME_ENTRY_TYPE";
            programSelectionDialogClass.handleEntryTypeSelection(null, null, mockEntryType);
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0].length).toBe(1);
        });

        test("should set the chosenEntryType state variable to the value parameter", () => {
            expect(setStateCalls[0][0].chosenEntryType).toBe(mockEntryType);
        });
    });

    describe("handleNextClick", () => {
        let setStateCalls;
        let performTest = () => {
            programSelectionDialogClass.handleNextClick();
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
        };

        test("should update the stepIndex and finished state variables", () => {
            performTest();
            expect(Object.keys(setStateCalls[0][0])).toEqual(["stepIndex", "finished"]);
        });

        describe("iff stepIndex is greater than or equal to two, should set finished state variable to true", () => {
            describe("stepIndex is greater than or equal to two", () => {
                let stepIndexOptions = [ 2, 3 ];
                // perform test for each configuration
                stepIndexOptions.forEach((stepIndex) => {
                    test("stepIndex = " + stepIndex, () => {
                        programSelectionDialogClass.state.stepIndex = stepIndex;
                        performTest();
                        expect(setStateCalls[0][0].finished).toBe(true);
                    });
                });
            });

            describe("stepIndex is smaller than two", () => {
                let stepIndexOptions = [ 0, 1 ];
                // perform test for each configuration
                stepIndexOptions.forEach((stepIndex) => {
                    test("stepIndex = " + stepIndex, () => {
                        programSelectionDialogClass.state.stepIndex = stepIndex;
                        performTest();
                        expect(setStateCalls[0][0].finished).toBe(false);
                    });
                });
            });
        });

        describe("if the stepIndex is not 0 or there exists more than one program option, should increment stepIndex", () => {
            let stepIndexOptions = [ 0, 1, 2, 3 ];
            // perform test for each configuration
            stepIndexOptions.forEach((stepIndex) => {
                test("stepIndex = " + stepIndex, () => {
                    programSelectionDialogClass.state.stepIndex = stepIndex;
                    programSelectionDialogClass.state.dropdownItems.option = [ "SOME_OPTION", "SOME_OTHER_OPTION" ];
                    performTest();
                    expect(setStateCalls[0][0].stepIndex).toBe(stepIndex + 1);
                });
            });
        });

        test("if there is only one option to choose and stepIndex is 0, should skip over the options dropdown", () => {
            programSelectionDialogClass.state.stepIndex = 0;
            programSelectionDialogClass.state.dropdownItems.option = [ "SOME_OPTION" ];
            performTest();
            expect(setStateCalls[0][0].stepIndex).toBe(2);
        });
    });

    describe("handlePrevClick", () => {
        test("if the stepIndex state variable is <= 0, should not update the component state", () => {
            programSelectionDialogClass.state.stepIndex = 0;
            programSelectionDialogClass.handlePrevClick();
            expect(programSelectionDialogClass.setState.mock.calls.length).toBe(0);
        });

        describe("if the stepIndex state variable is > 0, should decrement it", () => {
            let stepIndexOptions = [ 1, 2, 3 ];
            // perform test for each configuration
            stepIndexOptions.forEach((stepIndex) => {
                test("stepIndex = " + stepIndex, () => {
                    programSelectionDialogClass.state.stepIndex = stepIndex;
                    programSelectionDialogClass.handlePrevClick();
                    expect(programSelectionDialogClass.setState.mock.calls.length).toBe(1);
                    expect(programSelectionDialogClass.setState.mock.calls[0][0].stepIndex).toBe(stepIndex - 1);
                });
            });
        });
    });

    describe("handleConfirmClick", () => {
        test("should call onChangeChosenProgram with full program ID", () => {
            programSelectionDialogClass.state.chosenProgram = "SOME_PROGRAM";
            programSelectionDialogClass.state.chosenOption = "SOME_OPTION";
            programSelectionDialogClass.state.chosenEntryType = "SOME_ENTRY_TYPE";
            programSelectionDialogClass.handleConfirmClick();
            expect(mockOnChangeChosenProgram.mock.calls.length).toBe(1);
            expect(mockOnChangeChosenProgram.mock.calls[0][0]).toBe(
                programSelectionDialogClass.state.chosenProgram + "-" +
                programSelectionDialogClass.state.chosenOption + "-" +
                programSelectionDialogClass.state.chosenEntryType
            );
        });

        test("should set state.stepIndex to 0 and state.finished to false", () => {
            programSelectionDialogClass.handleConfirmClick();
            let setStateCalls = programSelectionDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0][0]).toEqual({ stepIndex: 0, finished: false });
        });
    });

    describe("handleBackClick", () => {
        test("should set state.stepIndex to 2 and state.finished to false", () => {
            programSelectionDialogClass.handleBackClick();
            let setStateCalls = programSelectionDialogClass.setState.mock.calls;
            expect(setStateCalls.length).toBe(1);
            expect(setStateCalls[0][0]).toEqual({ stepIndex: 2, finished: false });
        });
    });

    describe("updateProgramItems", () => {
        let setStateCalls;
        let performTest = () => {
            programSelectionDialogClass.props.allSequences = mockAllSequencesClone;
            programSelectionDialogClass.updateProgramItems();
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
        };

        test("should update the chosenProgram and dropdownItems state variables", () => {
            performTest();
            expect(Object.keys(setStateCalls[0][0])).toEqual(["chosenProgram", "dropdownItems"]);
        });

        test("should pass updateOptionItems as second parameter of setState call", () => {
            performTest();
            expect(setStateCalls[0][1]).toBe(programSelectionDialogClass.updateOptionItems);
        });

        test("should set chosenProgram state varible to the first program name", () => {
            performTest();
            expect(setStateCalls[0][0].chosenProgram).toBe(Object.keys(PROGRAM_NAMES)[0]);
        });

        test("should create a dropdown item for each program name", () => {
            performTest();
            expect(setStateCalls[0][0].dropdownItems.program.length).toBe(Object.keys(PROGRAM_NAMES).length);
        });
    });

    // TODO: simplify this function (will probs require backend changes) before completing the tests for this function
    describe("updateOptionItems", () => {
        let setStateCalls;
        let performTest = () => {
            programSelectionDialogClass.props.allSequences = mockAllSequencesClone;
            programSelectionDialogClass.state.chosenProgram = "SOEN";
            programSelectionDialogClass.updateOptionItems();
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
        };

        test("should update the chosenOption and dropdownItems state variables", () => {
            performTest();
            expect(Object.keys(setStateCalls[0][0])).toEqual(["chosenOption", "dropdownItems"]);
        });

        test("should pass updateEntryTypeItems as second parameter of setState call", () => {
            performTest();
            expect(setStateCalls[0][1]).toBe(programSelectionDialogClass.updateEntryTypeItems);
        });
    });

    // TODO: simplify this function (will probs require backend changes) before completing the tests for this function
    describe("updateEntryTypeItems", () => {
        let setStateCalls;
        let performTest = () => {
            programSelectionDialogClass.props.allSequences = mockAllSequencesClone;
            programSelectionDialogClass.state.chosenProgram = "SOEN";
            programSelectionDialogClass.state.chosenOption = "General";
            programSelectionDialogClass.updateEntryTypeItems();
            setStateCalls = programSelectionDialogClass.setState.mock.calls;
        };

        test("should update the chosenEntryType and dropdownItems state variables", () => {
            performTest();
            expect(Object.keys(setStateCalls[0][0])).toEqual(["chosenEntryType", "dropdownItems"]);
        });
    });
});

describe("DOM", () => {
    test("show loading animation while sequences are loading", () => {
        let programSelectionDialogWrapper = shallow(
            <MuiThemeProvider muiTheme={MUI_THEME}>
                <ProgramSelectionDialog allSequences={[]}
                                        isOpen={true}
                                        onChangeChosenProgram={jest.fn()}/>
            </MuiThemeProvider>
        ).dive();

        // make snapshot of initial DOM
        expect(programSelectionDialogWrapper).toMatchSnapshot();
    });

    test("select COMP-Games-Coop program and confirm selection", () => {
        let programSelectionDialogWrapper = shallow(
            <MuiThemeProvider muiTheme={MUI_THEME}>
                <ProgramSelectionDialog allSequences={mockAllSequencesClone}
                                        isOpen={true}
                                        onChangeChosenProgram={jest.fn()}/>
            </MuiThemeProvider>
        ).dive();
        let programSelectionDialogInstance = programSelectionDialogWrapper.instance();
        programSelectionDialogInstance.updateProgramItems();
        programSelectionDialogWrapper.update();

        // make snapshot of initial DOM
        expect(programSelectionDialogWrapper).toMatchSnapshot();

        // select COMP program
        programSelectionDialogInstance.handleProgramNameSelection(null, null, "COMP");
        programSelectionDialogWrapper.update();
        expect(programSelectionDialogWrapper).toMatchSnapshot();

        // confirm selection
        programSelectionDialogInstance.handleNextClick();
        programSelectionDialogWrapper.update();
        expect(programSelectionDialogWrapper).toMatchSnapshot();

        // select Games option
        programSelectionDialogInstance.handleOptionSelection(null, null, "Games");
        programSelectionDialogWrapper.update();
        expect(programSelectionDialogWrapper).toMatchSnapshot();

        // confirm selection
        programSelectionDialogInstance.handleNextClick();
        programSelectionDialogWrapper.update();
        expect(programSelectionDialogWrapper).toMatchSnapshot();

        // select Coop entry type
        programSelectionDialogInstance.handleEntryTypeSelection(null, null, "Coop");
        programSelectionDialogWrapper.update();
        expect(programSelectionDialogWrapper).toMatchSnapshot();

        // confirm selection
        programSelectionDialogInstance.handleNextClick();
        programSelectionDialogWrapper.update();
        expect(programSelectionDialogWrapper).toMatchSnapshot();
    });
});