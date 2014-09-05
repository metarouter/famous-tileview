var View       = require('famous/core/View'),
    Modifier   = require('famous/core/Modifier'),
    RenderNode = require('famous/core/RenderNode'),
    Scroller   = require('famous/views/Scroller'),
    Utility    = require('famous/utilities/Utility');

function TileView () {
  View.apply(this, arguments);

  this._items = [];

  this._scroller = new Scroller({
    direction: Utility.Direction.X
  });

  this.add(this._scroller);
}

TileView.prototype = Object.create(View.prototype);
TileView.prototype.constructor = TileView;

TileView.DEFAULT_OPTIONS = {};

module.exports = TileView;

TileView.prototype.sequenceFrom = function (node) {
  this._scroller.sequenceFrom(node);
  this._items = this._scroller._node._.array;
};
