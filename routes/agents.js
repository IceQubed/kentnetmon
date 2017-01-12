var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Comment = mongoose.model('comments');
var Agent = mongoose.model('agents');

/* GET form. */
router.get('/', function (req, res) {
    Agent.find(function (err, agents) {
        Comment.find(function (err, comments) {
            res.render(
                'agents', {
                    title: 'KentNetMon Agents',
                    comments: comments,
                    agents: agents
                }
            );
        });
    })
});

/* POST form. */
router.post('/', function (req, res) {
    new Comment({
            title: req.body.comment
        })
        .save(function (err, comment) {
            res.redirect('agents');
        });
});


module.exports = router;
