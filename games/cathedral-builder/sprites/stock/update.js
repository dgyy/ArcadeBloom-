game.sprites.stock.update = function (ctx) {
        // Shortcuts
        let id = this.id
        let v = game.variables

        if (id == 'stockRock' && v.unlockPhase >= 1) {this.isVisible = true}
        if (id == 'stockStone' && v.unlockPhase >= 2) {this.isVisible = true}
        if (id == 'stockGold' && v.unlockPhase >= 6) {this.isVisible = true}
}

