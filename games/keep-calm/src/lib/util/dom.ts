/* eslint-disable @typescript-eslint/no-explicit-any */

export let create = <T = HTMLElement>(
  tag: string,
  attribs?: Record<string, any>,
  events?: Record<string, EventListenerOrEventListenerObject>
): T => {
  let el = document.createElement(tag)
  for (let attr in attribs) attrib(el, attr, attribs[attr])
  for (let event in events) on(el, event, events[event]!)
  return el as T
}

export let attrib = (
  el: HTMLElement,
  attr: string,
  value: any
) => 
  el.setAttribute(attr, value as string)

export let on = (
  el: HTMLElement,
  event: string,
  fn: EventListenerOrEventListenerObject
) =>
  el.addEventListener(event, fn)

export let query = (selectors: string) =>
  document.querySelector(selectors)
