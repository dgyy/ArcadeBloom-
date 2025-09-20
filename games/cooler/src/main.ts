import { make_graphics } from './graphics'
import { SceneManager } from './scenes'


function my_app(el: HTMLElement) {

  let g = make_graphics(320, 180, true)

  el.appendChild(g.canvas)

  SceneManager(g)
}


my_app(document.getElementById('app')!)