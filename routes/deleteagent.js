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
        var i;

        console.log("Deleting Agent: " + agent.id + " and all related documents:");
        //Delete all related documents from database
        for (i = 0; i < agent.jobs.length; i++) {
            Job.findByIdAndRemove(agent.jobs[i]).exec();
            console.log(" * removed a job: " + agent.jobs[i]);
        }
        for (i = 0; i < agent.results.length; i++) {
            Result.findByIdAndRemove(agent.results[i]).exec();
            console.log(" * removed a result: " + agent.results[i]);
        }
        for (i = 0; i < agent.resultsudp.length; i++) {
            ResultUDP.findByIdAndRemove(agent.resultsudp[i]).exec();
            console.log(" * removed a udp result: " + agent.resultsudp[i]);
        }
        for (i = 0; i < agent.ping.length; i++) {
            Ping.findByIdAndRemove(agent.ping[i]).exec();
            console.log(" * removed a ping result: " + agent.ping[i]);
        }

        //Refresh job list from database (otherwise removed jobs will remain in RAM)
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
