var Scroller = require('famous/views/Scroller'),
    Utility  = require('famous/utilitties/Utility');

function TileView () {
  Scroller.apply(this, arguments);
}

TileView.prototype = Object.create(Scroller.prototype);
TileView.prototype.constructor = TileView;

TileView.DEFAULT_OPTIONS = {
  direction: Utility.Direction.X
};
