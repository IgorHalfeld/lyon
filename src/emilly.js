import { Core } from './engine/index'
import { Compiler } from './compiler/index'
import { ParserMethods } from './parser/methods'

export default class Emilly {
  constructor ({ container, observe = () => ({}) }) {
    const target = document.getElementById(container)
    const { ob, $Observable } = Core(observe())
    this.ob = ob
    this.$Observable = $Observable

    this.makeReactive({ element: target })
    const template = Compiler({
      ob: this.ob,
      template: target.innerHTML
    })
    target.innerHTML = template
    ParserMethods(target.innerHTML)

  }

  makeReactive ({ element }) {
    Object.keys(this.ob)
      .forEach((key) => this.$Observable.register({
          name: key,
          handler: () => {
            element.innerHTML = Compiler({
              ob: this.ob,
              template: element.innerHTML
            })
          }
        })
      )
  }
}