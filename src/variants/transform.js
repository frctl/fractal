'use strict';

module.exports = function (component, source) {



            const source   = props.source;
            const varConfs = props.variants || [];
            const variants = [];

            // first figure out if we need a 'default' variant.
            const hasDefaultConfigured = _.find(varConfs, ['name', comp.defaultName]);

            if (!hasDefaultConfigured) {
                variants.push(new Variant({
                    name:      comp.defaultName,
                    handle:    `${comp.handle}${source.splitter}${comp.defaultName}`.toLowerCase(),
                    view:      props.view,
                    viewPath:  Path.join(props.dir, props.view),
                    dir:       props.dir,
                    isDefault: true,
                    parent:    comp
                }));
            }

            varConfs.forEach(conf => {
                if (_.isUndefined(conf.name)) {
                    cli.error(`Could not create variant of ${comp.handle} - 'name' value is missing`);
                    return null;
                }
                const p = _.defaults(conf, {
                    dir:    props.dir,
                    parent: comp
                });
                if (!p.view) {
                    // no view file specified
                    const viewName = `${props.viewName}${source.splitter}${p.name}`.toLowerCase();
                    const view     = _.find(files.varViews, f => f.name.toLowerCase() === viewName);
                    p.view         = view ? view.base : props.view;
                }
                p.isDefault = (p.name === comp.defaultName);
                p.viewPath  = Path.join(p.dir, p.view);
                p.handle    = `${comp.handle}${source.splitter}${p.name}`.toLowerCase();
                variants.push(new Variant(p));
            });

            const usedViews = variants.map(v => v.view);

            files.varViews.filter(f => !_.includes(usedViews, f.base)).forEach(f => {
                const name = f.name.split(source.splitter)[1];
                const variant = new Variant({
                    name:     name.toLowerCase(),
                    handle:   `${comp.handle}${source.splitter}${name}`.toLowerCase(),
                    view:     f.base,
                    viewPath: f.path,
                    dir:      props.dir,
                    parent:   comp,
                });
                variants.push(variant);
            });

            comp.addVariants(variants);

};
