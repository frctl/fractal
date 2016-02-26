'use strict';

global.jQuery    = require('jquery');
const pjax       = require('jquery-pjax');
const fastclick  = require('fastclick');
const $          = global.jQuery;
const doc        = $(document);

const events     = require('./events');
const frame      = require('./components/frame');
const Tree       = require('./components/tree');

fastclick(document.body);

const mainFrame = frame($('#frame'));
const navTrees  = $.map($('[data-behaviour="tree"]'), t => new Tree(t));

doc.pjax('a[data-pjax]', '#pjax-container', {
    fragment: '#pjax-container'
}).on('pjax:start', function(e, xhr, options){
    events.trigger('main-content-preload', options.url);
}).on('pjax:end', function(){
    events.trigger('main-content-loaded');
});
