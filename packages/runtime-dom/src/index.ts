import { createRenderer } from '@vueki/runtime-core'
import { nodeOps } from './nodeOps'
import { patchProps } from './patchProp'

export const renderOptions = Object.assign(nodeOps, { patchProps })

export function render(vnode: any, container: any) {
  createRenderer(renderOptions).render(vnode, container)
}

export * from '@vueki/runtime-core'
