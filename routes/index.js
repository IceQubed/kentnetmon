var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Result = mongoose.model('results');

/* GET form. */
router.get('/', function (req, res) {
    Agent.find().populate('results resultsudp').exec(function (err, agents) {
        agents.forEach(agent => {
            var lastTcpResult = agent.results.length > 0 ? agent.results[agent.results.length - 1] : null,
                lastUdpResult = agent.resultsudp.length > 0 ? agent.resultsudp[agent.resultsudp.length - 1] : null;

            if (lastTcpResult) {
                agent.testDate = lastTcpResult.start.timestamp.time;
                agent.throughput = lastTcpResult.end.sum_received.bits_per_second;
            }

            if (lastUdpResult) {
                agent.jitter = lastUdpResult.end.sum.jitter_ms;
                agent.packetLoss = lastUdpResult.end.sum.lost_percent;
                agent.latency = 1;
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
