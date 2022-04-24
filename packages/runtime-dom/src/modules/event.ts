export function patchEvent(el, eventName, prevValue, nextValue) {
  let invokers = el._vei || (el._vei = {})
  let exist = invokers[eventName]
  if (exist && nextValue) {
    exist.value = nextValue
  } else {
    let event = eventName.slice(2).toLowerCase()
    if (nextValue) {
      const invoker = invokers[eventName] = createInvoker(nextValue)
      el.addEventListener(event, invoker)
    }else if(exist){
      el.removeEventListener(event, exist)
      invokers[eventName] = undefined
    }
  }
}

function createInvoker(callback) {
  const invoker = (e) => invoker.value(e)
  invoker.value = callback
  return invoker
}
