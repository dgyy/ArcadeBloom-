(function(){var SPRITE_URL, log, sound, generateLevel, Canvas, Tile, Level, Dungeon, MonsterBase, Monster, Player, events;
SPRITE_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAATAAAAAQCAMAAACm/tNDAAAAAXNSR0IArs4c6QAAADZQTFRFAAAAAAAAAHcAAKoAQh8fREREXywRZgBmiAAAiACIiEQAiIiIqgCqu2YAzAAAzMzM3d0A////qlkdZwAAAAF0Uk5TAEDm2GYAAAOnSURBVFjDnZiLYoMgDEXFjg2xsPr/P7uEBPJAO7c4H1ic5fTeEF2+XXxAtA1tv3+LhSKlxcSKsVxFxljehP84QCy346SzP+Pb/vu7KKX0w/8C++SV71ePZHE9Hg9N7LlpGgXDMjEIJ6A3gEmPMPf2Z3w71Zre4Xq9XuWPwDqg0cZgYAnuB3eUWyIuJCa8ntumeCExWLPmBd8pa6KG2B2F9S5hBhZqgD/773QX+v6XvF4tyjkwHwfFADTaorB0HLWOW6IVPbAnAmNimdRFOwFWFLFcVljy9QCvgAXa1zNBqTOBAAbhFSr8pbe8roBZfX18AJyqAfl2syMAa2tCXg8yZPPk2nkhsE146QMFjImxZbVhbXPf9ytioYexVG6/kOWngVUnsTrz+jOwGCMBq0hHLMl3I5UlEhensJXS2LMD24hM6ViyBqYklr1hF+/fnM+QEYOZWMk4slxuWxJ51ep4Fcr8N4HFBigCMMIjCmNg/UdaWVsEDV35FGCbGbo5xEYWT2rxwbLojFZIgEQsjM3IYhOxTEPL2pLVWTJoS9aGqxpDFlYZc9r3qxxGgGJTWIyTJcGQAxd8lMSNnMaeGth2DownAUn0ZsqERY+/MDQihuf1/Mj7qK4IHZhwrUElsYQJzCYxHI3N+OV1AczICzZswRkYWzJ1Px4MbHUKY1JfFKglNRmanCWUTBWX8yyZPDRmPhGJxYbsFFgIXWHUITVYIWhXzsBeDpgpKywwZ8lJYSOBsSfXnsO4FNPAtK7MgclRtoobvBhAIVxw0IC9YHH1V/iOWmMWWAiiMOyQqiiMidWWwapL+veBHTbpu7IimWB5sCtp0AKs5yu3P+MlxHJgZJyqciiq8JZpUZA2YELMA5Mc1oAlyWG9lGzyOgFWbtRhjcs+t3XhCvP8ceyXI146MJO6OqSphuhFSb/eKYxSvpokJ17NkpGo7XPSH7UH5z6gw7NkVdWEVBblPTAjLyr1P92E0Nr20cgAWyXjCzHFKzOwtp94lTJ4k46gBw2wcLrvmxmYPhXjOPUvYFeV2B1gJ4+RFtiOLt0HL36YVM+SCGyxJYPfCzDK+XA1AxONXZWrwXfo/FiUv9ZhPZ28eZbslesNYOc+1ZZUwPr05t5WbF+67LT74l9cwBSLK9su4zS57LeASQ/Qz94rNF/pcy0itkZYKZ0+PqjS796z5L23Fft4WHnzUucqphc9WMjjOuowHNw5rkWs1Q6MxIQeHOrrfRtgtfVG/ABPYmmKABRnQQAAAABJRU5ErkJggg==';
/*global log: true*/
log =
(function () {
"use strict";

var logElement = document.getElementById('log'),
	queue = [],
	async = false;

function toggleAsync (on) {
	async = on;
}

function clearQueue () {
	queue.forEach(function (data) {
		log(data[0], data[1]);
	});
	queue = [];
}

function log (str, cls) {
	var li;
	if (async) {
		queue.push([str, cls]);
		return;
	}
	li = document.createElement('li');
	li.textContent = str.charAt(0).toUpperCase() + str.slice(1);
	li.className = cls || '';
	logElement.insertBefore(li, logElement.firstChild);
	logElement.scrollTop = 0;
}

log.async = toggleAsync;
log.clearQueue = clearQueue;

return log;
})();/*global sound: true*/
sound =
(function () {
"use strict";

var AC = window.AudioContext || window.webkitAudioContext,
	soundCheckbox = document.getElementById('sound'),
	ac;

function generateSound (freq, incr, delay, times, vol, type) {
	//based on https://github.com/foumart/JS.13kGames/blob/master/lib/SoundFX.js
	//which is why the parameters are a little odd
	var start, end, osc, gain;

	if (!ac) {
		ac = new AC();
	}
	start = ac.currentTime + 0.01;
	end = start + delay * times / 1000;

	osc = ac.createOscillator();
	gain = ac.createGain();
	osc.type = ['square', 'sawtooth', 'triangle', 'sine'][type || 0];
	gain.gain.value = 0;
	osc.connect(gain);
	gain.connect(ac.destination);
	osc.start();

	osc.frequency.setValueAtTime(freq, start);
	osc.frequency.linearRampToValueAtTime(freq + incr * times, end);
	gain.gain.setValueAtTime(vol, start);
	gain.gain.linearRampToValueAtTime(0, end);
	osc.stop(end + 0.01);
}

function playSound (type) {
	if (!AC || !soundCheckbox.checked) {
		return;
	}
	switch (type) {
	case 'move':
		generateSound(100, -10, 15, 15, 0.7, 2);
		break;
	case 'item':
		generateSound(510, 0, 15, 20, 0.1);
		setTimeout(function () {
			generateSound(2600, 1, 10, 50, 0.2);
		}, 80);
		break;
	case 'ranged':
		generateSound(160, 10, 15, 10, 0.1);
		generateSound(250, -20, 30, 10, 0.1, 1);
		generateSound(1500, -150, 30, 10, 0.1, 1);
		break;
	case 'hit':
		generateSound(100, -10, 10, 25, 0.5);
		generateSound(125, -5, 20, 45, 0.1, 1);
		generateSound(40, 2, 20, 20, 1, 2);
		generateSound(200, -4, 10, 100, 0.25, 2);
		break;
	case 'strong':
		generateSound(220, 15, 20, 15, 0.3, 2);
		break;
	case 'weak':
		generateSound(440, -15, 20, 15, 0.3, 2);
	}
}

return playSound;
})();/*global generateLevel: true*/
generateLevel =
(function () {
"use strict";

var LEVEL_W_2 = 50,
	LEVEL_H_2 = 20,
	ROOM_MIN_W = 4,
	ROOM_MIN_H = 4,
	ROOM_MAX_W = 12,
	ROOM_MAX_H = 8,
	ROOMS_MAX_AREA = 0.3 * LEVEL_W_2 * LEVEL_H_2,
	ROOMS_MAX_TRIES = 10000,
	CORRIDORS_MAX_TRIES = 10000;

function rand (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(min + Math.random() * (max + 1 - min));
}

function randEven (min, max) {
	return 2 * rand(min / 2, max / 2);
}

function roomsOverlap (r1, r2) {
	if (Math.abs(r1.x - r2.x) > (r1.x < r2.x ? r1.w : r2.w)) {
		return false;
	}
	if (Math.abs(r1.y - r2.y) > (r1.y < r2.y ? r1.h : r2.h)) {
		return false;
	}
	return true;
}

function isAdjacentToRoom (r, x, y) {
	if (x === r.x - 1 || x === r.x + r.w) {
		if (r.y - 1 <= y && y <= r.y + r.h) {
			return true;
		}
	}
	if (y === r.y - 1 || y === r.y + r.h) {
		if (r.x - 1 <= x && x <= r.x + r.w) {
			return true;
		}
	}
	return false;
}

function isAdjacentToAnyRoom (rooms, x, y) {
	var i;
	for (i = 0; i < rooms.length; i++) {
		if (isAdjacentToRoom(rooms[i], x, y)) {
			return true;
		}
	}
	return false;
}

function roomsToMap (rooms, corridors, x0, y0, centerExit) {
	var x, y, i, row, level = [];

	function add (roomOrCorridor, c) {
		var x, y;
		for (x = 0; x < roomOrCorridor.w; x++) {
			for (y = 0; y < roomOrCorridor.h; y++) {
				level[y + roomOrCorridor.y + 1][x + roomOrCorridor.x + 1] = c;
			}
		}
	}

	for (y = 0; y < LEVEL_H_2 + 2; y++) {
		row = [];
		for (x = 0; x < LEVEL_W_2 + 2; x++) {
			row.push('#');
		}
		level.push(row);
	}
	for (i = 0; i < corridors.length; i++) {
		add(corridors[i], ' ');
	}
	for (i = 0; i < rooms.length; i++) {
		add(rooms[i], '.');
	}
	level[y0 + 1][x0 + 1] = '<';
	i = rooms.length === 1 ? 0 : rand(1, rooms.length - 1);
	if (centerExit) {
		x = Math.floor(rooms[i].w / 2) + rooms[i].x;
		y = Math.floor(rooms[i].h / 2) + rooms[i].y;
	} else {
		x = rand(0, rooms[i].w - 1) + rooms[i].x;
		y = rand(0, rooms[i].h - 1) + rooms[i].y;
	}
	level[y + 1][x + 1] = '>';
	return level.map(function (row) {
		return row.join('');
	}).join('\n');
}

function mazeToMap (open, x0, y0) {
	var x, y, i, row, level = [], dx, dy;
	dx = 1 + x0 % 2;
	dy = 1 + y0 % 2;
	for (y = 0; y < LEVEL_H_2 + 2; y++) {
		row = [];
		for (x = 0; x < LEVEL_W_2 + 2; x++) {
			row.push('#');
		}
		level.push(row);
	}
	for (i = 0; i < open.length; i++) {
		level[open[i][1] + dy][open[i][0] + dx] = '.';
	}
	level[y0 + 1][x0 + 1] = '<';
	x = randEven(0, LEVEL_W_2 - 12) + x0 % 2;
	if (Math.abs(x0 - x) <= 5) {
		x += 10;
	}
	y = randEven(0, LEVEL_H_2 - 12) + y0 % 2;
	if (Math.abs(y0 - y) <= 5) {
		y += 10;
	}
	level[y + 1][x + 1] = '>';
	return level.map(function (row) {
		return row.join('');
	}).join('\n');
}

function createRoomAround (x, y) {
	var i, room;
	for (i = 0; i < ROOMS_MAX_TRIES; i++) {
		room = {
			x: rand(0, x),
			y: rand(0, y),
			w: rand(ROOM_MIN_W, ROOM_MAX_W),
			h: rand(ROOM_MIN_H, ROOM_MAX_H)
		};
		if (
			(room.x + room.w <= LEVEL_W_2) &&
			(room.y + room.h <= LEVEL_H_2) &&
			(room.x + room.w > x) &&
			(room.y + room.h > y)
		) {
			return room;
		}
	}
	return { //so unlikely that we don't really have to care
		x: x,
		y: y,
		w: 1,
		h: 1
	};
}

function createRandomRoom (rooms) {
	var room, i;
	room = {
		x: rand(0, LEVEL_W_2 - ROOM_MIN_W),
		y: rand(0, LEVEL_H_2 - ROOM_MIN_H),
		w: rand(ROOM_MIN_W, ROOM_MAX_W),
		h: rand(ROOM_MIN_H, ROOM_MAX_H)
	};
	if (room.x + room.w > LEVEL_W_2) {
		return;
	}
	if (room.y + room.h > LEVEL_H_2) {
		return;
	}
	for (i = 0; i < rooms.length; i++) {
		if (roomsOverlap(rooms[i], room)) {
			return;
		}
	}
	return room;
}

function connectRooms (room1, room2, rooms) {
	var roomX, roomY, i, x, y, corridorX, corridorY;
	if (Math.random() < 0.5) {
		roomX = room1;
		roomY = room2;
	} else {
		roomX = room2;
		roomY = room1;
	}

	//by using even coordinates only we avoid two adjacent corridors
	//without wall between them
	//a whole corridor might still run directly next to a room,
	//but this merely extends the room
	//even if we fail to get a good coordinate, the result will
	//only look a bit ugly, but still okay
	for (i = 0; i < CORRIDORS_MAX_TRIES; i++) {
		x = randEven(roomX.x, roomX.x + roomX.w - 1);
		y = randEven(roomY.y, roomY.y + roomY.h - 1);
		if (!isAdjacentToAnyRoom(rooms, x, y)) {
			break;
		}
	}

	corridorX = {
		x: x,
		y: Math.min(roomX.y, y),
		w: 1,
		h: Math.abs(roomX.y - y) + 1
	};
	corridorY = {
		x: Math.min(roomY.x, x),
		y: y,
		w: Math.abs(roomY.x - x) + 1,
		h: 1
	};
	return [corridorX, corridorY];
}

function generateRooms (x, y) {
	var rooms = [], i, room, area;
	room = createRoomAround(x, y);
	area = room.w * room.h;
	rooms.push(room);
	for (i = 0; i < ROOMS_MAX_TRIES; i++) {
		room = createRandomRoom(rooms);
		if (room) {
			area += room.w * room.h;
			rooms.push(room);
			if (area >= ROOMS_MAX_AREA) {
				break;
			}
		}
	}
	return rooms;
}

function generateCorridors (rooms) {
	var i, corridors = [];
	for (i = 1; i < rooms.length; i++) {
		//connect each room to one of the preceding ones, this will connect all rooms
		//and since the corridors may overlap other rooms and other corridors
		//we will not get a topological tree, but something more interesting
		corridors = corridors.concat(connectRooms(rooms[rand(0, i - 1)], rooms[i], rooms));
	}
	return corridors;
}

//Randomized Kruskal's Algorithm
//w, h must be odd
function generateMaze (w, h) {
	var x, y, wall = [], open = [], desctructible = [], sets = {}, i, d, c1, c2;
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			if (x % 2 === 0 && y % 2 === 0) {
				open.push([x, y]);
				sets[x + ',' + y] = open.length;
			} else if (x % 2 === 0 || y % 2 === 0) {
				desctructible.push([x, y]);
			} else {
				wall.push([x, y]);
			}
		}
	}
	while (desctructible.length) {
		i = rand(0, desctructible.length - 1);
		d = desctructible.splice(i, 1)[0];
		if (d[0] % 2) {
			c1 = (d[0] - 1) + ',' + d[1];
			c2 = (d[0] + 1) + ',' + d[1];
		} else {
			c1 = d[0] + ',' + (d[1] - 1);
			c2 = d[0] + ',' + (d[1] + 1);
		}
		c1 = sets[c1];
		c2 = sets[c2];
		if (c1 === c2) {
			wall.push(d);
		} else {
			open.push(d);
			Object.keys(sets).forEach(function (key) {
				if (sets[key] === c2) {
					sets[key] = c1;
				}
			});
		}
	}
	return open;
}

function generateLevel (x, y, maze, centerExit) {
	var rooms, corridors;
	if (x === -1) {
		x = rand(0, LEVEL_W_2 - 1);
		y = rand(0, LEVEL_H_2 - 1);
	} else {
		x--;
		y--;
	}
	if (maze) {
		maze = generateMaze(LEVEL_W_2 - 1 - LEVEL_W_2 % 2, LEVEL_H_2 - 1 - LEVEL_H_2 % 2);
		return mazeToMap(maze, x, y);
	}
	rooms = generateRooms(x, y);
	corridors = generateCorridors(rooms);
	return roomsToMap(rooms, corridors, x, y, centerExit);
}

/*
TODO It would be nice to have levels with rooms and mazes together.
To do so, create one big room with even x, y, and odd w, h
Create rooms left and right of it, connect them independently.
Then connect the big room to one room on the left, and one on the right.
Constract a maze inside the big room.
*/

/*function test () {
	document.getElementById('output').textContent = generateLevel(-1, -1);
}

test();*/

return generateLevel;

})();/*global Canvas: true*/
/*global SPRITE_URL*/
Canvas =
(function () {
"use strict";

var SPRITE_COUNT = 19, ANIMATION_DURATION = 200;

function Canvas () {
	this.canvas = document.getElementById('canvas');
	this.ctx = this.canvas.getContext('2d', {alpha: false});
	this.cover = document.getElementById('cover');
	this.coverCtx = this.cover.getContext('2d');
}

Canvas.animations = [];

Canvas.addAnimation = function (x0, y0, x1, y1, horseshoe) {
	Canvas.animations.push({x0: x0, y0: y0, x1: x1, y1: y1, h: horseshoe});
};

Canvas.prototype.loadSprites = function (callback) {
	var img = new Image();
	this.sprites = [];
	img.onload = function () {
		var i, canvas, ctx;
		for (i = 0; i < SPRITE_COUNT; i++) {
			canvas = document.createElement('canvas');
			canvas.width = 16;
			canvas.height = 16;
			ctx = canvas.getContext('2d');
			ctx.drawImage(img, i * 16, 0, 16, 16, 0, 0, 16, 16);
			this.sprites.push(canvas);
		}
		this.prepareInv();
		callback();
	}.bind(this);
	img.src = SPRITE_URL;
};

Canvas.prototype.prepareInv = function () {
	var inv = document.getElementById('inv'), el;
	el = this.sprites[7];
	el.style.display = 'none';
	el.title = 'horseshoe';
	inv.appendChild(el);
	el = this.sprites[8];
	el.style.display = 'none';
	el.title = 'flashlight';
	inv.appendChild(el);
	el = this.sprites[6];
	el.style.display = 'none';
	el.title = 'lucky charm';
	inv.appendChild(el);
	inv.appendChild(document.createElement('span'));
	el = this.sprites[4];
	el.style.display = 'none';
	el.title = 'lucky mushroom';
	el.className = 'mushroom';
	inv.appendChild(el);
	el = document.createElement('span');
	el.className = 'mushroom';
	inv.appendChild(el);
};

Canvas.prototype.setSize = function (w, h) {
	var w0 = w * 16, h0 = h * 16,
		f, w1, h1;
	f = Math.max(1, Math.min((window.innerWidth - 20) / w0, (window.innerHeight - 80) / h0));
	w1 = (w0 * f) + 'px';
	h1 = (h0 * f) + 'px';
	if (this.canvas.width !== w0) {
		this.canvas.width = w0;
		this.canvas.height = h0;
		this.cover.width = w0;
		this.cover.height = h0;
	}
	if (this.f !== f) {
		this.f = f;
		this.canvas.style.width = w1;
		this.canvas.style.height = h1;
		this.cover.style.width = w1;
		this.cover.style.height = h1;
	}
};

Canvas.prototype.getTile = function (x, y) {
	var rect = this.canvas.getBoundingClientRect();
	x = (x - rect.left) / this.f;
	y = (y - rect.top) / this.f;

	x = Math.floor(x / 16);
	y = Math.floor(y / 16);

	return [x, y];
};

Canvas.prototype.showTarget = function (x, y, c) {
	x = x * 16 + 8;
	y = y * 16 + 8;
	this.coverCtx.fillStyle = 'rgba(255,255,255,0.75)';
	this.coverCtx.fillRect(x, y, 8, 8);
	this.coverCtx.font = '10px monospace';
	this.coverCtx.textAlign = 'center';
	this.coverCtx.fillStyle = '#000';
	this.coverCtx.fillText(c, x + 4, y + 8);
};

Canvas.prototype.clearTargets = function () {
	this.coverCtx.clearRect(0, 0, this.cover.width, this.cover.height);
};

Canvas.prototype.showAnimation = function (x0, y0, x1, y1, horseshoe, p) {
	var x, y, a;
	a = p * Math.PI * 4;
	if (horseshoe) {
		p = p > 0.5 ? 2 - 2 * p : 2 * p;
	}
	x = x0 + (x1 - x0) * p;
	y = y0 + (y1 - y0) * p;
	this.coverCtx.save();
	this.coverCtx.translate(x * 16 + 8, y * 16 + 8);
	this.coverCtx.rotate(a);
	this.coverCtx.drawImage(this.sprites[horseshoe ? 7 : 17], -8, -8);
	this.coverCtx.restore();
};

Canvas.prototype.runAnimations = function () {
	var rAF = window.requestAnimationFrame || window.mozRequestAnimationFrame, start, step;
	if (Canvas.animations.length === 0) {
		return;
	}

	step = function (t) {
		var i, p, data;
		if (!start) {
			start = t;
		}
		this.clearTargets();
		p = (t - start) / ANIMATION_DURATION;
		if (p <= 1) {
			for (i = 0; i < Canvas.animations.length; i++) {
				data = Canvas.animations[i];
				this.showAnimation(data.x0, data.y0, data.x1, data.y1, data.h, p);
			}
			rAF(step);
		} else {
			Canvas.animations = [];
		}
	}.bind(this);

	rAF(step);
};

return Canvas;
})();/*global Tile: true*/
Tile =
(function () {
"use strict";

function Tile (type) {
	this.type = type;
	this.seen = false; //will be updated on draw
}

Tile.draw = {
	'.': function (ctx) {
		ctx.fillStyle = 'rgba(128,128,128,0.75)';
		ctx.fillRect(0, 0, 16, 16);
	},
	' ': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
	},
	'#': function (ctx, sprites) {
		ctx.drawImage(sprites[1], 0, 0);
	},
	'>': function (ctx, sprites) {
		ctx.drawImage(sprites[2], 0, 0);
	},
	'<': function (ctx, sprites) {
		ctx.drawImage(sprites[3], 0, 0);
	},
	'F': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
		ctx.drawImage(sprites[4], 0, 0);
	},
	'%': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
		ctx.drawImage(sprites[5], 0, 0);
	},
	'*': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
		ctx.drawImage(sprites[6], 0, 0);
	},
	')': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
		ctx.drawImage(sprites[7], 0, 0);
	},
	'(': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
		ctx.drawImage(sprites[8], 0, 0);
	},
	'?': function (ctx, sprites) {
		ctx.drawImage(sprites[0], 0, 0);
		ctx.drawImage(sprites[18], 0, 0);
	}
};

