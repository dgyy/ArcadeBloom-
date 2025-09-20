import {zzfx, zzfxM, zzfxP, zzfxX} from "./zzfxm";

var song = [
    [
        [, 0, 500, .04, .07, , 2, .2, .2, -.5, -12, .02, , .1, .1, , .11, .89, .01],
        [3, 0, 43, , , .25, , , , , , , , 2],
        [.3, 0, 900, .02, , .07, 4, 0, , , , , , 4],
        [.5, 0, 500, , , .14, 4, .5, , -.1, 50, , , 3, -4.8, .1, , , , .22]
    ],
    [
        [
            [, , 17, , 15, 13, 12, , 12, 13, 15, , 17, , 10, , 10, , 17, , 15, 13, 12, , 10, 12, 13, 12, 10, 8, 10, , 10, , 29, , 27, 25, 24, , 24, 25, 27, , 29, , 22, , 22, , 29, , 27, 25, 24, 24, 25, 27, 24, 22, 20, , 22, , 22, ,],
            [1, , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , 1, , , , , , , ,],
            [2, -.3, 2, , 1, 1, 2, , 1, 1, 14, , 1, 1, 14, , 2, , 2, , 1, 1, 2, , 1, 1, 2, , 1, 1, 2, , 2, , 2, , 1, 1, 2, , 2, , 2, , 1, 1, 2, , 2, , 1, 1, 2, , 2, 2, 1, , , , , , , , , ,],
            [3, .3, 36, , , , 36, , , , 36, , , , 36, , 36, , 36, , , , 36, , , , 36, , , , 36, , 36, , 36, , , , 36, , , , 36, , , , 36, , 36, , , 36, 36, , , 36, 36, , , 36, 36, , 36, , 36, ,]
        ]
    ],
    [0],
    85,
//     {
//     "title": "Catharian",
//     "instruments": ["Flute", "Bass Drum 2", "Shaker", "LClap"],
//     "patterns": ["Pattern 0"]
// }
]


// Play the song (returns a AudioBufferSourceNode)
export function getbgm() {
    //@ts-ignore
    return zzfxM(song[0], song[1], song[2], 85)
}

export function resumebgm() {
    var tryToResumeAudioContext = function () {
        if (zzfxX.state === 'suspended')
            zzfxX.resume();
        else
            clearInterval(resumeInterval);
    };
    var resumeInterval = setInterval(tryToResumeAudioContext, 400);
}

export function playbgm(bgm: number[][]) {
    return zzfxP(...bgm);
}
