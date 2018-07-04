
export const lyIf = function (elements) {
  elements.map((element) => {
    const key = element.getAttribute('ly-if')
    const parent = element.parentNode
    const nextNode = element.nextElementSibling

    this.$Observable.register({
      name: key,
      handler: () => this.ob[key]
        ? parent.insertBefore(element, nextNode)
        : parent.removeChild(element)
    })
  })
}

export const lyModel = function (elements) {
  const self = this
  elements.map((element) => {
    const key = element.getAttribute('ly-model')

    element.addEventListener('input', ({ target: { value } }) => {
      self.ob[key] = value
    }, false)
  })
}