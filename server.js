// modules
const express = require("express")
const Enmap = require('enmap');
const dbg = new Enmap({ name: 'Panel' });
const passport = require('passport');
const session = require('express-session');



const MemoryStore = require('memorystore')(session);
const Strategy = require('passport-discord').Strategy;
const url = require('url');
const helmet = require('helmet');
const { EvaluatedPermissions } = require('discord.js');

var app = express();
const config = require("./config.json");


var fs = require("fs")

app.use(express.static("./")); // folder we use for (css, javascript...)
const https = require('https');
app.set("view engine", "ejs"); 
const Discord = require("discord.js")
const client = new Discord.Client();
app.listen(8000)


client.on("ready", () => {
	console.log("SixCord Bot is running!")
})

passport.serializeUser((user, done) => {
	done(null, user);
});
passport.deserializeUser((obj, done) => {
	done(null, obj);
});

passport.use(new Strategy({
	clientID: config.id,
	clientSecret: config.secret,
	callbackURL: 'http://localhost:8000/auth', // example auth: http://localhost:3000/auth
	scope: ['identify', 'guilds', 'guilds.join'] // bot's scopes for auth
},
(accessToken, refreshToken, profile, done) => {
	process.nextTick(() => done(null, profile));
}));
app.use(session({
	store: new MemoryStore({
		checkPeriod: 86400000
	}),
	secret: '!SixCordTeamDev0005566000', 
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(helmet());
app.locals.domain = 'http://localhost:8000/'; // local host
const bodyParser = require('body-parser');
const { Console } = require("console");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

function checkAuth(req, res, next) {
	if (req.isAuthenticated()) return next();
	req.session.backURL = req.url;
	res.redirect('/login');
}

app.get('/login', (req, res, next) => {
	if (req.session.backURL) {
		req.session.backURL = 'http://localhost:8000/auth'; // example auth: http://localhost:3000/auth
	} else if (req.headers.referer) {
		const parsed = url.parse(req.headers.referer);
		if (parsed.hostname === app.locals.domain) {
			req.session.backURL = parsed.path;
		}
	} else {
		req.session.backURL = '/';
	}
	next();
},

passport.authenticate('discord'));
app.get('/auth', passport.authenticate('discord', {
	failureRedirect: '/'
}), (req, res) => {
	if (req.session.backURL) {
		const refurl = req.session.backURL;
		req.session.backURL = null;
		res.redirect(refurl);
	} else {
		res.redirect('/');
	}
});

app.get("/logout", function(req, res) {
    req.session.destroy(() => {
      req.logout();
      res.redirect("/"); 
    });
  });
  
	
app.get('/', (req,res) => {
		const user = req.isAuthenticated() ? req.user : null;
		
	  
		const botStats = [{
			botty: client,
		perms: EvaluatedPermissions,
			user: req.isAuthenticated() ? req.user : null
		}];
		 res.render("index", {
			 
			  client: client,
			  bot: botStats,
			  user,
			  client: client
			
		  })
		  
		
	  
	
		})
  

client.login(config.token)