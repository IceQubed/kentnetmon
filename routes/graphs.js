var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var moment = require('moment');
var url = require('url');

/* GET graphs page. */
router.get('/:agentid', function (req, res) {
    var currentUrl = url.parse(req.url, true),
        toDate;

    if (currentUrl.query.toDate) {
        toDate = new Date(currentUrl.query.toDate);
    } else {
        toDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
    }

    Agent
        .findById(req.params.agentid)
        .populate('results')
        .exec(function (err, agent) {
            var filteredResults = agent.results.filter(result => {
                // Date comparison here bro
                return true;
            });

            var throughputSent = filteredResults.map(function (result) {
                return result.end.sum_sent.bits_per_second;
            });
            var throughputReceived = filteredResults.map(function (result) {
                return result.end.sum_received.bits_per_second;
            });
            var date = filteredResults.map(function (result) {
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
