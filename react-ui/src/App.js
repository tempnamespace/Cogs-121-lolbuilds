import React, { Component } from 'react';
import Home from './components/home';
import Game from './components/game';
import Profile from './components/profile';
import Settings from './components/settings';
import { Route, Switch } from 'react-router';
import NavButtons from './components/navButtons'

import './App.css';
import 'semantic-ui-css/semantic.min.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: null
    };
  }

  componentDidMount() {

  }

  updateProfile = (incomingState) => {
    //take current profile data
    let newProfile = this.state.profileData;
    if (newProfile === null) {
      newProfile = {};
    }

    Object.keys(incomingState).forEach((key) => {
      //update each new value
      newProfile[key] = incomingState[key];      
    });

    //set the state just once for all changes
    this.setState({profileData: newProfile});
  }

  //updateParent={this.updateParent}
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>League of Legends Builds</h2>
          <NavButtons/>
        </div>
        <Switch>
          <Route 
            exact path="/"
            render={() => <Home />}
          />
          <Route path="/ingame" component={Game} />
          <Route 
            exact path="/profile"
            render={() => <Profile update={this.updateProfile} profileData={this.state.profileData} />}
          />
          <Route path="/settings" component={Settings} />
        </Switch>
      </div>
    );
  }
}

export default App;
