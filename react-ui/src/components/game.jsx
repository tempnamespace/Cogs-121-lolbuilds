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
            loading: false,
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

    getCurrentGameInfo(summonerId) {
        this.setState({loading: true});  
        fetch(`currentgameinfo?summonerId=${summonerId}`, {
            method: "GET"
        })
        .then(res => {
            return res.json();
        })
        .then(json => {
            console.log(json);
            // gameLength doesnt seem to be consistent
            let time = json.gameLength;            
            this.setState({loading: false, time: time});
        })
        .catch((error) => {
            console.log(error);
            this.setState({loading: false});
        });
    }

    render() {
        return (
            <div>    
                <br />            
                {
                    this.props.profileData != null ? 
                        this.state.time ?                         
                        (
                            <Clock seconds={this.state.time} />
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