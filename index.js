/**
 * Module dependencies.
 */

var swig = require('swig');
var http = require('http');

var env = process.env.NODE_ENV || 'development';

/**
 * Expose `error`.
 */

module.exports = error;

/**
 * Error middleware.
 *
 *  - `template` defaults to ./error.html
 *  - `all` handle all type error
 *  - `text` text error handler
 *  - `json` json error handler
 *  - `html` html error handler
 *  - `debug` whether to print error.stack in console
 *  - `alias` error.status alias
 *
 * @param {Object} opts
 * @api public
 */

function error(opts) {
  opts = opts || {};

  // template
  var path = opts.template || __dirname + '/error.html';
  var render = swig.compileFile(path);

  /**
   * defaultSettings for hander error
   */

  var defaultSettings = {
    text: function (err) {
      if ('development' == env) return err.message;
      else if (err.expose) return err.message;
      else throw err;
    },
    json: function (err) {
      if ('development' == env) return { error: err.message };
      else if (err.expose) return { error: err.message };
      else return { error: http.STATUS_CODES[this.status] };
    },
    html: function (err) {
      return render({
        env: env,
        ctx: this,
        request: this.request,
        response: this.response,
        error: err.message,
        stack: err.stack,
        status: this.status,
        code: err.code
      });
    }
  };

  return function *error(next) {
    try {
      yield* next;
      if (404 == this.response.status && !this.response.body) this.throw(404);
    } catch (err) {
      if (opts.debug) console.error(err.stack);
      if (opts.alias && ('object' === typeof opts.alias)) {
        this.status = opts.alias[err.status] || 500;
      } else {
        this.status = err.status || 500;
      }

      // application
      this.app.emit('error', err, this);

      if (opts.all) {
        this.body = opts.all.call(this, err) || this.body;
        return;
      }

      var acceptType = this.accepts('html', 'text', 'json');
      if (acceptType) {
        this.body = (opts[acceptType] || defaultSettings[acceptType]).call(this, err) || this.body;
      }
    }
  }
}