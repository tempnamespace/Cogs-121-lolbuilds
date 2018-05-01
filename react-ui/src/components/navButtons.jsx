import React, { Component } from 'react';
import { Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom';
class NavButtons extends Component {

    constructor(props) {
        super(props);

        this.state = {
            path: window.location.pathname
        }
    }

    render() {
        return (
            <div>
                <Link to="/">
                    <Button
                        onClick={() => this.setState({ path: '/' })}
                        active={this.state.path == '/'}
                        inverted>
                        Home
                    </Button>
                </Link>

                <Link to="/profile">
                    <Button
                        onClick={() => this.setState({ path: '/profile' })}
                        active={this.state.path == '/profile'}
                        inverted>
                        Profile
                    </Button>
                </Link>

                <Link to="/ingame">
                    <Button
                        onClick={() => this.setState({ path: '/game' })}
                        active={this.state.path == '/game'}
                        inverted>
                        Game
                    </Button>
                </Link>

                <Link to="/settings">
                    <Button
                        onClick={() => this.setState({ path: '/settings' })}
                        active={this.state.path == '/settings'}
                        inverted>
                        Settings
                    </Button>
                </Link>
            </div>
        )
    }
}

export default NavButtons;