import React, { Component } from 'react';

import { Header, Input, Card, Image } from 'semantic-ui-react'
import Search from './search/search';
import ReactPlayer from 'react-player'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchingSummoner: false,
            inputValue: '',
            bannerOpacity: 1,
            renderAnimation: true
        };
    }

    componentDidMount() {
        if (this.props.profileData) {
            setTimeout(() => {
                this.setState({bannerOpacity: 0})
            }, 1400);
        }
    }

    componentWillReceiveProps() {
        console.log(this.props)
        if (this.props.profileData) {
            this.player.seekTo(0);
        }
    }

    ref = player => {
        this.player = player
    }

    fetchSummoner = (summoner) => {
        this.setState({ fetchingSummoner: true });
        fetch(`/matchhistory?summoner=${encodeURIComponent(summoner)}`, {
            method: "GET"
        })
            .then(response => {
                return response.json()
            })
            .then(myJson => {
                //console.log(myJson)
                //this.setState({fetchingSummoner: false, bannerOpacity: 1});
                //this.props.update(myJson);

                let accountId = myJson.id;
                //use extracted summoner id to get ranked information
                fetch(`/rankhistory?accountId=${accountId}`, {
                    method: "GET"
                })
                .then(response => {
                    return response.json()
                })
                .then(rankJson => {
                    //if a player is not ranked in all 3 ladders, need to erase
                    //and update json with {}. Otherwise will hold the ranked data
                    //of the previously searched summoner.
                    let temp = rankJson.slice();
                    for(let i = 0; i < 3; i++)
                    {
                        if(rankJson[i] == null)
                        {
                            rankJson[i] = {};
                            temp[i] = {};
                        }
                        else
                        {
                            let tierRankName = temp[i].tier + "_" + temp[i].rank + ".png";
                            tierRankName = tierRankName.toLowerCase();

                            temp[i].tierRankPhotoKey= tierRankName;
                            console.log(temp[i].tierRankPhotoKey);

                            if(temp[i].queueType == "RANKED_SOLO_5x5")
                            {
                                rankJson[0] = temp[i];
                            }
                            else if(temp[i].queueType == "RANKED_FLEX_SR")
                            {
                                rankJson[1] = temp[i];
                            }
                            else
                            {
                                rankJson[2] = temp[i];
                            }
                        }
                    }

                    let combined = {};
                    Object.keys(myJson).forEach(key => {
                        combined[key] = myJson[key];
                    })
                    Object.keys(rankJson).forEach(key => {
                        combined[key] = rankJson[key];
                    })
                    this.props.update(combined);
                    //console.log(rankJson);
                    this.setState({fetchingSummoner: false});
                }) 
                .catch((error) => {
                    console.log(error);
                    this.setState({fetchingSummoner: false});
                });

            })
            .catch((error) => {
                console.log(error);
                this.setState({fetchingSummoner: false});
            });
    }

    render() {
        return (
            <div>
                <div style={{display: 'flex', justifyContent: 'center', position: 'relative', top: '-42px'}}>
                
                    {this.props.profileData && this.state.renderAnimation &&
                    // <video style={{
                    //         position: 'absolute',
                    //         opacity: this.state.bannerOpacity,
                    //         top: '4px',
                    //         transition: 'opacity 1s'
                    //     }}
                    //     playsInline muted={true} autoPlay>
                    //     <source src={require('../videos/zuccd.webm')} type="video/webm" />
                    // </video>
                    <ReactPlayer
                        playing={true}
                        height='100%'
                        width='100%'                     
                        style={{
                            position: 'absolute',
                            opacity: 1,//this.state.bannerOpacity,
                            top: '4px',
                            transition: 'opacity 1s'
                        }}
                        autoPlay
                        url={require('../videos/zuccd.webm')}
                        ref={this.ref}
                    />
                    
                //|| console.log("rendered")
            }

                    {this.props.profileData && !this.state.fetchingSummoner &&
                    <div style={{
                            height: '720px', 
                            display: 'flex', 
                            justifyContent: 'center',
                            animation: 'fadeIn 1.2s',
                            animationTimingFunction: 'cubic-bezier(1, 0, 1, 0)'
                        }}>                            
                        <video
                            playsInline muted={true} autoPlay loop>
                            <source src={require('../videos/succd2.webm')} type="video/webm" />
                        </video>
                    </div>}

                    {this.props.profileData && !this.state.fetchingSummoner &&
                    <Image
                        circular
                        style={{
                            position: 'absolute',
                            width: '92x',
                            height: '92px',
                            top: '174px',
                            animation: 'fadeIn 1.2s',
                            animationTimingFunction: 'cubic-bezier(1, 0, 1, 0)'
                        }}
                        //https://ddragon.leagueoflegends.com/api/versions.json
                        src={`http://ddragon.leagueoflegends.com/cdn/8.9.1/img/profileicon/${this.props.profileData.profileIconId}.png`}
                    />}

                    {this.props.profileData && !this.state.fetchingSummoner &&
                    <div style={{                            
                            position: 'absolute',
                            top: '290px',
                            animation: 'fadeIn 1s',
                            animationTimingFunction: 'cubic-bezier(1, 0, 1, 0)'
                        }}>
                        <Header
                            size="small"
                            style={{
                                fontFamily: 'Legendary',
                                color: 'white'
                            }}>                            
                            {this.props.profileData.name}
                        </Header>
                        {/* <Header.Subheader
                            style={{
                                fontFamily: 'Legendary',
                                color: 'white'
                            }}>                            
                            {this.props.profileData.name}
                        </Header.Subheader> */}
                    </div>
                    }

                    <div 
                        style={{
                            position: 'absolute', 
                            top: '270px',                             
                            display: 'flex',
                            justifyContent: 'center'
                        }} 
                        className="container" id="lookupDiv"
                        >


                        <p 
                            style={{opacity: this.props.profileData == null ? '1' : '0'}}                             
                            id="lookupTitleText">Get the highest winrate builds.
                        </p>

                        <Search action={this.fetchSummoner}/>

                    </div>
                </div>

                {/* <div style={{
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    height: '100%', 
                    flexDirection: 'column',
                    position: 'absolute',
                    top: '0px',
                    width: '100vw'
                    }}>
                    

                    <div className="container" id="searchHistDiv">
                        <p id="searchTitleText">Recent Searches</p> 
                    </div>
                </div> */}
            </div>
        );
    }
}

export default Profile;