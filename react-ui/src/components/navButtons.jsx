import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
class NavButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            paths: { // route -> Page
                "/profile": "Profile",
                "/ingame": "Game",
                "/settings": "Settings",
            }
        }
    }

    render() {
        return (
            <div>
                {
                    Object.keys(this.state.paths).map((key) => {
                        return (
                            <Link 
                                key={key}
                                to={key}
                                onClick={() => this.props.updateButton(key)}
                                className={this.props.active === key ? 'navButton-active' : 'navButton'}
                                style={{color: 'white', padding: '0px 10px 0px 10px', fontSize: '0.846353rem', lineHeight: '2.28571em'}}
                                >
                                {this.state.paths[key]}
                                
                            </Link>
                        );
                    })
                }
            </div>
        )
    }
}

export default NavButtons;