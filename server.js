const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const axios = require('axios');
const PORT = process.env.PORT || 5000;

const LeagueJs = require('leaguejs/lib/LeagueJS.js');
const riotAPI = new LeagueJs(process.env.RIOT_API_KEY);

const runeDictionary = {};
 
const instance = axios.create({
  baseURL: process.env.LEAGUE_STATS_API
});

/* // Multi-process to utilize all CPU cores.
if (cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
  });

} else { */
  const app = express();

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, './react-ui/build')));

  axios.get('https://ddragon.leagueoflegends.com/cdn/8.9.1/data/en_US/runesReforged.json')
    .then(data => {
      //console.log(data.data[0]);
      data.data.forEach(runeTree => {
        runeDictionary[runeTree.id] = {'icon': runeTree.icon, 'name': runeTree.name};
        runeTree.slots.forEach(runeTree => {
          runeTree.runes.forEach(rune => {
            //console.log(rune);
            runeDictionary[rune.id] = {'icon': rune.icon, 'name': rune.name};
          })
        })
      })

    });


  app.get('/matchhistory', function (req, res) {
    let summoner = req.query.summoner;
    //console.log(summoner);
    riotAPI.Summoner
      .gettingByName(summoner, 'na1')
      .then(data => {
        'use strict';
        //console.log(data);
        res.set('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
      })
      .catch(err => {
        'use strict';
        console.log(err);
        return res.sendStatus(404);
      });
  });

  app.get('/rankhistory', function(req, res) {
    let accountId = req.query.accountId;
    //console.log(accountId);
    riotAPI.League
      .gettingPositionsForSummonerId(accountId, 'na1')
      .then(data => {
        'use strict';
        //console.log(data);
        res.set('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
      })
      .catch(err => {
        'use strict';
        console.log(err);
        return res.sendStatus(404);
      });
  });

  app.get('/currentgameinfo', function (req, res) {
    let sumonerId = req.query.summonerId;
    //console.log(summoner);
    riotAPI.Spectator
      .gettingActiveGame(sumonerId, 'na1')
      .then(data => {
        'use strict';
        //console.log(data);
        res.set('Content-Type', 'application/json');
        return res.send(data);
      })
      .catch(err => {
        'use strict';
        //console.log(err);
        res.set('Content-Type', 'application/json');
        return res.status(404).json({ error: 'Not in game' });
      });
  });

  app.get('/runes', function(req, res) {

    let championId = Math.floor(Math.random() * 100) + 1;
    //console.log(championId);
    instance.get(`/champions/${championId}`)
      .then(response => {
        //console.log(res.data);

        let data = response.data.data[0].stats.runes.build;
        //console.log(data);

        let runeImgUrls = {};
        runeImgUrls = data.map(id => {
            return runeDictionary[id];
        })
        
        return res.send(JSON.stringify(runeImgUrls));
      });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
//}
