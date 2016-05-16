'use strict';

const _                = require('lodash');
const Path             = require('path');
const co               = require('co');
const Variant          = require('./variant');
const Log              = require('../../core/log');
const utils            = require('../../core/utils');
const EntityCollection = require('../../core/entities/collection');

module.exports = class VariantCollection extends EntityCollection {

    constructor(config, items, parent){
        super(config.name, config, items, parent);

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
                if (file.name.includes(source.get('splitter'))) {
                    return file.name === variantHandle;
                }
                return true;
            };
        }

        if (!hasDefaultConfigured) {
            variants.push(new Variant({
                name:      component.defaultName,
                handle:    `${component.handle}${source.get('splitter')}${component.defaultName}`.toLowerCase(),
                view:      opts.view,
                viewPath:  Path.join(opts.dir, opts.view),
                dir:       opts.dir,
                isDefault: true,
                isHidden: false,
                order:     1
            }, defaultView, assets, component));
        }

        let configuredVars = yield configured.map(co.wrap(function* (conf, i) {
            let viewFile = null;
            if (_.isUndefined(conf.name)) {
                Log.error(`Could not create variant of ${component.handle} - 'name' value is missing`);
                return null;
            }
            conf.name = utils.slugify(conf.name.toLowerCase());

            const p = _.defaults(conf, {
                dir:    opts.dir,
                parent: component
            });
            if (!p.view) {
                // no view file specified
                const viewName = `${opts.viewName}${source.get('splitter')}${p.name}`.toLowerCase();
                viewFile       = _.find(views, f => f.name.toLowerCase() === viewName);
                p.view         = viewFile ? viewFile.base : opts.view;
            } else {
                viewFile    = _.find(views, f => f.base.toLowerCase() === p.view);
            }
            viewFile    = viewFile || defaultView;
            p.isDefault = (p.name === component.defaultName);
            p.order     = conf.order || p.isDefault ? 1 : i + (hasDefaultConfigured ? 1 : 2);
            p.viewPath  = Path.join(p.dir, p.view);
            p.handle    = `${component.handle}${source.get('splitter')}${p.name}`.toLowerCase();
            p.isHidden  = _.isUndefined(conf.hidden) ? viewFile.isHidden : conf.hidden;

            return new Variant(p, viewFile, assets.filter(isRelated(p.handle)), component);

        }));

        variants = variants.concat(configuredVars);

        const usedViews = variants.map(v => v.view);

        views.filter(f => !_.includes(usedViews, f.base)).forEach(viewFile => {
            const name = utils.slugify(viewFile.name.split(source.get('splitter'))[1]).toLowerCase();
            const p = {
                name:     name,
                handle:   `${component.handle}${source.get('splitter')}${name}`,
                view:     viewFile.base,
                viewPath: viewFile.path,
                order:    viewFile.order,
                dir:      opts.dir,
                isHidden: viewFile.isHidden
            };
            variants.push(
                new Variant(p, viewFile, assets.filter(isRelated(p.handle)), component)
            );
        });

        return new VariantCollection({
            name: `${component.name}-variants`
        }, _.orderBy(yield variants, ['order', 'name']), component);
    }

}
