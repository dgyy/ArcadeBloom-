class Vec {
    constructor(x=0,y=0) {
        this.x = x;
        this.y = y;
        this.m;
        return this;
    };
    copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    vFrD(d) {
        this.x = Math.cos(d);
        this.y = Math.sin(d);
        return this;
    };
    clear() {
        this.x = 0;
        this.y = 0;
        return this;
    };
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    scale(n) {
        this.x *= n;
        this.y *= n;
        return this;
    };
    dir(v) {
        return Math.atan2(this.y,this.x);
    };
    dist(v) {
        return Math.sqrt(Math.pow(v.x - this.x, 2) + Math.pow(v.y - this.y, 2));
    };
    mag() {
        this.m = Math.sqrt(this.x*this.x +this.y*this.y);
        return this.m;
    };
    unit() {
        this.mag();
        this.x /= this.m;
        this.y /= this.m;
        this.m = 1;
        return this;
    };
    dotPrd(v) {
        v.unit();
        return this.x * v.x + this.y *v.y;
    };
    project(v,out) {
        this.m = this.dotPrd(v);
        out.x = this.m * v.x;
        out.y = this.m * v.y;
        return out;
    };
    perp() {
        this.m = this.x;
        this.x = this.y;
        this.y = -this.m;
        return this;
    };
    limit(n) {
        this.mag();
        if(this.m > n) {
            this.unit();
            this.scale(n);
        }
        return this;
    }
};
class Button {
	constructor(x,y,w,h,text,colour) {
		this.pos = new Vec(x,y);
		this.w = w;
		this.h = h;
		this.text = text;
		this.colour = colour || 'grey';
	}
	render() {
		C.ctx.save();
		C.ctx.translate(-this.w/2,-this.h/2);
		C.ctx.fillStyle = this.colour;
		C.ctx.fillRect(this.pos.x,this.pos.y,this.w,this.h);
		C.ctx.restore();

		C.ctx.fillStyle = 'black';
		C.ctx.font = '20px futura';
		C.ctx.textAlign = 'center';
		C.ctx.textBaseLine = 'top';
		C.ctx.fillText(this.text,this.pos.x,this.pos.y+this.h/12);
	} 
};
class Sprite {
	//  XYWH, SOURCE XY, DESTINATION XY, TIMER, ROTATION, TIMER, SOURCE X OFFSET
	// constructor(x,y,w,h,sx,sy,dx,dy,t,sxo) {
	constructor(o) {
		if(o.length)
			this.init(o);
		
	};
	init(o) {
		this.pos = new Vec(o[0],o[1]);
		this.ox = o[0];
		this.oy = o[1];
		this.w = o[2];
		this.h = o[3];
		this.sx = o[4];
		this.sy = o[5];
		this.sxo = o[10] || 0;
		//  DESTINATION
		this.dx = o[6];
		this.dy = o[7];
		this.start = o[8];
		this.timer = o[8];
		this.r = o[9];
		this.aTime = 0;
	};
	update(sT) {
			
		
		//  ITS AN ARROW WITH A DESTINATION
		if(this.dx) {
			//  COUNT DOWN TIMER
			this.timer -= sT;
			//  TIMES UP, RELEASE THIS OBJECT
			if(this.timer <= 0)
				this.release();
			//  IF IT IS NOT A VERTICAL SHOT
			if(Math.abs(this.dx-this.ox) > HEX_RADIUS/2) {
				//  ROTATE SPRITE DEPENDING ON WHICH DIRECTION IT IS HEADING
				_i = this.dx < this.ox ? -1 : 1;
				if(Math.abs(this.dx-this.ox) < HEX_RADIUS*2
				&& Math.abs(this.dy-this.oy) < HEX_RADIUS*2)
					this.r += 0.025*_i;
				this.r += 0.025*_i;
				// if(this.dx < this.ox)	
					// this.r -= 0.025;
				// else this.r += 0.025;
			} else {
				if(this.dy < this.oy)
					this.r = -Math.PI/2
				else this.r = Math.PI/2
			}
			this.pos.x  = (this.dx-this.ox)*(this.start-this.timer)/this.start + this.ox;
			this.pos.y  = (this.dy-this.oy)*(this.start-this.timer)/this.start + this.oy - Math.sin((this.start-this.timer)/this.start*Math.PI)*HEX_RADIUS;
		}
		//  IF OUR ANIMATION TIMER IS SET
		if(this.aTime) {
			if(gameTime - this.aTime > 500)
				this.aTime = 0;
		}

		// this.r += 0.01
	};
	// cumulative time, start value, change in value, duration
	// function easeLinear (t, b, c, d) {
	//     return c * t / d + b;
	// }
	render(x,y) {
		C.ctx.save();
		C.ctx.translate(this.pos.x,this.pos.y);
		if(this.r)
			C.ctx.rotate(this.r);
		C.ctx.drawImage(spriteSheet,this.sx+this.sxo,this.sy+(this.aTime>0?this.h:0),this.w,this.h,x,y,this.w,this.h);
		C.ctx.restore();
	};
};
let ID = 0;
class Obj {
	constructor(xy,w,h,type,facing=1) {
		this.id = ID++;
		this.pos = new Vec(xy.x,xy.y);
		this.mTarget = new Vec().copy(PointToHex(xy));
		this.gridPos = new Vec();
		this.oPos = new Vec().copy(this.mTarget);
		this.centre = new Vec();
		this.w = w;
		this.h = h;
		this.fDir = 0;
		this.mDir = new Vec();
		
		this.rePath = 100;
		this.path = [];
		
		this.colour = 'grey';
		this.hex = undefined;
		this.team = 0;
		this.aTarget = undefined;
		

		this.type = type;
		this.speed = HEX_RADIUS/4;
		this.aDist = HEX_RADIUS*2.1;
		this.aSpeed = 2000;
		this.aDamage = 5;
		this.attacks = 4;
		this.units = 12;
		this.facing = facing;
		this.willFace;

		this.runMax = 5000;
		this.running = false;
		this.charged = false;
		

		this.dead = false;

		this.sprites = [];
		this.shield = 0;

		// this.runButton = new Obj()

		switch(type) {
			case 'knight':
				this.speed = HEX_RADIUS/2;
				this.aSpeed = 1500;
				this.aDamage = 7;
				this.shield = 2;
				this.attacks = 3;
				this.units = 6;
				for(_i=0; _i<6; _i++) {
					_x = spriteLocations[1][0][_i*2]-this.w;
					_y = spriteLocations[1][0][_i*2+1]-this.h;
					_z = new Sprite([_x,_y,16,16,0,90, , , , ,((Math.floor(Math.random()*3))*96)]);
					this.sprites.push(_z);
				}

			break;
			case 'archer':
				this.aDist = HEX_RADIUS * 4.1;
				this.aDamage = 3;
				for(_i=0; _i<12; _i++) {
					// _point.copy({x:_i*5,y:0});
					_x = spriteLocations[0][0][_i*2]-this.w;
					_y = spriteLocations[0][0][_i*2+1]-this.h;
					_z = new Sprite([_x,_y,14,14,0,60]);
					this.sprites.push(_z);
				}
			break;
			case 'spearmen':
				this.aSpeed = 1400;
				this.shield = 1;
				this.aDamage = 4;
				for(_i=0; _i<12; _i++) {
					// _point.copy({x:_i*5,y:0});
					_x = spriteLocations[0][0][_i*2]-this.w;
					_y = spriteLocations[0][0][_i*2+1]-this.h;
					_z = new Sprite([_x,_y,14,14,(_i<8?14:28),32]);
					this.sprites.push(_z);
				}
			break;
			case 'horseArcher':
				this.speed = HEX_RADIUS * 0.3;
				this.aDist = HEX_RADIUS * 3.7;
				this.aSpeed = 1800;
				this.aDamage = 4;
				this.attacks = 3;
				this.shield = 1;
				this.units = 6;
				for(_i=0; _i<6; _i++) {
					_x = spriteLocations[1][0][_i*2]-this.w;
					_y = spriteLocations[1][0][_i*2+1]-this.h;
					_z = new Sprite([_x,_y,16,16,0,0,,,,,(Math.floor(Math.random()*3)*48)]);
					this.sprites.push(_z);
				}
			break;
		}
		this.aTimer = 0;
		this.run = this.runMax;
		this.health = this.units*10;

	};
	begin(tS) {};
	update(sT) {
		//  IF WE YET LIVE
		if(!this.dead) {
			//  KILL THIS OBJECT IF NECESSARY
			if(this.health <= 0) {
				this.dead = true;
				this.hex.unit = undefined;
				if(this.team) enemies.splice(enemies.indexOf(this),1);
				else army.splice(army.indexOf(this),1);
			}

			//  CACHE CENTRE OF OBJECT
			this.centre.copy(this.pos);
			this.centre.x += this.w/2-7;
			this.centre.y += this.h/2-7;

			if(selected == this) {
				if(this.type == 'archer') {
					runButton.type = 'RUN';
				} else {
					if(this.aTarget)
						runButton.type = 'CHARGE!'
					else runButton.type = 'RUN';
				}
			}
			//  IF WE ARE NOT AT OUR MOVE TARGET (HEX)
			if(this.mTarget.x != this.gridPos.x
			|| this.mTarget.y != this.gridPos.y
			|| (this.hex && this.pos.dist(this.hex.pos) > HEX_RADIUS/10)) {
			// if(this.hex
			// && this.pos.dist(this.hex.pos) > HEX_RADIUS/10) {
				//  COUNTDOWN TO RE PATHING
				// if(this.rePath > 0)
				this.rePath -= sT;
				if(this.path.length
				&& this.path[0].unit
				&& this.path[0].unit != this)
					this.rePath = 0;
				//  RE PATH
				if(this.rePath <= 0) {
					this.rePath = 250
					//  FIND PATH
					FindPath(this.gridPos,this.mTarget,this.path,this);
					//  IF WE ARE PATHING TO AN ATTACK TARGET
					if(this.aTarget) {
						//  CHECK ALL PATH NODES
						for(_i=0,_iL=this.path.length; _i<_iL; _i++) {
							// if(this.type == 'horseArcher'
							// && (this.gridPos.x != this.aTarget.gridPos.x
							// || this.gridPos.y != this.aTarget.gridPos.y))
							// 	break;
							//  WHEN WE FIND ONE THAT IS LESS THAN OUR ATTACK DISTANCE
							if(this.aTarget.pos.dist(this.path[_i].pos) < this.aDist) { 
								// console.log(this.type,'dropping the rest')
								//  DROP ALL REMAINING NODES AND BREAK OUT OF FOR LOOP
								this.path.splice(_i+1);
								break;
							}
						}
					}
				}
			}
			this.mDir.clear();
			if(!this.running)
				this.run = Math.min(this.run + sT/4,this.runMax);
			//  IF WE HAVE A PATH
			if(this.path.length) {
				//  IF THE SECOND NODE IS CLOSER THAN THE FIRST NODE
				if(this.path.length > 1
				&& this.centre.dist(this.path[1].pos) < this.centre.dist(this.path[0].pos)) {
					this.path.splice(0,1);
				}
				//  IF THE FIRST NODE IS FURHTER FROM THE END THAN this
				if(this.path.length > 1
				&& this.centre.dist(this.path[1].pos) < this.path[0].pos.dist(this.path[1].pos)) {
					this.path.splice(0,1);
				}
				//  IF THERE IS A UNIT ON THE FIRST NODE AND IT IS THE LAST, DROP IT
				if(this.path[0].unit != undefined
				&& this.path[0].unit != this
				&& this.path.length == 1) {
					this.path.splice(0,1);
					this.mTarget.copy(this.gridPos);
					this.path.push(hexGrid[this.gridPos.x][this.gridPos.y]);
				}
				//  IF THERE IS A UNIT ON THE LAST NODE, DROP IT
				if(this.path[this.path.length-1].unit
				&& this.path[this.path.length-1].unit != this) {
					// this.path.splice(0,1);
					this.path.pop();
					// if(this.path.length > 1)
						// this.mTarget.copy(this.path[this.path.length-1]);
					// this.path.push(hexGrid[this.gridPos.x][this.gridPos.y]);
				}
				//  IF WE SPLICED THE LAST NODE, WE ARE DONE
				if(!this.path.length)
					return;
				//  IF WE ARE CLOSE TO THE CENTRE OF THE FIRST NODE
				if(this.centre.dist(this.path[0].pos) < HEX_RADIUS/100)
					this.path.splice(0,1);

				if(!this.path.length)
					return;
				

				//  FACE THE FIRST NODE
				this.mDir.copy(this.path[0].pos).sub(this.pos).unit();
				//  IF WE ARE RUNNING
				if(this.running) {
					//  COUNTDOWN RUN METER
					this.run -= sT;
					//  END RUN
					if(this.run < 0) {
						this.run = 0;
						this.running = false;
						//  SET OUR MOVE TARGET TO OUR CURRENT POSITION
						this.mTarget.copy(this.gridPos);
						//  DROP ANY EXTRA PATH NODES
						if(this.path.length > 1)
							this.path.splice(1);
						//  RE PATH
						this.rePath = 0;
						//  FAILED CHARGE, RESET ATTACK TIMER
						this.aTimer = this.aSpeed;
					//  SCALE UP RUN BY 1.5
					} else this.mDir.scale(1.5);
				}
				
				//  MOVE FORWARD
				this.pos.add(this.mDir.scale(this.speed).scale(sT/1000));
				//  mDir.dir() GIVES THE DIRECTION THE VECTOR IS POINTING IN RADIANS -PI to PI
				//  THIS FINAGLES THAT NUMBER TO GIVE US OUR DIRECTION IN HEX
				this.facing = Math.round(this.mDir.dir()/Math.PI*3)+3;
			//  WE HAVE NO PATH		
			} else {
				//  NO PATH MEANS NOWHERE TO RUN TO
				this.running = false;
				//  FACE THE DIRECTION REQUESTED
				if(this.willFace) {
					//  MAKE SURE WE'RE FACING OUR TARGET
					_point.copy(this.willFace.pos).sub(this.pos);
					this.facing = Math.round(_point.dir()/Math.PI*3)+3;
					this.willFace = undefined;
				}
			}
			
			//  UPDATE GRID POSITION OF OBJECT
			this.gridPos.copy(PointToHex(this.pos));
			if(!this.hex) {
				this.hex = hexGrid[this.gridPos.x][this.gridPos.y];
				this.hex.unit = this;
			}
			//  IF WE ARE NOT STANDING IN THE HEX THAT WE HAVE NOTED
			if(this.gridPos.x != this.hex.gridPos.x
			|| this.gridPos.y != this.hex.gridPos.y) {
				//  REMOVE US FROM OLD HEX
				this.hex.unit = undefined;
				//  UPDATE OUR HEX
				this.hex = hexGrid[this.gridPos.x][this.gridPos.y];
				//  ADD US TO NEW HEX
				this.hex.unit = this;
			}
			//  UPDATE SPRITE SOURCE
			switch(this.facing) {
				//  LEFT RIGHT
				case 0:
				case 6:
				case 3:
					for(_i=0,_iL=this.sprites.length; _i<_iL; _i++) {
						//  SPEARMEN THAT ARE MARCHING POINT SPEARS UP
						switch(this.type) {
							case 'spearmen':
								this.sprites[_i].pos.x = spriteLocations[0][0][_i*2]-this.w-5;
								this.sprites[_i].pos.y = spriteLocations[0][0][_i*2+1]-this.h-3;
								if(this.isMoving()) this.sprites[_i].sx = 42;
								//  LAST FOUR (FRONT ROW)
								else if(_i < 4) this.sprites[_i].sx = 70;
								else this.sprites[_i].sx = 56;
							break;
							case 'archer':
								this.sprites[_i].pos.x = spriteLocations[0][0][_i*2]-this.w-5;
								this.sprites[_i].pos.y = spriteLocations[0][0][_i*2+1]-this.h-3;
								this.sprites[_i].sx = 14;
								this.sprites[_i].sy = 60;
							break;
							case 'knight':
								this.sprites[_i].pos.x = spriteLocations[1][1][_i*2]-this.w;
								this.sprites[_i].pos.y = spriteLocations[1][1][_i*2+1]-this.h-5;
								this.sprites[_i].sx = 32 + (_i<3?0:16);
								this.sprites[_i].sy = 88;
							break;
							case 'horseArcher':
								this.sprites[_i].pos.x = spriteLocations[1][1][_i*2]-this.w;
								this.sprites[_i].pos.y = spriteLocations[1][1][_i*2+1]-this.h-5;
								this.sprites[_i].sx = 16;
								this.sprites[_i].sy = 122;
							break;
						}
					}
				break;
				//  DOWNS
				case 4:
				case 5:
					for(_i=0,_iL=this.sprites.length; _i<_iL; _i++) {
						//  SPEARMEN THAT ARE MARCHING POINT SPEARS UP
						switch(this.type) {
							case 'spearmen':
								this.sprites[_i].pos.x = spriteLocations[0][1][_i*2]-this.w-4;
								this.sprites[_i].pos.y = spriteLocations[0][1][_i*2+1]-this.h-4;
								if(this.isMoving()) this.sprites[_i].sx = 0;
								//  LAST FOUR (FRONT ROW)
								else if(_i < 4) this.sprites[_i].sx = 14;
								else this.sprites[_i].sx = 28;
							break;
							case 'archer':
								this.sprites[_i].pos.x = spriteLocations[0][1][_i*2]-this.w-4;
								this.sprites[_i].pos.y = spriteLocations[0][1][_i*2+1]-this.h-4;
								this.sprites[_i].sx = 0;
								this.sprites[_i].sy = 60;
							break;
							case 'knight':
								this.sprites[_i].pos.x = spriteLocations[1][0][_i*2]-this.w;
								this.sprites[_i].pos.y = spriteLocations[1][0][_i*2+1]-this.h-5;
								this.sprites[_i].sx = 0 + (_i<3?0:16);
								this.sprites[_i].sy = 88;
							break;
							case 'horseArcher':
								this.sprites[_i].pos.x = spriteLocations[1][0][_i*2]-this.w;
								this.sprites[_i].pos.y = spriteLocations[1][0][_i*2+1]-this.h-5;
								this.sprites[_i].sx = 0;
								this.sprites[_i].sy = 122;
							break;
						}
					}
				break;
				//  UPS
				case 2:
				case 1:
					for(_i=0,_iL=this.sprites.length; _i<_iL; _i++) {
						//  SPEARMEN THAT ARE MARCHING POINT SPEARS UP
						switch(this.type) {
							case 'spearmen':
								this.sprites[_i].pos.x = spriteLocations[0][2][_i*2]-this.w-5;
								this.sprites[_i].pos.y = spriteLocations[0][2][_i*2+1]-this.h-4;
								if(this.isMoving()) this.sprites[_i].sx = 84;
								//  LAST FOUR (FRONT ROW)
								else if(_i < 4) this.sprites[_i].sx = 112;
								else this.sprites[_i].sx = 98;
							break;
							case 'archer':
								this.sprites[_i].pos.x = spriteLocations[0][2][_i*2]-this.w-5;
								this.sprites[_i].pos.y = spriteLocations[0][2][_i*2+1]-this.h-4;
								this.sprites[_i].sx = 28;
								this.sprites[_i].sy = 60;
							break;
							case 'knight':
								this.sprites[_i].pos.x = spriteLocations[1][2][_i*2]-this.w;
								this.sprites[_i].pos.y = spriteLocations[1][2][_i*2+1]-this.h-5;
								this.sprites[_i].sx = 64 + (_i<3?0:16);
								this.sprites[_i].sy = 88;
							break;
							case 'horseArcher':
								this.sprites[_i].pos.x = spriteLocations[1][2][_i*2]-this.w;
								this.sprites[_i].pos.y = spriteLocations[1][2][_i*2+1]-this.h-5;
								this.sprites[_i].sx = 32;
								this.sprites[_i].sy = 122;
							break;
						}

						
					}
				break;
			}



			//  IF WE HAVE AN ATTACK TARGET
			if(this.aTarget) {
				//  IF OUR ATTACK TARGET IS DEAD
				if(this.aTarget.dead) {
					this.aTarget = undefined;
					this.mTarget.copy(this.gridPos);
				}
				//  IF OUR ATTACK TARGET IS ALIVE
				else {
					//  IF WE ARE WITHIN ATTACK RANGE
					if(this.pos.dist(this.aTarget.pos) < this.aDist) {
						//  PREPARE A CHARGED ATTACK
						if(this.running
						&& this.type != 'archer') {
							this.charged = true;
							//  DROP ANY EXTRA PATH NODES
							if(this.path.length > 1) this.path.splice(1);
							//  RE PATH
							this.rePath = 0;
						}
						
						//  COUNTDOWN ATTACK TIMER
						this.aTimer -= sT;
						//  IF OUR ATTACK TIMER IS READY AND WE HAVE STOPPED MOVING OR ARE A HORSE ARCHER
						if(this.aTimer <= 0
						&& ((this.mDir.x == 0
						&& this.mDir.y == 0)
						|| this.type == 'horseArcher')) {
							_i = 0;//this.aDamage;
							//  IF WE ARE CHARGING
							if(this.charged) {
								_i += this.aDamage;
								// console.log('charged')
							}
							//  MAKE SURE WE'RE FACING OUR TARGET
							_point.copy(this.aTarget.pos).sub(this.pos);
							this.facing = Math.round(_point.dir()/Math.PI*3)+3;

							//  ARE WE BEHIND OUR TARGET?
							_j = Math.abs(_point.dir()/Math.PI*3+3 - this.aTarget.facing);
							if(_j < 1.6
							|| _j > 4.6) {
								_i += this.aDamage;
								if(this.aTarget.shield < 2)
									_i += this.aDamage;
							//  IF WE ARE FACING THEM
							} else {
								//  IF THEY HAVE SPEARS, AREN'T MOVING, AND WE ARE CHARGING INTO THEM
								if(this.charged
								&& this.aTarget.type == 'spearmen'
								&& this.aTarget.mDir.x == 0
								&& this.aTarget.mDir.y == 0) {
									this.health -= this.aTarget.aDamage;
									// console.log('charged into spears!')
								}
								//  IF IT HAS A SHIELD AND WE HAVE ARROWS
								if((this.type == 'archer'
								|| this.type == 'horseArcher')
								&& this.aTarget.shield > 0) {
									_i += this.aDamage/Math.pow(2,this.aTarget.shield);
								} else _i += this.aDamage;
							}
							this.charged = false;

							// console.log(this.type,'ATTACKS! for '+ _i +'health.')

							//  APPLY DAMAGE
							this.aTarget.takeDamage(_i,this.attacks,this)

							//  RESET ATTACK TIMER
							this.aTimer = this.aSpeed;

							//  GETTING ANGLE TO SHOOT ARROW
							_point.copy(this.aTarget.pos).sub(this.pos);
							//  DIRECTION OF VECTOR, CORRECTED FOR THE GAME, AND FLIPPED IF THE VECTOR IS POINTING LEFT
							_j = _point.dir() - Math.PI/4 * (_point.x>0?1:-1);
							//  SHOOT ARROWS
							this.sprites.forEach( (s,i) => {
								switch(this.type) {
									case 'archer':
									case 'horseArcher':
										//  CREATE AN ARROW FOR EACH
										CreateArrow(this.pos.x+s.pos.x,
													this.pos.y+s.pos.y,
													this.aTarget.pos.x+s.pos.x/2,
													this.aTarget.pos.y+s.pos.y/2,
													this.pos.dist(this.aTarget.pos)*HEX_RADIUS+Math.random()*200,
													_j);
										//  SET TO ARROWLESS BOWS
										s.aTime = gameTime;
									break;
									case 'spearmen':
										if(i<4) s.aTime = gameTime;
									break;
									case 'knight':
										if(i<3) s.aTime = gameTime;
									break;
								};
							});
							//  NOISE
							if(this.type == 'archer'
							|| this.type == 'horseArcher')
								zzfx(...fxArrow);
							else zzfx(...fxStab);

						}
						if(!this.type == 'archer')
							this.running = false;

					//  IF WE ARE TOO FAR AWAY TO ATTACK, WE KEEP MOVING TOWARDS OUR ATTACK TARGET
					} else {

						// this.path.length = 0;
						if(HexPos(this.mTarget.x,this.mTarget.y).dist(this.aTarget.pos) > this.aDist) {
							this.mTarget.copy(this.aTarget.gridPos);
							this.rePath = 0;
						}
					}
				}
			//  IF WE DON'T HAVE AN ATTACK TARGET AND ARE MOTIONLESS
			} else {
				if(!this.isMoving()) {
					gameObjects.forEach( o => {
						if(this.team != o.team
						&& this.pos.dist(o.pos) < this.aDist) {
							this.aTarget = o;
						}
					})
				}
			}
			this.sprites.forEach( s => s.update(sT) );
		//  WE ARE ACTUALLY DEAD NOW
		} else {
			if(selected == this) {
				selected = undefined;
				litHexes.length = 0;
			}
			gameObjects.splice(gameObjects.indexOf(this),1);
		}
		
	};
	render() {

		C.ctx.save();
		
		//  HIGHLIGHT SELECTED AND DRAW A BIG PATH
		if(selected == this) {
			//  DEBUG HIGHLIGHT SELECTED UNIT
			C.ctx.fillStyle = 'rgba(128,128,256,0.5)';
			if(GAME_STATE == 0)
				DrawHex(C.ctx,this.pos.x+5,this.pos.y+5,HEX_RADIUS,true);
			else DrawHex(C.ctx,this.pos.x,this.pos.y,HEX_RADIUS,true);

			if(this.aTarget) {
				C.ctx.fillStyle = 'rgba(128,128,0,0.5)';
				DrawHex(C.ctx,this.aTarget.pos.x,this.aTarget.pos.y,HEX_RADIUS,true);			
			}

			C.ctx.fillStyle = 'rgba(0,0,128,1)';
			C.ctx.strokeStyle = 'rgba(0,0,128,0.5)';

			this.path.forEach( p => DrawHex(C.ctx,p.pos.x,p.pos.y,4,true) )
			C.ctx.save();
			C.ctx.lineWidth = HEX_RADIUS/4;
			C.ctx.beginPath();
			C.ctx.moveTo(this.pos.x,this.pos.y)
			this.path.forEach( p => C.ctx.lineTo(p.pos.x,p.pos.y) );
			C.ctx.stroke();
			C.ctx.restore();
		//  DRAW PATHS FOR ALL OTHER UNITS ON YOUR TEAM
		} else {
			if(this.type != 'horseArcher') {
				C.ctx.fillStyle = 'rgba(0,0,64,1)';
				C.ctx.strokeStyle = 'rgba(0,0,64,0.5)';
				this.path.forEach( p => DrawHex(C.ctx,p.pos.x,p.pos.y,3,true) )
				C.ctx.save();
				C.ctx.lineWidth = HEX_RADIUS/8;
				C.ctx.beginPath();
				C.ctx.moveTo(this.pos.x,this.pos.y)
				this.path.forEach( p => C.ctx.lineTo(p.pos.x,p.pos.y) );
				C.ctx.stroke();
				C.ctx.restore();
			}
		}

		


		//  ROTATE ABOUT CENTRES
		C.ctx.translate(this.pos.x-this.w/2,this.pos.y-this.h/2);

		if(GAME_STATE != 0) {
			//  DRAW HEALTH AND RUN METERS
			C.ctx.fillStyle = 'red';
			C.ctx.fillRect(-this.w/4,-this.h+2,this.w*1.5,4);
			// C.ctx.fillRec-this.w/4(0,0-5,this.w*1.5,5);
			// if(this.type == 'horseArcher')
				// C.ctx.fillStyle = 'yellow';
			// else
			C.ctx.fillStyle = 'green';
			C.ctx.fillRect(-this.w/4,-this.h+2,this.health/(this.units*10)*this.w*1.5,2);
			//  FLASHING RUN METER WHEN GETTING LOW
			if(selected == this
			&& this.run/this.runMax < 0.35
			&& Math.floor(this.run/100)%2 == 0)
				C.ctx.fillStyle = 'white';
			else C.ctx.fillStyle = 'blue';
			C.ctx.fillRect(-this.w/4,-this.h+4,this.run/this.runMax*this.w*1.5,2);

			//  DEBUG DRAW COLOUR FOR THIS OBJECT
			if(this.type == 'horseArcher')
				C.ctx.fillStyle = 'rgba(255,255,0,0.5)';
			else C.ctx.fillStyle = 'rgba(0,255,0,0.5)';

			DrawHex(C.ctx,this.w/2,this.h/2,HEX_RADIUS/3*2,true)
		}



		
		//  DEBUG DRAW RECT FOR THIS OBJECT
		// C.ctx.fillRect(this.pos.x,this.pos.y,this.w,this.h);
		_spritesToRender.length = 0;

		this.sprites.forEach( s => _spritesToRender.push(s) );
		_spritesToRender.sort((a,b) => a.pos.y - b.pos.y);
		_spritesToRender.forEach( s => {
			C.ctx.save();
			// C.ctx.rotate(0.1)
			if(GAME_STATE ==0
			&& CAN_PLAY > 1)
				C.ctx.translate(5,5)
			// if(this.mDir.x < 0) {
			//  FLIP IF FACING LEFT
			if(this.facing < 2
			|| this.facing > 4) {
				C.ctx.translate(this.w,0);
				C.ctx.scale(-1,1);
			}
			//  BOUNCE IF MOVING
			if(this.isMoving())
				s.render(0,Math.round(Math.random()));
			else s.render(0,0);
			// s.render(0,0);
			C.ctx.restore();
			// C.ctx.drawImage(spriteSheet,s.gridPos.x,s.gridPos.y,s.w,s.h,this.pos.x+s.pos.x,this.pos.y+s.pos.y,s.w,s.h)
		});
		//  DEBUG COLOUR AND FONT FOR DATA
		// C.ctx.fillStyle = 'red';
		// C.ctx.font = '8px futura';
		// //  DEBUG NOTE TYPE AND HEALTH OF THIS OBJECT
		// C.ctx.fillText(this.type,this.pos.x,this.pos.y-this.w/4);
		// C.ctx.font = '6px futura';
		// C.ctx.fillText(this.health,this.pos.x,this.pos.y+this.w/4);
		// C.ctx.fillText(Math.floor(this.run),this.pos.x,this.pos.y+this.w/2);

		//  DRAW CENTRE POING
		// C.ctx.fillStyle = 'red';
		// C.ctx.fillRect(-1+this.w/2,-1+this.h/2,2,2);
		
		C.ctx.restore();

		// //  DEBUG DRAW FACING ARROW
		// C.ctx.save();
		// C.ctx.translate(this.pos.x,this.pos.y);
		// //  DEBUG
		// //  ROTATION OF FACING ARROW
		// C.ctx.rotate(Math.PI/3 * this.facing - Math.PI);
		// //  DRAW FACING ARROW
		// C.ctx.beginPath();
		// C.ctx.moveTo(0,0);
		// C.ctx.lineTo(0+this.w/3,0);
		// C.ctx.lineTo(0+this.w/4,0+this.h/8);
		// C.ctx.lineTo(0+this.w/4,0-this.h/8);
		// C.ctx.lineTo(0+this.w/3,0);
		// C.ctx.closePath();
		// C.ctx.stroke();
		// C.ctx.restore();
	};
	touched() {
	};
	isMoving() {
		return this.mDir.x != 0 || this.mDir.y != 0;
	};
	//  DAMAGE, ATTACKS
	takeDamage(d,a,unit) {
		for(_i=0; _i<a; _i++) {
			if(!this.aTarget)
				this.aTarget = unit;
			//  ONLY KILL ONE UNIT AT A TIME, NO SPLASH DAMAGE
			_j = this.health % 10;
			if(_j == 0 || _j > d)
				this.health -= d ;
			else {
				this.health -= _j;
				//  REMOVE A SPRITE
				_hex = this.sprites.splice(this.sprites.length-1,1)[0];
				if(_hex) {
					// console.log(this.pos.x+_hex.pos.x,this.pos.y+_hex.pos.y,_hex.sx,_hex.sy,_hex.w,_hex.h)
					deadAndBlood.ctx.save();
					deadAndBlood.ctx.translate(this.pos.x+_hex.pos.x,this.pos.y+_hex.pos.y);
					deadAndBlood.ctx.rotate(Math.random()*Math.PI*2);
					deadAndBlood.ctx.globalAlpha = 0.8;
					deadAndBlood.ctx.drawImage(spriteSheet,_hex.sx,_hex.sy,_hex.w,_hex.h,0,0,_hex.w,_hex.h);
					deadAndBlood.ctx.fillStyle = 'rgba('+(Math.random()*64+196)+','+(Math.random()*20)+','+(Math.random()*10)+',0.6)';
					// deadAndBlood.ctx.fillStyle = 'red';
					// for(_x=0; _x<3; _x++) {
						deadAndBlood.ctx.beginPath();
						deadAndBlood.ctx.arc(this.w/2+(Math.random()*4+2),this.h/2+(Math.random()*4+2),(Math.random()*4+2),0,2*Math.PI);
						deadAndBlood.ctx.arc(this.w/2+(Math.random()*4+2),this.h/2+(Math.random()*4+2),(Math.random()*4+2),0,2*Math.PI);
						deadAndBlood.ctx.arc(this.w/2+(Math.random()*4+2),this.h/2+(Math.random()*4+2),(Math.random()*4+2),0,2*Math.PI);
						deadAndBlood.ctx.fill();
						deadAndBlood.ctx.restore();
					// }
				}

			}
		}
	};
};


