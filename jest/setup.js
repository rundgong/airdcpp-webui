var storageMock = (function() {
  var store = {};
  return {
    getItem: function(key) {
      return store[key];
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
});

global.getBasePath = () => '/'

global.localStorage = storageMock();
global.sessionStorage = storageMock();

window.$ = require('jquery');
window.jQuery = require('jquery');