Tile.prototype.draw = function (canvas, currentlySeen) {
	if (currentlySeen) {
		this.seen = true;
	}
	if (!this.seen) {
		return;
	}
	Tile.draw[this.type](canvas.ctx, canvas.sprites);
	//TODO for walls cover unseen parts?
	//i.e. cover each corner in black if all three neighbors are walls or never seen
	//and in gray if all three neighbors are currently not seen
	if (!currentlySeen) {
		Tile.draw['.'](canvas.ctx);
	}
};

//whether we can walk on and look through this tile
Tile.prototype.isOpen = function () {
	return this.type !== '#';
};

Tile.prototype.isSeen = function () {
	return this.seen;
};

Tile.prototype.getType = function () {
	return this.type;
};

//also used to drop an item
Tile.prototype.takeItem = function (c) {
	this.type = c || ' ';
};

return Tile;
})();/*global Level: true*/
/*global Tile, log*/
Level =
(function () {
"use strict";

function Level (data, depth) {
	this.tiles = data.split('\n').map(function (line) {
		return line.split('').map(function (c) {
			return new Tile(c);
		});
	});
	this.npc = [];
	this.depth = depth;
}

Level.prototype.draw = function (canvas, player) {
	var h = this.tiles.length, w = this.tiles[0].length, x, y, i, monster, monsterVisible = false;

	canvas.setSize(w, h);

	canvas.ctx.fillStyle = '#000';
	canvas.ctx.fillRect(0, 0, w * 16, h * 16);
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			canvas.ctx.save();
			canvas.ctx.translate(x * 16, y * 16);
			this.tiles[y][x].draw(canvas, player.canSee(x, y));
			canvas.ctx.restore();
		}
	}

	this.visibleMonsters = [];
	for (i = 0; i < this.npc.length; i++) {
		monster = this.npc[i];
		x = monster.x;
		y = monster.y;
		if (player.canSee(x, y)) {
			canvas.ctx.save();
			canvas.ctx.translate(x * 16, y * 16);
			monster.draw(canvas);
			canvas.ctx.restore();
			if (!monster.seen) {
				log(
					monster.seenBefore ?
						'you see ' + monster.getDesc(true) + ' again.' :
						'you see ' + monster.getDesc() + '.'
				);
			}
			monster.seen = true;
			monster.seenBefore = true;
			monsterVisible = true;
			this.visibleMonsters.push(monster);
		} else {
			monster.seen = false;
		}
	}
	canvas.ctx.save();
	canvas.ctx.translate(player.x * 16, player.y * 16);
	player.draw(canvas);
	canvas.ctx.restore();

	player.showLuck();

	return monsterVisible;
};

