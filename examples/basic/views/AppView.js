var View = require('famous/core/View');

function AppView () {
  View.apply(this, arguments);
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

AppView.DEFAULT_OPTIONS = {};

module.exports = AppView;
