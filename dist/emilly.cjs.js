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

const lyFor = function (elements) {
  console.log('lyFor', this);
  elements.map((element) => {
    const [ tmpVarName, arrayName ] = element
      .getAttribute('ly-for')
      .trim()
      .split('in');
    const template = element.innerHTML;
    const templateVar = template.match(/\{\{.*\}\}/g)[0];
    let templateTranspiled = '';

    const iteratorLength = this.ob[arrayName.trim()].length;
    for (let i = 0, l = iteratorLength; i < l; i++) {
      // const varWithoutBrackets = templateVar.replace(/}}|{{/g,'')
      templateTranspiled += template.replace(templateVar, this.ob[arrayName.trim()][i]);
    }

    element.innerHTML = templateTranspiled;
  });
};

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
    const forStatments = [...document.querySelectorAll('[ly-for]')];
    const ifStatments = [...document.querySelectorAll('[ly-if]')];
    const modelStatments = [...document.querySelectorAll('[ly-model]')];

    lyFor.call(this, forStatments);
    lyIf.call(this, ifStatments);
    lyModel.call(this, modelStatments);
  }

  compileBindingsAndGetRefs () {
    const elements = [...document.querySelectorAll('[ly-bind]')];
    elements.map((element) => {
      const key = element.getAttribute('ly-bind');
      element.textContent = this.ob[key];
      this.$Observable.register({
        name: key,
        handler: () => {
          element.textContent = this.ob[key];
        }
      });
    });
  }

  parseMethods (methods) {
    const elements = [...document.querySelectorAll('[ly-click]')];
    elements.map((element) => {
      const methodName = element.getAttribute('ly-click');
      element.addEventListener('click', methods[methodName].bind(this.ob), false);
    });
  }
}

class Emilly extends AbstractHelpers {
  constructor ({ container, observe = () => ({}), methods }) {
    const target = document.getElementById(container);
    super(observe());
    this.parseMethods(methods);
  }
}

module.exports = Emilly;
