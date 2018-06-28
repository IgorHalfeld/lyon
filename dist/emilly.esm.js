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

const Core = (data) => {
  const $Observable = new Observer(data);
  const ob = new Proxy(data, {
    get (target, propertyKey) {
      return target[propertyKey]
    },
    set(target, propertyKey, newValue) {
      target[propertyKey] = newValue;
      $Observable.notify(propertyKey);
    }
  });

  return { ob, $Observable }
};

const Compiler = ({ template = '', ob = {} }) => {
  const templateMatchVars = template.match(/\{\{.*\}\}/g);
  let templateTranspiled = '';

  const templateVarsLength = templateMatchVars.length;
  for (let i = 0, l = templateVarsLength; i < l; i++) {
    const templateVar = templateMatchVars[i];
    const varWithoutBrackets = templateVar.replace(/}}|{{/g,'');
    templateTranspiled = template.replace(templateVar, ob[varWithoutBrackets]);
  }

  return templateTranspiled
};

const ParserMethods = (template) => {
  console.log('template', template);
  const elements = document.querySelector('[ly-click]');
  console.log('templateMatchVars methods', elements);
};

class Emilly {
  constructor ({ container, observe = () => ({}) }) {
    const target = document.getElementById(container);
    const { ob, $Observable } = Core(observe());
    this.ob = ob;
    this.$Observable = $Observable;

    this.makeReactive({ element: target });
    const template = Compiler({
      ob: this.ob,
      template: target.innerHTML
    });
    target.innerHTML = template;
    ParserMethods(target.innerHTML);

  }

  makeReactive ({ element }) {
    Object.keys(this.ob)
      .forEach((key) => this.$Observable.register({
          name: key,
          handler: () => {
            element.innerHTML = Compiler({
              ob: this.ob,
              template: element.innerHTML
            });
          }
        })
      );
  }
}

export default Emilly;
