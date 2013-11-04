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

var MyApp = new Backbone.Marionette.Application();
MyApp.start();
