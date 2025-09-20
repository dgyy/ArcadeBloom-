game.music.play = function() {
    
    let a1Bars = game.music.a1Bars
    let a2Bars = game.music.a2Bars
    let a3Bars = game.music.a3Bars
    let bBars = game.music.bBars
    let lBars = game.music.lBars

    let instrument = game.music.instrument

    mge.sequencer.stop()
    mge.sequencer.reset()
    mge.sequencer.createTrack(a1Bars,instrument,0.85)
    mge.sequencer.createTrack(a2Bars,instrument,0.85)
    mge.sequencer.createTrack(a3Bars,instrument,0.85)
    mge.sequencer.createTrack(bBars,instrument,0.9)
    mge.sequencer.createTrack(lBars,instrument,0.8)
    mge.sequencer.bpm = 110
    mge.sequencer.start()

}