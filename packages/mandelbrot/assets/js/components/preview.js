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
        this._handleSelector = `#${this._id} [data-role="resize-handle"]`;
        this._handle         = $(this._handleSelector);
        this._iframe         = this._el.find('[data-role="window"]');
        this._resizer        = this._el.find('[data-role="resizer"]');
        this._init();
    }

    _init() {
        this._resizer.resizable({
            handleSelector: this._handleSelector,
            resizeHeight: false,
            onDragStart: () => {
                this._el.addClass('is-resizing');
                this.disableEvents();
                events.trigger('start-dragging');
            },
            onDragEnd: () => {
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
