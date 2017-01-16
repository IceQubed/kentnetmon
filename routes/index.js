var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Result = mongoose.model('results');


/* GET form. */
router.get('/', function (req, res) {
    Agent.find().populate('results').exec(function (err, agents) {
        res.render(
            'agents', {
                title: 'KentNetMon Agents',
                agents: agents
            }
        );
    });
});

module.exports = router;











//var express = require('express');
//var router = express.Router();
//
///* GET home page. */
//router.get('/', function (req, res, next) {
//    res.render('index', {
//        title: 'KentNetMon Dashboard'
//    });
//});
//
//module.exports = router;
