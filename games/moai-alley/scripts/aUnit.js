class Unit extends Tile {

	constructor(x, y, type) {
		super(x, y, type);

		this.baseX = this.offsetX = 0;
		this.baseY = this.offsetY = 0;
		this.W = 16;
		this.H = 16;
		this.S = 16;

		switch (type) {
			case 1: // palm (level data == 1)
				this.S = 14;
				this.baseX = this.offsetX = -0.075;
				this.baseY = this.offsetY = -0.55;
				break;
			case 2: // tree (level data == 2)
				this.baseX = this.offsetX = -0.1;
				this.baseY = this.offsetY = -0.5;
				break;
			case 3: // rock (level data == 3)
				this.baseX = this.offsetX = -0.075;
				this.baseY = this.offsetY = -0.4;
				this.S = 14;
				break;
			case 5: // moai
				this.convertToMoai();
				// alter moai on title screen - make some of them face left or right (OPTIMIZE ~100b)
				if (!state && (x > 10 || y > 6)) this.frame = 3;
				if (!state && (x < 3 && y > 6)) this.frame = 9;
				break;
			case 6: // player
				this.H = 18;
				this.W = 16;
				this.baseX = this.offsetX = 0;
				this.baseY = this.offsetY = -0.4;
				this.animated = true;
				this.animate();
				break;
			default: // lake (4)
				break;
		}
	}

	// Changes a Rock (Mountain) into Moai statue
	convertToMoai() {
		board.unitsData[this.y][this.x] = 5;
		this.highlighted = false;
		this.type = 5;
		this.H = 20;
		this.W = 14;
		this.S = 14;
		this.baseX = this.offsetX = 0;
		this.baseY = this.offsetY = this.y < 2 || !state ? -1.3 : -0.6;
	}

	// Called when a Moai is being moved - depends on prevMove
	move(speed = 8, alter = -1) {
		if (prevMove == 1) {
			this.moveTo(0, -1, speed, alter);
		} else if (prevMove == 2) {
			this.moveTo(1, 0, speed, alter);
		} else if (prevMove == 3) {
			this.moveTo(0, 1, speed, alter);
		} else if (prevMove == 4) {
			this.moveTo(-1, 0, speed, alter);
		}
	}

	// Moves the unit in an adjacent tile
	moveTo(x, y, speed = 8, alter = -1) {
		if (state > 0) {
			if (hilight && this != player) {
				SoundFX.p(1, 99, -9, 9, 135);// remove hilight sound
			} else {
				SoundFX.p(1, 60, -2, 5);// move step sound
				SoundFX.p(1, 50, -1, 5, 80);
			}
		}

		if (alter > -1) {
			board.unitsData[this.y][this.x] = 0;
			board.unitsData[this.y + y][this.x + x] = alter;
		}

		this.x += x;
		this.y += y;
		if (x) this.offsetX = this.baseX - x;
		if (y) this.offsetY = this.baseY - y;
		TweenFX.to(this, speed, {offsetY: this.type == 5 && this.y < 2 ? -1.2 : this.baseY, offsetX: this.baseX}, this == player ? 2 : 1);
	}

	// Infinite looping function for character idle animation
	animate() {
		if (this.animated) {
			clearTimeout(this.timeout);
			const blink = Math.random() < .2;
			this.timeout = setTimeout(e => {
				if (Math.random() < .6) this.frame = step % 9 == 0 ? 1 : -1;
				this.frame ++;
				if (this.frame > 2) this.frame = 0;
				this.animate();
			}, blink ? 200 : 600 + Math.random() * 600);
		}
	}

	resize() {
		super.resize();
		this.width = this.elementSize * this.scale;
		this.height = this.elementSize * this.scale;
		this.draw();
	}

	draw() {
		let x = this.getOffsetX() + (this.offsetX + this.x) * this.elementSize * this.scale;
		let y = this.getOffsetY() + (this.offsetY + (this.y -1) + this.tilt) * this.elementSize * this.scale * this.tilt;
		let w = this.width / this.S * this.W;
		let h = this.height / this.S * this.H;
		let o = w/20;
		this.context.drawImage(
			this.type == 7
				? PixelArt.spritesObjects[3]
				: this.type < 4
					? PixelArt.spritesObjects[this.type - 1]
					: this.type == 5
						? PixelArt.spritesMoai[this.frame + (this.highlighted ? 1 : this.attached ? 2-((step/80|0)%4==0&&(step/9|0)%3==0?1:0) : 0)]
						: this.type == 4
							? PixelArt.spritesObjects[3]
							: PixelArt.spritesCharacter[this.frame],
			x, y, w, h
		);

		if (this.highlighted && this.type == 3) {
			this.context.beginPath(); 
			this.context.strokeStyle = '#fff';
			this.context.lineWidth = (width > height ? width : height) / 99;
			this.context.moveTo(x-o,y+h-o-o);
			this.context.lineTo(x+o,y+h);
			this.context.lineTo(x+w-o-o,y+h);
			this.context.lineTo(x+w,y+h-o-o);
			this.context.lineTo(x+w-o,y+h*0.3);
			this.context.lineTo(x+w*.8,y);
			this.context.lineTo(x+w*.6,y-o);
			this.context.lineTo(x+w*.4,y+o);
			this.context.lineTo(x+w*.2,y+h*.3);
			this.context.lineTo(x,y+h*.7);
			this.context.lineTo(x-o,y+h-o);
			this.context.moveTo(x+w/2,y+h/5);
			this.context.lineTo(x+w/3,y+h/3);
			this.context.closePath();
			this.context.stroke();
		} 
	}
}
