/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var handlebars = require('express3-handlebars')

// Routes

var app = express();

// All environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('CopyPasta'));
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// Development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// Route requests
var TEST_DATA = require('./dummy_data/test.json');

app.get('/', function(req, res)
{
	var data = {};
	res.render('index', data);
});

app.get('/home', function(req, res)
{
	var data = {};
	res.render('home', data);
});

app.get('/ingame', function(req, res)
{
	var data = {};
	res.render('ingame', data);
});
app.get('/getatip', function(req, res)
{
	var tipArray = TEST_DATA.tips;
	var tip = tipArray[Math.floor(Math.random()*tipArray.length)];

	res.send(tip);
});

app.get('/profile', function(req, res)
{
	var data = {};
	res.render('profile', data);
});

app.get('/settings', function(req, res)
{
	var data = {};
	res.render('settings', data);
});

// Start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
