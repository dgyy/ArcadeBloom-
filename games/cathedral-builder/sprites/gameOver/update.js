game.sprites.gameOver.update = function (ctx) {
        // Shortcuts
        let v = game.variables
        let s = game.sprites

        if (v.year>=1300 || v.stoneBuilt >= game.sprites.cathedral.totalStonesToBuild) {
                this.isVisible = true
                if (this.isClicked) {
                        // Game variables
                        v.rockStock=0
                        v.stoneStock=0
                        v.goldStock=0
                        v.stoneBuilt=0
                        v.rockSpeed=1000
                        v.stoneSpeed=1000
                        v.goldSpeed=1000
                        v.rockProduction=1
                        v.stoneProduction=10
                        v.goldProduction=1
                        v.rockAutoClickUntil=0
                        v.stoneAutoClickUntil=0
                        v.goldAutoClickUntil=0
                        v.buildAutoClickUntil=0
                        v.buildSpeed=1
                        v.year=1200
                        v.month=1
                        v.level=1
                        v.levelGoal=50
                        // Clear cathedral
                        s.cathedral.clear()
                        // Resest boosters
                        s.booster.cloneExecuteForEach('reset')
                        // Hide
                        this.isVisible = false
                }
            } else { this.isVisible = false}

}

