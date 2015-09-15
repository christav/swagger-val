'use strict';
var express = require('express');
var root = require('./features/root/root-routes');

module.exports = {
  '/': root
};