//---------------------------------------//
//---------------TIMING------------------//
//---------------------------------------//
let paused = false,
    timePaused = 0,
    lastT = 0,
    deltaT = 0,
    simT = 1000/60,
    gameTime = 0,
    endTime = 0,
    Simulate = timeStamp => {
        if(!paused) {
            deltaT += timeStamp - lastT;
            lastT = timeStamp;

            // Begin(timeStamp);
            while(deltaT > simT) {
                deltaT -= simT;
                Update(simT);
                gameTime += simT;
            }
            Render();
        } else {
            deltaT += timeStamp - lastT;
            lastT = timeStamp;
            while(deltaT > simT) {
                deltaT -= simT;
                timePaused += simT;
            }
        }
        requestAnimationFrame(Simulate);
    },
//---------------------------------------//
//------------GAME FUNCTIONS-------------//
//---------------------------------------//
	GAME_STATE = 0,
	LEVEL = null,
	CAN_PLAY = 1,
	// Begin = tS => {
	// 	switch(GAME_STATE) {
	// 		case 0:
	// 		break;
	// 		case 1:
	// 		break;
	// 		case 2:
	// 		break;
	// 		case 3:
	// 		break;
	// 	}
	// },
	Update = sT => {
		switch(GAME_STATE) {
			case 0:
				// army.forEach( U => {
				// 	U.facing = 4
				// 	U.update();
				// });

			break;
			case 1:

				AI();
				gameObjects.forEach( o => o.update(sT));
				arrows.active.forEach( a => a.update(sT));
				//  IF OUT OF ENEMIES
				if(!endTime
				&& enemies.length == 0) {
					endTime = gameTime + 2000;
					if(!endMusicPlayed) {
						endMusicPlayed = true;
						zzfxP(...Victory);
					}
					CAN_PLAY += 1;
					if(CAN_PLAY == 2)
						startButton2.colour = 'blue';
					if(CAN_PLAY == 3)
						startButton3.colour = 'blue';
				}
				if(endTime
				&& gameTime > endTime)
					GAME_STATE = 2;
				//  OUT OF ARMY (YOU LOSE)
				if(army.length == 0) {
					zzfxP(...Defeat);
					endTime = gameTime + 2000;
					GAME_STATE = 3;
				}
			break;
			case 2:
				if(gameTime - endTime > 3000) {
					endTime = 0;
					GAME_STATE = 0;
					selected = undefined;
					army.forEach( U => {
						U.pos.copy(HexPos(U.oPos.x,U.oPos.y));
						U.aTarget = undefined;
						U.mDir.clear()
						U.mTarget.copy(U.oPos);
						U.gridPos.copy(U.oPos);
						U.path.length = 0;
						U.run = U.runMax;
						SpritesFaceDown();
					})
				}
			break;
			case 3:
				if(gameTime - endTime > 3000) {
					endTime = 0;
					GAME_STATE = 0;
					selected = undefined;
					army.forEach( U => {
						U.pos.copy(HexPos(U.oPos.x,U.oPos.y));
						U.aTarget = undefined;
						U.mDir.clear()
						U.mTarget.copy(U.oPos);
						U.gridPos.copy(U.oPos);
						U.path.length = 0;
						U.run = U.runMax;
						SpritesFaceDown();
					})
				}
			break;
		}
	},
	SpritesFaceDown = () => {
		army.forEach( U => {
			for(_i=0,_iL=U.sprites.length; _i<_iL; _i++) {
				//  SPEARMEN THAT ARE MARCHING POINT SPEARS UP
				switch(U.type) {
					case 'spearmen':
						U.sprites[_i].pos.x = spriteLocations[0][1][_i*2]-U.w-4;
						U.sprites[_i].pos.y = spriteLocations[0][1][_i*2+1]-U.h-4;
						
						//  LAST FOUR (FRONT ROW)
						if(_i < 4) U.sprites[_i].sx = 14;
						else U.sprites[_i].sx = 28;
					break;
					case 'archer':
						U.sprites[_i].pos.x = spriteLocations[0][1][_i*2]-U.w-4;
						U.sprites[_i].pos.y = spriteLocations[0][1][_i*2+1]-U.h-4;
						U.sprites[_i].sx = 0;
						U.sprites[_i].sy = 60;
					break;
					case 'knight':
						U.sprites[_i].pos.x = spriteLocations[1][0][_i*2]-U.w;
						U.sprites[_i].pos.y = spriteLocations[1][0][_i*2+1]-U.h-5;
						U.sprites[_i].sx = 0 + (_i<3?0:16);
						U.sprites[_i].sy = 88;
					break;
					case 'horseArcher':
						U.sprites[_i].pos.x = spriteLocations[1][0][_i*2]-U.w;
						U.sprites[_i].pos.y = spriteLocations[1][0][_i*2+1]-U.h-5;
						U.sprites[_i].sx = 0;
						U.sprites[_i].sy = 122;
					break;
				}
			}	
		})
		
	},
	Render = () => {
		C.ctx.clearRect(0,0,C.width,C.height);
		//  CLEAR SCREEN
		

		switch(GAME_STATE) {
			case 0:
				//  BG
				C.ctx.fillStyle = 'black';
				C.ctx.fillRect(0,0,C.width,C.height);

				//  RENDER MENU
				C.ctx.fillStyle = 'slategrey';
				menuObjects.forEach( o => {
					o.render()
				});

				// console.log(selected)

				C.ctx.fillStyle = 'red';
				C.ctx.font = innerWidth/10+'px Times New Roman';
				C.ctx.fillText('HEX CRUSADERS',innerWidth/2,innerHeight/4)
				
				C.ctx.save();
				C.ctx.scale(scale,scale);

				//  DRAW HEXES BEHIND ARMY
				hexPoints.forEach( h => {
					if(h._x > 6) {
						C.ctx.strokeStyle = 'rgba(51, 176, 37,0.2)';
						DrawHex(C.ctx,h.x,h.y);
					}
				})
				//  DRAW ARMY FOR REPOSITIONING
				C.ctx.translate(-5,-5)
				army.forEach( u => u.render() );
				C.ctx.restore();
				C.ctx.font = '16px futura';
				C.ctx.fillStyle = 'red';
				C.ctx.fillText('Click to reposition your army',innerWidth/2,innerHeight/8*5);
				//  DEBUG MOUSE POSITION
				// C.ctx.font = '16px futura';
				// C.ctx.fillStyle = 'red';
				// C.ctx.fillText('x:'+Math.floor(mouse.x)+'y:'+Math.floor(mouse.y),100,16);

				// C.ctx.save();
				// C.ctx.scale(4,4);
				// // C.ctx.drawImage(spriteSheet,0,0,512,512,0,0,512,512);
				// C.ctx.drawImage(spriteSheet,0,32,512,512,0,0,512,512);
				C.ctx.restore();

			break;
			case 1:
			case 2:
			case 3:
				//  BG
				C.ctx.fillStyle = levelData[LEVEL].bg;
				C.ctx.fillRect(0,0,C.width,C.height);

				C.ctx.save();
				C.ctx.strokeStyle = 'black';
				C.ctx.scale(scale,scale);

				//  DEBUG DRAW HEX GRID, HEX POINTS, AND HEX BUCKETS
				// if(DEBUG) {
				// 	// DrawHexBuckets();
				// 	DebugHexGrid(C.ctx,GRID_SIZE);
				// }
				DrawHexGrid();

				//  DRAW BLOOD AND DEAD
				C.ctx.drawImage(deadAndBlood,0,0,innerWidth,innerHeight);
				
					

				//  DEBUG DRAW HEX CLICKED ON
				// C.ctx.fillStyle = 'green';
				// DrawHex(C.ctx,DebugHex.x,DebugHex.y,HEX_RADIUS,true);

				//  DEBUG MOUSE POSITION
				// C.ctx.font = '16px futura';
				// C.ctx.fillStyle = 'red';
				// C.ctx.fillText('x:'+Math.floor(mouse.x)+'y:'+Math.floor(mouse.y),100,16)

				//  DRAW LIT HEXES
				if(litHexes.length > 0) {
					litHexes.forEach( h => {
						C.ctx.fillStyle = 'rgba(0,255,0,0.5)';
						DrawHex(C.ctx,h.pos.x,h.pos.y,HEX_RADIUS,true);
					})
				}
				
				//  RENDER GAME OBJECTs
				gameObjects.forEach( o => o.render());

				//  RENDER ARROWS
				arrows.active.forEach( a => a.render(0,0));

				// DrawHexPoints();

				C.ctx.restore();

				//  RENDER UI
				
			// break;
				uiObjects.forEach( o => {
					C.ctx.fillStyle = 'grey';
					o.render();
				});
			
				// 
				if(GAME_STATE == 2) {
					C.ctx.fillStyle = 'rgba(0,0,0,0.5)';
					C.ctx.fillRect(0,innerHeight/3,innerWidth,innerHeight/3);
					C.ctx.font = innerHeight/4+'px Times New Roman';
					C.ctx.fillStyle = 'red';
					C.ctx.fillText('VICTORY!',innerWidth/2,innerHeight/2+innerHeight*0.08)
				}
				// break;
				// case 3:
				else if(GAME_STATE == 3) {
					C.ctx.fillStyle = 'rgba(0,0,0,0.5)';
					C.ctx.fillRect(0,innerHeight/3,innerWidth,innerHeight/3);
					C.ctx.font = innerHeight/4+'px Times New Roman';
					C.ctx.fillStyle = 'red';
					C.ctx.fillText('DEFEAT!',innerWidth/2,innerHeight/2+innerHeight*0.08)
				}

			break;
		}
	},
	StartGame = (level) => {
		gameObjects.length = 0;
		litHexes.length = 0;
		selected = undefined;
		// console.log('start game')
		// if(introPlaying)
			// toggleIntro.touched();
		endMusicPlayed = false;
		LEVEL = level;
		GAME_STATE = 1;
		deadAndBlood.ctx.clearRect(0,0,innerWidth,innerHeight);
		// if(LEVEL == 0) {
			//  FULL RESET ON LEVEL 0
			// army.length = 0;
			// CAN_PLAY = 1;
		// }
			
			
		// } else {
			army.forEach( U => {
				U.pos.copy(HexPos(U.oPos.x,U.oPos.y));
				U.aTarget = undefined;
		U.mDir.clear()
				U.mTarget.copy(U.oPos);
				U.gridPos.copy(U.oPos);
				U.path.length = 0;
				U.facing = 2;
				gameObjects.push(U);
			})
		// };
		enemies.length = 0;
		levelData[LEVEL].enemies.forEach( u => {
			let U = new Obj(HexPos(u[0],u[1]),14,14,u[2],u[3]);
			U.team = 1;
			gameObjects.push(U);
			enemies.push(U);
		});
		hexGrid.forEach( y => {
			y.forEach( x => {
				x.unit = undefined;
			})
		})

		// let OBJ = new Obj(HexPos(1,1),16,16,'knight');
		// OBJ.colour = 'pink';
		// // OBJ.team = 1;
		// gameObjects.push(OBJ);
		// let OBJ2 = new Obj(HexPos(2,2),16,16,'archer');
		// OBJ2.gridPos.copy(PointToHex(OBJ2.pos));
		// OBJ2.mTarget.copy(OBJ2.gridPos);
		// OBJ2.colour = 'hotpink';
		// gameObjects.push((OBJ2));
		// let OBJ3 = new Obj(HexPos(3,5),16,16,'spearmen');
		// OBJ3.gridPos.copy(PointToHex(OBJ3.pos));
		// OBJ3.mTarget.copy(OBJ3.gridPos);
		// OBJ3.colour = 'lightpink';
		// OBJ3.team = 1
		// gameObjects.push((OBJ3));
		// let OBJ4 = new Obj(HexPos(4,2),16,16,'horseArcher');
		// OBJ4.gridPos.copy(PointToHex(OBJ4.pos));
		// OBJ4.mTarget.copy(OBJ4.gridPos);
		// OBJ4.colour = 'blue';
		// OBJ4.team = 1;
		// gameObjects.push((OBJ4));


		
		
		
	},
	
	enemies = [],
	levelData = [
		{
			bg:'lightgreen',
			army: [
				[8,2,'knight',2],[8,1,'knight',2],//[9,1,'knight',2],
				[8,3,'archer',2],[9,2,'archer',2],
				[8,4,'spearmen',2],[8,5,'spearmen',2],[9,3,'spearmen',2],[9,5,'spearmen',2],[9,4,'spearmen',2],
				[8,6,'archer',2],[9,6,'archer',2],
				[8,7,'knight',2],[8,8,'knight',2],//[9,7,'knight',2],
			],
			enemies: [
				[1,1,'horseArcher',5],[1,2,'horseArcher',5],[1,4,'horseArcher',5],[1,5,'horseArcher',5],[1,7,'horseArcher',5],[1,8,'horseArcher',5],
				// [1,1,'horseArcher',5],[1,4,'horseArcher',5],[1,5,'horseArcher',5],[1,8,'horseArcher',5],
				// [0,0,'horseArcher',5],[0,2,'horseArcher',5],[0,4,'horseArcher',5],[0,5,'horseArcher',5],[0,7,'horseArcher',5],[0,9,'horseArcher',5],
				// [2,1,'horseArcher',5],[2,2,'horseArcher',5],[2,3,'horseArcher',5],[2,4,'horseArcher',5],
				// [2,5,'horseArcher',5],[2,6,'horseArcher',5],[2,7,'horseArcher',5],[2,8,'horseArcher',5],
				// [0,1,'horseArcher',5],[0,3,'horseArcher',5],[0,4,'horseArcher',5],
				// [0,5,'horseArcher',5],[0,6,'horseArcher',5],[0,8,'horseArcher',5],
			]
		},
		{
			bg:'lightblue',
			enemies: [
				[1,1,'horseArcher',5],[1,2,'horseArcher',5],[1,3,'horseArcher',5],[1,4,'horseArcher',5],[1,5,'horseArcher',5],[1,6,'horseArcher',5],[1,7,'horseArcher',5],[1,8,'horseArcher',5],
			]
		},
		{
			bg:'orange',
			enemies: [
				[1,0,'horseArcher',5],[1,1,'horseArcher',5],[1,2,'horseArcher',5],[1,3,'horseArcher',5],[1,4,'horseArcher',5],[1,5,'horseArcher',5],[1,6,'horseArcher',5],[1,7,'horseArcher',5],[1,8,'horseArcher',5],[1,9,'horseArcher',5],
				// [1,1,'horseArcher',5],[1,2,'horseArcher',5],[1,3,'horseArcher',5],[1,4,'horseArcher',5],[1,5,'horseArcher',5],[1,6,'horseArcher',5],[1,7,'horseArcher',5],[1,8,'horseArcher',5]

			]
		},
	],
	AI = () => {
		enemies.forEach( e => {
			if(e.aTarget) {
				if(e.mDir.x == 0
				&& e.mDir.y == 0) {
					// e.aTarget = undefined;
					// e.mTarget.clear();
					e.mTarget.copy(e.aTarget.gridPos)
					// console.log(e.id,'stopped',e.mTarget)
				};
				if(e.aTarget.dead) {
					e.aTarget = undefined;
					e.mTarget.clear();
					e.rePath = 0;
				}
			}
			_current = army[0];
			if(e && _current) {
				_lowest = e.pos.dist(_current.pos);

				if(army.length > 1) {
					for(_i=1; _i<army.length; _i++) {
						if(e.pos.dist(army[_i].pos) < _lowest) {
							_lowest = e.pos.dist(army[_i].pos);
							_current = army[_i];
						}
					}
				}
				e.aTarget = _current;
			}
		})
		
	},

