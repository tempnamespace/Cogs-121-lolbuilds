import React, { Component } from 'react';
import { Loader, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Analysis extends Component {
    constructor(props) {
        super(props);

        this.state = {
            numMatches: 10,
            matchlist: [],
        };
    }

    // TODO: persist matchlist between page swaps (until new profile lookup)
    // TODO: maybe loading circle during fetch

    componentDidMount() {
        // Retrieve data
        this.fetchMatches(this.props.profileData.accountId, this.state.numMatches);
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
            let matchlist = [];
            let matchCount = 0;

            for (let i = 0; i < myJson.matches.length; i++)
            {
                const gameId = myJson.matches[i].gameId;

                fetch(`/match?gameId=${gameId}`, {
                    method: "GET"
                })
                .then(matchResponse => {
                    return matchResponse.json();
                })
                .then(matchJson => {
                    matchlist.push(matchJson);
                    matchCount++;

                    if (matchCount >= this.state.numMatches) {
                        this.setState({ matchlist: matchlist });
                        this.setState({ fetchingMatchlists: false });
                        console.log(this.state.matchlist);
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            }
        })
        .catch((error) => {
            console.log(error);
            this.setState({ fetchingMatchlists: false });
        });
    }

    render() {
        console.log(this.props.profileData);

        return (
            <div style={{ fontFamily: "Roboto" }} className="container">
                <br />
                {this.props.profileData ? 
                <div>
                    <div>Analysis for {this.props.profileData.name}</div>
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