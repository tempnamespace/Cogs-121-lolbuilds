const express = require('express');
const path = require('path');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const PORT = process.env.PORT || 5000;

const LeagueJs = require('leaguejs/lib/LeagueJS.js');
const riotAPI = new LeagueJs(process.env.RIOT_API_KEY);

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
        console.log(data);
        res.set('Content-Type', 'application/json');
        return res.send(JSON.stringify(data));
      })
      .catch(err => {
        'use strict';
        console.log(err);
        return res.sendStatus(404);
      });
  })


  // All remaining requests return the React app, so it can handle routing.
  app.get('*', function(request, response) {
    response.sendFile(path.resolve(__dirname, './react-ui/build', 'index.html'));
  });

  app.listen(PORT, function () {
    console.error(`Node cluster worker ${process.pid}: listening on port ${PORT}`);
  });
//}
