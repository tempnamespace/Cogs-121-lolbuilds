import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loader } from 'semantic-ui-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

class Analysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numMatches: 10,
            matchlist: [],
        };

        this.matchlist = [];
        this.matchCount = 0;
        this.controller = new window.AbortController();
    }

    // TODO: persist matchlist between page swaps (until new profile lookup)

    componentWillReceiveProps() {
        console.log(this.props)
        if (this.props.profileData)
            this.fetchMatches(this.props.profileData.accountId, this.state.numMatches);
        // this.forceUpdate();
    }

    componentDidMount() {
        // Retrieve data
        if (this.props.profileData)
            this.fetchMatches(this.props.profileData.accountId, this.state.numMatches);
    }

    componentWillUnmount() {
        this.controller.abort();
    }
    

    fetchMatch(gameId) {  
        const signal = this.controller.signal;      
        fetch(`/match?gameId=${gameId}`, {
            signal,
            method: "GET"
        })
        .then(matchResponse => {
            return matchResponse.json();
        })
        .then(matchJson => {
            this.matchlist.push(matchJson);
            this.matchCount--;
            // last match to be added            
            if (this.matchCount === 0) {
                this.setState({ matchlist: this.matchlist, fetchingMatchlists: false });
            }
        })
        .catch((error) => {
            if (error.name === 'AbortError') {
                return;
            }
            console.error(error);
        });
    }

    fetchMatches(accountId, numMatches) {
        this.setState({ fetchingMatchlists: true });
        fetch(`/matchhistory?accountId=${encodeURIComponent(accountId)}&endIndex=${numMatches}`, {
            method: "GET"
        })
        .then(response => {
            return response.json();
        })
        .then(myJson => {
            // myJson.matches is array of Objects with gameId
            this.matchlist = [];
            this.matchCount = numMatches;
            for (let i = 0; i < myJson.matches.length; i++) {
                const gameId = myJson.matches[i].gameId;                  
                // retrieve match information for this game
                this.fetchMatch(gameId);
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({ fetchingMatchlists: false });
        });
    }

    // given matchlist, returns formatted chart data array
    analyzeRoles(matchlist) {
        // Roles are: DUO_CARRY, DUO_SUPPORT, DUO, SOLO, NONE
        let role = {};
        // Lanes are: TOP, JUNGLE, MIDDLE, BOTTOM, NONE
        let lane = {};

        for (let i = 0; i < matchlist.length; i++) {
            const match = matchlist[i];
            let partId;

            // Find account participant ID
            for (let j = 0; j < match.participantIdentities.length; j++) {
                let currPart = match.participantIdentities[j];
                if (currPart.player.accountId === this.props.profileData.accountId) {
                    partId = currPart.participantId;
                    break;
                }
            }

            // Get participant data
            for (let k = 0; k < match.participants.length; k++) {
                let currPart = match.participants[k];
                if (currPart.participantId === partId) {
                    let currRole = currPart.timeline.role;
                    let currLane = currPart.timeline.lane;

                    // if currRole/Lane exists, add 1 game, else initialize
                    currRole in role ? role[currRole]++ : role[currRole] = 1;
                    currLane in lane ? lane[currLane]++ : lane[currLane] = 1;
                }
            }
        }

        let roleCount = [
            {name: 'top', value: lane["TOP"] || 0},
            {name: 'jungle', value: lane["JUNGLE"] || 0},
            {name: 'middle', value: lane["MIDDLE"] || 0},
            {name: 'bottom', value: role["DUO_CARRY"] || 0},
            {name: 'support', value: role["DUO_SUPPORT"] || 0}
        ]

        for (let i = roleCount.length - 1; i >= 0; i--) {
            if (roleCount[i].value === 0) {
                roleCount.splice(i, 1);
            }
        }

        return roleCount;
    }

    render() {
        console.log(this.props.profileData);

        const roleCount = this.analyzeRoles(this.state.matchlist);

        return (
            <div style={{ fontFamily: "Roboto" }} className="container">
                <br />
                {this.props.profileData ? 
                <div>
                    <p id="dataTitle">Analysis for {this.props.profileData.name}</p>

                    {(this.state.fetchingMatchlists) &&
                        <Loader 
                            style={{
                                marginTop: '3rem',
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                width: '100%'
                            }}
                            active 
                            size="massive" 
                            inline='centered' />
                    }

                    {!(this.state.fetchingMatchlists) && roleCount &&
                        <div>
                            <p id="dataSubtitle">Role Distribution for Last 10 Matches</p>
                            <div className="chart-container">
                                <PieChart width={250} height={250} class="chart">
                                    <Pie data={roleCount} dataKey="value" cx="50%" cy="50%" outerRadius={80} label>
                                        {
                                            roleCount.map((entry, index) => (
                                                <Cell key={`cell-${index}`}/>
                                            ))
                                        }
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </div>
                        </div>
                    }

                </div>
                :
                <div>
                    
                    <div>No summoner selected</div>
                    <p>
                        Please choose a summoner on the <Link
                            to="/profile"
                            onClick={() => this.props.updateButton('/profile')}>
                            Profile
                        </Link> page
                    </p>
                </div>}
            </div>
        )
    }
}

export default Analysis;