
import AbstractHelpers from './abstractHelpers'

export default class Emilly extends AbstractHelpers {
  constructor ({ container, observe = () => ({}), methods }) {
    const target = document.getElementById(container)
    super(observe())
    this.parserMethods(methods)
  }
}