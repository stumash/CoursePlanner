import React from "react";
import AutoComplete from 'material-ui/AutoComplete';

import {UI_STRINGS, INLINE_STYLES, LOADING_ICON_TYPES} from "../../util/util";

import $ from "jquery";

/*
 *  Text input which is used to filter/search through course codes in DB
 *
 *  Expects props:
 *
 *  onConfirmSearch - see MainPage.loadCourseInfo
 *
 */
export class SearchBox extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isFiltering: false,
            filterResults: [],
            floatingLabelText: UI_STRINGS.DEFAULT_SEARCH_LABEL
        };

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.filterCourseCodes = this.filterCourseCodes.bind(this);
        this.onFilterSuccess = this.onFilterSuccess.bind(this);
        this.handleNewRequest = this.handleNewRequest.bind(this);
    }

    handleNewRequest(chosenRequest, index) {
        if(index === -1){
            this.props.onConfirmSearch(chosenRequest.toUpperCase());
        } else if(chosenRequest.value.length > 0) {
            this.props.onConfirmSearch(chosenRequest.value.toUpperCase());
        }
    }

    render() {
        return (
            <div className="courseSearch">
                <AutoComplete id="courseSearch"
                              filter={AutoComplete.noFilter}
                              hintText={UI_STRINGS.COURSE_SEARCH_HINT}
                              dataSource={this.state.filterResults}
                              floatingLabelText={this.state.floatingLabelText}
                              style={INLINE_STYLES.autoCompleteContainer}
                              listStyle={INLINE_STYLES.autoCompleteList}
                              onUpdateInput={this.filterCourseCodes}
                              onNewRequest={this.handleNewRequest}/>
                {this.state.isFiltering && LOADING_ICON_TYPES.small}
            </div>
        );
    }

    /*
    *  Backend API calls:
    */

    filterCourseCodes(query){
        this.setState({ isFiltering: true });
        $.ajax({
            type: "POST",
            url: "api/filtercoursecodes",
            data: JSON.stringify({ filter : query }),
            success: this.onFilterSuccess
        });
    }

    onFilterSuccess(responseText) {
        let response = JSON.parse(responseText);
        let floatingLabelText = (response.length === 0) ? UI_STRINGS.COURSE_SEARCH_FOUND_NONE : UI_STRINGS.DEFAULT_SEARCH_LABEL;
        let results = response.map(courseCode => ({ text: courseCode, value: courseCode }));
        this.setState({isFiltering: false, filterResults: results, floatingLabelText: floatingLabelText});
    }
}