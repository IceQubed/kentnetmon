var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Job = mongoose.model('jobs');
var prettyCron = require('prettycron');
var loadJobs = require('../controllers/jobs.js');

/* GET form. */
router.get('/:agentid', function (req, res) {
    Agent.findById(req.params.agentid).populate('jobs').exec(function (err, agent) {

        var schedules = agent.jobs;
        var noSchedule = "";

        for (var i = 0; i < schedules.length; i++) {
            schedules[i].schedule = prettyCron.toString(schedules[i].schedule);
            schedules[i].type = schedules[i].type.toUpperCase();
            schedules[i].nextScheduled = prettyCron.getNext(schedules[i].schedule);
            if (schedules[i].type == 'TCPUDP') schedules[i].type = 'Both Tests';
        }

        if (schedules.length < 1) {
            noSchedule = "<br><b>This agent has no scheduled tests!<br></b>";
        }

        res.render(
            'schedule', {
                title: 'KentNetMon - Agent Schedule',
                agent: agent,
                schedules: schedules,
                noSchedule: noSchedule
            }
        );
    });
});

/* POST form. */
router.post('/', function (req, res) {
    var newJob = new Job(); //set up new job using input data
    newJob.schedule = req.body.schedule;
    newJob.type = req.body.type;
    newJob.agentID = req.body.agentid;

    console.log(req.body);

    Job(newJob).save(function (err, job) { //save new job to database
        Agent.findById(req.body.agentid, function (err, agent) { //link job into relevant agent in database

            if (err) {
                res.status(500).json({
                    error: err.message
                });
                throw err;
            }

            agent.jobs.push(job.id);
            agent.save(function (err) {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                    throw err;
                }

                console.log('Job added!'); //when added, log in console
                res.redirect('/');

                Job.find({}, function (err, dbData) {
                    if (!err) {
                        loadJobs(dbData);
                    } else {
                        throw err;
                    }
                });
            });
        });
    });
});


module.exports = router;
