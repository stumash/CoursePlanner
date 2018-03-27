import React from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import $ from "jquery";
import { SearchBox } from "./searchBox";
import { mockSearchBoxInput, mockSearchResults } from "../../util/mock";
import { MUI_THEME, UI_STRINGS } from "../../util/util";

let searchBoxClass, mockOnConfirmSearch;

beforeEach(() => {
    $.ajax.mockClear();
    mockOnConfirmSearch = jest.fn();
    searchBoxClass = new SearchBox({
        onConfirmSearch: mockOnConfirmSearch
    });
});

describe("handleNewRequest", () => {
    test("if index is -1, should call onConfirmSearch with the chosenRequest in upper case", () => {
        let chosenRequest = cloneObject(mockSearchBoxInput[0]);
        let index = -1;
        searchBoxClass.handleNewRequest(chosenRequest, index);
        expect(mockOnConfirmSearch.mock.calls[0][0]).toBe(chosenRequest.toUpperCase());
    });

    describe("if index is not -1", () => {
        let index = 0;

        test("if the chosenRequest has a non-empty value, should call onConfirmSearch with the value in upper case", () => {
            let chosenRequest = {value: cloneObject(mockSearchBoxInput[0])};
            searchBoxClass.handleNewRequest(chosenRequest, index);
            expect(mockOnConfirmSearch.mock.calls.length).toBe(1);
            expect(mockOnConfirmSearch.mock.calls[0][0]).toBe(chosenRequest.value.toUpperCase());
        });

        test("if the chosenRequest has an empty value, should not call onConfirmSearch", () => {
            let chosenRequest = {value: ""};
            searchBoxClass.handleNewRequest(chosenRequest, index);
            expect(mockOnConfirmSearch.mock.calls.length).toBe(0);
        });
    });
});

describe("filterCourseCodes", () => {
    beforeEach(() => {
        searchBoxClass.setState = jest.fn();
    });

    test("should set the isFiltering state variable to true", () => {
        let searchQuery = cloneObject(mockSearchBoxInput[0]);
        searchBoxClass.filterCourseCodes(searchQuery);
        expect(searchBoxClass.setState.mock.calls.length).toBe(1);
        expect(searchBoxClass.setState.mock.calls[0][0]).toEqual({ isFiltering: true });
    });

    test("should perform a POST request at api/filtercoursecodes", () => {
        let searchQuery = cloneObject(mockSearchBoxInput[0]);
        searchBoxClass.filterCourseCodes(searchQuery);

        let mockCalls = $.ajax.mock.calls;
        expect(mockCalls.length).toBe(1);

        let ajaxArgs = mockCalls[0][0];
        expect(ajaxArgs.type).toBe("POST");
        expect(ajaxArgs.url).toBe("api/filtercoursecodes");
        expect(ajaxArgs.data).toBe(JSON.stringify({ filter: searchQuery }));
        expect(ajaxArgs.success).toBe(searchBoxClass.onFilterSuccess);
    });
});

describe("onFilterSuccess", () => {
    let mockSearchResultsClone, mockCalls, args;

    let performTest = (results) => {
        searchBoxClass.onFilterSuccess(JSON.stringify(results));
        mockCalls = searchBoxClass.setState.mock.calls;
        expect(mockCalls.length).toBe(1);
        args = mockCalls[0][0];
    };

    beforeEach(() => {
        searchBoxClass.setState = jest.fn();
        mockSearchResultsClone = cloneObject(mockSearchResults);
    });

    test("should update the isFiltering, filterResults, and floatingLabelText state variables", () => {
        performTest(mockSearchResultsClone);
        expect(Object.keys(args)).toEqual(["isFiltering", "filterResults", "floatingLabelText"]);
    });

    test("should set the isFiltering state variable to false", () => {
        performTest(mockSearchResultsClone);
        expect(args.isFiltering).toBe(false);
    });

    describe("if the response text is an empty array", () => {
        beforeEach(() => {
            performTest([]);
        });

        test("should set the floating label text to UI_STRINGS.COURSE_SEARCH_FOUND_NONE", () => {
            expect(args.floatingLabelText).toBe(UI_STRINGS.COURSE_SEARCH_FOUND_NONE);
        });

        test("should set filterResults to an empty array", () => {
            expect(args.filterResults).toEqual([]);
        });
    });

    describe("if the response text is an array with length greater than 0", () => {
        beforeEach(() => {
            expect(mockSearchResultsClone.length).toBeGreaterThan(0);
            performTest(mockSearchResultsClone);
        });

        test("should set the floating label text to UI_STRINGS.DEFAULT_SEARCH_LABEL", () => {
            expect(args.floatingLabelText).toBe(UI_STRINGS.DEFAULT_SEARCH_LABEL);
        });

        test("should add an object with a text and value property to the filterResults array for each search result", () => {
            expect(args.filterResults.length).toBe(mockSearchResultsClone.length);
            expect(Object.keys(args.filterResults[0])).toEqual(["text", "value"]);
        });
    });
});

describe("DOM", () => {
    let searchBoxWrapper, searchBoxInstance;

    beforeEach(() => {
        searchBoxWrapper = shallow(
            <MuiThemeProvider muiTheme={MUI_THEME}>
                <SearchBox onConfirmSearch={jest.fn()}/>
            </MuiThemeProvider>
        ).dive();
        searchBoxInstance = searchBoxWrapper.instance();
    });

    test("should display a loading icon while filtering and display the results after filtering", () => {
        // make snapshot of inital DOM
        expect(searchBoxWrapper).toMatchSnapshot();

        // make snapshot of DOM with loading animation
        let searchQuery = cloneObject(mockSearchBoxInput[0]);
        searchBoxInstance.filterCourseCodes(searchQuery);
        searchBoxWrapper.update();
        expect(searchBoxWrapper).toMatchSnapshot();

        // make snapshot of DOM without loading animation
        let searchResults = cloneObject(mockSearchResults);
        searchBoxInstance.onFilterSuccess(JSON.stringify(searchResults));
        searchBoxWrapper.update();
        expect(searchBoxWrapper).toMatchSnapshot();
    });
});