module.exports = Tree;

function Tree(config){
    if (!(this instanceof Tree)) return new Tree(config);
    this.config = config;
    console.log('Building tree...');
};