Level.prototype.isOpen = function (x, y) {
	if (
		x < 0 || x >= this.tiles[0].length ||
		y < 0 || y >= this.tiles.length
	) {
		return false;
	}
	return this.tiles[y][x].isOpen();
};

Level.prototype.hasBeenSeen = function (x, y) {
	if (
		x < 0 || x >= this.tiles[0].length ||
		y < 0 || y >= this.tiles.length
	) {
		return false;
	}
	return this.tiles[y][x].isSeen();
};

Level.prototype.getType = function (x, y) {
	return this.tiles[y][x].getType();
};

Level.prototype.takeItem = function (x, y, c) {
	return this.tiles[y][x].takeItem(c);
};

Level.prototype.monsterAt = function (x, y) {
	var i, monster;
	for (i = 0; i < this.npc.length; i++) {
		monster = this.npc[i];
		if (monster.x === x && monster.y === y) {
			return monster;
		}
	}
};

Level.prototype.findFirst = function (type) {
	var x, y;
	for (x = 0; x < this.tiles[0].length; x++) {
		for (y = 0; y < this.tiles.length; y++) {
			if (this.tiles[y][x].getType() === type) {
				return [x, y];
			}
		}
	}
};

Level.prototype.findFreeTile = function (player) {
	var i, x, y;
	for (i = 0; i < 10000; i++) {
		x = Math.floor(Math.random() * this.tiles[0].length);
		y = Math.floor(Math.random() * this.tiles.length);
		if (
			this.isOpen(x, y) &&
			!this.monsterAt(x, y) &&
			!player.canSee(x, y)
		) {
			return [x, y];
		}
	}
};

Level.prototype.findFreeTileNear = function (x0, y0, player) {
	var d = 0, x, y;
	while (true) {
		//make sure you only call this if there is a free tile
		for (x = x0 - d; x <= x0 + d; x++) {
			for (y = y0 - d; y <= y0 + d; y++) {
				if (
					this.isOpen(x, y) &&
					!this.monsterAt(x, y) &&
					!player.canSee(x, y)
				) {
					return [x, y];
				}
			}
		}
		d++;
	}
};

Level.prototype.addMonster = function (monster, x, y) {
	monster.place(x, y, this);
	this.npc.push(monster);
};

Level.prototype.removeMonster = function (monster) {
	var i = this.npc.indexOf(monster);
	//assume i !== -1
	this.npc.splice(i, 1);
};

Level.prototype.leave = function () {
	var i;
	for (i = 0; i < this.npc.length; i++) {
		this.npc[i].seen = false;
	}
};

function dist (x0, y0, x1, y1) {
	return Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
}

