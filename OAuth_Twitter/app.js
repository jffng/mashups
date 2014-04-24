/*
Basic OAuth 1.0 Example
Uses PassportJS to Authenticate via Twitter and the Request module to execute Data requests
Example based off Jared Hanson's Passport-Twitter Example:
https://github.com/jaredhanson/passport-twitter/blob/master/examples/signin/app.js
*/

// Decalre Requirements
var express = require("express"),
	path = require('path'),
	Request = require('request'),
	_ = require('underscore'),
	passport = require('passport'),
	TwitterStrategy = require('passport-twitter').Strategy;

//Create the app
var app = express();

// Set up the views directory
app.set("views", __dirname + '/views');
// Set EJS as templating language, but allow for .html extension
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');
//Add connection to public folder for css & js files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.errorHandler());

//Cookies must be turned on for sessions
app.use(express.cookieParser('sessionSecret'));
app.use(express.session());
app.use(passport.initialize());
app.use(passport.session());

var TWITTER_CONSUMER_KEY = 'YOUR-CONSUMER-KEY-GOES-HERE';
var TWITTER_CONSUMER_SECRET = 'YOUR-CONSUMER-SECRET-GOES-HERE';

//Save oAuthData in an object
var oAuthData = {
	consumer_key: TWITTER_CONSUMER_KEY,
	consumer_secret: TWITTER_CONSUMER_SECRET,
	token: '',
	token_secret: ''
};

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new TwitterStrategy({
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		callbackURL: "http://localhost:3000/auth/twitter/callback",
	},
	function(tokenPass, tokenSecretPass, profile, done) {
		process.nextTick(function () {
			oAuthData.token = tokenPass;
			oAuthData.token_secret = tokenSecretPass;

			//console.log(profile);

			//Typically you would check for the user in our database
			//But we aren't storing any users
			//So just going to return the current user
			return done(null, profile);
		});
	}
));

//Route middleware to make sure a user is authenitcated
function checkAuthentication(req, res, next) {
	// If user is authenticated in the session, carry on
	if (req.isAuthenticated()){
		console.log("Good to go!!!");
		//console.log(req);
		return next();
	}
	// If they aren't redirect them to the home page
	res.redirect('/login');
}

//ROUTES
app.get("/", checkAuthentication, function(req, res){
	res.redirect('/success');
});

app.get('/login', function(req,res){
	res.render('login');
});

app.get("/success", checkAuthentication, function(req, res){
	console.log("---------------------------");
	console.log(req.user);
	console.log("---------------------------");
	//Make a request to twitter for most recent tweet
	var userID = req.user.id;
	var tweetURL = "https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=" + userID + "&count=1";
	Request.get(
		{
			url: tweetURL,
			oauth: oAuthData,
			json: true
		},
		function (err, resTwit, body) {
			console.log("Tweet Response");
			console.log(body);

			//Respond with this line to show json on the page
			// res.json(body);

			//Respond with these lines to show success.html
			res.render('success',
				{	user: body[0].user.screen_name,
					lastTweet: body[0].text
				});
		});
});

//********** Twitter Auth Routes **********//
app.get("/auth/twitter", passport.authenticate('twitter'),
	function(req, res){
		// The request will be redirected to Twitter for authentication
		// so this function will not be called.
	});

app.get("/auth/twitter/callback", passport.authenticate('twitter', { failureRedirect: '/' }),
	function(req, res) {
		//Successful Auth
		res.redirect('/success');
	});
//****************************************//

// Start the server
app.listen(3000);
console.log('Express started on port 3000');