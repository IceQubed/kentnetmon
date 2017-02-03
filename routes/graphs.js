var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var moment = require('moment');

/* GET graphs page. */
router.get('/:agentid', function (req, res) {
    Agent
        .findById(req.params.agentid)
        .populate('results')
        .exec(function (err, agent) {
            var throughputSent = agent.results.map(function (result) {
                return result.end.sum_sent.bits_per_second;
            });
            var throughputReceived = agent.results.map(function (result) {
                return result.end.sum_received.bits_per_second;
            });
            var date = agent.results.map(function (result) {
                return moment(result.start.timestamp.time).format("YYYY MM DD HH mm");
                //                return moment(result.start.timestamp.time).format("YYYY MM DD");
                //                result.start.timestamp.time;
            });

            res.status(200).json({
                throughputSent: throughputSent,
                throughputReceived: throughputReceived,
                date: date
            });
        });
});

module.exports = router;
