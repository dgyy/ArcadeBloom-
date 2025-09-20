export const sleep = (t) => new Promise((res) => setTimeout(res, t));

export const getPointerPos = (el, e) => ({ x: (e.clientX - el.getBoundingClientRect().left) / el.offsetWidth * 100, y: (e.clientY - el.getBoundingClientRect().top) / el.offsetHeight * 100 });

export const dist = (a, b) => Math.sqrt((Math.pow(a.x - b.x, 2)) + (Math.pow(a.y - b.y, 2)));

export const setElProps = (el, props) => Object.keys(props).forEach(prop => {
  el.style.setProperty(`--${prop}`, props[prop]);
  el.dataset[prop] = props[prop];
});
