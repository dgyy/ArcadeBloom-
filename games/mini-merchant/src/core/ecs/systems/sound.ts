import { Entity, System } from '@/lib/ecs'
import { zzfx } from '@/lib/zzFx'
import { GameData } from '../component'
import { Events } from '../events'

export class SoundSystem extends System {
  inited = false
  state: {
    soundsPlaying: {
      [key: string]: number
    },
    muted: boolean,
    volume: number
  } = {
      soundsPlaying: {

      },
      muted: false,
      volume: 0.03
    }

  sounds = {
    // eslint-disable-next-line
    [Events.gether]: [2.24,,53,,,.07,3,.57,,,,,,1.2,,.3,,.46,,.01],
    // eslint-disable-next-line
    [Events.collide]: [[1.31, , 200, , 0.02, 0.01, 2, 2.1, , , , , , , -242, , , 0.53], 500],

    // eslint-disable-next-line
    [Events.drop]: [1.1,,332,,.06,.14,1,.31,,8,,,,,,.1,,.49,.01,.03],

    // eslint-disable-next-line
    [Events.notSold]: [[1.32,, 164,, 0.24, 0.08, 4, 1.14,,,,,, 0.1, 72,, 0.27,, 0.18, 0.43], 2000],

    // eslint-disable-next-line
    [Events.sold]: [,,684,.05,.23,.2,1,1.09,3.9,-0.8,-9,.05,,,,,,.49,.18,.13],
    [Events.newCustomer]: [1.02,, 319, 0.08, 0.12, 0.26, 1, 0.43, 3.5,,,, 0.19,,, 0.1,, 0.47, 0.16],
    // eslint-disable-next-line
    [Events.pickup]: [
      ,
      ,
      435,
      0.02,
      0.07,
      0.06,
      1,
      1.6,
      -12,
      ,
      ,
      ,
      ,
      ,
      ,
      ,,
      0.91,
      0.01
    ]
  }

  init () {
    // @ts-ignore
    this.ecs.ee.on(Events.soundMute, () => {
      this.state.muted = !this.state.muted
    })

    for (const s in this.sounds) {
      this.state.soundsPlaying[s] = 0
      this.ecs.ee.on(s, () => {
        // @ts-ignore
        let sound = this.sounds[s]
        let t = 300
        // @ts-ignore
        if (this.sounds[s].length === 2) {
          t = sound[1]
          sound = sound[0]
        }

        if (
          this.state.soundsPlaying[s] <= 0
        ) {
          zzfx(...sound)
          this.state.soundsPlaying[s] = t
        }
      })
    }
  }

  componentsRequired = new Set<Function>([GameData])

  update (entities: Set<Entity>): void {
    if (!this.inited) {
      this.init()
      this.inited = true
    }
    // update volume
    // @ts-ignore
    window.zzfxV = this.state.volume

    for (const key in this.state.soundsPlaying) {
      // @ts-ignore
      if (this.state.soundsPlaying[key] > 0) {
        // @ts-ignore
        this.state.soundsPlaying[key] -= this.ecs.currentDelta
      }
    }
  }
}
