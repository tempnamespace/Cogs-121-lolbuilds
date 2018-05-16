import React, { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

class Clock extends Component {
    constructor(props) {
        super(props);

        momentDurationFormatSetup(moment);
    }

    componentDidUpdate() {
        //console.log("update:", this.props)
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            this.forceUpdate();
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
    }

    render() {  

        const {gameStartTime} = this.props;
        const clockTime = moment.duration(Date.now()-gameStartTime, "milliseconds").format();

        return (
            clockTime
        )
    }
}

export default Clock;