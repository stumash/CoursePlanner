import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { SequenceValidationCard } from "./sequenceValidationCard";
import { MOCK_VALIDATION_RESULTS } from "../../util/mock";
import { MUI_THEME } from "../../util/util";

describe("DOM", () => {
    let testSnapshotFromValidationResults = (validationResults) => {
        let sequenceValidationCardWrapper = shallow(
            <MuiThemeProvider muiTheme={MUI_THEME}>
                <SequenceValidationCard validationResults={validationResults}
                                        onMouseEnterItem={jest.fn()}
                                        onMouseLeaveItem={jest.fn()}/>
            </MuiThemeProvider>
        ).dive();
        expect(sequenceValidationCardWrapper).toMatchSnapshot();
    };

    // the two tests in this describe should generate equivalent snapshots
    describe("if the sequence is valid",  () => {
        test("should display UI_STRINGS.VALIDATION_SUCCESS_MSG heading text and nothing else", () => {
            testSnapshotFromValidationResults(cloneObject(MOCK_VALIDATION_RESULTS.VALID_NO_EXEMPTIONS));
        });
        test("should ignore issues related to exempted courses", () => {
            testSnapshotFromValidationResults(cloneObject(MOCK_VALIDATION_RESULTS.VALID_WITH_EXEMPTIONS));
        });
    });

    describe("if the validation is loading", () => {
        test("should display UI_STRINGS.VALIDATION_LOADING and a loading icon", () => {
            let validationResults = cloneObject(MOCK_VALIDATION_RESULTS.VALID_NO_EXEMPTIONS);
            validationResults.isLoading = true;
            testSnapshotFromValidationResults(validationResults);
        });
        test("should continue to display issues/warnings while loading", () => {
            let validationResults = cloneObject(MOCK_VALIDATION_RESULTS.ONE_ISSUE_ONE_WARNING);
            validationResults.isLoading = true;
            testSnapshotFromValidationResults(validationResults);
        });
    });

    describe("if the sequence is not valid", () => {
        describe("should not display issues or warnings if there are none", () => {
            let configurations = ["ONE_ISSUE_ONLY",
                                  "ONE_WARNING_ONLY",
                                  "ONE_ISSUE_ONE_WARNING"];
            // perform test for each configuration
            configurations.forEach((key) => {
                test(key, () => {
                    testSnapshotFromValidationResults(cloneObject(MOCK_VALIDATION_RESULTS[key]))
                });
            });
        });

        describe("should display formatted text related to each issue/warning type", () => {
            let configurations = ["ISSUE_TYPE_PREREQ",
                                  "ISSUE_TYPE_COREQ",
                                  "ISSUE_TYPE_CREDITS",
                                  "WARNING_TYPE_UNSELECTED",
                                  "WARNING_TYPE_REPEATED"];
            // perform test for each configuration
            configurations.forEach((key) => {
                test(key, () => {
                    testSnapshotFromValidationResults(cloneObject(MOCK_VALIDATION_RESULTS[key]))
                });
            });
        });
    });
});
