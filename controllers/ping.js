// send one ping & handle results with callbacks
var Ping = require('ping-lite');
var mongoose = require('mongoose');
var AgentModel = mongoose.model('agents');
var PingModel = mongoose.model('pings');

module.exports = function (agentID, statusCallback) {
    statusCallback = statusCallback || function () {};

    AgentModel.findById(agentID, function (err, agent) {
        if (err) {
            statusCallback(err);
            return;
        }
        try {
            var newPing = new PingModel();
            var ping = new Ping(agent.ipAddr);
            if (err) {
                statusCallback(err);
                return;
            }
        } catch (err) {
            statusCallback(err);
            console.log('BAD PING TEST! AGENT NOT FOUND!');

            return;
        }

        ping.send(function (err, ms) {
            console.log(agent.name + ' responded in ' + ms + 'ms.');
            newPing.time = ms;

            if (newPing.time) {
                try {
                    PingModel(newPing).save(function (err, ping) {
                        if (err) {
                            statusCallback(err);
                            return;
                        }
                        agent.ping.push(ping.id);

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
                    console.log('BAD PING TEST!');

                    return;
                }
            } else {
                console.log('BAD PING TEST! AGENT NOT FOUND!');
            }
        });
    });
};
