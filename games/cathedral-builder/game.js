// Game description
game = {
    // Structure of the game
    scenes: {
      boot : {},
      main : {}
    },
    engine3D:{},
    sprites:{
      cathedral: mge.game.createSprite(),
      click: mge.game.createSprite(),
      build: mge.game.createSprite(),
      booster: mge.game.createSprite(),
      stock: mge.game.createSprite(),
      date: mge.game.createSprite(),
      play: mge.game.createSprite(),
      level: mge.game.createSprite(),
      tuto: mge.game.createSprite(),
      bonus: mge.game.createSprite(),
      gameOver: mge.game.createSprite(),
      particle: mge.game.createSprite(),
      logo: mge.game.createSprite()
    },
    variables:{
      rockStock:0,
      stoneStock:0,
      goldStock:0,
      stoneBuilt:0,
      rockSpeed:1000,
      stoneSpeed:1000,
      goldSpeed:1000,
      rockProduction:1,
      stoneProduction:10,
      goldProduction:1,
      rockAutoClickUntil:0,
      stoneAutoClickUntil:0,
      goldAutoClickUntil:0,
      buildAutoClickUntil:0,
      buildSpeed:1,
      year:1200,
      month:1,
      level:1,
      levelGoal:50,
      levelGoldReward:1,
      unlockPhase:0,
      unlockTime:0
    },
    music:{},
    utils:{},
    colors:{
      light:'#FFDDCA',
      dark: '#411F0C',
      transparentGrey: '#411F0C77'
    }
}

// Remove "Loading" div and start the game
window.addEventListener("load", (event) => {
    let loading = document.getElementById("loading")
    loading.remove()
    mge.game.width = 1280
    mge.game.height = 720
    mge.game.start(game.scenes.boot)
  }
)