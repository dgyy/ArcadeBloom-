//////////////////////
// Creates a specific canvas
// to render the cathedral
//////////////////////
game.sprites.cathedral.createCanvas = function(id) {
    // Create canvas
    let htmlCanvas =  document.createElement('canvas')
    htmlCanvas.id = id
	htmlCanvas.width = this.width
	htmlCanvas.height = this.height
    htmlCanvas.style.display = 'none'
	document.body.appendChild(htmlCanvas)
    // save context and html reference
    if (id=='canvas0') {
        this.canvas0.ctx = htmlCanvas.getContext('2d')
        this.canvas0.htmlRef = htmlCanvas
    }
    if (id=='canvas50') {
        this.canvas50.ctx = htmlCanvas.getContext('2d')
        this.canvas50.htmlRef = htmlCanvas
    }
    if (id=='canvas90') {
        this.canvas90.ctx = htmlCanvas.getContext('2d')
        this.canvas90.htmlRef = htmlCanvas
    }
    if (id=='canvas110') {
        this.canvas110.ctx = htmlCanvas.getContext('2d')
        this.canvas110.htmlRef = htmlCanvas
    }
}
