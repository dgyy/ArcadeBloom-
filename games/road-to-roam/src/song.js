import { CPlayer } from './small-player';
// This music has been exported by SoundBox. You can use it with
// http://sb.bitsnbites.eu/player-small.js in your own product.

// See http://sb.bitsnbites.eu/demo.html for an example of how to
// use it in a demo.

// Song data
var song = {
    songData: [
        { // Instrument 0
            i: [
                2, // OSC1_WAVEFORM
                48, // OSC1_VOL
                128, // OSC1_SEMI
                0, // OSC1_XENV
                0, // OSC2_WAVEFORM
                201, // OSC2_VOL
                128, // OSC2_SEMI
                0, // OSC2_DETUNE
                0, // OSC2_XENV
                0, // NOISE_VOL
                0, // ENV_ATTACK
                3, // ENV_SUSTAIN
                60, // ENV_RELEASE
                0, // ENV_EXP_DECAY
                0, // ARP_CHORD
                0, // ARP_SPEED
                0, // LFO_WAVEFORM
                195, // LFO_AMT
                6, // LFO_FREQ
                1, // LFO_FX_FREQ
                2, // FX_FILTER
                135, // FX_FREQ
                0, // FX_RESONANCE
                0, // FX_DIST
                32, // FX_DRIVE
                60, // FX_PAN_AMT
                6, // FX_PAN_FREQ
                60, // FX_DELAY_AMT
                6 // FX_DELAY_TIME
            ],
            // Patterns
            p: [1, 2, 1, 3],
            // Columns
            c: [
                {
                    n: [147, , , , , , 149, , , 151, , , , , 152, 151, , , 149, , , , , , 146, , , 142, , , , , 144, 146],
                    f: []
                },
                {
                    n: [147, , , , , , 144, , , 144, , , , , 143, 144, , , 146, , , , , , 143, , , 139, , , , , , 144],
                    f: []
                },
                {
                    n: [147, , , , , , 144, , , 143, , , , , 141, 143, , , 144, , , , , , , , , 144],
                    f: []
                }
            ]
        },
        { // Instrument 1
            i: [
                2, // OSC1_WAVEFORM
                100, // OSC1_VOL
                128, // OSC1_SEMI
                0, // OSC1_XENV
                3, // OSC2_WAVEFORM
                201, // OSC2_VOL
                128, // OSC2_SEMI
                0, // OSC2_DETUNE
                0, // OSC2_XENV
                0, // NOISE_VOL
                5, // ENV_ATTACK
                6, // ENV_SUSTAIN
                59, // ENV_RELEASE
                0, // ENV_EXP_DECAY
                0, // ARP_CHORD
                0, // ARP_SPEED
                0, // LFO_WAVEFORM
                195, // LFO_AMT
                6, // LFO_FREQ
                1, // LFO_FX_FREQ
                2, // FX_FILTER
                135, // FX_FREQ
                0, // FX_RESONANCE
                0, // FX_DIST
                32, // FX_DRIVE
                21, // FX_PAN_AMT
                6, // FX_PAN_FREQ
                29, // FX_DELAY_AMT
                6 // FX_DELAY_TIME
            ],
            // Patterns
            p: [4, 5, 4, 6],
            // Columns
            c: [
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [120, , , , , , 115, , , 132, , , , , , , , , 118, , , , , , 113, , , 130],
                    f: []
                },
                {
                    n: [116, , , , , , 111, , , 135, , , , , , , , , 115, , , , , , 110, , , 134],
                    f: []
                },
                {
                    n: [128, , , , , , 123, , , 122, , , , , , 119, , , 120, , , 115, , , 111, , , 108],
                    f: []
                }
            ]
        },
        { // Instrument 2
            i: [
                3, // OSC1_WAVEFORM
                15, // OSC1_VOL
                128, // OSC1_SEMI
                0, // OSC1_XENV
                3, // OSC2_WAVEFORM
                77, // OSC2_VOL
                128, // OSC2_SEMI
                0, // OSC2_DETUNE
                0, // OSC2_XENV
                0, // NOISE_VOL
                5, // ENV_ATTACK
                6, // ENV_SUSTAIN
                58, // ENV_RELEASE
                0, // ENV_EXP_DECAY
                0, // ARP_CHORD
                0, // ARP_SPEED
                0, // LFO_WAVEFORM
                195, // LFO_AMT
                6, // LFO_FREQ
                1, // LFO_FX_FREQ
                2, // FX_FILTER
                135, // FX_FREQ
                0, // FX_RESONANCE
                0, // FX_DIST
                32, // FX_DRIVE
                59, // FX_PAN_AMT
                6, // FX_PAN_FREQ
                120, // FX_DELAY_AMT
                2 // FX_DELAY_TIME
            ],
            // Patterns
            p: [7, 8, 7, 9],
            // Columns
            c: [
                {
                    n: [156, , , 168, 163, 159, 156, , , 168, 163, 159, 156, , , 168, 163, 159, 156, , , 168, 163, 159, 156, , , 168, 163, 159, 156, , , 168, 163, 159],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [, , , 144, , , , , , , , , , , , , , , , , , 142, , , , , , , , , , , , , , , , , , 147, , , , , , , , , , , , , , , , , , 146, , , , , , , , , , , , , , , , , , 151, , , , , , , , , , , , , , , , , , 149],
                    f: []
                },
                {
                    n: [, , , 140, , , , , , , , , , , , , , , , , , 139, , , , , , , , , , , , , , , , , , 144, , , , , , , , , , , , , , , , , , 143, , , , , , , , , , , , , , , , , , 147, , , , , , , , , , , , , , , , , , 146],
                    f: []
                },
                {
                    n: [, , , 140, , , , , , , , , 139, , , , , , 144, , , , , , , , , , , , , , , , , , , , , 144, , , , , , , , , 143, , , , , , 147, , , , , , , , , , , , , , , , , , , , , 147, , , , , , , , , 146, , , , , , 151],
                    f: []
                }
            ]
        },
        { // Instrument 3
            i: [
                0, // OSC1_WAVEFORM
                255, // OSC1_VOL
                116, // OSC1_SEMI
                79, // OSC1_XENV
                0, // OSC2_WAVEFORM
                255, // OSC2_VOL
                116, // OSC2_SEMI
                0, // OSC2_DETUNE
                83, // OSC2_XENV
                0, // NOISE_VOL
                9, // ENV_ATTACK
                13, // ENV_SUSTAIN
                75, // ENV_RELEASE
                13, // ENV_EXP_DECAY
                0, // ARP_CHORD
                0, // ARP_SPEED
                0, // LFO_WAVEFORM
                0, // LFO_AMT
                0, // LFO_FREQ
                0, // LFO_FX_FREQ
                2, // FX_FILTER
                14, // FX_FREQ
                0, // FX_RESONANCE
                0, // FX_DIST
                32, // FX_DRIVE
                0, // FX_PAN_AMT
                0, // FX_PAN_FREQ
                0, // FX_DELAY_AMT
                0 // FX_DELAY_TIME
            ],
            // Patterns
            p: [10, 10, 10, 11],
            // Columns
            c: [
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [139, , , , , , 139, , , , , , , , , , , , 139, , , , , , 139],
                    f: []
                },
                {
                    n: [139, , , , , , , , , , , , 139, , , , , , 139, , , 139],
                    f: []
                }
            ]
        },
        { // Instrument 4
            i: [
                0, // OSC1_WAVEFORM
                120, // OSC1_VOL
                128, // OSC1_SEMI
                64, // OSC1_XENV
                0, // OSC2_WAVEFORM
                160, // OSC2_VOL
                128, // OSC2_SEMI
                0, // OSC2_DETUNE
                64, // OSC2_XENV
                210, // NOISE_VOL
                4, // ENV_ATTACK
                7, // ENV_SUSTAIN
                52, // ENV_RELEASE
                85, // ENV_EXP_DECAY
                0, // ARP_CHORD
                0, // ARP_SPEED
                0, // LFO_WAVEFORM
                60, // LFO_AMT
                4, // LFO_FREQ
                1, // LFO_FX_FREQ
                2, // FX_FILTER
                255, // FX_FREQ
                0, // FX_RESONANCE
                0, // FX_DIST
                32, // FX_DRIVE
                61, // FX_PAN_AMT
                5, // FX_PAN_FREQ
                32, // FX_DELAY_AMT
                6 // FX_DELAY_TIME
            ],
            // Patterns
            p: [12, 12, 12, 13],
            // Columns
            c: [
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [],
                    f: []
                },
                {
                    n: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 113, , 118, 118, , , , , , , , , , , , , , , 113, , 118, 118],
                    f: []
                },
                {
                    n: [, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , 118, , , , , , , , , 118, , , , , , 118, 118, 118, 118],
                    f: []
                }
            ]
        },
        { // Instrument 5
            i: [
                0, // OSC1_WAVEFORM
                31, // OSC1_VOL
                128, // OSC1_SEMI
                0, // OSC1_XENV
                0, // OSC2_WAVEFORM
                40, // OSC2_VOL
                128, // OSC2_SEMI
                12, // OSC2_DETUNE
                0, // OSC2_XENV
                0, // NOISE_VOL
                12, // ENV_ATTACK
                0, // ENV_SUSTAIN
                72, // ENV_RELEASE
                0, // ENV_EXP_DECAY
                0, // ARP_CHORD
                0, // ARP_SPEED
                0, // LFO_WAVEFORM
                0, // LFO_AMT
                0, // LFO_FREQ
                0, // LFO_FX_FREQ
                2, // FX_FILTER
                255, // FX_FREQ
                0, // FX_RESONANCE
                0, // FX_DIST
                32, // FX_DRIVE
                83, // FX_PAN_AMT
                3, // FX_PAN_FREQ
                130, // FX_DELAY_AMT
                2 // FX_DELAY_TIME
            ],
            // Patterns
            p: [1, 2, 1, 3],
            // Columns
            c: [
                {
                    n: [156, 159, 163, 168, , , , , , , , , , , , , , , 154, 158, 161, 166],
                    f: []
                },
                {
                    n: [152, 156, 159, 164, , , , , , , , , , , , , , , 151, 155, 158, 163],
                    f: []
                },
                {
                    n: [152, 156, 159, 164, , , , , , , , , 151, 155, 158, 163, , , 156, 151, 156, 159, 156, 159, 163, 159, 163, 168],
                    f: []
                }
            ]
        },
    ],
    rowLen: 5513,   // In sample lengths
    patternLen: 36,  // Rows per pattern
    endPattern: 3,  // End pattern
    numChannels: 6  // Number of channels
};

let player = new CPlayer();
export let audio = document.createElement("audio");
player.init(song);

// Generate music...
let ready = false;
setInterval(function () {
    if (ready) {
        return;
    }

    ready = player.generate() >= 1;

    if (ready) {
        // Put the generated song in an Audio element.
        var wave = player.createWave();
        audio.src = URL.createObjectURL(new Blob([wave], { type: "audio/wav" }));
        audio.loop = true;
        let playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
            })
            .catch(error => {
            });
        }
    }
}, 0);

