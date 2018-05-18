import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router';

import Home from './components/home';
import Game from './components/game';
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

  componentDidMount() {

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
    //console.log("updating game")
    //take current profile data
    let newGame = this.state.gameData;

    Object.keys(incomingState).forEach((key) => {
      //update each new value
      newGame[key] = incomingState[key];      
    });

    this.setState({gameData: newGame});
  }

  //updateParent={this.updateParent}
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
              this.setState({activeButton: '/profile'});
              //if (this.state.profileData) {
                return <Redirect to="/profile"/>
              //}

              //return <Home />
            }}
           />
          <Route 
            exact path="/profile"
            render={() => {
              return <Profile update={this.updateProfile} profileData={this.state.profileData} />;
            }}
          />
          <Route path="/ingame" 
            render={() => 
              <Game 
                update={this.updateGame}
                updateButton={this.updateNavButton} 
                profileData={this.state.profileData}
                gameData={this.state.gameData} 
              />}
          />
          <Route path="/settings" component={Settings} />
        </Switch>
      </div>
    );
  }
}

export default App;
