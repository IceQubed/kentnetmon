var child_process = require('child_process');
var mongoose = require('mongoose');
var Result = mongoose.model('results');
var Agent = mongoose.model('agents');

module.exports = function (agentID, statusCallback) {
    statusCallback = statusCallback || function () {};
    Agent.findById(agentID, function (err, agent) {
        if (err) {
            statusCallback(err);
            return;
        }
        //execute iperf3 with arguments, takes ip as parameter
        child_process.execFile('iperf3', ['-c', agent.ipAddr, '-J'], function (error, stdout, stderr) {
            var newResult = new Result();
            try {
                newResult = JSON.parse(stdout); //parse text output to JSON format
                Result(newResult).save(function (err, result) { //save result to DB
                    if (err) {
                        statusCallback(err);
                        return;
                    }

                    agent.results.push(result.id); //add result ID to agent and save

                    agent.save(function (err) {
                        if (err) {
                            statusCallback(err);
                            return;
                        }
                        statusCallback();
                    });
                });
            } catch (err) {
                statusCallback(err);
                console.log('BAD IPERF TEST!');
                return;
            }
        });
    });
};
