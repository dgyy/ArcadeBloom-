game.music.instrument = {
    play: function (_frequency, _startTime, _duration, _volume) {
        let _synthConfig = {volumeADSR: {a:0.02, d:0.5, s:0.2, r:0.15, minValue:0, maxValue: _volume},
                            oscType:'triangle',
                        }      
        mge.audio.playSound(_synthConfig, _frequency, _startTime, _duration, _volume)
    }
}
