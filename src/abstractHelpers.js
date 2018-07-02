import Observable from './observer/index'
import {
  lyFor,
  lyIf,
  lyModel
} from './compiler/directives'

export default class AbstractHelpers {
  constructor (data) {
    const self = this
    this.$Observable = new Observable(data)
    this.ob = new Proxy(data, {
      get (target, propertyKey) {
        return target[propertyKey]
      },
      set(target, propertyKey, newValue) {
        target[propertyKey] = newValue
        self.$Observable.notify(propertyKey)
        return true
      }
    })
    this.compileBindingsAndGetRefs()
    this.bootstrapDirectives()
  }

  bootstrapDirectives () {
    const forStatments = [...document.querySelectorAll('[ly-for]')]
    const ifStatments = [...document.querySelectorAll('[ly-if]')]
    const modelStatments = [...document.querySelectorAll('[ly-model]')]

    lyFor.call(this, forStatments)
    lyIf.call(this, ifStatments)
    lyModel.call(this, modelStatments)
  }

  compileBindingsAndGetRefs () {
    const elements = [...document.querySelectorAll('[ly-bind]')]
    elements.map((element) => {
      const key = element.getAttribute('ly-bind')
      element.textContent = this.ob[key]
      this.$Observable.register({
        name: key,
        handler: () => {
          element.textContent = this.ob[key]
        }
      })
    })
  }

  parserMethods (methods) {
    const elements = [...document.querySelectorAll('[ly-click]')]
    elements.map((element) => {
      const methodName = element.getAttribute('ly-click')
      element.addEventListener('click', methods[methodName].bind(this.ob), false)
    })
  }
}