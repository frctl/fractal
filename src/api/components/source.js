'use strict';

const Promise = require('bluebird');
const Path = require('path');
const _ = require('lodash');
const co = require('co');
const fs = Promise.promisifyAll(require('fs'));
const anymatch = require('anymatch');
const Component = require('./component');
const ComponentCollection = require('./collection');
const File = require('../files/file');
const FileCollection = require('../files/collection');
const Data = require('../../core/data');
const frfs = require('../../core/fs');
const Log = require('../../core/log');
const resolver = require('../../core/resolver');
const EntitySource = require('../../core/entities/source');

module.exports = class ComponentSource extends EntitySource {

    constructor(app) {
        super('components', app);
    }

    resources() {
        let resources = [];
        for (const comp of this.flatten()) {
            resources = resources.concat(comp.resources().toArray());
        }
        return new FileCollection({}, resources);
    }

    components() {
        return super.entities();
    }

    getReferencesOf(target) {
        const refs = [];
        const handles = [];
        this.source.flatten().forEach(component => {
            if (component.id !== target.id) {
                for (const variant of component.variants()) {
                    if (variant.id !== target.id) {
                        for (const ref of variant.references) {
                            if (target.handle == ref.handle || target.alias == ref.handle) {
                                refs.push(variant.isDefault ? component : variant);
                                break;
                            }
                        }
                    }
                }
            }
        });
        return refs;
    }

    variants() {
        let items = [];
        for (const component of this.components()) {
            items = _.concat(items, component.variants().toArray());
        }
        return this.newSelf(items);
    }

    find() {
        if (this.size === 0 || arguments.length === 0) {
            return;
        }
        const args = Array.from(arguments);
        if (args.length == 1 && _.isString(args[0]) && !args[0].startsWith('@') && args[0].indexOf('.') !== -1) {
            return this.findFile(args[0]);
        }
        const isHandleFind = args.length == 1 && _.isString(args[0]) && args[0].startsWith('@');
        for (const item of this.items()) {
            if (item.isCollection) {
                const search = item.find.apply(item, args);
                if (search) return search;
            } else if (item.isComponent) {
                const matcher = isHandleFind ? this._makePredicate.apply(null, ['handle', args[0].replace('@', '')]) : this._makePredicate.apply(null, args);
                if (matcher(item)) return item;
            }
        }
        if (isHandleFind) {
            for (const item of this.entities()) {
                const variant = item.variants().find(args[0]);
                if (variant) return variant;
            }
        }
    }

    findFile(filePath) {
        let source = this;
        filePath = Path.resolve(filePath);
        if (this._fileTree) {
            function findFile(items) {
                for (const item of items) {
                    if (item.isFile && item.path === filePath) {
                        return new File(item, source.relPath);
                    } else if (item.isDirectory) {
                        const result = findFile(item.children);
                        if (result) {
                            return new File(result, source.relPath);
                        }
                    }
                }
            }

            return findFile(this._fileTree.children);
        }
    }

    resolve(context) {
        return resolver.context(context, this);
    }

    renderString(str, context, env) {
        return this.engine().render(null, str, context, {
            env: env || {},
        });
    }

    renderPreview(entity, preview, env) {
        preview = preview !== false ? preview : false;
        let context;
        if (entity.isComponent) {
            context = entity.variants().default().getContext();
        } else {
            context = entity.getContext();
        }
        return this.render(entity, context, env || {}, { preview: preview });
    }

    /**
     * Main render method. Accepts a component or variant
     * and renders them appropriately.
     *
     * Rendering a component results in the rendering of the components' default variant,
     * unless the collated option is 'true' - in this case it will return a collated rendering
     * of all its variants.
     *
     * @param {Component/Variant} entity
     * @param {Object} context
     * @param {Object} opts
     * @return {Promise}
     * @api public
     */

    render(entity, context, env, opts) {
        env = env || {};
        opts = opts || {};
        opts.preview = opts.preview || opts.useLayout || false;
        opts.collate = opts.collate || false;

        const self = this;

        if (!entity) {
            return Promise.reject(null);
        }
        if (_.isString(entity)) {
            const str = entity;
            if (entity.indexOf('@') === 0) {
                entity = this.find(entity);
                if (!entity) {
                    throw new Error(`Cannot find component ${str}`);
                }
            } else {
                return fs.readFileAsync(entity, 'utf8').then(content => {
                    return this.engine().render(entity, content, context, {
                        env: env,
                        self: {
                            path: entity,
                        },
                    });
                });
            }
        }

        return co(function* () {
            const source = yield self.load();
            let rendered;
            if (entity.isComponent || entity.isVariant) {
                if (entity.isComponent) {
                    if (entity.isCollated && opts.collate && entity.variants().size > 1) {
                        rendered = yield self._renderCollatedComponent(entity, env);
                    } else {
                        entity = entity.variants().default();
                        rendered = yield self._renderVariant(entity, context, env);
                    }
                } else {
                    rendered = yield self._renderVariant(entity, context, env);
                }
                if (opts.preview && entity.preview) {
                    const target = entity.toJSON();
                    target.component = target.isVariant ? entity.parent.toJSON() : target;
                    const layout = _.isString(opts.preview) ? opts.preview : entity.preview;
                    return yield self._wrapInLayout(target, rendered, layout, env);
                }
                return rendered;
            } else {
                throw new Error('Only components or variants can be rendered.');
            }
        });
    }

    *_renderVariant(variant, context, env) {
        const content = yield variant.getContent();
        return this.engine().render(variant.viewPath, content, context || variant.getContext(), {
            self: variant.toJSON(),
            env: env,
        });
    }

    *_renderCollatedComponent(component, env) {
        const target = component.toJSON();
        const items = yield component.variants().filter('isHidden', false).toArray().map(variant => {
            return this.render(variant, variant.getContext(), env).then(markup => {
                return {
                    markup: markup.trim(),
                    item: variant.toJSON()
                }
            });
        });

        if (!component.collator) {
            return items.map(i => i.markup).join('\n');
        }

        if (_.isFunction(component.collator)) {
            return items.map(i => component.collator(i.markup, i.item)).join('\n');
        }

        const collator = yield this._getWrapper(component.collator);

        if (!collator) {
            Log.warn(`Collator ${component.collator} not found.`);
            return items.map(i => i.markup).join('\n');
        }

        if (collator.viewPath === component.viewPath) {
            return items.map(i => i.markup).join('\n');
        }

        let context = _.defaults(collator.context, {
            _variants: items
        });

        return this.engine().render(collator.viewPath, collator.content, context, {
            target: target,
        });
    }

    *_wrapInLayout(target, content, identifier, env) {

        const layout = yield this._getWrapper(identifier);

        if (!layout) {
            Log.warn(`Preview layout ${identifier} not found. Rendering component without layout.`);
            return content;
        }

        if (layout.viewPath === target.viewPath) {
            return content;
        }

        let context = _.defaults(layout.context, {
            [this.get('yield')]: content
        });
        const renderMethod = (_.isFunction(this.engine().renderLayout)) ? 'renderLayout' : 'render';
        return this.engine()[renderMethod](layout.viewPath, layout.content, context, {
            self: layout.self,
            target: target,
            env: env,
        });
    }

    _appendEventFileInfo(file, eventData) {
        eventData = super._appendEventFileInfo(file, eventData);
        for (const test of ['isResource', 'isTemplate', 'isReadme', 'isView', 'isVarView', 'isWrapper']) {
            if (this[test](file)) {
                eventData[test] = true;
            }
        }
        return eventData;
    }

    *_getWrapper(indentifier) {

        if (_.isString(indentifier) && indentifier.startsWith('@')) {
            // looking for a component
            let entity = this.find(indentifier);
            if (!entity) {
                return;
            }
            if (entity.isComponent) {
                entity = entity.variants().default();
            }
            let context = entity.getContext();
            let content = yield entity.getContent();
            return {
                context: context,
                content: content,
                viewPath: entity.viewPath,
                self: entity.toJSON()
            }
        }

        if (_.isString(indentifier) && ! indentifier.startsWith('@')) {
            return frfs.find(indentifier).then(file => {
                file = new File(file);
                return file.getContent().then(content => ({
                    context: {},
                    content: content,
                    viewPath: file.viewPath,
                    self: file.toJSON()
                }));
            }).catch(err => {
                Log.warn(err);
                return undefined;
            });
        }

        if (_.get(indentifier, 'isFile')) {
            // using a file
            let content = yield indentifier.getContent();
            return {
                context: {},
                content: content,
                viewPath: indentifier.path,
                self: indentifier.toJSON()
            }
        }

    }

    isTemplate(file) {
        return this.isView(file) || this.isVarView(file);
    }

    isWrapper(file) {
        return this.isPreview(file) || this.isCollator(file);
    }

    isView(file) {
        return anymatch([
            `**/*${this.get('ext')}`,
            `!**/*${this.get('splitter')}*${this.get('ext')}`,
            `!**/*.${this.get('files.config')}.${this.get('ext')}`,
            `!**/${this.get('files.config')}.{js,json,yaml,yml}`
        ], this._getPath(file));
    }

    isVarView(file) {
        return anymatch(`**/*${this.get('splitter')}*${this.get('ext')}`, this._getPath(file));
    }

    isReadme(file) {
        return anymatch(`**/${this.get('files.notes')}.md`, this._getPath(file));
    }

    isPreview(file) {
        return anymatch([
            `**/${this.get('files.preview')}${this.get('ext')}`,
            `**/_${this.get('files.preview')}${this.get('ext')}`
        ], this._getPath(file));
    }

    isCollator(file) {
        return anymatch([
            `**/${this.get('files.collator')}${this.get('ext')}`,
            `**/_${this.get('files.collator')}${this.get('ext')}`
        ], this._getPath(file));
    }

    isResource(file) {
        return anymatch([
            '**/*.*',
            `!**/*${this.get('ext')}`,
            `!**/*.${this.get('files.config')}.{js,json,yaml,yml}`,
            `!**/${this.get('files.config')}.{js,json,yaml,yml}`,
            `!**/_${this.get('files.config')}.{js,json,yaml,yml}`,
            `!**/${this.get('files.notes')}.md`
        ], this._getPath(file));
    }

    _parse(fileTree) {
        const source = this;

        const build = co.wrap(function* (dir, parent) {
            let collection;
            const children = dir.children || [];
            const files = children.filter(item => item.isFile);
            const directories = children.filter(item => item.isDirectory);

            const matched = {
                directories: directories,
                files: files,
                views: files.filter(f => source.isView(f)),
                varViews: files.filter(f => source.isVarView(f)),
                configs: files.filter(f => source.isConfig(f)),
                resources: files.filter(f => source.isResource(f)),
            };

            function matchFile(check) {
                check = check.bind(source);
                const matched = files.find(f => check(f));
                return matched ? new File(matched, source.relPath) : undefined;
            }

            const dirDefaults = {
                name: dir.name,
                isHidden: dir.isHidden,
                order: dir.order,
                dir: dir.path,
                readme: matchFile(source.isReadme),
                preview: matchFile(source.isPreview),
                collator: matchFile(source.isCollator),
            };

            // config files for collections or compound components can either have the
            // filename format component-name.config.ext or config.ext
            const configFile = _.find(matched.configs, f => f.base.startsWith(`${dir.name}.`) || f.base.startsWith(`_${dir.name}.`)) || _.find(matched.configs, f => /^_?config\./.test(f.base));
            const dirConfig = yield EntitySource.getConfig(configFile, dirDefaults);

            // first figure out if it's a component directory or not...

            const defaultName = dirConfig.default || 'default';
            const defaultVariant = _.find(dirConfig.variants || [], {name: defaultName});
            let view;

            if (defaultVariant && defaultVariant.view) {
                view = _.find([].concat(matched.views, matched.varViews), { base: defaultVariant.view });
            } else {
                view = _.find(matched.views, { name: dir.name });
            }

            if (view) { // it is a component
                const nameMatch = dir.name;
                dirConfig.view = view.base;
                dirConfig.viewName = view.name;
                dirConfig.viewPath = view.path;

                const resources = new FileCollection({}, matched.resources.map(f => new File(f, source.relPath)));
                const files = {
                    view: view,
                    varViews: _.filter(matched.varViews, f => f.name.startsWith(nameMatch)),
                    config: configFile
                };
                return Component.create(dirConfig, files, resources, parent || source);
            }

            // not a component, so go through the items and group into components and collections

            if (!parent) {
                collection = source;
                source.setProps(dirConfig);
            } else {
                collection = new ComponentCollection(dirConfig, [], parent);
                collection.setProps(dirConfig);
            }

            const collections = yield matched.directories.map(item => build(item, collection));
            const components = yield matched.views.map(view => {
                const nameMatch = view.name;
                // config files for 'simple' components must have the format component-name.config.ext
                const configFile = _.find(matched.configs, f => f.base.startsWith(`${nameMatch}.`) || f.base.startsWith(`_${nameMatch}.`));
                const conf = EntitySource.getConfig(configFile, {
                    name: view.name,
                    order: view.order,
                    isHidden: view.isHidden,
                    view: view.base,
                    viewName: view.name,
                    viewPath: view.path,
                    dir: dir.path,
                });

                return conf.then(c => {
                    const files = {
                        view: view,
                        varViews: matched.varViews.filter(f => f.name.startsWith(nameMatch)),
                        config: configFile
                    };
                    const resources = new FileCollection({}, []);
                    return Component.create(c, files, resources, collection);
                });
            });

            const items = yield (_.concat(components, collections));
            collection.setItems(_.orderBy(items, ['order', 'name']));
            return collection;
        });

        return build(fileTree);
    }

};
