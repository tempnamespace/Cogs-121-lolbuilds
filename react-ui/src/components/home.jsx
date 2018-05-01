import React, { Component } from 'react';

import { Container, Divider, Input } from 'semantic-ui-react'

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
                    <h3 style={{paddingTop: '10px'}}>home page</h3>
                </Container>
            </div>
        )
    }
}

export default Home;