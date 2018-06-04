/**
 * Calculates the ... that will be rendered when checking if user is in game
 */

import React, { Component } from 'react';

class Ellipsis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dots: ""
        };
    }

    componentDidMount() {
        console.log("setting dots");
        this.interval = setInterval(() => {this.addDot()}, this.props.rate);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    addDot() {
        let dots = this.state.dots;

        dots += ".";

        if (dots.length === 4) {
            dots = "";
        }

        this.setState({dots: dots});
    }

    render() {
        return (
            this.state.dots
        )
    }
}

export default Ellipsis;