import React, { Component } from 'react';

import champions from './champions';
import { Grid, Image, Header } from 'semantic-ui-react';
import Runes from './runes';

class ChampionGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChampion: null
        };                      
    }

    render() {

        let cols = [];
        let rows = -1;
        let key = -1;
        const MAXCOLS = 6;

        for (let i = 0; i < champions.length; i++) {
            if (i % MAXCOLS == 0) {
                cols.push([]);
                rows++; 
            }
            cols[rows].push(champions[i]);
        }
        
        const handleClick = (champion) => () => {
            console.log(champion);
            this.setState({selectedChampion: champion});
        }

        return (
            <div 
                style={{
                    "width": '65%',
                    "marginLeft": "auto",
                    "marginRight": "auto"
                }}>
                <br/>
                <Header style={{fontFamily: 'Legendary'}} size='huge'>
                    CHOOSE YOUR CHAMPION
                </Header>
                <Grid container className={'champion-grid'} columns={MAXCOLS}>                
                    {cols.map((row) => {
                        return (
                            <Grid.Row key={++key}>
                                {row.map((champion) => {
                                    return (                                        
                                        <Grid.Column key={champion}>
                                        {
                                            champion==='Random' ?
                                                <Image style={{width: '120px'}} src={require('./Random.png')} />                                                
                                            :
                                                <Image onClick={handleClick(champion)} style={{width: '120px'}} src={`http://ddragon.leagueoflegends.com/cdn/8.9.1/img/champion/${champion}.png`} />
                                        }                                        
                                        </Grid.Column>
                                    )                                
                                })}   
                            </Grid.Row>
                        )                
                    })}
                </Grid>
                {this.state.selectedChampion && 
                    <Runes 
                        champion={this.state.selectedChampion} 
                        close={() => {this.setState({selectedChampion: null})}}
                    />}
            </div>
        )        
    }
}

export default ChampionGrid