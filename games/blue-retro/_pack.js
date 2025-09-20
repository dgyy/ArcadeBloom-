import fs from 'fs'
import { ImageSave, Rect, Packer, aseprite } from 'aset'
import jspngopt from 'jspngopt'
import imagemin from 'imagemin'
import imageminAdvpng from 'imagemin-advpng'



export default async function pack() {

  let packer = new Packer(0)

  let sprites = []

  await Promise.all(['./content/sprites'].map(_ =>
    ase_files(_)
    .then(_ => _.map(({name, ase}) => {

      let frames = ase.frames.map(frame => ({duration: frame.duration}))
      let packs =  ase.frames.map(frame => packer.add(frame.image))
      let { tags } = ase

      sprites.push({ name, packs, tags, frames })
    }))))




  packer.pack()

  sprites = sprites.map(({ name, packs, tags, frames }) => ({
    name,
    tags,
    packs: packs.map((_,i) => ({ frame: _.frame, packed: _.packed, meta: frames[i] }))
  }))


  let res = {
    sprites
  }

  let opt = new jspngopt.Optimizer()
  let opt_png = opt.bufferSync(packer.pages[0].png_buffer)

  fs.writeFileSync('./content/out_0.png', opt_png)
  fs.writeFileSync('./content/out_0.json', JSON.stringify(res))
  fs.writeFileSync('./content/out_0.con', condensed(res))


  await imagemin(['./content/out_0.png'], {
    plugins: [ imageminAdvpng()]
  })


  console.log('content written.')

}

function condensed(json) {
  let { sprites } = json

  return sprites.map(({
    name,
    tags,
    packs
  }) => {

    let tt = tags.map(({
      from, to, name
    }) => [from, to, name].join('*')).join('\n')


    let pp = packs.map(({
      frame: { x, y, w, h },
      packed: { x: px, y: py, w: pw, h: ph },
      meta: { duration }
    }) => mega_shrink([x,y,w,h,px,py,pw,ph]).join('*')).join('\n')

    return [name, tt, pp].join('\n\n')
  }).join('\n\n\n')
}

// src/content.ts -> mega_extend
function mega_shrink(v) {
  let [x,y,w,h,px,py,pw,ph] = v

  // assume
  // x,y = 0
  // w,h = 16,16 | 32,16 | 80,80
  // pw,ph = w,h
  // px,py = px,py

  let code_wh = (w === 16 ? 0 : 
    (w === 32 ? 1 :
    (w === 80 ? 2 : 3)))
  return [code_wh,px,py]
}


function ase_files(folder) {
  return new Promise(resolve => {
    fs.readdir(folder, (err, files) => {
      Promise.all(files.filter(_ => _.match(/\.ase$/))
        .map(file => new Promise(_resolve => {
          fs.readFile([folder, file].join('/'), (err, data) => {
            if (err) {
              throw err
            }
            let name = file.split('.')[0]
            _resolve({ name, ase: aseprite(data)})
          })
        }))).then(resolve)

    })
  })
}
