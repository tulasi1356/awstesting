var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo');
var { v4: uuidv4 } = require('uuid');
var alert = require('alert');

const mongodutil = require('./mongodutil');
const myLogger = function (req, res, next) {

  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
 
  next();
}



// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/projectManagement";
var app = express();
 


// **********Session Creation*****************

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  
  genid: function(req) {
  return uuidv4() // use UUIDs for session IDs
},

  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge : 30000000},
  store:MongoStore.create({mongoUrl: 'mongodb://localhost/27017'})
}))

app.use(function (req, res, next) {
  // if(req.session.auth){}
  var arr=['/','/images/project-tracking.png','/login','/register','/registervalidate','/favicon.ico','/stylesheets/all.min.css','/stylesheets/adminlte.min.css','/registercodevalidate','/webfonts/fa-solid-900.woff2','/webfonts/fa-solid-900.ttf','/login/validate']
  // console.log(req.url,arr.includes(req.url),req.session.auth);
  if(req.session.auth==undefined && (!arr.includes(req.url))){
    alert("please login");
    return res.redirect('/login');
  }
  next();
});


// view engine setup
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(myLogger);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongodutil.connectToServer(function(err){
  var loginRouter = require('./routes/login');
  var registerRouter = require('./routes/register');
  var manageRouter = require('./routes/manager')
  var projectdetailsRouter = require('./routes/projectdetails');
  var taskDetailsRouter = require('./routes/taskdetails');
  var employeeRouter = require('./routes/employee');
  var taskhistoryRouter = require('./routes/taskhistory');
  var faqRouter = require('./routes/faq');
  var profileRouter = require('./routes/profile');
  var dashboardRouter = require('./routes/dashboard');
  var loginrequestRouter = require('./routes/loginrequest');

app.use('/login', loginRouter);
app.use('/',registerRouter);
app.use('/manager',manageRouter);
app.use('/projectDetails',projectdetailsRouter);
app.use('/taskdetails',taskDetailsRouter);
app.use('/employee',employeeRouter);
app.use('/taskhistory',taskhistoryRouter);
app.use('/faq',faqRouter);
app.use('/profile',profileRouter);
app.use('/dashboard',dashboardRouter);
app.use('/loginrequest',loginrequestRouter);
app.get('/logout',function(req,res){
  req.session.destroy(function(){
    res.myLogger;

    res.redirect('/login');
  })

})





// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
//  });



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
})

module.exports = app;
