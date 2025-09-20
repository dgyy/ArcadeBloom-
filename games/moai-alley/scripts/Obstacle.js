class Obstacle extends Unit {
	
	constructor(x, y, type) {
		super(x, y, type);
	}

	resize() {
		super.resize();
		this.draw();
	}

}
