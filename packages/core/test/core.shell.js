const chai = require('chai');
const expect = chai.expect;
const mock = require('mock-fs');
const path = require('path');
const fs = require('fs');
const shell = require('../src/shell');

describe('Shell', function () {
    let originalPwd;

    beforeEach(function () {
        originalPwd = process.cwd();
        mock({
            shelltest: {
                'nested-directory': {},
                'empty-file.txt': '',
            },
        });
    });

    afterEach(function () {
        // Ensure the current working directory is the same as when we started the test suite.
        process.cwd(originalPwd);
        // Reset the filesystem.
        mock.restore();
    });

    it('can change directory', function () {
        const cwd = process.cwd();
        shell.cd('shelltest');
        expect(process.cwd()).to.equal(`${cwd}${path.sep}shelltest`);
    });

    it('can create a file', function (done) {
        shell.touch('test-file.md');
        fs.stat(path.join(process.cwd(), 'test-file.md'), function (error, stats) {
            if (error) done(error);
            expect(stats.isFile()).to.be.true;
            done();
        });
    });
});
