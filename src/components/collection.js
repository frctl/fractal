'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const Entities = require('../entities');

module.exports = class ComponentCollection extends Entities {

    constructor(props, items) {
        super(props, items);
        this.isCollated = props.collated || false;
        this.collator = props.collator || function(markup, item){ return `<!-- Start: @${item.handle} -->\n${markup}\n<!-- End: @${item.handle} -->\n` };
        this._status  = props.status  || this._parent._status;
        this._preview = props.preview || this._parent._preview;
        this._display = props.display || this._parent._display;
        this._tags    = props.tags    || this._parent._tags;
    }

    find() {
        return this._source.find.apply(this, arguments);
    }

    components() {
        return super.entities();
    }

    variants() {
        return this._source.variants.apply(this, arguments);
    }

    get tags() {
        return _.uniq(_.concat(this._tags, this._parent.tags));
    }

    renderCollated(layout)  {
        const items = this.flattenDeep().items().map(item => {
            return this._source.render(item).then(markup => {
                return {
                    markup: markup,
                    item: item
                }
            });
        });
        const rendered = Promise.all(items).then(items => {
            return items.map(i => {
                if (_.isFunction(this.collator)){
                    return this.collator(i.markup, i.item);
                };
                return i.markup;
            }).join('\n');
        });
        if (layout && this._preview) {
            return this._source.renderContentInPreview(this._preview, rendered);
        }
        return rendered;
    }

    getContent(useAsync){
        const items = this.flattenDeep().items();
        if (useAsync) {
            return Promise.all(items.map(i => {
                return i.getContent(true).then(c => {
                    if (_.isFunction(this.collator)) {
                        return this.collator(c, i);
                    }
                    return c;
                });
            })).then(i => i.join('\n'));
        } else {
            return items.map(i => {
                if (_.isFunction(this.collator)) {
                    return this.collator(i.content, i);
                }
                return i.content;
            }).join('\n');
        }
    }

    collatedContext(){
        const items = this.flattenDeep().items();
        const context = [];
        items.forEach(i => context.push(i.context));
        return context;
    }

    get content(){
        return this.getContent();
    }

};
