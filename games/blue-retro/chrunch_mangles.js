import fs from 'fs'

let colors = [
  'background',
  'darkblue',
  'light',
  'lightblue',
  'darkblue',
  'red',
  'darkred',
  'green',
  'purple',
  'darkpurple',
  'lightpurple'
]


let reserved = [...['experience', '_scheds', '_elapsed', 'from_code', 'cluster', 'make', 'current_frame', '_current_frame', 'ticks_per_second', '__elapsed', 'hline', 'vline', 'seconds', 'hex', 'css', 'h', 'lerp', '_music_onoff', 'time_left'], ...colors]



let words = reserved



let path = process.argv[2]


function main(path) {

console.log('chrunching ', path)

let contents = fs.readFileSync(path, { encoding: 'utf8' })

let before = contents.length
contents = chrunch(contents)
let after = contents.length

  console.log(contents)
  console.log(before, after)

}

function hashCode(s) {
  for (var h = 0, i = 0; i < s.length; h &= h)
    h = 31 * h + s.charCodeAt(i++);
  return h;
}

function hash_word(word) {
  let hash = String(hashCode(word)).slice(0, 2)
  return `XY${hash}`
}

function chrunch(str) {
  words.forEach(word =>
    str = str.replace(word, hash_word(word)))
  return str
}



main(path)
