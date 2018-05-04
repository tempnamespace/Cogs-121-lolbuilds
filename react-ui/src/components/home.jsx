import React, { Component } from 'react';

import { Container, Header } from 'semantic-ui-react'

class Home extends Component {
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
                        <Header size='huge'>Home</Header>
                    </div>
                </Container>
            </div>
        )
    }
}

export default Home;