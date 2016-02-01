const server = require('koa')();
const router = require('koa-router')();

module.exports = function(config, app){

    router.get('/', function * (next) {
        var tree = yield app().pages;

       this.body = yield app.renderPage(tree.find('index')).catch(e => {
           app.logger.error(e);
           return 'Error!';
       });
    });

    server.use(router.routes()).use(router.allowedMethods());

    server.listen(3000);

};
