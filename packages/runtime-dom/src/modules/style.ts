export function patchStyle(el, prevValue, nextValue) {
  for (const key in nextValue)
    el.style[key] = nextValue[key]

  if (prevValue) {
    for (const key in prevValue) {
      if (!nextValue[key])
        el.style[key] = ''
    }
  }
}
