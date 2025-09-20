document.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d', {
        alpha: false,
        imageSmoothingEnabled: false
    })

    await game.init(canvas, ctx)
    graphics.resizeContainer(game.size, { width: window.innerWidth, height: window.innerHeight }, game.canvas)

    document.addEventListener('pointerdown', event => {
        if (event.button === 0 && event.isPrimary) {
            game.onPointerDown(event)
        }
    })

    document.addEventListener('pointerup', event => {
        if (event.button === 0 && event.isPrimary) {
            game.onPointerUp(event)
        }
    })

    document.addEventListener('keydown', event => {
        game.onKeyDown(event.key.toLowerCase())
    })

    document.addEventListener('keyup', event => {
        game.onKeyUp(event.key.toLowerCase())
    })

    document.addEventListener('contextmenu', event => event.preventDefault());

    window.addEventListener('resize', () => {
        graphics.resizeContainer(game.size, { width: window.innerWidth, height: window.innerHeight }, game.canvas)
    })

    window.requestAnimationFrame(doFrame)

    function doFrame(timestamp) {
        const dt = timestamp - game.previous
        game.previous = timestamp

        game.ctx = game.canvas.getContext('2d', {
            alpha: false,
            imageSmoothingEnabled: false
        })

        game.update(dt)
        game.clear()
        graphics.draw(game.objects, game.ctx, game.debug)
        window.requestAnimationFrame(doFrame)
    }
});
