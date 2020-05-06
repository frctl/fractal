'use strict';

const $ = global.jQuery;
const storage = require('../storage');
const events = require('../events');
require('jquery-resizable-dom/dist/jquery-resizable.js');

class Preview {
    constructor(el) {
        this._el = $(el);
        this._id = this._el[0].id;
        this._handle = this._el.find('[data-role="resize-handle"]');
        this._iframe = this._el.children('[data-role="window"]');
        this._resizer = this._el.children('[data-role="resizer"]');
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
            handleSelector: this._handle,
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

    disableEvents() {
        this._el.addClass('is-disabled');
    }

    enableEvents() {
        this._el.removeClass('is-disabled');
    }
}

module.exports = Preview;
