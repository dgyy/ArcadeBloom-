import { traversePath } from './utils.js';

const callbacks = [];
window.callbacks = callbacks;

export function on(path, fn) {
  const callback = traversePath(callbacks, path);
  callback.push(fn);
}

export function emit(path, ...args) {
  traversePath(callbacks, path).map(fn => fn(...args));
}