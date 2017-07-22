import React from "react";

export class ControlCenter extends React.Component {
    render() {
        return (
            <div className="controlCenter">
                <div className="row">
                    <div className="col-xs-12">
                        <div>
                            Logo
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div>
                            Controls/TextArea 1
                        </div>
                    </div>
                    <div className="col-xs-12">
                        <div>
                            Controls/TextArea 2
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}