//---------------------------------------//
//-----------REUSABLE VARIABLES----------//
//---------------------------------------//
	_i,_iL,_j,_jL,
	_x,_y,_z,
	_touched = false,
	_point = new Vec(),
	_hex,
	_cell,
	_string,
	DebugHex = new Vec(),
	_spritesToRender = [],

//---------------------------------------//
//--------------"CONSTANTS"--------------//
//---------------------------------------//
	HEX_RADIUS = 16,
	DEBUG = true,
	GRID_OFFSET = new Vec(24,24),
	// GRID_SIZE = new Vec(10,10),
	HEX_BUCKET_RATIO = 2.5,
	scale,
	
//---------------------------------------//
//---------------CONTROLS----------------//
//---------------------------------------//
	selected = null,
	mouse = new Vec(),
	// mouseStart = new Vec(),
	click1 = 0,
	click2 = 0,
	// mousePressed = false,
	InitControls = () => {
		addEventListener('mousemove',MouseHandler,false);
        addEventListener('mousedown',MouseHandler,false);
        addEventListener('mouseup',MouseHandler,false);

        addEventListener('touchstart',MouseHandler,false);
        addEventListener('touchend',MouseHandler,false);
        addEventListener('touchmove',MouseHandler,false);
	},
	SetMouse = (x,y) => {
		mouse.x = x;
		mouse.y = y;
	},
	MouseHandler = e => {
		
		switch(e.type) {
			case 'mousedown':
			case 'touchstart':
		     	switch(GAME_STATE) {
					case 0:
						if(e.touches && e.touches[0])
							SetMouse(e.touches[0].clientX,e.touches[0].clientY);
				        else SetMouse(e.clientX,e.clientY);
					break;
					case 1:
						//  UPDATE mouse DATA WITH scale ACCOUNTED FOR
						if(e.touches && e.touches[0])
							SetMouse(e.touches[0].clientX/scale,e.touches[0].clientY/scale);
						else SetMouse(e.clientX/scale,e.clientY/scale);
					break;
					case 2:
					break;
					case 3:
					break;
				}
				//  CHECK FOR DOUBLE TAP ON MOBILE AND DESKTOP
				if(gameTime - click1 < 300)
					TouchObjects(mouse,true);
				else TouchObjects(mouse);
				click1 = gameTime;
				// mouseStart.copy(mouse);
	        break;
	        case 'mousemove':
	        case 'touchmove':
				switch(GAME_STATE) {
					case 0:
						if(e.touches && e.touches[0])
							SetMouse(e.touches[0].clientX,e.touches[0].clientY);
				        else SetMouse(e.clientX,e.clientY);
					break;
					case 1:
						//  UPDATE mouse DATA WITH scale ACCOUNTED FOR
						if(e.touches && e.touches[0])
							SetMouse(e.touches[0].clientX/scale,e.touches[0].clientY/scale);
						else SetMouse(e.clientX/scale,e.clientY/scale);
					break;
					case 2:
					break;
					case 3:
					break;
				};
	        break;
	   //      case 'mouseup':
	   //      case 'touchend':
				// mousePressed = false;
	   //      break;
	    }

	},
	//  PUT HEX POINT INTO A HEX BUCKET
	HexToBucket = (p,bucket) => {
		hexBuckets[Math.floor(bucket.x/(HEX_RADIUS*HEX_BUCKET_RATIO))][Math.floor(bucket.y/(HEX_RADIUS*HEX_BUCKET_RATIO))].push(p)
	},
	_rHex = new Vec(),
	//  FIND CLOSEST HEX CENTRE POINT
	PointToHex = p => {
		// _rHex.gridPos.clear();
		//  LARGE NUMBER BECAUSE WE ARE LOOKING FOR THE SMALLEST
		_point.copy({x:10000,y:10000});
		//  FOR EACH HEX THAT OVERLAPS THIS HEX BUCKET
		hexBuckets[Math.floor(p.x/(HEX_RADIUS*HEX_BUCKET_RATIO))][Math.floor(p.y/(HEX_RADIUS*HEX_BUCKET_RATIO))].forEach(point => {
			//  KEEP THE SHORTER DISTANCE
			if(p.dist(point) < p.dist(_point)) {
				_point.copy(point);
				_rHex.x = point._x;
				_rHex.y = point._y;
			}
		});

		return _rHex;
	},
	PointCollide = (p,o) => {
		// if(o.type == 'knight')
			// console.log(p,o.pos)
		if(p.x > o.pos.x - o.w/2
		&& p.x < o.pos.x + o.w/2
		&& p.y > o.pos.y - o.h/2
		&& p.y < o.pos.y + o.h/2)
			return true;			
		return false;
	},
	//  MENU BUTTONS
	menuObjects = [],
	uiObjects = [],
	gameObjects = [],
	litHexes = [],
	TouchObjects = (p,dbl) => {
		_touched = false;
		switch(GAME_STATE) {
			case 0:
				_touched = false;
				menuObjects.forEach( o => {
					if(PointCollide(p,o)) {
						o.touched();
						_touched = true;
					}
				});

				// _hex = PointToHex(p);
				// console.log(_hex)
				if(!_touched) {
					// _hex = null;
					_point.copy(p).scale(1/scale);
					_current = hexPoints[0];
					_lowest = _lowest = _point.dist(hexPoints[0]);
					_lowest = 10000;
					//  FIND WHICH HEX POINT (BELOW 6) IS CLOSEST
					hexPoints.forEach( (h,i) => {
						if(h._x > 6) {
							if(_point.dist(h) < _lowest) {
								_current = h;
								_lowest = _point.dist(h);
							}
						}
					});
					_hex = _current;
					//  FIND WHICH UNIT THAT IS CLOSEST TO
					army.forEach((u,i) => {
						if(!i) {
							_current = u;
							_lowest = u.pos.dist(_hex);
						} else if (u.pos.dist(_hex) < _lowest) {
							_current = u;
							_lowest = u.pos.dist(_hex);
						}
					})
					// console.log(_lowest,HEX_RADIUS)
					//  CLICKED A UNIT
					if(_lowest <= HEX_RADIUS) {
						if(selected == _current)
							selected = undefined;
						else if(!selected) {
							selected = _current;
						} else if(selected) {
							_point.copy(selected.pos);
							selected.pos.copy(_current.pos);
							_current.pos.copy(_point);
							
							_point.copy(selected.oPos);
							selected.oPos.copy(_current.oPos);
							_current.oPos.copy(_point);

							selected = undefined;
						}
					// CLICKED AN EMPTY HEX
					} else {
						if(selected) {
							// console.log(_hex)
							selected.pos.x = _hex.x;
							selected.pos.y = _hex.y;
							selected.oPos.x = _hex._x;
							selected.oPos.y = _hex._y;
							selected = undefined;

						}

					}

					//  SWITCH POSITIONS
					// if(!selected)
					// 	selected = _current;
					// else {
					// 	if(selected == _current)
					// 		selected = undefined;
					// 	else {
					// 		_point.copy(selected.pos);
					// 		selected.pos.copy(_current.pos);
					// 		_current.pos.copy(_point);
							
					// 		_point.copy(selected.oPos);
					// 		selected.oPos.copy(_current.oPos);
					// 		_current.oPos.copy(_point);

					// 		selected = undefined;
					// 	}

					// }
				}
				
			break;
			case 1:
				_hex = PointToHex(p);
				//  IF THERE ARE LIT HEXES
				if(litHexes.length > 0) {

					//  IS THE TOUCH INSIDE ONE OF THEM
					litHexes.forEach( h => {
						if(_hex.x == h.gridPos.x
						&& _hex.y == h.gridPos.y) {
							if(h.unit
							&& h.unit.team != selected.team) {
								selected.aTarget = h.unit;
							} else {
								_touched = true;
								selected.willFace = h;
								litHexes.length = 0;	
							}
							
						}
					})
				}
				//  CHECK FOR TOUCHES WITH UI
				if(!_touched) {
					uiObjects.forEach( o => {
						if(o == toggleIntro) {
							if(PointCollide(p,{pos:{x:o.pos.x/scale,y:o.pos.y/scale},w:o.w/scale,h:o.h/scale})) {
								o.touched()
								_touched = true;	
							}
						} else {
							if(PointCollide(p,{pos:{x:o.pos.x/scale +o.w/2/scale,y:o.pos.y/scale +o.h/2/scale},w:o.w/scale,h:o.h/scale})) {
								o.touched()
								_touched = true;
							}	
						}
						
					});
				}

				if(!_touched) {

					//  CHECK FOR TOUCHES WITH GAME OBJECTS
					gameObjects.forEach( o =>  {
						if(PointCollide(p,o)) {
							if(dbl && !o.team)
								selected = o;
							if(selected) {
								//  DESELECT IF THIS IS THE SELECTED OBJECT
								if(selected == o) {
									if(dbl) {
										selected.mTarget.copy(selected.gridPos)
										selected.rePath = 0;
									//  OPTION TO CHOOSE FACING DIRECTION
										litHexes.length = 0;
										o.hex.neighbours.forEach( n => {
											
											litHexes.push(n)
										})
									} else selected = null;
								}
								//  IF TOUCHING AN OBJECT THAT ISN'T THE ONE SELECTED
								else {
									//  SELECT A TEAM MATE
									if(o.team == selected.team)
										selected = o;
									//  ATTACK AN ENEMY
									else selected.aTarget = o;
									litHexes.length = 0;
								}
							} else {
								//  SELECT THIS OBJECT IF NOT ALREADY SELECTED
								if(!o.team)
									selected = o;
							}
							_touched = true;
							
						}
					})
				}
				//  CHECK FOR HEX TOUCHES IF NECESSARY
				if(!_touched) {
					//  GET GRID POSITION OF TOUCH
					_cell = hexGrid[_hex.x][_hex.y];

					//  IF A UNIT IS SELECTED, WE ARE LOOKING FOR A MOVE OR DIRECTION POINT
					if(selected) {
						if(_cell.unit != undefined) {
							if(!_cell.unit.team)
								selected = _cell.unit;
							else selected.aTarget = _cell.unit;
						}
						//  CANCEL ANY ATTACK TARGETS
						selected.aTarget = undefined;
						
						if(!_touched) {
							//  SET NEW MOVE TARGET
							selected.mTarget.copy(_hex);
							// selected.mTarget.copy(PointToHex(p))
							//  IMMEDIATELY REPATH
							selected.rePath = 0;
							//  OPTION TO CHOOSE FACING DIRECTION
							litHexes.length = 0;
							hexGrid[_hex.x][_hex.y].neighbours.forEach( n => {
								litHexes.push(n)
							})
						}
					//  NOTHIGN SELECTED
					} else {
						//  THERE IS A UNIT ON THE CELL WE TOUCHED
						if(_cell.unit != undefined
						&& !_cell.unit.team)
							selected = _cell.unit;
					}
				};
				
			break;
			case 2:
			break;
			case 3:
			break;
		}
	},
	openSet = [],
	closedSet = [],
	_lowest,
	_current,
	_g,
	manhatten = (p1,p2) => {
		return Math.abs(p2.pos.x-p1.pos.x) + Math.abs(p2.pos.y-p1.pos.y)
	},
	FindPath = (start,end,path,unit) => {
		path.length = 0;
		hexGrid.forEach( row => {
			row.forEach( cell => {
				cell.parent = null;
				cell.g = 0;
				if(cell.unit
				&& cell.unit != selected)
					cell.g = 100;
			})
		})

		openSet.length = 0;
		closedSet.length = 0;
		openSet.push(hexGrid[start.x][start.y]);
		while(openSet.length > 0) {

			//  INDEX IN openSet WITH SHORTEST PREDICTED DISTANCE FROM start TO HERE
			_lowest = 0;
			//  CHECK IF ANY OTHER INDEX IN OPEN SET HAS A SMALLER .f
			for(_i=0,_iL=openSet.length; _i<_iL; _i++) {
				if(openSet[_i].f < openSet[_lowest].f)
					_lowest = _i
			}
			//  THE SHORTEST PATH SO FAR
			_current = openSet[_lowest];

			//  ARE WE DONE?
			if(_current.gridPos.x == end.x
			&& _current.gridPos.y == end.y) {
			

				//  MOVE UP THE CHAIN OF PARENTS AND ADD THEM TO THE PATH
				_cell = _current;

				path.push(_cell);

				while(_cell.parent) {
					path.push(_cell.parent);
					_cell = _cell.parent;
				}
				return path.reverse();
			}

			//  IF WE AREN'T DONE
			//  MOVE THIS HEX TO closedSet
			openSet.splice(_lowest,1);
			closedSet.push(_current);

			//  CHECK IT'S NEIGHBOURS
			for(_i=0,_iL=_current.neighbours.length; _i<_iL; _i++) {
				_cell = _current.neighbours[_i];

				//  IF THE NEIGHBOUR n ISN'T ALREADY IN closedSet, IT HASN'T BEEN CHECKED
				if(!closedSet.includes(_cell)) {
					if(_cell.unit
					&& ((unit.aTarget
					&& _cell.unit != unit.aTarget)))
					// || (_cell.unit.team == unit.team)))
						continue;
					//  COST OF THE NEIGHBOUR IS THE COST OF THIS PLUS ONE
					_g = _current.g + 1;

					//  IF IT ISN'T IN openSet, ADD IT
					if(!openSet.includes(_cell)) {
						openSet.push(_cell);
					}
					//  OR continue IF IT'S PATH SO FAR IS BIGGER or something.......

					else if(_g >= _cell.g) {
						continue;
					}
					
					_cell.g += _g;
					_cell.h = manhatten(_cell,hexGrid[end.x][end.y]);
					_cell.f = _cell.g + _cell.h;
					_cell.parent = _current;
				}
			}
		}
		return [];
	},
