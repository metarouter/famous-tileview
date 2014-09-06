var View           = require('famous/core/View'),
    Modifier       = require('famous/core/Modifier'),
    RenderNode     = require('famous/core/RenderNode'),
    Scroller       = require('famous/views/Scroller'),
    Transitionable = require('famous/transitions/Transitionable'),
    GenericSync    = require('famous/inputs/GenericSync'),
    TouchSync      = require('famous/inputs/TouchSync'),
    ScrollSync     = require('famous/inputs/ScrollSync'),
    MouseSync      = require('famous/inputs/MouseSync'),
    Utility        = require('famous/utilities/Utility');

function setDirection (syncClass, direction, opts) {
  opts = opts || {};
  opts.direction = direction;
  return new (syncClass)(opts);
}

GenericSync.register({
  scroll: setDirection.bind(null, ScrollSync, Utility.Direction.Y),
  touch: setDirection.bind(null, TouchSync, Utility.Direction.X),
  mouse: setDirection.bind(null, MouseSync, Utility.Direction.X)
});

function TileView () {
  View.apply(this, arguments);

  this._items = [];
  this._sides = [0, 0, 0];
  this._totalWidth = 0;

  this._position = new Transitionable(0);
  this._scroller = undefined;
  this._sync     = new GenericSync(
    ['scroll', 'touch', 'mouse']
  );

  _setupInputHandler.call(this);
  _createScroller.call(this);
}

TileView.prototype = Object.create(View.prototype);
TileView.prototype.constructor = TileView;

TileView.DEFAULT_OPTIONS = {
  tileWidth: 50,
  transition: {
    duration: 250,
    curve: 'easeOutBounce'
  }
};

module.exports = TileView;

TileView.prototype.setSides = function (sides) {
  this._sides = sides;

  return sides;
};

TileView.prototype.getSides = function () {
  return this._sides;
};

TileView.prototype.sequenceFrom = function (node) {
  this._scroller.sequenceFrom(node);
  this._items = this._scroller._node._.array;
  this._items.forEach(function (item) {
    item.pipe(this._sync);
  }.bind(this));

  this._totalWidth = this._items.length * this.options.tileWidth;
};

TileView.prototype.goToTile = function (tile, position) {
  var tileIndex = this._items.indexOf(tile);

  return this.goToIndex(tileIndex, position);
};

// position:
// -1 - left edge
//  0 - middle
//  1 - right edge
TileView.prototype.goToIndex = function (tileIndex, pos) {
  var tileWidth        = this.options.tileWidth,
      scrollerWidth    = this._scroller.getSize(true)[0],
      position         = this._position,
      sideWidth        = scrollerWidth / 3,
      sides            = this.setSides([sideWidth, sideWidth, sideWidth]),
      currentPosition  = position.get(),
      scrollerTooSmall = sideWidth < tileWidth,
      itemPosition     = tileWidth * tileIndex;

  if (scrollerTooSmall) {
    var adjSides = sideWidth - (tileWidth - sideWidth) / 2;

    sides = sides.map(function (sw, idx) {
      return (idx === pos + 1) ? tileWidth : adjSides;
    });
    this.setSides(sides);
  }

  var sections = [0, sides[0], sides[0] + sides[1]];
  if (scrollerTooSmall) {
    sections[2] += sides[2] - tileWidth;
  }

  var sectionRange = [
    currentPosition + sections[pos+1],
    currentPosition + (sections[pos+1] + sides[pos+1])
  ];

  var inRange = itemPosition >= sectionRange[0] && itemPosition+tileWidth <= sectionRange[1];

  if (! inRange) {
    var left   = sectionRange[0] - itemPosition,
        right  = sectionRange[1] - itemPosition,
        newPosition = (Math.abs(left) < Math.abs(right)) ? left : right - tileWidth;

    newPosition = currentPosition - newPosition;
    newPosition = _boundaries.call(this, newPosition, 0);

    position.set(newPosition, this.options.transition);
  }
};

function _setupInputHandler () {
  var position   = this._position,
      transition = this.options.transition,
      tileWidth  = this.options.tileWidth,
      sync       = this._sync;

  sync.on('start', position.halt.bind(position));
  sync.on('update', function (data) {
    var currentPosition = position.get(),
        // hack to determine scroll event
        isScroll        = (data.slip && data.slip.constructor === Boolean),
        newPosition     = currentPosition + (isScroll ? data.delta : -1 * data.delta),
        scrollerWidth   = this._scroller.getSize(true)[0],
        totalWidth      = this._totalWidth;

    newPosition = _boundaries.call(this, newPosition, 0.35);

    position.set(newPosition);
  }.bind(this));
  sync.on('end', function () {
    var currentPosition = position.get(),
        totalWidth      = this._totalWidth,
        scrollerWidth   = this._scroller.getSize(true)[0],
        lastPosition    = totalWidth - scrollerWidth;

    if (currentPosition < 0) {
      position.set(0, transition);
    } else if (currentPosition > lastPosition) {
      position.set(lastPosition, transition);
    }

  }.bind(this));
}

function _createScroller () {
  this._scroller = new Scroller({
    direction: Utility.Direction.X
  });
  this._scroller.positionFrom(this._position);

  this.add(this._scroller);
}


function _boundaries (newPosition, padding) {
  var scrollerWidth = this._scroller.getSize(true)[0],
      tileWidth     = this.options.tileWidth * padding * -1,
      totalWidth    = this._totalWidth;

  newPosition = Math.max(tileWidth, newPosition);
  newPosition = Math.min(totalWidth-scrollerWidth-tileWidth, newPosition);
  return newPosition;
}
