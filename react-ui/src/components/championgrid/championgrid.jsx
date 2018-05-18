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
            if (i % MAXCOLS === 0) {
                cols.push([]);
                rows++; 
            }
            cols[rows].push(champions[i]);
        }
        
        const handleClick = (champion) => () => {
            if (champion === 'Random') {
                return null;
            }
            console.log(champion);
            this.setState({selectedChampion: champion});
        }

        return (
            <div 
                style={{
                    "width": '85%',
                    "marginLeft": "auto",
                    "marginRight": "auto"
                }}>
                <Header size='huge'>
                    CHOOSE YOUR CHAMPION
                </Header>

                <div className='champion-grid'>
                    {champions.map((champion) => 
                        <Image 
                            key={champion}
                            style={champion !== 'Random' ? {cursor: 'pointer'} : null}
                            src={champion === 'Random' ? require('../../images/Random.png') 
                                : `http://ddragon.leagueoflegends.com/cdn/8.9.1/img/champion/${champion}.png`} 
                            onClick={handleClick(champion)}
                        />
                    )}
                </div>

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