//---------------------------------------//
//---------------FUNCTIONS---------------//
//---------------------------------------//
	Canvas = (w,h) => {
	    let cnv = document.createElement('canvas');
	    cnv.ctx = cnv.getContext('2d');
	    cnv.width = w;
	    cnv.height = h;
	    cnv.ctx.imageSmoothingEnabled = false;
	    return cnv;
	},
	// DrawCircle = (ctx,x,y,r) => {
	// 	ctx.beginPath();
	// 	ctx.arc(x,y,r,0,2*Math.PI);
	// 	ctx.stroke();
	// },
	a = Math.PI/3,
	DrawHex = (ctx, x, y, r=HEX_RADIUS, fill=false) => {
		ctx.beginPath();
		
		for (var i = 0; i < 6; i++)
			ctx.lineTo(x + r * Math.cos(a * i + a/2), y + r * Math.sin(a * i + a/2));
		ctx.closePath();
		ctx.stroke();
		if(fill)
			ctx.fill();
	},
	// DebugHexGrid = (ctx,size) => {
	// 	for(_x=0; _x<size.x; _x++) {
	// 		for(_y=0; _y<size.y; _y++) {
	// 			_point.y = GRID_OFFSET.x+_x*HEX_RADIUS+Math.cos(a)*_x*HEX_RADIUS;
	// 			_point.x = GRID_OFFSET.y+_y*HEX_RADIUS+(Math.sin(a)-0.1)*_y*HEX_RADIUS+_x%2*Math.sin(a)*HEX_RADIUS;
	// 			DrawHex(ctx,_point.x,_point.y);
	// 		}
	// 	}	
	// },
	DrawHexPoints = () => {
		hexPoints.forEach( p => {
			DrawCircle(C.ctx,p.x,p.y,1);
			C.ctx.fillStyle = 'black';
			C.ctx.font = '8px futura';
			// C.ctx.fillText(('x:'+Math.floor(p.x)),p.x-HEX_RADIUS*0.5,p.y);
			// C.ctx.fillText(('y:'+Math.floor(p.y)),p.x-HEX_RADIUS*0.5,p.y+8);
			let gP = new Vec();
			gP.copy(PointToHex(p));
			let hx = hexGrid[gP.x][gP.y];
			C.ctx.fillText('g:'+hx.g,p.x,p.y+HEX_RADIUS/2);
		})
	},
	// DrawHexBuckets = (offX=100,offY=100) => {
	// 	hexBuckets.forEach((bX,i) => {
	// 		bX.forEach((bY,j) => {
	// 			C.ctx.strokeRect(i*HEX_RADIUS*HEX_BUCKET_RATIO,j*HEX_RADIUS*HEX_BUCKET_RATIO,HEX_RADIUS*HEX_BUCKET_RATIO,HEX_RADIUS*HEX_BUCKET_RATIO);
	// 		})
	// 	})
	// },
	//  CENTER POINTS OF HEXES FOR COLLISION DETECTION
	hexPoints = [],
	//  BROAD PHASE COLLISION DETECTION
	hexBuckets = [],
	//  CELL GRID FOR PATH FINDING
	hexGrid = [],
	//  NEIGHBOURS OF A HEX CELL FOR PATHFINDING
	hexNeighbours = [
		{x:-1,y:0},{x:1,y:0},{x:0,y:-1},
		{x:0,y:1}
	],
	//  THESE ONES NEED TO BE INVERSED FOR EVERY OTHER ROW, apparently....
	hexNeighbours2 = [
		{x:-1,y:1},{x:1,y:1}
	],
	
	PrepareGrid = (ctx,w,h) => {
		//  SET SCALE
		_x = innerWidth/(w*HEX_RADIUS*2);
		_y = innerHeight/(h*HEX_RADIUS*2)*1.2;
		// GRID_OFFSET.x = _x > _y ? 0 : (innerWidth-w*HEX_RADIUS/2)/2;

		
		scale = Math.min(_x,_y);
		if(_x > _y)
			GRID_OFFSET.y = Math.max((innerWidth-w*HEX_RADIUS*2*scale)/4,24);
		else GRID_OFFSET.x = Math.max((innerHeight-h*HEX_RADIUS*2*scale)/2,24);

		//  INIT HEX BUCKETS
		for(_x=0; _x<innerWidth/(HEX_RADIUS*HEX_BUCKET_RATIO); _x++) {
			hexBuckets.push([]);
			for(_y=0; _y<innerHeight/(HEX_RADIUS*HEX_BUCKET_RATIO); _y++) {
				hexBuckets[_x].push([]);
			}
		};
		//  FIND HEX POINTS
		for(_x=0; _x<w; _x++) {
			hexGrid.push([]);
			for(_y=0; _y<h; _y++) {
				//  CAN'T USE _point OR THEY WILL ALL HAVE THE SAME LOCATION
				//  THIS ONLY HAPPENS ONCE SO IT IS NOT BAD FOR MEMORY
				let point = new Vec();
				//  CENTER POINT
				point.y = GRID_OFFSET.x+_x*HEX_RADIUS+Math.cos(a)*_x*HEX_RADIUS;
				point.x = GRID_OFFSET.y+_y*HEX_RADIUS+(Math.sin(a)-0.1)*_y*HEX_RADIUS+_x%2*Math.sin(a)*HEX_RADIUS;
				hexPoints.push(point);
				//  HEX GRID OBJECTS FOR PATHFINDING (WHILE WE'RE HERE)
				let hex = new Obj(point,0,0);
				hex.gridPos.x = _x;
				hex.gridPos.y = _y;
				//  ESTIMATED TOTAL DISTANCE
				hex.f = 0;
				//  DISTANCE TRAVELLED SO FAR
				hex.g = 0;
				//  HEURISTIC, ESTIMATE OF DISTANCE TO END
				hex.h = 0;
				//  HEXES NEIGBOURING THIS ONE FOR PATHFINDING, WILL BE FILLED LATER
				hex.neighbours = [];
				//  FOR PATHFINDING, FILLED WHEN SEARCHING FOR A PATH
				hex.parent = undefined;
				//  THE UNIT(S) CURRENTLY STANDING ON THIS HEX
				hex.unit = undefined;
				//  PUT THIS HEX IN THE GRID
				hexGrid[_x][_y] = hex;

				//  HEX gridPos, NEEDED FOR PATHFINDING
				point._x = _x;
				point._y = _y;
				
				//  BOUNDING BOX POINTS TO PROPERLY UTILIZE THE HEX BUCKETS
				HexToBucket(point,{x:point.x + HEX_RADIUS * Math.cos(a * 0 + a/2),y:point.y+HEX_RADIUS});
				HexToBucket(point,{x:point.x + HEX_RADIUS * Math.cos(a * 2 + a/2),y:point.y+HEX_RADIUS});
				HexToBucket(point,{x:point.x + HEX_RADIUS * Math.cos(a * 0 + a/2),y:point.y-HEX_RADIUS});
				HexToBucket(point,{x:point.x + HEX_RADIUS * Math.cos(a * 2 + a/2),y:point.y-HEX_RADIUS});
			}
		};

		//  FIND HEX NEIGHBOURS
		for(_x=0; _x<hexGrid.length; _x++) {
			for(_y=0; _y<hexGrid[_x].length; _y++) {
				_hex = hexGrid[_x][_y];
				hexNeighbours.forEach( n => {
					if(hexGrid[n.x+_x]
					&& hexGrid[n.x+_x][n.y+_y]) {
						_hex.neighbours.push(hexGrid[n.x+_x][n.y+_y])
					}
				});
				hexNeighbours2.forEach( n => {
					if(_x%2 == 0)
						_z = -1;
					else _z = 1;
					if(hexGrid[_z*n.x+_x]
					&& hexGrid[_z*n.x+_x][_z*n.y+_y]) {
						_hex.neighbours.push(hexGrid[_z*n.x+_x][_z*n.y+_y])
					}
				});
			}
		};
	},
	HexPos = (x,y) => {
		return hexGrid[x][y].pos;
	},

	graphs = [
		//  ZEROETH GRAPH
		//  SOLDIER BODY
		[[0,0,1],
		 [1,1,1],
		 [2,2,2],
		 [0,1,1],
		 [2,2,2],
		 [2,3,3],
		 [4,6,5],
		 [4,6,5]],
		//  FIRST GRAPH
		//  SPEAR 2A (ROTATED FOR VERTICAL SPEAR)
		[[ , , , , , , , ,0, ],
		 [2,2,2,2,2,2,2,2,1,1]],
		//  INDEX 2 - SPEAR 2B
		[[ , , , , , , ,0,1],
		 [ , , , , , , ,1, ],
		 [ , , , , , ,2, , ],
		 [ , , , , ,2, , , ],
		 [ , , , ,2, , , , ],
		 [ , , ,2, , , , , ],
		 [ , ,2, , , , , , ],
		 [ ,2, , , , , , , ],
		 [2, , , , , , , , ]],
		// INDEX 3 - SPEAR 3A (ROTATED FOR 1B)
		[[2, , , , , , , , ],
		 [ ,2,2, , , , , , ],
		 [ , , ,2, , , , , ],
		 [ , , , ,2,2, , , ],
		 [ , , , , , ,2, , ],
		 [ , , , , , , ,1,0],
		 [ , , , , , , , ,1]],
		//  INDEX 4 - SPEAR 3B
		[[ , , , , , , , , ,0,0],
		 [ , , , , , , , , ,1, ],
		 [ , , , , , , ,2,2, , ],
		 [ , , , , , ,2, , , , ],
		 [ , , , ,2,2, , , , , ],
		 [ , , ,2, , , , , , , ],
		 [ ,2,2, , , , , , , , ],
		 [2, , , , , , , , , , ]],
		//  INDEX 5 - SPEAR 1B
		[[ , , ,0],
		 [ , ,1,1],
		 [ , , ,2],
		 [ , ,2, ],
		 [ , ,2, ],
		 [ ,2, , ],
		 [ ,2, , ],
		 [2, , , ],
		 [2, , , ]],
		//  INDEX 6 - CRUSADER SHIELD
		[[0,1,0],
		 [1,1,1],
		 [2,1,2],
		 [ ,3, ]],
		//  INDEX 7 - CRUSADER EYE SLITS P1
		[[0,1,2],
		 [ ,1, ]],
		//  INDEX 8 - CRUSADER EYE SLITS P2
		// [[0]],
		//  INDEX 8 - ARROW
		[[0,0,0,1]],
		//  INDEX 9 - BOW C (AND A ROTATED)
		[[1, , ,0],
		 [ ,1, ,0],
		 [ , ,3, ],
		 [0,0, ,2]],
		//  INDEX 10 - BOW B
		[[ ,0, , ],
		 [ , ,0, ],
		 [1,1,3,2],
		 [ , ,0, ],
		 [ ,0, , ]],
		//  INDEX 11 - FACES
		[[0,0,0],
		 [1,1,1]],
		//  INDEX 12 - HORSEY A
		[[ , , , , , ],
		 [ , , , , , ],
		 [ , ,0,0,0,0],
		 [ ,0,1,1,1,1],
		 [ ,1,1,1,1,1],
		 [1, ,1,2,1,1],
		 [ , ,1, ,2,2],
		 [ , ,1, ,4, ],
		 [ , ,4, , , ],
		 [ , , , , , ]],
		//  INDEX 13 - HORSEY A
		[[ ,1,0,1, ],
		 [0,1,3,1,3],
		 [1,1,1,0,0],
		 [1,1,1,1,1],
		 [1,2,2, , ],
		 [1,1,1, , ],
		 [1,2,2, , ],
		 [1, ,1, , ],
		 [1, ,4, , ],
		 [4, , , , ]],
		//  INDEX 14 - HORSEY B
		[[ , , , , , , , ,0, , ],
		 [ , , , , , , ,0,1,3,0],
		 [ , , , , , ,0,1,2,2,1],
		 [ , ,0,0,0,0,1,1,2, , ],
		 [ ,0,1,1,1,1,1,1,1, , ],
		 [0, ,1,2,1,1,1,2,1, , ],
		 [1, ,1, ,2,2,2,2,1, , ],
		 [1, ,1, , , , , ,1, , ],
		 [ , ,4, , , , , ,4, , ]],
		 //  INDEX 15 - HORSEY C
		[[ , , , , ,1,0,1, , ],
		 [ , , , , ,0,1,1,3, ],
		 [ , ,0,0,0,1,1,1,1,0],
		 [ ,0,1,1,1,1,1,2,1,1],
		 [ ,0,1,1,1,1,1,1, , ],
		 [0,1,2,1,2,1,2,1, , ],
		 [ ,1,2,1, ,2,2,1, , ],
		 [ ,1, ,1, ,4, ,1, , ],
		 [ ,4, ,1, , , ,4, , ],
		 [ , , ,4, , , , , , ]]
	],
	colours = [
		// GREYS
		'9badb7',  // 0
		'847e87',  // 1
		'696a6a',  // 2
		'595652',  // 3
		'323c39',  // 4
		//  DARK PURPLE
		'222034',  // 5
		//  WHITE
		'fff',  // 6
		//  REDS, DARK, LIGHT
		'ac3232',  // 7
		'd95763',  // 8
		//  LIGHT, DARK BROWN, DARK PURPLEY BROWN
		'8f563b',  // 9
		'663931',  // 10
		'45283c',  // 11
		//  SKIN COLOURS, DARK, LIGHT
		'd9a066', // 12
		'eec39a', // 13
		'black', // 14
		//  GREY BLUE
		'cbdbfc', // 15
		//  GOLD
		'8a6f30', // 16
	],
	palettes = [
		//  0 - ARMOURED SOLDIERS
		[0,1,2,3,4,4],
		//  1 - CRUSADER SHIELD
		[6,8,0,7],
		//  2 - SPEAR
		[1,2,10],
		//  3 - EYES SLITS
		[5,5,5],
		//  4 - ARROWS
		[4,2],
		//  5 - ARCHER
		[9,10,11,5,14, 14],
		//  6 - BOW
		[5,4,2,4],
		// 7 - FACE A
		[12,13],
		// 8 - EYE SLITS 2
		[5,5],
		// 9 - EYE SLITS 3
		[5],
		// 10 - EYES
		[5, ,5],
		//  11 - HORSEY
		[9,10,11,5,2],
		//  12 - ARMOURED SOLDIERS ONE LEG
		[0,1,2,3, ,4, ],
		[0,1,2,3, , ,4],  // 13
		//  OTHER HORSEYS
		[12,9,10,5,2],  // 14
		// [13,12,9,5,2],  // 15
		[12,16,10,5,2],  // 15

		//  BOWS NO ARROWS - 16
		[5, , ,5],
		//  EASTERN RIDERS
		[6,15,0,1,2], // 17
		//  FACE B
		[10,12], // 18
		// EASTERN RIDERS MORE
		[6,15,0,1, ,2, ], // 19
		[6,15,0,1, , ,2], // 20
		//  LIGHT BOWS
		[1,4,2,4], // 21
		[1,,,1], // 22

	],
	//  CANVAS, GRAPH, PALETTE, X, Y, REPEAT IN X DIRECTION, DISTANCE IN X DIRECTION
	DrawGraph = (c,g,p,x,y,rx=1,xd=0,rot=false) => {
		g = graphs[g];
		for(_z=0; _z<rx; _z++) {
			for(_y=0,_yL=g.length; _y<_yL; _y++) {
				for(_x=0,_xL=g[_y].length; _x<_xL; _x++) {
					_string = colours[palettes[p][g[_y][_x]]];
					if(_string) {
						c.ctx.fillStyle = '#'+_string;

						if(rot) c.ctx.fillRect(x+_y+_z*xd,y-_x,1,1);
						else c.ctx.fillRect(x+_x+_z*xd,y+_y,1,1);
					}
				}
			}
		}
	},
	DrawGraphs = () => {
		// for(let i=0; i<12; i++) {
		// 	spriteSheet.ctx.save();
		// 	spriteSheet.ctx.translate(i*14,(i*14)%56)
		// 	spriteSheet.ctx.fillStyle = 'rgba(0,255,0,1)'
		// 	spriteSheet.ctx.fillRect(0,32,14,14)
		// 	spriteSheet.ctx.fillStyle = 'rgba(0,0,255,1)'
		// 	spriteSheet.ctx.fillRect(0,46,14,14)
		// 	spriteSheet.ctx.fillStyle = 'rgba(255,255,0,1)'
		// 	spriteSheet.ctx.fillRect(0,60,14,14)
		// 	spriteSheet.ctx.fillStyle = 'rgba(0,255,0,1)'
		// 	spriteSheet.ctx.fillRect(0,74,14,14)
		// 	spriteSheet.ctx.restore();
		// }
		// // spriteSheet.ctx.fillRect(0,60,256,256)
		// for(let i=0; i<3; i++) {
			
		// 	spriteSheet.ctx.fillStyle = 'rgba(0,0,255,1)'
		// 	spriteSheet.ctx.fillRect(0+i*48,104,16,16)
		// 	spriteSheet.ctx.fillStyle = 'rgba(0,255,0,1)'
		// 	spriteSheet.ctx.fillRect(16+i*48,104,16,16)
		// 	spriteSheet.ctx.fillStyle = 'rgba(255,255,0,1)'
		// 	spriteSheet.ctx.fillRect(32+i*48,104,16,16)	
		// }
		

		//  DRAW THE CHECKERED HEX BOARD TILES
		CreateHexSprite(spriteSheet,0,0,0);
		CreateHexSprite(spriteSheet,32,0,1);
		CreateHexSprite(spriteSheet,64,0,2);
		CreateHexSprite(spriteSheet,96,0,3);

		//  SPEARS BEHIND SOLDIERS - FIRST ROW
		//  VERTICAL
		DrawGraph(spriteSheet,1,2,4,42,3,41,true);
		//  2A
		DrawGraph(spriteSheet,1,2,71,39);
		//  2B
		DrawGraph(spriteSheet,2,2,58,34);
		//  3A
		DrawGraph(spriteSheet,3,2,16,38);
		//  3B
		DrawGraph(spriteSheet,4,2,30,35);
		DrawGraph(spriteSheet,5,2,100,33);
		DrawGraph(spriteSheet,3,2,114,42,1,0,true);
		//  ATTACKING SPEARS
		DrawGraph(spriteSheet,3,2,18,53);
		DrawGraph(spriteSheet,1,2,73,53);
		DrawGraph(spriteSheet,3,2,116,55,1,0,true);

		
		for(_j=0; _j<2; _j++) {
			spriteSheet.ctx.save();
			spriteSheet.ctx.translate(0,_j*14);
			
			//  DRAW ARMOURED SOLDIER
			DrawGraph(spriteSheet,0,0,3,36,9,14);
			//  SOLDIER EYE SLITS
			DrawGraph(spriteSheet,7,8,46,37,3,14);
			DrawGraph(spriteSheet,7,3,3,37,3,14);
			DrawGraph(spriteSheet,7,9,89,37,3,14);
			//  SHIELD
			DrawGraph(spriteSheet,6,1,1,39,3,14);
			DrawGraph(spriteSheet,6,1,44,39,3,14);
			DrawGraph(spriteSheet,6,1,88,39,3,14);

			//  ARROW
			DrawGraph(spriteSheet,8,4,130,34);
			//  ARCHERS
			DrawGraph(spriteSheet,0,5,4,64,3,14);

			//  FACES
			DrawGraph(spriteSheet,11,7,4,65,3,14);
			//  EYES
			DrawGraph(spriteSheet,7,10,4,65);
			DrawGraph(spriteSheet,7,9,19,65);
			DrawGraph(spriteSheet,7,9,34,65);
			
			spriteSheet.ctx.restore();
		}

		//  BOWS
		DrawGraph(spriteSheet,9,6,6,66);
		DrawGraph(spriteSheet,10,6,21,64)
		DrawGraph(spriteSheet,9,6,34,65,1,0,true);

		// BOWS NO ARROWS
		DrawGraph(spriteSheet,9,16,6,80);
		DrawGraph(spriteSheet,10,16,21,78)
		DrawGraph(spriteSheet,9,16,34,79,1,0,true);
		//  SPEARS FOR HORSEYS


		DrawGraph(spriteSheet,3,2,4,94,3,96);
		DrawGraph(spriteSheet,1,2,36,94,3,96);
		DrawGraph(spriteSheet,4,2,66,90,3,96);
		DrawGraph(spriteSheet,4,2,19,88,3,96);
		DrawGraph(spriteSheet,2,2,51,88,3,96);
		DrawGraph(spriteSheet,5,2,83,87,3,96);

		//  ATTACKING SPEARS
		DrawGraph(spriteSheet,3,2,6,111,3,96);
		DrawGraph(spriteSheet,1,2,38,110,3,96);
		DrawGraph(spriteSheet,4,2,68,105,3,96);



		for(_j=0; _j<2; _j++) {
			spriteSheet.ctx.save();
			spriteSheet.ctx.translate(0,_j*16);

			
			//  HORSEY A
			DrawGraph(spriteSheet,12,11,1,93,2,16);
			//  OTHER HORSEY A
			DrawGraph(spriteSheet,12,14,97,93,2,16);
			//  OTHER OTHER HORSEY A
			DrawGraph(spriteSheet,12,15,193,93,2,16);
			for(_i=0; _i<2; _i++) {
				//  SOLDIER ON HORSEY A
				DrawGraph(spriteSheet,0,0,5+_i*16,90,3,96);
				//  SOLDIER EYES
				DrawGraph(spriteSheet,7,3,5+_i*16,91,3,96);
			}
			//  HORSEY A AGAIN
			DrawGraph(spriteSheet,13,11,7,93,2,16);
			//  OTHER HORSEY A
			DrawGraph(spriteSheet,13,14,103,93,2,16);
			//  OTHER OTHER HORSEY A
			DrawGraph(spriteSheet,13,15,199,93,2,16);

			//  HORSEY B
			DrawGraph(spriteSheet,14,11,33,93,2,16)
			//  OTHER HORSEY B
			DrawGraph(spriteSheet,14,14,129,93,2,16)
			//  OTHER OTHER HORSEY B
			DrawGraph(spriteSheet,14,15,225,93,2,16)
			for(_i=0; _i<2; _i++) {
				//  SOLDIER ON HORSEY B
				DrawGraph(spriteSheet,0,13,37+_i*16,90,3,96);
				//  EYESLITS
				DrawGraph(spriteSheet,7,8,38+_i*16,91,3,96);
			}
			//  HORSEY C
			DrawGraph(spriteSheet,15,11,65,93,2,16);
			//  OTHER HORSEY C
			DrawGraph(spriteSheet,15,14,161,93,2,16);
			//  OTHER OTHER HORSEY C
			DrawGraph(spriteSheet,15,15,257,93,2,16);
			for(_i=0; _i<2; _i++) {
				//  SOLDIER ON HORSEY C
				DrawGraph(spriteSheet,0,12,68+_i*16,90,3,96);
				//  EYES
				DrawGraph(spriteSheet,7,9,70+_i*16,91,3,96);
			}
			spriteSheet.ctx.restore();
		}

		//  EASTERN RIDERS
		for(_j=2; _j<4; _j++) {
			spriteSheet.ctx.save();
			spriteSheet.ctx.translate(0,_j*16);

			
			//  HORSEY A
			DrawGraph(spriteSheet,12,11,1,93);
			//  OTHER HORSEY A
			DrawGraph(spriteSheet,12,14,49,93);
			//  OTHER OTHER HORSEY A
			DrawGraph(spriteSheet,12,15,97,93);

			//  SOLDIER ON HORSEY A
			DrawGraph(spriteSheet,0,17,5,90,3,48);
			
			//  SOLDIER EYES
			// DrawGraph(spriteSheet,7,3,5+_i*16,91);

			//  HORSEY A AGAIN
			DrawGraph(spriteSheet,13,11,7,93);
			//  OTHER HORSEY A
			DrawGraph(spriteSheet,13,14,55,93);
			//  OTHER OTHER HORSEY A
			DrawGraph(spriteSheet,13,15,103,93);

			//  HORSEY B
			DrawGraph(spriteSheet,14,11,17,93)
			//  OTHER HORSEY B
			DrawGraph(spriteSheet,14,14,65,93)
			//  OTHER OTHER HORSEY B
			DrawGraph(spriteSheet,14,15,113,93)
			//  SOLDIER ON HORSEY B
			DrawGraph(spriteSheet,0,20,21,90,3,48);
			//  EYESLITS
			// DrawGraph(spriteSheet,7,8,38+_i*16,91);
			//  HORSEY C
			DrawGraph(spriteSheet,15,11,34,93);
			//  OTHER HORSEY C
			DrawGraph(spriteSheet,15,14,82,93);
			//  OTHER OTHER HORSEY C
			DrawGraph(spriteSheet,15,15,130,93);

			//  SOLDIER ON HORSEY C
			DrawGraph(spriteSheet,0,19,37,90,3,48);
			// DrawGraph(spriteSheet,0,12,68+_i*16,90);
			//  EYES
			// DrawGraph(spriteSheet,7,9,70+_i*16,91);
			//  FACE
			DrawGraph(spriteSheet,11,18,5,91,9,16);
			//  EYES
			DrawGraph(spriteSheet,7,10,5,91,3,48);
			DrawGraph(spriteSheet,7,9,22,91,3,48);
			DrawGraph(spriteSheet,7,9,39,91,3,48);
			
			spriteSheet.ctx.restore();
		}
		//  BOWS
		DrawGraph(spriteSheet,9,21,7,126,3,48);
		DrawGraph(spriteSheet,10,21,25,123,3,48)
		DrawGraph(spriteSheet,9,21,40,125,3,48,true);

		// BOWS NO ARROWS
		DrawGraph(spriteSheet,9,22,7,142,3,48);
		DrawGraph(spriteSheet,10,22,25,139,3,48)
		DrawGraph(spriteSheet,9,22,40,141,3,48,true);

		//  SHIELDS
		for(_i=0; _i<2; _i++) {
			spriteSheet.ctx.save();
			spriteSheet.ctx.translate(0,_i*16);
			DrawGraph(spriteSheet,6,1,3,93,3,96);
			DrawGraph(spriteSheet,6,1,19,93,3,96);
			DrawGraph(spriteSheet,6,1,36,93,3,96);
			DrawGraph(spriteSheet,6,1,52,93,3,96);
			DrawGraph(spriteSheet,6,1,69,93,3,96);
			DrawGraph(spriteSheet,6,1,85,93,3,96);
			spriteSheet.ctx.restore();
		}


		
		

	},
	// hexSpriteData = [1,2,4,5,7,8,10,11,13,14,14,14,14,14,14,14],
	// hexSpriteData = [2,3,5,6,8,9,11,12,14,15,15,15,15,15,15,15],
	hexSpriteData = [3,4,6,7,9,10,12,13,15,16,16,16,16,16,16,16],
	RandomGreen = (dark) => {return 'rgb('+Math.random()*50+','+(Math.random()*48+160 - dark*12)+','+Math.random()*15+')'},
	CreateHexSprite = (c,x,y,dark) => {
		for(_y=0,_yL=hexSpriteData.length; _y<_yL; _y++) {
			for(_x=0,_xL=hexSpriteData[_y]; _x<_xL; _x++) {
				_string = dark;
				// if(_x == _xL-1)
					// _string = dark+1;
					// _string = true;
				c.ctx.fillStyle = RandomGreen(_string);
				c.ctx.fillRect(_x+x+HEX_RADIUS,_y+y,1,1);
				c.ctx.fillStyle = RandomGreen(_string);
				c.ctx.fillRect(HEX_RADIUS-_x+x-1,_y+y,1,1);
				c.ctx.fillStyle = RandomGreen(_string);
				c.ctx.fillRect(_x+x+HEX_RADIUS,HEX_RADIUS*2-1-_y+y,1,1);
				c.ctx.fillStyle = RandomGreen(_string);
				c.ctx.fillRect(HEX_RADIUS-_x+x-1,HEX_RADIUS*2-1-_y+y,1,1);
			}
		}
	},
	DrawHexSprite = (x,y,_x) => {
		C.ctx.drawImage(spriteSheet,_x,0,32,32,x,y,32,32);
	},
	DrawHexGrid = () => {
		_i = 0;
		for(_x=0; _x<10; _x++) {
			_i += 4;
			for(_y=0; _y<10; _y++) {
				_point.y = Math.round(GRID_OFFSET.x+_x*HEX_RADIUS+Math.cos(a)*_x*HEX_RADIUS);
				_point.x = Math.round(GRID_OFFSET.y+_y*HEX_RADIUS+(Math.sin(a)-0.1)*_y*HEX_RADIUS+_x%2*Math.sin(a)*HEX_RADIUS);
				DrawHexSprite(_point.x-HEX_RADIUS,_point.y-HEX_RADIUS,_i++%4*32);
			}
		}
	},
	spriteLocations = [
		// TWELVE SPRITES
		[//[14, 7, 14,12, 14,17, 14,22, 20, 7, 20,12, 20,17, 20,22, 26, 7, 26,12, 26,17, 26,22],
		 [26,22, 26,17, 26,12, 26,7, 20,22, 20,17, 20,12, 20, 7, 14,22, 14,17, 14,12, 14, 7],
		 // [22, 7, 18,10, 14,13, 10,16, 26,11, 22,14, 18,17, 14,20, 30,15, 26,18, 22,21, 18,24],
		 [18,24, 22,21, 26,18, 30,15, 14,20, 18,17, 22,14, 26,11, 10,16, 14,13, 18,10, 22, 7],
		 // [10,14, 14,17, 18,20, 22,23, 14,10, 18,13, 22,16, 26,19, 18, 8, 22, 9, 26,12, 30,15]
		 [30,15, 26,12, 22,9, 18,8, 26,19, 22,16, 18,13, 14,10, 22,23, 18,20, 14,17, 10,14]],
		//  SIX SPRITES
		[//[18,9, 13,13, 8,17, 23,15, 18,19, 13,23],
		 [23,15, 18,19, 13,23, 18,9, 13,13, 8,17],
		 //[12,9, 12,15,12,21, 20,9, 20,15, 20,21],
		 [20,9, 20,15, 20,21, 12,9, 12,15, 12,21],
		 [14,8, 19,12, 24,16, 8,14, 13,18, 18,22]]
	],
	ObjectPool = (object) => {
		let pool = {};
		pool.active = [];
		pool.inactive = [];

		pool.newObject = function(options) {
			let _o;
			if(pool.inactive.length < 1) {
				_o = new object([]);
				_o.init(options);

				_o.release = () => {
					pool.active.splice(pool.active.indexOf(_o),1);
					pool.inactive.push(_o);
				}
			} else {
				_o = pool.inactive.shift();
				_o.init(options);
			};
			pool.active.push(_o);

			return _o;
		};
		return pool;
	},
	arrows = ObjectPool(Sprite);
	//  XY POSITION, DESTINATION XY, TIME, ROTATION
	CreateArrow = (x,y,dx,dy,t,r) => {
		_i = arrows.newObject([x,y,6,3,129,33,dx,dy,t,r]);
	};
	
	

