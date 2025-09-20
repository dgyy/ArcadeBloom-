import {
		init, getWorldRect, load, imageAssets,
		SpriteSheet,
	} from './kontra.10_0_0.dev_module.mjs';
let cscale = 4;
let { canvas, context } = init();

var height_offset;
let resize_func = function() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.imageSmoothingEnabled = false
	context.scale(cscale, cscale);
	height_offset = Math.max(0, canvas.height - 480) / 2 / cscale;
	if (map) {map.y = height_offset;}
};
resize_func();
window.addEventListener('resize', resize_func);


var pressed_keys = {};
const keydown_event = function(evt) {
	pressed_keys[evt.code] = true;
}
const keyup_event = function(evt) {
	pressed_keys[evt.code] = false;
}
window.addEventListener('keydown', keydown_event);
window.addEventListener('keyup', keyup_event);

function keyPressed(key) {
	return pressed_keys[key];
}

class MyTileEngine {
	/**
	 * Hacked up and heavily modified version of Kontra's TileEngine class.
	 * 
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2015 Steven Lambert
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
  constructor(properties = {}) {
  	Object.assign(this, {
  		width: 0,
  		height: 0,
  		tilewidth: 0,
  		tileheight: 0,
  		tilesets: null,
  		layerMap: {},
      layerCanvases: {},
      _sx: 0,
      _sy: 0,
  	});
  	Object.assign(this, properties);
    
    this.mapwidth = this.width * this.tilewidth;
    this.mapheight = this.height * this.tileheight;

    // create an off-screen canvas for pre-rendering the map
    // @see http://jsperf.com/render-vs-prerender
   	this._canvas = document.createElement('canvas');
    this._canvas.width = this.mapwidth;
    this._canvas.height = this.mapheight;
    this._ctx = this._canvas.getContext('2d');

    // @ifdef TILEENGINE_TILED
    // resolve linked files (source, image)
    this.tilesets.map(tileset => {
      // get the url of the Tiled JSON object (in this case, the
      // properties object)
      let { __k, location } = window;
      let url = (__k ? __k.dm.get(properties) : '') || location.href;

      let { source } = tileset;
      if (source) {
        // @ifdef DEBUG
        if (!__k) {
          throw Error(
            `You must use "load" or "loadData" to resolve tileset.source`
          );
        }
        // @endif

        let resolvedSorce = __k.d[__k.u(source, url)];

        // @ifdef DEBUG
        if (!resolvedSorce) {
          throw Error(
            `You must load the tileset source "${source}" before loading the tileset`
          );
        }
        // @endif

        Object.keys(resolvedSorce).map(key => {
          tileset[key] = resolvedSorce[key];
        });
      }

      let { image } = tileset;
      /* eslint-disable-next-line no-restricted-syntax */
      if ('' + image === image) {
        // @ifdef DEBUG
        if (!__k) {
          throw Error(
            `You must use "load" or "loadImage" to resolve tileset.image`
          );
        }
        // @endif

        let resolvedImage = __k.i[__k.u(image, url)];

        // @ifdef DEBUG
        if (!resolvedImage) {
          throw Error(
            `You must load the image "${image}" before loading the tileset`
          );
        }
        // @endif

        tileset.image = resolvedImage;
      }
    });
    // @endif

    // p = prerender
    if (context) {
      this._p();
    }

    // on('init', () => {
    //   this._p();
    // });
  }

  get sx() {
  	return this._sx;
  }
  get sy() {
    return this._sy;
  }

  // when clipping an image, sx and sy must be within the image
  // region, otherwise. Firefox and Safari won't draw it.
  // @see http://stackoverflow.com/questions/19338032/canvas-indexsizeerror-index-or-size-is-negative-or-greater-than-the-allowed-a
  set sx(value) {
    let max = Math.max(0, this.mapwidth * context.getTransform().m11 - canvas.width);
    this._sx = clamp(0, max, value);
  }

  set sy(value) {
    let max = Math.max(0, this.mapheight * context().getTransform().m22 - canvas().height);
    this._sy = clamp(0, max, value);
  }

  add(c) {
  	let arr = this.objects || [];
  	c.parent = this;
		arr.push(c);
		this.objects = arr;
  }

  remove(c) {
		let arr = this.objects || [];
		let idx = arr.indexOf(c);
		if (idx >= 0) {
			arr.splice(idx, 1);
		}
		c.parent = null;
  }

  render(_canvas = this._canvas, _renderObjects = true) {
    let { _d, sx = 0, sy = 0 } = this;

    if (_d) {
      this._p();
    }

    let { width, height } = canvas;
    let sWidth = Math.min(_canvas.width, width);
    let sHeight = Math.min(_canvas.height, height);

    context.drawImage(
      _canvas,
      sx,
      sy,
      sWidth,
      sHeight,
      0,
      0,
      sWidth,
      sHeight
    );

    // @ifdef TILEENGINE_CAMERA
    // draw objects
    if (_renderObjects) {
      context.save();

      // it's faster to only translate if one of the values is
      // non-zero rather than always translating
      // @see https://jsperf.com/translate-or-if-statement/2
      if (sx || sy) {
        context.translate(-sx, -sy);
      }

      this.objects.map(obj => obj.render && obj.render());

      context.restore();
    }
    // @endif
  }

  _p() {
    let { _ctx, layers = [], layerMap } = this;

    // d = dirty
    this._d = false;

    layers.map(layer => {
      let { name, data, visible } = layer;
      layer._d = false;
      layerMap[name] = layer;

      if (data && visible != false) {
        this._rl(layer, _ctx);
      }
    });
  }

  _rl(layer, ctx) {
    let { opacity, data = [] } = layer;
    let { tilesets, width, tilewidth, tileheight } = this;

    ctx.save();
    ctx.globalAlpha = opacity;

    data.map((tile, index) => {
    	// Tiled uses the bits 32 and 31 to denote that a tile is
		  // flipped horizontally or vertically (respectively)
		  // @see https://doc.mapeditor.org/en/stable/reference/global-tile-ids/
		  let FLIPPED_HORIZONTALLY = 0x80000000;
		  let FLIPPED_VERTICALLY = 0x40000000;
		  // tile can be rotated also and use the bit 30 in conjunction
		  // with bit 32 or/and 31 to denote that
		  let FLIPPED_DIAGONALLY = 0x20000000;

      // skip empty tiles (0)
      if (!tile) return;

      let flipped = 0;
      let rotated = 0;

      // @ifdef TILEENGINE_TILED
      // read flags
      let flippedHorizontal = tile & FLIPPED_HORIZONTALLY;
      let flippedVertical = tile & FLIPPED_VERTICALLY;
      let turnedClockwise = 0;
      let turnedAntiClockwise = 0;
      let flippedAndturnedClockwise = 0;
      let flippedAndturnedAntiClockwise = 0;
      let flippedDiagonally = 0;
      flipped = flippedHorizontal || flippedVertical;

      tile &= ~(FLIPPED_HORIZONTALLY | FLIPPED_VERTICALLY);

      flippedDiagonally = tile & FLIPPED_DIAGONALLY;
      // Identify tile rotation
      if (flippedDiagonally) {
        if (flippedHorizontal && flippedVertical) {
          flippedAndturnedClockwise = 1;
        } else if (flippedHorizontal) {
          turnedClockwise = 1;
        } else if (flippedVertical) {
          turnedAntiClockwise = 1;
        } else {
          flippedAndturnedAntiClockwise = 1;
        }
        rotated =
          turnedClockwise ||
          turnedAntiClockwise ||
          flippedAndturnedClockwise ||
          flippedAndturnedAntiClockwise;

        tile &= ~FLIPPED_DIAGONALLY;
      }
      // @endif

      // find the tileset the tile belongs to
      // assume tilesets are ordered by firstgid
      let tileset;
      for (let i = tilesets.length - 1; i >= 0; i--) {
        tileset = tilesets[i];

        if (tile / tileset.firstgid >= 1) {
          break;
        }
      }

      let {
        image,
        spacing = 0,
        margin = 0,
        firstgid,
        columns
      } = tileset;

      let offset = tile - firstgid;
      let cols = columns ?? (image.width / (tilewidth + spacing)) | 0;

      let x = (index % width) * tilewidth;
      let y = ((index / width) | 0) * tileheight;
      let sx = margin + (offset % cols) * (tilewidth + spacing);
      let sy =
        margin + ((offset / cols) | 0) * (tileheight + spacing);

      // @ifdef TILEENGINE_TILED
      if (rotated) {
        ctx.save();
        // Translate to the center of the tile
        ctx.translate(x + tilewidth / 2, y + tileheight / 2);
        if (turnedAntiClockwise || flippedAndturnedAntiClockwise) {
          // Rotate 90° anticlockwise
          ctx.rotate(-Math.PI / 2); // 90° in radians
        } else if (turnedClockwise || flippedAndturnedClockwise) {
          // Rotate 90° clockwise
          ctx.rotate(Math.PI / 2); // 90° in radians
        }
        if (
          flippedAndturnedClockwise ||
          flippedAndturnedAntiClockwise
        ) {
          // Then flip horizontally
          ctx.scale(-1, 1);
        }
        x = -tilewidth / 2;
        y = -tileheight / 2;
      } else if (flipped) {
        ctx.save();
        ctx.translate(
          x + (flippedHorizontal ? tilewidth : 0),
          y + (flippedVertical ? tileheight : 0)
        );
        ctx.scale(
          flippedHorizontal ? -1 : 1,
          flippedVertical ? -1 : 1
        );
        x = flipped ? 0 : x;
        y = flipped ? 0 : y;
      }
      // @endif

      ctx.drawImage(
        image,
        sx,
        sy,
        tilewidth,
        tileheight,
        x,
        y,
        tilewidth,
        tileheight
      );

      // @ifdef TILEENGINE_TILED
      if (flipped || rotated) {
        ctx.restore();
      }
      // @endif
    });

    ctx.restore();
  }
}

