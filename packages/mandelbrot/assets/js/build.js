'use strict';

require('es6-promise').polyfill();

global.jQuery   = require('jquery');
const pjax      = require('jquery-pjax');
const fastclick = require('fastclick');
const storage   = require('localforage');
const $         = global.jQuery;

const frame   = require('./components/frame');

frame();

fastclick(document.body);
