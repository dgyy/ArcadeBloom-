import Time from './time'

type Experience = string

export class Progress {

  static make = () => new Progress()

  static from_code = (code: string) => {
    let res = new Progress()
    return res
  }

  get next_message() {

    if (this._elapsed < 15) {
      return 'iMi<3^:p^<3iMi'
    }

    if (!this.experience.includes('pickup')) {
      return '"x" to pickup'
    }

    return 'joy\'s are us'
  }

  get code() {
    return 'hello'
  }

  get rank() {
    return 0
  }

  get time_elapsed() {
    return Math.ceil(this._elapsed)
  }

  _elapsed = 0
  time_left = 120 
  time_begin = false

  get last_ten() {
    return this.time_left <= 13
  }

  get times_up() {
    return this.time_left === 0
  }


  experience = ['play']


  track(experience: Experience) {
    this.experience.push(experience)
  }

  update() {

    this._elapsed += Time.delta

    if (this.time_begin) {
      this.time_left -= Time.delta
      if (this.time_left < 0) {
        this.time_left = 0
      }
    }
  }
}

function test() {
  let ps = [
    new Progress(),
    new Progress()
  ]

  if (ps.every(s => (Progress.from_code(s.code).code === s.code))) {
    console.log('codes ok')
  } else {
    console.log('codes wrong')
  }
}

test()