// #000000
// #222034
// #45283c
// #663931
// #8f563b
// #df7126
// #d9a066
// #eec39a
// #fbf236
// #99e550
// #6abe30
// #37946e
// #4b692f
// #524b24
// #323c39
// #3f3f74
// #306082
// #5b6ee1
// #639bff
// #5fcde4
// #cbdbfc
// #ffffff

// #76428a
// #ac3232
// #d95763
// #d77bba
// #8f974a
// #8a6f30
	

	



let C = Canvas(innerWidth,innerHeight);
// C.ctx.fillStyle = 'blue';
// C.ctx.fillRect(0,0,innerWidth,innerHeight);
C.style.position = 'fixed';
document.body.appendChild(C);

PrepareGrid(C.ctx,10,10);

let army = [];
levelData[0].army.forEach( u => {
	let U = new Obj(HexPos(u[0],u[1]),14,14,u[2],u[3]);
	gameObjects.push(U);
	army.push(U)
})
let spriteSheet = Canvas(512,512);
spriteSheet.style.position = 'fixed';
// document.body.appendChild(spriteSheet);
// spriteSheet.ctx.fillStyle = 'blue';
// spriteSheet.ctx.fillRect(0,0,512,512);
DrawGraphs();

let clickToStart = new Button(innerWidth/2,innerHeight/2,400,100,'ClickToStart');
clickToStart.touched = () => {
	AddButtons();
	StartAudio();
}
menuObjects.push(clickToStart)

