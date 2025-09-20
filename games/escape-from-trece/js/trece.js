const game = {
    steps: [],
    stepsCount: 109,
    dy: 13,
    size: { width: 1000, height: 1600 },
    stepSize: { width: 100, height: 24 },
    playerSize: { width: 100, height: 96 },
    dx: 0,
    player: new Sprite(0, 0, 0.5, false, null),
    playerStep: 100,
    countdownTime: 0,
    inGame: false,
    floorLabels: [],
    gameOverLabel: new Label(500, 560, 0, false, 'GAME OVER', 'black', 'bold', 60, 'Arial'),
    winLabel: new Label(500, 560, 0, false, 'YOU WIN!', 'black', 'bold', 60, 'Arial'),
    homeButton: new Label(500, 850, 0, true, 'HOME', 'black', 'normal', 60, 'Arial'),
    tryAgainButton: new Label(500, 950, 0, true, 'TRY AGAIN', 'black', 'normal', 60, 'Arial'),
    playButton: new Label(500, 1300, 0, true, 'PLAY', 'white', 'normal', 60, 'Arial'),
    countdownLabel: new Label(500, 800, 0, false, '', 'white', 'normal', 130, 'Arial'),
    scoreBackground: new Sprite(500, 800, 0.4, false, null),
    directionSteps: [10, 19, 28, 37, 46, 55, 64, 73, 82, 91, 100, 109],
    showingCountdown: false,
    showingScore: false,
    objects: [],
    audiosLoaded: false,
    tapAudio: null,
    hitAudio: null,
    debug: false,
    stepOnCanvas: null,
    introTexts: [],
    upButton: new Sprite(900, 1280, 0.5, true, null),
    downButton: new Sprite(900, 1500, 0.5, true, null),
    upArrow: new Label(900, 1280, 0, false, '↑', 'black', 'bold', 72, 'Arial'),
    downArrow: new Label(900, 1500, 0, false, '↓', 'black', 'bold', 72, 'Arial'),
    lives: [],
    totalLives: 4,
    enemies: [],
    enemyCanvas: null,
    liveCanvas: null,
    upPressed: false,
    downPressed: false
}

game.init = async function (canvas, ctx) {
    this.canvas = canvas
    this.canvas.width = this.size.width
    this.canvas.height = this.size.height
    this.ctx = ctx

    this.tapAudio = await sound.loadAudio('./snd/tap.opus')
    this.hitAudio = await sound.loadAudio('./snd/hit.opus')

    this.upButton.canvas = graphics.transform(180, 180, 0, await graphics.loadBitmap('./img/up.png'))
    this.downButton.canvas = graphics.transform(180, 180, 0, await graphics.loadBitmap('./img/down.png'))
    this.player.canvas = graphics.transform(12 * 3, 32 * 3, 0, await graphics.loadBitmap('./img/front.png'))
    this.stepOnCanvas = graphics.transform(this.stepSize.width, this.stepSize.height, 0, await graphics.loadBitmap('./img/step-on.png'))
    this.scoreBackground.canvas = graphics.transform(600, 600, 0, await graphics.loadBitmap('./img/up.png'))
    this.liveCanvas = graphics.transform(32, 32, 0, await graphics.loadBitmap('./img/live.png'))
    this.enemyCanvas = graphics.transform(32, 32, 0, await graphics.loadBitmap('./img/enemy.png'))

    this.dx = this.stepSize.width * 0.8

    let x = this.stepSize.width * 0.5
    let y = 1600 - (this.stepSize.height * 0.5)
    let sign = 1
    for (let i = 1; i <= this.stepsCount; i++) {
        this.steps.push(new Sprite(x, y, 2, false, null))

        if (this.isDirectionStep(i)) {
            sign = sign * (-1)

            this.floorLabels.push(new Label(20, y - 52, 2, false, String(this.directionSteps.indexOf(i) + 2).padStart(2, '0'), 'white', 'normal', 32, 'Arial'))
        }

        x += this.dx * sign
        y -= this.dy
    }

    this.floorLabels.push(new Label(20, this.steps[9].y + 52, 2, false, '01', 'white', 'normal', 32, 'Arial'))
    this.objects.push(this.playButton)

    const texts = [
        'Strange things happen',
        'on 13th floor',
        'and now the elevator is broken.',
        '',
        'Run!',
        '',
        'But be careful with the ...',
        '',
        'Use the on-screen buttons',
        'or keyboard arrow up and down',
        'to get to the ground floor.'
    ]

    const marginX = 130
    let textY = 400

    let line = new Label(500, 250, 0, false, 'ESCAPE FROM TRECE', 'white', 'bold', 60, 'Arial')
    this.objects.push(line)
    this.introTexts.push(line)

    for (let i = 0; i < texts.length; i++) {
        line = new Label(0, 0, 0, false, texts[i], 'white', 'italic', 48, 'Arial')
        graphics.alignLeft(line, marginX, this.ctx)
        line.y = textY
        this.introTexts.push(line)
        this.objects.push(line)
        textY += 48
    }

    this.previous = performance.now()
}

