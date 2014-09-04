var Engine  = require('famous/core/Engine');

var AppView = require('./views/AppView');

var appView     = new AppView(),
    mainContext = Engine.createContext();

mainContext.add(appView);
