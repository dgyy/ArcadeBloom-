//https://xem.github.io/js13k-pack/
var fps = 60;
var rf = (function(){
  return window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(cb){
          window.setTimeout(cb, 1000 / fps);
      };
})();

var lastTime;
var now;
var dt = 0;

var slowMo = 1;
var step = 1 / fps;
var sStep = slowMo * step;

var GAME;
var GFX;
var SFX;
var MAP;

var MUSIC;
var SPRITES = [];
var PHYSICS = new World();
var AUDIO;

function Start(canvasBody)
{	
	// Create the canvas
	var wd = (25 * 32);
	var ht = (19 * 32);
	var mCtx = Util.Context(wd, ht);
	if(mCtx.canvas.getContext)
	{
		var b = document.getElementById(canvasBody);
    	b.appendChild(mCtx.canvas);

		MAP = new MapManger(mCtx.ctx, {w:220, h:32}, {w:25, h:19}, 32);

		MUSIC = new TinyMusic();
		AUDIO = new TinySound();

		//offscreen renderer
		GFX = new Render(MAP.osCanvas.ctx);	
		SFX = new Render(MAP.screenCtx, wd, ht);

		SPRITES = new SpritePreProcessor(DEFS.def);	

		preInit();
	}
}

function preInit(){

	Gen(0,1, 2);
	Gen(0,2, 4);
	Gen(1,3,1);
	Gen(1,4,2);
	Gen(1,5, 4);
	Gen(2,6,4);
	Gen1(300,80);

	init();
}


function Gen1(w, h){
	var g = Util.Context(w, h);
	var gx = new Render(g.ctx);

	var l = SPRITES.Get('t6', 0);
	var m = SPRITES.Get('t7', 0);
	var r = SPRITES.Get('t8', 0);
	var sw = m.dim.w;
	var i=0;
	gx.Sprite(sw/2+(i*sw), sw/2, l, 1, 0);
	for (i=1; i < 9; i++) {
		gx.Sprite(sw/2+(i*sw), sw/2, m, 1, 0);
	}
	gx.Sprite(sw/2+(i*sw), sw/2, r, 1, 0);

	l = SPRITES.Get('p', 0);
	m = SPRITES.Get('l', 0);

	gx.Sprite(16, 40, l, 1, 0);
	gx.Sprite(16, 50, m, 1, 0);

	SPRITES.assets[7] = g.canvas;
}

function Gen(index, tagname, sz){
	var d = DEFS.dat[index];
	var w = d[0];
	var h = d[1];
	var g = Util.Context(w*sz, h*sz);
	var gx = new Render(g.ctx);      

	var spr = Util.Unpack(d[2]);

	for (var i = 0; i < spr.length; i++) {
		if(spr[i]>0){
			var c = (i % w)|0;
			var r = (i / w)|0;
			gx.Box(c*sz, r*sz, sz, sz, DEFS.pal[spr[i]]);
		}
	}

	SPRITES.assets[tagname] = g.canvas;
}

function init()
{  
	lastTime = 0;

	GAME = new Blocky();

	FixedLoop();  
}

function FixedLoop(){
	if(Input.IsSingle('Escape') ) {
		GAME.Quit();
	}

//DEBUG
// function SlowMo(mo){
// 	sStep = mo * step;
// }
// if(Input.IsSingle('y') ) {
// 	slowMo+=1;
// 	SlowMo(slowMo);		
// }
// else if(Input.IsSingle('t') ) {
// 	if(slowMo-1 > 0){
// 		slowMo-=1;
// 		SlowMo(slowMo);
// 	}
// }
//DEBUG

	now = timestamp();
	dt = dt + Math.min(1, (now - lastTime) / 1000);
	while (dt > sStep) {
	  dt = dt - sStep;
	  update(step);
	}

	render();
				
	lastTime = now;
	rf(FixedLoop);
}

function timestamp() {
	var wp = window.performance;
	return wp && wp.now ? wp.now() : new Date().getTime();
}

// Update game objects
function update(dt) {
	GAME.Update(dt);
};

function render() {
	GAME.Render();
};

onkeydown = function(e)
{
    Input.Pressed(e, true);
};

onkeyup = function(e)  {
    Input.Pressed(e, false);
    Input.Released(e, true);
};

onblur = function(e)  {
    Input.pressedKeys = {};
};


window.onload = function() {
	Start("cb");
}

