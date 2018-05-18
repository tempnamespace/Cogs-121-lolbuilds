import React, { Component } from 'react';

import { Header, Input, Card, Image } from 'semantic-ui-react'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchingSummoner: false,
            inputValue: ''
        };
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
                this.setState({fetchingSummoner: false});
                this.props.update(myJson);

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

                    this.props.update(rankJson);
                    console.log(rankJson);
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
                <div class="container" id="lookupDiv">

                    <p id="lookupTitleText">Get the highest winrate builds.</p>
                    
                    <Input
                        disabled={this.state.fetchingSummoner}
                        action={this.state.fetchingSummoner ? null : { 
                            content: 'Search', onClick: () => { 
                                this.fetchSummoner(this.state.inputValue);
                            } 
                        }}
                        onChange={(e) => {
                            this.setState({ inputValue: e.target.value });
                        }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                this.fetchSummoner(this.state.inputValue);
                                // this.setState({fetchingSummoner: true})
                            }
                        }}
                        size='huge'
                        loading={this.state.fetchingSummoner}
                        placeholder='Search for a Summoner...' 
                    />

                    {
                        (this.props.profileData != null) &&

                        <Card centered={true}>
                            <Image
                                className='summonerCard'
                                //https://ddragon.leagueoflegends.com/api/versions.json
                                src={`http://ddragon.leagueoflegends.com/cdn/8.9.1/img/profileicon/${this.props.profileData.profileIconId}.png`}
                            />
                            <Card.Content>         
                                 <Card.Header>
                                 {this.props.profileData.name}
                                </Card.Header>
                            </Card.Content>
                            <Card.Content extra>
                                <div>                                
                                    Summoner level: {this.props.profileData.summonerLevel}
                                    {/* <Icon name='level up' /> */}
                                </div>
                            </Card.Content>
                            <Card.Content >
                                {this.props.profileData[0] == null ? null : (
                                    <div>
                                        {this.props.profileData[0].queueType == null ? 
                                            (<div>
                                                Unranked Solo Queue
                                                <img src={require('../images/provisional.png')}/>
                                                <hr/>
                                            </div>) : (
                                            <div>
                                                <p> 
                                                    {this.props.profileData[0].queueType} <br/>
                                                    {this.props.profileData[0].leagueName} <br/>
                                                    {this.props.profileData[0].tier}: {this.props.profileData[0].rank}
                                                </p>
                                                <img src={require(`../images/${this.props.profileData[0].tierRankPhotoKey}`)}/>
                                                <hr/>
                                            </div>
                                        )}
                                        {this.props.profileData[1].queueType == null ? 
                                            (<div>
                                                Unranked Flex Queue
                                                <img src={require('../images/provisional.png')}/>
                                                <hr/>
                                            </div>) : (
                                            <div>
                                                <p> 
                                                    {this.props.profileData[1].queueType} <br/>
                                                    {this.props.profileData[1].leagueName} <br/>
                                                    {this.props.profileData[1].tier}: {this.props.profileData[1].rank}
                                                </p>
                                                <img src={require(`../images/${this.props.profileData[0].tierRankPhotoKey}`)}/>
                                                <hr/>
                                            </div>
                                        )}
                                        {this.props.profileData[2].queueType == null ? 
                                            (<div>
                                                Unranked Twisted Treeline
                                                <img src={require('../images/provisional.png')}/>
                                                <hr/>
                                            </div>) : (
                                            <div>
                                                <p> 
                                                    {this.props.profileData[2].queueType} <br/>
                                                    {this.props.profileData[2].leagueName} <br/>
                                                    {this.props.profileData[2].tier}: {this.props.profileData[2].rank}
                                                </p>
                                                <img src={require(`../images/${this.props.profileData[0].tierRankPhotoKey}`)}/>
                                                <hr/>
                                            </div>
                                        )}
                                    </div>
                                )}                        
                            </Card.Content>
                        </Card>
                    }
                </div>

                <div class="container" id="searchHistDiv">
                    <p id="searchTitleText">Recent Searches</p>
                </div>
            </div>
        );
    }
}

export default Profile;