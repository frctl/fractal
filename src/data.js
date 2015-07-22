module.exports = Data;

function Data(config){
    if (!(this instanceof Data)) return new Data(config);
    this.config = config;
    console.log('Loading data...');
};
