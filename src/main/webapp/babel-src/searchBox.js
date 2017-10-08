import React from "react";

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
            "isFilterResultEmpty": false
        };

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.onClickSearchButton = this.onClickSearchButton.bind(this);
        this.filterCourseCodes = this.filterCourseCodes.bind(this);
    }

    componentDidMount(){
        let self = this;
        $(".searchBox").autocomplete({
            source: this.filterCourseCodes,
            response: function(event, ui) {
                // ui.content is the array that's about to be sent to the response callback.
                if (ui.content.length === 0) {
                    self.setState({ "isFilterResultEmpty": true});
                } else {
                    self.setState({ "isFilterResultEmpty": false});
                }
            }
        });
    }

    onClickSearchButton(event){
        this.props.onConfirmSearch($(".courseSearch .searchBox")[0].value.toUpperCase());
    }

    handleKeyUp(event){
        (event.keyCode === 13) && this.props.onConfirmSearch(event.currentTarget.value.toUpperCase());
    }

    render() {
        return (
            <div className="courseSearch input-group">
                {this.state.isFilterResultEmpty && <div className="noCourses">{UI_STRINGS.COURSE_SEARCH_FOUND_NONE}</div>}
                <input className="searchBox form-control" onKeyUp={this.handleKeyUp}></input>
                {this.state.isFiltering && <span className="filterLoading glyphicon glyphicon-refresh glyphicon-spin"></span>}
                <span className="input-group-btn">
                    <button className="btn btn-default" type="button" onClick={this.onClickSearchButton}>
                        <span className="glyphicon glyphicon-search"></span>
                    </button>
                </span>
            </div>
        );
    }

    /*
    *  Backend API calls:
    */

    filterCourseCodes(request, response){
        this.setState({ "isFiltering": true});
        $.ajax({
            type: "POST",
            url: "filtercoursecodes",
            data: JSON.stringify({"filter" : request.term}),
            success: (res) => {
                this.setState({ "isFiltering": false});
                response(JSON.parse(res));
            }
        });
    }

}