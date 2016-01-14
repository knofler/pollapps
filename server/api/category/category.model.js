'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CategorySchema = new Schema({
  catTopic:String,	
  catName: String,
  catOption: String,
  created:Date,
  created_by:String,
  updated_at:String,
  updated_by:String,
  longitude:String,
  latitude:String,
  active: Boolean
});

module.exports = mongoose.model('Category', CategorySchema);