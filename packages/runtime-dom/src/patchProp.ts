import { patchClass } from './modules/class'
import { patchStyle } from './modules/style'
import { patchEvent } from './modules/event'
import { patchAttr } from './modules/attr'

export function patchProps(el: any, key: string, prevValue: any, nextValue: any) {
  if (key === 'class')
    patchClass(el, nextValue)

  else if (key === 'style')
    patchStyle(el, prevValue, nextValue)

  else if (/^on[^a-z]/.test(key))
    patchEvent(el, key, prevValue, nextValue)

  else
    patchAttr(el, key, nextValue)
}
