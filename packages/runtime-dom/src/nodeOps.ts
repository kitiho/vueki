export const nodeOps = {
  insert: (child: any, parent: { insertBefore: (arg0: any, arg1: any) => void; appendChild: (arg0: any) => void }, anchor: any) => {
    if (anchor)
      parent.insertBefore(child, anchor)

    else
      parent.appendChild(child)
  },
  remove: (child: { parentNode: any }) => {
    const parent = child.parentNode
    if (parent)
      parent.removeChild(child)
  },
  createElement: (tag: any, isSVG: any) => {
    if (isSVG)
      return document.createElementNS('http://www.w3.org/2000/svg', tag)

    else
      return document.createElement(tag)
  },
  createText: (text: string) => document.createTextNode(text),
  createComment: (text: string) => document.createComment(text),
  setText: (node: { nodeValue: any }, text: any) => {
    node.nodeValue = text
  },
  setElementText: (el: { textContent: any }, text: any) => {
    el.textContent = text
  },
  parentNode: (node: { parentNode: any }) => node.parentNode,
  nextSibling: (node: { nextSibling: any }) => node.nextSibling,
  querySelector: (selector: any) => document.querySelector(selector),
  setScopeId: (el: { setAttribute: (arg0: any, arg1: string) => any }, id: any) => el.setAttribute(id, ''),
  cloneNode: (el: { cloneNode: (arg0: boolean) => any }) => el.cloneNode(true),
}
