//deflects cannonball if survive.
//50% accuracy gob
//1=yester, 2=Dunbar, 3=Dirleton, 4=Byres, 5=Edinburgh, 6=Abercorn, 7=Aberdour, 8=Macduff's, 9=St Andrews, 10=Leuchars, 11= 
// above perth:  blair , Inverquiech, Kinclaven, Old Clunie
var gLog=console.log.bind(console),
	gNearBrowns,
	gNearLoggedIn,
	gpen,
	gGameX,
	gGameScale,
	gMouseX,
	gMouseY,
	gMouseStartX,
	gMouseStartY,
	gMouseDown,
	gMouseOnGob,
	gClicked,
	gState,
	gStateLoops = 0,
	gMuted,
	gCamX = 0,
	gBorder = 5,
	gYouHp = 99,
	gYouStr = 0,
	gYouDef = 0,
	gYouPeek = 0,
	gYouHitLoop,
	gYouX = 99,
	gYouY = 266,
	gGroundY = 400,
	gReviveLoops,
	gAttackLoop=0,
	gSpecialLoop=0,
	gLoops=0,
	gDrawUntil,
	gGobPicks = [],
	gGobArmy = [],
	gGobLine = [],
	gGobField = [],
	gGobGrave = [],
	gGobWizard = [],
	gGobKinds = {},
	gGobDrag,
	gGobDragged,
	gGobKill,
	gEnemy = {},
	gShitKind,
	gShitX,
	gShitY,
	gShitDmg,
	gBallX,
	gBallY,
	gBallDmg,
	gPi = Math.PI,
	gCastles = [
		{name: 'Yester', hp: 1},
		{name: 'Dirleton', hp: 20},
		{name: 'Byres', hp: 30},
		{name: 'Edinburgh', hp: 40},
		{name: 'Abercorn', hp: 50},
		{name: 'Aberdour', hp: 60},
		{name: "Macduff's", hp: 70},
		{name: 'St Andrews', hp: 80},
		{name: 'Leuchars', hp: 90},
		{name: 'Kinclaven', hp: 100},
	],
	gGetDark = 0,
	gAreas = [],
	gArea,
	gAreaIndex = -1,
	gAreaMode = 0,
	gYouHpAdd = (hp) => {
		gYouHp = gClamp(gYouHp+hp,0,99)
	},
	gShuffleArray = (a) => {
		for(var i=a.length-1; i>0; i--) {
			var j = gRandom() * (i + 1) | 0
			var t = a[i]
			a[i] = a[j]
			a[j] = t
		}
	},
	gBattleMusicPlay = () => p1`B- B- B C B C   B- B- B C--     E- E- C E--     E- E- C E--     G- E- C-G- E- C-G- E- C-B----   B-BB- E-B---    B-BB- E-B---    `,
	gTitleMusicPlay = () => {
		p1`240
        |       O|T-T7X-VT|V-V3Q-OO|T-T5T-XY|c---a-a-|c-caX-Xa|Y4VTQ-OO|T:Xac-aX|V-7VT---|
T-------|T---T-S-|T-------|Q-----S-|T-------|        |        |    T-S-|T-      |      O-|
H-J-L-H-|M---O-O-|H-------|H-------|H-J-L-H-|M---L---|M---Q---|J-M-M-OM|L-H-M-L-|O---H-  |`
	},
	gAreaGo = () => {
		gAreaIndex++
		gAreaMode = 0
		gYouX = 111
		gYouY = 266
		gYouPeek = gYouStr = gYouDef = 0
		gArea = gAreas[gAreaIndex]
		for(var gob of gGobArmy) {
			gob.x = gob.endX = -111
			gob.y = gob.endY = gYouY
			gob.wizard = gob.specialLoop = 0
			gob.hp = gob.kind.hp
		}

		gGobLine = []
		gGobPicks = []
		
		if(gArea.hp) {
			gEnemy = {x:830, y:gGroundY, hp:gArea.hp, size:100+20*4, hitLoop:0, fire:0, doorIs:!gAreaIndex, str:0}
			if(gAreaIndex)gGobLine = [...gGobArmy]
			gShuffleArray(gGobLine)
			if(gArea.name == 'Kinclaven') {
				gStateSet('king')
			} else {
				gTurnStart()
			}
/*
C#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
			p1`140
        |        |        |        |T-------|Q-Q     |        |        |        |        V-------|Q-T-V---|
A-B-A-B-|B-D-D-B-`
*/
			if(gAreaIndex) {
				gBattleMusicPlay()
				gNearBut.style.display = 'none'
			}
		} else {
			if(gArea == 'credits' || gArea == 'beat') {
				gTitleMusicPlay()
			}
			if(gArea == 'introLeave') {
				gStateSet('walk')
			}
			if(gArea == 'beat') {
				gStateSet('beat')
			}
			if(gArea == 'priest') {
				gStateSet('priest')
				p1`220.70
TRTV|W-V-|T-VW|Y---|V---|W---|VVWV|R---|TRTV|WWVV|TTVW|Y---|TRTV|W-Y-|WTVR|T---|
O-- |R-- |O-- |T-- |Q-- |R-- |Q-- |M-- |O-- |R-- |O-- |T-- |O-- |R-- |R-- |O-- |`
				gYouX = -100
				for(var gob of gGobArmy) {
					gob.x = -100
					gob.endX = gYouX-20-gGobArmy.indexOf(gob)/gGobArmy.length*640
					gob.endY = gYouY
				}
			}
		}
	},
	gStateSet = (state) => {
		gLog("gStateSet from",gState,state)

		if(state == 'winPick') {
			gGobPicks = []
			var x = 460
			var walk = 700
			var groups = gRandom()<.1 ? 1:2
			for(var group=1; group<=groups; group++) {
				var gob = gGobMake(gGobKindRandomGet(gRandom() < .4+gAreaIndex/60 ? 1:2))
				gob.endX = x
				gob.x = walk+x
				gob.pick = 1
				gob.group = group
				gGobPicks.push(gob)
				
				x+=88
				var gob = gGobMake(gGobKindRandomGet(gRandom() < gAreaIndex/26 ? 3: 2))
				gob.endX = x
				gob.x = walk+x
				gob.pick = 2
				gob.group = group
				gGobPicks.push(gob)
				
				if(groups==1) {
					x+=88
					var gob = gGobMake(gGobKindRandomGet(gRandomInt(1,3)))
					gob.endX = x
					gob.x = walk+x
					gob.pick = 3
					gob.group = group
					gGobPicks.push(gob)
				}
				x+=130
				walk+=30
			}
		}
		
		gState = state
		gStateLoops = 0
	},
	gRandom = () => Math.random(),
	gRandomInt = (min, max) => gRandom()*(max-min) + min | 0,
	gOr2 = (val,a,b) => val==a || val==b,
	gMouseInRect = (x,y,sx,sy) => gPointInRect(gMouseX, gMouseY, x,y,sx,sy),
	gPointInRect = (px,py,x,y,sx,sy) => px>=x && py>=y && px<x+sx && py<y+sy,
	gColorSet = (color) => {
		gPen.strokeStyle = gPen.fillStyle = '#'+(color||'000')
	},
	gCircleDraw = (x,y,r,color,outline,pass2) => {
		gColorSet((!outline || pass2) && color)
		gPen.beginPath()
		gPen.arc(x, y, r+(outline && !pass2?gBorder:0), 0, 2*gPi)
		gPen.fill()
		if(outline && !pass2)gCircleDraw(x,y,r,color)
	},
	gOvalDraw = (x,y,rX,rY,color,outline,pass2) => {
		gColorSet((!outline || pass2) && color)
		if(color===u)gAlphaSet(.3)
		gPen.beginPath()
		gPen.ellipse(x, y, rX, rY, 0, 0, gPi*2)
		gPen.fill()
		gAlphaSet(1)
		if(outline && !pass2)gOvalDraw(x,y,rX-outline,rY-outline,color)
	},
	gPathDraw = (x, y, pathString, mult, color, stroke) => {
		gColorSet(color)
		pathString = pathString.replace(/[\.0-9]+/g, v=>v*mult)
		var path = new Path2D(`M${x},${y} ${pathString}z`)
		gPen.fill(path)
		gColorSet()
		if(mult>1) {
			gPen.lineWidth = stroke||gBorder
			gPen.stroke(path)
		}
	},
	gLineDraw = (x1, y1, sizeX, sizeY, thickness, color,outline) => {
		var path = new Path2D(`M${x1},${y1} l${sizeX} ${sizeY}`)
		if(outline) {
			gPen.lineWidth = thickness*1.2
			gColorSet()
			gPen.stroke(path)
		}
		gPen.lineWidth = thickness
		gColorSet(color)
		gPen.stroke(path)
	},
	gRectDraw = (x, y, sizeX, sizeY, color, outline) => {
		gColorSet(color)
		outline ||= 0
		gPen.fillRect(x-outline, y-outline, sizeX+outline*2, sizeY+outline*2)
	},
	gTowerDraw = (x,y,size,doorIs) => {
		gPen.save()
		var far = 0
		if(gEnemy.dieLoops && ((gArea.name=='Yester')==!!doorIs)) {
			far = Math.min(10,gLoops-gEnemy.dieLoops)/10
		}
		gPen.translate(x+size*.6,y)
		gPen.rotate(far*gPi/2)
		if(doorIs) {
			gTextDraw('🚪', 0, 0, size)
		} else {
			if(gArea.name == 'Kinclaven') {
				var headY = -size*1.5
				var headX = -size*.25
				//body
				gLineDraw(headX, headY+50, 0, 33, 50, '949', 1)
				//head
				gCircleDraw(headX,headY,30,'EDA',1)
				//eyes
				gCircleDraw(headX-2,headY,5,'FFF')
				gCircleDraw(headX-4,headY,3,'8AF')
				gCircleDraw(headX-24,headY,5,'FFF')
				gCircleDraw(headX-24-2,headY,3,'8AF')
				//mouth
				var talk = !gSpeechDrawDone ? Math.sin(gSpeechDrawLoops*.9) : 0
				gOvalDraw(headX-size*.09, headY+size*.1, size*.06-talk, size*.012+talk, 'DAA')
				gTextDraw("👑", headX, headY-33, 66)

				if(gState == 'king2') {
					gSpeechDraw("Sir Hugo de Giffard,\na braver never drew a sword.", headX-33, headY+22)
					if(gSpeechDrawDone && gMouseDown) {
						gStateSet('king3')
					}
				}
			}
			gPathDraw(-size/2,0,`v-9h-1v-5h2v2h2v-2h2v2h2v-2h2v5h-1v9`,size/10, '789')
		}
		gPen.restore()

		if(!doorIs) {
			if(!gEnemy.dieLoops || !gAreaIndex) {
				gTextDraw(gEnemy.hp, x+size/2, y-size*.7, size*.3, gLoops-gEnemy.fireLoop < 7 ? 'E00':'FFF')
				gTextDraw(gArea.name+" Castle", x+size/2, y-size*1.06, size*.12, 'ABC')
			}
		}
	},
	gShitDraw = (size) => {
		if(gShitDmg && gEnemy.hp) {
			var far = 0
			if(gEnemy.dieLoops) {
				far = Math.min(10,gLoops-gEnemy.dieLoops)/10
			}
			gOvalDraw(gShitX, gGroundY, size*.2,size*.2*.3)
			gTextDraw("💩", gShitX, gShitY+far*99, size*.4)
			gTextDraw(gShitDmg, gShitX, gShitY+far*99, size*.25, gEnemy.dieLoops?'777':'FFF')
		}
	},
	gBallDraw = (size) => {
		var far = 0
		if(gEnemy.dieLoops) {
			far = Math.min(10,gLoops-gEnemy.dieLoops)/10
		}
		gOvalDraw(gBallX, gGroundY, size*.2,size*.2*.3)
		gCircleDraw(gBallX, gBallY+far*99, size*.2, '222')
		gTextDraw(gBallDmg, gBallX, gBallY+far*99, size*.3, gEnemy.dieLoops || !gBallDmg?'777':'FFF')
	},
	gTextDraw = (text,x,y,size,color,pass2) => {
		gColorSet(pass2 && color)
		gPen.font = 'bold '+size+'px segoe ui emoji'
		gPen.fillText(text, x, y+(pass2?0:1))
		if(!pass2)gTextDraw(text,x,y,size,color,1)
	},
	gSin = angle => Math.sin(angle),
	gWave = (speed, size) => {
		return gSin(gLoops*speed)*size
	},
	gClamp = (v, lo, hi) => {
		if(hi===u)
		{
			hi = lo
			lo = -lo
		}
		return Math.min(hi, Math.max(v, lo))
	},
	gArcGet = (num, lo, hi) => {
		if(num <= lo || num >= hi) // clamp but also to prevent an almost 0 return, like .3656456e-16
			return 0
		return gSin((num-lo)/(hi-lo)*gPi)
	},
	gEase = (num,start,end,min,max) =>
	{
		if(start < end)
			num = gClamp(num,start,end)
		else
			num = gClamp(num,end,start)
		
		var percent = (num-start)/(end-start)
		if(percent < .5)
			percent = percent*percent*2
		else
			percent =  1 - (1-percent)*(1-percent) * 2
		
		if(min !== u)
			return min + percent*(max-min)
		return percent
	},
	gGobDraw = (gob) => {
		if(gob.kind == gGobKinds.necro) {
			gob.str = gGobGrave.length
		}
		var addY = 131
		if(gob.dead) {
			if(gReviveLoops) {
				addY += (66-gReviveLoops)*2-66
			} else {
				addY -= Math.min(gob.dead,33)*2
			}
		}
		gOvalDraw(gob.x+(gob.dead?gob.kind.size:0), gob.y+addY, gob.kind.size*(gob.dead?1.7:1), 11)
		if(gob.dead && (gState == 'revive' || gState == 'win')) {
			gAlphaSet(gWave(.3,.2)+.6)
		}
		if(gState == 'attackPick' && gGobField.includes(gob) && !gob.kind.legs) {
			gAlphaSet(gWave(.5,.1)+.9)
			if(gob == gMouseOnGob && gMouseDown) {
				gGobDragged.ride = 1
				gob.ride = 2
				gob.endX = gGobDragged.x
				gStateSet('pos')
			}
		}
		if(gState == 'revivePick' && gGobGrave.includes(gob)) {
			gAlphaSet(gWave(.5,.1)+.9)
			if(gob == gMouseOnGob && gMouseDown) {
				gGobSwitch(gob, gGobField)
				gob.endX = 400
				gob.endY = 266
				gob.dead = 0
				gob.hp = gob.kind.hp
				gStateSet('pos')
			}
		}
		if(gState == 'attackPickClone' && gGobField.includes(gob) && gob.kind!=gGobKinds.clone) {
			gAlphaSet(gWave(.5,.1)+.9)
			if(gob == gMouseOnGob && gMouseDown) {
				gGobDragged.kind = gob.kind
				gGobDragged.str = gob.str
				gGobDragged.hp = gob.hp
				gStateSet('turn')
			}
		}
		gGobDraw2(gob, gob.x+gob.addX, gob.y-(gob.kind.size-34)*4-(gob==gGobDrag)*5, gob.kind.size)
		gAlphaSet(1)
	},
	gGobDraw2 = (gob, x,y,size, pass2) => {
		if(x<-size*2)return
		var attackWant = gob==gGobDrag && gMouseX > gMouseStartX+10		
		gPen.save()
		gPen.translate(x,y)
		if(gob.pick)gPen.scale(-1,1)

		if(gob.dead) {
			gPen.rotate(-Math.min(gob.dead*.3, gPi*.5))
		}
		var walk = (gob.x!=gob.endX)*8
		var color = pass2 ? gob.kind.color:'000'
		var sizeAdd = pass2?0:gBorder
		var radius = size+sizeAdd
		//head
		var headY = gob.dead?0:gWave(walk?.6:.3,2)
		var headX = (gob.kind.legs==4)*size
		gCircleDraw(headX,headY,radius,color)
		//tum
		gCircleDraw(0, 0+size*1.7, size*(.8+gob.kind.hp**.8*.1)+sizeAdd, color)
		//legs
		for(var i=-1; i<(gob.kind.legs==4?6:2); i+=2)
			gLineDraw(gob.kind.legs==4 ? size*(i-4+(i>1)*4)*.15 : size*i*.4, size*2.5, 0, size+gSin((gLoops+i)*.7)*walk, size*.02*(7+gob.kind.hp*2)+sizeAdd*2, color)
		if(pass2) {
			//eye
			gCircleDraw(headX+size*.5,headY-size*.2,size*(.23+(gob.kind==gGobKinds.lookout?.1:0)),'790')
			gCircleDraw(headX+size*.5,headY-size*.2,size*.2,'FFF')
			gCircleDraw(headX+size*.6,headY-size*(gob.dead?.3:.2),size*.08,'F00')
			var mod=(gLoops+gGobArmy.indexOf(gob))%50
			if(!gob.dead && mod<6) {
				gRectDraw(headX, headY-size*.5, size*.8, gArcGet(mod,0,6)*size*.5, color)
			}
			//brow
			gLineDraw(headX+size*.2, headY-size*.6, size*.6, size*(((attackWant || gob.attackLoop) && gState!='priest2')?.3:.1), size*.1,'000')
			//mouth
			gLineDraw(headX+size*.2, headY+size*.3, size*.75, 0, size*.15,'900')
			//teeth
			for(var i=2;i--;) {
				gPathDraw(headX+size*(.65+i*.2), headY+size*.25, 'l4 14,4 -14', size*(.015+(gob.kind.name=='redcap')*.01), 'FFD')
			}

			//hat
			if(gob.kind.name=='redcap') {
				var letter = 'A'
				if(gob.str > gob.kind.str)letter = 'B'
				if(gob.str > gob.kind.str+2)letter = 'C'
				if(gob.str > gob.kind.str+4)letter = 'D'
				gPathDraw(headX-25, headY-25, 'l24 0,-12 -22', size*.07, letter+'00')
			}
			
			if(gob.pick)gPen.scale(-1,1)
			//sword
			var swordY = size*1.3
			gPen.save()
			gPen.translate(size*.9 - Math.min(gob.dead*4, 99), swordY)
			if(gob.kind.fire) {
				gTextDraw("🔥", 7+headY, 0, size*(.7+gob.str/3))
			} else {
				if(gob.str) {
					var sword = size*(.3+gob.str*.1)
					if(gob.dead) {
						gPen.rotate(-Math.min(gob.dead*.8, gPi*2.7))
					}
					gLineDraw(headY, 0, sword, -sword, 2+gob.str,'AAA',1)
					gLineDraw(headY, 0, -size*.2, size*.2, size*.2, 'B84',1)
					gLineDraw(headY-size*.2, -size*.2, size*.4, size*.4, size*.2, 'B84',1)
				}
			}
			gPen.restore()
			
			if(attackWant) {
				gAlphaSet(gEase(gMouseX-gMouseStartX,10,20,0,1))
				gTextDraw(gState=='priest2'?'💀':(gob.pick?'❌':(gob.kind.str?"⚔":'')), 44, -55, 66, 'FFF')
			}
			var dragLeft = gob==gGobDrag && gMouseX < gMouseStartX-10
			if(gob.hover || (dragLeft && gState!='priest2')) {
				if(gMouseDown && gMouseX < gMouseStartX-10)gTextDraw(gob.pick?'✔':"🧙‍♂️", -77+gob.pick*20, -55, 55, 'FFF')
				if(gob.hover && !dragLeft)gAlphaSet(.2)
				if(gob.kind.wizardText)
					gTextDraw(gob.kind.wizardText, gYouX-x, gGroundY+33-y, 33, 'FFF',gob.pick)
				gAlphaSet(1)
			}
			
			if(gGobField.includes(gob) || gob.hover || (gState == 'beat3' && !gob.dead)) {
				gTextDraw(gob.hp, 0, size*1.8, size, 'FFF')
				
				if(gob.kind.str) {
					var color = 'FFF'
					var strSize = size
					var str = gob.str
					if(attackWant && !gob.pick) {
						color = 'F00'
						strSize *= 1.4
						if(!gob.kind.fire)str += gYouStr
					}
					if(str<0)str=0
					if(gob.kind==gGobKinds.torcher)str='x'+gob.str
					gTextDraw(str, size*1.8, size*1.4, strSize, color)
				}
			}

			if(!dragLeft && gob.kind.info) {
				var will = str>=gEnemy.hp && !gob.pick
				if(gob.hover || (attackWant && will && gob.kind.killFun)) {
					if(gob.hover)gAlphaSet(.3)
					gTextDraw(gob.kind.info, 0, gGroundY+33-y+33, 33, 'FFF',gob.pick)
					gAlphaSet(1)
				}
			}
			
			if(gLoops - gob.speakLoop < 30) {
				gCircleDraw(0, -size*3, size*(.7+gob.speak.length/6), 'EEE', 1)
				gTextDraw(gob.speak, 0, -size*3, size)
			}

			if(gob.hover) {
				gTextDraw(gob.kind.name, 0, -size*1.4, 22, 'FFF')
			}

			gPen.restore()
		} else {
			gPen.restore()
			gGobDraw2(gob, x,y,size,1)
		}
	},
	gListRemove = (list, item) => {
		var i = list.indexOf(item)
		if(i>=0)
			list.splice(i,1)
	},
	gGobSwitch = (gob, listNew) => {
		//gLog("gGobSwitch()")
		var lists = [gGobField, gGobGrave, gGobLine, gGobWizard]
		for(var list of lists) {
			gListRemove(list, gob)
		}
		listNew.push(gob)
	},
	gGobSpeak = (gob, text) => {
		gob.speak = text
		gob.speakLoop = gLoops
		gSoundPlay(gGobTalkSound)
	},
	gGobAttack = (gob) => {
		gAttackLoop = gob.attackLoop = gLoops
		gSoundPlay(gGobAttackSound, gob.x)
		gob.ride = 0
	},
	gGobDie = (gob) => {
		if(gob.endX > 800 || gState=='enemyAttack') {
			gob.endX -= gRandomInt(50,300)
		}
		if(gob.x < 300) {
			gob.endX = gRandomInt(300,400)
		}
		gob.endY = gRandomInt(460,480)
		gob.dead = 1
		gob.attackLoop = 0
		gGobSwitch(gob, gGobGrave)
		gob.hp = 0
		gSoundPlay(gGobDieSound, gob.x)
		if(gArea != 'beat')
			gob.kind.dieFun && gob.kind.dieFun(gob)
	},
	gYouTakeDmg = (take) => {
		if(take) {
			gSoundPlay(gYouGotHitSound, gYouX)
			gYouHitLoop = gLoops
			var hp = gYouHp
			gYouHp -= take
		}
	},
	gGameUpdate = () => {
		setTimeout(gGameUpdate, 33)
		gLoops++
		gStateLoops++


		var lo=1e4
		gMouseOnGob = u
		var lists = [...gGobArmy, ...gGobPicks]
		for(var gob of lists) {
			gob.hover = 0
			if(gMouseInRect(gob.x-50, gob.y-50, 100, 200)) {
				var dist = Math.abs(gob.x-gMouseX)
				if(lo>dist) {
					lo=dist
					gMouseOnGob = gob
				}
			}
		}
		
		if(gReviveLoops) {
			if(gReviveLoops==50) {
				for(var gob of gGobLine) {
					gob.endX = -100
					gob.endY = 266
					gob.dead = 0
				}
				if(gArea.name=='Yester')gReviveLoops=40
			}
			gReviveLoops--
			if(gState == 'win' && gReviveLoops < 30) {
				gReviveLoops = 0
			}
			if(!gReviveLoops) {
				if(gState == 'win') {
					gStateSet(gArea.name=='Yester' || gArea.name=='Kinclaven'?'walk2':'walk')
					gGobField = []
					gGobLine = []
					p1`240.40
R-RTV-TRW-VTV-V-T-VWV-TR
M-MQR-Q R-RQR-R-Q-R-R-Q `
				} else {
					gStateSet('summon')
				}
			}
		}
		
		if(gState == 'walk') {
			gYouX+=6
			if(gYouX > 300) {
				gStateSet('winPick')
			}
		}
		if(gState == 'priest') {
			gYouX += 7
			if(gYouX > 700) {
				gStateSet('priest2')
			}
		}
		if(gState == 'beat') {
			gYouX += 7
			if(gYouX > 700) {
				gStateSet('beat2')
				gSoundPlay(gReviveSound, gYouX)
			}
		}
		if(gState == 'walk2') {
			gYouX += 7
			if(!gGetDark) {
				if(gYouX > 1100) {
					gGetDark = 1
				}
			}
		}
		//if(gYouX > 280)gCamX = gYouX-280

		if(gYouPeek && gGobLine.length) {
			
			for(var i=0; i<gYouPeek; i++) {
				var gob = gGobLine[gGobLine.length-i-1]
				if(gob) {
					gob.endX = 41-i*11
				}
			}
		}
		
		if(gState == 'winPick') {
			if(!gGobPicks.filter(gob=>gob.pick).length)
				gStateSet('walk2')
		}
		
		for(var gob of gGobPicks) {
			if(gob.endX != gob.x) {
				gob.x += Math.sign(gob.endX-gob.x)*10
				if(Math.abs(gob.endX-gob.x)<=10) {
					gob.x = gob.endX
				}
			}
		}

		var speed = gState=='intro2'||gState=='intro3' ? 1:33
		for(var gob of gGobArmy) {
			if(gob.dead) {
				gob.dead++
			}
			if(gState == 'walk' || gState == 'walk2' || gState == 'priest' || gState == 'beat') {
				gob.endX = gYouX-10-gGobArmy.indexOf(gob)*30
				gob.endY = gYouY
			}
			if((gState == 'priest2' && !gob.kill) || gState == 'beat2') {
				gob.endX = gYouX-50-gGobArmy.indexOf(gob)/gGobArmy.length*620
				gob.endY = gYouY
			}
			if(gob != gGobDrag) {
				if(gob.x < gob.endX) {
					if(gob.x < gob.endX-speed) {
						gob.x += speed
					} else {
						gob.x += (gob.endX-gob.x)*.4+1
					}
					if(gob.x > gob.endX) {
						gob.x = gob.endX
					}
				}
				if(gob.x > gob.endX) {
					gob.x -= speed
					if(gob.x < gob.endX) {
						gob.x = gob.endX
					}
				}
			}
			gob.y += Math.sign(gob.endY-gob.y)*7
			if(Math.abs(gob.endY-gob.y)<=7)
				gob.y = gob.endY
		}

		if(gState == 'enemyAttack') {
			if(gBallDmg) {
				gBallX -= 19
			}
			if(gShitDmg) {
				gShitX -= 19
				var y0 = gEnemy.y - gEnemy.size*1.4
				var x0 = gEnemy.x
				gShitY = y0-gArcGet(gShitX, gYouX, x0)*66+gEase(gShitX, x0-111, gYouX,0,111)
			}
		}
		
		for(var gob of gGobArmy) {
			if(gob.attackLoop) {
				gob.endX = 810
				if(gob.x >= gob.endX-10) {
					gGobDie(gob)
					if(gob.kind.fire) {
						if(gob.kind.fire == 1)
							gEnemy.fire += gob.kind.str
						else
							gEnemy.fire *= gob.kind.fire
					} else {
						var dmg = Math.max(0, gob.str + gYouStr)
						gEnemyHpAdd(-dmg, gob)
						if(!gEnemy.hp && gob.kind.killFun) {
							gob.kind.killFun(gob)
						}
					}
				}
			}
		}
		for(var gob of gGobField) {
			if(gState == 'enemyAttack' || (gState=='pos' && gBallX<gEnemy.x)) {
				if(gBallX < gob.x+55 && !gob.dead) {
					var hp = gob.hp
					gob.hp -= gBallDmg
					gBallDmg -= hp
					if(gob.hp < 1) {
						gGobDie(gob)
					} else {
						gSoundPlay(gGobGotHitSound, gob.x)
					}
					if(gBallDmg <= 0) {
						gTurnStart()
					}
				}
			}
		}
		
		if(gState == 'enemyAttack') {
			if(gBallX < gYouX+30 || gShitX < gYouX+30) {
				if(gBallDmg) {
					var take = Math.max(0, gBallDmg-gYouDef)
					gYouTakeDmg(take)
					gBallDmg = 0
				}
				if(gShitDmg) {
					if(gShitKind == 'str')gYouStr -= gShitDmg
					if(gShitKind == 'def')gYouDef -= gShitDmg
					gShitDmg = 0
					gSoundPlay(gYouDowngradeSound)
				}
				
				gTurnStart()
				if(gYouHp < 1) {
					gYouHp = 0
					gStateSet('die')
					gGetDark = 1
					gTitleMusicPlay()
				}
			}
		}

		if(gState == 'summon') {
			if(gGobField.length >= gDrawUntil) {
				gStateSet('pos')
			} else {
				var gob = gGobLine[gGobLine.length-1]
				if(gob) {
					//gob.x = gGobField.length*-77
					gGobSwitch(gob, gGobField)
					gob.summonFunLoop = 0
				} else {
					if(gGobGrave.length) {
						gStateSet('revive')
					} else {
						gDrawUntil = 0
					}
				}

			}
			gGobBattlePos()
		}

		if(gState == 'pos') {
			var ready=1
			for(var gob of gGobArmy) {
				if(~~gob.x != ~~gob.endX) {
					ready=0
				}
			}
			if(ready) {
				for(var gob of gGobArmy) {
					if(gGobField.includes(gob) && !gob.summonFunLoop && gob.kind.summonFun) {
						gob.summonFunLoop = gLoops
						gob.kind.summonFun(gob)
						ready = 0
					}
					if(gob.wizard == 1) {
						gob.kind.wizardFun && gob.kind.wizardFun(gob)
						gob.wizard = 2
						ready = 0
					}
					if(gob.ride) {
						if(gob.ride == 2) {
							gob.endY = (gob.y-=40)
						}
						gGobAttack(gob)
					}
				}
			}
			if(ready) {
				if(gBallX < gEnemy.x)
					gStateSet('enemyAttack')
				else
					gStateSet('turn')
			}
		}
		
		gGameDraw()
		gClicked = 0
	},
	gGobBattlePos = () => {
		var i=0
		for(var gob of gGobField) {
			gob.endX = 700-(i/gGobField.length)*520
			i++
		}
	},
	gAlphaSet = a => gPen.globalAlpha = Math.abs(a),
	gRandomFake = (i) => {
		var num = Math.PI/(i+4) % 1 + ''
		num = num.substr(num.length-4)*1
		return num/1e4
	},
	gPickLoops = (array) => array[(gLoops-gStateLoops+gAreaMode)%array.length],
	gPriestDraw = (x,y,size) => {
		var shake = gState=='priest3' && gStateLoops>9 && gStateLoops<50 ? Math.sin(gLoops*.6)*3 : 0
		//shadow
		gOvalDraw(x, y, size*1.8,12)
		//hand
		gLineDraw(x-size*1.8, y-size*2.9+shake, size*.3,0,size*.6,'DCC', gBorder)
		//cross
		gLineDraw(x-size*2, y-size*3.5+shake, 0, size*.8, size*.23, 'C96', gBorder)
		gLineDraw(x-size*2.2, y-size*3.2+shake, size*.4, 0, size*.23, 'C96', gBorder)
		//body
		gPathDraw(x, y-120, `l19,9 1,-1 2,2 2,-1 3,4 0,18 -12,-6 1,29 5,3 -40,0 5,-3 1,-30 -10,${5+shake} 0,-${19+shake/2} 2,0 1,-1 2,0 1,-1 2,0`, 2, 'EEE')
		y-=140
		//head
		gCircleDraw(x,y,30,'EDB',1)
		gCircleDraw(x,y,5,'FFF')
		gCircleDraw(x-2,y,3,'8AF')
		gCircleDraw(x-22,y,5,'FFF')
		gCircleDraw(x-22-2,y,3,'8AF')

		
		var talk = gArea=='priest' && !gSpeechDrawDone ? Math.sin(gSpeechDrawLoops*.8) : 0
		gOvalDraw(x-size*.5, y+size*.6, size*.3, size*.06+talk, 'DAA')
		if(gYouX > 300) {
			if(gState=='walk2') {
				if(gYouX > 1e3) {
					var text = gPickLoops(["See you in hell!\nFrom heaven","You must repent!\nLike "+gGobArmy.length+" times","You will regret\ndeals with the devil."])
					gSpeechDraw(text, x-30, y)
				}
			} else {
				if(gState == 'priest3') {
					if(gStateLoops > 20) {
						gSpeechDraw(gPickLoops(["INFERNUM DETRUDE","EXPECTO PATRONUM","INSIDIAS DIABOLI","SUMMON ARCHANGEL"])+"!", x-33, y)
						if(gStateLoops == 30) {
							gGobKill.dead = 1
							gSoundPlay(gGobDieSound, gGobKill.x)
						}
						if(gStateLoops == 40) {
							gGobKill.endY = 1e3
						}
						if(gStateLoops == 100) {
							gListRemove(gGobArmy, gGobKill)
							if(gGobArmy.length > 20 && gRandom()<.5 && !gAreaMode) {
								gStateSet("priest")
								gAreaMode++
							} else {
								gStateSet("walk2")
							}
						}
					}
				} else {
					var dear = gPickLoops(["Dear God","Dear Lord","Sweet Jesus","Holy Mother","My God"])
					gSpeechDraw(gState=='priest' ? dear+"!\nWhat an infernal horde!" : (gAreaMode?"They even blink in unison.\nI must banish another.": "Let me banish one\nstraight to hell!"),x-33,y)
				}
			}
		}
	},
	gYouDraw = () => {
		var x = gYouX, y=gYouY, size=30

		gPen.save()
		gPen.translate(x,y)
		if(gState=='die' || gState=='beatDie') {
			gPen.rotate(gGetDark/33)
			gPen.translate(gGetDark*2,0)
		}
		if(gState == 'beat3') {
			gPen.scale(-1,1)
		}

		if(gState!='intro') {
			gOvalDraw(0, 131, size*1.3,12)
			
			if(gLoops-gYouHitLoop < 12) {
				gAlphaSet(Math.sin(gLoops))
			}
			var handY = gReviveLoops>40?gWave(.6,4):0
			var handX = Math.min(5,gArcGet(gLoops-gAttackLoop,0,7)*9)
			handX -= gArcGet(gLoops-gSpecialLoop,0,7)*7
			for(var pass2=0; pass2<2; pass2++){
				var color = pass2?'46C':'000'
				var add = pass2?0:gBorder*2
				//arms
				gLineDraw(-50,70,50,-50,size*.7+add,color)
				gLineDraw(0,40,50+handX,handY,size*.7+add,color)
				//legs
				var walk = (gState=='walk' || gState=='walk2' || gState=='priest' || gState=='beat')*5
				gLineDraw(-15,90,0,30+gSin(gLoops*.8)*walk,size*.7+add,color)
				gLineDraw(15,90,0,30+gSin(gLoops*.8+1.7)*walk,size*.7+add,color)
				//torso
				gLineDraw(0,40,0,40,size*1.7+add,color)
				//wand
				var color = pass2?'FD4':'000'
				gLineDraw(54+handX, 25+handY, 0, 5, size*.5+add, color)
				gLineDraw(54+handX, 30+handY, 0, 90, size*.3+add, color)
			}
			gCircleDraw(0,0,30,'EDA',1)
		}
		//eyes
		gCircleDraw(0,0,5,'FFF')
		gCircleDraw(2,0,3,'8AF')
		gCircleDraw(22,0,5,'FFF')
		gCircleDraw(22+2,0,3,'8AF')
		for(var i=0; i<2; i++)
			gRectDraw(-9+i*21, -6, 15, gState=='intro' && gLoops<80?11:gArcGet(gLoops%160,76,84)*11, gState!='intro'&&'EDA')

		if(gState!='intro') {
			//nose
			gLineDraw(12,4,10,10,size*.1)
			gLineDraw(12,14,10,0,size*.1)
			//hat
			gPathDraw(-50,-50,' l6,-6 13,3 16,17 -5,5 -7,-7 -3,0 -18,10 -4,-2 7,-7 0,-15',size/10,'47D')
			gTextDraw("*",-20,-50,22,'ABF',1)
			gTextDraw("*",-15,-22,22,'ABF',1)
			gTextDraw("*",5,-35,22,'ABF',1)
			//beard
			var talk = !gAreaIndex && !gSpeechDrawDone ? Math.sin(gSpeechDrawLoops*.6) : 0
			gPathDraw(-5,29+talk,'l5,-5 3,3 -1,6 -1,-2 -2,7',size/10,'EEE')
	
			//stats
			if(gEnemy.hp && gAreaIndex) {
				gTextDraw("💪"+gYouStr, 55, 0, 22, 'FFF')
				gTextDraw("🛡"+gYouDef, -55, 0, 22, 'FFF')
			}
			if(gState == 'beat3') {
				gPen.scale(-1,1)
			}
			gTextDraw(gYouHp, 0, 80,30,'FFF')
		}
		
		gPen.restore()
	},
	gSpeechText,
	gSpeechDrawLoops=0,
	gSpeechDrawDone,
	gSpeechDrawVowel='a',
	gSpeechDraw = (text, x, y) => {
		if(text != gSpeechText) {
			gSpeechText = text
			gSpeechDrawLoops = 0
		}
		gSpeechDrawLoops+=gMouseDown?3:1
		var flip = gArea.name=='Yester' || ['beat','king','king3'].includes(gState) ? 22:0
		gPathDraw(x-flip*1.9, y, `l${flip} -32c95,0 95,-50 0,-50c-115,0 -110,50 -20,53`, 2, 'EEE')
		var texts = text.split('\n')
		y -= texts.length*11
		var total=gSpeechDrawLoops
		gPen.textAlign = 'left'
		for(var text of texts) {
			gTextDraw('',0,0,22)
			var x2 = x-gTextWidth(text)/2-18
			for(var i=0; i<text.length; i++) {
				var letter = text[i]
				gTextDraw(letter, x2, y-101, 22)
				x2 += gTextWidth(letter)
				if('aeiouwy'.indexOf(letter)>=0)
					gSpeechDrawVowel = letter
				total--
				if(total<1) {
					if(gSpeechDrawLoops % 4 == 0 && letter!='.') {
						var gobIs = gArea=='priest' || gAreaIndex==0?1:4
						var pitch = gRandomInt(36,46) - (gSpeechDrawVowel=='u' || gSpeechDrawVowel=='w')*10 + (gSpeechDrawVowel=='e' || gSpeechDrawVowel=='i' || gSpeechDrawVowel=='y')*10
						gSoundPlay(gSoundEffectMake([pitch,36,.1], (i,len) => gRandom()*.5-(i%400*gobIs<200*gobIs?1:0) ))
					}
					gPen.textAlign = 'center'
					gSpeechDrawDone = 0
					return
				}
			}
			y+=22
		}
		gSpeechDrawDone++
		gPen.textAlign = 'center'
	},
	gTextWidth = (text) => gPen.measureText(text).width,
	gGameDraw = () => {
		if(gState == 'die2') {
			gRectDraw(0,0,1e3,1e3)
			var y = 70
			gTextDraw("Hugo The Wizard", 500, y, 40, 'EEE')
			gTextDraw("Game Over", 500, y+=55, 62, 'EEE')
			for(var total=0,all=0,i=1; i<gAreaIndex;i++) {
				if(gAreas[i].name) {
					total++
				}
			}
			gTextDraw("Castles Conquered: "+total+" of "+(gCastles.length-1), 500, y+=77, 30, 'EEE')
			gTextDraw("🔁", 500, y+=130, 99)
			if(gMouseDown && gMouseInRect(450,y-55,99,99))
				location.reload()
		} else if(gArea == 'credits') {
			gRectDraw(0,0,1e3,1e3)
			var y = 60
			gTextDraw("Hugo The Wizard", 500, y, 32, 'EEE')
			gTextDraw("CREDITS", 500, y+=50, 66, 'EEE')
			gTextDraw("Music", 500, y+=66, 36, 'EEE')
			gTextDraw("Alta Trinita Beata - Laudario di Cortona - 1200s", 500, y+=30, 26, 'EEE')
			gTextDraw("Totus Floreo - Unknown - 1200s", 500, y+=30, 26, 'EEE')
			gTextDraw("Goblin Battle - Curtastic - 2023", 500, y+=30, 26, 'EEE')
			gTextDraw("The Bonnie Banks o' Loch Lomond - Unknown - 1700s", 500, y+=30, 26, 'EEE')
			gTextDraw("Code", 500, y+=56, 36, 'EEE')
			gTextDraw("Developer - Curtastic", 500, y+=30, 26, 'EEE')
			gTextDraw("NEAR integration - Vertfromage", 500, y+=30, 26, 'EEE')
			gTextDraw("Compression - RoadRoller", 500, y+=30, 26, 'EEE')
		} else {
			gRectDraw(0,0,1e3,1e3,'8BF')
			gRectDraw(0,300,1e3,1e3,'5A5')
	
			for(var layer=0; layer<2; layer++) {
				for(var i=0; i<11; i++) {
					gTextDraw('🌲', i*100+layer*50-gCamX*(.7+layer*.03), 260+layer*20, 111+layer*22, 'FFF')
				}
			}
	
			var gob = gGobPicks[0]
			if(gob && gob.x<=gob.endX && gob.pick) {
				gSpeechDraw("We want to join your army.\nWe travel together.", gob.x-29, gob.y)
			}
			var gob2 = gGobPicks[gGobPicks.length-2]
			if(gob && gob2 && gob2.group!=gob.group && gob2.x<=gob2.endX && gob2.pick) {
				if(gSpeechDrawDone && !gob2.speak)gGobSpeak(gob2, "Us too!")
			}
	
			if(gArea == 'priest') {
				gPriestDraw(880, gGroundY, 30)
			}
			
			for(var gob of gGobPicks) {
				gGobDraw(gob)
			}
	
			if(gState=='intro') {
				gRectDraw(0,0,1e3,1e3,'111')
				gAlphaSet(gEase(gStateLoops,5,25,0,1))
				gTextDraw("1267 A.D.", 500, 111, 66, 'EEE')
				gAlphaSet(gEase(gStateLoops,35,65,0,1))
				gTextDraw("Yester Castle, Scotland", 500, 177, 44, 'EEE')
				gAlphaSet(1)
				if(gClicked && gStateLoops>50) {
					gStateSet("intro2")
				}
			} else if(gArea.name == 'Yester') {
				gAlphaSet(.8)
				gRectDraw(0,0,1e3,1e3,'666')
				gAlphaSet(1)
				gTowerDraw(22, gGroundY+111, 299)
				gTowerDraw(680, gGroundY+111, 299)
				for(var i=0; i<11; i++) {
					var size = 7-i*.52+(i**1.3)/8
					gPathDraw(500-size*50, 700-i**1.1*9, 'l0-30c-2,-60 30,-80 50,-90c20,10 52,30 50,90l0 30', size, i<10?'678':'789', i?7:33)
				}
				gPathDraw(150, 505, 'l0,-20 47,-45 119,0 46,45 0,20', 3.3, '678')
				gPathDraw(150, 650, 'l0,-20 47,-45 119,0 46,45 0,20', 3.3, '876')
				gRectDraw(305,292,392,140,'789')
				gTextDraw("GOBLIN HALL", 500, 330, 44, "89A")
			}
			if(gArea.hp && gState!='intro') {
				var addX = Math.sin(gLoops/2)*gArcGet(gLoops-gEnemy.hitLoop,0,7)*4
				if(gEnemy.doorIs)addX-=40
				gTowerDraw(gEnemy.x+addX, gEnemy.y, gEnemy.size, gEnemy.doorIs)
				for(var i=0; i<gEnemy.fire; i++) {
					var x = gRandomFake(gAreaIndex+i*3)
					var y = gRandomFake(gAreaIndex+i*7)
					if(gEnemy.dieLoops) {
						x+=.5
					}

					var fireSize = 33
					if(gLoops-gEnemy.fireLoop < 7) {
						fireSize+=gArcGet(gLoops-gEnemy.fireLoop,0,7)*9
					}
					gTextDraw("🔥", gEnemy.x+17+(gEnemy.size-34)*x, gEnemy.y-100*y, fireSize)
				}
			}

			for(var gob of gGobArmy) {
				if(gob.specialLoop) {
					gGobDraw(gob)
				}
			}
	
			var youBg = (gAreaIndex>0 && gEnemy.hp) || gState=='priest2'
	
			for(var gob of gGobLine) {
				gGobDraw(gob)
			}
			
			if(youBg) {
				gYouDraw()
			}
	
			if(gState != 'intro') {
				for(var gob of gGobArmy) {
					if(gob!=gGobDrag && !gob.specialLoop && !gGobLine.includes(gob)) {
						gGobDraw(gob)
						gAlphaSet(1)
					}
					if(gState == 'intro2' || gState == 'intro3') {
						if(gRandom()<.01) gob.endX+=gRandomInt(-19,19)
					}
				}
			}
			if(gGobDrag) {
				gob = gGobDrag
				gGobDraw(gob)
			}
	
			if(gState == 'win' && gArea.name == 'Yester' && gLoops%20<10) {
				var gob = gGobGrave[0]
				if(gob) {
					gTextDraw('👆', gob.x+22, gob.y+22, 55)
				}
			}
	
			if(gState == 'priest3') {
				if(gStateLoops > 90) {
					if(gStateLoops == 91)
						gSoundPlay(gBurnSound, gGobKill.x)
					gTextDraw("🔥", gGobKill.x+30, 510-gArcGet(gStateLoops,90,100)*30, 122)
				}
			}
	
			if(!youBg) {
				gYouDraw()
			} else {
			}
			if(gEnemy.hp && gAreaIndex)
				gTextDraw('👺'+gGobLine.length, 25, 200, 22,'fff')
	
			if(gArea.hp && !gEnemy.doorIs) {
				gBallDraw(gEnemy.size)
				gShitDraw(gEnemy.size)
			}
	
			if(gAreaIndex==1) {
				gEnemy.dieLoops=0
				gTowerDraw(-184, gGroundY+111, 310)
			}
			
			if(gState == 'king') {
				gSpeechDraw("ALEXANDERRRRR!!!", gYouX+77, gYouY)
				if(gSpeechDrawDone && gMouseDown) {
					gStateSet('king2')
				}
			}
			
			if(gState == 'king3') {
				gSpeechDraw("I am Hugo the Wizard now,\nand I have a goblin army!", gYouX+77, gYouY)
				if(gSpeechDrawDone && gMouseDown) {
					gTurnStart()
				}
			}
			
			if(gState == 'intro2') {
				gAlphaSet(gEase(gStateLoops,0,20,1,0))
				gRectDraw(0,0,1e3,1e3,'111')
				gAlphaSet(1)
				if(gStateLoops>50) {
					gSpeechDraw("HA HA HA!\nMy goblin army has done it!", gYouX+77, gYouY)
					if(gSpeechDrawDone && gClicked) {
						gStateSet('intro3')
					}
				}
			}
			
			if(gState == 'intro3') {
				if(gStateLoops>10) {
					gSpeechDraw("If you can build this\nmagnificent castle... Can we\n...conquer Scotland???", gYouX+77, gYouY)
					if(gSpeechDrawDone && gClicked) {
						gStateSet('intro4')
					}
				}
			}
			
			if(gState == 'intro4') {
				if(gStateLoops>10) {
					gSpeechDraw("Stabbie!\nOpen the door!", gYouX+77, gYouY)
					if(gSpeechDrawDone) {
						gTextDraw("👆", 500+gEase(gStateLoops%50,0,30,0,60),444, 60)
					}
				}
			}

			if(gArea == 'beat') {
				for(var outline=gBorder; outline>=0; outline-=gBorder) {
					var color = !outline&&'BAB'
					gRectDraw(733+2,gGroundY-28,25,30,color,outline)
					gRectDraw(733+75,gGroundY-28,25,30,color,outline)
					gRectDraw(733,gGroundY-58,102,28,color,outline)
				}
				var addY = gEase(gState=='beat3' || gState=='beatWin' ? 1e3 : (gState=='beatDie' ? 10-gStateLoops : gStateLoops),0,10,0,96)*(gState!='beat')
				gTextDraw("👑", 784-addY*.8, gGroundY-82-addY, 66)

				var devilX = gEase(gState=='beat3'?1e3:(gState=='beat' ? 0: gStateLoops), 60, 110, 1111, 888)
				if(gState == 'beatWin')
					devilX = gEase(gStateLoops, 0, 33, 888, 1222)
				var devilY = 166
				gTextDraw('😈', devilX, devilY, 222)
				
				if(gState == 'beat2') {
					if(gStateLoops > 120) {
						gSpeechDraw("Well done.\nBut you sold me your soul.\nKill him my minions!!!", devilX-77, devilY)
						if(gSpeechDrawDone && gMouseDown) {
							gStateSet('beat3')
							gBattleMusicPlay()
						}
					}
				}
				
				if(gState == 'beat3') {
					var alive
					for(var gob of gGobArmy) {
						if(!gob.dead) {
							if(gob.endX<gYouX-55 && gStateLoops*2>gYouX-~~gob.x) {
								gob.endX = gYouX
							}
							if(gob.x >= gYouX-55) {
								gob.endX = gob.x
								gYouTakeDmg(gob.str)
								gGobDie(gob)
								if(gYouHp < 1) {
									gYouHp = 0
									gStateSet('beatDie')
									gGetDark = 1
								}
							}
							alive = 1
						}
						if(gob.dead<55)
							alive = 1
					}
					if(!alive) {
						gSpeechDraw("Hmm... you survived.\nOh well you're getting old.\nI'll see you soon anyways.", devilX-77, devilY)
						if(gSpeechDrawDone > 20) {
							gStateSet("beatWin")
							gGetDark = 1
						}
					}
				}
			}
			
			if(gState == 'beat') {
				if(gStateLoops>10) {
					gSpeechDraw("I did it!\nThe crown is mine!", gYouX+77, gYouY)
				}
			}
			
			if(gState == 'turn') {
				gRectDraw(800-gBorder,410-gBorder,190+gBorder*2,80+gBorder*2,0)
				gRectDraw(800,410,190,80,'444')
				gTextDraw("Done", 800+190/2, 410+40, 33, 'fff')
				gTextDraw("🛡"+Math.max(0, gGobField.reduce((val,gob)=>val+(gob.attackLoop?0:gob.hp),gYouDef)), 800+190/2, 410+66, 20, 'fff')
			}
	
			if(!gMouseDown && gState!='intro') {
				if(gMouseOnGob) {
					gMouseOnGob.hover = 1
					gGobDraw(gMouseOnGob)
				}
			}
			
			if(gGetDark) {
				gGetDark++
				if(gGetDark>60) {
					gGetDark = 0
					if(gState=='die') {
						gStateSet('die2')
					} else {
						p1``
						gAreaGo()
					}
					gAlphaSet(1)
				} else {
					gAlphaSet(gGetDark/60)
				}
				gRectDraw(0,0,1e3,1e3)
				gAlphaSet(1)
			}
		}
		gTextDraw(gMuted?"🔈":"🔊",44,44,55)
	},
	gTurnStart = () => {
		gDrawUntil = 3
		gLog('turnStart()')
		gStateSet('summon')
		if(gRandom() < .4) {
			gBallDmg = 0
			gShitDmg = gRandomInt(1,2)+gAreaIndex/5|0
			gShitKind = gRandom()<.5 ? 'str':'def'
		} else {
			gShitDmg = 0
			gBallDmg = gRandomInt(6, 12)+gAreaIndex/2|0+gEnemy.str
		}
		gEnemy.str++
		gBallX = gEnemy.x
		gBallY = gEnemy.y - gEnemy.size*.55
		
		gShitX = gEnemy.x
		gShitY = gEnemy.y - gEnemy.size*1.4
	},
	gEnemyHpAdd = (add) => {
		gEnemy.hp += add
		gEnemy.hitLoop = gLoops
		if(gEnemy.hp <= 0) {
			gEnemy.hp = 0
			gEnemy.dieLoops = gLoops
			gStateSet('win')
			gSoundPlay(gCastleDieSound, gEnemy.x)
		} else {
			gSoundPlay(gTowerGotHitSound, gEnemy.x)
		}
	},
	gTurnEnd = () => {
		if(gEnemy.fire) {
			gEnemyHpAdd(-gEnemy.fire)
			gEnemy.fireLoop = gLoops
		}
		if(gEnemy.hp) {
			gStateSet('enemyAttack')
			gSoundPlay(gBallShootSound)
		}
	},
	gGobKindRandomGet = (tier) => {
		var list = []
		for(var key in gGobKinds) {
			var kind = gGobKinds[key]
			if(kind.tier == tier)
				list.push(kind)
		}
		gShuffleArray(list)
		return list[0]
	},
	gGobKindMake = (tier, name, color, size, str, hp, wizardText, wizardFun, info) => gGobKinds[name] = {tier, name, color, size, str, hp, wizardText, wizardFun, info},
	gMouseSet = e => {
		gMouseX = (e.pageX-gGameX)/gGameScale
		gMouseY = e.pageY/gGameScale
	},
	gMouseMove = (e) => {
		gMouseSet(e)
		if(gGobDrag) {
			var addX = gClamp(gMouseX-gMouseStartX, 60)
			if(gGobPicks.length) {
				for(var gob of gGobPicks) {
					if(gob.group == gGobDrag.group)gob.addX = addX
				}
			} else {
				gGobDrag.addX = addX
			}
		}
	},
	gClickEnd = (e) => {
		gMouseSet(e)
		gMouseDown = 0
		gClicked = 1
		if(gGobDrag) {
			if(gMouseX > gMouseStartX+15) {
				if(gState=='priest2') {
					gGobDrag.endX = 800
					gGobKill = gGobDrag
					gStateSet('priest3')
				} else if(gGobDrag.pick) {
					var group = gGobDrag.group
					for(var gob of gGobPicks) {
						if(gob.group == group) {
							gob.pick = 0
							gob.endX = 1e4
						}
					}
				} else {
					if(gGobDrag.kind == gGobKinds.kelpie) {
						for(var gob of gGobField) {
							if(!gob.kind.legs)
								gStateSet('attackPick')
						}
					} else if(gGobDrag.kind == gGobKinds.clone) {
						if(gGobField.length>1)
							gStateSet('attackPickClone')
					} else {
						if(gGobDrag.kind.str)
							gGobAttack(gGobDrag)
					}
				}
			} else if(gMouseX < gMouseStartX-15) {
				gSoundPlay(gGobSpecialSound, gGobDrag.x)
				if(gGobDrag.pick) {
					var group = gGobDrag.group
					for(var i=-1,gob; gob=gGobPicks[++i];) {
						if(gob.group == group) {
							gob.pick = 0
							gob.endX = -i*11
							gGobArmy.push(gob)
							gListRemove(gGobPicks, gob)
							i--
						}
					}
				} else {
					if(gGobLine.length + gGobGrave.length > 0) {
						gSpecialLoop = gGobDrag.specialLoop = gLoops
						gGobDrag.endX = gYouX+gGobArmy.filter(gob=>gob.specialLoop).length*9
						gGobSwitch(gGobDrag, gGobWizard)
						gGobDrag.wizard = 1
						gStateSet('pos')
					}
				}
			} else {
				gSoundPlay(gClickDownSound, gGobDrag.x)
			}
			for(var gob of gGobArmy)
				gob.addX = 0
			for(var gob of gGobPicks)
				gob.addX = 0
			gGobDrag = u
		}
	},
	gClickStart = (e) => {
		gMouseSet(e)
		gMouseDown = 1
		gMouseStartX = gMouseX
		gMouseStartY = gMouseY
		if(gMouseInRect(0, 0, 77, 77)) {
			if(!gMuted)
				gSoundPlay(gClickDownSound, gMouseX)
			gMuted = !gMuted
			if(gMuted) {
				p1``
			} else {
				gSoundPlay(gClickUpSound, gMouseX)
			}
		}
		if(gState == 'turn') {
			if(gMouseInRect(800, 410, 190, 90)) {
				var nope
				for(var gob of gGobField) {
					if(gob.attackLoop)nope=1
				}
				if(!nope)
					gTurnEnd()
			} else {
				for(var gob of gGobField) {
					if(gMouseInRect(gob.x-50, gob.y-50, 100, 200)) {
						gLog(gob)
						gGobDragged = gGobDrag = gob
						gSoundPlay(gGobSelSound, gob.x)
					}
				}
			}
		}
		if(gState == 'winPick') {
			for(var gob of gGobPicks) {
				if(gMouseInRect(gob.x-50, gob.y-50, 100, 200)) {
					gLog(gob)
					gGobDragged = gGobDrag = gob
					gSoundPlay(gGobSelSound, gob.x)
				}
			}
		}
		if(gState=='priest2' || gState=='intro4') {
			var gob = gMouseOnGob
			if(gob) {
				gLog(gob)
				gGobDragged = gGobDrag = gob
				gSoundPlay(gGobSelSound, gob.x)
			}
		}
		if(gState == 'revive' || gState == 'win') {
			if(gMouseY > 410 && !gReviveLoops) {
				for(var gob of gGobGrave) {
					gob.attackLoop = 0
					gob.hp = gob.kind.hp
					gob.endY -= 66
				}
				gGobLine = [...gGobGrave]
				gGobGrave = []
				gReviveLoops = 66
				gSoundPlay(gReviveSound, gYouX)
			}
		}
	},
	gGobMake = (kind) => ({hp:kind.hp, dead:0, str: kind.str, x:-33, endX:-33, addX:0, endY:266, y:266, kind, pick:0}),
	u


