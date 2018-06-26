import Observable from './observer'

export default class Emilly {
  constructor (data = {}) {
    this.$Observable = new Observable(data)
  }
}