import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
class NavButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            path: window.location.pathname,
            paths: { // route -> Page
                "/": "Home",
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
                                to={key}>
                                <Button
                                    onClick={() => this.setState({ path: key })}
                                    active={this.state.path === key}
                                    inverted>
                                    {this.state.paths[key]}
                                </Button>
                            </Link>
                        );
                    })
                }
            </div>
        )
    }
}

export default NavButtons;