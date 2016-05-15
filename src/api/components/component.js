'use strict';

const _      = require('lodash');
const Entity = require('../../core/entities/entity');

module.exports = class Component extends Entity {

    constructor(config, files, assets, parent){
        super(config.name, config, parent);
        this.isComponent = true;
    }

    static *create(config, files, assets, parent) {

    //         opts.notes = opts.notes || opts.readme;
    //         if (!opts.notes && files.readme || opts.notesFromFile && files.readme) {
    //             opts.notesFromFile = true;
    //             opts.notes = yield files.readme.read();
    //         }
            const comp = new Component(config, files, assets, parent);
    //         const variants = yield VariantCollection.create(comp, files.view, opts.variants, files.varViews, opts);
    //         comp.setVariants(variants);
            return comp;
    }

}

//
//
// const Promise           = require('bluebird');
// const _                 = require('lodash');
// const co                = require('co');
// const Path              = require('path');
// const console           = require('../console');
// const data              = require('../data');
// const utils             = require('../utils');
// const md                = require('../markdown');
// const VariantCollection = require('../variants/collection');
// const Entity            = require('../entity');
//
// module.exports = class Component extends Entity {
//
//     constructor(opts, files, assets) {
//         super('component', opts);
//         this.id          = utils.md5(files.view.path);
//         this.handle      = opts.parent.getProp('prefix') ? `${opts.parent.getProp('prefix')}-${this.name}` : this.name;
//         this.label       = opts.label || utils.titlize(opts.name);
//         this.title       = opts.title || this.label;
//         this.defaultName = opts.default ? utils.slugify(opts.default.toLowerCase()) : 'default';
//         this.notes       = opts.notes || null;
//         this.notesFromFile = opts.notesFromFile || false;
//         this.lang        = files.view.lang.name;
//         this.editorMode  = files.view.lang.mode;
//         this.editorScope = files.view.lang.scope;
//         this.viewPath    = files.view.path;
//         this._assets     = assets;
//         this._variants   = new VariantCollection({ parent: this }, []);
//     }
//
//     get isCollated() {
//         return this.collated;
//     }
//
//     get content() {
//         return this.variants().default().getContentSync();
//     }
//
//     setVariants(variantCollection) {
//         this._variants = variantCollection;
//     }
//
//     hasTag(tag) {
//         return _.includes(this.tags, tag);
//     }
//
//     assets() {
//         return this._assets;
//     }
//
//     flatten() {
//         return this.variants();
//     }
//
//     variants() {
//         return this._variants;
//     }
//
//     toJSON() {
//         return {
//             type:       this.type,
//             id:         this.id,
//             name:       this.name,
//             handle:     this.handle,
//             label:      this.label,
//             title:      this.title,
//             notes:      this.notes,
//             status:     this.status,
//             tags:       this.tags,
//             isHidden:   this.isHidden,
//             isCollated: this.isCollated,
//             order:      this.order,
//             preview:    this.preview,
//             display:    this.display,
//             viewPath:   this.viewPath,
//             variants:   this.variants().toJSON()
//         };
//     }
//
//     static *create(opts, files, assets) {
//
//         opts.notes = opts.notes || opts.readme;
//         if (!opts.notes && files.readme || opts.notesFromFile && files.readme) {
//             opts.notesFromFile = true;
//             opts.notes = yield files.readme.read();
//         }
//         const comp = new Component(opts, files, assets);
//         const variants = yield VariantCollection.create(comp, files.view, opts.variants, files.varViews, opts);
//         comp.setVariants(variants);
//         return comp;
//     }
// };
//
