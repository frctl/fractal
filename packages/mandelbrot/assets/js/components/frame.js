'use strict';

const $       = global.jQuery;
const Hammer  = require('hammerjs');
const storage = require('../storage');
const utils   = require('../utils');
const events  = require('../events');
const config  = require('../config');

delete Hammer.defaults.cssProps.userSelect;

module.exports = function(element){

    const win          = $(window);
    const doc          = $(document);
    const el           = $(element);
    const id           = el[0].id;
    const dir          = $('html').attr('dir');
    const header       = el.find('> [data-role="header"]');
    const body         = el.find('> [data-role="body"]');
    const toggle       = el.find('[data-action="toggle-sidebar"]');
    const sidebar      = body.children('[data-role="sidebar"]');
    const main         = body.children('[data-role="main"]');
    const handle       = body.children('[data-role="frame-resize-handle"]');
    const sidebarMin   = parseInt(sidebar.css('min-width'), 10);
    // const touch        = new Hammer(el[0]);

    let sidebarWidth   = utils.isSmallScreen() ? sidebarMin : storage.get(`frame.sidebar`, sidebar.outerWidth());
    let sidebarState   = utils.isSmallScreen() ? 'closed' : storage.get(`frame.state`, 'open');
    let scrollPos      = storage.get(`frame.scrollPos`, 0);
    let dragOccuring   = false;
    let isInitialClose = false;

    // touch.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

    sidebar.outerWidth(sidebarWidth);

    if (sidebarState === 'closed') {
        isInitialClose = true;
        closeSidebar();
    }

    sidebar.scrollTop(scrollPos);

    sidebar.resizable({
        handleSelector: handle,
        resizeHeight: false,
        onDragStart: e => {
            el.addClass('is-resizing');
            events.trigger('start-dragging');
        },
        onDragEnd: e => {
            setSidebarWidth(sidebar.outerWidth());
            el.removeClass('is-resizing');
            events.trigger('end-dragging');
        },
        reverse: dir === 'rtl'
    });

    sidebar.on('scroll', utils.debounce((e) => {
        storage.set(`frame.scrollPos`, sidebar.scrollTop());
    }, 50));

    toggle.on('click', toggleSidebar);

    win.on('resize', () => {
        if (sidebarState == 'open' && doc.outerWidth() < sidebarWidth + 50) {
            setSidebarWidth(doc.outerWidth() - 50);
        }
    });

    // Touch events

    // touch.on('swipeleft', closeSidebar);
    // touch.on('swiperight', openSidebar);

    // Global event listeners

    events.on('toggle-sidebar', toggleSidebar);
    events.on('start-dragging', e => (dragOccuring = true));
    events.on('end-dragging', function(){
        setTimeout(function(){
            dragOccuring = false;
        }, 200);
    });

    events.on('data-changed', function(){
        // TODO: make this smarter?
        document.location.reload(true);
    });

    function closeSidebar(){
        if (dragOccuring || (!isInitialClose && sidebarState == 'closed')) return;
        const w = sidebar.outerWidth();
        let translate = (dir == 'rtl') ? w + 'px' : (-1 * w) + 'px';
        let sidebarProps = {
            transform: `translate3d(${translate}, 0, 0)`
        };
        if (dir == 'rtl') {
            sidebarProps.marginLeft = ((-1 * w) - 20) + 'px';
        } else {
            sidebarProps.marginRight = (-1 * w) + 'px';
        }
        sidebarProps.transition = isInitialClose ? 'none' : '.3s ease all';
        body.css(sidebarProps);
        handle.addClass('is-disabled');
        sidebarState = 'closed';
        el.addClass('is-closed');
        storage.set(`frame.state`, sidebarState);
        isInitialClose = false;
    }

    function openSidebar(){
        if (dragOccuring || sidebarState == 'open') return;
        if (utils.isSmallScreen()) {
            setSidebarWidth(sidebarMin);
        }
        body.css({
            marginRight: 0,
            transition: '.3s ease all',
            transform: `translate3d(0, 0, 0)`
        });
        handle.removeClass('is-disabled');
        sidebarState = 'open';
        el.removeClass('is-closed');
        storage.set(`frame.state`, sidebarState);
    }

    function toggleSidebar(){
        sidebarState == 'open' ? closeSidebar() : openSidebar();
        return false;
    }

    function setSidebarWidth(width){
        sidebarWidth = width;
        sidebar.outerWidth(width);
        storage.set(`frame.sidebar`, width);
    }

    return {

        closeSidebar: closeSidebar,

        openSidebar: openSidebar,

        startLoad: function(){
            main.addClass('is-loading');
        },

        endLoad: function(){
            main.removeClass('is-loading');
        }
    }
};
