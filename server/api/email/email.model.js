'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EmailSchema = new Schema({
  to: String,
  from:String,
  subject:String,
  text:String,		
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Email', EmailSchema);