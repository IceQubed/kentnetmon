var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Result = mongoose.model('results');

/* GET form. */
router.get('/', function (req, res) {
    Result.find(function (err, results) {
        console.log(results)
        res.render(
            'results', {
                field1: results
            }
        );
    });
});

/* POST form. */
router.post('/', function (req, res) {
    new Comment({
            title: req.body.comment
        })
        .save(function (err, comment) {
            console.log(comment)
            res.redirect('agents');
        });
});


module.exports = router;
