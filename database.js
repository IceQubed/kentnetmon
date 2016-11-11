var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    title: String,
});

mongoose.model('comments', Comment);

mongoose.connect('mongodb://localhost/node-comment');
