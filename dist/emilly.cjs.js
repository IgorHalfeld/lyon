'use strict';

class Observer {
  constructor () {
    this.subscribers = {};
  }

  notify (name) {
    if (!this.subscribers[name]) return
    this.subscribers[name]();
    console.log('* Notif key', name);
  }

  register ({ name, handler }) {
    if (this.subscribers[name]) return
    this.subscribers[name] = handler;
    console.log('* Register list', this.subscribers);
  }
}

const lyIf = function (elements) {
  elements.map((element) => {
    const key = element.getAttribute('ly-if');
    const parent = element.parentNode;
    const nextNode = element.nextElementSibling;

    this.$Observable.register({
      name: key,
      handler: () => this.ob[key]
        ? parent.insertBefore(element, nextNode)
        : parent.removeChild(element)
    });
  });
};

const lyModel = function (elements) {
  const self = this;
  elements.map((element) => {
    const key = element.getAttribute('ly-model');

    element.addEventListener('input', ({ target: { value } }) => {
      self.ob[key] = value;
    }, false);
  });
};

class AbstractHelpers {
  constructor (data) {
    const self = this;
    this.$Observable = new Observer(data);
    this.ob = new Proxy(data, {
      get (target, propertyKey) {
        return target[propertyKey]
      },
      set(target, propertyKey, newValue) {
        target[propertyKey] = newValue;
        self.$Observable.notify(propertyKey);
        return true
      }
    });
    this.compileBindingsAndGetRefs();
    this.bootstrapDirectives();
  }

  bootstrapDirectives () {
    const ifStatments = [...document.querySelectorAll('[ly-if]')];
    const modelStatments = [...document.querySelectorAll('[ly-model]')];

    lyIf.call(this, ifStatments);
    lyModel.call(this, modelStatments);
  }

  compileBindingsAndGetRefs () {
    const elements = [...document.querySelectorAll('[ly-bind]')];
    elements.map((element) => {
      const key = element.getAttribute('ly-bind');
      element.innerHTML = this.ob[key];
      this.$Observable.register({
        name: key,
        handler: () => {
          element.innerHTML = this.ob[key];
        }
      });
    });
  }

  parseMethods (methods) {
    const elements = [...document.querySelectorAll('[ly-event]')];
    elements.map((element) => {
      let [
        eventType,
        methodName
      ] = element.getAttribute('ly-event').split(',');

      eventType = eventType.trim();
      methodName = methodName.trim();
      element.addEventListener(eventType, methods[methodName].bind(this.ob), false);
    });
  }
}

class Emilly extends AbstractHelpers {
  constructor ({ observe = () => ({}), methods }) {
    super(observe());
    this.parseMethods(methods);
  }
}

module.exports = Emilly;
