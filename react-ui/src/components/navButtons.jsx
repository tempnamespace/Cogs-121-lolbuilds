import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavButtons extends Component {

  constructor(props) {
    super(props);

    this.state = {
      paths: { // route -> Page
        "/profile": "Profile",
        "/ingame": "Game",
        "/settings": "Settings",
      }
    }
  }

  render() {
    return (
      <div>
      {
        Object.keys(this.state.paths).map((key) => {
          return (
            <Link 
              key={key}
              to={key}                            
              onClick={(e) => {                
                if (key !== this.props.active) {
                  this.props.updateButton(key)
                } else {
                  e.preventDefault();
                }                               
              }}
              className={this.props.active === key ? 'navButton-active' : 'navButton'}
            >
              {this.state.paths[key].toUpperCase()}
            </Link>
            );
        })
      }
      </div>
      )
  }
}

export default NavButtons;