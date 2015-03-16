var koa = require('koa');
var request = require('supertest');
var sleep = require('co-sleep');
var errorHandler = require('..');

describe('json.test.js', function () {
  it('should common error ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler());
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'application/json')
    .expect(500)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'foo is not defined')) done();
    });
  });

  it('should common error after sleep a little while ok', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler());
    app.use(commonSleepError);

    request(app.callback())
    .get('/')
    .set('Accept', 'application/json')
    .expect(500)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'fooAfterSleep is not defined')) done();
    });
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
    .set('Accept', 'application/json')
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'alias error')) done();
    });
  });

  it('should custom handler by modify `ctx`', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      json: function (err) {
        this.status = 502;
        this.body = {error: 'json error'};
      }
    }));
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'application/json')
    .expect(502)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'json error')) done();
    });
  });

  it('should custom handler by return `ctx.body`', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      json: function (err) {
        return {error: 'json error'};
      }
    }));
    app.use(commonError);

    request(app.callback())
    .get('/')
    .set('Accept', 'application/json')
    .expect(500)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'json error')) done();
    });
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