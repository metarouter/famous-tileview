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

TileView.prototype.sequenceFrom = function (node) {
  this._scroller.sequenceFrom(node);
  this._items = this._scroller._node._.array;
  this._items.forEach(function (item) {
    item.pipe(this._sync);
  }.bind(this));

  this._totalWidth = this._items.length * this.options.tileWidth;
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

    newPosition = Math.max(tileWidth * 0.35 * -1, newPosition);
    newPosition = Math.min(totalWidth-scrollerWidth-(tileWidth * 0.35 * -1), newPosition);

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
