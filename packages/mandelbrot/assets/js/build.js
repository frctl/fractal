'use strict';

require('es6-promise').polyfill();

global.jQuery    = require('jquery');
const pjax       = require('jquery-pjax');
const fastclick  = require('fastclick');
const $          = global.jQuery;

const SplitFrame = require('./components/split-frame');
const Tree       = require('./components/tree');

fastclick(document.body);

const MainFrame = new SplitFrame($('#main-frame'));

const navTrees = $.map($('[data-behaviour="tree"]'), t => new Tree(t));
