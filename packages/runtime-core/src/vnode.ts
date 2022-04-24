import { ShapeFlags, isArray, isString } from '@vueki/utils'

export const Text = Symbol('Text')

export function createVnode(type: any, props: any, children: any = null) {
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : 0
  const vnode = {
    type,
    props,
    children,
    el: null,
    key: props?.key,
    __v_isVNode: true,
    shapeFlag,
  }
  if (children) {
    let type = 0
    if (isArray(children)) { type = ShapeFlags.ARRAY_CHILDREN }
    else {
      children = String(children)
      type = ShapeFlags.TEXT_CHILDREN
    }
    vnode.shapeFlag |= type
  }
  return vnode
}

export function isVnode(value: { __v_isVNode: any }) {
  return !!(value && value.__v_isVNode)
}
