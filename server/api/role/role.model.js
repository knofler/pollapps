'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var RoleSchema = new Schema({
  roleName: String,
  created:Date,
  created_by:String,
  edited:Date,
  edited_by:String,
  active: Boolean
});

module.exports = mongoose.model('Role', RoleSchema);