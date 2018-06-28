
export default class Observer {
  constructor () {
    this.subscribers = {}
  }

  notify (name) {
    if (!this.subscribers[name]) return
    this.subscribers[name]()
    console.log('* Notif key', name)
  }

  register ({ name, handler }) {
    if (this.subscribers[name]) return
    this.subscribers[name] = handler
    console.log('* Register list', this.subscribers)
  }
}