export function hasChanged(oldValue: any, value: any) {
  return oldValue !== value && (oldValue === oldValue || value === value)
}
