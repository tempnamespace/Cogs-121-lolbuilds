import React, { Component } from 'react';
import { Loader } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Analysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numMatches: 10,
            matchlist: [],
        };

        this.matchlist = [];
        this.matchCount = 0;
    }

    // TODO: persist matchlist between page swaps (until new profile lookup)

    componentDidMount() {
        // Retrieve data
        if (this.props.profileData)
            this.fetchMatches(this.props.profileData.accountId, this.state.numMatches);
    }

    fetchMatch(gameId) {
        fetch(`/match?gameId=${gameId}`, {
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
            console.log(error);
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

    analyzeRoles(matchlist) {
        console.log(matchlist);

        // Roles are: DUO_CARRY, DUO_SUPPORT, DUO, SOLO, NONE
        let role = {};
        // Lanes are: TOP, JUNGLE, MIDDLE, BOTTOM, NONE
        let lane = {};

        for (let i = 0; i < matchlist.length; i++)
        {
            const match = matchlist[i];
            let partId;

            // Find account participant ID
            for (let j = 0; j < match.participantIdentities.length; j++)
            {
                let currPart = match.participantIdentities[j];
                if (currPart.player.accountId === this.props.profileData.accountId)
                    partId = currPart.participantId;
            }

            // Get participant data
            for (let k = 0; k < match.participants.length; k++)
            {
                let currPart = match.participants[k];

                if (currPart.participantId === partId)
                {
                    let currRole = currPart.timeline.role;
                    let currLane = currPart.timeline.lane;

                    if (currRole in role) role[currRole]++;
                    else role[currRole] = 1;

                    if (currLane in lane) lane[currLane]++;
                    else lane[currLane] = 1;
                }
            }

            if (i === match.participants.length - 1)
            {
                let roleCount = {
                    'top': lane["TOP"] ? lane["TOP"] : 0,
                    'jungle': lane["JUNGLE"] ? lane["JUNGLE"] : 0,
                    'middle': lane["MIDDLE"] ? lane["MIDDLE"] : 0,
                    'bottom': role["DUO_CARRY"] ? role["DUO_CARRY"] : 0,
                    'support': role["DUO_SUPPORT"] ? role["DUO_SUPPORT"] : 0
                }

                console.log(roleCount);
            }
        }
    }

    render() {
        console.log(this.props.profileData);

        // Put all data analysis functions here
        if (this.props.profileData && this.state.matchlist.length > 0)
        {
            this.analyzeRoles(this.state.matchlist);
        }

        return (
            <div style={{ fontFamily: "Roboto" }} className="container">
                <br />
                {this.props.profileData ? 
                <div>
                    <div>Analysis for {this.props.profileData.name}</div>

                    {(this.state.fetchingMatchlists || this.state.analyzingData) &&
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