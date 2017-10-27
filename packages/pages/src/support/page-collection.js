const {Entity, EntityCollection, Collection} = require('@frctl/support');
const {isMatch, isString} = require('lodash');
const Page = require('./page');

class PageCollection extends EntityCollection {

  find(...args) {
    let page;
    if (isString(args[0]) && args.length === 1) {
      /**
       * Look up by page ID
       */
      page = super.find('id', args[0]);
    }
    if (!page && args.length >= 2) {
      /**
       * Look up by route
       */
      page = this.findByRoute(...args);
    }
    if (page) {
      return page;
    }
    return super.find(...args);
  }

  findByRoute(routeName, target) {
    return this._items.filter(page => page.route === routeName).find(page => {
      if (Entity.isEntity(target) && Entity.isEntity(page.target)) {
        return target.uuid === page.target.uuid;
      }
      return isMatch(page.target, target);
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
