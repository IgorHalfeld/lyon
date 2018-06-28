import Observable from '../observer/index'

export const Core = (data) => {
  const $Observable = new Observable(data)
  const ob = new Proxy(data, {
    get (target, propertyKey) {
      return target[propertyKey]
    },
    set(target, propertyKey, newValue) {
      target[propertyKey] = newValue
      $Observable.notify(propertyKey)
    }
  })

  return { ob, $Observable }
}