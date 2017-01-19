var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var mongoose = require('mongoose');
var Result = mongoose.model('results');
//var Comment = mongoose.model('comments');
var Agent = mongoose.model('agents');

router.get('/:agentid', function (req, res) {
    Agent.findById(req.params.agentid, function (err, agent) {
        child_process.execFile('iperf3', ['-c', agent.ipAddr, '-J'], function (error, stdout, stderr) { //execute iperf3 with arguments, takes ip as parameter
            var newResult = new Result();

            console.log(stdout);
            try{
                newResult = JSON.parse(stdout); //parse text output to JSON format
            console.log('\n \n \n \n \n \n');
            console.log(newResult); //log results

            Result(newResult).save(function (err, result) {
                if (err) {
                    res.status(500).json({
                        error: err.message
                    });
                    throw err;
                }

                agent.results.push(result.id);

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
            }
            catch(err){
                console.log('BAD IPERF TEST!')
            }

        });
    });
});

module.exports = router;
