// sprities for the js13k 2023 entry
// MIT License - Copyright 2023 Artur Augusto Martins

let colorPallete = {
    ' ': [0,0,0,0],
    0: [0,0,0,0],
	// black
	1: [0,0,0,255],
    // red
    'r': [255,0,0, 255],
    // yellow
    'y': [255,204,0, 255],
    // orange
    'o': [255,170,86, 255],
    // black
    'b': [0,0,0,255],
    // white
    'w': [255,255,255,255],
    // green
    'g': [0, 255, 0, 255],
    // silver
    's': [219, 206, 213, 255],
    // brown
    'm': [114, 77, 36, 255],
    // grey
    'q': [114, 77, 36, 255],
    'x': [20, 20, 20, 10],
	// dark gray
    'd': [105, 105, 105, 255]
}


let monstersSprites = [
    "     r       ",
    "     rr      ",
    "  wwwwr      ",
    "  bwbwr      ",
    " oowww      w",
    "  rrwwwwwwww ",
    "   wwwwwwwwww",
    "   wwwwwwwww ",
    "    wwwwwww  ",
    "    xwwwww   ",
    "   xxyxxyx   ",
    "  xxyyxyyxx  ",
    "   xxxxxxx   "
].map(x => x.split(""))
let monstersSpritesRev = monstersSprites.map(a => [...a].reverse())


let monstersSprites2 = [
    "     r       ",
    "     rr      ",
    "  wwwwr      ",
    "  bwbwr      ",
    " oowww      w",
    "  rrwwwwwwww ",
    "   wwwwwwwwww",
    "   wwwwwwwww ",
    "    wwwwwww  ",
    "    xwwwww   ",
    "   xyyxxyx   ",
    "  xxxxxyyxx  ",
    "   xxxxxxx   "
].map(x => x.split(""))
let monstersSprites2Rev = monstersSprites2.map(a => [...a].reverse())

let monstersSprites3 = [
    "     r       ",
    "     rr      ",
    "  wwwwr      ",
    "  bwbwr      ",
    " oowww      w",
    "  rrwwwwwwww ",
    "   wwwwwwwwww",
    "   wwwwwwwww ",
    "    wwwwwww  ",
    "    xwwwww   ",
    "   xxyxyyx   ",
    "  xxyyxxxxx  ",
    "   xxxxxxx   "
].map(x => x.split(""))
let monstersSprites3Rev = monstersSprites3.map(a => [...a].reverse())



let arrowsSprite = [
        "      r r       ",
        "       rrr      ",
        "       m        ",
        "       m        ",
        "       m        ",
        "       m        ",
        "       m        ",
        "       m        ",
        "       m        ",
        "       m        ",
        "       m        ",                
        "       m        ",
        "       m        ",
        "       m        ",
        "      ss        ",
        "       s        ",
].map(x => x.split(""))

