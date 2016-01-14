'use strict';

var _ = require('lodash');
var Acl = require('./acl.model');

// Get list of acls
exports.index = function(req, res) {
  Acl.find(function (err, acls) {
    if(err) { return handleError(res, err); }
    return res.json(200, acls);
  });
};

// Get a single acl
exports.show = function(req, res) {
  Acl.findById(req.params.id, function (err, acl) {
    if(err) { return handleError(res, err); }
    if(!acl) { return res.send(404); }
    return res.json(acl);
  });
};

// Get list of acls checked by email and resource match
exports.right = function(req, res) {
  var resource = req.query.resource;
  var email = req.query.email;
  Acl.find({"resource":resource,"email":email},function (err, acls) {
    if(err) { return handleError(res, err); }
     return res.json(200, acls);
  });
};

// Get list of acls searched by email
exports.email = function(req, res) {
  var email = req.query.email;
  Acl.find({"email":email},function (err, acls) {
    if(err) { return handleError(res, err); }
     return res.json(200, acls);
  });
};
// Get list of acls and memeber of group searched by group
exports.group = function(req, res) {
  var group = req.query.group;
  Acl.find({"group":group},function (err, acls) {
    if(err) { return handleError(res, err); }
     return res.json(200, acls);
  });
};
// Creates a new acl in the DB.
exports.create = function(req, res) {
  Acl.create(req.body, function(err, acl) {
    if(err) { return handleError(res, err); }
    return res.json(201, acl);
  });
};

// Updates an existing acl in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Acl.findById(req.params.id, function (err, acl) {
    if (err) { return handleError(res, err); }
    if(!acl) { return res.send(404); }
    var updated = _.merge(acl, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, acl);
    });
  });
};

// Deletes a acl from the DB.
exports.destroy = function(req, res) {
  Acl.findById(req.params.id, function (err, acl) {
    if(err) { return handleError(res, err); }
    if(!acl) { return res.send(404); }
    acl.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}