'use strict';

import events from '../events';

import Tree, { getHandleFromUrl } from './tree';
import Search from './search';

export default class Navigation {
    constructor(el) {
        this._el = $(el);
        this.navTrees = $.map(this._el.find('[data-behaviour="tree"]'), (t) => new Tree(t));
        $.map(this._el.find('[data-behaviour="search"]'), (s) => new Search(s, this.navTrees));
        this._variantPanel = this._el.find('.Navigation-panel--variants');

        events.on('main-content-preload', (e, url) => {
            this.toggleVariantPanel(getHandleFromUrl(url));
        });
    }

    showVariantPanel() {
        this._variantPanel.addClass('is-visible');
    }

    hideVariantPanel() {
        this._variantPanel.removeClass('is-visible');
    }

    toggleVariantPanel(handle) {
        const variantGroup = this._variantPanel.find(`.Navigation-group[data-component="${handle}"`);
        if (variantGroup.length) {
            this.showVariantPanel();
            this.selectVariantGroup(variantGroup);
        } else {
            this.hideVariantPanel();
        }
    }

    selectVariantGroup(element) {
        this._variantPanel.find('.Navigation-group.is-visible').removeClass('is-visible');
        element.addClass('is-visible');
    }
}
