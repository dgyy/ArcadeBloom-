
export default class Color {

  static hex = (rgb: number) => new Color((rgb & 0xff0000) >> 16,
                                          (rgb & 0x00ff00) >> 8,
  (rgb & 0x0000ff),
  255)

  static lightpurple = Color.hex(0xb4aec5)
  static lightblue = Color.hex(0x4181bd)
  static background = Color.hex(0xb4aec5)
  static light = Color.hex(0xeeeaf6)
  static  darkblue = Color.hex(0x183452)
  static darkred = Color.hex(0xb42c73)
  static red = Color.hex(0xde505a)
  static lightred = Color.hex(0xde505a)
  static green = Color.hex(0x20eea4)
  static purple = Color.hex(0x8b81b4)
  static darkpurple = Color.hex(0x735973)
  static darkgreen = Color.hex(0x00ae8b)
  static grey = Color.hex(0xcdd2e6)
  static white = Color.hex(0xeeeaf6)



  static all = [
    Color.background,
    Color.darkblue,
    Color.light,
    Color.lightblue,
    Color.red,
    Color.darkred,
    Color.green,
    Color.purple
  ]


  static lerp = (a: Color, b: Color, t: number) => {
    if (t < 0) { t = 0 }
    if (t > 1) { t = 1 }

    return new Color(a.r + (b.r - a.r) * t,
                     a.g + (b.g - a.g) * t,
                     a.b + (b.b - a.b) * t,
                     a.a + (b.a - a.a) * t)
  }

  get css() {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`
  }

  constructor(
    readonly r: number, 
    readonly g: number, 
    readonly b: number, 
    readonly a: number) {}
}