function aStar (x0, y0, x1, y1, getNeighbours) {
	var todo = [], done = {}, data, id, neighbours, i, path;

	function addTodo (x, y, prev) {
		var data = {
			x: x,
			y: y,
			prev: prev,
			g: prev ? prev.g + 1 : 0,
			h: dist(x0, y0, x, y)
		}, i, f, fi;
		f = data.g + data.h;
		for (i = 0; i < todo.length; i++) {
			fi = todo[i].g + todo[i].h;
			if (f < fi || (f === fi && data.h < todo[i].h)) {
				todo.splice(i, 0, data);
				return;
			}
		}
		todo.push(data);
	}

	addTodo(x1, y1);
	while (todo.length) {
		data = todo.shift();
		id = data.x + ',' + data.y;
		if (done[id]) {
			continue;
		}
		done[id] = data;
		if (data.x === x0 && data.y === y0) {
			break;
		}
		neighbours = getNeighbours(data.x, data.y);
		for (i = 0; i < neighbours.length; i++) {
			id = neighbours[i][0] + ',' + neighbours[i][1];
			if (!done[id]) {
				addTodo(neighbours[i][0], neighbours[i][1], data);
			}
		}
	}
	data = done[x0 + ',' + y0];
	if (!data) {
		return;
	}
	path = [];
	while (data) {
		path.push([data.x, data.y]);
		data = data.prev;
	}
	return path;
}

Level.prototype.findPath = function (x0, y0, x1, y1, onlySeen) {
	var level = this;
	return aStar(x0, y0, x1, y1, function (x, y) {
		return [
			//first straight
			[-1, 0], [1, 0], [0, -1], [0, 1],
			//then diagonal
			[-1, -1], [1, -1], [-1, 1], [1, 1]
		].map(function (rel) {
			return [x + rel[0], y + rel[1]];
		}).filter(function (pos) {
			return level.isOpen(pos[0], pos[1]) && (!onlySeen || level.hasBeenSeen(pos[0], pos[1]));
		});
	});
};

Level.prototype.autoexplore = function (player) {
	var minD = Infinity, minX, minY, d, x, y, path, i;
	for (x = 0; x < this.tiles[0].length; x++) {
		for (y = 0; y < this.tiles.length; y++) {
			if (this.isOpen(x, y) && !this.hasBeenSeen(x, y)) {
				//shortest path would be better, but more expensive
				d = Math.max(Math.abs(player.x - x), Math.abs(player.y - y));
				if (d < minD) {
					minX = x;
					minY = y;
					minD = d;
				}
			}
		}
	}
	if (minD === Infinity) {
		return;
	}
	path = this.findPath(player.x, player.y, minX, minY);
	if (!path) { //shouldn't happen
		return;
	}
	for (i = 0; i < path.length; i++) {
		if (!this.hasBeenSeen(path[i][0], path[i][1])) {
			path.length = i + 1;
			return path;
		}
	}
	return path;
};