class MySprite {
	/**
	 * Hacked up and heavily modified version of Kontra's Sprite class.
	 * 
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2015 Steven Lambert
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
  constructor(properties) {
    this.init(properties);
    this.initialize();
  }

  init(properties) {
  	Object.assign(this,{
  		x:0,y:0,dx:0,dy:0,ddx:0,ddy:0,anchor:{x:0,y:0},ttl:Infinity,scaleX:1,scaleY:1,parent:null,visible:true,
  		world:{x:0,y:0,width:0,height:0,scaleX: properties.scaleX || 1,scaleY: properties.scaleY || 1}
  	});
    Object.assign(this, properties);

    if ('animations' in properties) {
    	this.animations = clone_animations(properties.animations);
    	this.currentAnimation = this.animations[Object.keys(this.animations)[0]];
    	this.width = this.currentAnimation.width;
    	this.height = this.currentAnimation.height;
    }
  }

  initialize() {}

  isAlive() {
    return this.ttl > 0;
  }

  addChild(c) {
  	let arr = this.objects || [];
  	c.parent = this;
		arr.push(c);
		this.objects = arr;
  }

  removeChild(c) {
		let arr = this.objects || [];
		let idx = arr.indexOf(c);
		if (idx >= 0) {
			arr.splice(idx, 1);
		}
		c.parent = null;
  }

  update(dt=FRAME_DT) {
  	this.advance(dt);
  }

  advance(dt=FRAME_DT) {
	  this.dx += this.ddx * dt;
	  this.dy += this.ddy * dt;

	  this.x += this.dx * dt;
	  this.y += this.dy * dt;
	  // if (Math.abs(this.dx) > 0 || Math.abs(this.dy) > 0) {
	  // 	this.world.dirty = true; // DEBT: assumes only the x/y pos changes
	  // }

	  this.ttl--;
		this.currentAnimation?.update(dt);

		let parent = this.parent?.world || {x:0,y:0,width:0,height:0,scaleX:1,scaleY:1/*,dirty:true*/};
		// if (parent.dirty) {
			this.world.scaleX = this.scaleX * parent.scaleX;
			this.world.scaleY = this.scaleY * parent.scaleY;
			this.world.x = this.x + parent.x;
			this.world.y = this.y + parent.y;
			this.world.width = this.width * parent.scaleX;
			this.world.height = this.height * parent.scaleY;
			this.world.dirty = true;
		// } else {
		// 	this.world.dirty = false;
		// }

		(this.objects || []).forEach(o => o.update && o.update(dt));
	}

	playAnimation(name) {
	  this.currentAnimation?.stop();
	  this.currentAnimation = this.animations[name];
	  this.currentAnimation.start();
	}

	render() {
		if (!this.visible) { return; }
		context.save();
		if (this.x || this.y) { context.translate(this.x, this.y); }

		context.save();
		if ('currentAnimation' in this) {
			let row = (this.currentAnimation.frames[this.currentAnimation._f] / this.currentAnimation.spriteSheet._f) | 0;
			let col = this.currentAnimation.frames[this.currentAnimation._f] % this.currentAnimation.spriteSheet._f | 0;
			let fdir = ('facing_dir' in this) ? this.facing_dir : -1;
			if (fdir > 0) {
				context.scale(-this.scaleX, this.scaleY);
			} else {
				context.scale(this.scaleX, this.scaleY);
			}
			if (this.flicker) {
				context.filter = 'invert(1)';
			}
			context.translate(fdir * this.currentAnimation.width * this.anchor.x, -this.currentAnimation.height * this.anchor.y);
			context.drawImage(
				this.currentAnimation.spriteSheet.image,
				this.currentAnimation.margin + col * this.currentAnimation.width + (col * 2 + 1) * this.currentAnimation.spacing,
				this.currentAnimation.margin + row * this.currentAnimation.height + (row * 2 + 1) * this.currentAnimation.spacing,
				this.currentAnimation.width,
				this.currentAnimation.height,
				0,
				0,
				this.currentAnimation.width * fdir * -1,
				this.currentAnimation.height
			);
		} else if ('image' in this) {
			context.scale(this.scaleX, this.scaleY);
			context.translate(-this.image.width * this.anchor.x, -this.image.height * this.anchor.y);
			context.drawImage(this.image, 0, 0, this.image.width, this.image.height);
		} else if ('color' in this) {
			context.translate(-this.width * this.anchor.x, -this.height * this.anchor.y);
			context.fillStyle = this.color;
			context.fillRect(0, 0, this.width, this.height);
		}

		context.restore();
		(this.objects || []).forEach(o => o.render && o.render());
		
		context.restore();
	}
}

class Pickup extends MySprite {
	constructor(properties) {
    super(properties);
  }

  pickup() {return false;}

  update() {
		if (collides(this, player) && this.pickup()) {
			return;
		}

		if(this.ttl != 0 && this.ttl <= 240/*60*4*/ && [].concat(range_array(25,25), range_array(25,75)).indexOf(Math.floor((this.ttl) % 100)) >= 0) {
			this.flicker = true;
		} else {
			this.flicker = false;
		}
		if (this.ttl <= 0) {
			map.remove(this);
			return;
		}

		let touching = fixMovement3(this, 'ground');
		this.advance();
		touching = fixMovement3(this, 'ground');
		if (touching.down) {
			this.ddy = 0.0;
			this.dy = 0.0;
		} else {
			this.ddy = GRAVITY;//Math.max(GRAVITY, this.dy + .1);//GRAVITY * .01;
		}
	}
}

