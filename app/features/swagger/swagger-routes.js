'use strict';

var express = require('express');
var routeResult = require('../../lib/route-result');
var controller = require('./validation-controller');

var router = express.Router();

router.post('/validate', controller.post, routeResult.execute);

module.exports = router;
