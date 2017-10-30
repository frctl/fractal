const fs = require('fs');
const mock = require('mock-fs');
const {File} = require('@frctl/support');
const {expect} = require('../../../../test/helpers');
const write = require('./write');

const dest = 'path/to/files';

const files = [
  new File({
    path: 'foo.js',
    contents: Buffer.from('foo')
  }),
  new File({
    path: 'dir/bar.txt',
    contents: Buffer.from('bar')
  })
];

describe('write', function () {
  beforeEach(function () {
    mock({
      [dest]: {}
    });
  });

  after(function () {
    mock.restore();
  });

  it('writes an array of files to disk', async function () {
    expect(fs.readdirSync(dest).length).to.equal(0);
    await write(dest, files);
    expect(fs.existsSync(dest)).to.equal(true);
    expect(fs.readdirSync(dest).length).to.equal(2);
    expect(fs.readFileSync(dest + '/dir/bar.txt', 'utf-8')).to.equal('bar');
  });
});
