// Generated by CoffeeScript 1.7.1
(function() {
  var callFunction, errorToMeta, ipc, objectsRegistry, path, unwrapArgs, v8Util, valueToMeta;

  ipc = require('ipc');

  path = require('path');

  objectsRegistry = require('./objects-registry.js');

  v8Util = process.atomBinding('v8_util');

  valueToMeta = function(sender, value) {
    var el, field, meta, prop, _i, _len, _ref;
    meta = {
      type: typeof value
    };
    if (value === null) {
      meta.type = 'value';
    }
    if (Array.isArray(value)) {
      meta.type = 'array';
    }
    if (meta.type === 'object' && (value.callee != null) && (value.length != null)) {
      meta.type = 'array';
    }
    if (meta.type === 'array') {
      meta.members = [];
      for (_i = 0, _len = value.length; _i < _len; _i++) {
        el = value[_i];
        meta.members.push(valueToMeta(sender, el));
      }
    } else if (meta.type === 'object' || meta.type === 'function') {
      meta.name = value.constructor.name;
      _ref = objectsRegistry.add(sender.getId(), value), meta.id = _ref[0], meta.storeId = _ref[1];
      meta.members = [];
      for (prop in value) {
        field = value[prop];
        meta.members.push({
          name: prop,
          type: typeof field
        });
      }
    } else {
      meta.type = 'value';
      meta.value = value;
    }
    return meta;
  };

  errorToMeta = function(error) {
    return {
      type: 'error',
      message: error.message,
      stack: error.stack || error
    };
  };

  unwrapArgs = function(sender, args) {
    var metaToValue;
    metaToValue = function(meta) {
      var member, rendererReleased, ret, returnValue, _i, _len, _ref;
      switch (meta.type) {
        case 'value':
          return meta.value;
        case 'remote-object':
          return objectsRegistry.get(meta.id);
        case 'array':
          return unwrapArgs(sender, meta.value);
        case 'object':
          ret = v8Util.createObjectWithName(meta.name);
          _ref = meta.members;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            member = _ref[_i];
            ret[member.name] = metaToValue(member.value);
          }
          return ret;
        case 'function-with-return-value':
          returnValue = metaToValue(meta.value);
          return function() {
            return returnValue;
          };
        case 'function':
          rendererReleased = false;
          objectsRegistry.once("clear-" + (sender.getId()), function() {
            return rendererReleased = true;
          });
          ret = function() {
            if (rendererReleased) {
              throw new Error('Calling a callback of released renderer view');
            }
            return sender.send('ATOM_RENDERER_CALLBACK', meta.id, valueToMeta(sender, arguments));
          };
          v8Util.setDestructor(ret, function() {
            if (rendererReleased) {
              return;
            }
            return sender.send('ATOM_RENDERER_RELEASE_CALLBACK', meta.id);
          });
          return ret;
        default:
          throw new TypeError("Unknown type: " + meta.type);
      }
    };
    return args.map(metaToValue);
  };

  callFunction = function(event, func, caller, args) {
    var ret;
    if (v8Util.getHiddenValue(func, 'asynchronous') && typeof args[args.length - 1] !== 'function') {
      args.push(function(ret) {
        return event.returnValue = valueToMeta(event.sender, ret);
      });
      return func.apply(caller, args);
    } else {
      ret = func.apply(caller, args);
      return event.returnValue = valueToMeta(event.sender, ret);
    }
  };

  process.on('ATOM_BROWSER_RELEASE_RENDER_VIEW', function(id) {
    return objectsRegistry.clear(id);
  });

  ipc.on('ATOM_BROWSER_REQUIRE', function(event, module) {
    var e;
    try {
      return event.returnValue = valueToMeta(event.sender, process.mainModule.require(module));
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_GLOBAL', function(event, name) {
    var e;
    try {
      return event.returnValue = valueToMeta(event.sender, global[name]);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_CURRENT_WINDOW', function(event) {
    var BrowserWindow, e, window;
    try {
      BrowserWindow = require('browser-window');
      window = BrowserWindow.fromWebContents(event.sender);
      if (window == null) {
        window = BrowserWindow.fromDevToolsWebContents(event.sender);
      }
      return event.returnValue = valueToMeta(event.sender, window);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_CONSTRUCTOR', function(event, id, args) {
    var constructor, e, obj;
    try {
      args = unwrapArgs(event.sender, args);
      constructor = objectsRegistry.get(id);
      obj = new (Function.prototype.bind.apply(constructor, [null].concat(args)));
      return event.returnValue = valueToMeta(event.sender, obj);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_FUNCTION_CALL', function(event, id, args) {
    var e, func;
    try {
      args = unwrapArgs(event.sender, args);
      func = objectsRegistry.get(id);
      return callFunction(event, func, global, args);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_MEMBER_CONSTRUCTOR', function(event, id, method, args) {
    var constructor, e, obj;
    try {
      args = unwrapArgs(event.sender, args);
      constructor = objectsRegistry.get(id)[method];
      obj = new (Function.prototype.bind.apply(constructor, [null].concat(args)));
      return event.returnValue = valueToMeta(event.sender, obj);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_MEMBER_CALL', function(event, id, method, args) {
    var e, obj;
    try {
      args = unwrapArgs(event.sender, args);
      obj = objectsRegistry.get(id);
      return callFunction(event, obj[method], obj, args);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_MEMBER_SET', function(event, id, name, value) {
    var e, obj;
    try {
      obj = objectsRegistry.get(id);
      obj[name] = value;
      return event.returnValue = null;
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_MEMBER_GET', function(event, id, name) {
    var e, obj;
    try {
      obj = objectsRegistry.get(id);
      return event.returnValue = valueToMeta(event.sender, obj[name]);
    } catch (_error) {
      e = _error;
      return event.returnValue = errorToMeta(e);
    }
  });

  ipc.on('ATOM_BROWSER_DEREFERENCE', function(event, storeId) {
    return objectsRegistry.remove(event.sender.getId(), storeId);
  });

}).call(this);
