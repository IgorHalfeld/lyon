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









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};





var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();













var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

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

// import Compiler from './index'

var lyFor = function lyFor(elements) {
  console.log('lyFor', this);
  elements.map(function (element) {
    var _element$getAttribute = element.getAttribute('ly-for').trim().split('in'),
        _element$getAttribute2 = slicedToArray(_element$getAttribute, 2),
        variable = _element$getAttribute2[0],
        array = _element$getAttribute2[1];
    // const template = element.innerHTML
    // Compiler(template, this.ob)

    console.log('variable', variable);
    console.log('array', array);
  });
};

var lyIf = function lyIf(elements) {
  var _this = this;

  elements.map(function (element) {
    var key = element.getAttribute('ly-if');
    var parent = element.parentNode;

    _this.$Observable.register({
      name: key,
      handler: function handler() {
        return _this.ob[key] ? parent.appendChild(element) : parent.removeChild(element);
      }
    });
  });
};

var lyModel = function lyModel(elements) {
  var self = this;
  elements.map(function (element) {
    var key = element.getAttribute('ly-model');

    element.addEventListener('input', function (_ref) {
      var value = _ref.target.value;

      self.ob[key] = value;
    }, false);
  });
};

var AbstractHelpers = function () {
  function AbstractHelpers(data) {
    classCallCheck(this, AbstractHelpers);

    var self = this;
    this.$Observable = new Observer(data);
    this.ob = new Proxy(data, {
      get: function get$$1(target, propertyKey) {
        return target[propertyKey];
      },
      set: function set$$1(target, propertyKey, newValue) {
        target[propertyKey] = newValue;
        self.$Observable.notify(propertyKey);
        return true;
      }
    });
    this.compileBindingsAndGetRefs();
    this.bootstrapDirectives();
  }

  createClass(AbstractHelpers, [{
    key: 'bootstrapDirectives',
    value: function bootstrapDirectives() {
      var forStatments = [].concat(toConsumableArray(document.querySelectorAll('[ly-for]')));
      var ifStatments = [].concat(toConsumableArray(document.querySelectorAll('[ly-if]')));
      var modelStatments = [].concat(toConsumableArray(document.querySelectorAll('[ly-model]')));

      lyFor.call(this, forStatments);
      lyIf.call(this, ifStatments);
      lyModel.call(this, modelStatments);
    }
  }, {
    key: 'compileBindingsAndGetRefs',
    value: function compileBindingsAndGetRefs() {
      var _this = this;

      var elements = [].concat(toConsumableArray(document.querySelectorAll('[ly-bind]')));
      elements.map(function (element) {
        var key = element.getAttribute('ly-bind');
        element.textContent = _this.ob[key];
        _this.$Observable.register({
          name: key,
          handler: function handler() {
            element.textContent = _this.ob[key];
          }
        });
      });
    }
  }, {
    key: 'parserMethods',
    value: function parserMethods(methods) {
      var _this2 = this;

      var elements = [].concat(toConsumableArray(document.querySelectorAll('[ly-click]')));
      elements.map(function (element) {
        var methodName = element.getAttribute('ly-click');
        element.addEventListener('click', methods[methodName].bind(_this2.ob), false);
      });
    }
  }]);
  return AbstractHelpers;
}();

var Emilly = function (_AbstractHelpers) {
  inherits(Emilly, _AbstractHelpers);

  function Emilly(_ref) {
    var container = _ref.container,
        _ref$observe = _ref.observe,
        observe = _ref$observe === undefined ? function () {
      return {};
    } : _ref$observe,
        methods = _ref.methods;
    classCallCheck(this, Emilly);

    var target = document.getElementById(container);

    var _this = possibleConstructorReturn(this, (Emilly.__proto__ || Object.getPrototypeOf(Emilly)).call(this, observe()));

    _this.parserMethods(methods);
    return _this;
  }

  return Emilly;
}(AbstractHelpers);

return Emilly;

})));
