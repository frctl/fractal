const fs = require('fs');
const cp = require('child_process');

module.exports = {

    /**
     * Change the current working directory.
     *
     * @param {string} [directory=''] The directory to navigate into.
     */
    cd(directory = '') {
        return process.chdir(directory);
    },

    /**
     * Create a file.
     *
     * @param {string} filename The filename of the file to create.
     */
    touch(filename) {
        const handle = fs.openSync(filename, 'w');
        fs.closeSync(handle);
    },

    /**
     * Spawn a child process.
     *
     * @param {string} cmd
     * @param {string[]} [opts=[]]
     * @returns {ChildProcess}
     */
    exec(cmd, opts = []) {
        return cp.spawn(cmd, opts);
    }

};
