var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');


router.get('/:agentid', function (req, res) {
    Agent.findByIdAndRemove(req.params.agentid, function (err, agent) {});
});



//router.get('/:agentid', function (req, res) {
//    Agent.findById(req.params.agentid, function (err, agent) {
//        agents.remove({
//            _id: agent.id
//        });
//    });
//});

module.exports = router;
