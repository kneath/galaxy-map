// Generated by CoffeeScript 1.7.1
(function() {
  var BrowserWindow, EventEmitter, IDWeakMap, app, wrapWebContents;

  EventEmitter = require('events').EventEmitter;

  IDWeakMap = require('id-weak-map');

  app = require('app');

  wrapWebContents = require('web-contents').wrap;

  BrowserWindow = process.atomBinding('window').BrowserWindow;

  BrowserWindow.prototype.__proto__ = EventEmitter.prototype;

  BrowserWindow.windows = new IDWeakMap;

  BrowserWindow.prototype._init = function() {
    var menu;
    if (process.platform !== 'darwin') {
      menu = app.getApplicationMenu();
      if (menu != null) {
        this.setMenu(menu);
      }
    }
    this.webContents = this.getWebContents();
    this.webContents.once('destroyed', (function(_this) {
      return function() {
        return _this.webContents = null;
      };
    })(this));
    Object.defineProperty(this, 'id', {
      value: BrowserWindow.windows.add(this),
      enumerable: true
    });
    return this.once('closed', (function(_this) {
      return function() {
        if (BrowserWindow.windows.has(_this.id)) {
          return BrowserWindow.windows.remove(_this.id);
        }
      };
    })(this));
  };

  BrowserWindow.prototype.openDevTools = function() {
    this._openDevTools();
    this.devToolsWebContents = this.getDevToolsWebContents();
    this.devToolsWebContents.once('destroyed', (function(_this) {
      return function() {
        return _this.devToolsWebContents = null;
      };
    })(this));
    this.devToolsWebContents.once('did-finish-load', (function(_this) {
      return function() {
        return _this.emit('devtools-opened');
      };
    })(this));
    return this.devToolsWebContents.once('destroyed', (function(_this) {
      return function() {
        return _this.emit('devtools-closed');
      };
    })(this));
  };

  BrowserWindow.prototype.toggleDevTools = function() {
    if (this.isDevToolsOpened()) {
      return this.closeDevTools();
    } else {
      return this.openDevTools();
    }
  };

  BrowserWindow.prototype.getWebContents = function() {
    return wrapWebContents(this._getWebContents());
  };

  BrowserWindow.prototype.getDevToolsWebContents = function() {
    return wrapWebContents(this._getDevToolsWebContents());
  };

  BrowserWindow.prototype.setMenu = function(menu) {
    var _ref;
    if (process.platform === 'darwin') {
      throw new Error('BrowserWindow.setMenu is not available on OS X');
    }
    if ((menu != null ? (_ref = menu.constructor) != null ? _ref.name : void 0 : void 0) !== 'Menu') {
      throw new TypeError('Invalid menu');
    }
    this.menu = menu;
    return this.menu.attachToWindow(this);
  };

  BrowserWindow.getAllWindows = function() {
    var key, windows, _i, _len, _ref, _results;
    windows = BrowserWindow.windows;
    _ref = windows.keys();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      key = _ref[_i];
      _results.push(windows.get(key));
    }
    return _results;
  };

  BrowserWindow.getFocusedWindow = function() {
    var window, windows, _i, _len;
    windows = BrowserWindow.getAllWindows();
    for (_i = 0, _len = windows.length; _i < _len; _i++) {
      window = windows[_i];
      if (window.isFocused()) {
        return window;
      }
    }
  };

  BrowserWindow.fromWebContents = function(webContents) {
    var window, windows, _i, _len;
    windows = BrowserWindow.getAllWindows();
    for (_i = 0, _len = windows.length; _i < _len; _i++) {
      window = windows[_i];
      if (webContents.equal(window.webContents)) {
        return window;
      }
    }
  };

  BrowserWindow.fromDevToolsWebContents = function(webContents) {
    var window, windows, _i, _len;
    windows = BrowserWindow.getAllWindows();
    for (_i = 0, _len = windows.length; _i < _len; _i++) {
      window = windows[_i];
      if (webContents.equal(window.devToolsWebContents)) {
        return window;
      }
    }
  };

  BrowserWindow.fromId = function(id) {
    return BrowserWindow.windows.get(id);
  };

  BrowserWindow.prototype.loadUrl = function() {
    return this.webContents.loadUrl.apply(this.webContents, arguments);
  };

  BrowserWindow.prototype.send = function() {
    return this.webContents.send.apply(this.webContents, arguments);
  };

  BrowserWindow.prototype.restart = function() {
    return this.webContents.reload();
  };

  BrowserWindow.prototype.getUrl = function() {
    return this.webContents.getUrl();
  };

  BrowserWindow.prototype.reload = function() {
    return this.webContents.reload();
  };

  BrowserWindow.prototype.reloadIgnoringCache = function() {
    return this.webContents.reloadIgnoringCache();
  };

  BrowserWindow.prototype.getPageTitle = function() {
    return this.webContents.getTitle();
  };

  BrowserWindow.prototype.isLoading = function() {
    return this.webContents.isLoading();
  };

  BrowserWindow.prototype.isWaitingForResponse = function() {
    return this.webContents.isWaitingForResponse();
  };

  BrowserWindow.prototype.stop = function() {
    return this.webContents.stop();
  };

  BrowserWindow.prototype.getRoutingId = function() {
    return this.webContents.getRoutingId();
  };

  BrowserWindow.prototype.getProcessId = function() {
    return this.webContents.getProcessId();
  };

  BrowserWindow.prototype.isCrashed = function() {
    return this.webContents.isCrashed();
  };

  BrowserWindow.prototype.executeJavaScriptInDevTools = function(code) {
    return this.devToolsWebContents.executeJavaScript(code);
  };

  module.exports = BrowserWindow;

}).call(this);
