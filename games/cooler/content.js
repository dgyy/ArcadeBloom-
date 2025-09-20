import fs from 'fs'
import chokidar from 'chokidar'
import pack from './_pack.js'
import pack_levels from './_pack_levels.js'

const ldtk_content = () => {
  pack_levels().catch(e => {
    console.warn('failed to pack levels.', e)
  })
}

const ase_content = () => {
  pack().catch(e => {
    console.warn('failed to pack.', e)
  })
}


chokidar.watch(['./content/sprites/*.ase'
], { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 500 } })
  .on('all', (event, path) => ase_content())

ase_content()


chokidar.watch(['./content/levels/*.ldtk'
], { ignoreInitial: true, awaitWriteFinish: { stabilityThreshold: 500 } })
  .on('all', (event, path) => ldtk_content())

ldtk_content()