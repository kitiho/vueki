export function isObject(target: any): target is Object {
    return target !== null && typeof target === 'object';
}
