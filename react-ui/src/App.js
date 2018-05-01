import React, { Component } from 'react';
import './App.css';
import 'semantic-ui-css/semantic.min.css';
import Home from './components/home';
import Game from './components/game';
import Profile from './components/profile';
import Settings from './components/settings';

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
