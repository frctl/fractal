'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const Path = require('path');
const co = require('co');
const Variant = require('./variant');
const Log = require('@frctl/core').Log;
const utils = require('@frctl/core').utils;
const EntityCollection = require('@frctl/core').entities.Collection;

module.exports = class VariantCollection extends EntityCollection {
    constructor(config, items, parent) {
        super(config.name, config, items, parent);
    }

    default() {
        return this.find('name', this.parent.defaultName);
    }

    getCollatedContent() {
        if (this._hasSharedView()) {
            return this.default().getContent();
        }
        return Promise.all(
            this.toArray().map((variant) => {
                return variant.getContent().then((content) => {
                    return `<!-- ${variant.label} -->\n${content.trim()}\n`;
                });
            })
        ).then((contents) => contents.join('\n'));
    }

    getCollatedContentSync() {
        if (this._hasSharedView()) {
            return this.default().getContentSync();
        }
        return this.toArray()
            .map((variant) => {
                const content = variant.getContentSync();
                return `<!-- ${variant.label} -->\n${content.trim()}\n`;
            })
            .join('\n');
    }

    getCollatedContext() {
        const collated = {};
        this.toArray().forEach((variant) => {
            collated[`${variant.label}`] = variant.getResolvedContext();
        });
        return Promise.props(collated);
    }

    get references() {
        if (this._hasSharedView()) {
            return this.default().references;
        }
        return _.uniq(_.flatten(this.toArray().map((variant) => variant.references)));
    }

    get referencedBy() {
        return _.uniqBy(_.flatten(this.toArray().map((variant) => variant.referencedBy)), 'id');
    }

    _hasSharedView() {
        const view = this.default().view;
        for (const v of this.toArray()) {
            if (view !== v.view) {
                return false;
            }
        }
        return true;
    }

    static *create(component, defaultView, configured, views, readmes, opts) {
        configured = configured || [];
        views = views || [];
        readmes = readmes || [];
        let variants = [];
        const source = component.source;
        const resources = component.resources();

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

        function findReadme(name) {
            const readmeName = `${opts.viewName}${source.get('splitter')}${name}.${source.get(
                'files.notes'
            )}.md`.toLowerCase();

            return _.find(readmes, (f) => f.name.toLowerCase() === readmeName);
        }

        if (!hasDefaultConfigured) {
            variants.push(
                Variant.create(
                    {
                        name: component.defaultName,
                        handle: `${component.handle}${source.get('splitter')}${component.defaultName}`.toLowerCase(),
                        view: opts.view,
                        viewPath: Path.join(opts.dir, opts.view),
                        dir: opts.dir,
                        isDefault: true,
                        isHidden: false,
                        order: 1,
                        readme: findReadme(component.defaultName),
                    },
                    defaultView,
                    resources,
                    component
                )
            );
        }

        const configuredVars = yield configured.map(
            co.wrap(function (conf, i) {
                let viewFile = null;
                if (_.isUndefined(conf.name)) {
                    Log.error(`Could not create variant of ${component.handle} - 'name' value is missing`);
                    return null;
                }
                conf.name = utils.slugify(conf.name.toLowerCase());

                const p = _.defaults(conf, {
                    dir: opts.dir,
                    parent: component,
                });
                if (!p.view) {
                    // no view file specified
                    const viewName = `${opts.viewName}${source.get('splitter')}${p.name}`.toLowerCase();
                    viewFile = _.find(views, (f) => f.name.toLowerCase() === viewName.toLowerCase());
                    p.view = viewFile ? viewFile.base : opts.view;
                } else {
                    viewFile = _.find(views, (f) => f.base.toLowerCase() === p.view.toLowerCase());
                }
                viewFile = viewFile || defaultView;
                p.isDefault = p.name === component.defaultName;
                p.order = conf.order || p.isDefault ? 1 : i + (hasDefaultConfigured ? 1 : 2);
                p.viewPath = Path.join(p.dir, p.view);
                p.handle = `${component.handle}${source.get('splitter')}${p.name}`.toLowerCase();
                p.isHidden = _.isUndefined(conf.hidden) ? viewFile.isHidden : conf.hidden;
                p.readme = findReadme(p.name);

                return Variant.create(p, viewFile, resources.filter(isRelated(p.handle)), component);
            })
        );

        variants = variants.concat(configuredVars);

        const usedViews = variants.map((v) => v.view);

        views
            .filter((f) => !_.includes(usedViews, f.base))
            .forEach((viewFile) => {
                const name = utils.slugify(viewFile.name.split(source.get('splitter'))[1]).toLowerCase();
                const p = {
                    name: name,
                    handle: `${component.handle}${source.get('splitter')}${name}`,
                    view: viewFile.base,
                    viewPath: viewFile.path,
                    order: viewFile.order,
                    dir: opts.dir,
                    isHidden: viewFile.isHidden,
                    readme: findReadme(name),
                };
                variants.push(Variant.create(p, viewFile, resources.filter(isRelated(p.handle)), component));
            });

        return new VariantCollection(
            {
                name: `${component.name}-variants`,
            },
            _.orderBy(yield variants, ['order', 'name']),
            component
        );
    }
};
