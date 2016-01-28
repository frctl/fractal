var koa = require('koa');
var app = koa();

// logger


// response

app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);
