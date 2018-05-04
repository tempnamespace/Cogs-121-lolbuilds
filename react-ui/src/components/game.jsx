import React, { Component } from 'react';

import { Loader, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Ellipsis from './ellipsis';

class Game extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.state = {
            loading: false,
            summonerId: this.props.profileData ? this.props.profileData.id : null,
            time: null    
        };                      
    }

    componentWillMount() {

        const CHECK_RATE = 5000; 

        if (this.state.summonerId) {        
            this.checkInterval = setInterval(() => this.check(), CHECK_RATE);
            this.check()
        } 
    }

    check() {
        let id = this.state.summonerId;
        if (!id) 
            return clearInterval(this.checkInterval);

        this.getCurrentGameInfo(id);
    }

    componentWillUnmount() {
        clearInterval(this.checkInterval);
    }

    getCurrentGameInfo(summonerId) {
        this.setState({loading: true});  
        fetch(`currentgameinfo?summonerId=${summonerId}`, {
            method: "GET"
        })
        .then(res => {
            return res.json();
        })
        .then(json => {
            console.log(json);
            let time = json.gameLength;            
            this.setState({loading: false, time: time});
        })
        .catch((error) => {
            console.log(error);
            this.setState({loading: false});
        });
    }

    render() {
        return (
            <div>
                <br />
                {
                    this.state.summonerId != null ? 

                        this.state.time ? 
                        
                        (
                            <div/>
                        ) 
                        
                        : 
                        (
                            <Header size='medium'>
                                <div style={{display: 'initial'}}>
                                    Checking if {this.props.profileData.name} is in game
                                </div>
                                <Ellipsis rate={500}/>
                            </Header>
                        )

                    :

                    (                        
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