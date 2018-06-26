
export default class Observer {
  constructor () {
    this.subscribers = {}
  }

  notify (name) {
    if (!this.subscribers[name]) return
    this.subscribers[name]()
  }

  register ({ name, handler }) {
    if (this.subscribers[name]) return
    this.subscribers[name] = handler
  }
}