const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const axios = require('axios');
const PORT = process.env.PORT || 5000;

const LeagueJs = require('leaguejs/lib/LeagueJS.js');
const riotAPI = new LeagueJs(process.env.RIOT_API_KEY, {
  caching: {
    isEnabled: true, // enable basic caching
    defaults: {stdTTL: 3600} // 1 hour TTL
  }
});
riotAPI.Spectator.disableCaching();
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
  const defaultRunes = [ 8100, 8112, 8143, 8138, 8105, 8200, 8243, 8210 ];
  const defaultBuild = [ 3285, 3020, 3165, 3089, 3157, 3135 ];

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


  app.get('/profiledata', function (req, res) {
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
    let championId = req.query.championId;
    console.log(req.query.championId);
    instance.get(`/champions/${championId}`)
      .then(response => {
        let data = response.data.data[0].stats.runes.build;

        let runeImgUrls = {};
        runeImgUrls = data.map(id => {
            return runeDictionary[id];
        })
        
        return res.send(JSON.stringify(runeImgUrls));
      })
      .catch(err => {
        console.log(err)
        console.log("RUNES: Issue with championId: ", championId);
        let defaultRuneImgUrls = {};
        defaultRuneImgUrls = defaultRunes.map(id => {
            return runeDictionary[id];
        })
        return res.send(JSON.stringify(defaultRuneImgUrls));
      });
  });

  app.get('/build', function(req, res) {
  let championId = req.query.champion;
  console.log(championId);
 // let currChampionId = Math.floor(Math.random() * 100) + 1;
  instance.get(`/champions/${championId}`)
    .then(response => {

      let data = response.data.data[0].stats.big_item_builds.build;
      //console.log(data);
      
      return res.send(JSON.stringify(data));
    })
    .catch(err => {
      console.log("BUILD: Issue with championId: ", championId);
      return res.send(JSON.stringify(defaultBuild));
    });
  });

  app.get('/matchhistory', function(req, res) {
    let accountId = req.query.accountId;
    let options = {};
    if (req.query.endIndex) options.endIndex = parseInt(req.query.endIndex);

    riotAPI.Match
      .gettingListByAccount(accountId, 'na1', options)
      .then(data => {
        'use strict';
        //console.log(data)
        res.set('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
      })
      .catch(err => {
        'use strict';
        console.log(err);
        return res.sendStatus(404);
      });
  });

  app.get('/match', function(req, res) {
    let gameId = req.query.gameId;
    let options = {};

    riotAPI.Match
      .gettingById(gameId, 'na1', options)
      .then(data => {
        'use strict';
        //console.log(data)
        res.set('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
      })
      .catch(err => {
        'use strict';
        console.log(err);
        return res.sendStatus(404);
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
