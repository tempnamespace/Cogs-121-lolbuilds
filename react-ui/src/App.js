import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';

import Home from './components/home';
import Game from './components/game';
import Analysis from './components/analysis'
import Profile from './components/profile';
import Settings from './components/settings';
import NavButtons from './components/navButtons';

import 'semantic-ui-css/semantic.min.css';
import './css/scss/App.scss';

class App extends Component {
  constructor(props) {
    super(props);
    const profileData = localStorage.getItem("profileData");
    this.state = {
      activeButton: window.location.pathname,
      profileData: JSON.parse(profileData),
      gameData: {}
    };
  }

  updateNavButton = (button) => {
    this.setState({activeButton: button});
  }

  updateProfile = (incomingState) => {
    //console.log("updating profile")
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

  updateGame = (incomingState) => {
    console.log("updating game")
    console.log(incomingState);
    //take current profile data
    const newGame = Object.assign({}, this.state.gameData, ...incomingState);
    this.setState({gameData: newGame});
  }

  clearProfile = () => {
    this.setState({
      profileData: null,
      gameData: {}
    })
    localStorage.clear("profileData")
  }

  render() {
    return (
      <div className="App">
        <div className="App-header container">          
          <p id="navBrand">Zephyr</p>
          <div id="navMenu">
            <NavButtons updateButton={this.updateNavButton} active={this.state.activeButton}/>
          </div>
        </div>

        <Switch>
          <Route 
            exact path="/"
            render={() => {
              setTimeout(() => {this.setState({activeButton: '/profile'})}, 1);
              return <Redirect to="/profile"/>
            }}
           />
          <Route 
            exact path="/profile"
            render={() => {
              return <Profile update={this.updateProfile} profileData={this.state.profileData} />;
            }}
          />
          <Route 
            path="/ingame" 
            render={() => 
              <Game 
                update={this.updateGame}
                updateButton={this.updateNavButton}
                profileData={this.state.profileData}
                gameData={this.state.gameData} 
              />}
          />
          <Route 
            path="/analysis" 
            render={() => 
              <Analysis 
                profileData={this.state.profileData}
                updateButton={this.updateNavButton}
              />}
          />
          <Route 
            path="/settings"
            render={() => 
              <Settings 
                profileData={this.state.profileData}
                clearProfile={this.clearProfile}
                updateButton={this.updateNavButton}
              />}
          />
        </Switch>
      </div>
    );
  }
}

export default App;
