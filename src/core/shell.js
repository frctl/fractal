
/**
 * Change the current working directory.
 *
 * @param {string} [directory=''] The directory to navigate into.
 */
const cd = function(directory = '') {
    process.chdir(directory);
}

const touch = function(filename) {

}

const exec = function(cmd, opts = []) {

}


module.exports = { cd, exec, touch };
