const server = require('koa')();
const router = require('koa-router')();

module.exports = function(config){
    
    router.get('/', function * (next) {
        var tree = yield source('pages');
        this.body = yield render(tree.find('index')).catch(e => {
            logger.error(e);
            return 'Error!';
        });
    });

    server.use(router.routes()).use(router.allowedMethods());

    server.listen(3000);

};

module.exports.config = require('./config');
