'use strict';

const $          = global.jQuery;
const storage    = require('../storage');
const events     = require('../events');
const ifr        = require('iframe-resizer');
const resizeable = require('jquery-resizable-dom/dist/jquery-resizable.js');

class Pen {

    constructor(el){
        this._el = $(el);
        this._id = this._el[0].id;
        this._windowWrapper = this._el.find('[data-role="preview-wrapper"]');
        this._window = this._el.find('[data-role="preview-window"]');
        this._handleSelector = `#${this._id} [data-role="resize-handle"]`;
        this._handle = $(`#${this._id} [data-role="resize-handle"]`);
        this._windowWrapper.on('scroll', e => {
            this._handle.css('bottom', -1 * this._windowWrapper.scrollTop());
        });
        this._hasDragged = false;
        this._initWindow();
    }

    _initWindow(){

        this._window.iFrameResize({
            log: false,
            scrolling: false,
            heightCalculationMethod: (navigator.userAgent.indexOf("MSIE") !== -1) ? 'max' : 'lowestElement',
            resizedCallback: (data) => {
                if (this._hasDragged) {
                    this._windowWrapper.css('max-height', data.height);
                }
            }
        }, this._window[0]);

        this._windowWrapper.resizable({
            handleSelector: `#${this._id} [data-role="resize-handle"]`,
            onDragStart: () => {
                this._hasDragged = true;
                this._windowWrapper.css({
                    'max-height': this._window.height() + 10,
                    'height':     this._windowWrapper.outerHeight()
                });
                this._window.css('pointer-events','none');
                events.trigger('start-dragging');
            },
            onDragEnd: () => {
                this._window.css('pointer-events','all');
                this._window.resize();
                this._window.focus();

                if (this._windowWrapper.outerWidth() >= this._windowWrapper.parent().outerWidth()) {
                    this._windowWrapper.css('width', '100%');
                }

                events.trigger('end-dragging');
            }
        });
    }

}

module.exports = Pen;
