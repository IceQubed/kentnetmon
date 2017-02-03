var express = require('express');
var router = express.Router();
var iperf = require('../controllers/iperf');

router.get('/:agentid', function (req, res) {
    iperf(req.params.agentid, function (err) {
        if (err) {
            res.status(500).json({
                error: err.message
            });
        } else {
            res.status(200).json({
                ok: true
            });
        }
    });
});

module.exports = router;
