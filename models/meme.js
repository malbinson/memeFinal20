// grab the things we need
var Comment = require("comment");
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var memeSchema = new Schema({
  title: String,
  submittedBy: String,
  image: String,
  isSpicy: Boolean,
  isActive: Boolean,
  comments: [ Comment ]
});

//attach schema to model
var Meme = mongoose.model('Meme', memeSchema);

// make this available to our users in our Node applications
module.exports = Meme;