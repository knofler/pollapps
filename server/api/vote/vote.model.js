'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VoteSchema = new Schema({
  poll_head:String,
  item:String,
  ratings:Number,
  comments:String,
  data1:Number,
  data2:Number,
  data3:Number,
  data4:Number,
  data5:Number,
  data6:Number,
  updated_at:String,
  updated_by:String,
  voted_at:Date,
  voted_by:String,
  longitude:String,
  latitude:String,
  active: Boolean
});

module.exports = mongoose.model('Vote', VoteSchema);