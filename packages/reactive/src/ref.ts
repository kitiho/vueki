import { hasChanged, isObject } from '@vueki/utils'
import { track, trigger } from './effect'
import { reactive } from './reactive'

export function ref(value: any) {
  if (isRef(value))
    return value
  return new RefImpl(value)
}
export function isRef(value: { __isRef__: any }) {
  return !!(value && value.__isRef__)
}

class RefImpl {
  public __isRef__
  public _value
  constructor(value: any) {
    this.__isRef__ = true
    this._value = convert(value)
  }

  get value() {
    track(this, 'value')
    return this._value
  }

  set value(newValue) {
    if (hasChanged(this._value, newValue)) {
      this._value = convert(newValue)
      trigger(this, 'value')
    }
  }
}

function convert(value: any) {
  return isObject(value) ? reactive(value) : value
}
