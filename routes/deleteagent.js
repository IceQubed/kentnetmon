var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Job = mongoose.model('jobs');
var Result = mongoose.model('results');
var ResultUDP = mongoose.model('resultsudp');
var Ping = mongoose.model('pings');


router.get('/:agentid', function (req, res) {
    Agent.findById(req.params.agentid, function (err, agent) {

        console.log('jobs length = '+ agent.jobs.length + '\n' +
             'results length = '+ agent.results.length +  '\n' +
             'resultsudp length = '+ agent.resultsudp.length + '\n' +
             'ping results length = '+ agent.ping.length);

        for(var i= 0; i < agent.jobs.length; i++){
            Job.findByIdAndRemove(agent.jobs[i]).exec();
            console.log(agent.jobs[i]);
            console.log("removed a job");
        }
        for(var j= 0; j < agent.results.length; j++){
            Result.findByIdAndRemove(agent.results[j]).exec();
            console.log(agent.results[j]);
            console.log("removed a result");
        }
        for(var k= 0; k < agent.resultsudp.length; k++){
            ResultUDP.findByIdAndRemove(agent.resultsudp[k]).exec();
            console.log(agent.resultsudp[k]);
            console.log("removed a udp result");
        }
        for(var l= 0; l < agent.ping.length; l++){
            Ping.findByIdAndRemove(agent.pings[l]).exec();
            console.log(agent.pings[l]);
            console.log("removed a ping result");
        }

        Agent.findByIdAndRemove(agent.id, function (err, agent) {
            res.status(200).json({
                ok: true
            });
        });
    });
});

module.exports = router;
