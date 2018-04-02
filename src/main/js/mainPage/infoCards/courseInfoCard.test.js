import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { CourseInfoCard } from "./courseInfoCard";
import { MOCK_COURSE_INFO_OBJECTS, MOCK_POSITION_OBJECTS } from "../../util/mock";
import { MUI_THEME } from "../../util/util";

let courseInfoCardClass, mockOnChangeDragState, mockCourseInfoClone, mockPositionClone;

beforeEach(() => {
    mockOnChangeDragState = jest.fn();
    mockCourseInfoClone = cloneObject(MOCK_COURSE_INFO_OBJECTS.NO_PREREQS_NO_COREQS);
    mockPositionClone = cloneObject(MOCK_POSITION_OBJECTS.FALL_0_COURSE_0);
    courseInfoCardClass = new CourseInfoCard({
        courseInfo: mockCourseInfoClone,
        onChangeDragState: mockOnChangeDragState
    });
});

describe("handleChangeDragState", () => {
    beforeEach(() => {
        courseInfoCardClass.setState = jest.fn();
    });

    test("should call props.onChangeDragState with passed params", () => {
        let isDragging = true;
        courseInfoCardClass.handleChangeDragState(isDragging, mockPositionClone, mockCourseInfoClone);
        expect(mockOnChangeDragState.mock.calls.length).toBe(1);
        expect(mockOnChangeDragState.mock.calls[0].length).toBe(3);
        expect(mockOnChangeDragState.mock.calls[0][0]).toBe(isDragging);
        expect(mockOnChangeDragState.mock.calls[0][1]).toBe(mockPositionClone);
        expect(mockOnChangeDragState.mock.calls[0][2]).toBe(mockCourseInfoClone);
    });

    describe("should update the courseBeingDragged state variable to equal the isDragging argument", () => {
        let performTest = (isDragging) => {
            courseInfoCardClass.handleChangeDragState(isDragging, mockPositionClone, mockCourseInfoClone);
            expect(courseInfoCardClass.setState.mock.calls.length).toBe(1);
            expect(courseInfoCardClass.setState.mock.calls[0].length).toBe(1);
            expect(courseInfoCardClass.setState.mock.calls[0][0].courseBeingDragged).toBe(isDragging);
        };

        test("isDragging is true", () => {
            performTest(true);
        });
        test("isDragging is false", () => {
            performTest(false);
        });
    });
});

describe("DOM", () => {
    let testSnapshotFromCourseInfo = (courseInfo) => {
        let courseInfoCardWrapper = shallow(
            <MuiThemeProvider muiTheme={MUI_THEME}>
                <CourseInfoCard courseInfo={courseInfo}
                                onChangeDragState={jest.fn()}/>
            </MuiThemeProvider>
        ).dive();
        expect(courseInfoCardWrapper).toMatchSnapshot();
    };

    test("if the courseInfo prop is an empty object, should display a hint heading text and nothing else", () => {
        testSnapshotFromCourseInfo({});
    });

    test("if the courseInfo prop has isLoading=true, should display a loading heading text and icon", () => {
        testSnapshotFromCourseInfo({ isLoading: true });
    });

    describe("if the courseInfo prop has a code", () => {
        test("should display the course name and credits in the card header and the course description in the card body", () => {
            testSnapshotFromCourseInfo(cloneObject(MOCK_COURSE_INFO_OBJECTS.NO_PREREQS_NO_COREQS))
        });

        describe("should not display prerequsites or corequisites sections if there are none", () => {
            let configurations = ["NO_PREREQS_NO_COREQS",
                                  "PREREQS_ONLY",
                                  "COREQS_ONLY",
                                  "PREREQS_AND_COREQS"];
            // perform test for each configuration
            configurations.forEach((key) => {
                test(key, () => {
                    testSnapshotFromCourseInfo(cloneObject(MOCK_COURSE_INFO_OBJECTS[key]))
                });
            });
        });
    });
});
