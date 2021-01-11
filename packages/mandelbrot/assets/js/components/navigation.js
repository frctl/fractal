'use strict';

import storage from '../storage';
import utils from '../utils';
import events from '../events';

import Tree, { getHandleFromUrl } from './tree';
import Search from './search';

export default class Navigation {
    constructor(el) {
        this._el = $(el);
        this._mainPanel = this._el.find('.Navigation-panel--main');
        this._variantPanel = this._el.find('.Navigation-panel--variants');

        this._mainPanel.on(
            'scroll',
            utils.debounce(() => {
                storage.set(`navigation.mainPanel.scrollPos`, this._mainPanel.scrollTop());
            }, 50)
        );

        events.on('scroll-sidebar', () => {
            const scrollPos = storage.get(`navigation.mainPanel.scrollPos`, 0);
            this._mainPanel.scrollTop(scrollPos);
        });

        events.on('main-content-preload', (e, url) => {
            this.toggleVariantPanel(getHandleFromUrl(url));
        });

        // trees need to be initialized after "scroll-sidebar" event handler is bound
        this.navTrees = $.map(this._el.find('[data-behaviour="tree"]'), (t) => new Tree(t));
        $.map(this._el.find('[data-behaviour="search"]'), (s) => new Search(s, this.navTrees));
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