class MyGameLoop {
	/**
	 * Hacked up and heavily modified version of Kontra's GameLoop object.
	 * 
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2015 Steven Lambert
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	constructor(properties) {
    this.fps = 60;
    Object.assign(this, properties);
    this.isStopped = true;

    // animation variables
    this.accumulator = 0;
    this.delta = 1e3 / this.fps; // delta between performance.now timings (in ms)
    this.step = 1 / this.fps;
    this.last = null;
    this.rAF = null;
    // this.now = null;
    this.dt = null;
    this.focused = true;

    window.addEventListener('focus', () => {
      this.focused = true;
    });
    window.addEventListener('blur', () => {
      this.focused = false;
    });
  }

  // clearFn() {
  // 	context.clearRect(0, 0, canvas.width, canvas.height);
	// }

  frame() {
  	if (this.isStopped) {return;}
    this.rAF = requestAnimationFrame(this.frame.bind(this));

    // don't update the frame if tab isn't focused
    if (!this.focused) return;

    let now = performance.now();
    this.dt = now - this.last;
    this.last = now;

    // prevent updating the game with a very large dt if the game
    // were to lose focus and then regain focus later
    if (this.dt > 1e3) {
      return;
    }

    this.accumulator += this.dt;

    while (this.accumulator >= this.delta) {
      // emit('tick');
      this.update(this.step);
      if (this.isStopped) { break;} // Prevent additional updates if the loop was stopped inside the update.

      this.accumulator -= this.delta;
    }

    // this.clearFn();
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.render();
  }

  start() {
  	if (this.isStopped) {
	    this.last = performance.now();
	    this.isStopped = false;
	    this.rAF = requestAnimationFrame(this.frame.bind(this));
  	}
  }

  stop() {
    this.isStopped = true;
    cancelAnimationFrame(this.rAF);
  }

  update() {}

  fill_canvas(color, operation='destination-under', details=null) {
		context.save();
		context.globalCompositeOperation = operation;
		context.fillStyle = color;
		if (details) {
			context.fillRect(details.x, details.y, details.width, details.height);
		} else {
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
		context.restore();
	}

  renderInside() {}
  render() {
  	this.fill_canvas("#315282", 'source-over');//#2c4875
		this.renderInside();
		this.fill_canvas('#000000', 'source-over', {x:0, y:0, 						width:canvas.width, height:height_offset});
		this.fill_canvas('#000000', 'source-over', {x:0, y:height_offset+480/cscale, width:canvas.width, height:height_offset});
  }
}

class Enemy extends MySprite {
	constructor(properties) {
		super(Object.assign({
			ai_state: 'move', // should be a function name on this object but doesn't have to be.
			curHealth: 3,
			attack_dmg: 1.0,
			has_touch_dmg: true,
			speed: 30 + getRandInt(-5, 10),
			jumpspeed: 40,
			jumping: false,
			jumping_time: 0.0,
			jumping_max_held: .2,
			ground_friction: 4,
			air_friction: 18,
			facing_dir: [-1, 1][getRandInt(0,1)],
			ai_dt: 2.0,
			immunity_cd: 1.0,
			immunity_dt: 0.0,
			stagger_dt: 0.0,
			defense: 0,
			state_transitions: {
				'idle': [{method: 'aiDeltaUpdate', args:[3]},{method:'stateChangeRandCheck',args:[0,1,1,'move']}],
				'move': [{method: 'aiDeltaUpdate', args:[2]},{method:'stateChangeRandCheck',args:[0,1,1,'idle']}]
			},
		}, properties));
	}
	playerInRange(range) {
		let x = player.x - this.x;
		let y = player.y - this.y;
		//let dist = x*x+y*y;
		//let dist = Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2);
		//let dist = Math.sqrt(Math.pow(player.x - this.x, 2) + Math.pow(player.y - this.y, 2));
		return x*x+y*y <= range * range; // returns true when in range.
	}

	stateChangeRandCheck(min,max,threshold,newState,threshold2,newState2) {
		let r = getRandInt(min, max);
		if (r >= threshold) {
			this.changeState(newState);
			return true;
		} else if (newState2 && r >= threshold2) {
			this.changeState(newState2);
			return true;
		}
		return false;
	}

	aiDeltaUpdate(check_amount) {
		if (this.ai_dt <= 0) {
			this.ai_dt += check_amount; // Set the check amount
		}
		this.ai_dt = Math.max(0, this.ai_dt - FRAME_DT);
		if (this.ai_dt <= 0) {
			return true; // reached the end; allow other check to progress
		}
		return false; // prevent other checks from progressing
	}

	handle_jump() {
		if (this.jumping && this.jumping_time < this.jumping_max_held) {
			this.jumping_time += FRAME_DT;
		}
		if (this.jumping_time >= this.jumping_max_held) {
			this.jumping = false;
			this.jumping_time = 0.0;
		}
	}

	jump() {
		this.dy -= this.jumpspeed;
		this.jumping = true;
		this.jumping_time = 0.0;
	}
	
	move() {
		this.playAnimation('walk');
		this.dx = clamp(this.dx + this.facing_dir * this.speed, -this.speed, this.speed);

		var touching = fixMovement3(this, 'ground');
		this.advance(FRAME_DT);
		touching = fixMovement3(this, 'ground');
		if (touching.down) {
			this.dy = 0;
			this.ddy = 0;
			this.jumping = false;
		} else if (this.jumping) {
			this.ddy = 0.0;
		} else {
			this.ddy = GRAVITY;
		}

		if (this.facing_dir == -1 && touching.left && touching.down && !touching.top && !this.jumping) {
			let layer = map.layerMap['ground'];
			let open_tile = (layer.data[touching.left_tpos.c + (touching.left_tpos.r - 1) * map.width] == 0 ||
											layer.data[touching.left_tpos.c + (touching.left_tpos.r - 2) * map.width] == 0) &&
											layer.data[touching.up_tpos.c + (touching.up_tpos.r) * map.width] == 0 &&
											layer.data[touching.up_tpos.c + (touching.up_tpos.r - 1) * map.width] == 0;
			if (open_tile) {
				this.jump();
			}
		} else if (this.facing_dir == 1 && touching.right && touching.down && !touching.top && !this.jumping) {
			let layer = map.layerMap['ground'];
			let open_tile = (layer.data[touching.right_tpos.c + (touching.right_tpos.r - 1) * map.width] == 0 ||
											layer.data[touching.right_tpos.c + (touching.right_tpos.r - 2) * map.width] == 0) &&
											layer.data[touching.up_tpos.c + (touching.up_tpos.r) * map.width] == 0 &&
											layer.data[touching.up_tpos.c + (touching.up_tpos.r - 1) * map.width] == 0;
			if (open_tile) {
				this.jump();
			}
		}

		if (this.facing_dir == -1 && touching.left && touching.down && !this.jumping) {
			this.facing_dir = 1;
			this.dx = 0;
		} else if (this.facing_dir == 1 && touching.right && touching.down && !this.jumping) {
			this.facing_dir = -1;
			this.dx = 0;
		}
	}
	changeState(s) {
		this.ai_state = s;
		//= this.ai_states[s];
	}
	idle() {
		this.playAnimation('idle');
		this.clearXMovement();
		this.applyGravity();
	}
	applyGravity() {
		var touching = fixMovement3(this, 'ground');
		this.advance(FRAME_DT);
		touching = fixMovement3(this, 'ground');
		if (touching.down) {
			this.ddy = 0.0;
			this.jumping = false;
		} else if (this.jumping) {
			this.ddy = 0.0;
		} else {
			this.ddy = GRAVITY;
		}
		return true;
	}
	clearXMovement() {
		this.dx = 0;
		this.ddx = 0;
		return true;
	}
	facePlayer() {
		this.facing_dir = Math.sign(player.x - this.x);
		return true;
	}

	onDeath() {

	}

	takeDamage(dmgObj) {
		if (this.immunity_dt > 0) {
			return; // immune to damage.
		}
		dmgObj.damage = Math.max(0, dmgObj.damage - this.defense);
		this.curHealth = Math.max(0, this.curHealth - dmgObj.damage);
		this.immunity_dt = this.immunity_cd;
		this.stagger_dt += dmgObj.staggerAmt;
		play_music([[0,6],[0,8],[0,7],[0,18],[0,19],[0,17]],400,.19,.18,.005,.2,.1,'');
		if (this.curHealth <= 0) {
			// dead
			let eidx = enemy_list.indexOf(this);
			enemy_list.splice(eidx, 1);
			map.remove(this);
			spawn_explosion(this.x, this.y);

			let drop = ['health', 'big_health'][getRandInt(0, 1)];
			if (drop != null) {
				let p = pickups[drop]();
				p.x = this.x;
				p.y = this.y - 1;

				map.add(p);
			}
			this.onDeath();
			player.curRage = Math.min(player.maxRage, player.curRage + 1);
		}
	}

	update() {
		this.immunity_dt = Math.max(0, this.immunity_dt - FRAME_DT);
		this.stagger_dt = Math.max(0, this.stagger_dt - FRAME_DT);
		if(this.immunity_dt != 0 && [].concat(range_array(25,25), range_array(25,75)).indexOf(Math.floor((this.immunity_dt * 100) % 100)) >= 0) {
			this.flicker = true;
		} else {
			this.flicker = false;
		}
		this.handle_jump();
		if (this.stagger_dt <= 0) {
			(this.ai_state in this) && this[this.ai_state]();
			(this.state_transitions[this.ai_state] || []).every(st => {
				return this[st.method](...(st.args || [])); // A false return stops the chain
			});
		} else {
			this.dx = 0;
			this.dy = 0;
			this.applyGravity();
			var touching = fixMovement3(this, 'ground');
			this.advance(FRAME_DT);
			touching = fixMovement3(this, 'ground');
		}
		if (this.has_touch_dmg && collides(this, player)) {
			player.takeDamage({damage: this.attack_dmg});
		}
	}
}

class FloatyHeart extends MySprite {
	constructor(properties) {
    super(Object.assign({
    	dy: -5,
			animations: health_spritesheet.animations,
    	anchor: {x: 0.5, y: 0.5},
    	rand_start: getRandInt(-3,3)
    }, properties));
  }

  update(dt=FRAME_DT) {
  	this.x = Math.sin(this.rand_start + this.ttl * .2) * 5;
  	this.advance(dt);
  	if (this.ttl <= 0) {
  		this.parent.removeChild(this);
  	}
  }
}

var player = null;
var girlfriend = null;
var boss = null;
var player_health = null;
var boss_health = null;
var map = null;
var loop = null;
// var gameticks = 0;
var enemy_spritesheets = null;
var explosion_spritesheet = null;
var player_spritesheet = null;
var girlfriend_spritesheet = null;
var boss_spritesheet = null;
var health_spritesheet = null;
var help_spritesheet = null;
var thirteen = null;
var silhouette = null;
var silhouette_spr = null;
const TOP_LEFT = 0;
const BOTTOM_RIGHT = 1;

const FRAME_DT = 1.0/60.0;
const GRAVITY = 9.8 * 15;
const clamp = function(v, min, max) {
	return Math.min(Math.max(v, min), max);
}
const getRandInt = function(min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}
const getRow = function(y) {
  return (y / map.tileheight) | 0;
}

const getCol = function(x) {
  return (x / map.tilewidth) | 0;
}

const range_array = function(numElements, startVal = 0) {
	return [...Array(25).keys()].map(k => k + startVal);
}

const clone_animations = function(anim_obj) {
	let anims = {};
	for (let key in anim_obj) {
		anims[key] = anim_obj[key].clone();
	}
	return anims;
}

const create_health_pickup = function() {
	let s = new Pickup({
		x: 0,
		y: 0,
		width: 8,
		height: 8,
		scaleX: .35,
		scaleY: .35,
		anchor: {x: 0.5, y: 0.5},
		animations: health_spritesheet.animations,
		facing_dir: -1,
		ttl: 60 * 15,
		pickup: function() {
			if (player.curHealth >= player.maxHealth) {return false;}
			player.curHealth += 1;
			map.remove(this);
			play_music([[0,6],[0,10],[1,8],[1,4],[2,1]],400,.19,.18,.005,.1,.1,'triangle');
			return true;
		}
	});
	s.dy = -.1;
	s.playAnimation('filled');
	return s;
};

const create_big_health_pickup = function() {
	let hp = create_health_pickup();
	hp.scaleX = .5;
	hp.scaleY = .5;
	hp.pickup = function() {
		if (player.curHealth >= player.maxHealth) {return;}
		player.curHealth = Math.min(player.curHealth + 3, player.maxHealth);
		map.remove(this);
		play_music([[0,6],[0,10],[1,8],[1,4],[2,1]],400,.19,.18,.005,.1,.1,'triangle');
	}
	return hp;
}

var pickups = {
	health: create_health_pickup,
	big_health: create_big_health_pickup,
};


const play_music = function(notes,center,duration,decaystart,decayduration,interval,volume,waveform,i) {
	/**
	 * Code pulled from https://xem.github.io/miniOrchestra/ and altered to work with strict mode.
	 */
	let audio_ctx = new AudioContext;
	let gain_ctx = audio_ctx.createGain();
  for(i of notes) {
    let oscil = audio_ctx.createOscillator();
    
    oscil.connect(gain_ctx);
    gain_ctx.connect(audio_ctx.destination);
    oscil.start(i[0]*interval);
    oscil.frequency.setValueAtTime(center*1.06**(13-i[1]),i[0]*interval);
    oscil.type=waveform;
    gain_ctx.gain.setValueAtTime(volume,i[0]*interval);
    gain_ctx.gain.setTargetAtTime(1e-5,i[0]*interval+decaystart,decayduration);
    oscil.stop(i[0]*interval+duration);
  }
  return audio_ctx;
};