let AddButtons = () => {
		menuObjects.splice(0,1);
		menuObjects.push(startButton);
		menuObjects.push(startButton2);
		menuObjects.push(startButton3);
		menuObjects.push(toggleIntro);
		uiObjects.push(toggleIntro);
	},
	StartAudio = () => {
		// zzfxX - the common audio context
		zzfxX=new(window.AudioContext||webkitAudioContext);
		// zzfx(...gameOverSound);
		setTimeout(() => {
			introNode = zzfxP(...Intro);
			introPlaying = true;
		},1000);
		// zzfxP(...[[[,0,22,,.07,.07,2,0,,,.5,.01],[2,0,426,.01,.2,.48,,44,,,200,,,.1],[2,0,426,,.02,.2,,44,,,200,,,.1],[,0,84,,,,,.7,,,,.5,,6.7,1,.05],[2,0,4e3,,,.03,2,1.25,,,,,.02,6.8,-.3,,.5],[,0,209,,.02,.25,3],[,0,655,,,.09,3,1.65,,,,,.02,3.8,-.1,,.2]],[[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34,,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34,,,,,,,,,,,,34.5,,,,,,34,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[5,1,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,22.5,,20.5,,,,20.5,,,,20.5,,20.5,,,,20.5,,,,20.5,,,,20.5,,20.5,,,,20.5,,20.5,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,15,,,,15,,,,15,,15,,15,,15,,,,15,,15,,,,15,,15,,17,,20,,22,,,,22,,,,22,,17,,20,,22,,,,,,,,,,,,17,,20,,17,,],[5,1,27.5,,,,27.5,,,,27.5,,27.5,,,,27.5,,,,27.5,,,,27.5,,27.5,,,,27.5,,27.5,,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,,,22.5,,,,22.5,,22.5,,,,22.5,,22.5,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,22,,,,22,,,,22,,17,,20,,22,,,,22,,20,,,,22,,20,,17,,22,,20,,,,20,,,,20,,17,,20,,20,,,,20,,17,,,,20,,17,,20,,22,,],[5,1,10,,13,,,,15,,17,,,,20,,22,,,,20,,,,17,,22,,22,,17,,20,,,,,,,,,,,,,,,,,,,,,,20,,17,,20,,22,,25,,27,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]],[[,-1,15.26,,,,15.26,,,,15.26,,15.26,,15.26,,15.26,,,,15.26,,15.26,,,,15.26,,15.26,,17.26,,20.26,,22.26,,,,22.26,,,,22.26,,17.26,,20.26,,22.26,,,,,,,,,,,,17.26,,20.26,,17.26,,],[3,-1,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,25,,,,,,25,,,,,,25,,,,,,,,25,,,,,,,,,,,,],[1,1,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,34.5,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,],[5,1,,,27,,25,,,,27,,,,25,,27,,,,25,,22,,20,,22,,,,18,,20,,22,,,,22,,,,22,,,,22,,,,25,,22,,,,25,,,,22,,25,,22,,],[4,-1,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,,,32,,32,,,,,,32,,,,32,,32,,32,,,,32,,,,32,,32,,32,,],[6,-1,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,,,,,,,,,25,,,,,,,,],[2,1,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,,,,,,,,,,,34.5,,,,,,34.5,,,,,,34.5,,,,,,34.5,,34.5,,]]],[0,1,2,3,4,5,4,5,6,7,6,7,8,9,8,9,6,7,6,7,0,8,9,8,9,6,7,6,7],187.5,{"title":"Cuddly Demos - Main Menu","notes":"This is a conversion of the main menu tune from the Atari ST demo 'The Cuddly Demos', by The Carebears. The original was composed by Jochen Hippel (aka. MadMax). This pattern data was taken from a MOD file - I have no idea who converted it."}])
	};
