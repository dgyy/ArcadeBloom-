class Game {

	constructor(stage) {
		if (Game.instance) return Game.instance;
		this.stage = stage || stage;
		turn = 0;
		step = 0;
		Game.instance = this;
		const stageData = this.getStageData(this.stage);
		this.stageName = stageData.name;
		board = new Board(stageData);
		this.start();
	}

	start() {
		board.draw();
		this.loop = setInterval(e => {
			if (state < 2) {
				// gameplay
				step ++;
				if (!earth) board.draw();
			} else if (state < 4) {
				// switch state - will be loading new level
				clearInterval(this.loop);
				this.destroy();
				startGame(state > 2);
			} else {
				clearInterval(this.loop);
				board.displayScreen();
			}
		}, 1000 / 60);
	}

	resize() {
		//board.resize();
		board.draw();
	}

	destroy() {
		Game.instance = null;
		board.destroy();
		board = null;
	}

	getStageData(id) {
		const obj = [
			{
				name: "Easter Island",
				size: 14, x: 7, y: 8,
				map: "fffffffffffffffc5fffff001ffff0005fff400013c020020d000003d0000ffd0005ff0015fff08fffff00fffffc3",
				data: "0000000000000002f000009030000660f000fd1074024800d302061831000003200f00903f0007200000b90000024",
				path: "",
			},
			{
				name: "Stage 1",
				size: 5, x: 2, y: 2, wood: 8, rock: 3, mana: 6,
				map: "f7f0300000c0",
				data: "00004426420c",
				path: "  0"
			},
			{
				name: "Stage 2",
				size: 5, x: 2, y: 2, wood: 8, rock: 3, mana: 8,
				map: "f7f0308000c0",
				data: "00000010500d",
				path: ""
			},
			{
				name: "Stage 3",
				size: 5, x: 2, y: 2, wood: 8, rock: 3, mana: 8,
				map:  "f7c0820820c0",
				data: "001004a0480e",
				path: ""
			},

			{
				name: "Stage 4",// empty with 1 ahu -
				size: 5, x: 2, y: 2, wood: 8, rock: 3, mana: 8,
				map: "f7c0000000c0",
				data: "0000",
				path: ""
			},
			/*{
				name: "Stage 3",// empty with 1 ahu -
				size: 5, x: 2, y: 2, wood: 8, rock: 3, mana: 8,
				map: "f7c0000000c0",
				data: "0000",
				path: ""
			},*/
			/*{
				name: "Stage 3",// empty with 1 ahu ^
				size: 5, x: 2, y: 2, wood: 8, rock: 3, mana: 8,
				map: "f7f0080000c0",
				data: "0000",
				path: ""
			},*/
			/*{
				name: "Stage",// empty with 3 ahus
				size: 5, x: 2, y: 2, wood: 5, rock: 3, mana: 16,
				map: "d5c0000000083",
				data: "0000",
				path: ""
			},*/
			/*{
				name: "Stage 3",
				size: 5, x: 2, y: 2, wood: 5, rock: 3, mana: 5,
				map: "c4f0308000c0",
				data: "00020010500d",
				path: ""
			},*/
			{
				name: "Stage 6",
				size: 5, x: 2, y: 2, wood: 5, rock: 3, mana: 16,
				map: "d5c0022800083",
				data: "00007c424ec2c",
				path: ""
			},
			{
				name: "Stage 3",
				size: 5, x: 2, y: 2, wood: 5, rock: 3, mana: 16,
				map: "d5c0022800083",
				data: "00007c424ec2c",
				path: ""
			},
			
		];

		obj[id].id = id;

		return obj[id];
	}
}