const parseFont = function(font) {
	/**
	 * Pulled from Kontra's internals.
	 * 
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2015 Steven Lambert
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
  if (!font) return { computed: 0 };

  let match = font.match(/(\d+)(\w+)/);

  // coerce string to number
  // @see https://github.com/jed/140bytes/wiki/Byte-saving-techniques#coercion-to-test-for-types
  let size = +match[1];
  let unit = match[2];
  let computed = size;

  return {
    size,
    unit,
    computed
  };
};


const render_text = function() {
	/**
	 * Pulled from Kontra's internals and hacked up.
	 * 
	 * The MIT License (MIT)
	 * 
	 * Copyright (c) 2015 Steven Lambert
	 * 
	 * Permission is hereby granted, free of charge, to any person obtaining a copy
	 * of this software and associated documentation files (the "Software"), to deal
	 * in the Software without restriction, including without limitation the rights
	 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	 * copies of the Software, and to permit persons to whom the Software is
	 * furnished to do so, subject to the following conditions:
	 * 
	 * The above copyright notice and this permission notice shall be included in
	 * all copies or substantial portions of the Software.
	 * 
	 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	 * THE SOFTWARE.
	 */
	// var textParts = this.text.split('\n');
	var fontSize = parseFont(this.font).computed;
	this.text.split('\n').forEach((txt, idx) => {
	  context.save();
		
	  context.textBaseline = 'top';
	  context.textAlign = 'left';
	  context.fillStyle = this.color;
	  context.font = this.font;

	  let dia = context.measureText(txt)
	  context.translate(this.x - dia.width * this.anchor.x, this.y + fontSize * idx/* - dia.height * this.anchor.y*/);

	  context.fillText(txt, 0, 0);
      context.restore();
	});
	
};

const spawn_explosion = function(in_x, in_y) {
	let exp = new MySprite({
		x: in_x,
		y: in_y,
		width: 16,
		height: 16,
		anchor: {x: .5, y: .5},
		animations: explosion_spritesheet.animations,
		ttl: 30,
		update: function() {
			this.advance();
			if (this.ttl <= 0) {
				map.remove(exp);
			}
		}
	});
	map.add(exp);
}

const create_player = function() {
	return new MySprite({
		curHealth: 5,
		maxHealth: 5,
		curRage: 0,
		maxRage: 13,
		speed: 50,
		jumpspeed: 40,
		ground_friction: 8,
		air_friction: 4,
		scaleX: 1,
		scaleY: 1,
		x: 100,
		y: 40,
		animations: player_spritesheet.animations,
		width: 4,
		height: 8,
		anchor: {x: 0.5, y: 0.5},
		jumping: false,
		jumping_time: 0.0,
		jumping_max_held: .2,
		facing_dir: -1,
		attack_cd_base: 0.7,
		attack_cd: 0.0,
		attack_dmg: 1.0,
		stagger_dt: 0.0,
		immunity_cd: 1.0,
		immunity_dt: 0.0,
		takeDamage: async function(dmgObj) {
			if (this.immunity_dt > 0) {
				return; // immune to damage.
			}
			this.curHealth = Math.max(0, this.curHealth - dmgObj.damage);
			this.immunity_dt = this.immunity_cd;
			play_music([[0,17],[0,18],[0,19]],400,.19,.18,.005,.2,.1,'sawtooth');

			if (this.curHealth <= 0) {
				spawn_explosion(this.x, this.y);
				map.remove(this);
				play_music([[0,18],[1,18],[1,16],[1,17],[2,20],[3,20],[3,19],[3,18],[4,24],[5,24],[5,23],
										[5,22],[6,24],[7,24],[7,23],[7,22]],400,.19,.18,.005,.1,.1,'triangle');
				await new Promise(r => setTimeout(r, 2000));
				loop.stop();
				restart_level();
			}
		},
		onGround: function() {
			//return this.ddy == 0.0 && !this.jumping;
			return this._lastGroundCheck;
		},
		getActions: function() {
			return {
				leftpressed: keyPressed('KeyA') || keyPressed('ArrowLeft'),
				rightpressed: keyPressed('KeyD') || keyPressed('ArrowRight'),
				downpressed: keyPressed('KeyS') || keyPressed('ArrowDown'),
				jumppressed: keyPressed('KeyW') || keyPressed('ArrowUp'),
				attackpressed: keyPressed('Space') || keyPressed('KeyS') || keyPressed('ArrowDown'),
				// shiftpressed: keyPressed('shiftleft')
			};
		},
		attack: function(actions) {
			this.attack_cd = this.attack_cd_base;
			this.stagger_dt = this.attack_cd_base / 2.0;
			if (this.onGround()) {
				this.dx = 0.0; // halt forward movement
			}
			let length = !actions.downpressed ? 5 : 1;
			let height = !actions.downpressed ? 1 : 5;
			let xpos = !actions.downpressed ? this.facing_dir * this.width * this.anchor.x + length/2 * this.facing_dir : 0;
			let ypos = !actions.downpressed ? 0 : this.height * this.anchor.y + height/2 + 1;
			let attk_sprite = new MySprite({
				attack_dmg: this.attack_dmg + this.curRage / 6,
				x: xpos,
				y: ypos,//this.y,
				width: length,
				height: height,
				scaleX: 1,
				scaleY: 1,
				color: '#758694',
				anchor: {x: 0.5, y: 0.5},
				ttl: 30,
				isDownAttack: actions.downpressed,
				owner: this,
				update: function() {
					this.advance();
					if (this.ttl <= 0) {
						player.removeChild(this);
						return;
					}

					for (let eidx = 0; eidx < enemy_list.length; eidx++) {
						let e = enemy_list[eidx];
						if (collides(this, e)) {
							// deal damage
							e.takeDamage({ damage: this.attack_dmg, staggerAmt: .5 });
							if (this.isDownAttack) {
								this.owner.dy = -40;
							}
						}
					}
				}
			});
			player.addChild(attk_sprite);
		},
		update: function() {
			this.attack_cd = Math.max(0.0, this.attack_cd - FRAME_DT);
			this.stagger_dt = Math.max(0, this.stagger_dt - FRAME_DT);
			this.immunity_dt = Math.max(0, this.immunity_dt - FRAME_DT);
			if(this.immunity_dt != 0 && [].concat(range_array(25,25), range_array(25,75)).indexOf(Math.floor((this.immunity_dt * 100) % 100)) >= 0) {
				this.flicker = true;
			} else {
				this.flicker = false;
			}

			let actions = this.getActions();
			let target = {x: 0.0, y: 0.0};
			
			if (actions.leftpressed && (this.stagger_dt <= 0 || !this.onGround())) { // allow moving in air while staggered
				target.x -= this.speed * .15;//(actions.shiftpressed ? .5 : 1);
				this.facing_dir = -1;
			}
			if (actions.rightpressed && (this.stagger_dt <= 0 || !this.onGround())) {
				target.x += this.speed * .15;//(actions.shiftpressed ? .5 : 1);
				this.facing_dir = 1;
			}
			if (actions.jumppressed && this.onGround() && this.stagger_dt <= 0) {
				this.dy = -this.jumpspeed;
				this.jumping = true;
				this.jumping_time = 0.0;
			}
			else if (this.jumping && actions.jumppressed && this.jumping_time < this.jumping_max_held) {
				this.jumping_time += FRAME_DT;
			}
			if (this.jumping_time >= this.jumping_max_held) {
				this.jumping = false;
				this.jumping_time = 0.0;
			}
			if (this.jumping && !actions.jumppressed) {
				this.jumping = false;
			}

			if (actions.attackpressed && this.attack_cd <= 0) {
				this.attack(actions);
				// attack
			}

			this.dx = clamp(this.dx + target.x, -this.speed, this.speed);

			if (target.x == 0.0 && this.dx != 0.0) {
				let sign = Math.sign(this.dx);
				if (sign > 0) {
					this.dx = Math.max(0, this.dx + -1 * sign * this.ground_friction);	
				} else {
					this.dx = Math.min(0, this.dx + -1 * sign * this.ground_friction);
				}
				if (Math.abs(this.dx) <= 1) {
					this.dx = 0.0;
				}
			}
			// } else if (target.x != 0.0 && this.dx != 0.0 && !this.onGround()) {
			// 	// In the air
			// 	let sign = Math.sign(this.dx);
			// 	this.dx += -1 * sign * this.air_friction;
			// 	if (Math.abs(this.dx) <= 1) {
			// 		this.dx = 0.0;
			// 	}
			// }

			if (Math.abs(this.dx) > 1) {
				this.playAnimation('walk');
			} else {
				this.playAnimation('idle');
			}
			
			var touching = fixMovement3(this, 'ground');
			this.advance(FRAME_DT);
			touching = fixMovement3(this, 'ground');
			if (touching.down && (!this.jumping || (this.jumping && this.jumping_time >= this.jumping_max_held))) {
				this.ddy = 0.0;
				this.dy = 0.0;
				this.jumping = false;
				this._lastGroundCheck = true;
			} else if (touching.down) {
				this.ddy = 0.0;
				this._lastGroundCheck = true;
			} else if (this.jumping) {
				this.ddy = 0.0;
				this._lastGroundCheck = false;
			} else {
				this.ddy = GRAVITY;
				this._lastGroundCheck = false;
			}

			// (sprt_update_children.bind(this))();
			// if (this.ddy == GRAVITY) {
			// 	this.jumping = false;
			// }
		}
	});
}

