import React, { Component } from 'react';

import { Modal, Header, Button, Icon, Container } from 'semantic-ui-react';

//https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/Sorcery/SummonAery/SummonAery.png

class Runes extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalOpen: true,
            loading: false
        };
    }

    componentDidMount() {
        this.fetchRunePath()
    }

    fetchRunePath() {
        this.setState({ loading: true });

        fetch(`runes?champion=${this.props.champion}`, {
            method: "GET"
        })
            .then(res => {
                return res.json();
            })
            .then(json => {
                console.log(json);
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
                    <h3>Rune information goes here</h3>
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