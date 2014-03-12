var fs = require('fs');
var http = require('http');
var https = require('https');
var express = require('express');
var Firebase = require('firebase');
var FirebaseTokenGenerator = require('firebase-token-generator');
var _ = require('underscore');
var request = require('request');
var hbs = require('hbs');
var crypto = require('crypto');
var moment = require('moment');

var app = express();

app.configure('development', function() {
	app.use(function(req,res,next) {
		if (!/https/.test(req.protocol)){
			res.redirect("https://" + req.headers.host + req.url);
		} else {
			return next();
		} 
	});

	app.use(express.bodyParser());
	app.use(express.errorHandler());
	app.use(express.compress());
	
	app.locals.pretty = true;
	
	app.set("view engine", 'hbs');
	app.set("view options", { layout: false });
	
	app.engine('tmpl', require('hbs').__express);
	
	app.use(express.static(__dirname + '/public'));	
});

var firebase_root_url = 'https://cardwolla.firebaseio.com';
var firebase_root = new Firebase(firebase_root_url);
var tokenGenerator = new FirebaseTokenGenerator('guYIxlAsh207AG6yY1PljQodWvJ3gkVWuxUFcSg7');

var adminToken = tokenGenerator.createToken({}, {
	admin: true,
	debug: false,
	expires: 1577836800	// A long long time from now.
});

console.log('Firebase admin token:', adminToken);

firebase_root.auth(adminToken);

app.all('/', function(req, res) {
	res.sendfile(__dirname + '/public/index.html');
});

http.createServer(app).listen(80);
https.createServer({
	key: fs.readFileSync('/Users/JT/Code/hatchlings-games/private/ssl/hatchlings.private'),
	cert: fs.readFileSync('/Users/JT/Code/hatchlings-games/private/ssl/hatchlings.certificate')
}, app).listen(443);
