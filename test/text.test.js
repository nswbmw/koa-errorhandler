var koa = require('koa');
var request = require('supertest');
var sleep = require('co-sleep');
var errorHandler = require('..');

describe('text.test.js', function () {
  it('should common error ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler());
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/plain')
    .expect(500)
    .expect('foo is not defined', done);
  });

  it('should common error after sleep a little while ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler());
    app.use(exposeError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/plain')
    .expect(500)
    .expect('this message will be expose', done);
  });

  it('should common alias error ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      alias: {'AliasError': 400}
    }));
    app.use(commonAliasError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/plain')
    .expect(400)
    .expect('alias error', done);
  });

  it('should custom handler by modify `ctx`', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      text: function (err) {
        this.status = 501;
        this.body = 'error';
      }
    }));
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/plain')
    .expect(501)
    .expect('error', done);
  });

  it('should custom handler by return `ctx.body`', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      text: function (err) {
        return 'error';
      }
    }));
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/plain')
    .expect(500)
    .expect('error', done);
  });
});

function* commonError() {
  foo();
}

function* exposeError() {
  var err = new Error('this message will be expose');
  err.expose = true;
  throw err;
}

function* commonAliasError() {
  var error = new Error('alias error');
  error.status = 'AliasError';
  throw error;
}