game.update = function (dt) {
    if (this.showingCountdown) {
        this.countdownTime -= dt

        const time = Math.round(this.countdownTime / 1000)

        if (time == 0) {
            this.countdownLabel.content = 'GO!'
        } else {
            this.countdownLabel.content = String(time)
        }

        if (this.countdownTime <= 0) {
            this.showingCountdown = false
            this.elapsedTime = 0
            this.inGame = true
            this.remove(this.objects, this.countdownLabel)
        }
    }

    if (this.inGame) {
        for (let enemy of this.enemies) {
            enemy.y += enemy.velocity * dt

            if (enemy.y > 1700) {
                enemy.y = -100
                this.initEnemy(enemy)
            }

            if (enemy.isActive && graphics.collision(this.player, enemy)) {
                sound.playAudio(this.hitAudio)
                let last = this.lives.pop()
                this.remove(this.objects, last)
                enemy.isActive = false
            }
        }

        if (this.lives.length == 0) {
            this.end()
        }
    }
}

game.onKeyDown = function (key) {
    if (this.inGame) {
        if (key == 'arrowdown' && !this.downPressed) {
            this.goDown()
            this.downPressed = true
        } else if (key == 'arrowup' && !this.upPressed) {
            this.goUp()
            this.upPressed = true
        }

        this.setPlayerPosition()


        if (this.playerStep == 1) {
            this.end()
        }
    }
}

game.onKeyUp = function (key) {
    if (this.inGame) {
        if (key == 'arrowdown') {
            this.downPressed = false
        } else if (key == 'arrowup') {
            this.upPressed = false
        }
    }
}

game.onPointerDown = function (event) {
    const hit = graphics.hit(this.objects, event, this.ctx)

    if (hit) {
        if (hit == this.playButton) {
            this.start()
        } else if (hit == this.homeButton) {
            this.home()
        } else if (hit == this.tryAgainButton) {
            this.start()
        } else if (this.inGame) {
            if (hit == this.downButton) {
                this.goDown()
            } else if (hit == this.upButton) {
                this.goUp()
            }

            this.setPlayerPosition()

            if (this.playerStep == 1) {
                this.end()
            }
        }
    }
}

game.onPointerUp = function (event) {

}

game.clear = function () {
    this.ctx.fillStyle = '#383428'
    this.ctx.fillRect(0, 0, this.size.width, this.size.height)
}

game.resize = function () {
    graphics.resizeContainer(this.size, { width: window.innerWidth, height: window.innerHeight }, this.canvas)
}

game.setPlayerPosition = function () {
    const step = this.steps[this.playerStep - 1]
    this.player.x = step.x
    this.player.y = step.y - (this.stepSize.height * 0.5) - (this.playerSize.height * 0.5)
}

game.isDirectionStep = function (step) {
    return this.directionSteps.indexOf(step) != -1
}

game.start = function () {
    this.inGame = false
    this.showingCountdown = true
    this.showingScore = false
    this.countdownTime = 3000
    this.playerStep = this.stepsCount
    this.objects = []
    this.lives = []
    this.enemies = []

    for (let step of this.steps) {
        step.canvas = this.stepOnCanvas
        this.objects.push(step)
    }

    this.setPlayerPosition()

    for (let floor of this.floorLabels) {
        this.objects.push(floor)
    }

    let y = 130
    for (let i = 0; i < this.totalLives; i++) {
        let live = new Sprite(920, y, 0.5, true, this.liveCanvas)
        this.lives.push(live)
        this.objects.push(live)
        y += 48
    }

    this.objects.push(this.player)
    this.objects.push(this.countdownLabel)
    this.objects.push(this.upButton)
    this.objects.push(this.downButton)
    this.objects.push(this.upArrow)
    this.objects.push(this.downArrow)


    for (let i = 1; i < 9; i++) {
        for (let j = 0; j < 2; j++) {
            let enemy = new Sprite(this.steps[i].x, random.nextDouble(-100, -1500), 0.25, false, this.enemyCanvas)
            this.initEnemy(enemy)
            this.enemies.push(enemy)
            this.objects.push(enemy)
        }
    }
}

game.home = function () {
    this.objects = []
    this.objects.push(this.playButton)

    for (let text of this.introTexts) {
        this.objects.push(text)
    }
}

game.end = function () {
    this.inGame = false
    this.showingScore = true

    this.objects.push(this.tryAgainButton)
    this.objects.push(this.homeButton)
    this.objects.push(this.scoreBackground)
    this.remove(this.objects, this.upButton)
    this.remove(this.objects, this.downButton)
    this.remove(this.objects, this.downArrow)
    this.remove(this.objects, this.upArrow)

    for (let enemy of this.enemies) {
        this.remove(this.objects, enemy)
    }

    if (this.lives.length == 0) {
        this.objects.push(this.gameOverLabel)
    } else {
        this.objects.push(this.winLabel)
    }
}

game.remove = function (array, o) {
    let index = array.findIndex(item => item == o);
    if (index !== -1) {
        array.splice(index, 1);
    }
}

game.initEnemy = function (enemy) {
    enemy.velocity = random.nextDouble(0.2, 0.4)
    enemy.isActive = true
}

game.goDown = function () {
    if (this.playerStep - 1 >= 0) {
        sound.playAudio(this.tapAudio)
        this.playerStep--
    }
}

game.goUp = function () {
    if (this.playerStep + 1 <= this.stepsCount) {
        sound.playAudio(this.tapAudio)
        this.playerStep++
    }
}