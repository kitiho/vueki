import { isArray, isNumber, isString } from '@vueki/utils'

export const ShapeFlags = {
  ELEMENT: 1,
  TEXT: 1 << 1,
  FRAGMENT: 1 << 2,
  COMPONENT: 1 << 3,
  TEXT_CHILDREN: 1 << 4,
  ARRAY_CHILDREN: 1 << 5,
  CHILDREN: (1 << 4) | (1 << 5),
}

export const Text = Symbol('TEXT')
export const Fragment = Symbol('FRAGMENT')

export function h(
  type: string | object | Symbol,
  props: object | null,
  children: string | number | Array<any> | null) {
  let shapFlag = 0
  if (isString(type))
    shapFlag = ShapeFlags.ELEMENT
  else if (type === Text)
    shapFlag = ShapeFlags.TEXT
  else if (type === Fragment)
    shapFlag = ShapeFlags.FRAGMENT
  else
    shapFlag = ShapeFlags.COMPONENT

  if (isString(children) || isNumber(children)) {
    shapFlag |= ShapeFlags.TEXT_CHILDREN
    children = children?.toString()
  }
  else if (isArray(children)) { shapFlag |= ShapeFlags.ARRAY_CHILDREN }

  return {
    type,
    props,
    children,
    shapFlag,
    el: null,
  }
}
