var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Job = mongoose.model('jobs');
var Result = mongoose.model('results');
var ResultUDP = mongoose.model('resultsudp');
var Ping = mongoose.model('pings');
var loadJobs = require('../controllers/jobs.js');


router.get('/:agentid', function (req, res) {
    Agent.findById(req.params.agentid, function (err, agent) {

        console.log("Deleting Agent: " + agent.id + " and all related documents:");
        //Delete all related documents from database
        for (var i = 0; i < agent.jobs.length; i++) {
            Job.findByIdAndRemove(agent.jobs[i]).exec();
            console.log(" * removed a job: " + agent.jobs[i]);
        }
        for (var j = 0; j < agent.results.length; j++) {
            Result.findByIdAndRemove(agent.results[j]).exec();
            console.log(" * removed a result: " + agent.results[j]);
        }
        for (var k = 0; k < agent.resultsudp.length; k++) {
            ResultUDP.findByIdAndRemove(agent.resultsudp[k]).exec();
            console.log(" * removed a udp result: " + agent.resultsudp[k]);
        }
        for (var l = 0; l < agent.ping.length; l++) {
            Ping.findByIdAndRemove(agent.pings[l]).exec();
            console.log(" * removed a ping result: " + agent.pings[l]);
        }

        //Refresh job list from database (otherwise removed jobs will remain in memory)
        Job.find({}, function (err, dbData) {
            if (!err) {
                loadJobs(dbData);
            } else {
                throw err;
            }
        });

        //Finally remove the agent
        Agent.findByIdAndRemove(agent.id, function (err, agent) {
            res.status(200).json({
                ok: true
            });
        });
    });
});

module.exports = router;
