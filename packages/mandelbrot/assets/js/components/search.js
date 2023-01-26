'use strict';

import Mark from 'mark.js';

export default class Search {
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
                this._input.val('').trigger('input').trigger('focus');
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

        this._marker.mark(key, {
            done: () => {
                this._trees.forEach((tree) => {
                    const $treeGroup = tree._el.parent('.Navigation-group');

                    $treeGroup.removeClass('has-search-results');

                    if (!tree._el.has('mark').length && !!key) {
                        $treeGroup.attr('hidden', true);
                    } else {
                        $treeGroup.removeAttr('hidden');
                        if (key) {
                            $treeGroup.addClass('has-search-results');
                        }

                        this.search(tree._el.children('ul'), key, tree._collections);
                    }
                });
            },
        });
    }

    search(list, key, collections) {
        const items = $(list).children('li');

        items.each((_index, item) => {
            const $li = $(item);
            const childrenWithTags = $li.find('[data-tags]');
            const tagAttributes = childrenWithTags.length > 0 ? childrenWithTags.attr('data-tags') : '';
            const tagAttributesMatch = tagAttributes.toUpperCase().indexOf(key) !== -1;

            if (
                // Always show item with match
                $li.has('mark').length ||
                // When the direct parent collection label matches
                $li.closest('.Tree-collection').find('> .Tree-collectionLabel').has('mark').length ||
                // When the root collection label matches
                $li.parents('.Tree').find('.Tree-title').has('mark').length ||
                tagAttributesMatch
            ) {
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
