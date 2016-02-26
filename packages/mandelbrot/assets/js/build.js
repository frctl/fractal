'use strict';

global.jQuery    = require('jquery');
const pjax       = require('jquery-pjax');
const fastclick  = require('fastclick');
const $          = global.jQuery;

const events     = require('./events');
const frame      = require('./components/frame');
const Tree       = require('./components/tree');

fastclick(document.body);

const mainFrame = frame($('#frame'));
const navTrees  = $.map($('[data-behaviour="tree"]'), t => new Tree(t));
