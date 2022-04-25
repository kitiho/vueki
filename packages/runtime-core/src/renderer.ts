import { ShapeFlags, isString } from '@vueki/utils'
import { Text, createVnode, isSameVnode } from './vnode'

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
  function mountElement(vnode: any, container: any, anchor: any = null) {
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
    hostInsert(el, container, anchor)
  }
  function processText(n1: any, n2: any, container: any) {
    if (n1 === null) { hostInsert((n2.el = hostCreateText(n2.children)), container) }
    else {
      const el = n2.el = n1.el
      if (n1.children !== n2.children)
        hostSetText(el, n2.children)
    }
  }
  function patchProps(oldProps: any, newProps: any, el: any) {
    for (const key in newProps)
      hostPatchProp(el, key, oldProps[key], newProps[key])

    for (const key in oldProps) {
      if (newProps[key] == null)
        hostPatchProp(el, key, oldProps[key], undefined)
    }
  }
  function unmountChildren(children: any) {
    for (let i = 0; i < children.length; i++)
      unmount(children[i])
  }
  const patch = (n1: any, n2: any, container: any, anchor: any = null) => {
    if (n1 === n2)
      return

    // 判断两个元素是否相同，不相同先卸载再添加
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1)
      n1 = null
    }

    const { type, shapeFlag } = n2
    switch (type) {
      case Text:
        processText(n1, n2, container)
        break
      default:
        if (shapeFlag & ShapeFlags.ELEMENT)
          processElement(n1, n2, container, anchor)
    }
  }

  function patchKeyedChildren(oldCh: any, newCh: any, el: any) {
    let i = 0
    let e1 = oldCh.length - 1
    let e2 = newCh.length - 1
    while (i <= e1 && i <= e2) {
      const n1 = oldCh[i]
      const n2 = newCh[i]
      if (isSameVnode(n1, n2))
        patch(n1, n2, el)
      else
        break
      i++
    }

    while (i <= e1 && i <= e2) {
      const n1 = oldCh[e1]
      const n2 = newCh[e2]
      if (isSameVnode(n1, n2))
        patch(n1, n2, el)
      else
        break
      e1--
      e2--
    }

    if (i > e1) {
      if (i <= e2) {
        while (i <= e2) {
          const nextPos = e2 + 1
          const anchor = nextPos < newCh.length ? newCh[nextPos].el : null
          patch(null, newCh[i], el, anchor)
          i++
        }
      }
    }
    else if (i > e2) {
      if (i <= e1) {
        while (i <= e1) {
          unmount(oldCh[i])
          i++
        }
      }
    }
  }
  function patchChildrend(n1: any, n2: any, el: any) {
    const oldCh = n1 && n1.children
    const newCh = n2.children
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN)
        unmountChildren(oldCh)
      if (oldCh !== newCh)
        hostSetElementText(el, newCh)
    }
    else {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // diff算法
          patchKeyedChildren(oldCh, newCh, el)
        }
        else {
          unmountChildren(oldCh)
        }
      }
      else {
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN)
          hostSetElementText(el, '')

        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN)
          mountChildren(newCh, el)
      }
    }
  }
  function patchElement(n1: any, n2: any) {
    const el = (n2.el = n1.el)
    const oldProps = n1.props
    const newProps = n2.props
    patchProps(oldProps, newProps, el)
    patchChildrend(n1, n2, el)
  }
  function processElement(n1: any, n2: any, container: any, anchor: any = null) {
    if (n1 === null)
      mountElement(n2, container, anchor)
    else
      patchElement(n1, n2)
  }

  function normalize(children: any, i: any) {
    if (isString(children[i])) {
      const vnode = createVnode(Text, null, children[i])
      children[i] = vnode
    }
    return children[i]
  }
  function mountChildren(children: any, el: any) {
    for (let i = 0; i < children.length; i++) {
      const child = normalize(children, i)
      patch(null, child, el)
    }
  }
  function unmount(vnode: any) {
    hostRemove(vnode.el)
  }
  const render = (vnode: any, container: any) => {
    if (vnode === null) {
      if (container._vnode)
        unmount(container._vnode)
    }
    else {
      patch(container._vnode || null, vnode, container)
    }
    container._vnode = vnode
  }
  return { render }
}
