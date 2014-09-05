var View     = require('famous/core/View'),
    Scroller = require('famous/views/Scroller'),
    Utility  = require('famous/utilities/Utility');

function TileView () {
  View.apply(this, arguments);

  this._scroller = new Scroller({
    direction: Utility.Direction.X
  });
}

TileView.prototype = Object.create(View.prototype);
TileView.prototype.constructor = TileView;

TileView.DEFAULT_OPTIONS = {};

module.exports = TileView;