onload = _ => {
	gNearBut.onclick = () => gNearLogIn()
	gPen = gCanvas.getContext('2d')
	
	onresize = _ => {
		gPen.textBaseline = 'middle'
		gPen.textAlign = 'center'
		gPen.lineCap = 'round'
		var size = innerWidth>innerHeight*2 ? innerHeight:innerWidth/2
		gCanvas.style.height = size+'px'
		gCanvas.style.width = size*2+'px'
		gGameX = (innerWidth-size*2)/2
		gGameScale = size/500
	}
	onresize()
	
	gGobKindMake(1, 'stabbie', '9A0', 30, 6, 2, "💪+1", gob => {
		gYouStr++
		gSoundPlay(gYouUpgradeSound)
	})
	gGobKindMake(1, 'grog', '990', 34, 2, 6, "🛡+1", gob => {
		gYouDef++
		gSoundPlay(gYouUpgradeSound)
	})
	gGobKindMake(2, 'blobby', '995', 37, 0, 13, "")
	gGobKindMake(2, 'lookout', '9B0', 35, 1, 3, "👁+1👺, 📣👺", gob => {
		gYouPeek++
		gSoundPlay(gYouUpgradeSound)
		gDrawUntil = gGobField.length+1
		gGobSpeak(gob, "📣")
		gStateSet('summon')
	})
	gGobKindMake(2, 'healer', 'BB5', 32, 1, 4, "❤+4", gob => {
		gYouHpAdd(4)
		gSoundPlay(gYouUpgradeSound)
	})
	gGobKindMake(1, 'trainer', 'AB5', 34, 2, 2, "💪+2🛡+2", gob => {
		gYouStr+=2
		gYouDef+=2
		gSoundPlay(gYouUpgradeSound)
	})
	gGobKindMake(2, 'necro', '668', 32, 1, 4, "🧟‍♀️⬆1👺", gob => {
		if(gGobGrave[0])
			gStateSet('revivePick')
	}, "🗡=∑💀")
	gGobKindMake(2, 'clone', '89B', 30, 0, 1, "🛡💪<>0", gob => {
		gYouStr+=Math.sign(gYouStr)
		gYouDef+=Math.sign(gYouDef)
	}, '👺=👺 🔁')
	var kind = gGobKindMake(1, 'burnie', 'B77', 30, 1, 3, "", gob => {
	})
	kind.fire = 1
	
	var kind = gGobKindMake(2, 'torcher', 'C77', 32, 2, 4, "", gob => {
	})
	kind.fire = 2
	
	var kind = gGobKindMake(3, 'pyro', 'D77', 28, 3, 1, "", gob => {
	})
	kind.fire = 1
	
	var kind = gGobKindMake(3, 'caller', '78C', 25, 2, 1, "📣+1👺", gob => {
		gGobSpeak(gob, "📣")
		gDrawUntil = gGobField.length+1
		gStateSet('summon')
	})
	kind.summonFun = (gob) => {
		gDrawUntil++
		gStateSet('summon')
		gGobSpeak(gob, "📣")
	}
	
	var kind = gGobKindMake(3, 'squealer', '5AC', 22, 1, 2, "", u, "💀 → 📣+1👺")
	kind.dieFun = (gob) => {
		gDrawUntil = gGobField.length+1
		gStateSet('summon')
		gGobSpeak(gob, "📣")
	}
	
	var kind = gGobKindMake(3, 'kelpie', '77A', 29, 13, 4, "💀👺", gob => {
		var gob2 = gGobLine.pop()
		if(gob2) {
			gGobDie(gob)
			gGobDie(gob2)
			gob.endX = gob2.endX
		}
	}, "🏇 → ⚔✔")
	kind.legs = 4
	
	var kind = gGobKindMake(2, 'redcap', 'AA0', 30, 5, 4, "💪+1", gob => {
		gYouStr++
	},  "💀 → 🗡+2♾")
	kind.killFun = (gob) => {
		if(!gEnemy.hp) {
			gob.str+=2
			gSoundPlay(gGobUpgradeSound)
			gGobSpeak(gob, '🗡+2')
		}
	}
	
	for(var i=0; i<4; i++) {
		gGobArmy.push(gGobKinds.grog)
		gGobArmy.push(gGobKinds.stabbie)
	}
	gGobArmy = gGobArmy.map(gGobMake)
	
	for(var i=0; i<gCastles.length; i++) {
		gAreas.push(gCastles[i])
		gAreas.push(i?"priest":"introLeave")
	}
	gAreas[gAreas.length-1] = 'beat'
	gAreas.push("credits")
	gAreaGo()
	gYouX = 333
	gYouY = 360
	var y = gYouY-55
	for(var gob of gGobArmy) {
		gob.x = gob.endX = gRandomInt(300,700)
		y += 5
		gob.y = gob.endY = y
	}
	var gob = gGobArmy[gGobArmy.length-1]
	gob.x = gob.endX = gYouX+188
	
	gStateSet('intro')
	//gAreaGo()
	//gAreaIndex=gAreas.length-4;gAreaGo()
	//gAreaGo();gAreaGo();gAreaGo();gAreaGo();gEnemy.hp=44
	
	gGameUpdate()
	
	addEventListener("mousedown", e => {
		gClickStart(e)
	})
	addEventListener("mouseup", e => {
		gClickEnd(e)
	})
	addEventListener("mousemove", e => {
		gMouseMove(e)
	})
	document.addEventListener("touchmove", e => {
		gMouseMove(e.changedTouches[0])
		e.preventDefault()
		return false
	})
	document.addEventListener("touchend", e => {
		gClickEnd(e.changedTouches[0])
		e.preventDefault()
		return false
	})
	document.addEventListener("touchstart", e => {
		gClickStart(e.changedTouches[0])
		e.preventDefault()
		return false
	}, {passive:false})

	gNearSetup()
}


