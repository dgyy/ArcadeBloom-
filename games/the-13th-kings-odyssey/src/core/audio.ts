class AudioFx {
    public volume: number = 0.5;
    public sampleRate: number = 44100;
    public x: AudioContext;
    
    constructor() {
        this.x = new AudioContext();
    }

    // muteFx() {
    //     ZZFX.volume = 0;
    // }

    // changeVolume(value: number) {
    //     ZZFX.volume = value;
    // }

    playJumpFx() {
        this.play(...[,,372,.03,.04,,1,1.34,-9.5,.2,,,,,,,,.64,.05,.01]);
    }

    playDieFx() {
        this.play(...[2.06,,292,.02,.01,.07,3,1.29,-9.4,-0.2,,,.15,.5,,.3,.16,.86,.05]); // dead sound.
    }

    playCupFx() {
        this.play(...[1.9,,543,.01,.07,.17,1,1.13,,,-570,.05,.03,,,,.09,.7,.04]);
    }

    playDoorFx() {
        this.play(...[1.99,0,261.6256,.07,.38,.24,,.74,,,,,,.1,,.1,.15,.37,.12]);
    }

    playDashFx() {
        this.play(...[2.06, 0, 69.41, , .07, .16, , 1.38, .1, .1, 50, .02, -0.01, .2, , , .08, .26, .06]); // dash sound.
    }

    play(...parameters: any[]) {
        return this.playSamples(this.buildSamples(...parameters));
    }

    playSamples(...samples: any[]) {
        const buffer = this.x.createBuffer(samples.length, samples[0].length, this.sampleRate),
            source = this.x.createBufferSource();

        samples.map((d, i) => buffer.getChannelData(i).set(d));
        source.buffer = buffer;
        source.connect(this.x.destination);
        source.start();
        return source;
    }

    buildSamples
        (
            volume: number = 1,
            randomness: number = .05,
            frequency: number = 220,
            attack: number = 0,
            sustain: number = 0,
            release: number = .1,
            shape: number = 0,
            shapeCurve: number = 1,
            slide: number = 0,
            deltaSlide: number = 0,
            pitchJump: number = 0,
            pitchJumpTime: number = 0,
            repeatTime: number = 0,
            noise: number = 0,
            modulation: number = 0,
            bitCrush: number = 0,
            delay: number = 0,
            sustainVolume: number = 1,
            decay: number = 0,
            tremolo: number = 0
        ) {
        // init parameters
        let PI2: number = Math.PI * 2, sampleRate: number = this.sampleRate, sign: any = (v: number) => v > 0 ? 1 : -1,
            startSlide: number = slide *= 500 * PI2 / sampleRate / sampleRate,
            startFrequency: number = frequency *= (1 + randomness * 2 * Math.random() - randomness) * PI2 / sampleRate,
            b: number[] = [], t: number = 0, tm: number = 0, i: number = 0, j: number = 1, r: number = 0, c: number = 0, s: number = 0, f: number, length: number;

        // scale by sample rate
        attack = attack * sampleRate + 9; // minimum attack to prevent pop
        decay *= sampleRate;
        sustain *= sampleRate;
        release *= sampleRate;
        delay *= sampleRate;
        deltaSlide *= 500 * PI2 / sampleRate ** 3;
        modulation *= PI2 / sampleRate;
        pitchJump *= PI2 / sampleRate;
        pitchJumpTime *= sampleRate;
        repeatTime = repeatTime * sampleRate | 0;

        // generate waveform
        for (length = attack + decay + sustain + release + delay | 0;
            i < length; b[i++] = s) {
            if (!(++c % (bitCrush * 100 | 0)))                      // bit crush
            {
                s = shape ? shape > 1 ? shape > 2 ? shape > 3 ?         // wave shape
                    Math.sin((t % PI2) ** 3) :                    // 4 noise
                    Math.max(Math.min(Math.tan(t), 1), -1) :     // 3 tan
                    1 - (2 * t / PI2 % 2 + 2) % 2 :                        // 2 saw
                    1 - 4 * Math.abs(Math.round(t / PI2) - t / PI2) :    // 1 triangle
                    Math.sin(t);                              // 0 sin

                s = (repeatTime ?
                    1 - tremolo + tremolo * Math.sin(PI2 * i / repeatTime) // tremolo
                    : 1) *
                    sign(s) * (Math.abs(s) ** shapeCurve) *       // curve 0=square, 2=pointy
                    volume * this.volume * (                  // envelope
                        i < attack ? i / attack :                   // attack
                            i < attack + decay ?                      // decay
                                1 - ((i - attack) / decay) * (1 - sustainVolume) :  // decay falloff
                                i < attack + decay + sustain ?           // sustain
                                    sustainVolume :                           // sustain volume
                                    i < length - delay ?                      // release
                                        (length - i - delay) / release *            // release falloff
                                        sustainVolume :                           // release volume
                                        0);                                       // post release

                s = delay ? s / 2 + (delay > i ? 0 :            // delay
                    (i < length - delay ? 1 : (length - i) / delay) *  // release delay 
                    b[i - delay | 0] / 2) : s;                      // sample delay
            }

            f = (frequency += slide += deltaSlide) *          // frequency
                Math.cos(modulation * tm++);                    // modulation
            t += f - f * noise * (1 - (Math.sin(i) + 1) * 1e9 % 2);     // noise

            if (j && ++j > pitchJumpTime)          // pitch jump
            {
                frequency += pitchJump;            // apply pitch jump
                startFrequency += pitchJump;       // also apply to start
                j = 0;                             // stop pitch jump time
            }

            if (repeatTime && !(++r % repeatTime)) // repeat
            {
                frequency = startFrequency;        // reset frequency
                slide = startSlide;                // reset slide
                j = j || 1;                        // reset pitch jump time
            }
        }

        return b;
    }
}

export const audio = new AudioFx();