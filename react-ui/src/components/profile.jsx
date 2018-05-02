import React, { Component } from 'react';

import { Container,Input, Card, Image } from 'semantic-ui-react'

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
                console.log(myJson)
                this.setState({fetchingSummoner: false});
                this.props.update(myJson);
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
                    (this.props.profileData != null) &&

                    <Card centered={true}>
                        <Image
                            className='summonerCard'
                            src={`http://ddragon.leagueoflegends.com/cdn/6.24.1/img/profileicon/${this.props.profileData.profileIconId}.png`}
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
                    </Card>
                }
            </div>
        )
    }
}

export default Profile;