let canvas=document.querySelector('canvas');
let wrapper=document.querySelector('.w');
let resetGameBtn=document.querySelector('#r');
let diceDisplay=document.querySelector('#dT');
let playerDisplay=document.querySelector('#pN');
let message=document.querySelector('#msg');
let ctx=canvas.getContext('2d');
let imageData;
let size=500;
let gridSize=50;
let gridMid=gridSize/2;
let TAU=Math.PI * 2;
let walking, walkSpeed=450;
let locked=false;
let slideDuration=100;
let rolled='', rolling, rollCount, rollMax, rollSpeed=85;

let player1={current:0, target:0, x:0, y:0, colour:'#fd0d', id:'Human'};
let player2={current:0, target:0, x:0, y:0, colour:'#0057b7dd', id:'Bot'};
let activePlayer=player1;

const obstacles=[
	{type:'s', start:95, end:56, p:1},
	{start:1, end:37},
	{start:4, end:14},
	{start:8, end:30},
	{start:33, end:85},
	{start:50, end:68},
	{start:71, end:92},
	{start:80, end:99},
	{type:'s', start:97, end:78, p:1},
	{type:'s', start:88, end:24, p:1}, 
	{type:'s', start:79, end:44, p:-1}, 
	{type:'s', start:61, end:18, p:-1},
	{type:'s', start:48, end:26, p:1},
	{start:42, end:64},
	{type:'s', start:36, end:6, p:-1}, 
	{type:'s', start:32, end:10, p:-1},
];
let activeObstacle;

ctx.strokeStyle='#555';
ctx.lineWidth=2;

const setLocked=(tf) => {
	locked=tf;
}

/* The walkSequence is the zig-zag pattern which the counters move through the game.
	This has an ID for grid number used for the dice roll look-ups, 
	and xy co-ordinates for drawing and animation */
const boustrophedonWalk=(cols, rows) => {
	let temp=[];
	for(let row=0; row<rows; row++){
		let t=Array.apply(null, Array(cols)).map((x, col) => {
			return {id:col+row*cols, y:size - gridSize - row*gridSize, x:col*gridSize};
		});
		t=row % 2 ? t.reverse() : t;
		temp=[...temp, ...t];
	}
	return temp;
}
let walkSequence=boustrophedonWalk(10, 10);

const draw=() => {
	ctx.clearRect(0, 0, size, size);
	drawBoard();
	drawPlayers();
}
const getColour=(i) =>  `hsl(${300 + i * 10},60%,50%)`;
const drawDice=() => {
	// Draw the dice and capture image data to use as html background-image
	canvas.width=50;
	canvas.height=300;
	ctx.fillStyle='#222';
	let diceString='111000111 101010101 101000101 001010100 001000100 000010000';
	let faces=diceString.split(' ');
	faces.forEach((face, i) => {
		let dots=face.split('');
		let gap=i * 50;
		dots.forEach((dot, j) => {
			if(dot === '1'){
				ctx.beginPath();
				ctx.arc(12 + (j%3)*13, gap + 12 + (Math.floor(j / 3)*13), 5, 0, TAU);
				ctx.fill();
			}
		})
	});
	let dataURL=canvas.toDataURL();
	document.querySelector('#dT').style.backgroundImage=`url(${dataURL})`;
}
const drawLadder=(pS, pE) => {
	// Calculate length and rotation of ladder
	let dx=(pE.x - pS.x);
	let dy=(pE.y - pS.y);
	let len=Math.hypot(dx, dy);
	let deg=Math.atan2(dy, dx) + (TAU / 4);
	
	// We draw a straight ladder then rotate it.
	// Requires change of rotation center from (0,0) to foot of ladder. 
	// We save() then restore() the 2D context further transformations can be easily calculated
	ctx.save();
	ctx.translate(pS.x, pS.y);
	ctx.rotate(deg);
	
	// Draw sides
	ctx.strokeStyle='#332c21';
	ctx.lineWidth=4;
	ctx.beginPath();
	ctx.moveTo(-10, 0);
	ctx.lineTo(-10, -len);
	ctx.moveTo(+10, 0);
	ctx.lineTo(+10, -len);
	// Add rungs
	for(let rungs= ~~(len / 18.8), i=1; i<=rungs; i++){
		ctx.moveTo(-10, i*-18.8);
		ctx.lineTo(10, i*-18.8);
	}
	ctx.stroke();
	
	// Restore rotation & transformation
	ctx.restore();
}
const drawSnake=(start, end, col, p) => {
	// Draw body
	let smoothness=200;
	const obj={x:0, y:0, sX:start.x, sY:start.y, dX:end.x-start.x, dY:end.y-start.y};
	ctx.fillStyle=col;
	for(let i=0; i<=smoothness; i++){
		ctx.beginPath();
		// Using different easing functions makes a curve
		// Use same for drawing snake and snake slide animation 
		obj.x=easeInOutQuad(i, obj.sX, obj.dX, smoothness);
		obj.y=easeInOutQuart(i, obj.sY, obj.dY, smoothness);
		ctx.arc(obj.x, obj.y, 10-i*.05, 0, TAU);
		ctx.fill();
	}
	
	// Draw eye
	ctx.beginPath();
	ctx.fillStyle='#fff';
	ctx.strokeStyle='#000';
	ctx.arc(start.x, start.y, 4, 0, TAU);
	ctx.fill();
	ctx.stroke();
	
	ctx.beginPath();
	ctx.fillStyle='#d00';
	ctx.arc(start.x+p, start.y+1, 1, 0, TAU);
	ctx.fill();
}
const drawBoard=() => {
	/* Draw the board features first time, then
	use a cached version for performance improvement */
	if(!imageData){
		drawDice();
		canvas.width=size;
		canvas.height=size;
		obstacles.forEach((oB, i) => {
			let start={x:walkSequence[oB.start-1].x+gridMid, y:walkSequence[oB.start-1].y+gridMid};
			let end={x:walkSequence[oB.end-1].x+gridMid, y:walkSequence[oB.end-1].y+gridMid};
			oB.type === 's' ? drawSnake(start, end, getColour(i), oB.p) : drawLadder(start, end);
		});
		imageData=ctx.getImageData(0, 0, size, size);
	}
	else{
		ctx.putImageData(imageData, 0, 0);
	}
}

