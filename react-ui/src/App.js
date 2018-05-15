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

    const profileData = localStorage.getItem("profileData");

    this.state = {
      activeButton: window.location.pathname,
      profileData: JSON.parse(profileData)
    };
  }

  componentDidMount() {

  }

  updateNavButton = (button) => {
    this.setState({activeButton: button});
  }

  updateProfile = (incomingState) => {
    console.log("updating profile")
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
    localStorage.setItem("profileData", JSON.stringify(newProfile));
    this.setState({profileData: newProfile});
  }

  //updateParent={this.updateParent}
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>League of Legends Builds</h2>
          <NavButtons updateButton={this.updateNavButton} active={this.state.activeButton}/>
        </div>
        <Switch>
          <Route 
            exact path="/"
            render={() => {
              return <Home />;
            }}
          />
          <Route 
            exact path="/profile"
            render={() => {
              return <Profile update={this.updateProfile} profileData={this.state.profileData} />;
            }}
          />
          <Route path="/ingame" 
            render={() => <Game updateButton={this.updateNavButton} profileData={this.state.profileData} />}
          />
          <Route path="/settings" component={Settings} />
        </Switch>
      </div>
    );
  }
}

export default App;
