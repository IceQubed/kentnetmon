var express = require('express');
var router = express.Router();

/* GET agents page. */
router.get('/agents', function (req, res, next) {
    res.render('agents', {
        title: 'KentNetMon Agents'
    });
});

module.exports = router;