const create_girlfriend = function(x,y) {
	let gf = new Enemy({
		x: x,
		y: y,
		animations: girlfriend_spritesheet.animations,
		anchor: {x: 0.5, y: 0.5},
		state_transitions: {
			'idle': [{method: 'aiDeltaUpdate', args:[.5]}, {method: 'toggleHelp'}],
			'wait': [{method: 'aiDeltaUpdate', args:[1]},{method: 'changeState', args: ['move']}],
			'move': [{method: 'aiDeltaUpdate', args:[.5]},{method: 'changeState', args: ['hug']}],
			'hug': [{method: 'applyGravity'},{method: 'clearXMovement'},{method:'playerInRange',args:[8]},{method: 'changeState', args:['hearts']}],
			'hearts': [{method: 'aiDeltaUpdate', args:[.5]}, {method: 'spawnHeart'}],
		},
		ai_state: 'idle',
 		has_touch_dmg: false,
		facing_dir: -1,
		heart_count: 0,
		initialize: function() {
			let help = new MySprite({
				x: -7,
				y: -6,
				animations: help_spritesheet.animations,
				anchor: {x:0.5, y:0.5},
			});
			this.addChild(help);
		},
		toggleHelp: function () {
			this.objects[0].visible = !this.objects[0].visible;
		},
		wait: function() {
			this.objects[0].visible = false;
		},
		win: function() {
			loop.stop();
			loop.actx.close();
			start_end_scene();
		},
		hearts: function() {
			this.idle();
		},
		spawnHeart: function() {
			if (this.heart_count >= 13) {
				this.win();
				return;
			}
			this.heart_count += 1;
			this.addChild(new FloatyHeart({
				x: 0,
				y: -4,
				scaleX: .35,
				scaleY: .35,
				ttl: 120,
			}));

			return true;
		}
	});
	return gf;
}

const create_boss = function(x,y) {
	let b = new Enemy({
		maxHealth: 13,
		curHealth: 13,
		speed: 30,
		defense: .5,
		x: x,
		y: y,
		animations: boss_spritesheet.animations,
		anchor: {x: 0.5, y: 0.5},
		state_transitions: {
			'idle': [{method: 'playerInRange', args:[10*map.tilewidth]},{method:'changeState',args:['show_health']}],
			'show_health':[{method: 'changeState', args:['move']}],
			'move': [{method: 'variableAiDeltaUpdate'},{method:'stateChangeRandCheck',args:[0,2,2,'jump_buildup',1,'charge_buildup']}],
			'jump': [{method: 'changeState', args:['move']}],
			'jump_buildup': [{method: 'aiDeltaUpdate', args:[.5]},{method: 'changeState', args:['jump']}],
			'charge_buildup':[{method: 'aiDeltaUpdate', args:[.5]},{method: 'changeState', args:['charge']}],
			'charge': [{method: 'aiDeltaUpdate', args:[.5]},{method:'changeState',args:['move']}],
		},
		ai_state: 'idle',
		has_touch_dmg: true,
		facing_dir: -1,
		variableAiDeltaUpdate: function() {
			if (this.curHealth >= 7) {
				return this.aiDeltaUpdate(2);
			}
			return this.aiDeltaUpdate(1);
		},
		show_health: function() {
			boss_health.visible = true;
			loop.actx.close();
			loop.song = 1;
		},
		onDeath: function() {
			boss_health.visible = false;
			girlfriend.changeState('wait');
			loop.actx.close();
			loop.song = 0;
		},
		jump_buildup: function() {
			this.immunity_dt = .5;
			this.idle();
		},
		charge_buildup: function() {
			this.immunity_dt = .5;
			this.playAnimation('charge');
			this.clearXMovement();
			this.applyGravity();
			this.facePlayer();
		},
		charge: function() {
			this.playAnimation('charge');
			this.dx = clamp(this.dx + this.facing_dir * this.speed*3.5, -this.speed*3.5, this.speed*3.5);

			var touching = fixMovement3(this, 'ground');
			this.advance(FRAME_DT);
			touching = fixMovement3(this, 'ground');
			if (touching.down) {
				this.dy = 0;
				this.ddy = 0.0;
				this.jumping = false;
			} else if (this.jumping) {
				this.ddy = 0.0;
			} else {
				this.ddy = GRAVITY;
			}
		}
	});
	return b;
}

const splat_tiles = function(arr, mwidth, mheight, splat, swidth, sheight, sx, sy) {
	for (let y = 0; y < sheight; y++) {
		let tile_y = sy + y;
		if (tile_y < 0 || tile_y >= mheight) { continue; }
		for (let x = 0; x < swidth; x++) {
			let tile_x = sx + x;
			if (tile_x < 0 || tile_x >= mwidth) { continue; }
			let tile = splat[x + y * swidth];
			if (tile != 0) {
				arr[tile_x + tile_y * mwidth] = (tile == -1 ? 0 : tile);
			}
		}
	}
}

const ray_down = function(ground, mwidth, mheight, xpos) {
	for (let y = 0; y < mheight; y++) {
		if (ground[xpos + y * mwidth] != 0) {
			return y;
		}
	}
	return -1;
}

const is_sky_above = function(ground, mwidth, mheight, xpos, ypos) {
	for (let y = ypos - 1; y >= 0; y--) {
		if (ground[xpos + y * mwidth] != 0) {
			return false;
		}
	}
	return true;
}

const flood_search = function(ground, mwidth, mheight, xpos, ypos) {
	let to_search = [[xpos, ypos]];
	let visited = {};
	let to_fill = [];
	let hash = function(arr) { return 'x' + arr[0] + '|y' + arr[1]; }
	while (to_search.length > 0) {
		let c = to_search.shift();
		visited[hash(c)] = true;
		if (ground[c[0] + c[1] * mwidth] == 0) {
			if (is_sky_above(ground, mwidth, mheight, c[0], c[1])) {
				return [];
			}

			to_fill.push({x: c[0], y: c[1]});

			(!visited[hash( [c[0] + 1, c[1]] )]) && (ground[c[0] + 1 + c[1] * mwidth] == 0) && to_search.push([ [c[0] + 1, c[1]] ]);
			(!visited[hash( [c[0] - 1, c[1]] )]) && (ground[c[0] - 1 + c[1] * mwidth] == 0) && to_search.push([ [c[0] - 1, c[1]] ]);
			(!visited[hash( [c[0], c[1] + 1] )]) && (ground[c[0] + (c[1] + 1) * mwidth] == 0) && to_search.push([ [c[0], c[1] + 1] ]);
			(!visited[hash( [c[0], c[1] - 1] )]) && (ground[c[0] + (c[1] - 1) * mwidth] == 0) && to_search.push([ [c[0], c[1] - 1] ]);
		}
	}

	return to_fill;
}

const create_level = function(mwidth=160,mheight=24) {
	// let text_width = 36;
	// let text_height = 7;
	// let text = [
	// 	0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0,
	// 	0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0,
	// 	0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0,
	// 	0, 1, 0, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 0, 1, 0, 0,
	// 	0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,
	// 	0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0,
	// 	0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0,
	// ];
	// let text_tiles = [2, 10, 18]

	// let mwidth = 160;
	// let mheight = 24;

	let grass = [0, 1, 1, 4, 4, 7, 7];
	let dirt_and_lava = [3, 6, 9,2,5,8];
	let dirt_and_grass = [1, 4, 7, 3, 6, 9];
	let dirt_lava_and_grass = [1,4,7,3,6,9,2,5,8];
	
	let wall = [10];
	let ground = [];
	for (let y=0; y<mheight; y++) {
		for (let x=0; x<mwidth; x++) {
			if (y == mheight - 1 || x == 0 || x == mwidth - 1) {
				ground.push(wall[0]);
			} else if (y <= mheight/3) {
				ground.push(0);
			} else if (y <= mheight*4/9) { // 3/9
				ground.push(grass[getRandInt(0,grass.length - 1)]);
			} else if (y <= mheight*5/9) {
				ground.push(dirt_and_grass[getRandInt(0, dirt_and_grass.length - 1)]);
			} else if (y <= mheight*7/9) {
				ground.push(dirt_lava_and_grass[getRandInt(0, dirt_lava_and_grass.length - 1)]);
			} else {
				ground.push(dirt_and_lava[getRandInt(0, dirt_and_lava.length - 1)]);
			}
		}
	}

	for (let t = 0; t<13; t++) {
		let xpos = getRandInt(1, mwidth - 25);
		splat_tiles(ground, mwidth, mheight, [
			0, 4, 0,
			1, 4, 7,
			], 3,2,xpos, mheight/3-1);
	}

	// Add the boss pit.
	splat_tiles(ground, mwidth, mheight, [
		-1, -1, -1, 10, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,  0,  0,  0,  0,  0,  0, 10, 10,
		-1, -1, -1, -1, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,  0,  0,  0,  0,  0,  0, 10, 10,
		-1, -1, 10, 10, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,  0,  0,  0,  0,  0,  0, 10, 10,
		-1, 10, 10, 10, 10,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,   0,  0,  0,  0,  0,  0,  0, 10, 10,
		10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,  10, 10, 10, 10, 10, 10, 10, 10, 10,
		], 24,5,mwidth-25, mheight/3 - 3);

	// Fix holes that are too deep to jump out of.
	let previousy = ray_down(ground, mwidth, mheight, 1);
	for (let x = 2; x < mwidth - 25; x++) {
		let yhit = ray_down(ground, mwidth, mheight, x);
		
		while (previousy - yhit > 2) {
			ground[x - 1 + (previousy - 1) * mwidth] = dirt_and_grass[getRandInt(0, dirt_and_grass.length - 1)];
			previousy -= 1;
		} 
		while (yhit - previousy > 2) {
			ground[x + (yhit - 1) * mwidth] = dirt_and_grass[getRandInt(0, dirt_and_grass.length - 1)];
			yhit -= 1;
		}
		previousy = yhit;
	}

	// Cover up holes that enemies and player get stuck in (hack that misses holes larger than 1x1).
	// for (let y=mheight/3; y<=mheight*4/9; y++) {
	// 	for (let x=1; x<mwidth-1; x++) {
	// 		let t = ground[x + y*mwidth];
	// 		if (t==0 && ground[x+(y-1)*mwidth] != 0 && 
	// 								ground[x+(y+1)*mwidth] != 0 && 
	// 								ground[x+1+y*mwidth] != 0 && 
	// 								ground[x-1+y*mwidth] != 0) {
	// 			ground[x+y*mwidth] = 7;//grass.slice(1)[getRandInt(0,grass.length-2)];
	// 		}
	// 	}
	// }

	// Patch holes in ground that enemies and player can get stuck in.
	for (let y=mheight/3; y<=mheight*4/9; y++) {
		for (let x=1; x<mwidth-1; x++) {
			let t = ground[x + y*mwidth];
			if (t==0 && !is_sky_above(ground, mwidth, mheight, x, y)) {
				let to_fill = flood_search(ground, mwidth, mheight, x, y);
				to_fill.forEach(o => { ground[o.x+o.y*mwidth] = dirt_and_grass[getRandInt(0, dirt_and_grass.length - 1)];});
			}
		}
	}


	let lvl = new MyTileEngine({
		tilewidth: 8,
		tileheight: 8,
		width: mwidth,
		height: mheight,
		playerSpawn: {x: 100, y: 40},
		tilesets: [{
			firstgid: 1,
			image: imageAssets['./assets/tiles_8x8.png']
		}],
		layers: [{
			name: 'ground',
			data: ground
		}]
	});

	return lvl;
}

