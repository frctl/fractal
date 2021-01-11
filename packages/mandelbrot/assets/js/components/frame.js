'use strict';

import storage from '../storage';
import utils from '../utils';
import events from '../events';

export default function (element) {
    const el = $(element);
    const dir = $('html').attr('dir');
    const body = el.find('> [data-role="body"]');
    const toggle = el.find('[data-action="toggle-sidebar"]');
    const sidebar = body.children('[data-role="sidebar"]');
    const main = body.children('[data-role="main"]');
    const handle = body.children('[data-role="frame-resize-handle"]');

    let sidebarState = utils.isSmallScreen() ? 'closed' : storage.get(`frame.state`, 'open');
    let dragOccuring = false;
    let isInitialClose = false;
    let handleClicks = 0;

    if (sidebarState === 'closed') {
        isInitialClose = true;
        closeSidebar();
    }

    handle.on('mousedown', (e) => {
        handleClicks++;
        setTimeout(function () {
            handleClicks = 0;
        }, 400);
        if (handleClicks === 2) {
            dragOccuring = false;
            toggleSidebar();
            handleClicks = 0;
            e.stopImmediatePropagation();
            return;
        }
    });

    toggle.on('click', toggleSidebar);

    // Global event listeners

    events.on('toggle-sidebar', toggleSidebar);
    events.on('start-dragging', () => (dragOccuring = true));
    events.on('end-dragging', function () {
        setTimeout(function () {
            dragOccuring = false;
        }, 200);
    });

    events.on('data-changed', function () {
        // TODO: make this smarter?
        document.location.reload(true);
    });

    function closeSidebar() {
        if (dragOccuring || (!isInitialClose && sidebarState == 'closed')) return;
        const w = sidebar.outerWidth();
        let translate = dir == 'rtl' ? w + 'px' : -1 * w + 'px';
        let sidebarProps = {
            transform: `translate3d(${translate}, 0, 0)`,
        };
        if (dir == 'rtl') {
            sidebarProps.marginLeft = -1 * w + 'px';
        } else {
            sidebarProps.marginRight = -1 * w + 'px';
        }
        sidebarProps.transition = isInitialClose ? 'none' : '.3s ease all';
        body.css(sidebarProps);
        sidebarState = 'closed';
        el.addClass('is-closed');
        storage.set(`frame.state`, sidebarState);
        isInitialClose = false;
    }

    function openSidebar() {
        if (dragOccuring || sidebarState == 'open') return;
        body.css({
            marginRight: 0,
            marginLeft: 0,
            transition: '0.3s ease all',
            transform: `translate3d(0, 0, 0)`,
        });
        sidebarState = 'open';
        el.removeClass('is-closed');
        storage.set(`frame.state`, sidebarState);
    }

    function toggleSidebar() {
        sidebarState == 'open' ? closeSidebar() : openSidebar();
        return false;
    }

    return {
        closeSidebar: closeSidebar,

        openSidebar: openSidebar,

        startLoad: function () {
            main.addClass('is-loading');
        },

        endLoad: function () {
            main.removeClass('is-loading');
        },
    };
}
