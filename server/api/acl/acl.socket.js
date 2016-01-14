/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Acl = require('./acl.model');

exports.register = function(socket) {
  Acl.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Acl.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('acl:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('acl:remove', doc);
}