const create_health_ui = function(obj, x=0, y=16, visible=true, invert=false, showrage=true) {
	let ui = {
		x: x,
		y: y,
		healthChildren: [],
		rageChildren: [],
		visible: visible,
		addHChild: function(c) { this.healthChildren.push(c); },
		addRChild: function(c) { this.rageChildren.push(c);},
		update: function() {
			this.x = (canvas.width - obj.maxHealth * 8) / 2 / cscale;

			this.healthChildren.forEach((i, idx) => {
				if (obj.curHealth > idx) {
					i.playAnimation('filled');
				} else {
					i.playAnimation('empty');
				}
			});
			this.rageChildren.forEach((i, idx) => {
				if (obj.curRage > idx) {
					i.color='#ff6361';
				} else {
					i.color='#00202e';
				}
			});
		},
		render: function() {
			if (!this.visible){return;}
			context.save();
			if (this.x || this.y) { context.translate(this.x, this.y); }

			this.healthChildren.forEach(i => i.render());
			this.rageChildren.forEach(i => i.render());

			context.restore();
		}
	};
	for (let h = 0; h < obj.maxHealth; h++) {
		ui.addHChild(
			new MySprite({
			x: (h + 1 - obj.maxHealth/2) * 8,
			y: 0,
			width: 8,
			height: 8,
			anchor: {x: 0.5, y: 0.5},
			animations: health_spritesheet.animations,
			flicker: invert
		}));
	}
	for (let r = 0; r < obj.maxRage; r++) {
		ui.addRChild(
			new MySprite({
			x: (r + 1 - obj.maxRage/2) * 5,
			y: 9,
			width: 4,
			height: 4,
			anchor: {x: 0.5, y: 0.5},
			color: '#00202e',
			flicker: invert
		}));
	}

	return ui;
}

const create_level_game_loop = function() {
	// gameticks = 0;
	return new MyGameLoop({
		song: 0,
		update: function() {
			for (let idx = 0; idx < map.objects.length; idx++) {
				map.objects[idx].update();
			}

			map.sx = Math.round(player.x) - canvas.width / 2 / cscale;
			map.xy = Math.round(player.y) - canvas.height / 2 / cscale;

			spawnEnemies();
			player_health.update();
			boss_health.update();

			if (!this.soundId) {
				this.soundId = setInterval((() => {
					if (this.isStopped) {
						clearInterval(this.soundId);
						return;
					}
					if(this.song==0) {
						this.actx=play_music([[0,17],[2,18],[4,19],[6,20],[8,20],[10,19],[12,18],[14,17],[18,6],[20,5],[22,4],[24,3],[26,3],[28,4],[30,5],[32,6]],400,.19,.18,.005,.1,.1,'');
					} else {
						this.actx=play_music([[0,21],[1,20],[2,19],[3,18],[4,18],[5,19],[6,20],[7,21],[8,21],[12,18],[9,21],[10,20],[11,19],[13,18],[14,19],[15,20],[16,21],[17,21],[18,21],[19,20],[20,19],[21,18],[22,18],[23,19],[24,20],[25,21],[26,21],[27,21],[28,20],[29,19],[30,18],[31,18],[32,19],[33,20],[34,21],[35,21]],400,.19,.18,.005,.1,.1,'');
					}
					//play_music([[0,24],[1,24],[1,23],[1,22],[3,23],[3,22],[3,24],[8,22],[9,22],[11,22],[16,22],[17,22],[19,22],[17,21],[17,20],[19,20],[19,21],[10,22],[24,17],[26,19],[25,18],[27,20]],400,.19,.18,.005,.1,.1,'triangle');
					// play_music([[0,17],[1,16],[2,18],[3,18],[4,17],[5,16],[6,16],[0,21],[1,20],
					// 					[2,22],[3,22],[4,21],[5,20],[6,20]],400,.19,.18,.005,.2,.05,'sawtooth');
				}).bind(this), 3500);
			}

			// gameticks += 1;
		},
		renderInside: function() {
			context.save();
			if (map.x || map.y) { context.translate(map.x | 0, map.y | 0); }
			map.render();
			player_health.render();
			boss_health.render();
			context.restore();
		}
	});
};

const start_game = function() {
	enemy_list = [];
	map = create_level();
	let height_offset = Math.max(0, canvas.height - 480) / 2 / cscale;
	map.y = height_offset;
	map.x = 0;
	player = create_player();
	player.x = map.playerSpawn.x;
	player.y = map.playerSpawn.y;
	girlfriend = create_girlfriend((160-2.5) * map.tilewidth, 20);//160-2.5=157.5
	boss = create_boss((160-1.5) * map.tilewidth, 20);
	map.add(player);
	map.add(girlfriend);
	map.add(boss);
	enemy_list.push(boss);
	player_health = create_health_ui(player);
	boss_health = create_health_ui(boss, 0, 448/cscale,false,true);//480-32=448
	loop = create_level_game_loop();
	loop.start();
};

const restart_level = function() {
	enemy_list = [];
	//player = create_player();
	player.curHealth = player.maxHealth;
	player.curRage = 0;
	player.x = map.playerSpawn.x;
	player.y = map.playerSpawn.y;
	girlfriend.x = (160-2.5) * map.tilewidth;
	girlfriend.y = 20;
	boss = create_boss((160-1.5) * map.tilewidth, 20);
	map.objects = [];
	map.add(player);
	map.add(girlfriend);
	map.add(boss);
	enemy_list.push(boss);
	player_health = create_health_ui(player);
	boss_health = create_health_ui(boss, 0, 448/cscale,false,true);//480-32=448
	loop = create_level_game_loop();
	loop.start();
};

const start_main_menu = function() {
	// let height_offset = Math.max(0, canvas.height - 480) / 2 / cscale;
	let title = new MySprite({
		image: imageAssets['./assets/logo.png'],
		// x: canvas.width / 2 / cscale,
		// y: height_offset + 50,
		anchor: {x: .5, y: .5},
		scaleX: 2,
		scaleY: 2,
	});

	// silhouette_spr.x = canvas.width / 2 / cscale;
	// silhouette_spr.y = height_offset + 480/2/cscale + 32;
	silhouette_spr.playAnimation('sword');

	let continueTxt = {
		text: 'press <space> to start',
		//width: 854 / 2 / cscale,
		// x: canvas.width / 2 / cscale,
		// y: height_offset + 420 / cscale,
		anchor: {x: .5, y: .5},
		font: '12px Courier New',
		color: '#ff8531',
		alpha: 255,
		_dt: 0.0,
		render: render_text,
		update: function() {
			this._dt += FRAME_DT;
			if (Math.floor(this._dt % 2) == 1) {
				this.alpha = Math.max(0, this.alpha - 2);
			} else {
				this.alpha = Math.min(255, this.alpha + 2);
			}
			this.color = '#ff8531' + this.alpha.toString(16);
		}
	};

	loop = new MyGameLoop({
		update: function() {
			if (continueTxt._dt >= .75 && keyPressed('Space')) {
				// start the game
				this.stop();
				start_game();
			}
			continueTxt.update();
			if (continueTxt._dt >= 15) {
				this.stop();
				start_intro();
			}
		},
		renderInside: function() {
			// fill_canvas("#2c4875");
			silhouette_spr.x = canvas.width / 2 / cscale;
			silhouette_spr.y = height_offset + 240/cscale + 32;
			silhouette_spr.render();
			title.x = canvas.width / 2 / cscale;
			title.y = height_offset + 50;
			title.render();
			continueTxt.x = canvas.width / 2 / cscale;
			continueTxt.y = height_offset + 420 / cscale;
			continueTxt.render();
			
		}
	});
	loop.start();
}

