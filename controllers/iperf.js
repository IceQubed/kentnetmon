var express = require('express');
var router = express.Router();
var child_process = require('child_process');
var mongoose = require('mongoose');
var Result = mongoose.model('results');
var newResult = new Result();

/* POST form. */
router.post('/', function (req, res) {
    // execFile: executes a file with the specified arguments
    child_process.execFile('iperf3', ['-c', '192.168.1.102', '-J'], function (error, stdout, stderr) {

        newResult = JSON.parse(stdout);

        Result(newResult).save(function (err) {
            if (err) throw err;
            console.log('Item added!');
        });

    });
});


//function addResult(result) {
//    Result(JSON.parse(result)).save(function (err) {
//        console.log("Item added");
//        res.send();
//    });
//};
//
//
//newResult.save(function (err) {
//    if (err) throw err;
//
//    console.log('Item added!');
//});


module.exports = router;
