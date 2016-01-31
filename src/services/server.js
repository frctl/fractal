
var koa = require('koa');
var app = koa();

const source = require('../source');
const render = require('../components/render');

// logger

// response

app.use(function * () {
    var tree = yield source('components');
    this.body = yield render(tree.find('assign-class-content'), true);
});

app.listen(3000);
