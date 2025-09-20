const graphics = {
    scaleFactor: 1
}

graphics.resizeContainer = function (worldSize, viewSize, canvas) {
    const factorWidth = viewSize.width / worldSize.width
    const factorHeight = viewSize.height / worldSize.height
    this.scaleFactor = Math.min(factorHeight, factorWidth)
    canvas.style.width = `${Math.floor(worldSize.width * this.scaleFactor)}px`
    let styleHeight = worldSize.height * this.scaleFactor
    canvas.style.height = `${Math.floor(styleHeight)}px`
    canvas.style.top = `${(viewSize.height - parseInt(canvas.style.height)) / 2}px`
    canvas.style.left = `${(viewSize.width - parseInt(canvas.style.width)) / 2}px`

    console.log(`Window ${window.innerWidth} x ${window.innerHeight}`)
    console.log(`Canvas buffer ${worldSize.width} x ${worldSize.height}`)
    console.log(`Canvas css ${canvas.style.width} x ${canvas.style.height}`)
    console.log(`Density ${window.devicePixelRatio}`)
    console.log(`Scale ${this.scaleFactor}`)
}

graphics.draw = function (objects, ctx, debug) {
    objects.sort(mathUtils.zCompare)

    for (let i = objects.length - 1; i >= 0; i--) {
        let o = objects[i]

        if (o instanceof Sprite) {
            this.drawSprite(o, ctx, debug)
        } else if (o instanceof Label) {
            this.drawLabel(o, ctx, debug)
        }
    }
}

graphics.drawSprite = function (sprite, ctx, debug) {
    let x = sprite.x - (sprite.canvas.width / 2)
    let y = sprite.y - (sprite.canvas.height / 2)

    ctx.drawImage(sprite.canvas, Math.floor(x), Math.floor(y))

    if (debug) {
        this.debug(sprite.x, sprite.y, sprite.canvas.width, sprite.canvas.height, ctx)
    }
}

graphics.drawLabel = function (label, ctx, debug) {
    ctx.save()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'

    let x = label.x
    let y = label.y

    ctx.fillStyle = label.color
    ctx.font = `${label.style} ${label.size}px ${label.font}`
    ctx.fillText(label.content, Math.floor(x), Math.floor(y))

    if (debug) {
        const metrics = this.measureLabel(label, ctx)
        const textWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft
        const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
        this.debug(x, y, textWidth, textHeight, ctx)
    }
}

graphics.hit = function (objects, event, ctx) {
    for (let i = 0; i < objects.length; i++) {
        let o = objects[i]

        if (o.hit) {
            if (o instanceof Sprite) {
                if (this.insideSprite(o, event)) {
                    return o
                }
            } else if (o instanceof Label) {
                if (this.insideLabel(o, event, ctx)) {
                    return o
                }
            }
        }
    }

    return null
}

graphics.insideSprite = function (sprite, event) {
    const rect = event.target.getBoundingClientRect()
    let pointX = (event.clientX - rect.left) / this.scaleFactor
    let pointY = (event.clientY - rect.top) / this.scaleFactor

    const halfWidth = sprite.canvas.width / 2
    const halfHeight = sprite.canvas.height / 2

    return pointX >= (sprite.x - halfWidth) && pointX <= (sprite.x + halfWidth)
        &&
        pointY >= (sprite.y - halfHeight) && pointY <= (sprite.y + halfHeight)
}

graphics.insideLabel = function (label, event, ctx) {
    const rect = event.target.getBoundingClientRect()
    const pointX = (event.clientX - rect.left) / this.scaleFactor
    const pointY = (event.clientY - rect.top) / this.scaleFactor

    const metrics = this.measureLabel(label, ctx)
    const textWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft
    const textHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent

    const halfWidth = textWidth / 2
    const halfHeight = textHeight / 2

    return pointX >= label.x - halfWidth && pointX <= label.x + halfWidth
        &&
        pointY >= label.y - halfHeight && pointY <= label.y + halfHeight
}

graphics.loadBitmap = async function (path) {
    console.log('Will load ' + path)

    const response = await fetch(path)
    const blob = await response.blob()
    return window.createImageBitmap(blob)
}

graphics.transform = function (width, height, degrees, bitmap) {
    const radians = mathUtils.degreesToRadians(degrees)
    const cosAngle = Math.abs(Math.cos(radians))
    const sinAngle = Math.abs(Math.sin(radians))
    const scaleX = width / bitmap.width
    const scaleY = height / bitmap.height
    const targetWidth = (bitmap.width * scaleX * cosAngle) + (bitmap.height * scaleY * sinAngle)
    const targetHeight = (bitmap.width * scaleX * sinAngle) + (bitmap.height * scaleY * cosAngle)

    const canvas = new OffscreenCanvas(Math.round(targetWidth), Math.round(targetHeight))

    const ctx = canvas.getContext('2d', { alpha: true, willReadFrequently: true, imageSmoothingEnabled: false })
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.rotate(radians)
    ctx.scale(scaleX, scaleY)
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2)

    return canvas
}

graphics.debug = function (x, y, width, height, ctx) {
    ctx.lineWidth = 1
    ctx.strokeStyle = 'yellow'
    ctx.strokeRect(
        x - (width / 2) - 1,
        y - (height / 2) - 1,
        width + 1,
        height + 1)
}

graphics.strokeLine = function (x1, y1, x2, y2, color, ctx) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.strokeStyle = color
    ctx.stroke()
}

graphics.scaleWidth = function (width, rotation, bitmap) {
    const scaleFactor = width / bitmap.width
    return this.transform(bitmap.width * scaleFactor, bitmap.height * scaleFactor, rotation, bitmap)
}

graphics.scaleHeight = function (height, rotation, bitmap) {
    const scaleFactor = height / bitmap.height
    return this.transform(bitmap.width * scaleFactor, bitmap.height * scaleFactor, rotation, bitmap)
}

graphics.measureLabel = function (label, ctx) {
    ctx.textBaseline = 'actualBoundingBoxAscent'
    ctx.textAlign = 'center'
    ctx.font = `${label.style} ${label.size}px ${label.font}`

    return ctx.measureText(label.content)
}

graphics.alignLeft = function (label, at, ctx) {
    let metrics = this.measureLabel(label, ctx)
    let textWidth = metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft
    label.x = at + (textWidth * 0.5)
}

//chatgpt generated
graphics.collision = function (sprite1, sprite2) {
    const width1 = sprite1.canvas.width;
    const height1 = sprite1.canvas.height;
    const width2 = sprite2.canvas.width;
    const height2 = sprite2.canvas.height;

    const box1 = {
        left: sprite1.x - width1 / 2,
        right: sprite1.x + width1 / 2,
        top: sprite1.y - height1 / 2,
        bottom: sprite1.y + height1 / 2
    };

    const box2 = {
        left: sprite2.x - width2 / 2,
        right: sprite2.x + width2 / 2,
        top: sprite2.y - height2 / 2,
        bottom: sprite2.y + height2 / 2
    };

    return !(
        box1.right < box2.left ||
        box1.left > box2.right ||
        box1.bottom < box2.top ||
        box1.top > box2.bottom
    );
}
