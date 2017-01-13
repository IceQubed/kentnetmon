var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Agent = mongoose.model('agents');
var Result = mongoose.model('results');


/* GET form. */
router.get('/', function (req, res) {
    Agent.find(function (err, agents) {

        Result.find({
            'Agent.id': agents.id
        }, function (err, results) {

            res.render(
                'agents', {
                    title: 'KentNetMon Agents',
                    agents: agents,
                    results: results
                }
            );
        })
    })
});

module.exports = router;





///* GET form. */
//router.get('/', function (req, res) {
//    Agent.find(function (err, agents) {
//        res.render(
//            'agents', {
//                title: 'KentNetMon Agents',
//                agents: agents
//            }
//        );
//    })
//});


///* GET form. */
//router.get('/', function (req, res) {
//    Agent.find(function (err, agents) {
//        Comment.find(function (err, comments) {
//            res.render(
//                'agents', {
//                    title: 'KentNetMon Agents',
//                    comments: comments,
//                    agents: agents
//                }
//            );
//        });
//    })
//});
//
