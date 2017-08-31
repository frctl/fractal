const debug = require('debug')('frctl:pages');
const {normalizePath} = require('@frctl/utils');
const vfs = require('vinyl-fs');
const arrayToStream = require('stream-array');
const sprom = require('stream-to-promise');

module.exports = async function(dest, files){
  debug('Writing %s files to %s', files.length, dest);
  dest = normalizePath(dest);
  const stream = arrayToStream(files).pipe(vfs.dest(dest));
  return sprom(stream).then(files => {
    debug('write complete');
    return files;
  });
};