const start_intro = function() {
	let timer = {
		dt: 0.0,
		update: function() {
			this.dt += FRAME_DT;
		}
	};
	// let anims = clone_animations(silhouette.animations);
	silhouette_spr = new MySprite({ // Same sprite used in main menu.
		// x: canvas.width / 2 / cscale,// - 50,
		// y: height_offset + 240 / cscale + 42, // 480/2=240, 84/2=42
		width: 61,
		height: 84,
		scaleX: 2,
		scaleY: 2,
		anchor: {x: .5, y: .5},
		animations: silhouette.animations,
		// currentAnimation: anims[Object.keys(anims)[0]],
		// render: sprite_render_with_flip,
		// advance: sprt_advance,
		// playAnimation: sprt_play_animation,
	});
	let general_text = {
		text: 'Hey babe, I\'m back...',
		//width: 854 / 2 / cscale,
		// x: canvas.width / 2 / cscale,
		// y: height_offset + 420 / cscale, // 480 * 7 / 8 = 420
		anchor: {x: .5, y: .5},
		font: '12px Courier New',
  	color: '#ff8531',
  	render: render_text,
	};
	//anims = clone_animations(thirteen.animations);
	let graffiti = new MySprite({
		// x: canvas.width / 2 / cscale,
		// y: height_offset + 20,
		width: 18,
		height: 20,
		scaleX: 2,
		scaleY: 2,
		animations: thirteen.animations,
		// currentAnimation: anims[Object.keys(anims)[0]],
		// render: sprite_render_with_flip,
		// advance: sprt_advance,
		// playAnimation: sprt_play_animation,
	});

	// let centerObj = function(obj) {
	// 		obj.x = canvas.width / 2 / cscale;
	// 		obj.y = height_offset + 240 / cscale + 42;
	// };
	loop = new MyGameLoop({
		update: function() {
			timer.update();
			if (keyPressed('Space')) {
				this.stop();
				start_main_menu();
			}
		},
		scenes: [
			[3, function() {
				// centerObj(silhouette_spr);
				silhouette_spr.x = canvas.width / 2 / cscale;
				silhouette_spr.y = height_offset + 240 / cscale + 42;
				silhouette_spr.render();
				// centerObj(general_text);
				general_text.x = canvas.width / 2 / cscale;
				general_text.y = height_offset + 420 / cscale;
				general_text.render();}],
			[5, function() {
				// centerObj(silhouette_spr);
				silhouette_spr.x = canvas.width / 2 / cscale;
				silhouette_spr.y = height_offset + 240 / cscale + 42;
				silhouette_spr.render();
				graffiti.x = canvas.width / 2 / cscale;
				graffiti.y = height_offset + 20;
				graffiti.render();}],
			[6, function() {
				// centerObj(silhouette_spr);
				silhouette_spr.x = canvas.width / 2 / cscale;
				silhouette_spr.y = height_offset + 240 / cscale + 42;
				silhouette_spr.render();
				// centerObj(general_text);
				general_text.x = canvas.width / 2 / cscale;
				general_text.y = height_offset + 420 / cscale;
				general_text.text = 'No...';
				general_text.render();
				graffiti.x = canvas.width / 2 / cscale;
				graffiti.y = height_offset + 20;
				graffiti.render();}],
			[7, function() {
				// centerObj(silhouette_spr);
				silhouette_spr.x = canvas.width / 2 / cscale;
				silhouette_spr.y = height_offset + 240 / cscale + 42;
				silhouette_spr.render();
				// centerObj(general_text);
				general_text.x = canvas.width / 2 / cscale;
				general_text.y = height_offset + 420 / cscale;
				general_text.text = 'No...no...';
				general_text.render();
				graffiti.x = canvas.width / 2 / cscale;
				graffiti.y = height_offset + 20;
				graffiti.render();
			}],
			[10, function() {
				// centerObj(silhouette_spr);
				silhouette_spr.x = canvas.width / 2 / cscale;
				silhouette_spr.y = height_offset + 240 / cscale + 42;
				silhouette_spr.render();
				// centerObj(general_text);
				general_text.x = canvas.width / 2 / cscale;
				general_text.y = height_offset + 420 / cscale;
				general_text.text = 'No...no...NO!!!';
				general_text.render();
				graffiti.x = canvas.width / 2 / cscale;
				graffiti.y = height_offset + 20;
				graffiti.render();
			}],
			[15, function() {
				silhouette_spr.x = canvas.width / 2 / cscale;
				silhouette_spr.playAnimation('sword');
				silhouette_spr.y = height_offset + 240 / cscale + 32;
				graffiti.x = canvas.width / 2 / cscale;
				graffiti.y = height_offset + 20;
				graffiti.render();
				silhouette_spr.render();
				general_text.text = 'The 13 took her...\nI\'ll make them regret it.';
				//general_text.width = 820 / cscale;
				general_text.x = canvas.width / 2 / cscale;
				general_text.y = height_offset + 360 / cscale; //480 * 6 / 8=360
				general_text.render();
			}],
			[15, function() {
				loop.stop();
				start_main_menu();
			}],
		],
		renderInside: function() {
			if (this.scenes.length == 0) { return; }
			if (timer.dt < this.scenes[0][0]) {
				this.scenes[0][1]();
			} else {
				this.scenes.shift();
				if (!this.scenes.length == 0) {this.scenes[0][1]();}
			}
		}
	});
	loop.start();
};

const start_end_scene = function() {
  //player = create_player();//{x:0,y:0,scaleX:1,scaleY:1,anchor:{x:0.5,y:0.5},width:1,height:1};
  // let timer = {
  //   dt: 0.0,
  //   update: function() {
  //     this.dt += FRAME_DT;
  //   }
  // };
  let objects = new MySprite({
    // x: canvas.width / 2 / cscale,
    // y: height_offset,
    width: 1,
    height: 1,
    dt: 0.0,
    update: function(dt=FRAME_DT) {
      this.advance(dt);
      this.dt += dt;
    }
  });

  objects.addChild({
    text: 'You Win.',
    x: 0,//-2.5 * context.measureText(obj.name).width / cscale,// - 12,
    y: 61,//(2)*32 -3
    anchor: {x: 0.5, y: .5},
    font: '8px Courier New',
    color: '#ff8531',
    render: render_text,
  });

  [{anim: 0, sheet: enemy_spritesheets, name: 'Duckie'},
    {anim: 1, sheet: enemy_spritesheets, name: 'Pogo'},
    {anim: 2, sheet: enemy_spritesheets, name: 'Snakes'},
    {anim: 3, sheet: enemy_spritesheets, name: 'Bert'},
    {anim: 0, sheet: [boss_spritesheet], name: 'The Bull'},
    {anim: 0, sheet: [player_spritesheet], name: 'You'},
    {anim: 0, sheet: [girlfriend_spritesheet], name: 'May'}].forEach((obj,idx) => {
      objects.addChild(new Enemy({
        x: 0,
        y: (idx+3)*32,
        animations: obj.sheet[obj.anim].animations,
        anchor: {x: 0, y: 0.5},
        state_transitions: {
          'wait': [],
        },
        ai_state: 'wait',
        update: function(dt=FRAME_DT) {
          this.advance(dt);
        }
      }));
      objects.addChild({
        text: obj.name,
        //width: 854 / 2 / cscale,
        x: -2.5 * context.measureText(obj.name).width / cscale,// - 12,
        y: (idx+3)*32 -3,//-1 * context.measureText('Duckie').height / 2, // 480 * 7 / 8 = 420
        anchor: {x: 0.5, y: .5},
        font: '8px Courier New',
        color: '#ff8531',
        render: render_text,
      });
  });

  objects.addChild({
    text: 'Thank You for Playing!',
    x: 0,//-2.5 * context.measureText(obj.name).width / cscale,// - 12,
    y: 349, //(10+1)*32 -3
    anchor: {x: 0.5, y: .5},
    font: '8px Courier New',
    color: '#ff8531',
    render: render_text,
  });
  

  loop = new MyGameLoop({
    update: function() {
      objects.update();
      // timer.update();
      if (objects.dt >= .75 && keyPressed('Space')) {
        // start the game
        this.stop();
        start_main_menu();
      }
    },
    renderInside: function() {
      objects.x = canvas.width / 2 / cscale;
      objects.y = height_offset + Math.max(objects.dt * -10, -293);//-(9)*32 - 5
      objects.render();
    }
  });
  loop.start();
}

const collides = function(obj1, obj2) {
	let obj1bounds = [{x: obj1.world.x - obj1.world.width * (obj1.anchor.x) * obj1.world.scaleX, y: obj1.world.y - obj1.world.height * (obj1.anchor.y) * obj1.world.scaleY},
										{x: obj1.world.x + obj1.world.width * (1.0 - obj1.anchor.x) * obj1.world.scaleX, y: obj1.world.y + obj1.world.height * (1.0 - obj1.anchor.y) * obj1.world.scaleY}];
	let obj2bounds = [{x: obj2.world.x - obj2.world.width * (obj2.anchor.x) * obj2.world.scaleX, y: obj2.world.y - obj2.world.height * (obj2.anchor.y) * obj2.world.scaleY},
										{x: obj2.world.x + obj2.world.width * (1.0 - obj2.anchor.x) * obj2.world.scaleX, y: obj2.world.y + obj2.world.height * (1.0 - obj2.anchor.y) * obj2.world.scaleY}];

	if (!(	obj2bounds[TOP_LEFT].x > obj1bounds[BOTTOM_RIGHT].x ||
					obj2bounds[BOTTOM_RIGHT].x < obj1bounds[TOP_LEFT].x ||
					obj2bounds[TOP_LEFT].y > obj1bounds[BOTTOM_RIGHT].y ||
					obj2bounds[BOTTOM_RIGHT].y < obj1bounds[TOP_LEFT].y
				)) {
		return obj2bounds;
	}
	return null;
}

