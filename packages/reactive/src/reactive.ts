import { hasChanged, isArray, isObject } from '@vueki/utils'
import { track, trigger } from './effect'

const proxyMap = new WeakMap()

export function reactive<T extends object>(target: T): T {
  // 判断是不是复杂类型，如果不是，直接返回
  if (!isObject(target))
    return target

  if (isReactive(target))
    return target

  if (proxyMap.has(target))
    return proxyMap.get(target)

  // proxy代理对象
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      if (key === '__IS_REACTIVE__')
        return true
      const res = Reflect.get(target, key, receiver)
      track(target, key)
      return isObject(res) ? reactive(res) : res
    },
    set(target, key, value, receiver) {
      let oldLength = 0
      if (isArray(target))
        oldLength = target.length
      const oldValue = Reflect.get(target, key, receiver)
      const res = Reflect.set(target, key, value, receiver)
      if (hasChanged(oldValue, value)) {
        trigger(target, key)
        if (isArray(target) && hasChanged(oldLength, target.length))
          trigger(target, 'length')
      }

      return res
    },
  })
  proxyMap.set(target, proxy)
  return proxy
}

export function isReactive(target: any) {
  return !!(target && target.__IS_REACTIVE__)
}
