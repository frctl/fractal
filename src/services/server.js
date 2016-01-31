const server = require('koa')();
const router = require('koa-router')();
const source = require('../source');
const logger = require('../logger');
const render = require('../pages/render');

router.get('/', function * (next) {
    var tree = yield source('pages');
    this.body = yield render(tree.find('index')).catch(e => {
        logger.error(e);
        return 'Error!';
    });
});

server.use(router.routes()).use(router.allowedMethods());

server.listen(3000);
