var child_process = require('child_process');
var mongoose = require('mongoose');
var ResultUDP = mongoose.model('resultsudp');
var Agent = mongoose.model('agents');

module.exports = function (agentID, statusCallback) {
    statusCallback = statusCallback || function () {};

    Agent.findById(agentID, function (err, agent) {
        if (err) {
            statusCallback(err);
            return;
        }

        child_process.execFile('iperf3', ['-c', agent.ipAddr, '-u', '-w 4M', '-J'], function (error, stdout, stderr) { //execute iperf3 with arguments, takes ip as parameter
            var newResultUDP = new ResultUDP();

            console.log(stdout);
            try {
                newResultUDP = JSON.parse(stdout); //parse text output to JSON format
                console.log('\n \n \n \n \n \n');
                console.log(newResultUDP); //log results

                ResultUDP(newResultUDP).save(function (err, resultudp) {
                    if (err) {
                        statusCallback(err);
                        return;
                    }

                    agent.resultsudp.push(resultudp.id);

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
