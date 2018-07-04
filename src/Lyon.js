
import AbstractHelpers from './abstractHelpers'

export default class Lyon extends AbstractHelpers {
  constructor ({ observe = () => ({}), methods }) {
    super(observe())
    this.parseMethods(methods)
  }
}