import React from "react";
import AutoComplete from 'material-ui/AutoComplete';

import {UI_STRINGS, INLINE_STYLES, LOADING_ICON_TYPES} from "../util/util";

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
            "isFiltering": false,
            "dataSource": [],
            "floatingLabelText": UI_STRINGS.DEFAULT_SEARCH_LABEL
        };

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.filterCourseCodes = this.filterCourseCodes.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleNewRequest = this.handleNewRequest.bind(this);
    }

    handleNewRequest(chosenRequest, index) {
        if(index === -1){
            this.props.onConfirmSearch(chosenRequest.toUpperCase());
        } else if(chosenRequest.value.length > 0) {
            this.props.onConfirmSearch(chosenRequest.value.toUpperCase());
        }
    }

    handleInputChange(searchText){
        this.filterCourseCodes(searchText);
    }

    render() {
        return (
            <div className="courseSearch">
                <AutoComplete filter={AutoComplete.noFilter}
                              hintText={UI_STRINGS.COURSE_SEARCH_HINT}
                              dataSource={this.state.dataSource}
                              floatingLabelText={this.state.floatingLabelText}
                              style={INLINE_STYLES.autoCompleteContainer}
                              listStyle={INLINE_STYLES.autoCompleteList}
                              onUpdateInput={this.handleInputChange}
                              onNewRequest={this.handleNewRequest}/>
                {this.state.isFiltering && LOADING_ICON_TYPES.small}
            </div>
        );
    }

    /*
    *  Backend API calls:
    */

    filterCourseCodes(query){
        this.setState({ "isFiltering": true});
        $.ajax({
            type: "POST",
            url: "api/filtercoursecodes",
            data: JSON.stringify({"filter" : query}),
            success: (res) => {
                let response = JSON.parse(res);
                let floatingLabelText = (query.length > 0 && response.length === 0) ? UI_STRINGS.COURSE_SEARCH_FOUND_NONE : UI_STRINGS.DEFAULT_SEARCH_LABEL;
                let newDataSource = [];
                response.forEach((courseCode) => {
                    newDataSource.push({text: courseCode, value: courseCode});
                });
                this.setState({"isFiltering": false, dataSource: newDataSource, floatingLabelText: floatingLabelText});
            }
        });
    }

}