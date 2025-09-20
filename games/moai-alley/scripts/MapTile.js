class MapTile extends Tile {
	
	constructor(x, y, type) {
		super(x, y, type);
	}

	resize() {
		super.resize();
		this.draw();
	}
}
