var test = require("tap").test;
var browserify_marionette_bundler = require('./../index');

test("test the simple backbone-marionette-express", function (t) {
  var fn = browserify_marionette_bundler(__dirname+'/fe.test.js');
  fn({}, {
    setHeader: function () {},
    end: function (src) {
      t.type(src, "string", "type of src is string");
      t.ok(src.match(/loremipsumdolor/));
      t.end();
    }
  });
});