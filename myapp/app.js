const express = require('express'); //include expressJS
const app = express(); //create app
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.get('/',(req,res)=>{
  res.sendFile(__dirname + '/static/index.html');
})
app.get('/login',(req,res)=>{
  res.sendFile(__dirname + '/static/login.html');
});
//post username and password
app.post('/login',(req,res) =>{
  let username = req.body.username;
  let password = req.body.password;
  res.send('Username: ${username} Password: ${password}');
});
const port = 3000 //Port to use
//port listener
app.listen(port,() => console.log('Listening on port ' + port));











// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
// app.use(express.static('public'))
// module.exports = app;
