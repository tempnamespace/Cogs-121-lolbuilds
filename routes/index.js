/*
 * GET login page.
 */

var LOGINS = require('../dummy_data/logins.json');
var USERS = require('../dummy_data/users.json');
var TEAMS = require('../dummy_data/teams.json');
var data = {};

exports.view = function(req, res)
{
	if (req.session.userID) res.redirect('/home');

	data.loginIncorrect = false;
	data.signup = false;
	res.render('index', data);
};

exports.devlogin = function(req, res)
{
	req.session.userID = 3; // Kelvin
	res.redirect('/home');
}

exports.logout = function(req, res)
{
	req.session.userID = "";
	res.redirect('/');
}

exports.login = function(req, res)
{
	var email = req.query.email;
	var password = req.query.password;

	var userID = -1;

	// Search for email
	for (var key in LOGINS)
	{
		if (key === email)
		{
			if (LOGINS[key].password === password)
			{
				userID = LOGINS[key].userID;
				break;
			}
		}
	}

	// Match not found
	if (userID === -1)
	{
		data.loginIncorrect = true;
		data.email = email;
		res.render('index', data);
		data.loginIncorrect = false;
		data.email = "";
	}
	// Match found
	else
	{
		req.session.userID = userID;

		res.redirect('/home');
	}
};

exports.signup = function(req, res)
{
	data.signup = true;
	data.emailTaken = false;
	data.emptyField = false;
	res.render('index', data);
};

exports.signupcomplete = function(req, res)
{
	// User attempts to create a new account
	var email = req.query.email;
	var password = req.query.password;
	var confirmPassword = req.query.confirmPassword;
	var firstName = req.query.firstName;
	var lastName = req.query.lastName;
	var isFacebook = req.query.mode;

	data.emailTaken = false;
	if (LOGINS.hasOwnProperty(email)) data.emailTaken = true;

	data.invalidEmail = false;
	if (!validateEmail(email)) data.invalidEmail = true;

	data.emptyField = false;
	if (email === "" ||
		password === "" ||
		confirmPassword === "" ||
		firstName === "" ||
		lastName === "") data.emptyField = true;

	data.mismatchPassword = false;
	if (password !== confirmPassword) data.mismatchPassword = true;
	
	// Return to same signup form if failed registration
	if ( (isFacebook != "fb") && (data.emailTaken || data.invalidEmail || data.emptyField || data.mismatchPassword))
	{
		// Keep fields on failed registration
		data.signup = true;
		data.email = email;
		data.firstName = firstName;
		data.lastName = lastName;
		res.render('index', data);

		// Wipe fields after rendering
		data.email = "";
		data.firstName = "";
		data.lastName = "";
	} 
	// Successful registration, update data and redirect to home
	else
	{
		var newLogin = {
			"password": password,
			"userID": USERS.nextUserID
		}

		LOGINS[email] = newLogin;

		var newUser = {
			"firstName": firstName,
			"lastName": lastName,
			"userID": USERS.nextUserID,
			"teams": [],
			"settings": {}
		}

		USERS[newUser.userID] = newUser;
		USERS.nextUserID++;

		req.session.userID = newUser.userID;
		res.redirect('/home');
	}
};

exports.facebook = function(req, res)
{
	checkLoginState(res);
}

// Validates email string using regex, works for string@string.string
function validateEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function checkLoginState()
{
	FB.getLoginStatus(function(response) {
	    statusChangeCallback(response);
	}, {scope: 'email'});
}

function statusChangeCallback(response)
{
	if(response.status === "connected")
	{
		console.log("Successfully logged in with Facebook");
		//FB.api('/me?fields=name,first_name,picture.width(480)', changeUser);
		FB.api('/me?fields=first_name,last_name,email', FBMakeUser);
		console.log(response.userID);
	}
	else
	{
		res.render('index', data);
	}
}

function FBMakeUser(response)
{
	var firstName = response.first_name;
	var lastName = response.last_name;
	var email = response.email;

	var fbPassWord = "FBauto";
	var newLogin = {
		"password": fbPassWord,
		"userID": USERS.nextUserID
	}

	LOGINS[email] = newLogin;

	var newUser = {
		"firstName": firstName,
		"lastName": lastName,
		"userID": USERS.nextUserID,
		"teams": [],
		"settings": {}
	}

	USERS[newUser.userID] = newUser;
	USERS.nextUserID++;

	req.session.userID = newUser.userID;
	res.redirect('/home');
}
