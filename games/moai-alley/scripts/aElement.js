class GameElement {

	constructor() {

		this.container = gameContainer;
		this.canvas = gameCanvas;
		this.context = this.canvas.getContext("2d");

		// board squares
		this.boardWidth = Board.instance.boardWidth;
		this.boardHeight = Board.instance.boardHeight;
		this.scale = Board.instance.scale;
		this.tilt = Board.instance.tilt;
		this.frame = 0;
		
		this.elementSize = this.canvas.width / this.boardWidth;
		this.width = this.elementSize;
		this.height = this.elementSize * this.tilt;
	}

	resize() {
		this.boardWidth = Board.instance.boardWidth;
		this.boardHeight = Board.instance.boardHeight;
		this.scale = Board.instance.scale;
		this.tilt = Board.instance.tilt;
		
		this.elementSize = this.canvas.width / this.boardWidth;
		this.width = this.elementSize;
		this.height = this.elementSize * this.tilt;
	}
}
