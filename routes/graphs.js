var express = require('express');
var router = express.Router();

/* GET graphs page. */
router.get('/', function (req, res, next) {
    res.render('graphs', {
        title: 'KentNetMon Graphs'
    });
});

module.exports = router;
