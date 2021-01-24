'use strict';

import storage from '../storage';
import utils from '../utils';
import events from '../events';

import Tree, { getHandleFromUrl } from './tree';
import Search from './search';

export default class Navigation {
    constructor(el) {
        this._el = $(el);
        this._mainPanel = this._el.find('[data-role="main-panel"]');
        this._variantPanel = this._el.find('[data-role="variant-panel"]');
        this._backButton = this._el.find('[data-role="back"]');
        this._links = this._el.find('[data-role="tree-link"]');

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
            const handle = getHandleFromUrl(url);

            if (!handle || !this.hasVariantPanel(handle)) {
                this.hideVariantPanel();
            } else if (this.hasVariantPanel(handle)) {
                this.toggleVariantPanel(handle);
            }
        });

        // trees need to be initialized after "scroll-sidebar" event handler is bound
        this.navTrees = $.map(this._el.find('[data-behaviour="tree"]'), (t) => new Tree(t));
        $.map(this._el.find('[data-behaviour="search"]'), (s) => new Search(s, this.navTrees));

        this._backButton.on('click', () => {
            this.hideVariantPanel();
        });

        this._links.on('click', (e) => {
            const handle = $(e.currentTarget).data('handle');
            const isVariantPanelVisible = this.isVariantPanelVisible();

            if (this.hasVariantPanel(handle)) {
                this.toggleVariantPanel(handle);

                if (utils.isSmallScreen() && !isVariantPanelVisible) {
                    e.preventDefault();
                }
            }
        });
    }

    showVariantPanel() {
        this._el.addClass('in-variants-panel');
    }

    hideVariantPanel() {
        this._el.removeClass('in-variants-panel');
    }

    hasVariantPanel(handle) {
        return this._variantPanel.find(`[data-role="variant-group"][data-component="${handle}"]`).length;
    }

    toggleVariantPanel(handle) {
        if (this.hasVariantPanel(handle)) {
            this.showVariantPanel();
            this.selectVariantGroup(handle);
        } else {
            this.hideVariantPanel();
        }
    }

    selectVariantGroup(handle) {
        this._variantPanel.find('[data-role="variant-group"].is-visible').removeClass('is-visible');
        this._variantPanel.find(`[data-role="variant-group"][data-component="${handle}"]`).addClass('is-visible');
    }

    isVariantPanelVisible() {
        return this._el.hasClass('in-variants-panel');
    }
}
