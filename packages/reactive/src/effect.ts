// 全局变量 记录当前正在执行的副作用函数
const effectStacks: any[] = []
let activeEffect: () => any
// 记录收集的依赖
const targetMap = new WeakMap()

export function effect(fn: Function, options: { lazy?: boolean; scheduler?: () => any } = {}) {
  const effectFn = () => {
    try {
      activeEffect = effectFn
      effectStacks.push(effectFn)
      return fn()
    }
    finally {
      effectStacks.pop()
      activeEffect = effectStacks[effectStacks.length - 1]
    }
  }
  if (!options.lazy)
    effectFn()

  effectFn.scheduler = options.scheduler
  return effectFn
}

export function track(target: object, key: string | symbol) {
  if (!effectStacks.length)
    return
  let depsMap = targetMap.get(target)
  if (!depsMap)
    targetMap.set(target, depsMap = new Map())
  let deps = depsMap.get(key)
  if (!deps)
    depsMap.set(key, deps = new Set())
  deps.add(activeEffect)
}

export function trigger(target: object, key: string | symbol) {
  const depsMap = targetMap.get(target)
  if (!depsMap)
    return
  const deps = depsMap.get(key)
  if (!deps)
    return
  deps.forEach((effect: { (): void; (): void; scheduler: any }) => {
    if (effect.scheduler)
      effect.scheduler()
    else
      effect()
  })
}
