class PathTile extends Tile {
	
	constructor(x, y, type) {
		super(x, y, type);
	}

	resize() {
		super.resize();
		this.draw();
	}

	draw() {
		if (this.type > -1 && this.y > 1) {
			if (!this.type) {
				this.drawRoad(0);
			}
			
			if (this.type == 1 || this.type == 5 || this.type == 7 || this.type == 9 || this.type == 10 || this.type > 12) {
				this.drawRoad(1);
			}

			if (this.type == 2 || this.type == 6 || this.type == 7 || this.type == 8 || this.type == 10 || this.type == 11 || this.type > 13) {
				this.drawRoad(2);
			}

			if (this.type == 3 || this.type == 5 || this.type == 7 || this.type == 8 || this.type == 9 || this.type == 11 || this.type == 12 || this.type > 14) {
				this.drawRoad(3);
			}

			if (this.type == 4 || this.type == 6 || this.type == 8 || this.type == 9 || this.type == 10 || this.type == 12 || this.type == 13 || this.type > 14) {
				this.drawRoad(4);
			}
		}
	}

	drawRoad(type) {
		this.context.drawImage(
			PixelArt.spritesRoad[type],
			this.getX(),
			this.getY(),
			this.width,
			this.height
		);
	}
}
