'use strict';

const $          = global.jQuery;
const storage    = require('../storage');
const events     = require('../events');

class Browser {

    constructor(el){
        this._el   = $(el);
        this._tabs = this._el.find('[data-role="tab"]');
        console.log(this._tabs);
        this._tabPanels = this._el.find('[data-role="tab-panel"]');
        this._initTabs();
    }

    _initTabs() {
        this._tabs.on('click', e => {
            this._tabs.removeClass('is-active');
            $(e.target).parent().addClass('is-active');
            this._tabPanels.removeClass('is-active');
            this._tabPanels.filter($(e.target).attr('href')).addClass('is-active');
            return false;
        });
    }
}

module.exports = Browser;
