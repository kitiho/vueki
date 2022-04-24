import { ShapeFlags, isString } from '@vueki/utils'
import { Text, createVnode } from './vnode'

export function createRenderer(renderOptions: any) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText,
    setText: hostSetText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    patchProps: hostPatchProp,
  } = renderOptions
  function mountElement(vnode: any, container: any) {
    const { type, props, children, shapeFlag } = vnode
    const el = vnode.el = hostCreateElement(type)
    if (props) {
      for (const key in props)
        hostPatchProp(el, key, null, props[key])
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN)
      hostSetElementText(el, children)
    else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
      mountChildren(children, el)
    hostInsert(el, container)
  }
  function processText(n1: any, n2: any, container: any) {
    if (n1 === null)
      hostInsert((n2.el = hostCreateText(n2.children)), container)
  }
  const patch = (n1: any, n2: any, container: any) => {
    if (n1 === n2)
      return

    const { type, shapeFlag } = n2
    if (n1 == null) {
      switch (type) {
        case Text:
          processText(n1, n2, container)
          break
        default:
          if (shapeFlag & ShapeFlags.ELEMENT)
            mountElement(n2, container)
      }
    }
    else {

    }
  }
  function normalize(child) {
    if (isString(child))
      return createVnode(Text, null, child)
    return child
  }
  function mountChildren(children: any, el: any) {
    for (let i = 0; i < children.length; i++) {
      const child = normalize(children[i])
      patch(null, child, el)
    }
  }

  const render = (vnode: any, container: any) => {
    if (vnode === null) {

    }
    else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return { render }
}
