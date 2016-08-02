'use strict';

const Promise = require('bluebird');
const _ = require('lodash');
const co = require('co');
const fs = Promise.promisifyAll(require('fs'));
const anymatch = require('anymatch');
const DocCollection = require('./collection');
const Doc = require('./doc');
const Data = require('../../core/data');
const EntitySource = require('../../core/entities/source');
const resolver = require('../../core/resolver');
const md = require('../../core/markdown');

module.exports = class DocSource extends EntitySource {

    constructor(app) {
        super('docs', app);
    }

    pages() {
        return super.entities();
    }

    docs() {
        return super.entities();
    }

    resolve(context) {
        return resolver.context(context, this);
    }

    toc(page, maxDepth) {
        return page.getContent().then(content => {
            return this.resolve(page.context || {}).then(context => {
                const meta = {env: {}};
                return this.engine().render(page.filePath, content, context, meta).then(rendered => md.toc(rendered, maxDepth, this.get('markdown')));
            });
        });
    }

    render(page, context, env, opts) {
        const self = this;

        opts = opts || {};
        env = env || {};

        if (!page) {
            return Promise.reject(null);
        }
        if (_.isString(page)) {
            const str = page;
            if (page.indexOf('@') === 0) {
                page = this.find(page);
                if (!page) {
                    throw new Error(`Cannot find page ${str}`);
                }
            } else {
                return fs.readFileAsync(page, 'utf8').then(content => {
                    return this.resolve(context).then((ctx) => {
                        return self._render(page, content, ctx, {
                            env: env,
                        });
                    });
                });
            }
        }

        const renderContext = context || page.context;
        const target = page.toJSON();
        return co(function* () {
            const source = yield (self.isLoaded ? Promise.resolve(self) : self.load());
            const context = yield self.resolve(renderContext);
            const content = yield page.getContent();
            return self._render(page.filePath, content, context, {
                env: env,
                self: target,
            });
        });
    }

    renderString(str, context, env) {
        return this._render(null, str, context || {}, {
            env: env || {},
        });
    }

    isPage(file) {
        return anymatch(`**/*${this.get('ext')}`, this._getPath(file));
    }

    isTemplate(file) {
        return this.isPage(file);
    }

    _appendEventFileInfo(file, eventData) {
        eventData = super._appendEventFileInfo(file, eventData);
        for (const test of ['isPage', 'isTemplate']) {
            if (this[test](file)) {
                eventData[test] = true;
            }
        }
        return eventData;
    }

    _render(path, content, context, meta) {
        return this.engine().render(path, content, context, meta).then(rendered => (this.get('markdown') ? md(rendered, this.get('markdown')) : rendered));
    }

    _parse(fileTree) {
        const source = this;

        const build = co.wrap(function* (dir, parent) {
            let collection;
            const children = dir.children || [];
            const configs = children.filter(f => source.isConfig(f));

            const dirConfig = yield EntitySource.getConfig(_.find(configs, f => f.name.startsWith(dir.name)), {
                name: dir.name,
                isHidden: dir.isHidden,
                order: dir.order,
                dir: dir,
            });

            if (!parent) {
                collection = source;
                source.setProps(dirConfig);
            } else {
                collection = new DocCollection(dirConfig, [], parent);
                collection.setProps(dirConfig);
            }

            const items = yield children.map(item => {
                if (source.isPage(item)) {
                    const nameMatch = `${item.name}.`;
                    const configFile = _.find(configs, f => f.name.startsWith(nameMatch));
                    const contents = item.read();
                    const config = EntitySource.getConfig(configFile, {
                        name: item.name,
                        isHidden: item.isHidden,
                        order: item.order,
                        lang: item.lang,
                        filePath: item.path,
                        file: item,
                    });
                    return Promise.join(config, contents, (config, contents) => Doc.create(config, contents, collection));
                } else if (item.isDirectory) {
                    return build(item, collection);
                }
                return Promise.resolve(null);
            });

            collection.setItems(_.orderBy(_.compact(items), ['order', 'name']));
            return collection;
        });

        return build(fileTree);
    }
};