const is_tile_collision = function(tilex, tiley, obj, layerName) {
	let layer = map.layerMap[layerName];
	let wpos = {x: tilex * map.tilewidth, y: tiley * map.tileheight};
	let istile = layer.data[tilex + tiley * map.width] != 0;

	if (istile) {
		return collides(obj, {world:{ x: tilex * map.tilewidth, 
													 y: tiley * map.tileheight,
													 width: map.tilewidth,
													 height: map.tileheight,
													 scaleX: 1, scaleY: 1 },anchor: {x:0,y:0}});
	}
	return null;
	// let tilebounds = [{x: wpos.x, y: wpos.y}, {x: wpos.x + map.tilewidth, y: wpos.y + map.tileheight}];
	// let thisbounds = [{x: obj.x - obj.width * (1.0 - obj.anchor.x) * obj.scaleX, y: obj.y - obj.height * (1.0 - obj.anchor.y) * obj.scaleY},
	// 									{x: obj.x + obj.width * (1.0 - obj.anchor.x) * obj.scaleX, y: obj.y + obj.height * (1.0 - obj.anchor.y) * obj.scaleY}];


	// if (istile && !(	tilebounds[TOP_LEFT].x > thisbounds[BOTTOM_RIGHT].x ||
	// 									tilebounds[BOTTOM_RIGHT].x < thisbounds[TOP_LEFT].x ||
	// 									tilebounds[TOP_LEFT].y > thisbounds[BOTTOM_RIGHT].y ||
	// 									tilebounds[BOTTOM_RIGHT].y < thisbounds[TOP_LEFT].y
	// 								)) {
	// 	return tilebounds;
	// }
	// return null;
}

const fixMovement3 = function(obj, layerName) {
	let obj_tpos = {c: getCol(obj.x), r: getRow(obj.y)};
	let left_collision = is_tile_collision(obj_tpos.c - 1, obj_tpos.r, obj, layerName);
	let right_collision = is_tile_collision(obj_tpos.c + 1, obj_tpos.r, obj, layerName);
	let up_collision = is_tile_collision(obj_tpos.c, obj_tpos.r - 1, obj, layerName);
	let down_collision = is_tile_collision(obj_tpos.c, obj_tpos.r + 1, obj, layerName);

	let touching = { 	left: false, right: false, up: false, down: false, 
						left_tpos: {c:obj_tpos.c - 1, r:obj_tpos.r}, right_tpos: {c:obj_tpos.c + 1, r:obj_tpos.r}, 
						up_tpos: {c:obj_tpos.c, r:obj_tpos.r - 1}, down_tpos: {c:obj_tpos.c, r:obj_tpos.r + 1} };

	if (left_collision) {
		obj.x = left_collision[BOTTOM_RIGHT].x + obj.width * (1.0 - obj.anchor.x) * obj.scaleX;
		if (Math.sign(obj.dx) < 0) {
			obj.dx = 0.0;
		}
		obj.ddx = 0.0;
		touching.left = true;
	}
	if (right_collision) {
		obj.x = right_collision[TOP_LEFT].x - obj.width * (1.0 - obj.anchor.x) * obj.scaleX;
		if (Math.sign(obj.dx) > 0) {
			obj.dx = 0.0;
		}
		obj.ddx = 0.0;
		touching.right = true;
	}
	if (down_collision) {
		obj.y = down_collision[TOP_LEFT].y - obj.height * (1.0 - obj.anchor.y) * obj.scaleY;
		if (!obj.jumping) {
			obj.dy = 0.0;
		}
		obj.ddy = 0.0;
		touching.down = true;
	}
	if (up_collision) {
		obj.y = up_collision[BOTTOM_RIGHT].y + obj.height * (1.0 - obj.anchor.y) * obj.scaleY;
		obj.dy = 0.0;
		obj.ddy = 0.0;
		touching.up = true;
	}

	if (obj.y < 0) { obj.y = 0; }
	if (obj.y > map.height * map.tileheight) { obj.y = map.height * map.tileheight; }
	if (obj.x < 0) { obj.x = 0; }
	if (obj.x > (map.width) * map.tilewidth) { obj.x = (map.width) * map.tilewidth; }
	return touching;
}

const max_enemies = 10;
let enemy_list = [];
// let max_spawn_dist = 1000;
let min_spawn_dist = 160; // 8*20
let spawnEnemies = function() {
	if (enemy_list.length >= max_enemies) {
		return;
	}

	let xpos = getRandInt(map.tilewidth, (map.width - 25) * map.tilewidth); // 24 for boss pit width
	//Math.max(map.tilewidth, Math.min(player.x + getRandInt(-max_spawn_dist, max_spawn_dist), (map.width - 2) * map.tilewidth));
	if (xpos - player.x >= 0) {
		xpos = Math.min(xpos + min_spawn_dist, (map.width - 26) * map.tilewidth);
	} else {
		xpos = Math.max(xpos - min_spawn_dist, map.tilewidth);
	}

	let picked_enemy = getRandInt(0, enemy_spritesheets.length - 1);
	let enemy = new Enemy({
		x: xpos,
		y: 40,
		animations: enemy_spritesheets[picked_enemy].animations,
		anchor: {x: 0.5, y: 0.5},
		state_transitions: [{
			'idle': [{method: 'aiDeltaUpdate', args:[3]},{method:'stateChangeRandCheck',args:[0,1,1,'move']}],
			'move': [{method: 'aiDeltaUpdate', args:[2]},{method:'stateChangeRandCheck',args:[0,1,1,'idle']}]
		},
		{
			'idle': [{method: 'facePlayer'},{method: 'aiDeltaUpdate', args:[3]},{method:'stateChangeRandCheck',args:[0,2,2,'move',1,'jump']}],
			'move': [{method: 'aiDeltaUpdate', args:[2]},{method:'stateChangeRandCheck',args:[0,2,2,'idle',1,'jump']}],
			'jump': [{method: 'changeState', args: ['move']}],
		},
		{
			'idle': [{method: 'facePlayer'},{method: 'aiDeltaUpdate', args:[3]},{method:'stateChangeRandCheck',args:[0,1,1,'move']}],
			'move': [{method: 'aiDeltaUpdate', args:[2]},{method:'stateChangeRandCheck',args:[0,1,1,'idle']}]
		},
		{
			'idle': [{method: 'facePlayer'},{method: 'aiDeltaUpdate', args:[3]},{method:'stateChangeRandCheck',args:[0,1,1,'move']}],
			'move': [{method: 'facePlayer'},{method: 'aiDeltaUpdate', args:[2]},{method:'stateChangeRandCheck',args:[0,1,1,'idle']}]
		},
		][picked_enemy],
		ai_state: 'move'
	});

	map.add(enemy);
	enemy_list.push(enemy);
}

load(	'./assets/tiles_8x8.png', './assets/characters.png', 
			'./assets/explosion.png', './assets/logo.png',
			'./assets/silhouette.png').then(function() {

	explosion_spritesheet = SpriteSheet({
		image: imageAssets['./assets/explosion.png'],
		frameWidth: 16,
		frameHeight: 16,
		// margin: 0,
		// spacing: 0,
		animations: {
			explode: {
				frames: [0,1,2,3],
				frameRate: 8,
				loop: false
			}
		}
	});

	health_spritesheet = SpriteSheet({
		image: imageAssets['./assets/tiles_8x8.png'],
		frameWidth: 8,
		frameHeight: 8,
		// margin: 0,
		// spacing: 0,
		animations: {
			filled: {
				frames: [10],
				frameRate: 1
			},
			empty: {
				frames: [11],
				frameRate: 1
			}
		}
	});

	
	let character_spritesheets = [
		// enemies
		{walk:[0,1,2,3], idle:[1] },
		{walk:[5,6,7,8], idle:[6] },
		{walk:[10,11,12,13], idle:[11] },
		{walk:[20,21,22,23], idle:[21] },
		// boss
		{walk:[25,26,27,28], idle:[26], charge:[29] },
		// player
		{walk:[4,9,14,19], idle:[9, 24] },
		// girlfriend
		{walk:[15,16/*,17,18*/], idle:[15,16] },
	].map(s => SpriteSheet({
			image: imageAssets['./assets/characters.png'],
	    frameWidth: 4,
	    frameHeight: 8,
	    // margin: 0,
	    // spacing: 0,
	    animations: {
	      walk: {
	        frames: s.walk,
	        frameRate: 4
	      },
	      idle: {
	      	frames: s.idle,
	      	frameRate: 1
	      },
	      charge: {
	      	frames: s.charge || [0],
	      	frameRate: 1,
	      	loop: false
	      }
	    }
		})
	);

	player_spritesheet = character_spritesheets[5];
	girlfriend_spritesheet = character_spritesheets[6];
	boss_spritesheet = character_spritesheets[4];
	enemy_spritesheets = character_spritesheets.slice(0,4);
	help_spritesheet = SpriteSheet({
		image: imageAssets['./assets/characters.png'],
    frameWidth: 8,
    frameHeight: 8,
    // margin: 0,
    // spacing: 0,
    animations: {
      default: {
        frames: [7],
        frameRate: 1,
        loop: false,
      }
    }
	});

	thirteen = SpriteSheet({
		image: imageAssets['./assets/logo.png'],
		frameWidth: 18,
		frameHeight: 20,
		// margin: 0,
		// spacing: 0,
		animations: {
			default: {
				frames: [0],
				frameRate: 1
			}
		}
	});

	silhouette = SpriteSheet({
		image: imageAssets['./assets/silhouette.png'],
		frameWidth: 61,
		frameHeight: 84,
		// margin: 0,
		// spacing: 0,
		animations: {
			default: {
				frames: [1],
				frameRate: 1
			},
			sword: {
				frames: [0],
				frameRate: 1
			}
		}
	});

  // start_end_scene();
	start_intro();
});
