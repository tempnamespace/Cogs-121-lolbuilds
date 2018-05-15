import React, { Component } from 'react';

import { Loader, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Ellipsis from './ellipsis';
import Clock from './clock';

class Game extends Component {
    constructor(props) {
        super(props);

        console.log(this.props);

        this.state = {
            // loading: false,
            summonerId: this.props.profileData ? this.props.profileData.id : null,
            time: null
        };                      
    }

    // componentWillReceiveProps() {
    //     console.log("received new props, forcing rerender")
    //     if (this.)
    //     this.forceUpdate();
    // }

    componentDidUpdate() {
        // console.log("update called")
        // console.log(this.props)
    }

    componentWillMount() {

        const CHECK_RATE = 5000; 

        if (this.state.summonerId) {  
            console.log("setting interval");     
            this.checkInterval = setInterval(() => this.check(), CHECK_RATE);
            this.check()
        }
    }

    componentWillUnmount() {
        console.log("clearing interval");
        clearInterval(this.checkInterval);
    }

    check() {
        let id = this.state.summonerId;
        if (!id) 
            return clearInterval(this.checkInterval);

        this.getCurrentGameInfo(id);
    }    

    // requests the game info for the current summoner
    getCurrentGameInfo(summonerId) {
        fetch(`currentgameinfo?summonerId=${summonerId}`, {
            method: "GET"
        })
        .then(res => {
            return res.json();
        })
        .then(json => {
            console.log(json);
            let gameStartTime = json.gameStartTime;
            if (this.state.gameStartTime !== gameStartTime) {
                this.setState({queueId: json.gameQueueConfigId, gameStartTime: gameStartTime});
            }         
        })
        .catch((error) => {
            console.log(error);
            this.setState({gameStartTime: null});
        });
    }

    render() {

        const queueId = this.state.queueId;
        let gameType;

        switch(queueId) {
            case 420: 
                gameType = "Ranked Solo"; break;
            case 430:
                gameType = "Blind Pick"; break;
            case 440:
                gameType = "Ranked Flex"; break;
            case 450:
                gameType = "ARAM"; break;
            case 460:
                gameType = "Blind Pick 3v3"; break;
            case 470:
                gameType = "Ranked 3v3 Flex"; break;
            default:
                gameType = "In game";
        }

        return (
            <div>    
                <br />            
                {
                    this.props.profileData != null ? 
                        this.state.gameStartTime ?                         
                        (
                            <div>
                                {gameType}: <Clock gameStartTime={this.state.gameStartTime} />
                            </div>
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