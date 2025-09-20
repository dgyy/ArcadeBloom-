export default class Sound {

    audioContext: AudioContext;
    nextNoteTime: number;
    nextNote: number;
    song: string[];

    constructor(audioContext: AudioContext) {

        this.audioContext = audioContext;                               // get audio context

        this.nextNoteTime = this.audioContext.currentTime;
        this.nextNote = 0;

        let sequence1 = [
            'AA',
            'BB',
            'CC',
            'BB',
            'C',
            'B',
            'CC',
            'A',
            '0',
            'AA'
        ];

        let sequence2 = [
            'EE',
            'E',
            'E',
            'DD',
            'D',
            'D',
            'GG',
            'ff',
            'E',
            '0',
            'EE'
        ];

        let sequence3 = [
            'a',
            'G',
            'f',
            'D',
            'E',
            '0',
            'E',
            '0'
        ];

        let sequence4 = [
            'E',
            'E',
            'E',
            'E',
            'D',
            '0',
            'DD',
            'C',
            '0',
            'B',
            '0',
            'AAAA'
        ];

        let sequence5 = [
            'EE',
            'D',
            '0',
            'BB',
            'EE',
            'GG',
            'f',
            '0',
            'DD',
            'DD',
        ];

        let pause = ['000000'];

        this.song = [...sequence1, ...sequence2, ...sequence5, ...sequence2, ...sequence5, ...sequence2, ...sequence3, ...sequence3, ...sequence3, ...sequence4, ...pause];


    }

    playNote(note: string) {

        // create note map
        let noteMap = new Map();
        noteMap.set('0', 440.00);
        noteMap.set('A', 440.00);
        noteMap.set('B', 493.88);
        noteMap.set('C', 523.25);
        noteMap.set('D', 587.33);
        noteMap.set('E', 659.25);
        noteMap.set('f', 739.99);
        noteMap.set('G', 783.99);
        noteMap.set('a', 880.00);

        let volume = 0.2;

        if (note.slice(0,1) == '0') {
            volume = 0.0001;
        }

        this.play(false, noteMap.get(note.slice(0, 1)), volume, 0.03, 0.2 * note.length, 0.1);

    }

    play(sine: boolean, freq: number, volume: number, attack: number, sustain: number, release: number) {

        let now = this.audioContext.currentTime;

        // create nodes
        let oscillator = this.audioContext.createOscillator();          // create oscillator

        if (!sine) {
            oscillator.type = 'triangle';
        }

        let gain = this.audioContext.createGain();                          // create gain

        oscillator.connect(gain);                                                       // connect oscillator to gain
        gain.connect(this.audioContext.destination);                                    // connect gain to destination

        oscillator.frequency.value = freq;

        oscillator.start();

        gain.gain.setValueAtTime(0.0001, now);

        gain.gain.exponentialRampToValueAtTime(volume, now + attack);
        gain.gain.setValueAtTime(volume, now + attack + sustain);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + sustain + release);

        oscillator.stop(now + attack + sustain + release);

    }

    playMusic() {

        let noteTime = 0.25;         // difference between two notes (in seconds)

        let now = this.audioContext.currentTime

        if (now >= this.nextNoteTime) {
            this.playNote(this.song[this.nextNote])

            this.nextNoteTime = now + noteTime * this.song[this.nextNote].length;

            this.nextNote++;

            if (this.nextNote >= this.song.length) {
                this.nextNote = 0;
            }

        }

    }

    click() {

        this.play(false, 100, 1, 0.01, 0.01, 0.01);

    }

}