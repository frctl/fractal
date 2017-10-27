const {isEmpty} = require('lodash');
const vfs = require('vinyl-fs');
const streamToPromise = require('stream-to-promise');
const debug = require('debug')('frctl:parser');
const check = require('check-types');

const assert = check.assert;

module.exports = async function (sources, emitter = {emit: () => {}}) {
  if (isEmpty(sources)) {
    return [];
  }

  assert(areValidSources(sources), 'The \'read\' package requires an array of valid sources [invalid-sources]', TypeError);

  const paths = sources.map(source => source.src);
  debug('Reading sources:\n %s', paths);
  const fileStream = vfs.src(paths);

  emitter.emit('read.start', fileStream);

  fileStream.on('data', file => emitter.emit('read.file', file));

  const files = await streamToPromise(fileStream);

  emitter.emit('read.complete', files);

  return files;
};

const areValidSources = sources => check.array(sources) && sources.reduce((acc, s) => acc & check.like(s, {src: 'string'}), true);
