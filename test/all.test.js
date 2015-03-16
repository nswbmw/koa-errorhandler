var koa = require('koa');
var request = require('supertest');
var sleep = require('co-sleep');
var errorHandler = require('..');

describe('all.test.js', function () {
  it('should common error ok (text/plain)', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      all: function (err) {
        this.type = 'json';
        this.body = {error: 'All error'};
      },
      alias: {'AliasError': 400}
    }));
    app.use(commonAliasError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/plain')
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'All error')) done();
    });
  });

  it('should common error ok (text/html)', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      all: function (err) {
        this.type = 'json';
        this.body = {error: 'All error'};
      },
      alias: {'AliasError': 400}
    }));
    app.use(commonAliasError);

    request(app.callback())
    .get('/')
    .set('Accept', 'text/html')
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'All error')) done();
    });
  });

  it('should common error ok (application/json)', function (done) {
    var app = koa();
    app.on('error', function () {});
    app.use(errorHandler({
      all: function (err) {
        this.type = 'json';
        this.body = {error: 'All error'};
      },
      alias: {'AliasError': 400}
    }));
    app.use(commonAliasError);

    request(app.callback())
    .get('/')
    .set('Accept', 'application/json')
    .expect(400)
    .end(function (err, res) {
      if (err) return done(err);
      if (res.body.error && (res.body.error == 'All error')) done();
    });
  });
});

function* commonAliasError() {
  var error = new Error('alias error');
  error.status = 'AliasError';
  throw error;
}