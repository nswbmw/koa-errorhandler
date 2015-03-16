var koa = require('koa');
var errorHandler = require('./');

var app = koa();
app.on('error', function () {});
app.use(errorHandler());
app.use(commonError);

app.listen(3000)

function* commonError() {
  foo();
}