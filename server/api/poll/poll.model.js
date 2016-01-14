'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PollSchema = new Schema({
  poll_head:String,
  item:String,
  ratings:Number,
  comments:String,
  created:Date,
   data1:Number,
  data2:Number,
  data3:Number,
  data4:Number,
  data5:Number,
  data6:Number,
  created_by:String,
  updated_at:String,
  updated_by:String,
  recorded_at:Date,
  recorded_by:String,
  longitude:String,
  latitude:String,
  active: Boolean
});

module.exports = mongoose.model('Poll', PollSchema);