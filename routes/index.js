var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'KentNetMon Dashboard'
    });
});

/* GET agents page. */
router.get('/agents', function (req, res, next) {
    res.render('agents', {
        title: 'KentNetMon Agents'
    });
});

/* GET settings page. */
router.get('/settings', function (req, res, next) {
    res.render('settings', {
        title: 'KentNetMon Settings'
    });
});


module.exports = router;
