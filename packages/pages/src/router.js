/* eslint max-params: "off" */

const {forEach, isPlainObject, isString, isObjectLike, get, isFunction, trim, uniqBy} = require('lodash');
const {assert} = require('check-types');
const pupa = require('pupa');
const pluralize = require('pluralize');
const {File, Collection} = require('@frctl/support');
const {defaultsDeep, removeExt, permalinkify, cloneDeep, slugify} = require('@frctl/utils');
const Page = require('./support/page');
const PageCollection = require('./support/page-collection');

const _pages = new WeakMap();

class Router {

  constructor() {
    _pages.set(this, []);
  }

  addRoute(routeName, builder, collections, opts) {
    const newPages = Router.buildPages(routeName, builder, collections, opts);
    const pages = uniqBy(_pages.get(this).concat(newPages), 'permalink');
    _pages.set(this, pages);
    return this;
  }

  getPages() {
    return PageCollection.from(_pages.get(this));
  }

  static buildPages(routeName, builder, collections, opts, parent) {
    if (!builder) {
      return [];
    }

    let pages = [];
    const routeBuilder = isFunction(builder) ? builder : Router.createBuilder(routeName, builder);
    const routes = routeBuilder(collections, opts, parent);

    for (const route of routes) {
      let props = {};
      const subRoutes = route.children || {};

      delete route.collection;
      delete route.filter;

      if (route.template) {
        assert.instance(route.template, File, `Router.validatePage - props.template must be a File instance [template-invalid]`);
        const tpl = route.template;
        const config = tpl.config || {};
        props = defaultsDeep(config, route); // Use template frontmatter data with route data as a fallback
        props.render = route.render !== false;
      } else {
        Object.assign(props, route);
        props.render = false;
      }

      props.route = parent ? `${parent.route}.${routeName}` : routeName;

      const target = Router.resolveTarget(props.target);
      props.target = target.entity;
      props.targetAlias = target.name;
      props.route = routeName;
      props.data = Router.resolveData(props.data, target, parent, collections);
      props.permalink = Router.resolvePermalink(props.permalink, target, parent, opts);
      props.contents = Router.resolveContents(props.template, props.contents, target);
      props.tags = props.tags || [];
      props.label = Router.resolveLabel(props.label, target, parent, props.target.label || props.target.name || props.target.stem);
      props.title = Router.resolveTitle(props.title, target, parent, props.label);

      const fallbackId = slugify(trim(props.permalink, '/').replace(/[/.]/g, '-'));
      props.id = Router.resolveId(props.id || fallbackId, target, parent);

      props.parent = parent ? parent.id : undefined;
      props.children = [];

      const page = Page.from(props);

      /*
       * Build out child pages, if specified in route
       */
      const children = Router.resolveChildren(routeName, subRoutes, target, collections, opts, page);
      page.children = children.map(child => child.id);
      pages = pages.concat(page, ...children);
    }

    return pages;
  }

  static createBuilder(routeName, config = {}) {
    if (isString(config)) {
      config = {
        collection: config
      };
    }

    assert.object(config, `Router.createBuilder - route config must be object, string or function [builder-invalid]`);

    return function (collections, opts, parent) {
      config = cloneDeep(config);

      if (config.template) {
        config.template = get(collections, 'site.templates', []).find(tpl => {
          return tpl.relative === config.template || tpl.relative.replace(tpl.extname, '') === config.template;
        });
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

        props.target = {
          name: isString(props.target) ? props.target : pluralize.singular(routeName),
          entity: target
        };

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

  static resolveChildren(routeName, subRoutes, target, collections, opts, parent) {
    let children = [];
    const childCollections = Object.assign({}, collections, {[target.name]: target.entity, parent});
    forEach(subRoutes, builder => {
      children = children.concat(...Router.buildPages(routeName, builder, childCollections, opts, parent));
    });
    return children;
  }

  static resolveTitle(title, target, parent, fallback) {
    if (isFunction(title)) {
      title = title(target.entity, parent);
    } else if (isString(title)) {
      const props = {target: target.entity, [target.name]: target.entity, parent};
      return pupa(title, props);
    }
    title = title || fallback;
    assert.string(title, `Router.resolveTitle - page.title must resolve to a string [title-invalid]`);
    return title;
  }

  static resolveLabel(label, target, parent, fallback) {
    if (isFunction(label)) {
      label = label(target.entity, parent);
    } else if (isString(label)) {
      const props = {target: target.entity, [target.name]: target.entity, parent};
      return pupa(label, props);
    }
    label = label || fallback;
    assert.string(label, `Router.resolveLabel - page.label must resolve to a string [label-invalid]`);
    return label;
  }

  static resolveId(id, target, parent) {
    if (isFunction(id)) {
      id = id(target.entity, parent);
    } else if (isString(id)) {
      const props = {target: target.entity, [target.name]: target.entity, parent};
      return pupa(parent ? `${parent.id}-${id}` : id, props);
    }
    assert.string(id, `Router.resolveId - page.id must resolve to a string [id-invalid]`);
    return id;
  }

  static resolvePermalink(permalink, target, parent, opts = {}) {
    if (!permalink && File.isFile(target.entity)) {
      permalink = target.entity.permalink || target.entity.relative;
    }

    if (isFunction(permalink)) {
      permalink = permalink(target.entity, parent);
    } else if (isString(permalink)) {
      const props = {target: target.entity, parent};
      props[target.name] = target.entity;
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

  static resolveData(data = {}, target, parent, collections) {
    if (isFunction(data)) {
      data = data(target, parent, collections);
    }
    assert.object(data, `Router.resolveData - data must be an object [data-invalid]`);
    return data;
  }

}

module.exports = Router;
