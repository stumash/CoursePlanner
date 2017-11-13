import React from "react";
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';

import {UI_STRINGS} from "./util";

/*
 *  Text input which is used to filter/search through course codes in DB
 *  Uses JQuery to display autocomplete dropdown list
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
            "floatingLabelText": "Course search"
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
                <AutoComplete
                    hintText="Search for a course code"
                    filter={AutoComplete.noFilter}
                    dataSource={this.state.dataSource}
                    onUpdateInput={this.handleInputChange}
                    listStyle={{maxHeight: "250px", overflow: "auto"}}
                    style={{marginLeft: "12px"}}
                    onNewRequest={this.handleNewRequest}
                    floatingLabelText={this.state.floatingLabelText}
                />
                {this.state.isFiltering && <CircularProgress size={25} thickness={2.5} style={{paddingLeft: "12px"}}/>}
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
                let newDataSource = [];
                let floatingLabelText = "Course search";
                if(query.length > 0 && response.length === 0){
                    floatingLabelText = UI_STRINGS.COURSE_SEARCH_FOUND_NONE;
                } else {
                    response.forEach((courseCode) => {
                        newDataSource.push({text: courseCode, value: courseCode});
                    });
                }
                this.setState({ "isFiltering": false, dataSource: newDataSource, floatingLabelText: floatingLabelText});
            }
        });
    }

}