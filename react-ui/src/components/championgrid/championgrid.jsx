/**
 * List out every champion in League of Legends and render them by name using data dragon calls
 */

import React, { Component } from 'react';
import { championsToId } from './championsToId';
import { Grid, Image, Header } from 'semantic-ui-react';
import Runes from './runes';
import randomImg from '../../images/Random.png';

const champions = Object.keys(championsToId);
const VERSION = "8.19.1";
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
                <Header size='huge' style={{color: 'white', fontFamily: 'Legendary'}}>
                    CHOOSE YOUR CHAMPION
                </Header>

                <div className='champion-grid'>
                    {champions.map((champion) => 
                        <Image 
                            key={champion}
                            style={champion !== 'Random' ? {cursor: 'pointer'} : null}
                            src={champion === 'Random' ? randomImg 
                                : `http://ddragon.leagueoflegends.com/cdn/${VERSION}/img/champion/${champion}.png`} 
                            onClick={handleClick(champion)}
                        />
                    )}
                </div>

                {this.state.selectedChampion && 
                    <Runes 
                        champion={this.state.selectedChampion}
                        championId={championsToId[this.state.selectedChampion]} 
                        close={() => {this.setState({selectedChampion: null})}}
                    />}
            </div>
        )        
    }
}

export default ChampionGrid