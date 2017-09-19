const fs = require('fs');
const mock = require('mock-fs');
const {expect} = require('../../../../../test/helpers');
const clean = require('./clean');

const rootPath = 'path/to/files';
const doClean = glob => clean(rootPath, glob);

describe('clean', function () {
  beforeEach(function () {
    mock({
      [rootPath]: {
        'file.txt': 'file content',
        'file.js': 'alert(`foo`)',
        'test.js': 'alert(`foobar`)',
        dir: {
          'file.html': '<test/>'
        }
      }
    });
  });

  after(function () {
    mock.restore();
  });

  it('recursively deletes a directory of files, including the directory itself', async function () {
    expect(fs.readdirSync(rootPath).length).to.equal(4);
    await doClean();
    expect(fs.existsSync(rootPath)).to.equal(false);
  });

  it('supports filtering files via a glob', async function () {
    expect(fs.readdirSync('path/to/files').length).to.equal(4);
    await doClean('**/*.js');
    expect(fs.readdirSync('path/to/files').length).to.equal(2);
  });

  it('supports filtering files via an array of globs', async function () {
    expect(fs.readdirSync('path/to/files').length).to.equal(4);
    await doClean(['**/*', '!**/*.txt']);
    expect(fs.readdirSync('path/to/files').length).to.equal(1);
  });
});
