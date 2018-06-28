(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Emilly = factory());
}(this, (function () { 'use strict';

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var Observer = function () {
  function Observer() {
    classCallCheck(this, Observer);

    this.subscribers = {};
  }

  createClass(Observer, [{
    key: 'notify',
    value: function notify(name) {
      if (!this.subscribers[name]) return;
      this.subscribers[name]();
      console.log('* Notif key', name);
    }
  }, {
    key: 'register',
    value: function register(_ref) {
      var name = _ref.name,
          handler = _ref.handler;

      if (this.subscribers[name]) return;
      this.subscribers[name] = handler;
      console.log('* Register list', this.subscribers);
    }
  }]);
  return Observer;
}();

var Core = function Core(data) {
  var $Observable = new Observer(data);
  var ob = new Proxy(data, {
    get: function get(target, propertyKey) {
      return target[propertyKey];
    },
    set: function set(target, propertyKey, newValue) {
      target[propertyKey] = newValue;
      $Observable.notify(propertyKey);
    }
  });

  return { ob: ob, $Observable: $Observable };
};

var Compiler = function Compiler(_ref) {
  var _ref$template = _ref.template,
      template = _ref$template === undefined ? '' : _ref$template,
      _ref$ob = _ref.ob,
      ob = _ref$ob === undefined ? {} : _ref$ob;

  var templateMatchVars = template.match(/\{\{.*\}\}/g);
  var templateTranspiled = '';

  var templateVarsLength = templateMatchVars.length;
  for (var i = 0, l = templateVarsLength; i < l; i++) {
    var templateVar = templateMatchVars[i];
    var varWithoutBrackets = templateVar.replace(/}}|{{/g, '');
    templateTranspiled = template.replace(templateVar, ob[varWithoutBrackets]);
  }

  return templateTranspiled;
};

var ParserMethods = function ParserMethods(template) {
  console.log('template', template);
  var elements = document.querySelector('[ly-click]');
  console.log('templateMatchVars methods', elements);
};

var Emilly = function () {
  function Emilly(_ref) {
    var container = _ref.container,
        _ref$observe = _ref.observe,
        observe = _ref$observe === undefined ? function () {
      return {};
    } : _ref$observe;
    classCallCheck(this, Emilly);

    var target = document.getElementById(container);

    var _Core = Core(observe()),
        ob = _Core.ob,
        $Observable = _Core.$Observable;

    this.ob = ob;
    this.$Observable = $Observable;

    this.makeReactive({ element: target });
    var template = Compiler({
      ob: this.ob,
      template: target.innerHTML
    });
    target.innerHTML = template;
    ParserMethods(target.innerHTML);
  }

  createClass(Emilly, [{
    key: 'makeReactive',
    value: function makeReactive(_ref2) {
      var _this = this;

      var element = _ref2.element;

      Object.keys(this.ob).forEach(function (key) {
        return _this.$Observable.register({
          name: key,
          handler: function handler() {
            element.innerHTML = Compiler({
              ob: _this.ob,
              template: element.innerHTML
            });
          }
        });
      });
    }
  }]);
  return Emilly;
}();

return Emilly;

})));
