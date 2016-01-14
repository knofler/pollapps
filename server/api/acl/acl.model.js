'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var AclSchema = new Schema({
  email: String,
  group:String,
  resource:String,
  rights:String,
  created:Date,
  created_by:String,
  active: Boolean
});

module.exports = mongoose.model('Acl', AclSchema);