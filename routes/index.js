var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'NetMon Dashboard'
    });
});

/* GET agents page. */
router.get('/agents', function (req, res, next) {
    res.render('agents', {
        title: 'NetMon Agents'
    });
});

/* GET settings page. */
router.get('/settings', function (req, res, next) {
    res.render('settings', {
        title: 'NetMon Settings'
    });
});


module.exports = router;
