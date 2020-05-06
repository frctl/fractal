'use strict';

const $ = global.jQuery;
const Mark = require('mark.js');

class Search {
    constructor(el, trees) {
        this._el = $(el);
        this._trees = trees;
        this._input = this._el.find('[data-role="input"]');
        this._clearButton = this._el.find('[data-behaviour="clear-search"]');
        this._marker = new Mark($.map(this._trees, (t) => t.getElement()[0]));

        this._el.on('submit', (event) => {
            event.preventDefault();
        });

        this._input.on('input', this.handleInput.bind(this));

        if (this._clearButton) {
            this._clearButton.on('click', () => {
                this._input.val('').trigger('input');
            });
        }
    }

    handleInput(event) {
        const key = event.currentTarget.value.toUpperCase();

        if (this._clearButton) {
            if (key) {
                this._clearButton.removeAttr('hidden');
            } else {
                this._clearButton.attr('hidden', true);
            }
        }

        this._marker.unmark();
        this._marker.mark(key);

        this._trees.forEach((tree) => {
            this.search(tree._el.children('ul'), key, tree._collections);

            // If no item match in the group, hide it completely
            const $treeEl = $(tree._el);
            const $treeGroup = $treeEl.parent('.Navigation-group');

            if ($treeEl.find('> ul > li:not([hidden])').length === 0) {
                $treeGroup.attr('hidden', true);
            } else {
                $treeGroup.removeAttr('hidden');
            }
        });
    }

    search(list, key, collections) {
        const items = $(list).children('li');

        items.each((_index, item) => {
            const $li = $(item);
            const collectionLabel = $li.parents('.Tree-collection').find('> .Tree-collectionLabel').text();
            const itemLabel = $li.text();
            const childrenWithTags = $li.find('[data-tags]');
            const tagAttributes = childrenWithTags.length > 0 ? childrenWithTags.attr('data-tags') : '';

            const collectionLabelMatches = collectionLabel.toUpperCase().indexOf(key) !== -1;
            const itemLabelMatches = itemLabel.toUpperCase().indexOf(key) !== -1;
            const tagAttributesMatch = tagAttributes.toUpperCase().indexOf(key) !== -1;

            if (collectionLabelMatches || itemLabelMatches || tagAttributesMatch) {
                $li.parents('.Tree-collection').each((_index, parent) => {
                    const collection = collections.find((c) => c._el[0] === parent);

                    if (key.length || collection.containsCurrentItem()) {
                        collection.open(true);
                    } else {
                        collection.close(true);
                    }
                });
                $li.removeAttr('hidden');

                // recursive search inside nested collections
                this.search($li.children('ul'), key, collections);
            } else {
                $li.attr('hidden', true);
            }
        });
    }
}

module.exports = Search;
