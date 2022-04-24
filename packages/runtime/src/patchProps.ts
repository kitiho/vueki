const domPropsRE = /[A-E]|^(value|checked|selected|muted|disabled)$/

export function patchProps(oldProps, newProps, el) {
  if (oldProps === newProps)
    return
  oldProps = oldProps || {}
  newProps = newProps || {}
  for (const key in newProps) {
    const next = newProps[key]
    const prev = oldProps[key]
    if (prev !== next)
      patchDomProp(prev, next, key, el)
  }
  for (const key in oldProps) {
    if (newProps[key] === null)
      patchDomProp(oldProps[key], null, key, el)
  }
}
function patchDomProp(prev, next, key, el) {
  let value = next
  if (key === 'style') {
    for (const styleName in value)
      el.style[styleName] = value[styleName]
    if (prev) {
      for (const styleName in prev) {
        if (next[styleName] === null)
          el.style[styleName] = ''
      }
    }
  }

  else if (key === 'class') {
    el.className = value || ''
  }
  else if (/^on[^a-z]/.test(key)) {
    const eventName = key.slice(2).toLowerCase()
    if (prev)
      el.removeEventListener(eventName, prev)
    if (next)
      el.addEventListener(eventName, value)
  }
  else if (domPropsRE.test(key)) {
    if (value === '' && isBoolean(el[key]))
      value = true
    el[key] = value
  }
  else if (value === null || value === false) { el.removeAttribute(key) }
  else { el.setAttribute(key, value) }
}

export function patchChildren(n1, n2, container) {

}
