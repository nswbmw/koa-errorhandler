var koa = require('koa');
var request = require('supertest');
var sleep = require('co-sleep');
var errorHandler = require('..');

describe('html.test.js', function () {
  it('should common error ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler());
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/html')
    .expect(/<p>Looks like something broke!<\/p>/, done);
  });

  it('should common error after sleep a little while ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler());
    app.use(commonSleepError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/html')
    .expect(/<p>Looks like something broke!<\/p>/, done);
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
    .set('Accept', 'text/html')
    .expect(400)
    .expect(/<p>Looks like something broke!<\/p>/, done);
  });

  it('should custom handler by modify `ctx`', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      html: function (err) {
        this.status = 502;
        this.body = '<h2>error</h2>';
      }
    }));
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/html')
    .expect(502)
    .expect('<h2>error</h2>', done);
  });

  it('should custom handler by return `ctx.body`', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      html: function (err) {
        return '<h2>error</h2>';
      }
    }));
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/html')
    .expect(500)
    .expect('<h2>error</h2>', done);
  });
});

function* commonError() {
  foo();
}

function* commonSleepError() {
  yield sleep(50);
  fooAfterSleep();
}

function* commonAliasError() {
  var error = new Error('alias error');
  error.status = 'AliasError';
  throw error;
}