let startButton = new Button(innerWidth/4,innerHeight/2,100,100,'Level 1','blue');
startButton.touched = () => {
	StartGame(0);
};


let startButton2 = new Button(innerWidth/2,innerHeight/2,100,100,'Level 2');
startButton2.touched = () => {
	if(CAN_PLAY > 1)
		StartGame(1);
};


let startButton3 = new Button(innerWidth/4*3,innerHeight/2,100,100,'Level 3');
startButton3.touched = () => {
	if(CAN_PLAY > 2)
		StartGame(2);
};

let toggleIntro = new Button(innerWidth/16,innerHeight/16*3,150,40,'Stop Music');
toggleIntro.touched = () => {
	if(introPlaying) {
		introNode.stop();
		introPlaying = false;
		toggleIntro.text = 'Play Music';
	}
	else {
		introPlaying = true;
		introNode = zzfxP(...Intro);
		toggleIntro.text = 'Stop Music';
	}
};



let exitButton = new Button(25,25,25,25,'X');
exitButton.touched = () => {
	endTime = 0;
	GAME_STATE = 0;
	selected = undefined;
	army.forEach( U => {
		U.pos.copy(HexPos(U.oPos.x,U.oPos.y));
		U.aTarget = undefined;
		U.mDir.clear()
		U.mTarget.copy(U.oPos);
		U.gridPos.copy(U.oPos);
		U.path.length = 0;
		U.run = U.runMax;
		SpritesFaceDown();
	})
};
exitButton.render = () => {
	C.ctx.fillStyle = 'grey';
	C.ctx.fillRect(exitButton.pos.x,exitButton.pos.y,exitButton.w,exitButton.h);
	C.ctx.fillStyle = 'black';
	C.ctx.font = HEX_RADIUS *1.5 +'px Times New Roman';
	C.ctx.textAlign = 'center';
	C.ctx.fillText('X',exitButton.pos.x+exitButton.w/2,exitButton.pos.y+exitButton.h*0.8);	
};
uiObjects.push(exitButton);
let runButton = new Button(innerWidth - 200,innerHeight - 150, 150,50,'RUN');
runButton.touched = () => {
	if(selected) {
		if(!selected.aTarget
		|| selected.type == 'archer'
		|| selected.pos.dist(selected.aTarget.pos) > selected.aDist)
			selected.running = !selected.running;
	}
};
runButton.render = () => {
	if(selected) {
		if((selected.aTarget
		&& selected.pos.dist(selected.aTarget.pos) > selected.aDist)
		|| !selected.aTarget) {
			C.ctx.fillStyle = 'grey';
			C.ctx.fillRect(runButton.pos.x,runButton.pos.y,runButton.w,runButton.h);
			C.ctx.fillStyle = 'red';
			C.ctx.font = HEX_RADIUS *2 +'px futura';
			C.ctx.textAlign = 'center';
			C.ctx.fillText(runButton.type,runButton.pos.x+runButton.w/2,runButton.pos.y+runButton.h/1.35);	
		}
		
	}
};
uiObjects.push(runButton);