/*
How to convert from piano notes to p1 letters:
|Low C      |Tenor C    |Middle C   |Treble C   |High C
C#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#EF#G#A#BC#D#
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
*/
!function() {
	var buffers = {},
		contexts = [...Array(12).keys()].map(_=>new AudioContext),
		tracks,
		trackLen,
		interval,
		unlocked,
		noteI,
		// Modulation. Generates a sample of a sinusoidal signal with a specific frequency and amplitude.
		b = (note, add) => Math.sin(note*6.28 + add),
		// Instrument synthesis.
		pianoify = (note) => b(note, b(note,0)**2 + b(note,.25)*.75 + b(note,.5)*.1)
	
	var makeNote = (note, seconds, sampleRate, later) => {
		//gLog("makeNote = ()", note, seconds, sampleRate, later)
		var key = note+''+seconds+later
		var buffer = buffers[key]
		if(note>=0 && !buffer) {
			
			// Calculate frequency/pitch. "Low C" is 65.406
			note = 65.406 * 1.06 ** note / sampleRate
			
			var i = sampleRate * seconds | 0,
				sampleRest = sampleRate * (seconds - .002),
				bufferArray
			buffer = buffers[key] = contexts[0].createBuffer(1, i, sampleRate)
			buffer.later = later
			bufferArray = buffer.getChannelData(0)
			
			// Fill the samples array
			var pow = (Math.log(1e4 * note) / 2) ** 2
			for(;i--;) {
				bufferArray[i] =
					// The first 88 samples represent the note's attack
					(i < 88 ?
						i / 88.2
						// The other samples represent the rest of the note
						: (1 - (i - 88.2) / sampleRest) ** pow
					) * pianoify(i * note)/4
			}
			
			// Safari hack: Play every audioContext then stop them immediately to "unlock" them on ios.
			if(!unlocked) {
				contexts.map(context => playBuffer(buffer, context, unlocked=1))
			}
		}
		return buffer
	}
	
	var playBuffer = (buffer, context, stop, later) => {
		if(gMuted)return
		var source = context.createBufferSource()
		source.buffer = buffer
		source.connect(context.destination)
		var f = ()=>source.start()
		if(later>0) {
			setTimeout(f, later)
		} else {
			f()
			if(later<0)
				setTimeout(() => playBuffer(buffer, context), -later)
		}
		stop && source.stop()
	}
	
	p1 = (params) => {
		var tempo = 125, noteLen = .5, custom, noteOld, bufferOld
		tracks = params[trackLen = 0].replace(/[\!\|]/g,'').split('\n').map(track =>
			track>0 ?
				(
					custom = 1,
					track = track.split('.'),
					tempo = track[0],
					noteLen = track[1]/100 || noteLen
				)
			:
				track.split('').map((letter, i, letters) => {
					var duration = 1,
						note = letter.charCodeAt(0)
					note -= letter>0 ? 53-noteOld : (note>90 ? 71 : 65)
					while(track[i+duration]=='-' || track[i+duration]>0) {
						duration++
					}
					if(trackLen<i)trackLen=i+1
					if(note>0)noteOld = note
					return makeNote(letter=='='?noteOld:note, duration*noteLen*tempo/125, 44100, letter>0?tempo/2: (letter=='='||letters[i+1]==':'?-tempo/2:0))
				})
		)
		if(custom)tracks.shift()
		
		noteI = 0
		clearInterval(interval)
		interval = setInterval(j => {
			tracks.map((track,trackI) => {
				if(track[j = noteI % track.length]) {
					playBuffer(track[j], contexts[trackI*3+noteI%3], 0, track[j].later)
				}
			})
			noteI++
			noteI %= trackLen
		}, tempo)
	}
}()


