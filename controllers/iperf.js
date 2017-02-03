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

        child_process.execFile('iperf3', ['-c', agent.ipAddr, '-J'], function (error, stdout, stderr) { //execute iperf3 with arguments, takes ip as parameter
            var newResult = new Result();

            console.log(stdout);
            try {
                newResult = JSON.parse(stdout); //parse text output to JSON format
                console.log('\n \n \n \n \n \n');
                console.log(newResult); //log results

                Result(newResult).save(function (err, result) {
                    if (err) {
                        statusCallback(err);
                        return;
                    }

                    agent.results.push(result.id);

                    agent.save(function (err) {
                        if (err) {
                            statusCallback(err);
                            return;
                        }

                        console.log('Item added!'); //when added log in console
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
