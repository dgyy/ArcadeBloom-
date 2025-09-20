//main
//https://javascript.info/class-inheritance
//https://dev.to/nitdgplug/learn-javascript-through-a-game-1beh
//https://www.minifier.org/
//https://xem.github.io/articles/jsgamesinputs.html
//https://xem.github.io/js13k-pack/


var rf = (function(){
  return requestAnimationFrame;
})();

var Mob = window.ontouchstart !== undefined;


var lastTime;
var now;
var dt = 0;
var step = 1 / 60;
var sStep = 1 * step;

var GAME;
var GFX, SFX;
var MAP;
var AUDIO;
var MUSIC;

var ctx;//
/*****************************/
function Start(canvasBody)
{	
	
	// Create the canvas
	var canvas = document.createElement("canvas");
	if(canvas.getContext)
	{
		ctx = canvas.getContext("2d");
		canvas.width = (25 * 32);
		canvas.height = (19 * 32);

		var b = document.getElementById(canvasBody);
    	b.appendChild(canvas);
		
		MAP = new MapManger(ctx);

		MUSIC = new ShitMusic();
		AUDIO = new TinySound([
			[6,.8,9,.01,.02,.04,,4.5,,,,,.01,,,,.05,.63,.03,.36],//hop1
			[1.2,,1665,.02,.09,.16,1,.47,-0.3,-6.6,119,.02,,,,.1,,.41,.05,.17],//fall        
			[1.2,,1664,.02,.1,.16,,.37,-0.3,-6.5,119,.02,,.1,2,.1,,.41,.05,.17]//splash
			]);

		//offscreen renderer
		GFX = new Render(MAP.osCanvas.ctx);	

		SFX = new Render(MAP.screenCtx, 25* 32, 19* 32);	

		Input.Init(canvas, Mob, SFX,['#000','#999'],0);

		preInit();
	}
}

function preInit(){
	init();
}

function init()
{  
  	var now = timestamp();	
	lastTime = now;

	GAME = new Game(Mob);
	
	FixedLoop();  
}

// function SlowMo(mo){
// 	sStep = mo * step;
// }

function FixedLoop(){
	if(Input.IsSingle('Escape') ) {
		GAME.Pause();
	}

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
	return performance.now();
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
	e.preventDefault();
    Input.Pressed(e, true);
};

onkeyup = function(e)  {
	e.preventDefault();
    Input.Pressed(e, false);
    Input.Released(e, true);
};

onblur = function(e)  {
	e.preventDefault();
    Input.pressedKeys = {};
};

onload = function() {
	Start("cb");
}

