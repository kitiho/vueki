import { isBoolean } from '@vueki/utils'
import { patchChildren, patchProps } from './patchProps'
import { ShapeFlags } from './vnode'

export function render(vnode, container) {
  const prevVNode = container.__vnode

  if (!vnode) {
    if (prevVNode)
      unmount(prevVNode)
  }
  else {
    patch(prevVNode, vnode, container)
  }

  container._vnode = vnode
}
function unmount(vnode) {
  const { shapFlag, el } = vnode
  if (shapFlag & ShapeFlags.COMPONENT)
    unmountComponent(vnode)
  else if (shapFlag & ShapeFlags.FRAGMENT)
    unmountFragment(vnode)
  else
    el.parentNode.removeChild(el)
}

function unmountComponent(vnode) {
  // todo
}
function unmountFragment(vnode) {
  // todo
}
function processComponent(n1, n2, container) {
  // todo
}
function patch(n1, n2, container) {
  if (n1 && !isSameVNode(n1, n2)) {
    unmount(n1)
    n1 = null
  }
  const { shapFlag } = n2
  if (shapFlag & ShapeFlags.COMPONENT)
    processComponent(n1, n2, container)
  else if (shapFlag & ShapeFlags.TEXT)
    processText(n1, n2, container)
  else if (shapFlag & ShapeFlags.FRAGMENT)
    processFragment(n1, n2, container)
  else
    processElement(n1, n2, container)
}
function processText(n1, n2, container) {
  if (n1) {
    n2.el = n1.el
    n1.el.textContent = n2.children
  }
  else { mountTextNode(n2, container) }
}
function processFragment(n1, n2, container) {

}
function processElement(n1, n2, container) {
  if (n1)
    patchElement(n1, n2)

  else mountElement(n2, container)
}

function isSameVNode(n1, n2) {
  return n1.type === n2.type
}

function mount(vnode, container) {
  const { shapFlag, type, props, children } = vnode
  if (shapFlag & ShapeFlags.ELEMENT)
    mountElement(vnode, container)

  else if (shapFlag & ShapeFlags.TEXT)
    mountTextNode(vnode, container)

  else if (shapFlag & ShapeFlags.FRAGMENT)
    mountFragment(vnode, container)

  else
    mountComponent(vnode, container)
}

function mountElement(vnode: any, container: any) {
  const { type, props, shapFlag, children } = vnode
  const el = document.createElement(type)
  patchProps(null, props, el)
  if (shapFlag & ShapeFlags.TEXT_CHILDREN)
    mountTextNode(vnode, container)
  else if (shapFlag & ShapeFlags.ARRAY_CHILDREN)
    mountChildren(children, container)

  container.appendChild(el)
  vnode.el = el
}
function mountTextNode(vnode: any, container: any) {
  const textNode = document.createTextNode(vnode.children)
  container.appendChild(textNode)
  vnode.el = textNode
}
function mountFragment(vnode: any, container: any) {
  mountChildren(vnode, container)
}
function mountComponent(vnode: any, container: any) {
  throw new Error('Function not implemented.')
}

function mountChildren(children, container) {
  children.forEach((child) => {
    patch(null, child, container)
  })
}

function patchElement(n1, n2) {
  n2.el = n1.el
  patchProps(n1.props, n2.props, n2.el)
  patchChildren(n1, n2, n2.el)
}
