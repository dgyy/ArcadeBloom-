export type EventType = 'tick' | 'split' | 'play' | 'wave' | 'web3' | 'killed' | 'toslice';

const tickEvent = new CustomEvent('tick', { detail: { data: {} } });
const playEvent = new CustomEvent('play', { detail: { data: {} } });
const splitEvent = new CustomEvent('split', { detail: { data: {} } });
const waveEvent = new CustomEvent('wave', { detail: { data: {} } });
const web3Event = new CustomEvent('web3', { detail: { data: {} } });
const killedEvent = new CustomEvent('killed', { detail: { data: {} } });
const toSliceEvent = new CustomEvent('toslice', { detail: { data: {} } });

export function emit(eventType: EventType, data?: any) {
  const evt = getEvent(eventType);
  evt.detail.data = data;
  window.dispatchEvent(evt);
}
export function on(eventType: EventType, callback) {
  window.addEventListener(eventType, callback);
}
export function off(eventType: EventType, callback) {
  window.removeEventListener(eventType, callback);
}

function getEvent(eventType: EventType) {
  switch (eventType) {
    case 'tick':
      return tickEvent;
    case 'split':
      return splitEvent;
    case 'play':
      return playEvent;
    case 'wave':
      return waveEvent;
    case 'web3':
      return web3Event;
    case 'killed':
      return killedEvent;
    case 'toslice':
      return toSliceEvent;
  }
}
