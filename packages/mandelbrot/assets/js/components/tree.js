'use strict';

import storage from '../storage';
import events from '../events';

export function getTreeUrl(urlPath) {
    const parser = document.createElement('a');
    parser.href = urlPath;
    const pathParts = parser.pathname.split('/');
    pathParts.push(pathParts.pop());
    return pathParts.join('/');
}

export function getHandleFromUrl(url) {
    const fullUrl = getTreeUrl(url);
    const [handle] = fullUrl.split('/').slice(-1);
    const [componentName] = handle.split('--');
    return componentName;
}

export default class Tree {
    constructor(el) {
        this._el = $(el);
        this._id = this._el[0].id;
        this._state = storage.get(`tree.${this._id}.state`, [], 'session');
        this._collections = $.map(this._el.find('[data-behaviour="collection"]'), (c) => new TreeCollection(c, this));
        this._collapseButton = this._el.find('[data-behaviour="collapse-tree"]');

        this._collapseButton.on('click', this.closeAll.bind(this));

        for (let key in this._collections) {
            const collection = this._collections[key];
            if (collection.containsCurrentItem()) {
                this._state.push(collection.id);
            }
        }

        this._state = $.unique(this._state);
        this._applyState();

        events.trigger('scroll-sidebar');
        events.on('main-content-preload', (e, url) => {
            this.selectItem(getTreeUrl(url));
        });
    }

    getElement() {
        return this._el;
    }

    selectItem(url) {
        const handle = getHandleFromUrl(url);
        if (this._el.parents('[data-role="variant-panel"]').length) {
            this._el.find(`.Tree-item.is-current`).removeClass('is-current');
        } else {
            this._el
                .find(`.Tree-item.is-current > .Tree-entityLink:not([data-handle="${handle}"])`)
                .parent()
                .removeClass('is-current');
        }

        this._el.find(`[href="${url}"]`).parent().addClass('is-current');
    }

    _applyState() {
        for (let key in this._collections) {
            const collection = this._collections[key];
            if (this._state.indexOf(collection.id) > -1) {
                collection.open(true);
            } else {
                collection.close(true);
            }
        }
        this._updateCollapseButtonVisibility();
    }

    saveState() {
        this._state = this._collections.filter((c) => c.isOpen).map((c) => c.id);
        storage.set(`tree.${this._id}.state`, this._state, 'session');
        this._updateCollapseButtonVisibility();
    }

    closeAll() {
        this._collections.forEach((collection) => {
            collection.close();
        });
        this._updateCollapseButtonVisibility();
    }

    _updateCollapseButtonVisibility() {
        if (this._collections.some((c) => c.isOpen)) {
            this._collapseButton.removeAttr('hidden');
        } else {
            this._collapseButton.attr('hidden', true);
        }
    }
}

export class TreeCollection {
    constructor(el, tree) {
        this._tree = tree;
        this._el = $(el);
        this._toggle = this._el.find('> [data-role="toggle"]');
        this._itemsWrapper = this._el.find('[data-role="items"]:not(> [data-behaviour] [data-role="items"])');
        this._isOpen = true;
        this._toggle.on('click', this.toggle.bind(this));
    }

    get id() {
        return this._el[0].id;
    }

    get isOpen() {
        return this._isOpen;
    }

    containsCurrentItem() {
        return !!this._itemsWrapper.find('[data-state="current"]').length;
    }

    open(silent) {
        this._el.removeClass('is-closed');
        this._toggle.attr('aria-expanded', 'true');
        this._isOpen = true;
        if (!silent) this._tree.saveState();
    }

    close(silent) {
        this._el.addClass('is-closed');
        this._toggle.attr('aria-expanded', 'false');
        this._isOpen = false;
        if (!silent) this._tree.saveState();
    }

    toggle() {
        this._isOpen ? this.close() : this.open();
        return false;
    }
}
