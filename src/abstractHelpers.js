import Observable from './observer/index'
import {
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
    const ifStatments = [...document.querySelectorAll('[ly-if]')]
    const modelStatments = [...document.querySelectorAll('[ly-model]')]

    lyIf.call(this, ifStatments)
    lyModel.call(this, modelStatments)
  }

  compileBindingsAndGetRefs () {
    const elements = [...document.querySelectorAll('[ly-bind]')]
    elements.map((element) => {
      const key = element.getAttribute('ly-bind')
      element.innerHTML = this.ob[key]
      this.$Observable.register({
        name: key,
        handler: () => {
          element.innerHTML = this.ob[key]
        }
      })
    })
  }

  parseMethods (methods) {
    const elements = [...document.querySelectorAll('[ly-event]')]
    elements.map((element) => {
      let [
        eventType,
        methodName
      ] = element.getAttribute('ly-event').split(',')

      eventType = eventType.trim()
      methodName = methodName.trim()
      element.addEventListener(eventType, methods[methodName].bind(this.ob), false)
    })
  }
}