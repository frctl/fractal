'use strict';

const Promise  = require('bluebird');
const _        = require('lodash');
const Collection = require('../collection');

module.exports = class VariantCollection extends Collection {

    constructor(props, items) {
        super(props, items);
        this._parent        = props.parent;
        this._status        = this._parent._status;
        this._prefix        = this._parent._prefix;
        this._preview       = this._parent._preview;
        this._display       = this._parent._display;
    }

    default(){
        return this.find('name', this._parent.defaultName);
    }

    static create(component, defaultView, configured, views, props){

        const variants = [];
        const assets   = component.assets();

        // first figure out if we need a 'default' variant.
        const hasDefaultConfigured = _.find(configured, ['name', comp.defaultName]);
        const defaultView = files.view;

        function isRelated(variantHandle) {
            return function(file) {
                if (f.name.includes(source.splitter)) {
                    return f.name === variantHandle;
                }
                return true;
            }
        }

        if (!hasDefaultConfigured) {
            variants.push(new Variant({
                name:      comp.defaultName,
                handle:    `${comp.handle}${source.splitter}${comp.defaultName}`.toLowerCase(),
                view:      props.view,
                viewPath:  Path.join(props.dir, props.view),
                dir:       props.dir,
                isDefault: true,
                parent:    comp
            }, defaultView, assets));
        }

        configured.forEach((conf, i) => {
            let viewFile = null;
            if (_.isUndefined(conf.name)) {
                cli.error(`Could not create variant of ${comp.handle} - 'name' value is missing`);
                return null;
            }
            const p = _.defaults(conf, {
                dir:    props.dir,
                parent: comp,
                order:  i
            });
            if (!p.view) {
                // no view file specified
                const viewName = `${props.viewName}${source.splitter}${p.name}`.toLowerCase();
                viewFile       = _.find(views, f => f.name.toLowerCase() === viewName);
                p.view         = viewFile ? viewFile.base : props.view;
            }
            viewFile = viewFile || defaultView;
            p.isDefault = (p.name === comp.defaultName);
            p.viewPath  = Path.join(p.dir, p.view);
            p.handle    = `${comp.handle}${source.splitter}${p.name}`.toLowerCase();
            variants.push(
                new Variant(p, viewFile, assets.filter(isRelated(p.handle)))
            );
        });

        const usedViews = variants.map(v => v.view);

        views.filter(f => !_.includes(usedViews, f.base)).forEach(viewFile => {
            const name = viewFile.name.split(source.splitter)[1];
            const p = {
                name:     name.toLowerCase(),
                handle:   `${comp.handle}${source.splitter}${name}`.toLowerCase(),
                view:     viewFile.base,
                viewPath: viewFile.path,
                dir:      props.dir,
                parent:   comp,
            };
            variants.push(
                new Variant(p, viewFile, assets.filter(isRelated(p.handle)))
            );
        });

        return new VariantCollection({
            parent: component,
        }, variants);
    }

};
