var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');

/* GET graphs page. */
router.get('/:agentid', function (req, res) {
    Agent
        .findById(req.params.agentid)
        .populate('results')
        .populate('resultsudp')
        .exec(function (err, agent) {
            var results = agent.results.map(function (result) {
                return result.end.sum_sent.bits_per_second;
            });
            var lostpackets = agent.resultsudp.map(function (lostpacket) {
                return lostpacket.end.sum.lost_percent;
            });

            res.status(200).json({
                results: results,
                lostpackets: lostpackets
            });
        });
});

module.exports = router;
