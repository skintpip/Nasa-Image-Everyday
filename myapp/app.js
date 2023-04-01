const fetch = import('node-fetch');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const request = require('request');
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose =
        require("passport-local-mongoose")
const User = require("./model/User");
var con = require("./config");
const {get} = require("mongoose");
var app = express();
global.document = new JSDOM('/nasaImage').window.document;


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

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//=====================
// ROUTES
//=====================

// Show home page
app.get("/", function (req, res) {
    res.render("home");
});
const url = 'https://api.nasa.gov/planetary/apod?api_key=' + con.NASA_API_KEY;
// const key = con.NASA_API_KEY;
let data;
// console.log(con.NASA_API_KEY);

// const displayImage = ()=> {
//
// 	console.log(data.explanation);
// }
let options = {json: true};

let description;
let image;
request(url, options, (error, res, body) => {
    if (error) {
        return console.log(error)
    }

    if (!error && res.statusCode === 200) {
        // console.log(body);
        description = body.explanation;
        image = body.hdurl;
        //global.document.getElementById('picture').src = body.hdurl;
       // global.document.getElementById('picture').textContent = "words";
        // ("picture").attr("src", body.hdurl);
        // console.log(data);
    }
});

// fetch(url).then(res =>res.json).then((json) =>{
// 	data = json;
// })
// console.log(data);
// const getNasaImage = async () => {
// 	const response = await fetch(url.concat(key))
// 	data = await response.json();
// 	// displayImage(data);
// }
// getNasaImage();
// Show nasa image
app.get("/nasaImage/:description/:image", isLoggedIn, function (req, res) {
    const desc = req.params.description;
    const picture = req.params.image;
    document.getElementById('picture').src = picture;
    console.log("word");
    res.render("nasaImage",{desc},{picture});
    // res.render("nasaImage");
});

// Showing register form
app.get("/register", function (req, res) {
    res.render("register");
});

// Handling user signup
app.post("/register", async (req, res) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password
    });

    return res.status(200).json(user);
});

//Showing login form
app.get("/login", function (req, res) {
    // res.document.getElementById('description').textContent = "words";
    res.render("login");
});
console.log(data);
//Handling user login
app.post("/login", async function (req, res) {
    try {
        // check if the user exists
        const user = await User.findOne({username: req.body.username});
        if (user) {
            //check if password matches
            const result = req.body.password === user.password;
            if (result) {
                // console.log(data);
                //document.getElementById('description').textContent = data.explanation;
                //document.getElementById('picture').src = data.hdurl;
                res.render("nasaImage",{description,image});
            } else {
                res.status(400).json({error: "password doesn't match"});
            }
        } else {
            res.status(400).json({error: "User doesn't exist"});
        }
    } catch (error) {
        res.status(400).json({error});
    }
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

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Running");
});
module.export = app;

