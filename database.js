var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    title: String,
});

var Result = new Schema({
    field1: Object,
})

mongoose.model('comments', Comment);
mongoose.model('results', Result);

mongoose.connect('mongodb://localhost/node-comment');
mongoose.createConnection('mongodb://localhost/iperf-results');
