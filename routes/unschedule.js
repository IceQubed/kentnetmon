var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Job = mongoose.model('jobs');
var Agent = mongoose.model('agents');


router.post('/:jobid', function (req, res) {
    Job.findById(req.params.jobid, function (err, job) {
        Agent.findById(job.agentID, function (err, agent) {
            agent.jobs.splice(agent.jobs.indexOf(req.params.jobid), 1);

            agent.save(err => {
                Job.findByIdAndRemove(req.params.jobid, function (err, job) {
                    res.redirect(/schedule/ + agent.id);
                });
            });
        });
    });
});

module.exports = router;
