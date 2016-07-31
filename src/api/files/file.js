'use strict';

const _ = require('lodash');
const Path = require('path');
const VinylFile = require('vinyl');
const mime = require('mime');
const utils = require('../../core/utils');


module.exports = class File {

    constructor(file, relativeTo) {
        this.isFile = true;
        this.id = utils.md5(file.path);
        this._file = file;
        this.path = file.path;
        this.cwd = relativeTo ? relativeTo : process.cwd();
        this.relPath = relativeTo ? Path.relative(Path.resolve(relativeTo), file.path) : file.path;
        this.base = file.base;
        this.dir = file.dir;
        this.handle = utils.slugify(file.base.replace('.', '-'));
        this.name = file.name;
        this.ext = file.ext;
        this.stat = file.stat || null;
        this.lang = file.lang.name;
        this.editorMode = file.lang.mode;
        this.editorScope = file.lang.scope;
        this.githubColor = file.lang.color;
        this.isBinary = file.isBinary;
        this.mime = mime.lookup(this.ext);
    }

    get contents() {
        return this._file.readBuffer();
    }

    get isImage() {
        return _.includes(['jpeg', 'jpg', 'png', 'svg', 'gif', 'webp'], this.ext.replace('.', '').toLowerCase());
    }

    getContent() {
        return this._file.read().then(c => c.toString());
    }

    getContentSync() {
        return this._file.readSync().toString();
    }

    toVinyl() {
        return new VinylFile({
            path: this.path,
            contents: this.contents,
            base: this.cwd,
        });
    }

    toJSON() {
        return {
            id: this.id,
            path: this.path,
            relPath: this.relPath,
            base: this.base,
            handle: this.handle,
            name: this.name,
            ext: this.ext,
            lang: this.lang,
            mime: this.mime,
            editorMode: this.editorMode,
            editorScope: this.editorScope,
            githubColor: this.githubColor,
            isBinary: this.isBinary,
            isFile: true,
            isImage: this.isImage,
        };
    }

};