const drawPlayers=() => {
	if(player1.current > 0) {
		ctx.fillStyle=player1.colour;
		ctx.strokeStyle=player1.colour;
		ctx.beginPath();
		ctx.arc(player1.x+gridMid, player1.y+gridMid, 16, 0, TAU);
		ctx.fill();
		ctx.stroke();
	}
	if(player2.current > 0) {
		ctx.fillStyle=player2.colour;
		ctx.strokeStyle=player2.colour;
		ctx.beginPath();
		if(player2.current === player1.current){
			ctx.arc(player2.x+gridMid, player2.y+gridMid, 16, 45, Math.PI + 45);
		} 
		else {
			ctx.arc(player2.x+gridMid, player2.y+gridMid, 16, 0, TAU);
		}
		ctx.fill();
		ctx.stroke();
	}
}

const walk=() => {
	let activeCounter=activePlayer.current++;
	let sliding=false;
	playSFX(sfxSets.step);
	activePlayer.x=walkSequence[activeCounter].x;
	activePlayer.y=walkSequence[activeCounter].y;
	draw();
	
	if(activeCounter === 99){
		clearInterval(walking);
		showWinner();
		return;
	}
	
	if(activePlayer.current >= activePlayer.target){
		clearInterval(walking);
		
		// check obstacles
		for(let i=0; i < obstacles.length; i++){
			if(obstacles[i].start === activePlayer.target){
				let endSquare=obstacles[i].end;
				activePlayer.target=obstacles[i].end;
				activeObstacle=obstacles[i].type;
				sliding=true;
				playSFX(activeObstacle === 's' ? sfxSets.down : sfxSets.up);
				slide(walkSequence[endSquare-1].x, walkSequence[endSquare-1].y);
				break;
			}
		}
		if(!sliding){
			resetTurn();
			togglePlayer();
		}
	}
}

const showWinner=() => {
	setPlayerID('is the winner!');
	resetGameBtn.classList.remove('h');
}
const setPlayerID=(msg='') => {
	playerDisplay.innerHTML=`${activePlayer.id} ${msg}`;
	message.innerHTML='Click dice to play';
	document.body.classList=`p${activePlayer.id}`;
	diceDisplay.classList.add('p');
}

const resetTurn=() => {
	setLocked(false);
}

/*	Start an isolated animation loop for automated movement (snakes and ladders), 
	with callbacks for update and complete.
	The game generally uses intervals for the low cost stepped animation. However, 
	for this we want something smoother so use requestAnimationFrame */
