import { html2canvas } from './util/html2canvas'
import { t, plane } from './util/three'
import { create } from './util/dom'
import { state } from './stores'

let introHTML = `
<div class='h-[900px] w-[1100px] text-5xl'>
  <p class='text-6xl'>Hail, my Liege.
  <p class='mt-0 mb-16'>Thou art The King - if perchance you forgot again today.
  <p>I must apprise thee that your chosen people are envied
  <p class='mt-0 mb-16'>for being, well, chosen.
  <p>Please muster thy utmost valor to defend them,
  <p class='mt-0 mb-16'>they're all really good chaps once you get past the smell.
  <p>Sincerely, thy most humble and abasing subject,
  <p>Humphrey Bumblebuns, XO
</div>`

let tutorialHTML = `
<div class='h-[900px] w-[1100px] text-5xl'>
  <p>Pull the trigger on thy divine scepter to fire lasers. Hallowed by thy aim.
  <p>Lobby thy royal orb at foes, and they shall surely bend the knee before the might of thy five megaton explosions.
</div>
`

let bg = plane(0.4, 0.4, { color: '#fff' })
bg.position.set(0, 1, 0)
bg.rotation.x = -Math.PI / 4

let container = create('div')
document.body.append(container)
container.className = 'absolute -top-full -left-full px-24 py-24'

state.subscribe(current => {
  bg.visible = false
  bg.clear()

  if (current === 'intro') container.innerHTML = introHTML
  else if (current === 'tutorial') container.innerHTML = tutorialHTML
  else return

  let canvas = html2canvas(container)
  let map = new t.CanvasTexture(canvas)
  map.anisotropy = 4

  let text = plane(0.4, 0.4, { map, transparent: true })
  text.position.z = 0.001
  
  bg.add(text)
  bg.visible = true
})

export let parchment = (scene: THREE.Scene) => scene.add(bg)
