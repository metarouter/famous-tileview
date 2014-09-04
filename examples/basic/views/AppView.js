var View       = require('famous/core/View'),
    Modifier   = require('famous/core/Modifier'),
    RenderNode = require('famous/core/RenderNode');

function AppView () {
  View.apply(this, arguments);

  this._rootModifier = new Modifier({
    size: [undefined, 250]
  });
  this._rootNode = this.add(new RenderNode(this._rootModifier));
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

AppView.DEFAULT_OPTIONS = {};

module.exports = AppView;
