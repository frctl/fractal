'use strict';

const $          = global.jQuery;
const storage    = require('../storage');
const events     = require('../events');

class Browser {

    constructor(el){
        this._el   = $(el);
        this._tabs = this._el.find('[data-role="tab"]');
        this._tabPanels = this._el.find('[data-role="tab-panel"]');
        this._initTabs();
    }

    _initTabs() {
        const selectedIndex = Math.min(this._tabs.length -1, storage.get(`browser.selectedTabIndex`, 0));
        this._tabs.on('click', e => {
            const link = $(e.target);
            const tab = link.parent();
            this._tabs.removeClass('is-active');
            storage.set(`browser.selectedTabIndex`, this._tabs.index(tab));
            tab.addClass('is-active');
            this._tabPanels.removeClass('is-active');
            this._tabPanels.filter(link.attr('href')).addClass('is-active');
            return false;
        });
        this._tabs.removeClass('is-active');
        this._tabs.eq(selectedIndex).find('a').trigger('click');
    }

}

module.exports = Browser;
