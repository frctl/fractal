const debug = require('debug')('frctl:pages');
const vfs = require('vinyl-fs');
const arrayToStream = require('stream-array');
const sprom = require('stream-to-promise');

module.exports = async function (dest, files) {
  debug('Writing %s files to %s', files.length, dest);
  const stream = arrayToStream(files).pipe(vfs.dest(dest));
  return sprom(stream).then(files => {
    debug('write complete');
    return files;
  });
};
