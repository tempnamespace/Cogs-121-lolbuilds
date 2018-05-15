import React, { Component } from 'react';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

momentDurationFormatSetup(moment);
//import 'moment-timezone';

class Clock extends Component {
    constructor(props) {
        super(props);

        // this.state = {
        //     minutes: Math.floor(this.props.seconds / 60),
        //     seconds: this.props.seconds % 60
        // };
    }

    componentDidUpdate() {
        console.log("update:", this.props)
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