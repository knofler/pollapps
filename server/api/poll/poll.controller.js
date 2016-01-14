'use strict';

var _ = require('lodash');
var Poll = require('./poll.model');

var last_id = '';

// Get list of polls
exports.index = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(200, polls);
  });
};

exports.topic = function(req, res) {
  var topic = req.query.topic;
  Poll.find({'poll_head':topic},function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(200, polls);
  });
};

exports.vote = function(req, res) {
  var vote_topic = req.query.vote_topic;
  var vote_item  = req.query.vote_item 
  Poll.findOne({"poll_head":vote_topic,"item":vote_item},function (err, poll) {
    if(err) { return handleError(res, err); }
    return res.json(200, poll);
  });
};

//get last entry
exports.last = function(req, res) {
  Poll.find(function (err, polls) {
    if(err) { return handleError(res, err); }
    polls = polls.sort({_id : -1});
    last_id = polls[polls.length-1];
    return res.json(200,last_id);
  });
};

 

exports.sum = function(req, res) {
  var item =req.query.item; 
  Poll.aggregate(
    [
      { $match: {
            item: item
        }
      }
    ],function (err, polls) {
    if(err) { return handleError(res, err); }
    return res.json(200, polls);
  });
};

// Get a single poll
exports.show = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    return res.json(poll);
  });
};

// Creates a new poll in the DB.
exports.create = function(req, res) {
  Poll.create(req.body, function(err, poll) {
    if(err) { return handleError(res, err); }
    return res.json(201, poll);
  });
};

// Updates an existing poll in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Poll.findById(req.params.id, function (err, poll) {
    if (err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    var updated = _.merge(poll, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, poll);
    });
  });
};

// Deletes a poll from the DB.
exports.destroy = function(req, res) {
  Poll.findById(req.params.id, function (err, poll) {
    if(err) { return handleError(res, err); }
    if(!poll) { return res.send(404); }
    poll.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}