var gSoundEffectContext = new (window.AudioContext || webkitAudioContext)()
var gSoundEffectMake = function(notes, fun) {
	// Calculate total duration, adding up duration of each note.
	var seconds = 0
	for(var i=0; i<notes.length; i+=3) {
		seconds += notes[i+2]
	}
	
	// Make the array buffer.
	var bytesPerSecond = gSoundEffectContext.sampleRate;
	var songLength = Math.round(bytesPerSecond * seconds)
	var audioBuffer = gSoundEffectContext.createBuffer(1, songLength, bytesPerSecond)
	
	// Make 2 buffers so that notes can overlap a bit without overwriting part of eachother.
	var bytes = audioBuffer.getChannelData(0)
	var bytes2 = new Float32Array(songLength)
	
	var songByteI = 0
	var fadeIn = 0, fadeOut = 0
	var pi2 = Math.PI*2
	
	// Each note uses 3 slots in the passed in array.
	for(var i=0; i<notes.length; i+=3) {
		// Calculate how many buffer array slots will be used for fade in / fade out of this note.
		fadeIn = bytesPerSecond * .01 | 0
		// Overlap the fades of the notes.
		//songByteI -= Math.min(fadeOut, fadeIn)
		fadeOut = bytesPerSecond * .01 | 0
		
		// Calculate sine wave multiplier for start/end frequency.
		var multiplier = pi2 * notes[i]*10 / bytesPerSecond
		var multiplier2 = pi2 * notes[i+1]*10 / bytesPerSecond
		
		var noteLen = bytesPerSecond * notes[i+2] | 0
		
		// Alternate which buffer we are writing to.
		var bytesForNote = i/5%2 ? bytes2 : bytes

		var byteI2 = 0
		for(var byteI=0; byteI<noteLen; byteI++) {
			// Smoothly transition from start frequency to end frequency of this note.
			var far = byteI/noteLen
			var angle = byteI2 * (multiplier2*far + multiplier*(1-far))
			var v = Math.sin(angle)
			byteI2++
			if(fun)byteI2 += fun(byteI,noteLen)
			// Apply fade in / fade out by adjusting the volume.
			if(byteI < fadeIn) {
				v *= byteI / fadeIn
			} else if(byteI > noteLen-fadeOut) {
				v *= (noteLen-byteI) / fadeOut
			}
			
			bytesForNote[songByteI++] = v
		}
	}
	
	// Combine the 2 channels into 1. Average them together for when note's fades slightly overlap.
	for(var i=0; i<songLength; i++) {
		bytes[i] = (bytes[i]+bytes2[i])/2
	}
	
	return audioBuffer
}

