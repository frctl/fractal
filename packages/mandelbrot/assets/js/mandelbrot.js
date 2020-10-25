'use strict';

import 'jquery';
import 'jquery-pjax';

import events from './events';
import utils from './utils';
import framer from './components/frame';
import Pen from './components/pen';
import Navigation from './components/navigation';

const doc = $(document);
const frctl = window.frctl || {};

// frame needs to be initalized before navigation because it
// needs to add an event listener before Navigation->Tree triggers it
const frame = framer($('#frame'));
new Navigation($('.Navigation'));

global.fractal = {
    events: events,
};

loadPen();

if (frctl.env == 'server') {
    doc.pjax(
        'a[data-pjax], code a[href], .Prose a[href]:not([data-no-pjax]), .Browser a[href]:not([data-no-pjax])',
        '#pjax-container',
        {
            fragment: '#pjax-container',
            timeout: 10000,
        }
    )
        .on('pjax:start', function (e, xhr, options) {
            if (utils.isSmallScreen()) {
                frame.closeSidebar();
            }
            frame.startLoad();
            events.trigger('main-content-preload', options.url);
        })
        .on('pjax:end', function () {
            events.trigger('main-content-loaded');
            frame.endLoad();
        });
}

events.on('main-content-loaded', loadPen);

function loadPen() {
    setTimeout(function () {
        $.map($('[data-behaviour="pen"]'), (p) => new Pen(p));
    }, 1);
}
