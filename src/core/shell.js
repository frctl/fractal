const fs = require('fs');
const spawn = require('child_process').spawn;

/**
 * Change the current working directory.
 *
 * @param {string} [directory=''] The directory to navigate into.
 */
const cd = function(directory = '') {
    return process.chdir(directory);
}

/**
 * Create a file.
 *
 * @param {string} filename The filename of the file to create.
 */
const touch = function(filename) {
    const handle = fs.openSync(filename, 'w');
    fs.closeSync(handle);
}

/**
 * Spawn a child process.
 *
 * @param {string} cmd
 * @param {string[]} [opts=[]]
 * @returns {ChildProcess}
 */
const exec = function(cmd, opts = []) {
    return spawn(cmd, opts);
}

module.exports = { cd, exec, touch };