let deadAndBlood = Canvas(innerWidth,innerHeight);
// deadAndBlood.ctx.fillStyle = 'pink';
// deadAndBlood.ctx.fillRect(0,0,innerWidth,innerHeight);

// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx=(...t)=>zzfxP(zzfxG(...t))
// zzfxP() - the sound player -- returns a AudioBufferSourceNode
zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e}
// zzfxG() - the sound generator -- returns an array of sample data
zzfxG=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);return Z}
// zzfxV - global volume
zzfxV=.3
// zzfxR - global sample rate
zzfxR=44100
//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}



let gameOverSound = [,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17],
	fxArrow = [.7,.7,327,.05,,.02,3,1.3,,,800,.01,.03,4,1,,.06,.3,,.11],
	fxStab = [1.06,,176,.01,.01,.04,1,1.51,30,1,,,,4,,.1,,.4,.04,.15],

	introNode,
	introPlaying = false,
	endMusicPlayed = false,
	
	Intro = zzfxM(...[[[.4,0,4e3,,,.03,1,1.25,,,,,.02,6.8,-.3,,.5],[,0,25,.002,.02,.08,3,,,,,,,,,.3,.01],[.4,0,440,,.5,.48,2,,,,,,,,,.02,.01,.75]],[[[,-1,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,],[1,1,13,13.5,13.5,13.5,13,13.5,13.5,13.5,13,13.5,13.5,13.5,13,13.5,13.5,13.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5]],[[,-1,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,],[1,1,13,13.5,13.5,13.5,13,13.5,13.5,13.5,13,13.5,13.5,13.5,13,13.5,13.5,13.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5],[2,,17,,17,15,17,,17,15,17,,17,15,17,20,17,15,13,,13,15,13,,13,15,13,,13,15,13,17,13,15]],[[,-1,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,],[1,1,13,13.5,13.5,13.5,13,13.5,13.5,13.5,13,13.5,13.5,13.5,13,13.5,13.5,13.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5],[2,,5,,3,5,5,,3,5,5,,3,5,17,15,13,10,3,,5,3,3,,5,3,3,,5,3,17,15,13,10]],[[,-1,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,5,,5.5,5.5,5,,5.5,5.5,5,,5.5,5.5,5,,5,,],[1,1,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,10,10.5,10.5,10.5,8,8.5,8.5,8.5,8,8.5,8.5,8.5,8,8.5,8.5,8.5,8,8.5,8.5,8.5],[2,,,,,,,,,,,,3,5,17,15,13,10,3,,,,,,,,,,5,3,17,15,13,10]]],[0,1,1,2,3,1,3,2,3,0],100,{"title":"Intro","instruments":["Hihat","Poly Synth","Korg Filter"],"patterns":["Pattern 0","Pattern 1","Pattern 2","Pattern 3"]}]),
	Victory = zzfxM(...[[[.4,0,196,,.08,.18,3]],[[[,-1,20,,24,,27,,31,,,,,,],[,1,,24,,27,,31,,32,32,,,,],[,-1,,,,,,,,,,,,,],[,1,,,,,,,,,,,,,]]],[0],,{}]),
	Defeat = zzfxM(...[[[.5,0,196,,.08,.18,3]],[[[,-1,20,,16,,11,,,,,,],[,1,,19,,15,,10,10,,,,],[,-1,,,,,,,,,,,],[,1,,,,,,,,,,,]]],[0],110,{}]),

	playSong = () => {
		zzfxP(...Depp)
	};










// InitControls()
setTimeout(()=>{
    // drawAssets();
    InitControls();
    requestAnimationFrame(Simulate);
},10)

