import { group } from 'console'
import fs from 'fs'
import { Buffer } from 'node:buffer'

export default async function pack_levels() {

    let levels = []

  await Promise.all(['./content/levels'].map(_ =>
    ldtk_files(_)
    .then(_ => _.map(_ => {
        levels.push(...extract_levels_ldtk(_))
    }))
  ))


  let res = {
    levels
  }


  fs.writeFileSync('./content/levels.json', JSON.stringify(res))
  fs.writeFileSync('./content/levels.con.json', JSON.stringify(condensed(res)))

  console.log('levels written.')
}

function extract_levels_ldtk({ name, json }) {

    return json['levels'].map(level => {
        let layer = level['layerInstances'][0]
        let w = layer['__cWid']
        let h = layer['__cHei']
        let y = level['worldY']
        let tiles = layer['autoLayerTiles'].map(tile => {
            let px = tile['px']
            let src = tile['src']

            return { px, src }
        })

        return { name: level.identifier, y, w, h, tiles }
    })
}

function condensed(json) {
    function encode_i_src([x, y]) {
        return (y / 8) * 1024 + (x / 8)
    }

    function encode_px([x, y]) {
        return (y / 8) * 1024 + (x / 8)
    }

    let { levels } = json

    return levels.map(_ => {
        let { name, y, w, h, tiles } = _

        let grouped_by_src = new Map()

        let total_src = 0
        let total_pxs = 0
        tiles.map(_ => {
            let { px, src } = _

            let i = encode_i_src(src)

            if (i > Math.pow(2, 16)) {
                return
            }

            let res = grouped_by_src.get(i) ?? []
            if (res.length === 0) {
              grouped_by_src.set(i, res)
              total_src++
            }

            res.push(encode_px(px))
            total_pxs++
        })

        let size = grouped_by_src.size * 4 + total_pxs * 2

        let te = Buffer.alloc(size)
        let offset = 0

        for (let [i, group] of grouped_by_src.entries()) {
            te.writeUInt16LE(i, offset)
            offset += 2
            te.writeUInt16LE(group.length, offset)
            offset += 2

            group.forEach(px => { 
                te.writeUInt16LE(px, offset)
                offset += 2
            })
        }

        return { n: name, y, w, h, te: te.toString('base64')  }
    })
}

function ldtk_files(folder) {
  return new Promise(resolve => {
    fs.readdir(folder, (err, files) => {
      Promise.all(files.filter(_ => _.match(/\.ldtk$/))
        .map(file => new Promise(_resolve => {
          fs.readFile([folder, file].join('/'), (err, data) => {
            if (err) {
              throw err
            }
            let name = file.split('.')[0]
            _resolve({ name, json: JSON.parse(data)})
          })
        }))).then(resolve)
    })
  })
}