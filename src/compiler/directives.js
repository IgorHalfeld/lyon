import { Compiler } from './index'

export const lyFor = function (elements) {
  console.log('lyFor', this)
  elements.map((element) => {
    const [ tmpVarName, arrayName ] = element
      .getAttribute('ly-for')
      .trim()
      .split('in')
    const template = element.innerHTML
    const templateVar = template.match(/\{\{.*\}\}/g)[0]
    let templateTranspiled = ''

    const iteratorLength = this.ob[arrayName.trim()].length
    for (let i = 0, l = iteratorLength; i < l; i++) {
      // const varWithoutBrackets = templateVar.replace(/}}|{{/g,'')
      templateTranspiled += template.replace(templateVar, this.ob[arrayName.trim()][i])
    }

    element.innerHTML = templateTranspiled
  })
}

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