return Level;
})();/*global Dungeon: true*/
/*global generateLevel, Level, Monster, log, sound*/
Dungeon =
(function () {
"use strict";

/*
Short game
==========
6 levels
lamp (() and horseshoe ()) randomly on first two levels
Chimney sweep with hint about all these items on third level
Level 4 or 5 is a maze.
On levels 3 to 5 two henchmen from start, and one may be randomly spawned on these levels
On last level Lord Balsekil and all remaining henchmen (including those from above, up to 8), surrounding him

1: newts only 4:2:1
2: newts 4:2:1, cats 1:0:0, crows 1:0:0, mirror monster 1
3: newts: 1:2:1, cats 2:1:1, crows 2:1:1, mirror monster 3, henchman 1.5
4: newts: 1:1:2, cats 1:2:1, crows 1:2:1, mirror monster 3, henchman 1.5
5: newts: 0:0.5:1, cats 1:1:2, crows 1:1:2, mirror monster 3, henchman 1.5
6: newts: 0:0.5:1, cats 1:2:4, crows 1:2:4, mirror monster 4

Normal game
===========
13 levels
horseshoe ()) randomly on first two levels
lamp (() randomly on second or third level
Chimney sweep with hint about all these items on fourth level
Up to two levels between level 4 and 12 (including) are mazes.
On levels 5 to 12 one henchman from start, and two may be randomly spawned on these levels
On last level Lord Balsekil and all remaining henchmen (including those from above, up to 13), surrounding him

1 as above
2, 3 as 2 above
4, 5, 6 as 3 above
7, 8, 9 as 4 above
10, 11, 12 as 5 abobe
13 as 6 above

Number of monsters at start (not including henchmen) rises from 3 on first to 6 on last level.
Monster spawn rate rises from 0.02 on first to 0.05 on last level.

In all cases 2 to 4 clover and 1 to 3 mushrooms per level.
Also 1 lucky charm (*) on first level, no on the last, 5 more randomly distributed.
Also 1 fortune cookie (?) on each of the first five levels.
*/
function Dungeon (mode) {
	this.prepare(mode);
	this.levels = [this.createLevel(3, 3, 0)];
	this.currentLevel = 0;
	this.henchmen = [];
}

Dungeon.prototype.prepare = function (mode) {
	var h0, h1, p, probs, i, j, c;

	function normalize (data) {
		var keys = Object.keys(data), i, s = 0;
		for (i = 0; i < keys.length; i++) {
			s += data[keys[i]];
		}
		for (i = 0; i < keys.length; i++) {
			data[keys[i]] /= s;
		}
		return data;
	}

	h0 = [
		[0, 0, 2, 2, 2, 0],
		[0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
	];
	h1 = [
		[0, 0, 3, 5, 7, 8],
		[0, 0, 0, 2, 3, 4, 6, 7, 8, 10, 11, 12, 13]
	];
	p = [
		[0, 1, 2, 3, 4, 5],
		[0, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5]
	];
	probs = [
		normalize({':1': 4, ':2': 2, ':3': 1}),
		normalize({':1': 4, ':2': 2, ':3': 1, 'f1': 1, 'B1': 1, 'n': 1}),
		normalize({':1': 1, ':2': 2, ':3': 1, 'f1': 2, 'f2': 1, 'f3': 1, 'B1': 2, 'B2': 1, 'B3': 1, 'n': 3, '&1': 1.5}),
		normalize({':1': 1, ':2': 1, ':3': 2, 'f1': 1, 'f2': 2, 'f3': 1, 'B1': 1, 'B2': 2, 'B3': 1, 'n': 3, '&1': 1.5}),
		normalize({':2': 0.5, ':3': 1, 'f1': 1, 'f2': 1, 'f3': 2, 'B1': 1, 'B2': 1, 'B3': 2, 'n': 3, '&1': 1.5}),
		normalize({':2': 0.5, ':3': 1, 'f1': 1, 'f2': 2, 'f3': 4, 'B1': 1, 'B2': 2, 'B3': 4, 'n': 4})
	];

	this.levelData = [];
	for (i = 0; i < h0[mode].length; i++) {
		this.levelData.push({items: []});
		c = 2 + Math.floor(Math.random() * 3);
		for (j = 0; j < c; j++) {
			this.levelData[i].items.push('%');
		}
		c = 1 + Math.floor(Math.random() * 2);
		for (j = 0; j < c; j++) {
			this.levelData[i].items.push('F');
		}

		this.levelData[i].h0 = h0[mode][i];
		this.levelData[i].h1 = h1[mode][i];
		this.levelData[i].p = probs[p[mode][i]];
	}
	for (i = 0; i < 5; i++) {
		this.levelData[i].items.push('?');
	}

	this.levelData[Math.floor(Math.random() * 2)].items.unshift(')'); //horseshoe on level 1 or 2
	this.levelData[Math.floor(Math.random() * 2) + (mode === 1 ? 1 : 0)].items.unshift('('); //lamp on 1 or 2 / 2 or 3

	c = mode === 1 ? 3 : 2;
	this.levelData[0].items.unshift('*');
	this.elc = [1, c]; //"early lucky charms", number of lucky charms before chimney sweep, and that level
	for (i = 0; i < 5; i++) { //5 more lucky charms
		j = Math.floor(Math.random() * (this.levelData.length - 1));
		this.levelData[j].items.unshift('*');
		if (j < c) {
			this.elc[0]++;
		}
	}
	this.levelData[c].c = true;
	if (mode === 0) {
		this.levelData[3 + Math.floor(2 * Math.random())].m = true;
	} else {
		this.levelData[4 + Math.floor(8 * Math.random())].m = true;
		this.levelData[4 + Math.floor(8 * Math.random())].m = true;
	}
};

Dungeon.prototype.init = function (player) {
	player.place(3, 3, this.levels[0]);
	player.elc = this.elc;
	this.initMonsters(player);
};

Dungeon.prototype.createLevel = function (x0, y0, depth) {
	var map = generateLevel(x0, y0, this.levelData[depth].m, depth === this.levelData.length - 1), i;

	function addRandom (c) {
		var i, pos;
		for (i = 0; i < 10000; i++) {
			pos = Math.floor(Math.random() * map.length);
			if (map.charAt(pos) === '.') {
				map = map.slice(0, pos) + c + map.slice(pos + 1);
				return;
			}
		}
		map = map.replace(/./, c); //if it failed that often, just use the first place
	}

	for (i = 0; i < this.levelData[depth].items.length; i++) {
		addRandom(this.levelData[depth].items[i]);
	}
	map = map.replace(/\./g, ' ');
	if (depth === 0) { //remove ladder up on first level
		map = map.replace('<', ' ');
	}
	//ladder down on last level is used as start for Lord Balsekil and removed later
	return new Level(map, depth);
};

Dungeon.prototype.goUp = function (player) {
	log('you climb up the ladder.');
	this.levels[this.currentLevel].leave();
	this.currentLevel--;
	player.level = this.levels[this.currentLevel];
	document.getElementById('level').textContent = 'Level ' + (this.currentLevel + 1);
};

Dungeon.prototype.goDown = function (player) {
	var level;
	log('you climb down the ladder.');
	this.levels[this.currentLevel].leave();
	this.currentLevel++;
	if (!this.levels[this.currentLevel]) {
		level = this.createLevel(player.x, player.y, this.currentLevel);
		this.levels.push(level);
	}
	player.level = this.levels[this.currentLevel];
	document.getElementById('level').textContent = 'Level ' + (this.currentLevel + 1);
	if (level) {
		this.initMonsters(player);
	}
};

Dungeon.prototype.createHenchman = function () {
	var monster;
	if (this.henchmen.length === this.maxHenchmen) {
		return new Monster('n');
	}
	monster = new Monster('&1');
	this.henchmen.push(monster);
	monster.desc[1] += this.henchmen.length;
	return monster;
};

Dungeon.prototype.createMonster = function (type) {
	if (type === '&1') {
		return this.createHenchman();
	}
	return new Monster(type);
};

Dungeon.prototype.createRandomMonster = function (data) {
	var keys = Object.keys(data), p = Math.random();
	while (keys.length > 1 && data[keys[0]] < p) {
		p -= data[keys[0]];
		keys.shift();
	}
	return this.createMonster(keys[0]);
};

Dungeon.prototype.addRandomMonster = function (player, henchman) {
	var pos, level = this.levels[this.currentLevel];
	pos = level.findFreeTile(player);
	if (pos) {
		level.addMonster(
			henchman ? this.createHenchman() : this.createRandomMonster(this.levelData[this.currentLevel].p),
			pos[0], pos[1]
		);
	}
};

Dungeon.prototype.initMonsters = function (player) {
	var pos, pos0, i,
		level = this.levels[this.currentLevel],
		levelData = this.levelData[this.currentLevel];
	if (levelData.c) {
		pos = level.findFirst('<');
		if (level.isOpen(pos[0] - 1, pos[1])) {
			pos[0]--;
		} else {
			pos[0]++;
		}
		level.addMonster(new Monster('@2'), pos[0], pos[1]);
	}
	this.maxHenchmen = levelData.h1;
	if (this.currentLevel === this.levelData.length - 1) {
		pos0 = level.findFirst('>');
		level.takeItem(pos0[0], pos0[1]);
		level.addMonster(new Monster('&2'), pos0[0], pos0[1]);

		this.transferHenchmen(pos0[0], pos0[1], player, level);
		while (this.henchmen.length < this.maxHenchmen) {
			pos = level.findFreeTileNear(pos0[0], pos0[1], player);
			level.addMonster(this.createHenchman(), pos[0], pos[1]);
		}
	} else {
		for (i = 0; i < levelData.h0; i++) {
			this.addRandomMonster(player, true);
		}
	}
	for (i = 0; i < 3 + Math.floor(3 * this.currentLevel / (this.levelData.length - 1)); i++) {
		this.addRandomMonster(player);
	}
};

Dungeon.prototype.spawnMonster = function (player) {
	if (Math.random() > 0.02 + 0.03 * this.currentLevel / (this.levelData.length - 1)) {
		return;
	}
	this.addRandomMonster(player);
};

Dungeon.prototype.transferHenchmen = function (x, y, player, level) {
	var i, henchman, pos, somethingDone = false;
	if (this.henchmenTransferred) {
		return;
	}
	for (i = 0; i < this.henchmen.length; i++) {
		henchman = this.henchmen[i];
		if (henchman.health === 0) {
			continue;
		}
		pos = level.findFreeTileNear(x, y, player);
		henchman.level.removeMonster(henchman);
		level.addMonster(henchman, pos[0], pos[1]);
		somethingDone = true;
	}
	if (somethingDone) {
		log('you sense that all of Lord Balsekil’s henchmen rushed to his help.', 'b');
		sound('ranged');
	}
	this.henchmenTransferred = true;
};

return Dungeon;
})();/*global MonsterBase: true*/
/*global Canvas, log, sound*/
MonsterBase =
(function () {
"use strict";

//base for Monster and Player
function MonsterBase () {
}

MonsterBase.draw = {
	'@': function (ctx, sprites, strong) {
		if (strong) {
			ctx.fillStyle = '#fa8';
			ctx.fillRect(3, 0, 9, 16);
		}
		ctx.drawImage(sprites[9], 0, 0);
	},
	'@2': function (ctx, sprites) {
		ctx.drawImage(sprites[10], 0, 0);
	},
	':1': function (ctx, sprites) {
		ctx.drawImage(sprites[11], 0, 0);
	},
	':2': function (ctx, sprites) {
		ctx.drawImage(sprites[11], 0, 0);
	},
	':3': function (ctx, sprites) {
		ctx.drawImage(sprites[11], 0, 0);
	},
	'f1': function (ctx, sprites) {
		ctx.drawImage(sprites[12], 0, 0);
	},
	'f2': function (ctx, sprites) {
		ctx.drawImage(sprites[12], 0, 0);
	},
	'f3': function (ctx, sprites) {
		ctx.drawImage(sprites[12], 0, 0);
	},
	'B1': function (ctx, sprites) {
		ctx.drawImage(sprites[13], 0, 0);
	},
	'B2': function (ctx, sprites) {
		ctx.drawImage(sprites[13], 0, 0);
	},
	'B3': function (ctx, sprites) {
		ctx.drawImage(sprites[13], 0, 0);
	},
	'n': function (ctx, sprites) {
		ctx.drawImage(sprites[14], 0, 0);
	},
	'&1': function (ctx, sprites) {
		ctx.drawImage(sprites[15], 0, 0);
	},
	'&2': function (ctx, sprites) {
		ctx.drawImage(sprites[16], 0, 0);
	}
};

MonsterBase.prototype.init = function (data) {
	this.health = data.health || 10;
	this.maxHealth = data.health || 10;
	this.experience = data.experience || 1;
	this.block = data.block || 0.1;
	this.minAttack = data.minAttack || 1;
	this.maxAttack = data.maxAttack || 2;
	if (data.speed) {
		this.speed = 1 / data.speed;
	}
	this.aiMode = data.aiMode;
	if (data.desc) {
		this.desc = JSON.parse(JSON.stringify(data.desc));
	}
	this.attackName = data.attackName;
};

MonsterBase.prototype.place = function (x, y, level) {
	this.x = x;
	this.y = y;
	this.level = level;
};

MonsterBase.prototype.drawHealth = function (ctx, w, h) {
	var relHealth = this.health / this.maxHealth, color, w2;
	color = 'hsl(' + Math.round(140 * relHealth * relHealth) + ',100%,30%)';
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, w, h);
	ctx.fillStyle = '#000';
	w2 = Math.round((w - 2) * (1 - relHealth));
	ctx.fillRect(w - w2 - 1, 1, w2, h - 2);
	return color;
};

MonsterBase.prototype.draw = function (canvas) {
	MonsterBase.draw[this.type](canvas.ctx, canvas.sprites, this.luckyMushroomTimeout);
	if (!this.isPlayer && this.health < this.maxHealth) {
		canvas.ctx.translate(2, 2);
		this.drawHealth(canvas.ctx, 12, 4);
	}
};

MonsterBase.prototype.moveTo = function (x, y) {
	var type, taken;
	this.x = x;
	this.y = y;
	if (this.isPlayer) {
		type = this.level.getType(x, y);
		if (type !== ' ') {
			taken = this.handleItem(type);
			if (taken) {
				this.level.takeItem(x, y);
			}
		}
	}
};

MonsterBase.prototype.moveRel = function (dx, dy) {
	var x = this.x + dx, y = this.y + dy, monster;
	monster = this.level.monsterAt(x, y);
	if (monster) {
		this.attack(monster);
		return true;
	}
	if (this.level.isOpen(x, y)) {
		this.moveTo(x, y);
		return true;
	}
	return false;
};

MonsterBase.prototype.rangedFails = function (d) {
	return Math.random() < (Math.pow(1.3, d / 2) - 1) / this.experience;
};

MonsterBase.prototype.blockAttack = function () {
	return Math.random() < this.block * this.experience * (this.hasHorseshoe && !this.usesHorseshoe ? 3 : 1);
};

MonsterBase.prototype.getAttackDamage = function () {
	return Math.round((this.minAttack + Math.random() * (this.maxAttack - this.minAttack)) * this.experience);
};

//only used for player
MonsterBase.prototype.improveExperience = function (maxTargetHealth) {
	var newExperience;
	if (this.luckyMushroomTimeout) {
		this.experience /= 2;
	}
	newExperience = this.experience * Math.pow(2, maxTargetHealth / 1200);
	if (newExperience > 2) {
		newExperience = 2;
	}
	if (Math.floor(newExperience * 10) !== Math.floor(this.experience * 10)) {
		log('you feel more experienced now.', 'b');
	}
	this.experience = newExperience;
	if (this.luckyMushroomTimeout) {
		this.experience *= 2;
	}
};

MonsterBase.prototype.getAttackName = function (ranged, failed) {
	var msg;
	if (this.isPlayer) {
		if (ranged) {
			msg = this.hasHorseshoe ? 'throw your horseshoe at' : 'yell your lucky number at';
		} else {
			msg = 'hit';
		}
		if (failed) {
			msg = 'try to ' + msg;
		}
		return 'you ' + msg + ' ';
	} else {
		if (this.attackName) {
			msg = this.attackName[failed ? 0 : 1];
		} else {
			msg = failed ? 'tries to attack' : 'attacks';
		}
		return this.getDesc(true) + ' ' + msg + ' ';
	}
};

MonsterBase.prototype.attack = function (target, ranged) {
	var died;

	function dist (a, b) {
		var x = a.x - b.x, y = a.y - b.y;
		return Math.sqrt(x * x + y * y);
	}

	if (target.health === 0) {
		return;
	}
	if (ranged) {
		Canvas.addAnimation(this.x, this.y, target.x, target.y, this.hasHorseshoe);
		sound('ranged');
	}
	if (ranged && this.rangedFails(dist(target, this))) {
		if (this.isPlayer) {
			log(this.getAttackName(true, true) + target.getDesc(true) + ', but miss.');
		} else {
			log(this.getAttackName(true, true) + 'you, but misses.');
		}
		return;
	}
	if (ranged && this.hasHorseshoe && target.type === 'n') {
		log('uh-oh! The mirror-monster shatters!', 'b');
		target.level.removeMonster(target);
		this.reduceHealth(20);
		return;
	}
	if (target.blockAttack()) {
		if (this.isPlayer) {
			log(this.getAttackName(ranged, true) + target.getDesc(true) + ', but your attack is blocked.');
		} else {
			log(this.getAttackName(ranged, true) + 'you, but you block the attack.');
		}
		return;
	}
	sound('hit');
	if (this.isPlayer) {
		log(this.getAttackName(ranged) + target.getDesc(true) + '.');
	} else {
		log(this.getAttackName(ranged) + 'you.');
		if (this.type.charAt(0) === 'B' && Math.random() < 0.3) {
			log(this.getDesc(true) + ' hits your eyes.');
			target.makeBlind();
		}
	}
	died = target.reduceHealth(this.getAttackDamage());
	if (died && this.isPlayer) {
		this.improveExperience(target.maxHealth);
	}
};

MonsterBase.prototype.reduceHealth = function (damage) {
	this.health -= damage;
	if (this.health <= 0) {
		this.health = 0;
		this.die();
		return true;
	}
};

MonsterBase.prototype.die = function () {
	if (!this.isPlayer) {
		log(this.getDesc(true) + ' vanishes.', 'b');
		if (this.type === '&2') {
			this.level.takeItem(this.x, this.y, '*');
			//NOTE when we are on a ladder, this will remove the ladder
			//and if there are still charms above you will lose the game
			//but this is very rare and the ladder might have been destroyed
			//during the fight
			log(this.getDesc(true) + ' left back a lucky charm!', 'b');
		}
		this.level.removeMonster(this);
	}
};

return MonsterBase;
})();/*global Monster: true*/
/*global MonsterBase, log*/
Monster =
(function () {
"use strict";

function Monster (type) {
	this.type = type;

	//updated on level draw
	this.seen = false;
	this.seenBefore = false;

	this.init(Monster.data[type]);
}

Monster.prototype = new MonsterBase();

//TODO balance values (also elsewhere, i.e. item and moster probs in dungeon.js,
//basic attack values in monster.js, and timeouts in player.js)
//Since I (knowing all spoilers) win often (once with the highest possible score)
//but sometimes lose, the values seem to be quite good by now.
Monster.data = {
	//newts (slow, melee only)
	':1': {
		desc: ['a small newt', 'the small newt'],
		attackName: ['tries to touch', 'touches'],
		speed: 0.5,
		maxAttack: 1,
		health: 5
	},
	':2': {
		desc: ['a newt', 'the newt'],
		attackName: ['tries to touch', 'touches'],
		speed: 0.75
	},
	':3': {
		desc: ['a large newt', 'the large newt'],
		attackName: ['tries to touch', 'touches']
	},
	//crows (fast, melee only, blinding attack)
	'B1': {
		desc: ['a small crow', 'the small crow'],
		attackName: ['tries to peck', 'pecks'],
		maxAttack: 1,
		health: 5
	},
	'B2': {
		desc: ['a crow', 'the crow'],
		attackName: ['tries to peck', 'pecks'],
		speed: 1.25,
		maxAttack: 1,
		health: 5
	},
	'B3': {
		desc: ['a large crow', 'the large crow'],
		attackName: ['tries to peck', 'pecks'],
		speed: 1.5,
		health: 5
	},
	//black cats (normal speed, ranged only)
	'f1': {
		desc: ['a small black cat', 'the small black cat'],
		attackName: ['tries to hiss at', 'hisses at'],
		maxAttack: 1,
		aiMode: 'ranged'
	},
	'f2': {
		desc: ['a black cat', 'the black cat'],
		attackName: ['tries to hiss at', 'hisses at'],
		maxAttack: 1,
		aiMode: 'ranged'
	},
	'f3': {
		desc: ['a large black cat', 'the large black cat'],
		attackName: ['tries to hiss at', 'hisses at'],
		aiMode: 'ranged'
	},
	//mirror monster (normal speed, ranged only, shatters when you throw horseshoe at it)
	'n': {
		desc: ['a mirror monster', 'the mirror monster'],
		attackName: ['tries to cast an evil look at', 'casts an evil look at'],
		aiMode: 'ranged',
		block: 0
	},
	//Lord Balsekil and his henchmen
	'&1': {
		desc: ['one of Balsekil’s henchmen', 'Henchman No. '],
		aiMode: 'meleeRanged',
		block: 0.125,
		health: 20,
		minAttack: 1,
		maxAttack: 3,
		experience: 1.25
	},
	'&2': {
		desc: ['Lord Balsekil', 'Lord Balsekil'],
		aiMode: 'meleeRanged',
		block: 0.2,
		health: 30,
		minAttack: 1,
		maxAttack: 5,
		experience: 1.75
	},
	//chimney sweep (gives hints)
	'@2': {
		desc: ['a chimney sweep', 'the chimney sweep'],
		aiMode: 'hint',
		block: 1
	}
};

Monster.prototype.getDesc = function (the) {
	return this.desc[the ? 1 : 0];
};

Monster.prototype.walkRandom = function (player) {
	var dx, dy;
	do {
		dx = Math.floor(Math.random() * 3) - 1;
		dy = Math.floor(Math.random() * 3) - 1;
	} while (!this.level.isOpen(this.x + dx, this.y + dy));
	if (
		!this.level.monsterAt(this.x + dx, this.y + dy) &&
		!(player.x === this.x + dx && player.y === this.y + dy)
	) {
		this.moveRel(dx, dy);
	}
};

Monster.prototype.huntPlayer = function (player) {
	var path = this.level.findPath(this.x, this.y, player.x, player.y);
	if (!path || path.length < 2 || this.level.monsterAt(path[1][0], path[1][1])) {
		//fist two shouldn't happen
		this.walkRandom(player);
	} else {
		this.moveRel(path[1][0] - path[0][0], path[1][1] - path[0][1]);
	}
};

Monster.prototype.meleeAI = function (player) {
	if (Math.abs(player.x - this.x) <= 1 && Math.abs(player.y - this.y) <= 1) {
		this.attack(player);
		return;
	}
	if (!this.seen) {
		this.walkRandom(player);
		return;
	}
	this.huntPlayer(player);
};

Monster.prototype.rangedAI = function (player) {
	if (
		this.seen ||
		//this might happen for fast monsters
		Math.abs(player.x - this.x) <= 1 && Math.abs(player.y - this.y) <= 1
	) {
		this.attack(player, true);
	} else {
		if (Math.random() < 0.5) {
			this.walkRandom(player);
		} else {
			this.huntPlayer(player);
		}
	}
};

Monster.prototype.meleeRangedAI = function (player) {
	var dx = player.x - this.x, dy = player.y - this.y;
	if (Math.abs(dx) <= 1 && Math.abs(dy) <= 1) {
		this.attack(player);
	} else if (this.seen && dx * dx + dy * dy <= 4) {
		this.attack(player, true);
	} else if (!this.seen) {
		this.rangedAI(player);
	} else if (Math.random() < 0.5) {
		this.attack(player, true);
	} else {
		this.huntPlayer(player);
	}
};

Monster.prototype.hintAI = function (player) {
	var hint;
	if (!this.seen) {
		return;
	}
	hint = player.getHint();
	if (this.lastHint !== hint) {
		log(this.getDesc(true) + ': “' + hint + '”', 'b');
		this.lastHint = hint;
	} else {
		this.walkRandom(player);
	}
};

Monster.prototype.monsterAI = function (player) {
	if (!this.seenBefore) {
		return;
	}
	switch (this.aiMode) {
	case 'ranged':
		this.rangedAI(player);
		break;
	case 'meleeRanged':
		this.meleeRangedAI(player);
		break;
	case 'hint':
		this.hintAI(player);
		break;
	default:
		this.meleeAI(player);
	}
};

return Monster;
})();/*global Player: true*/
/*global MonsterBase, log, sound*/
Player =
(function () {
"use strict";

function Player (dungeon) {
	this.type = '@';
	this.isPlayer = true;
	this.dungeon = dungeon;
	dungeon.init(this);

	this.sightRadius = 4;

	this.init({
		health: 77, //luck for player
		maxAttack: 2
	});

	this.steps = 0;
	this.maxDepth = 0;
	this.hasLamp = false;
	this.hasHorseshoe = false;
	this.luckyCharms = 0;
	this.luckyMushrooms = 0;
	this.luckyMushroomTimeout = 0;
	this.blind = false;
	this.blindTimeout = 0;
}

Player.prototype = new MonsterBase();

Player.prototype.showLuck = function () {
	if (!this.luckOutput) {
		this.luckOutput = document.getElementById('luck');
		this.luckCanvas = document.getElementById('luck-canvas').getContext('2d', {alpha: false});
		this.luckCanvas.canvas.width = 100;
		this.luckCanvas.canvas.height = 10;
	}
	this.luckOutput.style.color = this.drawHealth(this.luckCanvas, 100, 10);
	this.luckOutput.textContent = this.health + '/' + this.maxHealth;
};

Player.prototype.showInv = function () {
	var inv = document.getElementById('inv').childNodes;
	if (this.hasHorseshoe) {
		inv[0].style.display = '';
	}
	if (this.hasLamp) {
		inv[1].style.display = '';
	}
	if (this.luckyCharms) {
		inv[2].style.display = '';
		inv[3].textContent = '×' + this.luckyCharms;
	}
	if (this.luckyMushrooms) {
		inv[4].style.display = '';
		inv[5].textContent = '×' + this.luckyMushrooms;
	} else {
		inv[4].style.display = 'none';
		inv[5].textContent = '';
	}
};

Player.prototype.getHint = function () {
	var a = 'You should go back and get the ', b = ' before proceeding further.';
	if (!this.hasHorseshoe) {
		return a + 'horseshoe' + b;
	}
	if (!this.hasLamp) {
		return a + 'flashlight' + b;
	}
	if (this.elc[0] === 1) {
		return a + 'lucky charm' + b;
	}
	if (this.elc[0]) {
		return a + this.elc[0] + ' lucky charms' + b;
	}
	return 'Well done so far! Now find the remaining lucky charms, ' +
		'and find and defeat Lord Balsekil who has the seventh lucky charm.';
};

Player.prototype.getResult = function () {
	var experience = this.experience, points;
	if (this.luckyMushroomTimeout) {
		experience /= 2;
	}
	experience = Math.round(100 * (experience - 1));
	points = this.luckyCharms * 1000 + (this.maxDepth + 1) * 50 + Math.round(experience / 2) + this.health;
	return 'After ' + this.steps + ' steps you found ' +
		(this.luckyCharms === 1 ? 'one lucky charm' : (this.luckyCharms || 'no') + ' lucky charms') +
		', reached a depth of ' + (this.maxDepth + 1) +
		', and increased your experience by ' + experience + ' %. For this you earn ' + points + ' points.';
};

function bresenham (x0, y0, x1, y1, isOpen) {
	var x = x0,
		y = y0,
		dx = Math.abs(x1 - x0),
		sx = x0 < x1 ? 1 : -1,
		dy = -Math.abs(y1 - y0),
		sy = y0 < y1 ? 1 : -1,
		e = dx + dy, e2;
	while (x !== x1 || y !== y1) {
		if (!isOpen(x, y)) {
			return false;
		}
		e2 = e * 2;
		if (e2 > dy) {
			e += dy;
			x += sx;
		}
		if (e2 < dx) {
			e += dx;
			y += sy;
		}
	}
	return true;
}

Player.prototype.canSee = function (x, y) {
	var dx = x - this.x, dy = y - this.y, level = this.level;
	//walls can be seen if the nearest corner/border can be seen, otherwise it's the center
	if (!this.level.isOpen(x, y)) {
		if (dx > 0) {
			dx -= 0.5;
		} else if (dx < 0) {
			dx += 0.5;
		}
		if (dy > 0) {
			dy -= 0.5;
		} else if (dy < 0) {
			dy += 0.5;
		}
	}
	if (dx * dx + dy * dy > this.sightRadius * this.sightRadius) {
		return false;
	}
	return bresenham(this.x, this.y, x, y, function (x1, y1) {
		return level.isOpen(x1, y1) || (x === x1 && y === y1);
	});
};

Player.prototype.handleItem = function (type) {
	var msg, take = false,
		cookies = [
			'Never throw your horseshoe at a mirror monster!',
			'Beware of crows, they are fast and can blind you for some time!',
			'Try to get rid of as many of Lord Balsekil’s henchmen as possible before you finally meet him!',
			'Avoid ladders up unless you really have to use them.',
			'Balsekil is Volapük and means thirteen.',
			'The highest possible score is 7777.',
			'Thank you for playing!'
	];
	if (type === '>' && this.level.depth === 0) {
		log('you found the ladder down to the second level.');
	} else if (type === '<') {
		if (Math.random() < 0.3) {
			log('you accidentally walked below the ladder.', 'b');
			this.reduceHealth(2);
			sound('hit');
		}
	} else if (type === '%') {
		msg = 'you found a four-leave clover, ';
		if (this.health === this.maxHealth) {
			msg += 'but you leave it here for later.';
		} else {
			take = true;
			this.health += 7;
			if (this.health > this.maxHealth) {
				this.health = this.maxHealth;
			}
			msg += 'which' + (this.health === this.maxHealth ? '' : ' partially') + ' restores your luck.';
		}
		log(msg);
	} else if (type === '*') {
		if (this.level.depth < this.elc[1]) {
			this.elc[0]--;
		}
		this.luckyCharms++;
		take = true;
		log('you found a lucky charm.', 'b');
	} else if (type === 'F') {
		this.luckyMushrooms++;
		take = true;
		log(
			'you found a lucky mushroom' +
			(this.luckyMushrooms === 1 ? ', which you can eat to make you very strong for a short time' : '') + '.',
			this.luckyMushrooms === 1 ? 'b' : ''
		);
	} else if (type === '(') {
		take = true;
		this.hasLamp = true;
		if (!this.blind) {
			this.sightRadius = 6;
		}
		log('you found a flashlight.', 'b');
	} else if (type === ')') {
		take = true;
		this.hasHorseshoe = true;
		this.minAttack = 2;
		this.maxAttack = 4;
		log(
			'you found a horseshoe. From now on you will use it for attacks (it will return like a boomerang), ' +
			'and to defend against attacks (but only if you did not just throw it).',
			'b'
		);
	} else if (type === '?') {
		take = true;
		log(
			'you found a fortune cookie. It tastes delicious and has a paper inside: ' +
			cookies[Math.floor(Math.random() * cookies.length)],
			'b'
		);
	}
	if (take) {
		sound('item');
		this.showInv();
	}
	return take;
};

Player.prototype.eat = function () {
	if (this.luckyMushrooms === 0) {
		return false;
	}
	this.luckyMushrooms--;
	this.showInv();
	if (this.luckyMushroomTimeout === 0) {
		this.experience *= 2;
		log('you feel very strong!', 'b');
		sound('strong');
	}
	this.luckyMushroomTimeout += Math.floor(4 + Math.random() * 5); //will be decreased immediately
	return true;
};

Player.prototype.makeBlind = function () {
	if (this.blindTimeout === 0) {
		this.blind = true;
		this.sightRadius = 1.5;
		log('you can hardly see!');
	}
	this.blindTimeout += Math.floor(10 + Math.random() * 12);
};

Player.prototype.handleTimeouts = function () {
	if (this.luckyMushroomTimeout > 0) {
		this.luckyMushroomTimeout--;
		if (this.luckyMushroomTimeout === 0) {
			this.experience /= 2;
			log('you feel normal again.', 'b');
			sound('weak');
		}
	}
	if (this.blindTimeout > 0) {
		this.blindTimeout--;
		if (this.blindTimeout === 0) {
			this.sightRadius = this.hasLamp ? 6 : 4;
			log('your eyes are better again.');
		}
	}
};

Player.prototype.goUp = function () {
	if (this.level.getType(this.x, this.y) === '<') {
		this.dungeon.goUp(this);
		return true;
	}
};

Player.prototype.goDown = function () {
	if (this.level.getType(this.x, this.y) === '>') {
		this.dungeon.goDown(this);
		this.maxDepth = Math.max(this.maxDepth, this.level.depth);
		return true;
	}
};

return Player;
})();/*global events: true*/
/*global log, sound, Canvas*/
events =
(function () {
"use strict";

var queue = [], queueTimeout,
	rangedTargets,
	DELAY = 200,
	player, gameOver = false,
	canvas = new Canvas();

function getPrintableKey (code, shift) {
	var c = String.fromCharCode(code).toLowerCase();
	if (shift) {
		c = {'<': '>'}[c] || c.toUpperCase();
	}
	return c;
}

function getKey (e) {
	if (e.key && e.key !== 'Unidentified') {
		return {
			Left: 'ArrowLeft',
			Up: 'ArrowUp',
			Right: 'ArrowRight',
			Down: 'ArrowDown'
		}[e.key] || e.key;
	}
	return {
		12: 'Clear',
		33: 'PageUp',
		34: 'PageDown',
		35: 'End',
		36: 'Home',
		37: 'ArrowLeft',
		38: 'ArrowUp',
		39: 'ArrowRight',
		40: 'ArrowDown'
	}[e.which] || getPrintableKey(e.which, e.shiftKey);
}

function addMove (dx, dy, repeat) {
	var x, y;
	if (repeat) {
		x = player.x + dx;
		y = player.y + dy;
		while (player.level.isOpen(x, y)) {
			queue.push(['move', dx, dy]);
			x += dx;
			y += dy;
		}
	} else {
		queue.push(['move', dx, dy]);
	}
}

function addMoves (path) {
	var i, x, y;
	for (i = 0; i < path.length; i++) {
		if (i > 0) {
			queue.push(['move', path[i][0] - x, path[i][1] - y]);
		}
		x = path[i][0];
		y = path[i][1];
	}
}

function addWait (repeat) {
	var i;
	for (i = 0; i < (repeat ? 10 : 1); i++) {
		queue.push(['wait']);
	}
	if (repeat) {
		queue.push(['autowait']);
	}
}

function onKey (e) {
	var key;

	if (e.ctrlKey || e.altKey) {
		return;
	}
	key = getKey(e);
	queue = []; //abort any ongoing action

	if (rangedTargets) {
		if (rangedTargets[key]) {
			queue.push(rangedTargets[key]);
		}
		rangedTargets = false;
		canvas.clearTargets();
		key = '';
	}

	switch (key) {
	case '1':
	case 'End':
	case 'b':
	case 'B':
		addMove(-1, 1, e.shiftKey);
		break;
	case '2':
	case 'ArrowDown':
	case 'j':
	case 'J':
		addMove(0, 1, e.shiftKey);
		break;
	case '3':
	case 'PageDown':
	case 'n':
	case 'N':
		addMove(1, 1, e.shiftKey);
		break;
	case '4':
	case 'ArrowLeft':
	case 'h':
	case 'H':
		addMove(-1, 0, e.shiftKey);
		break;
	case '5':
	case 'Clear':
	case '.':
	case 'w':
	case 'W':
		addWait(e.shiftKey);
		break;
	case '6':
	case 'ArrowRight':
	case 'l':
	case 'L':
		addMove(1, 0, e.shiftKey);
		break;
	case '7':
	case 'Home':
	case 'y':
	case 'Y':
		addMove(-1, -1, e.shiftKey);
		break;
	case '8':
	case 'ArrowUp':
	case 'k':
	case 'K':
		addMove(0, -1, e.shiftKey);
		break;
	case '9':
	case 'PageUp':
	case 'u':
	case 'U':
		addMove(1, -1, e.shiftKey);
		break;
	case '<':
		queue.push(['goUp']);
		break;
	case '>':
		queue.push(['goDown']);
		break;
	case 'c':
		//queue = [];
		break;
	case 'e':
		queue.push(['eat']);
		break;
	case 'f':
		queue.push(['attack']);
		break;
	case 'm':
		queue.push(['sound']);
		break;
	case 'Q':
		queue.push(['quit']);
		break;
	case 'x':
		queue.push(['autoexplore']);
		break;
	}
	e.preventDefault();
	workQueue();
}

function onMouse (e) {
	var pos, x, y, monster, type, path;

	if (gameOver) {
		return;
	}

	pos = canvas.getTile(e.clientX, e.clientY);
	x = pos[0];
	y = pos[1];

	queue = [];

	if (!player.level.hasBeenSeen(x, y)) {
		log('you don’t know how to go there.');
	} else if (!player.level.isOpen(x, y)) {
		log('you cannot go there.');
	} else if (player.canSee(x, y) && (monster = player.level.monsterAt(x, y))) {
		if (Math.abs(x - player.x) <= 1 && Math.abs(y - player.y) <= 1) {
			queue.push(['move', x - player.x, y - player.y]);
		} else {
			queue.push(['attack', x, y]);
		}
	} else if (player.x === x && player.y === y) {
		type = player.level.getType(x, y);
		if (type !== '<' && type !== '>') {
			queue.push(['wait']);
		}
	} else {
		type = player.level.getType(x, y);
		path = player.level.findPath(player.x, player.y, x, y, true);
	}

	if (path) {
		addMoves(path);
	}
	if (type === '>') {
		queue.push(['goDown']);
	} else if (type === '<') {
		queue.push(['goUp']);
	}
	workQueue();
}

function onMouseInv (e) {
	if (e.target.className === 'mushroom') {
		queue.push(['eat']);
		workQueue();
	}
}

function init (p) {
	canvas.loadSprites(function () {
		player = p;
		document.addEventListener('keydown', onKey);
		canvas.canvas.addEventListener('click', onMouse);
		document.getElementById('inv').addEventListener('click', onMouseInv);
		player.level.draw(canvas, player);
		log('welcome. Find all seven lucky charms to win.', 'b');
	});
}

function workQueue () {
	var action, didSomething = false, i, c, monster, monsterSeen, path;
	clearTimeout(queueTimeout);
	while (!didSomething) {
		if (queue.length === 0) {
			return; //wait for input
		}
		action = queue.shift();
		if (gameOver && !(action[0] === 'sound' || action[0] === 'quit')) {
			return;
		}
		switch (action[0]) {
		case 'move':
			didSomething = player.moveRel(action[1], action[2]);
			if (didSomething) {
				sound('move');
			}
			break;
		case 'goUp':
			didSomething = player.goUp();
			break;
		case 'goDown':
			didSomething = player.goDown();
			break;
		case 'eat':
			didSomething = player.eat();
			break;
		case 'attack':
			if (action[1]) { //since the x coordinate can't be 0 this will work
				for (i = 0; i < player.level.visibleMonsters.length; i++) {
					monster = player.level.visibleMonsters[i];
					if (monster.x === action[1] && monster.y === action[2]) {
						break;
					} else {
						monster = null;
					}
				}
			} else if (player.level.visibleMonsters.length > 1) {
				rangedTargets = {};
				for (i = 0; i < player.level.visibleMonsters.length; i++) {
					monster = player.level.visibleMonsters[i];
					c = i < 9 ? String(i + 1) : String.fromCharCode(97 + i - 9);
					rangedTargets[c] = ['attack', monster.x, monster.y];
					canvas.showTarget(monster.x, monster.y, c);
				}
				monster = null;
				log('pick the target (1–' + c + ').');
			} else {
				monster = player.level.visibleMonsters[0];
			}
			if (monster) {
				player.attack(monster, true);
				if (player.hasHorseshoe) {
					player.usesHorseshoe = true;
				}
				didSomething = true;
			}
			break;
		case 'wait':
			didSomething = true;
			break;
		case 'autowait':
			log('still waiting, press c to cancel.');
			addWait(true);
			break;
		case 'autoexplore':
			path = player.level.autoexplore(player);
			if (!path) {
				log('level completely explored.');
			} else {
				addMoves(path);
				queue.push(['autoexplore']);
			}
			break;
		case 'sound':
			c = document.getElementById('sound');
			c.checked = !c.checked;
			break;
		case 'quit':
			location.reload();
		}
	}

	log.async(true);
	//otherwise you might get the message "monster hits you" before "you see monster"

	player.steps++;
	player.dungeon.spawnMonster(player);
	for (i = 0; i < player.level.npc.length; i++) {
		monster = player.level.npc[i];
		if (!monster.speed) {
			monster.monsterAI(player);
		} else {
			monster.movesLeft = (monster.movesLeft || 0) + 1;
			while (monster.movesLeft >= monster.speed) {
				monster.monsterAI(player);
				monster.movesLeft -= monster.speed;
			}
		}
	}
	player.handleTimeouts();
	player.usesHorseshoe = false;

	log.async(false);
	monsterSeen = player.level.draw(canvas, player);
	canvas.runAnimations();
	log.clearQueue();

	if (monsterSeen) {
		queue = [];
	}
	if (player.luckyCharms === 7) {
		log('you found all lucky charms and win the game.', 'b');
		gameOver = true;
	}
	if (!gameOver && player.health === 0) {
		log('you are out of luck and lose the game.', 'b');
		gameOver = true;
	}
	if (gameOver) {
		queue = [];
		log(player.getResult());
	}
	if (queue.length > 0) {
		queueTimeout = setTimeout(workQueue, DELAY);
	}
}

return {
	init: init
};
})();/*global events, Dungeon, Player*/
(function () {
"use strict";

var start = document.getElementById('start'),
	game = document.getElementById('game');

function startGame (mode) {
	var dungeon = new Dungeon(mode),
		player = new Player(dungeon);

	start.hidden = true;
	game.hidden = false;
	events.init(player);
}

document.getElementById('game-0').addEventListener('click', function () {
	startGame(0);
});
document.getElementById('game-1').addEventListener('click', function () {
	startGame(1);
});
})();})()