// This is a generic function for playing JS audioBuffers.
var gSoundPlay = function(audioBuffer, x) {
	if(gMuted)return
	var source = gSoundEffectContext.createBufferSource()
	if(!source) {
		return false
	}

	var gVolume = .7
	var volume = 1
	
	source.buffer = audioBuffer
	
	var gainNode = gSoundEffectContext.createGain()

	if(x !== u) {
		var gainNode2 = gSoundEffectContext.createGain()

		var pan01 = gClamp(x/1e3,0,1)
		
		gainNode.gain.value = volume * gVolume * (1 - pan01)
		gainNode2.gain.value = volume * gVolume * pan01

		
		var splitter = gSoundEffectContext.createChannelSplitter(2)
		source.connect(splitter, 0, 0)
		var merger = gSoundEffectContext.createChannelMerger(2)
		
		splitter.connect(gainNode, 0)
		splitter.connect(gainNode2, 0)
		
		gainNode.connect(merger,0,0)
		gainNode2.connect(merger,0,1)
		merger.connect(gSoundEffectContext.destination)
	}
	else
	{
		gainNode.gain.value = volume * gVolume
		source.connect(gainNode)
		gainNode.connect(gSoundEffectContext.destination)
	}
	
	source.start(0)
	return source
}

var gClickDownSound = gSoundEffectMake([18, 16, .1])
var gClickUpSound = gSoundEffectMake([24, 36, .06])
var gGobSelSound = gSoundEffectMake([24, 36, .09], (i,len) => Math.sin(i/len*19)*.5)
var gYouUpgradeSound = gSoundEffectMake([20,25,.1, 20,30,.1], (i,len) => (i%10000<8000?-.02:.02))
var gYouDowngradeSound = gSoundEffectMake([30,20,.1, 25,20,.1], (i,len) => (i%10000<8000?-.02:.02))
var gReviveSound = gSoundEffectMake([25,25,.1, 30,30,.1, 37, 37, .15], (i,len) => (i%10000<8000?-.02:.02))
var gGobAttackSound = gSoundEffectMake([24, 36, .06, 20, 30, .09, 50, 50, .05], (i,len) => Math.sin(i/len*19)*.5)
var gGobSpecialSound = gSoundEffectMake([24, 36, .09, 20, 30, .09, 40, 40, .05], (i,len) => Math.sin(i/len*19)*.5)
var gCastleDieSound = gSoundEffectMake([26, 16, .4, 46, 16, .15, 36, 26, .1], (i,len) => gRandom()*.1-(i%1000<500?1:0) )
var gGobTalkSound = gSoundEffectMake([86,86,.08, 96,116,.2], (i,len) => gRandom()*.1-(i%1300<900?1:0) )
var gGobGotHitSound = gSoundEffectMake([138,119,.08], (i,len) => gRandom()*.3-(i%1000<700?1:.57) )
var gGobDieSound = gSoundEffectMake([138,119,.08,138,109,.2], (i,len) => gRandom()*.3-(i%1000<700?1:.37) )
var gBallShootSound = gSoundEffectMake([86,9,.2], (i,len) => gRandom()*.1-(i%1000<700?1:.7) )
var gGobUpgradeSound = gSoundEffectMake([55,55,.1, 60,60,.1, 67,67,.2])
var gTowerGotHitSound = gSoundEffectMake([86,9,.05,86,9,.1,86,69,.2], (i,len) => gRandom()*.1-(i%1000<700?1:.7) )
var gYouGotHitSound = gSoundEffectMake([58,29,.3], (i,len) => gRandom()*.3-(i%10000<5000?1:.57) )
var gBurnSound = gSoundEffectMake([38,49,.3], (i,len) => -gRandom()*3)


