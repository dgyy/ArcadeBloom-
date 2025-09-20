game.music.createMusic = function() {

    // Rest 1 bar
    let restBar = ['r',4]
    
    // Arpegio 1
    let a1Am = ['A2',0.5,'C3',0.5,'E3',0.5,'E3',1.5,'C3',1]
    let a1Bdim = ['B2',0.5,'D3',0.5,'F3',0.5,'F3',1.5,'B2',1]
    let a1Dm = ['D3',0.5,'F3',0.5,'A3',0.5,'F3',1.5,'F2',1]
    let a1E7 = ['E2',0.5,'Ab2',0.5,'B2',0.5,'B2',1.5,'E3',1]
    let a1F = ['F2',0.5,'A2',0.5,'C3',0.5,'C3',1.5,'F3',1]

    let a1Intro = []
    a1Intro.push(a1Am,a1Bdim,a1Am,a1Bdim)

    let a1SectionA = []
    a1SectionA.push(a1Am,a1Bdim,a1Am,a1Bdim,a1E7,a1F,a1E7,a1Am)

    let a1SectionB = []
    a1SectionA.push(a1Am,a1Dm,a1Am,a1Dm,a1Am,a1E7,['A2',0.5,'C3',0.5,'E3',0.5,'A3',0.5,'C4',1,'A3',1])

    game.music.a1Bars = [].concat(a1Intro,a1SectionA,a1SectionB)

    // Arpegio 2
    let a2Am = ['r',1.5,'A3',1.5]
    let a2Bdim = ['r',1.5,'B3',1.5]
    let a2Dm = ['r',1.5,'A3',1.5]
    let a2E7 = ['r',1.5,'E3',1.5]
    let a2F = ['r',1.5,'F3',1.5]

    let a2Intro = []
    a2Intro.push(a2Am,a2Bdim,a2Am,a2Bdim)

    let a2SectionA = []
    a2SectionA.push(a2Am,a2Bdim,a2Am,a2Bdim,a2E7,a2F,a2E7,a2Am)

    let a2SectionB = []
    a2SectionA.push(a2Am,a2Dm,a2Am,a2Dm,a2Am,a2E7,restBar)

    game.music.a2Bars = [].concat(a2Intro,a2SectionA,a2SectionB)
    
    // Arpegio 3
    let a3Am = ['r',1.5,'C4',1.5]
    let a3Bdim = ['r',1.5,'D4',1.5]
    let a3Dm = ['r',1.5,'D4',1.5]
    let a3E7 = ['r',1.5,'Ab3',1.5]
    let a3F = ['r',1.5,'A3',1.5]

    let a3Intro = []
    a3Intro.push(a3Am,a3Bdim,a3Am,a3Bdim)

    let a3SectionA = []
    a3SectionA.push(a3Am,a3Bdim,a3Am,a3Bdim,a3E7,a3F,a3E7,a3Am)

    let a3SectionB = []
    a3SectionA.push(a3Am,a3Dm,a3Am,a3Dm,a3Am,a3E7,restBar)

    game.music.a3Bars = [].concat(a3Intro,a3SectionA,a3SectionB)
    
    // Bass
    let bAm = ['A1',1.5,'A1',1.5,'A1',1]
    let bDm = ['F2',1.5,'F2',1.5,'F2',1]
    let bE7 = ['E2',1.5,'E2',1.5,'E2',1]

    let bIntro = []
    bIntro.push(restBar,restBar,restBar,restBar)
    
    let bSectionA = []
    bSectionA.push(restBar,restBar,restBar,restBar,restBar,restBar,restBar,restBar)

    let bSectionB = []
    bSectionA.push(bAm,bDm,bAm,bDm,bAm,bE7,['A1',4])

    game.music.bBars = [].concat(bIntro,bSectionA,bSectionB)

    // Lead
    let lIntro = [restBar,restBar,restBar,['r',2.5,'E4',0.5,'A4',0.5,'Ab4',0.5]]
    let lSectionA = [['B4',1.5,'C5',1,'E4',0.5,'C5',0.5,'B4',0.5],
                     ['Ab4',1.5,'A4',1,'C5',0.5,'B4',0.5,'Ab4',0.5],
                     ['E4',4],
                     ['r',2.5,'E4',0.5,'A4',0.5,'Ab4',0.5],
                     ['C5',1.5,'B4',1.5,'Gb4',1],
                     ['A4',3,'B4',0.5,'A4',0.5],
                     ['Ab4',4],
                     ['r',2.5,'E4',0.5,'A4',0.5,'B4',0.5]]
    let lSectionB = [['B4',1.5,'C5',1.5,'A4',1],
                     ['D5',3,'B4',0.75,'A4',0.25],
                     ['C5',3,'D5',0.5,'C5',0.5],
                     ['B4',2.5,'E4',0.5,'A4',0.5,'B4',0.5],
                     ['B4',1.5,'C5',1.5,'B4',0.5,'A4',0.5],
                     ['Ab4',1.5,'A4',0.25,'Ab4',0.25,'Gb4',1,'Ab4',1],
                     ['A4',4]]

    game.music.lBars = [].concat(lIntro,lSectionA,lSectionB)

}