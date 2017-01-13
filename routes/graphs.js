var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');

/* GET graphs page. */
router.get('/:agentid', function (req, res) {
    Agent
        .findById(req.params.agentid)
        .populate('results')
        .exec(function (err, agent) {
            var results = agent.results.map(function (result) {
                return result.end.sum_sent.bits_per_second;
            });

            res.status(200).json({
                results: results
            });
        });
});

module.exports = router;
