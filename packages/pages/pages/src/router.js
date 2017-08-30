const {forEach, isPlainObject, isString, isObjectLike, get, isFunction, trim, uniqBy} = require('lodash');
const {assert} = require('check-types');
const pupa = require('pupa');
const {File} = require('@frctl/support');
const {defaultsDeep, removeExt, permalinkify, cloneDeep} = require('@frctl/utils');
const {Collection} = require('@frctl/support');
const Page = require('./support/page');
const PageCollection = require('./support/page-collection');

const _pages = new WeakMap();

class Router {

  constructor() {
    _pages.set(this, []);
  }

  addRoute(builder, collections, app) {
    const newPages = Router.buildPages(builder, collections, app);
    const pages = uniqBy(_pages.get(this).concat(newPages), 'permalink');
    _pages.set(this, pages);
    return this;
  }

  getPages() {
    return PageCollection.from(_pages.get(this));
  }

  static buildPages(builder, collections, app, parent) {
    if (!builder) {
      return [];
    }

    let pages = [];
    const routeBuilder = isFunction(builder) ? builder : Router.createBuilder(builder);
    const routes = routeBuilder(collections, parent, app);

    for (const route of routes) {
      let page = {};
      const subRoutes = route.children || {};

      delete route.collection;
      delete route.filter;

      if (route.template) {
        assert.instance(route.template, File, `Router.validatePage - page.template must be a File instance [template-invalid]`);
        const tpl = route.template;
        const config = tpl.config || {};
        page = defaultsDeep(config, route); // Use template frontmatter data with route data as a fallback
        page.render = route.render !== false;
      } else {
        Object.assign(page, route);
        page.render = false;
      }

      const target = Router.resolveTarget(page.target);
      page.target = target.entity;

      page[target.name] = target.entity;
      page.data = Router.resolveData(page.data, target);
      page.permalink = Router.resolvePermalink(page.permalink, target, parent, app.config.pick('indexes', 'ext'));
      page.contents = Router.resolveContents(page.template, page.contents, target);

      page.label = Router.resolveLabel(page.label, target, parent, page.target.label || page.target.name || page.target.stem);
      page.title = Router.resolveTitle(page.title, target, parent, page.label);

      const fallbackName = trim(page.permalink, '/').replace(/[/.]/g, '-');
      page.name = Router.resolveName(page.name || fallbackName, target, parent);

      page.parent = parent ? parent.name : undefined;
      page.children = [];

      page = Page.from(page);

      /*
       * Build out child pages, if specified in route
       */
      const children = Router.resolveChildren(subRoutes, target, collections, app, page);
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

    assert.object(config, `Router.createBuilder - route config must be object, string or function [builder-invalid]`);

    return function (collections, parent, app) {
      config = cloneDeep(config);

      if (config.template) {
        config.template = get(collections, 'site.templates', []).find(config.template);
        if (!config.template) {
          throw new Error(`Could not find template (looked for '${config.template}') [template-not-found]`);
        }
      }

      let collection = Collection.from([{}]);
      if (config.target && !isString(config.target)) {
        collection = Collection.from([config.target]);
      } else if (config.collection) {
        if (isString(config.collection)) {
          collection = get(collections, config.collection);
          if (!collection) {
            throw new Error(`Could not find collection '${config.collection}' [collection-not-found]`);
          }
        } else if (Collection.isCollection(config.collection)) {
          collection = config.collection;
        } else if (isFunction(config.collection)) {
          collection = Collection.from(config.collection(parent));
        }

        if (config.filter) {
          collection = collection.filter(config.filter);
        }
      }

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
    };
  }

  static resolveChildren(subRoutes, target, collections, app, parent) {
    let children = [];
    const childCollections = Object.assign({}, collections, {[target.name]: target.entity, parent});
    forEach(subRoutes, builder => {
      children = children.concat(...Router.buildPages(builder, childCollections, app, parent));
    });
    return children;
  }

  static resolveTitle(title, target, parent, fallback) {
    if (isFunction(title)) {
      title = title(target.entity, parent);
    } else if (isString(title)) {
      const props = {[target.name]: target.entity, parent};
      return pupa(title, props);
    }
    title = title || fallback;
    assert.string(title, `Router.resolveTitle - page.title must resolve to a string [title-invalid]`);
    return title;
  }

  static resolveLabel(label, target, parent, fallback) {
    if (isFunction(label)) {
      label = title(target.entity, parent);
    } else if (isString(label)) {
      const props = {[target.name]: target.entity, parent};
      return pupa(label, props);
    }
    label = label || fallback;
    assert.string(label, `Router.resolveLabel - page.label must resolve to a string [label-invalid]`);
    return label;
  }

  static resolveName(name, target, parent) {
    if (isFunction(name)) {
      name = name(target.entity, parent);
    } else if (isString(name)) {
      const props = {[target.name]: target.entity, parent};
      return pupa(parent ? `${parent.name}-${name}` : name, props);
    }
    assert.string(name, `Router.resolveName - page.name must resolve to a string [name-invalid]`);
    return name;
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

  static resolveContents(template, contents, target) {
    assert.maybe.instance(template, File, `Router.resolveContents - template must be a File instance [template-invalid]`);
    if (contents) {
      return contents;
    }
    if (template) {
      return template.contents;
    }
    if (File.isFile(target.entity)) {
      return target.entity.contents;
    }
    throw new Error(`Router.resolveContents - no valid route content found [contents-invalid]`);
  }

  static resolveData(data = {}, target) {
    assert.maybe.object(data, `Router.resolveData - data must be an object [data-invalid]`);
    data = data || {};
    data[target.name] = target.entity;
    return data;
  }

}

module.exports = Router;
