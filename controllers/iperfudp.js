var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var mongoose = require('mongoose');
var ResultUDP = mongoose.model('resultsudp');
var Agent = mongoose.model('agents');

router.get('/:agentid', function (req, res) {
    Agent.findById(req.params.agentid, function (err, agent) {
        child_process.execFile('iperf3', ['-c', agent.ipAddr, '-u', '-w 4M', '-J'], function (error, stdout, stderr) { //execute iperf3 with arguments, takes ip as parameter
            var newResultUDP = new ResultUDP();

            console.log(stdout);
            newResultUDP = JSON.parse(stdout); //parse text output to JSON format
            console.log('\n \n \n \n \n \n');
            console.log(newResultUDP); //log results

            ResultUDP(newResultUDP).save(function (err, resultudp) {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                    throw err;
                }

                agent.resultsudp.push(resultudp.id);

                agent.save(function (err) {
                    if (err) {
                        res.status(500).json({
                            error: err.message
                        });
                        throw err;
                    }

                    res.status(200).json({
                        ok: true
                    });
                    console.log('Item added!'); //when added log in console
                });
            });
        });
    });
});

module.exports = router;
