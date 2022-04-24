import './style.css'
// import { reactive, effect, ref, computed } from '@vueki/reactive';

// const a = (window as any).a = ref(1)
// const b = (window as any).b = computed({
//   get() {
//     return a.value + 1
//   },
//   set(newValue: any) {
//     a.value = newValue
//   }
// })

import { render, h, Text, Fragment } from '@vueki/runtime'
const vnode = h(
  'div',
  {
    class: 'a b',
    style: {
      border: '1px solid red',
      fontSize: '14px'
    },
    onClick: () => {
      console.log('click')
    },
    id: 'foo',
    checked: "",
    custom: false
  },
  [
    h('ul', null, [
      h('li', { style: { color: 'red' } }, 1),
      h('li', null, 2),
      h('li', { style: { color: 'blue' } }, 3),
      h(Fragment, null, [h('li', null, '4'), h('li', null, '5')]),
      h('li', null, 2),
    ])
  ]
)

render(vnode, document.body)
