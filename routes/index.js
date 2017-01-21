var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Result = mongoose.model('results');
var moment = require('moment');

/* GET form. */
router.get('/', function (req, res) {
    Agent.find().populate('results resultsudp').exec(function (err, agents) {
        agents.forEach(agent => {
            var lastTcpResult = agent.results.length > 0 ? agent.results[agent.results.length - 1] : null,
                lastUdpResult = agent.resultsudp.length > 0 ? agent.resultsudp[agent.resultsudp.length - 1] : null;

            if (lastTcpResult) {
                agent.testDate = moment(lastTcpResult.start.timestamp.time).format("Do MMM, HH:mm:ss"); //format ISODate nicely using moment.js
                agent.throughputSent = parseFloat(lastTcpResult.end.sum_sent.bits_per_second / 1000000).toFixed(2) + " Mbps";
                agent.throughputReceived = parseFloat(lastTcpResult.end.sum_received.bits_per_second / 1000000).toFixed(2) + " Mbps";

            }

            if (lastUdpResult) {
                agent.jitter = parseFloat(lastUdpResult.end.sum.jitter_ms).toFixed(2) + " %";
                agent.packetLoss = parseFloat(lastUdpResult.end.sum.lost_percent).toFixed(2) + " %";
                agent.latency = "Not yet implemented";
            }
        });

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
