'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var GroupSchema = new Schema({
  name: String,
  desc: String,
  resource: String,
  created: Date,
  created_by: String,
  edited: Date,
  edited_by: String,
  active: Boolean
});

module.exports = mongoose.model('Group', GroupSchema);