var express = require("express"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	bodyParser = require("body-parser"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose =
		require("passport-local-mongoose")
const User = require("./model/User");
var app = express();
const router = express.Router;
mongoose.connect("mongodb+srv://dron:TyJzsc6ZsbzhUJhx@cluster0.petssoe.mongodb.net/?retryWrites=true&w=majority");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
	secret: "Rusty is a dog",
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
app.use(router);
// Showing home page
app.get("/", function (req, res) {
	res.render("home");
});

// Showing secret page
app.get("/secret", isLoggedIn, function (req, res) {
	res.render("secret");
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
	res.render("login");
});

//Handling user login
app.post("/login", async function(req, res){
	try {
		// check if the user exists
		const user = await User.findOne({ username: req.body.username });
		if (user) {
		//check if password matches
		const result = req.body.password === user.password;
		if (result) {
			res.render("secret");
		} else {
			res.status(400).json({ error: "password doesn't match" });
		}
		} else {
		res.status(400).json({ error: "User doesn't exist" });
		}
	} catch (error) {
		res.status(400).json({ error });
	}
});

//Handling user logout
app.get("/logout", function (req, res) {
	req.logout(function(err) {
		if (err) { return next(err); }
		res.redirect('/');
	});
});



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) return next();
	res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
	console.log("Server Has Started!");
});



// import { promises as fs } from "fs";
// const express = require('express'); //include expressJS
// const app = express(); //create app
// const bodyParser = require('body-parser');
//
// const downloadImage = async (url, path) => {
//     const response = await fetch(url);
//     const blob = await response.blob();
//     const arrayBuffer = await blob.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     await fs.writeFile(path, buffer);
// }
//
// await downloadImage("https://sabe.io/images/saturn.png", "./saturn.png");
// app.use(bodyParser.urlencoded({extended:false}));
// app.get('/',(req,res)=>{
//   res.sendFile(__dirname + '/static/index.html');
// })
// app.get('/login',(req,res)=>{
//   res.sendFile(__dirname + '/static/login.html');
// });
// //post username and password
// app.post('/login',(req,res) =>{
//   let username = req.body.username;
//   let password = req.body.password;
//   res.send('Username: ' + username + 'Password: ' + password);
// });
// app.use(express.static('public'));
// app.use('/images',express.static('images'));
// const port = 3000 //Port to use
// //port listener
// app.listen(port,() => console.log('Listening on port ' + port));
//
//
//
//
//
//
//
//
//
//
//
// // var createError = require('http-errors');
// // var express = require('express');
// // var path = require('path');
// // var cookieParser = require('cookie-parser');
// // var logger = require('morgan');
// //
// // var indexRouter = require('./routes/index');
// // var usersRouter = require('./routes/users');
// //
// // var app = express();
// //
// // // view engine setup
// // app.set('views', path.join(__dirname, 'views'));
// // app.set('view engine', 'jade');
// //
// // app.use(logger('dev'));
// // app.use(express.json());
// // app.use(express.urlencoded({ extended: false }));
// // app.use(cookieParser());
// // app.use(express.static(path.join(__dirname, 'public')));
// //
// // app.use('/', indexRouter);
// // app.use('/users', usersRouter);
// //
// // // catch 404 and forward to error handler
// // app.use(function(req, res, next) {
// //   next(createError(404));
// // });
// //
// // // error handler
// // app.use(function(err, req, res, next) {
// //   // set locals, only providing error in development
// //   res.locals.message = err.message;
// //   res.locals.error = req.app.get('env') === 'development' ? err : {};
// //
// //   // render the error page
// //   res.status(err.status || 500);
// //   res.render('error');
// // });
// // app.use(express.static('public'))
// // module.exports = app;
