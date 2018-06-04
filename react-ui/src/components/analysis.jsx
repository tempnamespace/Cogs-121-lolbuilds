import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Loader, Progress } from 'semantic-ui-react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'

class Analysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numMatches: 10,
            matchlist: [],
            percent: 0
        };

        this.numMatches = 0;
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

            //this.setState({percent: 100*(this.numMatches - this.matchCount)/this.numMatches});
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
        this.numMatches = numMatches;
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

                    break;
                }
            }
        }

        let roleCount = [
            {name: 'Top', value: lane["TOP"] || 0},
            {name: 'Jungle', value: lane["JUNGLE"] || 0},
            {name: 'Middle', value: lane["MIDDLE"] || 0},
            {name: 'Bottom', value: role["DUO_CARRY"] || 0},
            {name: 'Support', value: role["DUO_SUPPORT"] || 0}
        ]

        for (let i = roleCount.length - 1; i >= 0; i--) {
            if (roleCount[i].value === 0) {
                roleCount.splice(i, 1);
            }
        }

        if (roleCount.length === 0) {
            console.log("empty match history");
            roleCount = null;
        }
        return roleCount;
    }

    // given matchlist, returns list of champions and winrates
    analyzeChampWinRates(matchlist) {
        let champs = {};
        let winRates = [];

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
                    let teamId = currPart.teamId;
                    let championId = currPart.championId;

                    fetch(`/championName?championId=${encodeURIComponent(championId)}`, {
                        method: "GET"
                    })
                    .then(response => {
                        return response.json();
                    })
                    .then(response => {
                        const championName = response.name;
                        let teamIndex = match.teams[0].teamId === teamId ? 0 : 1;

                        if (!champs.hasOwnProperty(championName)) {
                            champs[championName] = {
                                'wins': 0,
                                'losses': 0
                            }
                        }

                        if (match.teams[teamIndex].win === "Win") {
                            champs[championName].wins++;
                        }
                        else {
                            champs[championName].losses++;
                        }
                    })
                    .catch((error) => {
                        console.log("Couldn't get champion name.");
                    });

                    break;
                }
            }
        }

        for (const key of Object.keys(champs)) {

            let winRate = champs[key].wins / (champs[key].wins + champs[key].losses);

            winRates.push({
                'champName': champs[key].championName,
                'winRate': winRate
            });
        }

        return winRates;
    }

    render() {
        console.log(this.props.profileData);

        const roleCount = this.analyzeRoles(this.state.matchlist);
        console.log("winrates!!!");
        console.log(this.analyzeChampWinRates(this.state.matchlist));

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
                        // <Progress size="medium" percent={this.state.percent} success />

                    }

                    {!(this.state.fetchingMatchlists) && roleCount &&
                        <div>
                            <p id="dataSubtitle">Role Distribution for Last 10 Matches</p>
                            <div className="chart-container">
                                <PieChart width={250} height={250} class="chart">
                                    <Pie data={roleCount} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#71b5bd" stroke="#010a13" label>
                                        {
                                            roleCount.map((entry, index) => (
                                                <Cell key={`cell-${index}`}/>
                                            ))
                                        }
                                    </Pie>
                                    <Tooltip itemStyle={{color: "#c9aa71", padding: "1rem"}} wrapperStyle={{"background": "#010a13", "borderColor": "#c9aa71"}}/>
                                </PieChart>
                            </div>
                        </div>
                    }

                    {!(this.state.fetchingMatchlists) && !roleCount &&
                        <p id="dataSubtitle">No Match History found</p>
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