const slide=(dX, dY) => {
	activePlayer.startX=activePlayer.x;
	activePlayer.startY=activePlayer.y;
	activePlayer.destX=dX - activePlayer.startX;
	activePlayer.destY=dY - activePlayer.startY;
	activePlayer.count=0;
	
	requestAnimationFrame(onUpdate);
}
const onUpdate=() => {
	if(activePlayer.count >= slideDuration){
		onComplete();
	}
	else{
		if(activeObstacle === 's'){
			activePlayer.x=easeInOutQuad(activePlayer.count, activePlayer.startX, activePlayer.destX, slideDuration);
			activePlayer.y=easeInOutQuart(activePlayer.count++, activePlayer.startY, activePlayer.destY, slideDuration);
		}
		else{
			activePlayer.x=easeOutQuad(activePlayer.count, activePlayer.startX, activePlayer.destX, slideDuration);
			activePlayer.y=easeOutQuad(activePlayer.count++, activePlayer.startY, activePlayer.destY, slideDuration);
		}
		draw();
		requestAnimationFrame(onUpdate);
	}
}
const onComplete=() => {
	activePlayer.current=activePlayer.target;
	draw();
	resetTurn();
	togglePlayer();
}
/*** END automated movement methods ***/

/* TWEENING METHODS
	For the maths see: https://github.com/danro/jquery-easing/blob/master/jquery.easing.js */
const easeOutQuad=(t, b, c, d) => -c * (t/=d)*(t-2) + b;
const easeInOutQuad=(t, b, c, d) => ((t/=d/2) < 1) ? c/2*t*t + b : -c/2 * ((--t)*(t-2) - 1) + b;
const easeInOutQuart=(t, b, c, d) => ((t/=d/2) < 1) ? c/2*t*t*t*t + b : -c/2 * ((t-=2)*t*t*t - 2) + b;
/*** END tweening methods ***/

const togglePlayer=() => {
	activePlayer=activePlayer.id === player1.id ? player2 : player1;
	setPlayerID();
	
	if(activePlayer === player2) rollDice();
}

const rollDice=(evt) => {
	if(evt) evt.preventDefault();
	if (locked) return;
	setLocked(true);
	
	message.innerHTML=activePlayer === player1 ? 'Rolling...' : 'Auto rolling...';
	diceDisplay.classList.remove('p');
	
	rollCount=0;
	rollMax=Math.random()*10 + 15;
	rolling=setInterval(doRoll, rollSpeed);
}
const doRoll=() => {
	rolled=~~(Math.random() * 6 + 1);
	diceRollDisplay(rolled);
	if(rollCount++ >= rollMax){
		clearInterval(rolling);
		message.innerHTML='Moving...';
		activePlayer.target += rolled;
		walking=setInterval(walk, walkSpeed);
	}
}
const diceRollDisplay=(spots) => {
	diceDisplay.classList=`s${spots}`
}

const resetGame=() => {
	player1.current=0;
	player1.target=0;
	player1.x=0;
	player1.y=0;
	player2.current=0;
	player2.target=0;
	player2.x=0;
	player2.y=0;
	activePlayer=player1;
	locked=false;
	diceRollDisplay('');
	setPlayerID();
	
	draw();
	
	resetGameBtn.classList.add('h');
}


// *********************************
// ********* Audio methods *********
let audio=new window.AudioContext();
const createOscillator=(freq, attack, decay, delay, volume=.3) => {
	// Create an envelope to make sound more pleasant
	let gain=audio.createGain(),
		osc=audio.createOscillator();
	// Connect up the envelope
	gain.connect(audio.destination);
	gain.gain.setValueAtTime(0, audio.currentTime);
	gain.gain.linearRampToValueAtTime(volume, audio.currentTime + attack);
	gain.gain.linearRampToValueAtTime(0, audio.currentTime + (decay * .01));
	// make the sound
	osc.frequency.value=freq;
	osc.type='sawtooth';// sawtooth sine triangle square
	osc.connect(gain);
	osc.start(audio.currentTime + delay);// + 2
	// Clean up - for garbage collection
	setTimeout(() => {
		osc.stop();
		osc.disconnect(gain);
		gain.disconnect(audio.destination);
	}, decay);
}
let sfxSets={
	down:[
		{f:200,a:.2,d:800,w:.3,v:.15},
		{f:300,a:.2,d:300,w:.1,v:.1},
	],
	up:[
		{f:300,a:.2,d:600,w:.3,v:.15},
		{f:200,a:.2,d:400,w:.1,v:.1},
	],
	step:[
		{f:85,a:.1,d:80,w:0,v:.3},
	]
};
let playSFX=(sfx) => sfx.forEach(s => createOscillator(s.f, s.a, s.d, s.w, s.v));
/*** END audio methods ***/

diceDisplay.addEventListener('click', rollDice);
resetGameBtn.addEventListener('click', resetGame);
setPlayerID();
drawBoard();