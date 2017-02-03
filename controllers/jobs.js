const schedule = require('node-schedule');

var iperf = require('./iperf');
var iperfudp = require('./iperfudp');

const jobFunctions = {
    tcp: iperf,
    udp: iperfudp,
    tcpudp: (agentId, statusCallback) => {
        iperf(agentId, err => {
            if (err) {
                statusCallback(err);
                return;
            }

            iperfudp(agentId, statusCallback);
        });
    }
};

var scheduledJobs = [];

function createJobs(jobs) {
    jobs.forEach(job => {
        scheduledJobs.push(schedule.scheduleJob(job.schedule, function () { //this actually starts the schedule
            console.info('Running job: %s', job._id);
            jobFunctions[job.type](job.agentID, err => {
                if (err) {
                    console.error('Job %s failed: "%s"', job._id, err);
                } else {
                    console.info('Job %s succeeded!', job._id);
                }
            });
        }));
    });
}

function clearJobs() {
    scheduledJobs.forEach(job => job.cancel());
    scheduledJobs = [];
}

function loadJobs(jobs) {
    clearJobs();
    createJobs(jobs);

    console.info('Scheduled %s jobs.', scheduledJobs.length);
}

module.exports = loadJobs;
