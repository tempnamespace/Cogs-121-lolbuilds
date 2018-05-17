 import React, { Component } from 'react';

import { Container, Header, Input, Card, Image } from 'semantic-ui-react'

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
                    for(let i = 0; i < 3; i++)
                    {
                        if(rankJson[i] == null)
                            rankJson[i] = {};
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
                <Container>
                    {/* <h3 style={{ paddingTop: '10px' }}>profile page</h3>                 */}
                <br />
                <div>
                    <Header style={{color: 'white'}} size='huge'>Profile</Header>
                </div>
                
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
                </Container>

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
                                    {this.props.profileData[0].queueType == null ? (<div>Unranked</div>) : (
                                        <div>
                                            <p> 
                                                {this.props.profileData[0].queueType} <br/>
                                                {this.props.profileData[0].leagueName} <br/>
                                                {this.props.profileData[0].tier}: {this.props.profileData[0].rank}
                                            </p>
                                            <hr/>
                                        </div>
                                    )}
                                    {this.props.profileData[1].queueType == null ? (<div>Unranked</div>) : (
                                        <div>
                                            <p> 
                                                {this.props.profileData[1].queueType} <br/>
                                                {this.props.profileData[1].leagueName} <br/>
                                                {this.props.profileData[1].tier}: {this.props.profileData[1].rank}
                                            </p>
                                            <hr/>
                                        </div>
                                    )}
                                    {this.props.profileData[2].queueType == null ? (<div>Unranked</div>) : (
                                        <div>
                                            <p> 
                                                {this.props.profileData[2].queueType} <br/>
                                                {this.props.profileData[2].leagueName} <br/>
                                                {this.props.profileData[2].tier}: {this.props.profileData[2].rank}
                                            </p>
                                            <hr/>
                                        </div>
                                    )}
                                </div>
                            )}                        
                        </Card.Content>
                    </Card>
                }
            </div>
        )
    }
}

export default Profile;