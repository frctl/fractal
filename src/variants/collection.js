'use strict';

const Promise    = require('bluebird');
const Path       = require('path');
const co         = require('co');
const _          = require('lodash');
const console    = require('../console');
const Variant    = require('./variant');
const Entities   = require('../entities');

module.exports = class VariantCollection extends Entities {

    constructor(opts, items) {
        super(opts, items);
    }

    default() {
        return this.find('name', this.parent.defaultName);
    }

    getCollatedContentSync() {
        return (this.toArray().map(variant => {
            const content = variant.getContentSync();
            const collator = this.parent.source.setting('collator');
            return _.isFunction(this.collator) ? this.collator(content, variant) : content;
        })).join('\n');
    }

    getCollatedContext() {
        let collated = {};
        this.toArray().forEach(variant => {
            collated[`@${variant.handle}`] = variant.context;
        });
        return collated;
    }

    static *create(component, defaultView, configured, views, opts) {

        configured   = configured || [];
        views        = views || [];
        let variants = [];
        const source = component.source;
        const assets = component.assets();

        // first figure out if we need a 'default' variant.
        const hasDefaultConfigured = _.find(configured, ['name', component.defaultName]);

        function isRelated(variantHandle) {
            return function (file) {
                if (file.name.includes(source.setting('splitter'))) {
                    return file.name === variantHandle;
                }
                return true;
            };
        }

        if (!hasDefaultConfigured) {
            variants.push(new Variant({
                name:      component.defaultName,
                handle:    `${component.handle}${source.setting('splitter')}${component.defaultName}`.toLowerCase(),
                view:      opts.view,
                viewPath:  Path.join(opts.dir, opts.view),
                dir:       opts.dir,
                isDefault: true,
                isHidden: false,
                parent:    component,
                order:     1
            }, defaultView, assets));
        }

        let configuredVars = yield configured.map(co.wrap(function* (conf, i) {
            let viewFile = null;
            if (_.isUndefined(conf.name)) {
                console.error(`Could not create variant of ${component.handle} - 'name' value is missing`);
                return null;
            }
            const p = _.defaults(conf, {
                dir:    opts.dir,
                parent: component
            });
            if (!p.view) {
                // no view file specified
                const viewName = `${opts.viewName}${source.setting('splitter')}${p.name}`.toLowerCase();
                viewFile       = _.find(views, f => f.name.toLowerCase() === viewName);
                p.view         = viewFile ? viewFile.base : opts.view;
            }
            viewFile    = viewFile || defaultView;
            p.isDefault = (p.name === component.defaultName);
            p.order     = conf.order || p.isDefault ? 1 : i + (hasDefaultConfigured ? 1 : 2);
            p.viewPath  = Path.join(p.dir, p.view);
            p.handle    = `${component.handle}${source.setting('splitter')}${p.name}`.toLowerCase();
            p.isHidden  = _.isUndefined(conf.hidden) ? viewFile.isHidden : conf.hidden;
            if (p.notes) {
                p.notes = yield opts.source._app.docs.renderString(p.notes);
            }
            return new Variant(p, viewFile, assets.filter(isRelated(p.handle)));

        }));

        variants = variants.concat(configuredVars);

        const usedViews = variants.map(v => v.view);

        views.filter(f => !_.includes(usedViews, f.base)).forEach(viewFile => {
            const name = viewFile.name.split(source.setting('splitter'))[1];
            const p = {
                name:     name.toLowerCase(),
                handle:   `${component.handle}${source.setting('splitter')}${name}`.toLowerCase(),
                view:     viewFile.base,
                viewPath: viewFile.path,
                order:    viewFile.order,
                dir:      opts.dir,
                parent:   component,
                isHidden: viewFile.isHidden
            };
            variants.push(
                new Variant(p, viewFile, assets.filter(isRelated(p.handle)))
            );
        });

        return new VariantCollection({
            parent: component,
        }, _.orderBy(yield variants, ['order', 'name']));
    }

};
