# browserify backbone.marionette express.js

> Simple, easy, usefull

## Bringing together what belongs together

* [browserify](https://github.com/substack/node-browserify)
* [Marionette.js](https://github.com/marionettejs/backbone.marionette)
* [express.js](https://github.com/visionmedia/express)

## How to use

```javascript
app.get('/js/marionetteapp_bundled.js', browserify_marionette_bundler(__dirname+'/protected/javascripts/src/marionetteapp.js'));
```

"Wow, that's simple!" - yep. It is meant to be simple! Therefore you are declaring one JS-file as your `entry` point and that's it.
Inside your entry file (e.g. `marionetteapp_bundled.js`) you then do something like:

```javascript
// kind of global modules
// -----------------------------------------------------------------------------
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
Backbone.$ = $;
require('backbone.marionette');
require('backbone.wreqr');
require('backbone.babysitter');
// -----------------------------------------------------------------------------

// Modules
var AppRouter = require('./appRouter');

var MyApp = new Backbone.Marionette.Application();

MyApp.addInitializer(function (options) {
  new AppRouter();
  Backbone.history.start();
});

MyApp.start();
```

For the record: I do know, that the part between the top comment is *not that nice!* but it really does it's job well!

# LICENSE

MIT

[![endorse](https://api.coderwall.com/johannesboyne/endorsecount.png)](https://coderwall.com/johannesboyne)
