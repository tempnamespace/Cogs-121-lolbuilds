import React, { Component } from 'react';

import { Container,Input, Card, Image } from 'semantic-ui-react'

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchingSummoner: false,
            inputValue: '',
            profileData: null
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
                console.log(myJson)
                this.setState(
                    { 
                        profileData: myJson,
                        fetchingSummoner: false
                    }
                );
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
                    <h3 style={{ paddingTop: '10px' }}>profile page</h3>
                </Container>
                <br />
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
                    placeholder='Search for a Summoner...' />

                {
                    (this.state.profileData != null) &&

                    <Card centered={true}>
                        <Image
                            style={{ width: '800px' }}
                            src={
                                `http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${this.state.profileData.profileIconId}.png`
                            } />
                        <Card.Content>         
                             <Card.Header>
                             {this.state.profileData.name}
                            </Card.Header>
                        </Card.Content>
                        <Card.Content extra>
                            <div>                                
                                Summoner level: {this.state.profileData.summonerLevel}
                                {/* <Icon name='level up' /> */}
                            </div>
                        </Card.Content>
                    </Card>
                }
            </div>
        )
    }
}

export default Profile;