var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Result = mongoose.model('results');
var Ping = mongoose.model('pings');
var moment = require('moment');

/* GET form. */
router.get('/', function (req, res) {
    Agent.find().populate('results resultsudp ping').exec(function (err, agents) {
        agents.forEach(agent => {
            var lastTcpResult = agent.results.length > 0 ? agent.results[agent.results.length - 1] : null, //find last result otherwise null
                lastUdpResult = agent.resultsudp.length > 0 ? agent.resultsudp[agent.resultsudp.length - 1] : null,
                lastPingResult = agent.ping.length > 0 ? agent.ping[agent.ping.length - 1] : null;

            if (lastTcpResult) {
                agent.testDate = moment(lastTcpResult.start.timestamp.time).format("HH:mm:ss, Do MMM YY"); //format ISODate nicely using moment.js
                agent.throughputSent = parseFloat(lastTcpResult.end.sum_sent.bits_per_second / 1000000).toFixed(2) + " Mbps";
                agent.throughputReceived = parseFloat(lastTcpResult.end.sum_received.bits_per_second / 1000000).toFixed(2) + " Mbps";
            }
            else{
                agent.testDate = "No TCP tests completed";
                agent.throughputSent = "No TCP tests completed";
                agent.throughputReceived = "No TCP tests completed";
            }

            if (lastUdpResult) {
                agent.jitter = parseFloat(lastUdpResult.end.sum.jitter_ms).toFixed(2) + " %";
                agent.packetLoss = parseFloat(lastUdpResult.end.sum.lost_percent).toFixed(2) + " %";
            }
            else{
                agent.jitter = "No UDP tests completed";
                agent.packetLoss = "No UDP tests completed";
            }

            if (lastPingResult) {
                agent.latency = lastPingResult.time + " ms";
            }
            else{
                agent.latency = "No ping tests completed";
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
