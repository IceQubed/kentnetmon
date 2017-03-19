// mongoose config
require('./database');
require('./controllers/ping');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var expressListRoutes = require('express-list-routes');


var routes = require('./routes/index');
var iperf = require('./routes/iperf');
var iperfudp = require('./routes/iperfudp');
var graphs = require('./routes/graphs');
var graphsudp = require('./routes/graphsUDP');
var addagent = require('./routes/addagent');
var deleteagent = require('./routes/deleteagent');
var loadJobs = require('./controllers/jobs.js');
var schedule = require('./routes/schedule.js');
var unschedule = require('./routes/unschedule.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/addagent', addagent);
app.use('/iperf', iperf);
app.use('/iperfudp', iperfudp);
app.use('/graphs', graphs);
app.use('/graphsUDP', graphsudp);
app.use('/deleteagent', deleteagent);
app.use('/schedule', schedule);
app.use('/unschedule', unschedule);


var jobs = mongoose.model('jobs');
jobs.find({}, function (err, dbData) {
    if (!err) {
        loadJobs(dbData);
    } else {
        throw err;
    }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


//console.log(app._router.stack // registered routes
//    .filter(r => r.route) // take out all the middleware
//    .map(r => r.route.path) // get all the paths
//);
//console.log(expressListRoutes()); // registered routes

//var port = 80;
//app.listen(port);

var listener = app.listen(3213, function () {
    console.log('Listening on port ' + listener.address().port); //Listening on port
});

module.exports = app;
