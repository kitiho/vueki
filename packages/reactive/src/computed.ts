import { isFunction } from '@vueki/utils'
import { effect, track, trigger } from './effect'

export function computed(getterOrOption: { get: any; set: any } | Function) {
  let getter, setter
  if (isFunction(getterOrOption)) {
    getter = getterOrOption
    setter = () => {
      console.warn('setter is not defined')
    }
  }
  else {
    getter = getterOrOption.get
    setter = getterOrOption.set
  }
  return new ComputedImpl(getter, setter)
}

class ComputedImpl {
  public _value: any
  public _dirty
  public _effect

  constructor(public getter: Function, public _setter: Function) {
    this._value = undefined
    this._dirty = true
    this._effect = effect(getter, {
      lazy: true,
      scheduler: () => {
        if (!this._dirty) {
          this._dirty = true
          trigger(this, 'value')
        }
      },
    })
  }

  get value() {
    if (this._dirty) {
      this._value = this._effect()
      this._dirty = false
      track(this, 'value')
    }
    return this._value
  }

  set value(newValue) {
    this._setter(newValue)
  }
}
