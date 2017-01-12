var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');

/* GET form. */
router.get('/', function (req, res) {
    Agent.find(function (err, agents) {
        res.render(
            'addagent', {
                title: 'KentNetMon - Add Agent',
                agents: agents
            }
        );
    })
});

/* POST form. */
router.post('/', function (req, res) {
    new Agent({
            ipAddr: req.body.agent_ipAddr,
            name: req.body.agent_name,
            location: req.body.agent_location
        })
        .save(function (err, agent) {
            res.redirect('agents');
        });
});


module.exports = router;
