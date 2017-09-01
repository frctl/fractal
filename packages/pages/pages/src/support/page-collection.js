const {Collection} = require('@frctl/support');
const {matches} = require('lodash');

class PageCollection extends Collection {

  find(...args) {
    if (args.length === 1 && typeof args[0] === 'string') {
      return super.find('id', args[0]);
    }
    return super.find(...args);
  }

  findByRoute(routeName, target) {
    return this._items.find(page => {
      return page.route === routeName && matches(page.target, target);
    });
  }

  filterByTag(tagName) {
    const items = this._items.filter(page => {
      return Array.isArray(page.tags) && page.tags.includes(tagName);
    });
    return new PageCollection(items);
  }

}

module.exports = PageCollection;
