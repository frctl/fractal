'use strict';

const $          = global.jQuery;
const storage    = require('../storage');
const events     = require('../events');
const ifr        = require('iframe-resizer');
const resizeable = require('jquery-resizable-dom/dist/jquery-resizable.js');

class Preview {

    constructor(el){
        this._el             = $(el);
        this._id             = this._el[0].id;
        this._handle         = this._el.find('[data-role="resize-handle"]');
        this._iframe         = this._el.children('[data-role="window"]');
        this._resizer        = this._el.children('[data-role="resizer"]');
        this._init();
    }
    
    _init() {
        const initialWidth = storage.get(`preview.width`, this._resizer.outerWidth());
        if (initialWidth == this._el.outerWidth()) {
            this._resizer.css('width', '100%');
        } else {
            this._resizer.outerWidth(initialWidth);
        }
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
