/**
 * Setting page, allows users to clear the currently searched profile
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Button } from 'semantic-ui-react';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        console.log(this.props.profileData)

        return (
            <div style={{ fontFamily: "Roboto" }} className="container">
                <br />
                {this.props.profileData ? 
                <div>
                    <div>{this.props.profileData.name}</div>
                    <button onClick={this.props.clearProfile} style={{ color: "white" }}>clear profile</button>
                </div>
                :
                <div>
                    
                    <div>No summoner selected</div>
                    <p>
                        Please choose a summoner on the <Link
                            to="/profile"
                            onClick={() => this.props.updateButton('/profile')}>
                            Profile
                        </Link> page
                    </p>
                </div>}
            </div>
        )
    }
}

export default Settings;