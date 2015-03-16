var koa = require('koa');
var errorHandler = require('./')

var app = koa();
app.use(errorHandler());
app.use(function* () {
  foo();
});

app.listen(3000, function () {
  console.log('listening on port 3000.');
});