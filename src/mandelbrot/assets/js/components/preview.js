'use strict';

import 'jquery-resizable-dom';

import storage from '../storage';
import events from '../events';

export default class Preview {
    constructor(el, previewSizeEl) {
        this._el = $(el);
        this._id = this._el[0].id;
        this._handle = this._el.find('[data-role="resize-handle"]');
        this._resizer = this._el.children('[data-role="resizer"]');
        this._previewSize = previewSizeEl;

        this._updateSize = this._updateSize.bind(this);

        this._updateIframeRefs();
        this._init();
    }

    _init() {
        const dir = $('html').attr('dir');
        const initialWidth = storage.get(`preview.width`, this._resizer.outerWidth());
        let handleClicks = 0;

        if (initialWidth == this._el.outerWidth()) {
            this._resizer.css('width', '100%');
        } else {
            this._resizer.outerWidth(initialWidth);
        }

        events.on('main-content-loaded', this._updateIframeRefs.bind(this));

        this._handle.on('mousedown', () => {
            handleClicks++;

            setTimeout(function () {
                handleClicks = 0;
            }, 400);

            if (handleClicks === 2) {
                this._resizer.css('width', 'calc(100% + 0.75rem)');
                return false;
            }
        });

        this._resizer.resizable({
            handleSelector: '> [data-role="resize-handle"]',
            resizeHeight: false,
            onDragStart: () => {
                this._el.addClass('is-resizing');
                this.disableEvents();
                events.trigger('start-dragging');
            },
            onDragEnd: () => {
                if (this._resizer.outerWidth() == this._el.outerWidth()) {
                    this._resizer.css('width', '100%');
                }
                storage.set(`preview.width`, this._resizer.outerWidth());
                this._el.removeClass('is-resizing');
                this.enableEvents();
                events.trigger('end-dragging');
            },
            resizeWidthFrom: dir === 'rtl' ? 'left' : 'right',
        });
    }

    _updateIframeRefs() {
        this._iframe = this._el.find('[data-role="window"]');
        this._previewIframeWindow = this._iframe ? this._iframe.get(0).contentWindow : null;

        if (this._iframe) {
            this._iframe.on('load', this._updateSize);
        }

        if (this._previewIframeWindow) {
            this._previewIframeWindow.addEventListener('resize', this._updateSize);
        }
    }

    _updateSize() {
        if (this._previewSize) {
            this._previewSize.text(
                `${this._previewIframeWindow.innerWidth} × ${this._previewIframeWindow.innerHeight}`
            );
        }
    }

    disableEvents() {
        this._el.addClass('is-disabled');
    }

    enableEvents() {
        this._el.removeClass('is-disabled');
    }
}
