var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var moment = require('moment');
var url = require('url');

/* GET graphs page. */
router.get('/:agentid', function (req, res) {
    var currentUrl = url.parse(req.url, true),
        fromDate,
        toDate;

    if (currentUrl.query.fromDate) {
        fromDate = new Date(currentUrl.query.fromDate);
    } else {
        fromDate = new Date(new Date().getTime() - (1000 * 60 * 60 * 24)); //default to day before
    }
    if (currentUrl.query.toDate) {
        toDate = new Date(currentUrl.query.toDate) + (1000 * 60 * 60 * 24); //add 1 day as date selection is only per day
    } else {
        toDate = new Date(new Date().getTime() + (1000 * 60 * 60 * 24));
    }

    Agent
        .findById(req.params.agentid)
        .populate({
            path: 'resultsudp',
            match: {
                'start.timestamp.time': {
                    $gt: fromDate,
                    $lte: toDate
                }
            }
        })
        .exec(function (err, agent) {
            if (!agent || !agent.resultsudp) {
                res.status(500);
                return;
            }

            res.status(200).json({
                jitter: agent.resultsudp.map(result => result.end.sum.jitter_ms),
                lostpackets: agent.resultsudp.map(result => result.end.sum.lost_percent),
                date: agent.resultsudp.map(result => moment(result.start.timestamp.time).format("YYYY MM DD HH mm"))
            });
        });
});

module.exports = router;
