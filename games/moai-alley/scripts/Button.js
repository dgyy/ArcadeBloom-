class Button extends Tile {
	
	constructor(x, y) {
		super(x, y);
		this.btn = this.createButton(x, y);
		this.container.appendChild(this.btn);
	}

	createButton(x, y) {
		var div = document.createElement("div");
		div.x = x;
		div.y = y;
		div.style.width = this.width + "px";
		div.style.height = this.height + "px";
		div.style.left = (this.getX() + 2) + "px";
		div.style.top = (this.getY() + 2) + "px";
		div.style.cursor = "pointer";
		div.className = "unselectable";
		return div;
	}

	resize() {
		super.resize();
		this.draw();
	}

	draw() {
		this.btn.style.left = (this.getX() + 2) + "px";
		this.btn.style.top = (this.getY() + 2) + "px";
		this.btn.style.width = this.width + "px";
		this.btn.style.height = this.height + "px";
	}

}