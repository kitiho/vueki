import { ShapeFlags } from './vnode'

export function render(vnode, container) {
  mount(vnode, container)
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
  const { type, props } = vnode
  const el = document.createElement(type)
  mountProps(props, el)
  mountChildren(vnode, el)
  container.appendChild(el)
}
function mountTextNode(vnode: any, container: any) {
  const textNode = document.createTextNode(vnode.children)
  container.appendChild(textNode)
}
function mountFragment(vnode: any, container: any) {
  mountChildren(vnode, container)
}
function mountComponent(vnode: any, container: any) {
  throw new Error('Function not implemented.')
}

function mountChildren(vnode, container) {
  const { shapFlag, children } = vnode
  if (shapFlag & ShapeFlags.TEXT_CHILDREN)
    mountTextNode(vnode, container)
  else if (shapFlag & ShapeFlags.ARRAY_CHILDREN)
    children.forEach(child => mount(child, container))
}

const domPropsRE = /[A-E]|^(value|checked|selected|muted|disabled)$/

function mountProps(props, el) {
  if (props) {
    for (const key in props) {
      const value = props[key]
      if (key === 'style') {
        for (const styleName in value)
          el.style[styleName] = value[styleName]
      }
      else if (key === 'class') {
        el.className = value
      }
      else if (/^on[^a-z]/.test(key)) {
        const eventName = key.slice(2).toLowerCase()
        el.addEventListener(eventName, value)
      }
      else if (domPropsRE.test(key)) {
        el[key] = value
      }
      else {
        el.setAttribute(key, value)
      }
    }
  }
}
