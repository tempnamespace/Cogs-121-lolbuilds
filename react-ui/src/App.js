import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './components/home';
import Game from './components/game';
import Profile from './components/profile';
import Settings from './components/settings';

import { Button, Container, Divider, Grid, Header, Image, Menu, Segment } from 'semantic-ui-react'
import { Route, Switch } from 'react-router';
import NavButtons from './components/navButtons'

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      fetching: true
    };
  }

  componentDidMount() {
    /* fetch('/api')
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        this.setState({
          message: json.message,
          fetching: false
        });
      }).catch(e => {
        this.setState({
          message: `API call failed: ${e}`,
          fetching: false
        });
      }) */
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>League of Legends Builds</h2>
          <NavButtons />
        </div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/ingame" component={Game} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
        </Switch>

      </div>
    );
  }
}

export default App;
