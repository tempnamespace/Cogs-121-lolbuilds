import React, { Component } from 'react';
import ChampionGrid from './championgrid/championgrid';
import { Loader, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Ellipsis from './ellipsis';
import Clock from './clock';
import Builds from './builds';

const CHECK_RATE = 10000; 

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeGame : null,
            currChampionId: null
        };                    
    }

    // called when props change
    componentDidUpdate() {
        if (this.props.profileData) {  
            clearInterval(this.checkInterval);
            this.checkInterval = setInterval(() => this.check(), CHECK_RATE);
            this.check()
        }
    }

    componentWillMount() {
        if (this.props.profileData) {  
            //console.log("setting interval");     
            this.checkInterval = setInterval(() => this.check(), CHECK_RATE);
            this.check()
        }
    }

    componentWillUnmount() {
        //console.log("clearing interval");
        clearInterval(this.checkInterval);
    }

    check() {
        if (!this.props.profileData || !this.props.profileData.id) {
            clearInterval(this.checkInterval);
        }

        this.getCurrentGameInfo(this.props.profileData.id);
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
            //console.log("active game data:")
            //console.log(json);
            this.state.activeGame = json;
            let gameStartTime = json.gameStartTime;
            if (this.props.gameData.gameStartTime !== gameStartTime) {
                this.props.update({queueId: json.gameQueueConfigId, gameStartTime: gameStartTime});
            }

            const participants = json.participants;
            for(let i = 0; i < participants.length; i++)
            {
                if(participants[i].summonerId == summonerId)
                {
                    this.state.currChampionId = participants[i].championId;
                    this.forceUpdate();
                    //console.log(this.state.currChampionId)
                }
            }
        })
        .catch((error) => {
            console.log(error);
            this.props.update({gameStartTime: null});
        });
    }

    render() {
        const {gameData, profileData} = this.props;
        // console.log("gameStartTime: ", gameData);
        // console.log("profileData: ", profileData);
        const queueId = gameData != null ? gameData.queueId : null;
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
            <div className="App-game">    
                <br/>            
                {gameData.gameStartTime == null && <ChampionGrid />}
                {profileData != null ? 
                    gameData.gameStartTime ?                         
                        <div>
                            <Header style={{color: 'white', fontFamily: 'Legendary'}} size="large">{profileData.name}</Header>
                            <p>{gameType}: <Clock gameStartTime={gameData.gameStartTime} /></p>
                            {this.state.currChampionId != null && 
                            <Builds championId={this.state.currChampionId}/>
                            }
                        </div>                    
                    : 
                        <Header size='medium' style={{color: 'white', fontFamily: 'Roboto'}}>
                            Waiting for {profileData.name} to start a game<Ellipsis rate={500}/>                         
                        </Header>
                :                     
                    <div>                            
                        <Header style={{color: 'white'}} size='huge'>No Summoner Selected</Header>
                        <Header.Subheader>
                            Please choose a summoner on the <Link 
                                to={'profile'}
                                onClick={() => this.props.updateButton('/profile')}>
                                Profile
                            </Link> page  
                        </Header.Subheader>
                    </div>}        
            </div>
        )
    }
}

export default Game;