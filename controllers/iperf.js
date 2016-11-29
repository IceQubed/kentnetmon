var express = require('express');
var child_process = require('child_process');
var mongoose = require('mongoose');
var Result = mongoose.model('results');
var newResult = new Result();
var router = express.Router();

function runTest(ipAddr) {
    child_process.execFile('iperf3', ['-c', ipAddr, '-J'], function (error, stdout, stderr) { //execute iperf3 with arguments

        console.log(stdout);
        newResult = JSON.parse(stdout); //parse text output to JSON format
        console.log('\n \n \n \n \n \n');
        console.log(newResult); //log results

        Result(newResult).save(function (err) {
            if (err) throw err;
            console.log('Item added!'); //when added log in console
        });
    });
}

module.exports = router;

//var button = document.querySelector('.controls > button');
//button.addEventListener('click', runTest('192.168.1.102'));

//var express = require('express');
//var router = express.Router();
//var child_process = require('child_process');
//var mongoose = require('mongoose');
//var Result = mongoose.model('results');
//var newResult = new Result();
//var Comment = mongoose.model('comments');
//
///* POST */
//router.post('/', function (req, res) {
//    child_process.execFile('iperf3', ['-c', '192.168.1.102', '-J'], function (error, stdout, stderr) { //execute iperf3 with arguments
//
//        console.log(stdout);
//        newResult = JSON.parse(stdout); //parse text output to JSON format
//        console.log('\n \n \n \n \n \n');
//        console.log(newResult); //log results
//
//        Result(newResult).save(function (err) {
//            if (err) throw err;
//            console.log('Item added!'); //when added log in console
//        });
//    });
//});
//
//module.exports = router;
