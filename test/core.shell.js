const chai = require('chai');
const expect = chai.expect;
const mock = require('mock-fs');
const path = require('path');
const fs = require('fs');

const shell = require('../src/core/shell');

describe('Shell', function() {

    let originalPwd;

    beforeEach(function() {
        originalPwd = process.cwd();
        mock({
            'shelltest': {
                'nested-directory': {},
                'empty-file.txt': ''
            }
        });
    });

    afterEach(function() {
        // Ensure the current working directory is the same as when we started the test suite.
        process.cwd(originalPwd);
        // Reset the filesystem.
        mock.restore();
    })

    it('can change directory', function() {
        const cwd = process.cwd();
        shell.cd('shelltest');
        expect(process.cwd()).to.equal(`${cwd}${path.sep}shelltest`);
    })

    it('can create a file', function(done) {
        shell.touch('test-file.md');
        fs.stat(path.join(process.cwd(), 'test-file.md'), function(error, stats) {
            if (error) done(error)
            expect(stats.isFile()).to.be.true;
            done();
        })
    });

    it('can execute a child process', function(done) {
        // This should be OK cross-platform.
        // If not - any suggestions?
        const cmd = shell.exec('node', ['-v']);
        cmd.stdout.on('data', function(data) {
            expect(data.toString().trim()).to.equal(process.version);
        });
        // Run this on the end event so we are sure the child process under test actually ends.
        cmd.stdout.on('end', done);
    });
});
