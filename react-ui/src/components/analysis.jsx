import React, { Component } from 'react';
import { Loader, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div style={{fontFamily: "Roboto"}} className="container">
                <br />
                <div>
                    Analysis
                </div>
            </div>
        )
    }
}

export default Analysis;