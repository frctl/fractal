const fs = require('fs');

/**
 * Change the current working directory.
 *
 * @param {string} [directory=''] The directory to navigate into.
 */
const cd = function(directory = '') {
    process.chdir(directory);
}


/**
 * Create a file.
 *
 * @param {*} filename The filename of the file to create.
 */
const touch = function(filename) {
    const handle = fs.openSync(filename, 'w');
    fs.closeSync(handle);
}

const exec = function(cmd, opts = []) {

}


module.exports = { cd, exec, touch };
