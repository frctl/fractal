'use strict';

const $          = global.jQuery;
const storage    = require('../storage');
const events     = require('../events');
const Preview    = require('./preview');
const resizeable = require('jquery-resizable-dom/dist/jquery-resizable.js');

class Pen {

    constructor(el){
        this._el             = $(el);
        this._id             = this._el[0].id;
        this._previewPanel   = this._el.find('[data-behaviour="preview"]');
        this._handle         = this._el.children('[data-role="resize-handle"]');
        this._init();
    }

    _init() {
        const initialHeight = storage.get(`pen.previewHeight`, this._previewPanel.outerHeight());
        this._previewPanel.outerHeight(initialHeight);
        const preview = new Preview(this._previewPanel);


        this._previewPanel.resizable({
            handleSelector: this._handle,
            resizeWidth: false,
            onDragStart: () => {
                this._el.addClass('is-resizing');
                preview.disableEvents();
                events.trigger('start-dragging');
            },
            onDragEnd: () => {
                this._el.removeClass('is-resizing');
                preview.enableEvents();
                events.trigger('end-dragging');
                storage.set(`pen.previewHeight`, this._previewPanel.outerHeight());
            },
        });
    }
}

module.exports = Pen;
