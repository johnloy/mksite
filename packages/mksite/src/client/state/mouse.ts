// @ts-nocheck
import { map } from "nanostores";

function debounce(fn) {
  let raf;
  return (...args) => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      fn(...args);
      raf = undefined;
    });
  };
}

export const mousePosition = map({
  x: null,
  y: null
})

const updateMousePosition = debounce((event) => {
  mousePosition.set({
    x: event.pageX,
    y: event.pageY
  })
})

if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', updateMousePosition)
}
