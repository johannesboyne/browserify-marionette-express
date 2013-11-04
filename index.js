var fs = require('fs'),
  browserify = require('browserify'),
  uglify = require('uglify-js'),
  chokidar = require('chokidar'),
  shim = require('browserify-shim');

var debug_flag = true;

if (process.env.NODE_ENV && 'development' != process.env.NODE_ENV) {
  debug_flag = false;
}

var in_mem_cache = {};
var watchers = {};

function bundleIt (path, fn) {

  if (in_mem_cache[path]) {
    fn(in_mem_cache[path]);
    return;
  } else {
    _bundle(path, fn);
  }
}

function _bundle (path, fn) {
  shim(browserify(), {
    jquery: {
      path: __dirname+'/js_libs/jquery.js',
      exports: '$'
    },
    'backbone.marionette': {
      path: __dirname+'/js_libs/backbone.marionette.js',
      exports: null,
      depends: { backbone: 'Backbone', underscore: '_' }
    },
    'backbone.wreqr': {
      path: __dirname+'/js_libs/backbone.wreqr.js',
      exports: null,
      depends: { backbone: 'Backbone', 'backbone.marionette': 'Marionette', underscore: '_' }
    },
    'backbone.babysitter': {
      path: __dirname+'/js_libs/backbone.babysitter.js',
      exports: null,
      depends: { backbone: 'Backbone', underscore: '_' }
    }
  })
  .require(require.resolve(__dirname+'/js_libs/underscore.js'), { expose: 'underscore' })
  .require(require.resolve(__dirname+'/js_libs/backbone.js'), { expose: 'backbone' })
  .require(require.resolve(path), { entry: true })
  .bundle({debug: debug_flag}, function (err, src) {
    if (err) return console.error(err);

    if (!debug_flag)
      in_mem_cache[path] = uglify.minify(src, {fromString: true}).code;
    else
      in_mem_cache[path] = src;

    if (fn) {
      fn(in_mem_cache[path]);
      fn = null;
    }
  });
}

module.exports = function (path) {
  return function (req, res) {
    if (debug_flag) {
      if (!watchers[path]) {
        var a = path.split('/'); a.pop();
        watchers[path] = chokidar.watch(a.join('/'));
        watchers[path].on('change', function(fpath) {
          console.log('File', fpath, 'has been changed'); _bundle(path, null);
        });
      }
    }
    bundleIt(path, function (js_src) {
      res.setHeader('Content-Type', 'application/javascript');
      res.end(js_src);
    });
  };
};