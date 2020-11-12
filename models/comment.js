var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = mongoose.Schema({

    name : String,
    comment : String,
    score: Number,
    description: String

});


module.exports = mongoose.model('Comment', commentSchema);