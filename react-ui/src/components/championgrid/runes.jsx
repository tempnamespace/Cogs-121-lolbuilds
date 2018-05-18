import React, { Component } from 'react';

import { Modal, Header, Button, Icon, Container, Image } from 'semantic-ui-react';

//https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png

class Runes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            runePage: null,
            modalOpen: true,
            loading: false
        };
    }

    componentDidMount() {
        this.fetchRunePath()
    }

    fetchRunePath() {
        this.setState({ loading: true });

        fetch(`/runes?champion=${this.props.champion}`, {
            method: "GET"
        })
            .then(res => {
                return res.json();
            })
            .then(json => {               
                this.setState({ runePage: json });
                //console.log(this.state.runePage);
                this.setState({ loading: false });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ loading: false });
            });
    }

    render() {
        return (
            <Modal
                open={this.state.modalOpen}
                size='small'
                style={{margin: "auto", marginTop: "0px !important"}}>

                <Header content={this.props.champion} />
                <Modal.Content>
                    {this.state.runePage == null ? null : (
                        <div>
                            {this.state.runePage.map((rune) =>     
                                <Image 
                                    centered={true}
                                    key={rune}
                                    src={`http://ddragon.leagueoflegends.com/cdn/img/${rune.icon}`} 
                                />
                            )}
                        </div>
 
                    )}
                </Modal.Content>
                <Modal.Actions>
                    <Button color='green' onClick={() => {this.props.close()}} inverted>
                        <Icon name='checkmark' /> OK
                    </Button>
                </Modal.Actions>                
            </Modal>
        )
    }
}

export default Runes