'use strict';

const $ = global.jQuery;

class Search {

    constructor(el, trees) {
        this._el = $(el);
        this._trees = trees;
        this._input = this._el.find('[data-role="input"]');

        this._el.on('submit', (event) => {
            event.preventDefault();
        })

        this._input.on('input', (event) => {
            const key = event.currentTarget.value.toUpperCase();

            trees.forEach((tree) => this.search(tree._el.children('ul'), key, tree._collections));
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
                if (key.length) {
                    $li.parents('.Tree-collection').each((_index, parent) => {
                        const collection = collections.find((c) => c._el[0] === parent);

                        collection.open();
                    });
                }
                $li.show();

                // recursive search inside nested collections
                this.search($li.children('ul'), key, collections);
            } else {
                $li.hide();
            }
        });
    }
}

module.exports = Search;
