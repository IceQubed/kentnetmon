var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Result = mongoose.model('results');

/* GET form. */
router.get('/', function (req, res) {
    Agent.find().populate('results').exec(function (err, agents) {
        //        var agentList = {testDate[], throughput[], latency[], jitter[], packetloss[]};
        //
        //        for (var i = 0; i < agents.length; i += 1) {
        //            agentList.testDate[i] = agents[i].results[agents[i].results.length - 1].start.timestamp.time;
        //            agentList.throughput[i] = agents[i].results[agents[i].results.length - 1].end.sum_received.bits_per_second;
        //
        //
        ////            latency[i] = 1;
        ////            jitter[i] = agents[i].resultsudp[agents[i].results.length - 1].end.sum.jitter_ms;
        ////            packetLoss[i] = agents[i].resultsudp[agents[i].results.length - 1].end.sum.lost_percent;
        //        }
        //
        var testDate = [],
            throughput = [],
            latency = [],
            jitter = [],
            packetLoss = [],
            error = [];

        for (var i = 0; i < agents.length - 1; i += 1) {
            try {
                testDate[i] = agents[i].results[agents[i].results.length - 1].start.timestamp.time;
                throughput[i] = agents[i].results[agents[i].results.length - 1].end.sum_received.bits_per_second;
                //            latency[i] = 1;
                //            jitter[i] = agents[i].resultsudp[agents[i].results.length - 1].end.sum.jitter_ms;
                //            packetLoss[i] = agents[i].resultsudp[agents[i].results.length - 1].end.sum.lost_percent;
            } catch (err) {
                error[i] = err.message;
            }

        }

        Handlebars = require('hbs');
        Handlebars.registerHelper("lastTime", function (agentID) {
            Agent.findById(agentID, function (err, agentSelected) {
                return agentSelected.results[agentSelected.results.length - 1].start.timestamp.time;
            })
        });



        res.render(
            'agents', {
                title: 'KentNetMon Agents',
                agents: agents,
                testDate: testDate,
                throughput: throughput,
                latency: latency,
                jitter: jitter,
                packetLoss: packetLoss
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
