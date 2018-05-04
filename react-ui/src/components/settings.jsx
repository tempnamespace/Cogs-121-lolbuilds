import React, { Component } from 'react';

import { Container, Header } from 'semantic-ui-react'

class Settings extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
            <div>
                <Container>
                    <br />
                    <div>
                        <Header size='huge'>Settings</Header>
                    </div>
                </Container>
            </div>
        )
    }
}

export default Settings;