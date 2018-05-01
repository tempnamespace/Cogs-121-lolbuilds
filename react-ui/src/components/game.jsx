import React, { Component } from 'react';

import { Container } from 'semantic-ui-react'

class Game extends Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }

    render() {
        return (
            <div>
                <Container>
                    <h3 style={{paddingTop: '10px'}}>game page</h3>
                </Container>
            </div>
        )
    }
}

export default Game;