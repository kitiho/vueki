import { isArray, isObject } from '@vueki/utils'
import { createVnode, isVnode } from './vnode'

export function h(type: any, propsChildren: any, children: any) {
  const l = arguments.length
  if (l === 2) {
    if (isObject(propsChildren) && !isArray(propsChildren)) {
      if (isVnode(propsChildren))
        return createVnode(type, null, [propsChildren])
      return createVnode(type, propsChildren)
    }
    else if (isArray(propsChildren)) {
      return createVnode(type, null, propsChildren)
    }
    createVnode(type, propsChildren)
  }
  else if (l > 3) {
    // eslint-disable-next-line prefer-rest-params
    children = Array.from(arguments).slice(2)
  }
  else if (l === 3 && isVnode(children)) {
    children = [children]
  }
  return createVnode(type, propsChildren, children)
}
