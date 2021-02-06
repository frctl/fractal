const path = require('path');

const resolveFrom = require('resolve-from');
const parentModule = require('parent-module');

const resolve = (moduleId) => {
    try {
        return resolveFrom(path.dirname(parentModule(__filename)), moduleId);
    } catch (_) {
        /**/
    }
};

const clearModule = (moduleId) => {
    if (typeof moduleId !== 'string') {
        throw new TypeError(`Expected a \`string\`, got \`${typeof moduleId}\``);
    }

    const filePath = resolve(moduleId);

    if (!filePath) {
        return;
    }

    // Delete itself from module parent
    // Module parent should always be the adapter file that requires components
    if (require.cache[filePath] && require.cache[filePath].parent) {
        let i = require.cache[filePath].parent.children.length;

        while (i--) {
            const parentChild = require.cache[filePath].parent.children[i];
            if (parentChild.id === filePath) {
                require.cache[filePath].parent.children.splice(i, 1);
            } else if (isModuleDependentOnPath(parentChild, filePath)) {
                require.cache[filePath].parent.children.splice(i, 1);

                // Delete parent children that are dependent on filePath from cache
                delete require.cache[parentChild.id];
            }
        }
    }

    // Delete module from cache
    if (require.cache[filePath]) {
        delete require.cache[filePath];
    }
};

const isModuleDependentOnPath = (module, filePath) => {
    let i = module.children.length;

    while (i--) {
        const parentChild = module.children[i];
        if (parentChild.id === filePath) {
            return true;
        } else if (parentChild.children.length && !parentChild.id.includes('node_modules')) {
            // Deep check if module is dependent on path
            return isModuleDependentOnPath(parentChild, filePath);
        }
    }

    return false;
};

module.exports = clearModule;
