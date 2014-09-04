var Engine  = require('famous/core/Engine'),
    Surface = require('famous/core/Surface');

var AppView = require('./views/AppView');

var appView     = new AppView(),
    mainContext = Engine.createContext();

mainContext.add(appView);
