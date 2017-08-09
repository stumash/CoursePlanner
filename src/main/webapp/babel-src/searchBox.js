import React from "react";

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

        // functions that are passed as callbacks need to be bound to current class - see https://facebook.github.io/react/docs/handling-events.html
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentDidMount(){
        $(".searchBox").autocomplete({
            source: this.filterCourseCodes,
            minLength: 2,
            delay: 750
        });
    }

    handleKeyUp(event){
        (event.keyCode === 13) && this.props.onConfirmSearch(event.currentTarget.value.toUpperCase());
    }

    render() {
        return (
            <input className="searchBox form-control" onKeyUp={this.handleKeyUp}></input>
        );
    }

    /*
    *  Backend API calls:
    */

    filterCourseCodes(request, response){
        $.ajax({
            type: "POST",
            url: "filtercoursecodes",
            data: JSON.stringify({"filter" : request.term}),
            success: (res) => {
                response(JSON.parse(res));
            }
        });
    }

}