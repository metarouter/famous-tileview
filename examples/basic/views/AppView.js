var View             = require('famous/core/View'),
    Modifier         = require('famous/core/Modifier'),
    RenderNode       = require('famous/core/RenderNode'),
    Surface          = require('famous/core/Surface'),
    Transform        = require('famous/core/Transform'),
    SequentialLayout = require('famous/views/SequentialLayout'),
    ImageSurface     = require('famous/surfaces/ImageSurface'),
    GenericSync      = require('famous/inputs/GenericSync'),
    ScrollSync       = require('famous/inputs/ScrollSync'),
    MouseSync        = require('famous/inputs/MouseSync'),
    TouchSync        = require('famous/inputs/TouchSync'),
    Utility          = require('famous/utilities/Utility');

var TileView = require('../../../TileView');

function AppView () {
  View.apply(this, arguments);

  this._rootModifier = new Modifier({
    size: [undefined, 250]
  });
  this._rootNode = this.add(new RenderNode(this._rootModifier));

  _createLayout.call(this);
  _setupEventHandlers.call(this);
}

AppView.prototype = Object.create(View.prototype);
AppView.prototype.constructor = AppView;

AppView.DEFAULT_OPTIONS = {
  tileNum: 20,
  tileWidth: 150
};

module.exports = AppView;

function setSyncDirection (syncClass, direction, opts) {
  opts = opts || {};
  opts.direction = direction;
  return new (syncClass)(opts);
}

function _setupEventHandlers () {
  GenericSync.register({
    scroll: setSyncDirection.bind(null, ScrollSync, Utility.Direction.Y),
    touch: setSyncDirection.bind(null, TouchSync, Utility.Direction.X),
    mouse: setSyncDirection.bind(null, MouseSync, Utility.Direction.X)
  });

  this.tileView._sync.addSync(['scroll', 'touch', 'mouse']);
}

function _createLayout () {
  var tileView = createTileView(this.options.tileWidth, this.options.tileNum);

  this.add(new Modifier({ size: [undefined, 200] }))
      .add(tileView);
  this.tileView = tileView;

  this.sections = createSections(tileView);
  this.add(new Modifier({ transform: Transform.translate(0, 250, 0) }))
      .add(this.sections);
}

function createTileView (tileWidth, tileNum) {
  var tileView = new TileView({
    tileWidth: tileWidth
  });
  var items = [];

  for (var i = 0; i < tileNum; i++)  {
    var tmp = new ImageSurface({
      content: 'http://lorempixel.com/' + tileWidth + '/200/animals/' + (i % 10).toString(),
      size: [tileWidth, undefined]
    });

    tmp.pipe(tileView);
    items.push(tmp);
  }

  tileView.sequenceFrom(items);
  return tileView;
}

function createSections (tileView) {
  var sections = new SequentialLayout({
    direction: 0
  });

  var sides = tileView.getSides();

  sections.sequenceFrom(sides.map(function (side, idx) {
    var sideModifier = new Modifier({
      size: function () {
        return [tileView.getSides()[idx], 50];
      }
    });

    var surface = new Surface({
      content: (idx - 1).toString(),
      properties: {
        textAlign: 'center',
        backgroundColor: 'hsl(' + idx * 360 / sides.length + ', 100%, 50%)'
      }
    });

    var tmp = new RenderNode(sideModifier);
    tmp.add(surface);

    return tmp;
  }));
  return sections;
}
