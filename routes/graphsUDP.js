var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var moment = require('moment');

/* GET graphs page. */
router.get('/:agentid', function (req, res) {
    Agent
        .findById(req.params.agentid)
        .populate('resultsudp')
        .exec(function (err, agent) {
            var lostpackets = agent.resultsudp.map(function (lostpacket) {
                return lostpacket.end.sum.lost_percent;
            });
            var jitter = agent.resultsudp.map(function (jitter) {
                return jitter.end.sum.jitter_ms;
            });
            var date = agent.resultsudp.map(function (dateTime) {
                return moment(dateTime.start.timestamp.time).format("YYYY MM DD hh mm");
            });

            res.status(200).json({
                lostpackets: lostpackets,
                jitter: jitter,
                date: date
            });
        });
});

module.exports = router;
