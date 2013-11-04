var browserify = require('browserify'),
  uglify = require('uglify-js'),
  shim = require('browserify-shim');

var debug_flag = true;
var cached = "alert('please reload page');";

if (process.env.NODE_ENV && 'development' != process.env.NODE_ENV) {
  debug_flag = false;
}

function bundleIt (path, fn) {
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
      cached = uglify.minify(src, {fromString: true}).code;
    else
      cached = src;

    fn(cached);
  });
}

module.exports = function (path) {
  return function (req, res) {
    bundleIt(path, function (js_src) {
      res.setHeader('Content-Type', 'application/javascript');
      res.end(js_src);
    });
  };
};