/**
 *  Summoner search component in the profile page. Defines behavior when search occurs
 *
 */

import React, { Component } from 'react';

import './search.scss';

class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: ""
        };                      
    }

    render() {
        return (
            <div id="zuccBox">
                <input 
                    ref="input"
                    value={this.state.inputValue}
                    type="text" 
                    id="zuccInput" 
                    placeholder="Summoner Search"
                    onChange={(e) => {
                        this.setState({ inputValue: e.target.value });
                    }}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            this.props.action(this.state.inputValue);

                            this.setState({inputValue: ''});
                            this.refs.input.blur();
                        }
                    }}
                >
                    {/* <div id="zuccSucc">
                        <svg x="0px" y="0px" viewBox="0 0 56.966 56.966" height="100%" width="100%" fill="#b2751a">
                            <path  d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z"/>
                        </svg>
                    </div> */}
                </input>
            </div>
        )
    }
}

export default Search