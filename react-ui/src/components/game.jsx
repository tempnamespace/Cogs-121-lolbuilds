import React, { Component } from 'react';

import { Loader, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
            //summonerId: this.props.profileData ? this.props.profileData.id : null
        };
    }

    getCurrentGameInfo(summonerId) {      
        const URL = 'https://na1.api.riotgames.com/lol/spectator/v3/active-games/by-summoner/';
        fetch(URL + encodeURIComponent(summonerId), {
            method: "GET"
        })
        .then(response => {
            return response.json()
        })
        .then(json => {
            console.log(json)
            this.setState({loading: false});
        })
        .catch((error) => {
            console.log(error);
            this.setState({loading: false});
        });
        return true;
    }

    render() {
        return (
            <div>
                <br />
                {
                    this.props.profileData != null && this.getCurrentGameInfo(this.props.profileData.summonerId) ? (                        
                        <Loader active inline='centered' />   
                    ) : (                        
                        <div>
                            <Header size='huge'>No Summoner Selected</Header>
                            <Header.Subheader>
                                Please choose a summoner on the <Link 
                                            to={'profile'}
                                            onClick={() => this.props.updateButton('/profile')}>
                                            Profile
                                        </Link> page  
                            </Header.Subheader>
                        </div>
                    )      
                }        
            </div>
        )
    }
}

export default Game;