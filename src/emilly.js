
import AbstractHelpers from './abstractHelpers'

export default class Emilly extends AbstractHelpers {
  constructor ({ observe = () => ({}), methods }) {
    super(observe())
    this.parseMethods(methods)
  }
}