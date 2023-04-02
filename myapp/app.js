const jsdom = require("jsdom");
const {JSDOM} = jsdom;
const request = require('request');
var express = require("express"),
    mongoose = require("mongoose"),
    //passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
        require("passport-local-mongoose")
const User = require("./model/User");
var con = require("./config");
const {get} = require("mongoose");
//google stuff -------------------->
/*  EXPRESS */
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.get('/', function (req, res) {
    res.render('auth');
});

const passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
    cb(null, obj);
});
//end of google stuff <-----------------------------------------

mongoose.connect("mongodb+srv://dron:TyJzsc6ZsbzhUJhx@cluster0.petssoe.mongodb.net/?retryWrites=true&w=majority");
app.set('views', __dirname + '/views');
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(require("express-session")({
    secret: "words",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
//=====================
// ROUTES
//=====================

// Show sign in page
app.get("/", function (req, res) {
    res.render("auth");
});
const url = 'https://api.nasa.gov/planetary/apod?api_key=' + con.NASA_API_KEY;
let options = {json: true};

let description;
let image;
request(url, options, (error, res, body) => {
    if (error) {
        return console.log(error)
    }

    if (!error && res.statusCode === 200) {
        description = body.explanation;
        image = body.hdurl;
    }
});
app.get("/nasaImage/:description/:image", isLoggedIn, function (req, res) {
    const desc = req.params.description;
    const picture = req.params.image;
    document.getElementById('picture').src = picture;
    console.log("word");
    res.render("nasaImage", {desc}, {picture});
});
//Handling user logout
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}

//google
// var userProfile;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '935802954971-k9e7475c186qvi4g64sp96en46k9uvhi.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';
passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://nasa-image-everyday.vercel.app/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        userProfile = profile;
        const newUser = {
            firstName: userProfile.name.givenName,
            lastName: userProfile.name.familyName
        }
        try {
            let user = await User.findOne({firstName: userProfile.name.givenName});
            if (user) {
                done(null, user)
            } else {
                const user = await User.create({
                    username: userProfile.name.givenName,
                });
                done(null, user)
            }
        } catch (err) {
            console.log(err)
        }
        return done(null, userProfile);
    }
))
;

app.get('/auth/google',
    passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback',
    passport.authenticate('google', {failureRedirect: '/error'}),
    function (req, res) {
        // Successful authentication, redirect success.
        res.render("nasaImage", {description, image});
    });
//end google
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Running");
});


module.export = app;
