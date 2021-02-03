'use strict';

const _ = require('lodash');
const React = require('react');
const ReactDOM = require('react-dom/server');

const { Adapter, utils } = require('@frctl/core');

const clearModule = require('./clear-module');

/*
 * React Adapter
 * -------------
 */
class ReactAdapter extends Adapter {
    constructor(source, app, options) {
        super(null, source);
        this._app = app;

        if (options.renderMethod == 'renderToString') {
            this._renderMethod = ReactDOM.renderToString;
        } else {
            this._renderMethod = ReactDOM.renderToStaticMarkup;
        }

        this.options = options;
        this.nameCache = {};

        this.on('view:added', (view) => {
            // ensure that all component templates are required by this adapter first
            const component = requireModule(view.path);
            this.nameCache[view.handle] = component.name;
        });

        this.on('view:removed', (view) => {
            // remove from cache if component is deleted
            clearModule(view.path);
            delete this.nameCache[view.handle];
        });
        this.on('view:updated', (view) => {
            // update cache if component is updated
            clearModule(view.path);
            const component = requireModule(view.path);
            this.nameCache[view.handle] = component.name;
        });
    }

    getWrapperComponent(component) {
        if (typeof component === 'string' && component.startsWith('@')) {
            const comp = this._app.components.flatten().find(component);

            if (comp) {
                return requireModule(comp.viewPath);
            } else {
                console.error(`${component} not found!`);
            }
        }

        return component;
    }

    renderParentElements(children) {
        if (this.options.wrapperElements.length) {
            return this.options.wrapperElements.reverse().reduce((currentElement, wrapperObject) => {
                const wrapperComponent = this.getWrapperComponent(wrapperObject.component);

                return React.createElement(wrapperComponent, {
                    ...wrapperObject.props,
                    children: currentElement,
                });
            }, children);
        }

        return children;
    }

    render(path, str, context, meta = {}) {
        setEnv('_self', meta.self, context);
        setEnv('_target', meta.target, context);
        setEnv('_env', meta.env, context);
        setEnv('_config', this._app.config(), context);

        const component = requireModule(path);

        if (this.options.ssr || meta.env.ssr) {
            const element = React.createElement(component, context);
            const parentElements = this.renderParentElements(element);
            const html = this._renderMethod(parentElements);

            return Promise.resolve(html);
        }

        return Promise.resolve('');
    }

    renderLayout(path, str, context, meta = {}) {
        const target = {
            ...meta.target,
            componentName: this.nameCache[`@${meta.target.handle}`],
        };
        setEnv('_self', meta.self, context);
        setEnv('_target', target, context);
        setEnv('_env', meta.env, context);
        setEnv('_config', this._app.config(), context);

        const component = requireModule(path);
        const element = React.createElement(component, context);
        // DOCTYPE is not allowed to be a part of a React component, so it must be prepended here.
        const html = '<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(element);

        return Promise.resolve(html);
    }
}

/**
 * set environment variables
 * @param {[type]} key     [description]
 * @param {[type]} value   [description]
 * @param {[type]} context [description]
 * @returns {void}
 */
function setEnv(key, value, context) {
    if (_.isUndefined(context[key]) && !_.isUndefined(value)) {
        context[key] = value;
    }
}

const DEFAULT_OPTIONS = {
    renderMethod: 'renderToString',
    ssr: true,
    wrapperElements: [],
    babelOptions: {
        presets: ['@babel/preset-react', '@babel/preset-env'],
    },
};

/*
 * Adapter factory
 */
module.exports = function (config = {}) {
    return {
        register(source, app) {
            const options = utils.defaultsDeep(config, DEFAULT_OPTIONS);

            require('@babel/register')(options.babelOptions);

            return new ReactAdapter(source, app, options);
        },
    };
};

const requireModule = (path) => {
    let component = require(path);

    return component.default || component;
};
