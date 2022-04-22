import './style.css'
import { reactive, effect, ref, computed } from '@vueki/reactive';

const a = (window as any).a = ref(1)
const b = (window as any).b = computed({
  get() {
    return a.value + 1
  },
  set(newValue: any) {
    a.value = newValue
  }
})
