const vfs = require('vinyl-fs');
const arrayToStream = require('stream-array');
const sprom = require('stream-to-promise');

module.exports = async function(dest, files){
  const stream = arrayToStream(files).pipe(vfs.dest(dest));
  return sprom(stream);
};
