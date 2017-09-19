const {EntityCollection, Collection} = require('@frctl/support');
const {isMatch} = require('lodash');
const Page = require('./page');

class PageCollection extends EntityCollection {

  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('id', args[0]);
    }
    return super.find(...args);
  }

  findByRoute(routeName, target) {
    return this._items.find(page => {
      return page.route === routeName && isMatch(page.target, target);
    });
  }

  filterByTag(tagName) {
    const items = this._items.filter(page => {
      return Array.isArray(page.tags) && page.tags.includes(tagName);
    });
    return new PageCollection(items);
  }

  get [Symbol.toStringTag]() {
    return 'PageCollection';
  }

}

Collection.addEntityDefinition(Page, PageCollection);
Collection.addTagDefinition('PageCollection', PageCollection);

module.exports = PageCollection;
