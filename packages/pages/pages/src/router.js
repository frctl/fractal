const {forEach, isPlainObject, isString, isObjectLike, get, isFunction, trim, cloneDeep, has} = require('lodash');
const {assert} = require('check-types');
const pupa = require('pupa');
const {File} = require('@frctl/support');
const {defaultsDeep, removeExt, permalinkify} = require('@frctl/utils');
const {Collection} = require('@frctl/support');
const Page = require('./support/page');
const PageCollection = require('./support/page-collection');

const _pages = new WeakMap();

class Router {

  constructor() {
    _pages.set(this, []);
  }

  addRoute(builder, collections, app) {
    const pages = Router.buildPages(builder, collections, app);
    for (const page of pages) {
      // Router.validatePage(page);
      _pages.get(this).push(page);
    }
    return this;
  }

  getPages() {
    // TODO: check names are all unique
    return PageCollection.from(_pages.get(this));
  }

  static buildPages(builder, collections, app, parent) {
    let pages = [];
    if (!builder) {
      return pages;
    }
    const routeBuilder = isFunction(builder) ? builder : Router.createBuilder(builder);
    const routes = routeBuilder(collections, parent, app);

    for (const route of routes) {
      let page = {};
      const subRoutes = route.children || {};

      delete route.collection;

      if (route.template) {
        /*
         * Use template frontmatter data with route data as a fallback
         */
        const tpl = route.template;
        const config = tpl.config || {};
        page = defaultsDeep(config, route);
        page.render = route.render === false ? false : true;
        page.data = Object.assign({}, route.data || {}, config.data || {});
      } else {
        Object.assign(page, route);
        page.render = false;
      }

      page.data = page.data || {};

      page.target = Router.resolveTarget(page.target);
      page.data[page.target.name] = page.target.entity;

      page.permalink = Router.resolvePermalink(page.permalink, page.target, parent, app.config.pick('indexes','ext'));

      const fallbackName = trim(page.permalink, '/').replace(/\//g,'-').replace(/\./g,'-');
      page.name = Router.resolveName(page.name, page.target, parent, fallbackName);

      page.contents = Router.resolveContents(page.template, page.contents, page.target);

      page.parent = parent ? parent.name : undefined;
      page.children = [];

      page = Page.from(page);

      Router.validatePage(page);

      /*
       * Build out child pages, if specified in route
       */
      const children = Router.resolveChildren(subRoutes, collections, app, page);
      page.children = children.map(child => child.name);
      pages = pages.concat(page, ...children);
    }

    return pages;
  }

  static createBuilder(config = {}) {
    if (isString(config)) {
      config = {
        collection: config
      };
    }

    return function(collections, parent, app){

      config = cloneDeep(config);

      if (config.template) {
        config.template = get(collections, 'site.templates', []).find(config.template);
        if (!config.template) {
          throw new Error(`Could not find template (looked for '${config.template}') [template-not-found]`);
        }
      }

      let collection = Collection.from([{}]);
      if (config.target && !isString(config.target)) {
        collection = Collection.from([config.target])
      } else if (config.collection) {
        if (typeof isString(config.collection)) {
          collection = get(collections, config.collection);
          if (!collection) {
            throw new Error(`Could not find collection '${config.collection}' [collection-not-found]`);
          }
        } else if (Collection.isCollection(config.collection)) {
          collection = config.collection;
        }
        if (config.filter) {
          collection = collection.filter(config.filter);
        }
      }

      config.collection = collection;

      return collection.mapToArray(target => {

        const props = cloneDeep(config);

        if (isString(props.target)) {
          props.target = {
            name: props.target,
            entity: target
          };
        } else {
          props.target = {
            name: 'target',
            entity: target
          };
        }

        if (File.isFile(target)) {
          if (!props.template && target.type === 'template') {
            props.template = target;
          }
          if (!props.template && !props.contents) {
            props.contents = target.contents;
          }
        }

        return props;
      });
    }
  }

  static resolveChildren(subRoutes, collections, app, parent){
    let children = [];
    forEach(subRoutes, builder => {
      const childCollections = Object.assign({}, collections, {[parent.target.name]: parent.target.entity, parent});
      children = children.concat(...Router.buildPages(builder, childCollections, app, parent));
    });
    return children;
  }

  static resolveName(name, target, parent, fallback){
    if (isFunction(name)) {
      name = name(target.entity, parent);
    } else if (isString(name)) {
      const props = {[target.name]: target.entity, parent};
      return pupa(parent ? `${parent.name}-${name}` : name, props);
    }
    return name || fallback;
  }

  static resolvePermalink(permalink, target, parent, opts = {}) {

    if (!permalink && File.isFile(target.entity)) {
      permalink = target.entity.permalink || target.entity.relative;
    }

    if (isFunction(permalink)) {
      permalink = permalink(target.entity, parent);
    } else if (isString(permalink)) {
      const props = {[target.name]: target.entity, parent};
      if (!parent || permalink.startsWith('/')) {
        permalink = pupa(permalink, props);
      } else {
        permalink = pupa(`${removeExt(parent.permalink)}/${permalink}`, props);
      }
    }

    assert.string(permalink, `Router.resolvePermalink - permalink must resolve to a string [permalink-invalid]`);

    return permalinkify(permalink, opts);
  }

  static resolveTarget(target) {
    if (isObjectLike(target) && !(target.name && target.entity)) {
      target = {
        name: 'target',
        entity: target
      };
    }

    if (!isPlainObject(target) || !(target.name && target.entity)) {
      throw new TypeError(`Router.resolveTarget - invalid route.target property [target-invalid]`);
    }
    return target;
  }

  static resolveContents(template, contents, target){
    assert.maybe.instance(template, File, `Router.resolveContents - template must be a File instance [template-invalid]`);
    if (contents) {
      return contents;
    }
    if (template) {
      return template.contents;
    }
    if (File.isFile(target)) {
      return target.contents;
    }
  }

  static validatePage(page) {
    assert.string(page.name, `Router.validatePage - page.name must be a string [name-invalid]`);
    assert.string(page.permalink, `Router.validatePage - page.permalink must be a string [permalink-invalid]`);
    if (page.template) {
      assert.instance(page.template, File, `Router.validatePage - page.template must be a File instance [template-invalid]`);
    } else {
      if (!page.contents) {
        throw new Error(`A page must have either a 'template' or 'contents' property defined by it\'s route`);
      }
    }

    // TODO: target should have key + value props
    assert.maybe.object(page.data, `Router.validatePage - page.data must be an object [data-invalid]`);
    return true;
  }

}

module.exports = Router;