async function gNearSetup() {
    try {
          // Initialize NEAR
          const near = await nearApi.connect({
            networkId: 'mainnet',
            keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore(localStorage, 'Hugo the Wizard'),
            nodeUrl: 'https://rpc.mainnet.near.org',
            walletUrl: 'https://wallet.mainnet.near.org', // NEAR Wallet URL
            deps: { keyStore: new nearApi.keyStores.BrowserLocalStorageKeyStore() },
        });
        window.walletConnection = new nearApi.WalletConnection(near, "hugo-the-wizard-near-arcade")
        if(window.walletConnection.isSignedIn()){
            gNearLoggedIn = 1
			gNearBut.style.color = '#575'
			gNearBut.style.textShadow= "0 0 5px #5C5"
            gNearBrownsGet()
			var gob = gGobMake(gGobKinds.lookout)
			gGobArmy.push(gob)
			gob.endX = gob.x = gYouX+55
			gob.endY = gob.y = gYouY
			alert(`Logged in to NEAR! Free ${gob.kind.name} goblin added!`)
			gNearBut.onclick = () => {
				walletConnection.signOut()
	            gNearLoggedIn = 0
				gNearBut.style.color = '#000'
				gNearBut.style.textShadow = "none"
			}
        }
    } catch(e) {
        gLog(e)
    }
}

async function gNearBrownsGet() {
	try {
		// Check if the user is authenticated
		gLog(window.walletConnection.account().accountId)
		// User is authenticated, proceed with checking NFTs
		const contractId = 'mrbrownproject.near'
		const args = { "account_id": window.walletConnection.getAccountId() }; // Use the authenticated user's account
		
		var account = window.walletConnection.account()
		const contract = new nearApi.Contract(account, contractId, {
			viewMethods: ["nft_tokens_for_owner"],
		})
		
		const result = await contract.nft_tokens_for_owner(args);
		gLog('View method result:', result);

		gNearBrowns = result.length
		if(gNearBrowns) {
			var gob = gGobMake(gGobKinds.kelpie)
			gGobArmy.push(gob)
			gob.endX = gob.x = gYouX+55
			gob.endY = gob.y = gYouY
			alert(`You have Mr. Brown NFTs! Free ${gob.kind.name} goblin added!`)
		}
		
	} catch (error) {
		gLog('Error:', error);
	}
}

async function gNearLogIn(){
	try{
	    await window.walletConnection.requestSignIn("brown.neararcade.near", 'Check Your NFTs on Mr. Brown');
	}catch(e){
	    gLog(e)
	}
}