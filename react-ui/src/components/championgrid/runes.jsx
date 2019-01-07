/**
 * Fetches the rune page for the champion from the backend, and render it with the photos associated to the
 * id of the runepage.
 */

import React, { Component } from 'react';
import { Modal, Header, Button, Icon, Loader, Image } from 'semantic-ui-react';

//https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png


class Runes extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            runePage: null,
            modalOpen: true,
            loading: false,
        };
    }

    componentDidMount() {
        this.fetchRunePath()
    }

    fetchRunePath() {
        this.setState({ loading: true });
        //console.log(this.props.championId);
        //console.log(this.props.champion);
        fetch(`/runes?championId=${this.props.championId}`, {
            method: "GET"
        })
            .then(res => {
                return res.json();
            })
            .then(json => {       
                this.setState({runePage: json, loading: false});
                console.log(this.state.runePage);
            })
            .catch((error) => {
                this.setState({loading: false});         
            });
    }

    render() {

        const {runePage} = this.state;

        return (
            <Modal
                open={this.state.modalOpen}
                size='small'
                style={{margin: "auto", marginTop: "0px !important"}}>

                <Header 
                    size="large" 
                    style={{
                        fontFamily: "Legendary",
                        color: 'white', 
                        backgroundColor: "#010a13"
                    }} 
                    content={this.props.champion}
                />
                <Modal.Content>
                    {runePage == null 
                    ? 
                    <Loader 
                        style={{
                            marginTop: '220px',
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '100%',
                            transform: "scale(2)"
                        }}
                        active 
                        size="massive" 
                        inline='centered' 
                    />
                    : (
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                backgroundColor: "#010a13"
                            }}>
                            <div>
                                {runePage.filter(rune => rune && runePage.indexOf(rune) < 5).map((rune, i) =>     
                                    <Image 
                                        centered={true}
                                        key={i}
                                        src={`http://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} 
                                    />
                                )}
                            </div>
                            <div>
                                {runePage.filter(rune => rune && runePage.indexOf(rune) >= 5).map((rune, i) => 
                                    <Image 
                                        centered={true}
                                        key={i}
                                        src={`http://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} 
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => {this.props.close()}} inverted>
                        <Icon name='checkmark' /> OK
                    </Button>
                </Modal.Actions>                
            </Modal>
        )
    }
}

export default Runes