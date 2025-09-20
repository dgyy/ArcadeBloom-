import content_page0 from '../content/out_0.png'
//import content_json0 from '../content/out_0.json'
import content_con0 from '../content/out_0.con?raw'
import levels_json from '../content/levels.con.json'

//const content_page0 = 'out_0.png'

function load_image(path: string): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    let res = new Image()
    res.onload = () => resolve(res)
    res.src = path
  })
}

function decon(con: string) {
  return con.split(/\r?\n\r?\n\r?\n/).map(ntp => {
    let [ name, _tags, _packs ] = ntp.split(/\r?\n\r?\n/)

    let tags = _tags.split(/\r?\n/).map(_ => {
      let [from, to, name] = _.split('*')
      return { from: parseInt(from), to: parseInt(to), name }
    })

    let packs = _packs.split(/\r?\n/).map(_ => {
      let [fx, fy, fw, fh, sx, sy, sw, sh] = mega_expand(_.split('*').map(_ => parseInt(_)))
      return { fx, fy, fw, fh, sx, sy, sw, sh }
    })

    return {
      name,
      tags,
      packs
    }
  })
}

function mega_expand(v: number[]) {
  let [wh, px, py] = v

  let x = 0,
    y = 0,
    [w, h] = (wh === 0 ? [16, 16] :
              (wh === 1 ? [32,16] :
               (wh === 2 ? [80,80] :
                (wh === 3 ? [160, 160] :
                (wh === 4 ? [80, 30] :
                  (wh === 5 ? [32, 32] :
                 [0, 0]))))))

  let [pw, ph] = [w, h]


  return [x, y, w, h, px, py, pw, ph]
}

type ContentTag = {
  name: string,
  from: number,
  to: number
}

type ContentPack = {
  fx: number,
  fy: number,
  fw: number,
  fh: number,
  sx: number,
  sy: number,
  sw: number,
  sh: number
}

type ContentInfo = {
  name: string,
  tags: ContentTag[],
  packs: ContentPack[]
}

type N2 = [number, number]
type LevelTile = { px: N2, src: N2 }

type LevelInfo = {
  name: string,
  y: number,
  w: number,
  h: number,
  te: LevelTile[]
}

function decon_levels(levels: any): LevelInfo[] {
  function decodeBase64ToArrayBuffer(base64String: string) {
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new Uint16Array(bytes.buffer);
  }

  function decode_level_data(data: string) {

    function decode_src(a: number) {
      let x = a % 1024
      let y = Math.floor(a / 1024)
      return [x * 8, y * 8]
    }

    let res = []
    let buffer = decodeBase64ToArrayBuffer(data)
    for (let offset = 0; offset < buffer.length;) {
      let i = buffer[offset]
      offset ++
      let l = buffer[offset]
      offset++

      let g = [...buffer.slice(offset, offset + l)]
      offset+=l

      res.push(...g.map(g => ({ src: decode_src(i), px: decode_src(g) })))
    }
    return res
  }

  return levels.map((level: any) => {

    let { n, y,  w, h, te } = level

    return {
      name: n, y, w, h, te: decode_level_data(te)
    }
  })
}

class Content {
  

  image!: HTMLImageElement
  info!: ContentInfo[]

  levels!: LevelInfo[]
  tiles!: ContentPack

  async load() {
    this.image = await load_image(content_page0)
    this.info = decon(content_con0)

    this.tiles = this.info.find(_ => _.name === 'tiles')!.packs[0]


    this.levels = decon_levels(levels_json)
  }

  get_levels_of_type(t: number) {
    return this.levels.filter(_ => _.y === t * 128)
  }

}

export default new Content()