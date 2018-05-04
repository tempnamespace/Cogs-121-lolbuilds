import React, { Component } from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

class Clock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            minutes: Math.floor(this.props.seconds / 60),
            seconds: this.props.seconds % 60
        };
    }

    componentDidUpdate() {
        console.log("update:", this.props)
    }

    render() {
        return (
            <Moment 
                interval={0}
                format="mm:ss"
                parse="mm:ss">
                {Math.floor(this.props.seconds / 60)}:{this.props.seconds % 60}
            </Moment>
        )
    }
}

export default Clock;