'use strict';

const $       = global.jQuery;
const storage = require('../storage');
const utils   = require('../utils');
const events  = require('../events');

module.exports = function(element){

    const el         = $(element);
    const id         = element[0].id;
    const header     = el.children('[data-role="header"]').first();
    const body       = el.children('[data-role="body"]').first();
    const sidebar    = body.children('[data-role="sidebar"]').first();
    const main       = body.children('[data-role="main"]').first();
    const gutter     = body.children('[data-role="gutter"]').first();
    const toggle     = el.find('[data-action="toggle-sidebar"]');
    const gutterSize = gutter.width();
    const win        = $(window);
    const panels     = main.add(sidebar);
    const sidebarMax = parseInt(sidebar.css('max-width'), 10);
    const sidebarMin = parseInt(sidebar.css('min-width'), 10);
    const defWidth   = Math.max(sidebarMin, sidebar.width());
    let sidebarState = storage.get(`frame.${id}.state`, 'open');
    let sidebarWidth = storage.get(`frame.${id}.sidebar`, defWidth);
    let start        = null;
    let lastStart    = null;
    let docWidth     = null;
    let collapsed    = false;
    let isDragging   = false;

    sidebar.width(sidebarWidth);
    if (sidebarState === 'closed') {
        closeSidebar(true);
    }

    function move(event) {
        let dragWidth = Math.min(sidebarMax, sidebarWidth + event.pageX - start);
        let spWidth   = Math.min(100, Math.max(0, (dragWidth / docWidth) * 100));
        let mpWidth   = 100 - spWidth;
        sidebar.css('width', `calc(${spWidth}% - ${gutterSize / 2}px)`);
        main.css('width', `calc(${mpWidth}% - ${gutterSize / 2}px)`);
    };

    function startDrag(event){
        if (isDragging) return;
        start      = event.pageX;
        lastStart  = start;
        isDragging = true;
        docWidth   = $(document).width();
        el.addClass('is-resizing');
        panels.on('selectstart dragstart', stopSelect);
        win.on('mousemove touchmove', move);
    };

    function stopDrag(){
        if (!isDragging) return;
        win.off('mousemove touchmove', move);
        panels.off('selectstart dragstart', stopSelect);
        setSidebarWidth(collapsed ? 0 : sidebar.width());
        main.width('');
        start      = null;
        isDragging = false;
        el.removeClass('is-resizing');
    };

    function stopSelect(){
        return false;
    }

    function setSidebarWidth(width){
        sidebarWidth = width;
        sidebar.width(width);
        storage.set(`frame.${id}.sidebar`, width);
    }

    gutter.on('dblclick', e => setSidebarWidth(defWidth));
    gutter.on('mousedown', startDrag);

    win.on('mouseup touchend touchcancel', stopDrag);
    toggle.on('click', toggleSidebar);
    events.on('toggle-sidebar', toggleSidebar);

    function closeSidebar(quick){
        if (quick) {
            body.css({
                transition: 'none',
                marginRight: (-1 * sidebarWidth) + 'px',
                transform: `translate3d(${(-1 * sidebarWidth)}px, 0, 0)`
            });
        } else {
            body.css({
                transition: '.3s ease all',
                marginRight: (-1 * sidebarWidth) + 'px',
                transform: `translate3d(${(-1 * sidebarWidth)}px, 0, 0)`
            });
        }
        gutter.hide();
        sidebarState = 'closed';
        storage.set(`frame.${id}.state`, sidebarState);
    }

    function openSidebar(){
        body.css({
            marginRight: 0,
            transition: '.3s ease all',
            transform: `translate3d(0, 0, 0)`
        });
        gutter.show();
        sidebarState = 'open';
        storage.set(`frame.${id}.state`, sidebarState);
    }

    function toggleSidebar(){
        sidebarState == 'open' ? closeSidebar() : openSidebar();
        return false;
    }
};
