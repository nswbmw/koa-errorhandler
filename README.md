## koa-errorhandler

Error handler middleware for koa. Inspired by [koa-onerror](https://github.com/koajs/onerror) and [koa-error](https://github.com/koajs/error).

### Install

```
npm i koa-errorhandler --save
```

### Usage

```
errorHandler(options)
```

Options:

- template: {String} default template to render error to html, default `./error.html`.
- all: {Function} if options.all exist, ignore negotiation.
- text: {Function} text error handler.
- json: {Function} json error handler.
- html: {Function} html error handler.
- debug: {Boolean} whether to print error.stack in console.
- alias: {Object} error.status alias.

### Example

```
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
```

### Test

```
npm test
```

### License

MIT
