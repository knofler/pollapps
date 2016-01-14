'use strict';

var express = require('express');
var controller = require('./acl.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/rights/', controller.right);
router.get('/email/', controller.email);
router.get('/group/', controller.group);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;