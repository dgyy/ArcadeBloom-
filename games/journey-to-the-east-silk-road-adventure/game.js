// initialize 2D canvas (c)Load
// initialize game state (s)
// initialize keys states (u,r,d,l for directions, k for all the keyboard)
c = a.getContext`2d`, k = [u = r = d = l = s = 0]
// (initialize your global variables here)
// c.w = innerWidth
// c.h = innerHeight

// update u,l,d,r globals when an arrow key/wasd/zqsd is pressed or released
// update k[keyCode] if any other key is pressed/released
onkeydown = onkeyup = e => k[e.which] = self['lld*rlurdu'[e.which % 32 % 17]] = e.type[5]

// Had to do this way to accommodate virtual keyboard because k[13] wasn't working
document.getElementById("playerInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter" && s==2) {
    addMember()
  }
})

initializeNear()

var gameOver=false
const textContainer = document.getElementById("textContainer")
const txtInput = document.getElementById("playerInput")
const svg =["m -10.389267,104.73924 5.8771626,7.44441 L 64.446638,84.756881 196.87876,98.470267 v 17.631493 l -21.1578,4.30993 -10.97071,18.80692 -1.95905,-13.71338 12.53796,-10.18709 -31.73669,5.87717 -7.83622,9.40346 7.83622,3.5263 -11.75434,19.19874 -3.13448,-0.39181 -5.48536,5.48535 2.74268,7.0526 -5.87716,2.35087 -1.17544,-9.40347 -5.48535,-1.95905 -3.91811,3.5263 5.48535,2.74268 -3.5263,2.35086 3.91811,8.22803 -10.97071,14.49701 -9.403461,-2.35086 -3.526301,6.66078 5.877166,5.09355 -6.268976,9.01165 -6.268977,-7.0526 -2.350865,4.70173 3.918109,5.87717 -5.485353,-4.30992 -0.391813,-10.97071 -10.187085,-8.61984 -14.497008,9.40346 -3.13449,11.36252 -14.888818,-25.0759 -27.426771,-7.44441 4.70173,9.40346 7.052601,-3.13449 4.70173,6.26898 -8.619841,7.83622 -17.23968657,-3.5263 -9.01165263,-13.32158 -1.9590544,-0.39181 2.7426761,9.79528 -15.2806295,-1.56724 -0.783621,4.30992 -18.023308,-7.0526 -11.754332,9.01165 -18.80693,-14.49701 4.701734,-11.75433 23.50866,-2.74267 0.783624,5.87716 13.321575,4.30992 0.391811,-4.70173 19.3807227,3.61729 3.3918505,-9.11555 -13.7609202,0.40472 -1.959054,-7.83622 -4.701733,9.40346 -3.91811,-10.18708 -8.619843,-6.26898 -1.371338,1.17543 9.207559,8.22803 -0.587716,0.58772 -2.546772,-1.56724 0.783622,2.54677 -3.330394,3.7222 -3.722205,-1.95905 4.701733,-0.97953 0.783622,-1.56724 -9.795276,-8.42394 -2.938583,2.15496 -4.505827,-0.58772 -5.289449,5.68126 -0.195905,3.5263 -8.032126,3.3304 -5.877166,-3.91811 2.154961,-9.20756 9.795276,0.78362 v -4.89764 l -4.897638,-4.30992 9.59937,-2.54677 4.309921,-6.66079 5.093544,-0.58772 -0.783622,-5.68126 3.330394,-2.15496 0.783622,3.3304 3.134488,-1.17544 -3.134488,-5.68126 -5.093544,3.13449 -2.742677,-1.95905 -0.391811,-6.8567 15.868347,-14.10519 -3.722205,-0.39182 18.415119,-7.2485 21.1577954,8.61984 -0.19590551,1.95906 -3.72220479,2.35086 z","m -21.947693,108.06964 h -5.877166 l -0.587716,2.74267 -5.485355,5.28945 0.587716,2.74268 2.546771,1.76315 -3.526298,2.93858 -0.195906,4.70174 -4.897638,1.17543 -1.567244,1.76315 -3.330395,-1.17544 0.783625,1.95906 3.526298,-0.39181 2.154959,1.17543 5.681261,-1.76315 1.567246,1.17543 1.959054,-2.35086 0.979527,-5.28945 3.330393,1.95906 0.97953,-2.35087 -1.763152,-2.35087 3.722206,-0.97952 3.330392,0.78362 3.13449,-1.56725 2.938581,-0.39181 -0.783621,-2.35086 -1.959055,-0.78363 -0.783621,2.93859 -9.403467,0.39181 -3.330392,-1.56725 v -4.89763 z","m -14.111473,146.07531 -4.309923,6.46488 1.371341,3.5263 3.330393,-0.19591 3.5263,-2.35086 8.2280309,2.35086 2.7426761,-1.76315 -6.464882,-5.48535 -5.289447,1.76315 z","m 14.490731,145.09578 -6.2689768,4.70173 3.9181118,6.46488 -1.175433,4.89764 7.248504,1.56725 -0.391811,-4.70174 -4.309922,-8.03212 3.722205,-3.91811 z","m -61.912418,120.9994 -5.093544,3.72221 1.175433,4.70173 3.722206,3.7222 -2.938585,0.78363 v 6.26897 l 8.423939,-2.54677 1.959055,-3.5263 -3.330395,-0.1959 -3.918109,-6.26898 1.567243,-3.13449 -3.408391,0.58982 z","m -70.541346,130.24098 3.532415,-0.27705 1.10821,1.52379 -1.10821,1.10821 -0.346315,3.11683 -4.779151,1.38527 -0.277053,-1.52379 1.385263,-1.8701 -1.523788,-0.27706 0.138525,-1.93936 2.701261,0.0693 z","m 145.21307,134.25824 -2.35492,12.1903 -2.77053,8.58862 0.13853,5.81809 -11.0821,4.70989 -3.60168,3.1861 1.52379,3.60168 1.93937,-3.7402 12.19029,-3.74021 2.21642,-7.06483 -2.21642,-4.29431 3.74021,0.83116 3.7402,-2.90905 -5.12546,-3.46315 2.632,-1.52379 -1.66232,-3.32463 2.77053,-0.83116 z","m 98.534197,188.3909 -2.546771,0.78362 0.391811,1.95905 2.15496,0.19591 0.979527,-1.95905 z","m 113.91278,180.65263 -2.05701,2.79166 1.17544,2.39984 1.8611,-4.60378 z","m 55.434985,203.47562 -0.783622,3.03654 1.371338,2.74268 2.350866,-2.05701 z","m -42.713677,149.2098 33.891653,21.15779 5.2894494,-14.69291 8.0321255,12.92976 6.4648821,-10.38299 -0.587716,15.08472 27.32882,-5.3874 21.745513,-8.03212 25.957481,2.25291 -2.546772,-14.00724 2.546772,13.90929 22.333229,-2.64473 -18.708977,13.81134 -12.635906,16.16221"]
var state = 'city'
const dots = []
var travelTimer
var timerStatus="off"
const colors = ["GoldenRod","DarkGoldenRod", "DarkSlateGrey", '#E35A31']
var thin = false

const cities = new Image()
const eventQueue = []
// var full = false
var play = true
var  nBadGuy=0
var firstDay=new Date('1271-05-01')
const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
var fullScreen=false
var overloaded = false

cities.src = "cities.png"
var arrowsUsed=0
const playerData = {
  members : {},
  //members:{"Joey":{health:3, ill:"none"},"Floe":{health:2, ill:"none"},"Stan":{health:1, ill:"none"},"Christopher":{health:3, ill:"none"},"Theodore":{health:0, ill:"none"}},
  money: 2000,
  hunt:0,
  supplies : {
    Camels: {n:0, q:1,  cost:100},
    CamelFeed: {n:0, q:50, cost:10},
    Food: {n:0, q:50, cost:25}, // need about 1,188 lb steady pace filling diet
    Clothing: {n:0,q:1, cost:10},
    WaterSkins: {n:0, e:0, q:20, cost:5},
    TradeGoods: {n:0,q:10, cost:100}, 
    Arrows: {n:0, q:20, cost:10},
    Tents: {n:0,q:1, cost:20}
  },
  settings : {
    pace: "steady",
    rations: "good",
    load:"medium"
  },
  dead:0,
  weather:"Sunny",
  currLeg:0,
  totalTraveled: 0,
  score: 0
}
const mouse = {x:0, y:0}
playerData.date = new Date('1271-05-01')

const camelPace = {slow:18, steady: 40, fast:70}
const camelLoad = {light:150, medium:250, heavy:450}
const eating = {poor:1, good:3, filling:5}

const lastPathSVG = svg[svg.length - 1];
var temp = {x: 0, y:0}
lastPathSVG.split(" ").map((cor)=>{
    if(cor!=='m'){
        var parts = cor.split(",")
        temp = {x: temp.x+parseFloat(parts[0]), y: temp.y+parseFloat(parts[1])}
        dots.push({x: temp.x, y: temp.y})
    }
})
var curStep = 0
const totalMiles = 14795
const steps = [
  { name: 'Venice', country:'Italy', desc: "Venice thrived as a trading hub and cultural center.", start: dots[0], end: dots[1], percentage: 0, miles: 1900},
  { name: 'Acre', country:'Israel', desc: "Bustling port city, a focal point of trade and cultural exchange.", start: dots[1], end: dots[2], percentage: 0, miles:950 },
  { name: 'Trebizond', country:'Turkey', desc: "Vibrant Black Sea city that played a pivotal role in regional trade and commerce.", start: dots[2], end: dots[3], percentage: 0, miles: 830 },
  { name: 'Baghdag', country:'Iraq', desc: "Historic city at the heart of Islamic civilization, known for its culture, scholarship, and economic significance.", start: dots[3], end: dots[4], percentage: 0, miles:550},
  { name: 'Terbil', country:'Iran', desc: "Strategic crossroads city known for its multicultural atmosphere and commercial importance.", start: dots[4], end: dots[5], percentage:0 , miles:812},
  { name: 'Ormuz', country:'Iran', desc: "Bustling island city strategically positioned along important maritime trade routes", start: dots[5], end: dots[6], percentage: 0, miles:1400},
  { name: 'Balkh', country:'Afghanistan', desc: "Ancient city that was a vital center of trade and culture along the Silk Road", start: dots[6], end: dots[7], percentage: 0 , miles:700},
  { name: 'Kashgar', country:'China', desc: "Thriving oasis city that served as a key junction on the Silk Road trading network.", start: dots[7], end: dots[8], percentage: 0, miles: 1954 },
  { name: 'Lanzhou', country:'China', desc: "Strategic and culturally diverse city located along the Yellow River, contributing to the Silk Road's intricate tapestry.", start: dots[8], end: dots[9], percentage:0, miles:1000},
  { name: 'Karakorem', country:'Mongolia', desc: "The capital of the Mongol Empire, a diverse and cosmopolitan city where he met Kublai Khan.", start: dots[9], end: dots[10], percentage: 0 , miles:1000},
  { name: 'Lanzhou', country:'China', desc: "Strategic and culturally diverse city located along the Yellow River, contributing to the Silk Road's intricate tapestry.", start: dots[10], end: dots[11], percentage:0, miles:970},
  { name: 'Beijing', country:'China', desc: "Heart of the Yuan Dynasty, a vibrant capital city where Marco Polo would later serve in Kublai Khan's court.", start: dots[11], end: dots[12], percentage: 0, miles: 1228},
  { name: "Chengdu", country:'China', desc: "Bustling city in southwestern China known for its irrigation systems, cultural vibrancy, and regional significance.", start: dots[12], end: dots[13], percentage:0, miles:1200 },
  { name: "Pagan", country:'China', desc: "Vast landscape of temples and pagodas, showcasing the rich cultural heritage of Myanmar.", start: dots[13], end: dots[13], percentage:0, miles:0},
  // This is the route to AsiaToDo the wiki map has the route back tooToDo
];
// death ideas: Falling from a mountain pass, allergic reaction to silk, wrongfully accused and executed, rightfully accused and put to death, mistaken identity, etc.
const death = ['a fall from a mountain pass', 'allergic reaction to silk', 'opium den thugs', 'murder by fellow traveler', 'snake bite', 'framed for murder', 'executed for crime']
const commonIllnesses = [
  'Dysentery',  'Malaria',  'Typhoid',  'Cholera',  'Pneumonia',  'Tuberculosis',
  'Influenza',  'Measles',  'Smallpox',  'Yellow Fever',  'Plague',  'Food Poisoning',
  'Heatstroke',  'Frostbite',  'Malnutrition',  'Dehydration',  'Infected wound',
  'Respiratory Infection',  'Parasitic Infection',  'Venomous Snake Bite',  'Dengue Fever',
  'Hepatitis',  'Rabies'
]
const eventArr = ["death", "water", "sick", "rob", "attack", "camel", "heal"]
const distBasedEvents = [
{d:20, t:"You board a ship for the first leg of your journey."},
{d:100,t:"You savor shipboard cuisine as you sail."},
{d:900,t:"Find tranquility, enjoying serene ocean vistas"},
{d:600,t:"Soothing melodies aboard the ship transport you."},
{d:900,t:"Explore a island market for unique treasures."},
{d:1500,t:"Join a jubilant onboard celebration."},
{d:2000,t:"Browse a busy market and pick up a unique souvenir."},
{d:2500,t:"Gather 'round as a local shares fascinating legends."},
{d:3500,t:"Meditate and find peace at a remote monastery."},
{d:5000,t:"Savor a nomad's delicious meal in their yurt."},
{d:7000,t:"Attend a mesmerizing city arts performance."},
{d:9000,t:"Receive a personalized work of art as a gift."},
{d:11567, t:"Met Marco Polo, says he's working on a book."},
{d:13000 , t:"Feeling homesick you wonder if was all worth it."}]
var dEvent = 0
const pageText =['',"Follow Marco Polo's route along the silk road!","Input your caravan member's names!", '',"Control your journey by making wise decisions!", "You can only carry 200lbs! Use as few arrows as possible!"]
var latestEvent = ""
var log=[]
var currSong=0

var music=0
const musicStop = ()=>{
  music=0
  p1``
}
const musicPlay = (c) =>{
  music=1
  currSong=c
  if(c==0){
    p1`240.40
c-aY|X-XY|a-c-|V-V-|c-aY|X-VX|YXVT|V-  |a-c-|e--c|fece|a-V-|a-c-|e--c|feca|c-c-|e-f-|h-e |fhfc|e-e-|e-e-|e--c|fece|a-a-|
J---|J---|J---|J---|J---|J---|J---|J---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|O---|
`
  }
  if(c==1){
    p1`240.40
R-RTV-TRW-VTV-V-T-VWV-TR
M-MQR-Q R-RQR-R-Q-R-R-Q `
  }
  if(c==2){
    p1`700.60
V-Y-c-V-d---c-a-
M-------R-------`
  }
}

// Button class
class Button {
  constructor(x, y, width, height, label, scenes, onClick, color) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.label = label
    this.isClicked = false
    this.s = scenes
    this.onClick = onClick
    this.color = color || colors[0]
    this.active = true
  }

  draw() {
    //c.fillStyle = this.isClicked ? colors[1] : colors[0]
    c.fillStyle = this.active ? this.color : "grey"
    c.shadowColor = "rgba(0, 0, 0, 0.3)"
    c.shadowBlur = 6
    c.shadowOffsetX = 3
    c.shadowOffsetY = 3

    drawRoundedRect(c, this.x, this.y, this.width, this.height)

    c.fillStyle = colors[2]
    c.font = 3+"vw Consolas"
    c.textAlign = "center"
    c.textBaseline = "middle"
    c.fillText(this.label, this.x + this.width / 2, this.y + this.height / 2)

    c.shadowColor = "transparent"
    c.shadowBlur = 0
    c.shadowOffsetX = 0
    c.shadowOffsetY = 0
}
}

const buttons = []
var lStart = 0
var lEnd = 5
var firstShop = true



function setButtons(){
  var bW = 200
  var bH = 60
  var mapH = c.h/3+95
  var bCen = c.w*.5-bW*.5

  buttons.push(
    // first screen button
    new Button(c.w*.4, c.h*.5, bW, bH, "Start!", [0], ()=>{
      if(brownie){
        playerData.members["Mr.Brown"] = {health:3, ill:"none", brown:true}
        changeText("Caravan Members: "+Object.keys(playerData.members).toString())
      }else{
        changeText(pageText[s])
      }
      // very first scene should be s2: choose members 
      s=2, inputView(true)
      //document.documentElement.requestFullscreen() //full screen by default
      // music
        musicPlay(0)
      }),
      new Button(c.w*.4, c.h*.7, bW, bH, "Back!", [1,8,9,10], ()=>{
        s=4
        toggleTextContainer(true)
        changeText(pageText[s])
      }),

      new Button(c.w*.4, c.h*.7, bW, bH, "Back!", [5], ()=>{
        let amount = playerData.hunt<200 ? playerData.hunt : 200
        playerData.supplies.Food.n+= amount
        newEvent("You used "+arrowsUsed+" arrows to hunt "+amount+" lbs of food.")
        arrowsUsed=0
        if(playerData.supplies.Food.n>50){
          timerStatus="off"
          buttons[8].active = true
        }
        s=4
        changeText(pageText[s])
        dayPasses() 
      }),
      new Button(c.w*.5-bW*.6, c.h*.6, bW*1.2, bH, "Add Member!", [2], ()=>{
        addMember()
      }),
      new Button(c.w*.5-bW*1.5-2, mapH, bW, bH, "Status!", [4], ()=>{
        s=8, changeText("Check on your supplies and party members!")
      }),
      new Button(bCen, mapH, bW, bH, "Hunt!", [4], ()=>{
        if(playerData.supplies["Arrows"].n<1){
          alert("Out of arrows!")
          return 
        }
        buttons[8].label="Continue"
        buttons[8].color= colors [1]
        if(state!=='city'){
          state="hunt"
          let arr = playerData.totalTraveled<1900 ? seaArr : animalArr
          for(an of arr){
            an.v = (Math.random() * 2)
            an.alive = true
            an.x = c.w*.2+Math.random()*c.w*.7
            an.y = c.h*.1+Math.random()*c.h*.6
            an.s= 1+Math.random() * 3
          }
          playerData.hunt=0
          s=5
          changeText(pageText[s])
        }else{
          alert("Can't hunt in city!")
        }
      }),
      new Button(c.w*.5+2+bW*.5, mapH, bW, bH, "Big Map!", [4], ()=>{
        s=1, changeText(pageText[s])
      }),
      new Button(c.w*.5-bW*1.5-2, mapH+bH+5, bW, bH, "Logs!", [4], ()=>{
        s=9, toggleTextContainer(false)
      }),      
      new Button(bCen, mapH+bH+5, bW, bH, "Continue", [4], ()=>{
        if(state==="win"){
          s=10
          changeText("Congrats on the win! Refresh to replay!")
          return
        }
        if(state==="runningOut"){return}
        buttons[9].active=false
        buttons[5].active=true
        buttons[8].label ==="Rest" ? newEvent("Having a little rest."):newEvent("On the move again!")
        state=(buttons[8].label ==="Rest")? "rest":"moving"
        buttons[8].label=(buttons[8].label ==="Rest")? "Continue":"Rest"
        buttons[8].color= state==="moving" ? colors[0] : colors [1]
      }, colors[1]),
      new Button(c.w*.5+2+bW*.5, mapH+bH+5, bW, bH, "Market!", [4], ()=>{
        if(state==='city'){
          s=3
          toggleTextContainer(false)
        }else{
          alert("Can only visit market in city!")
        }
      }),
      new Button(bCen, c.h*.7, bW, bH, "Overview!", [6], ()=>{
        s=4, changeText("Control your journey by making wise decisions!")
        toggleTextContainer(true), newEvent("You arrived in "+steps[curStep].name+", "+steps[curStep].country)
        if(steps[curStep].name==="Pagan"){
          //last city
          state="win"
          win()
          buttons[8].label="See Score"
        }
      }),
      new Button(c.w*.4, c.h*.55, bW*.7, bH*.7, playerData.settings["pace"], [8], ()=>{
        flipSetting(11,["slow","steady","fast"], "pace")
      
      }),
      new Button(c.w*.55, c.h*.55, bW*.7, bH*.7, playerData.settings["rations"], [8], ()=>{
        flipSetting(12,["poor","good","filling"], "rations")
      }),
      new Button(c.w*.7, c.h*.55, bW*.7, bH*.7, playerData.settings["load"], [8], ()=>{
        // flipSetting(13,["light","medium","heavy"], "load")
      },colors[1]),
      new Button(c.w*.9, c.h*.3, bW/3, bH*.8, "⇧", [9], ()=>{
        lStart>0 && lStart-- && lEnd>5 && lEnd--
      }),
      new Button(c.w*.9, c.h*.6, bW/3, bH*.8, "⇩", [9], ()=>{
        lEnd<log.length && lEnd++ && lStart<log.length-5 && lStart++ 
      }),
      new Button(c.w*.93, c.h*.05, bW/4, bH*.8, "🔈", [2,4], ()=>{
        buttons[16].label= buttons[16].label==="🔈" ? "🔇":"🔈"
        buttons[16].label==="🔈" ? musicPlay(currSong) : musicStop()
      }),
      new Button(c.w*.85, c.h*.05, bW*.7, bH*.8, "login", [0], ()=>{
        buttons[17].label= loggedIn ? "logout" : "login"
        if(loggedIn){
          loggedIn=false
          logOut()
        }else{
          login()
        }        
      }),
      new Button(c.w*.93, c.h*.15, bW/4, bH*.8, "⛶", [0,4], ()=>{
        buttons[18].label= buttons[18].label==="⛶" ? "X":"⛶"
        buttons[18].label==="X" ? (fullScreen=true , document.documentElement.requestFullscreen()) :( document.exitFullscreen(), fullScreen=false)
      }),
      )
  
  var H=c.h*.22
  var supplies = playerData.supplies
  for(item in supplies){
    buttons.push(
      new Button(c.w * 0.7, H, 60, 30, "+", [3], (() => {
        const currentItem = item;
        return () => {
          if(playerData.money - supplies[currentItem].cost >=0){
            playerData.money -= supplies[currentItem].cost
            supplies[currentItem].n+=supplies[currentItem].q
          }
        };
      })()),
      new Button(c.w * 0.78, H, 60, 30, "-", [3], (() => {
        const currentItem = item;
        return () => {
          if(supplies[currentItem].n>=supplies[currentItem].q){
            playerData.money += supplies[currentItem].cost
            supplies[currentItem].n-=supplies[currentItem].q
          }
        };
      })())
    )
    H+=c.h*.06
  }
  H+=c.h*.05
  buttons.push(new Button(c.w*.7, H, bW, bH, "Done!", [3], ()=>{
    if(firstShop) {s=6, firstShop=false, changeText(steps[curStep].desc)}
    else {s=4}
    state="city", toggleTextContainer(true) 
  }))
}
changeText("Embark on a journey along the Silk Road, making strategic decisions and overcoming challenges to successfully reach your destination in the East!")

function addMember(){
  let input = txtInput.value
  
  if(input.length>0){
    // health: 0(dead), 1 (poor),2(fair), 3(good) 
    playerData.members[input] = {health:3, ill:"none", brown:false}
    txtInput.value = ""
    changeText("Caravan Members: "+Object.keys(playerData.members).toString())
    if(Object.keys(playerData.members).length==5){
      s=3, inputView(false), toggleTextContainer(false)
    }
  }
}


const inputView = (show) =>{
  txtInput.style.display = show ? "block" : "none";
}
const flipSetting = (n, arr, set) => {
  let curr = buttons[n].label
  let index = arr.indexOf(curr)
  buttons[n].label = index<1? arr[1] : index<2 ? arr[2] : arr[0] 
  playerData.settings[set] = buttons[n].label
}

// start game loop
let reqAnimationId
function smoothAnimation(e) {
	a.width = innerWidth, a.height = innerHeight
      switch (s) {
        case 0: title()
          break
        case 1: map()
          break
        case 2: setup()
          break
        case 3: shop()
          break
        case 4: mainPage()
          break
        case 5: hunt()
          break
        case 6: city()
          break
        case 7: lose()
          break
        case 8: statusPage()
          break
        case 9: logs(lStart,lEnd)
          break
        case 10: winScreen()
          break
        case 11: defend()
          break

    }
    if(state==="moving"||state==="rest"){moving()}
    drawButtons()
    
    // Testing input
    // c.beginPath();
    // c.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2)
    // c.fillStyle = "green"
    // c.fill()
    // c.closePath()

    reqAnimationId = requestAnimationFrame(smoothAnimation)
}

// handle click/touch events
// globals x and y contain the pointer's coordinates
// in each screen, you can make a click update the game state
// ex: "game over if we click on the bottom half of the screen" => `if(y>h/2)s=3;`
onclick = e => {
    setMouse(e)

    if(handleButtonClick(mouse.x,mouse.y,s)){
      return
    }

    switch (s) {
        case 5:
        case 11:
          if(arrow.set&&playerData.supplies.Arrows.n>0){
              arrow.x= rope.x,arrow.y=arc.y-3
              arrow.set = false
              playerData.supplies.Arrows.n--
              arrowsUsed++
          }
          break
    }
    
}

onmousemove = e => { 
  setMouse(e)
}

function title() {
  tx("Journey to the East", c.w / 2, c.h * .34, 6, colors[3])
  tx("Silk Road Adventure", c.w / 2, c.h * .44, 4, colors[3])
}

function setup(){
  let num = 5-Object.keys(playerData.members).length
  tx("Add "+num+" Members to Caravan!", c.w / 2, c.h * .34, 5.3, colors[3])
}
const changeWeather = () =>{
  let ran = Math.random() * 100
  playerData.weather= ran<60 ? "Sunny" : ran<75 ? "Cloudy" : ran<98 ? "Raining" : "Storm"
}

function mainPage(){
  let txtW=100
  c.fillStyle = colors[0]
  c.fillRect(0, c.h/3-10, c.w, txtW)
  c.fillStyle = colors[2]
  drawRoundedRect(c,5, c.h/3-5, c.w-10, txtW-10)
  tx(latestEvent, c.w / 2, c.h*.45, 2.5, 'GoldenRod')
  c.fillStyle = "lightblue"
  let scale2 = fullScreen && thin ? {s:1, w: c.w*.45, h: -c.h*.2}  : {s:1, w: c.w*.45, h: -c.h*.1} 
  drawRoundedRect(c,c.w/3, 5, c.w/3, c.h/3+10) 
  drawMap(scale2.s, scale2.w, scale2.h)
  mainText()
}

function mainText(){
  let curFood= playerData.supplies["Food"].n,
  camelFeed= playerData.supplies["CamelFeed"].n,
  curWater = playerData.supplies["WaterSkins"].n,
  distCity = steps[curStep].miles-playerData.currLeg,
  totalTraveled = playerData.totalTraveled,
  health= healthStatus(),
  date=playerData.date.toDateString(),
  weather=playerData.weather,
  left = c.w*.15,
  right = c.w*.8

  tx("Date: "+date, left, c.h*.1, 2, colors[2])
  tx("Next City: "+distCity+" miles", left, c.h*.15, 2, colors[2])
  tx("Traveled: "+totalTraveled+" miles", left, c.h*.2, 2, colors[2])
  tx("Weather: "+weather, left, c.h*.25, 2, colors[2])
  tx("Health: "+health, right, c.h*.1, 2, colors[2])
  tx("Food: "+curFood+" lbs", right, c.h*.15, 2, colors[2])
  tx("Camel Feed: "+camelFeed+" lbs", right, c.h*.2, 2, colors[2])
  tx("Water: "+curWater+" skins", right, c.h*.25, 2, colors[2])
}

function statusPage(){
  let left = c.w*.2,
  right = c.w*.4
  H = c.h*.1

  toggleTextContainer(!(fullScreen && thin))

  tx("Supplies", left, H, 3.5, colors[3])
  H+=c.h*.05
  for(item in playerData.supplies){
    H+=c.h*.05
    tx(item+": "+playerData.supplies[item].n, left, H, 2, colors[2])
  }

  H = c.h*.1  
  tx("Caravan Members", right, H, 3.5, colors[3], "left")
  H+=c.h*.1
  tx("Name", right, H, 2.5, colors[3], "left")
  tx("Health", right+c.w*.15, H, 2.5, colors[3], "left")
  tx("Illness", right+c.w*.25, H, 2.5, colors[3], "left")
  for(mem in playerData.members){
    H+=c.h*.05
    let h = playerData.members[mem].health
    h = h> 2 ? "good" : h >1 ? "fair" : h>0 ? "poor" : "dead"
    tx(mem, right, H, 2.5, colors[2], "left")
    tx(h, right+c.w*.15, H, 2.5, colors[2], "left")
    tx(playerData.members[mem].ill, right+c.w*.25, H, 2.5, colors[2],"left")
  }
  H=c.h*.55
  tx("Pace", right-5, H-5, 3, colors[3], "left")
  tx("Rations", right+c.w*.15-5, H-5, 3, colors[3], "left")
  tx("Load", right+c.w*.3-5, H-5, 3, colors[3], "left")
  
  if(loggedIn){
    tx(userName, c.w*.02, c.h*.7, 2, colors[3], "left")
    tx(brownNum+" Mr.Brown NFTs", c.w*.02, c.h*.8, 2, colors[3], "left")
  }

  tx(loadCalc()+" lbs per camel", c.w*.8, H+c.w*.1, 2.5, (overloaded ? "red" : colors[2]))
}

const healthStatus = () =>{
  let val =0
  for(let mem in playerData.members){
   if(playerData.members[mem].health>0){
    val+=((playerData.members[mem]).health)
   }
   
  }
  val =Math.ceil(val/(5-playerData.dead))
  
  switch(val){
    case 0 : s=7, musicPlay(2)
      changeText("This is the end... refresh to restart!")
      return
    case 1 : return "Poor"
    case 2 : return "Fair"
    case 3 : return "good"
  }
  return val
}

function city(){
  let sx = curStep<7 ? curStep*80 : (curStep-7)*80
  let sy = curStep<7 ? 0 : 75
  c.drawImage(cities,sx,sy, 80, 75, c.w/2-80*3/2, c.h/2-75*3/2+20, 80*3, 75*3)
  tx(steps[curStep].name, c.w / 2, c.h * .15, 6, colors[3])
  tx(steps[curStep].country, c.w / 2, c.h * .25, 4, colors[3])
}

// time-based events - stops when hunting or in city 
function moving(){
  if(timerStatus==="elapsed"){
    dayPasses()

    if(state==="moving"){
      // movement along path
      let currPace = playerData.supplies["Camels"].n>0 ? camelPace[playerData.settings.pace] : 5
      if(playerData.weather==="Storm"){
        newEvent("Storm slows us down to half pace!")
        currPace/=2
      }
      if(overloaded){
        currPace*.7
      }
      playerData.currLeg += currPace
      playerData.totalTraveled += currPace
      steps[curStep].percentage = playerData.currLeg/steps[curStep].miles

      if(dEvent<distBasedEvents.length && playerData.totalTraveled >= distBasedEvents[dEvent].d){
        newEvent(distBasedEvents[dEvent].t )
        dEvent++
      }

    }else{
      heal()
    }

    if(playerData.supplies["Food"].n<50){
      state="runningOut"
      clearInterval(travelTimer)
      changeText("You have too little food you must stop to hunt!")
      newEvent("You're running out of food, you must stop to hunt!")
      buttons[8].label="continue"
      buttons[8].active=false
      return
    }
    if(
        playerData.supplies["CamelFeed"].n<1 
      && playerData.supplies["Camels"].n>0 
      && (Math.random()*10<1)
    ){
      playerData.supplies["Camels"].n--
      newEvent("No camel feed! One camel died! Food store increases.")
      playerData.supplies["Food"].n+=200
    }


    let who = randProp(playerData.members)
    if(playerData.supplies["WaterSkins"].n<1){
      if(who.health>0){
        who.ill = "thirst"
        who.health--
        newEvent("You have no water, "+who.k+" is dying of thirst!")
        if(who.health<0){
          newEvent("You have no water, "+who.k+" died from thirst!")
        }
      }
    }else if(playerData.supplies["Tents"].n<1){
      if(who.health>0){
        who.ill = "wounds from animals"
        who.health--
        newEvent("You have no tents, "+who.k+" was mauled by wild animals!")
      }
      if(who.health<0){
        newEvent("You have no tents, "+who.k+" died after being mauled by animals!")
      }
    }else if(playerData.supplies["Clothing"].n<1){
      if(who.health>0){
        who.ill = "sunburn"
        who.health--
        newEvent("You have no clothes, "+who.k+" was sunburned!")
      }
      if(who.health<0){
        who.ill = "infected sunburn"
        newEvent("You have no clothes, "+who.k+" died of an infected sunburn!")
      }
    }
    
    // check if we've reached a new city
    if(steps[curStep].percentage>=1){
      steps[curStep].percentage=1
      playerData.currLeg=0
      curStep++
      timerStatus="off"
      state="city"
      refillWater()
      updatePrices()
      buttons[5].active=false // hunt
      buttons[9].active=true // shop
      s=6, changeText(steps[curStep].desc)
      buttons[8].label="Continue"
    }else{
      emptyEventQ()
      // Important! need to turn timer to 'on' or it will stay 'elapsed' and run constantly
      timerStatus="on"
    }
  }else if(timerStatus==="off"){
    timerStatus="on"
    travelTimer = setInterval(()=>{timerStatus="elapsed"}, 2000);
  }
}

function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  })
}

async function emptyEventQ(){
  while(eventQueue.length>0){
    latestEvent = eventQueue.shift()
    await delay(500)
  }
}

// hunting takes 1 day
function dayPasses(){
  loadCalc()
  changeWeather()
  playerData.date = addDays(playerData.date, 1)
  // supplies consumed
  playerData.supplies["Food"].n-= eating[playerData.settings.rations]*(5-playerData.dead) 
  playerData.supplies["CamelFeed"].n-= eating[playerData.settings.rations]*playerData.supplies["Camels"].n
  if(playerData.supplies["WaterSkins"].n>0 && playerData.weather!=="Raining"){
    playerData.supplies["WaterSkins"].n-= (5-playerData.dead)
    playerData.supplies["WaterSkins"].e+= (5-playerData.dead)
    if(playerData.supplies["WaterSkins"].n<0){
      playerData.supplies["WaterSkins"].n=0
    }
  }
  if(playerData.supplies["Food"].n<0){
    playerData.supplies["Food"].n=0
  } 
  if(playerData.supplies["CamelFeed"].n<0){
    playerData.supplies["CamelFeed"].n= 0
  }

  if(Math.random() >.9){
    randomEvent()
  }
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function updatePrices(){
  for(item in playerData.supplies){
    let pChange = 1+Math.random()
    playerData.supplies[item].cost = playerData.supplies[item].cost*pChange<<0
  }
  playerData.supplies["TradeGoods"].cost+=50
}

function newEvent(e){
  if(e.indexOf("died") !== -1){
    playerData.dead++
  }
    if(state==="moving"|| state==="rest"){
      eventQueue.push(e)
    }else{
      latestEvent=e
    }
    
    log.push(playerData.date.toDateString()+" : "+e)
}

function randomEvent(){
  let rand = Math.random() * eventArr.length << 0
  //console.log(eventArr[rand])
  switch (rand) {
    case 0: playerData.dead<2 && memDied()
      break
    case 1: newEvent("Stopped at an oasis to refill water!")
            refillWater()
      break
    case 2: memSick()
      break
    case 3: robbed()
      break
    case 4: setEnemies()
            s=11
      break
    case 5: newEvent("You find a lose camel")
            playerData.supplies["Camels"].n++
      break
    case 6: heal()
}
}

function memDied(){
  let who = randProp(playerData.members)
  if(who.brown){
    return // Mr.Brown doesn't die randomly!
  }

  if(playerData.totalTraveled<1900&& playerData.dead<1){
    let what = (Math.random()*2 << 0 )<1 ? "fell overboard" : "Ship wreck"
    
    who.death = "drowned" 
    who.ill = "drowned" 
    if(what="Ship wreck"){
      newEvent(what+"! "+who.k+" was sadly lost.")
    }else{
      newEvent(who.k+" "+what+" and was lost.")
    }
    playerData.dead++
    who.health = 0
    return 
  }

  if(Math.random()*(Math.random()*(playerData.rations==="filling"? 12 : playerData.rations==="filling"? 8 : 5) < 4)){
    if(who.health>0 && who.health<3){
    who.health = 0
    let diedOf 
    if(who.ill === "none"||who.ill==="thirst"){
      diedOf = randObj(death)
      who.ill = diedOf
    }else{
      diedOf = who.ill
    }
    who.death = diedOf
    newEvent(who.k+" died of "+diedOf)
  }
}
}

function memSick(){
  if(Math.random()*(playerData.rations==="filling"? 12 : playerData.rations==="filling"? 8 : 5) < 5){
  let who = randProp(playerData.members)
  if(who.brown){
    return // Mr.Brown doesn't randomly get sick
  }
  if(who.health>0){
    who.health--
    if(who.health<1){
      newEvent(who.k+" died of "+(who.ill==="none"? "fatigue":who.ill))
    }else{
      let sickOf = randObj(commonIllnesses)
      who.ill = sickOf
      newEvent(who.k+" sick from "+sickOf)
    }
  }
}
}

const heal = () =>{
  let who = randProp(playerData.members)
    if(who.health>0 && who.health<3 && who.ill !== "thirst"){
      who.health++
      if(who.ill!=="none"){
        newEvent(who.k+" is no longer sick from "+who.ill)
        who.ill='none'
      }
  }
  if(playerData.supplies["WaterSkins"].n>0){
    for(m in playerData.members){
      if(m.health>0 && playerData.members[m].ill==="thirst"){
        playerData.members[m].ill="none"
      }
    }
  }
}

const randObj = (arr) =>{
  return arr[Math.floor((Math.random() * arr.length))]
}

// https://stackoverflow.com/a/15106541
const randProp = (obj)=> {
  let keys = Object.keys(obj)
  let k = keys[keys.length * Math.random() << 0]
  obj[k].k = k
  return obj[k]
}

function robbed(){
  let what = randProp(playerData.supplies)
  if(what.n>0){
    let loss = what.n/4 << 0 || 1
    what.n = what.n-loss
    newEvent("Your party was robbed! Lost: "+loss+" "+what.k)
  }
}

function refillWater(){
  playerData.supplies["WaterSkins"].n += playerData.supplies["WaterSkins"].e
  playerData.supplies["WaterSkins"].e=0

  for(m in playerData.members){
    if(m.health>0 && playerData.members[m].ill==="thirst"){
      playerData.members[m].ill="none"
    }
  }
}

function hunt(){
  let arrows = playerData.supplies.Arrows.n
  let sea = playerData.totalTraveled<1900
  if(sea){
    c.fillStyle = "lightblue"
    drawRoundedRect(c,0, 0, c.w, c.h)
  }
  tx("Hunting", c.w / 2, c.h * .34, 5.3, colors[3])
  tx("Click/Tap to shoot!", c.w / 2, c.h *.45, 2.5, colors[2])
  tx("Arrows: "+arrows, c.w / 2, c.h *.5, 2.5, colors[2])
  tx("Killed: "+playerData.hunt+" lbs", c.w / 2, c.h *.55, 2.5, colors[2])

  animals(sea)
  if(arrows>0){
    bow()
  }
}

var animalArr = [{t:"🐪", v:0, w:990},{t:"🐏", v:0, w:99},{t:"🦌", v:0, w:150,s:3}, {t:"🐇", v:0, w:11}]
var seaArr =[{t:"🐟", v:0, w:11},{t:"🐢", v:0, w:99},{t:"🦈", v:0, w:250,s:3}, {t:"🦑", v:0, w:11}]
var badGArr =[{t:"👩", v:0, w:990},{t:"👨🏼‍🦱", v:0, w:99},{t:"👳🏽‍♂️", v:0, w:150,s:3}, {t:"🧔🏿‍♀️", v:0, w:11}, {t:"🧔🏽", v:0, w:11}]
function animals(sea){
  let arr = sea ? seaArr : animalArr

  for(an of arr){
    if(an.v&& an.alive){
      c.textBaseline='middle'
      tx(an.t, an.x, an.y, 5.3, colors[3])
      // drawKillBox(c, an.x, an.y, 27)
      c.textBaseline='alphabetic'
      an.y+=an.s
      if(an.y<10||an.y>c.h*.9){
        an.s*=-1
      }
      if(touch(an.x,an.y,arrow.x+arrow.w,arrow.y, 25)){
        playerData.hunt+=an.w
        an.alive=false
      }
    }
  }
}

function badGuys(){
  for(bg of badGArr){
    if(bg.v&& bg.alive){
      c.textBaseline='middle'
      tx(bg.t, bg.x, bg.y, 5.3, colors[3])
      //drawKillBox(c, bg.x, bg.y, 25)
      c.textBaseline='alphabetic'
      bg.y+=bg.s
      if(bg.y<10||bg.y>c.h*.9){
        bg.s*=-1
      }
      if(touch(bg.x,bg.y,arrow.x+arrow.w,arrow.y, 25)){
        bg.alive=false
        nBadGuy--
      }
    }
  }
}

function bow(){
  //bow 
  c.beginPath();
  c.arc(arc.x,arc.y,arc.r,arc.start,arc.end);
  c.strokeStyle = "#000"
  c.lineWidth = 3
  c.stroke();
  c.closePath();
  // rope
  c.beginPath();
  c.moveTo(arc.x,arc.y-arc.r);
  if(arrow.set){
    c.lineTo(rope.x,arc.y);
  }
 
  c.lineTo(arc.x,arc.y+arc.r);
  c.lineWidth = 1
  c.stroke();
  c.closePath();

  if(arrow.set){
  //arrow shaft
  c.fillRect(rope.x,arc.y-3,10,6);
  c.fillRect(rope.x,arc.y-1,arrow.w,2);
  //arrow head
  c.beginPath();
  c.moveTo(rope.x+arrow.w,arc.y-4);
  c.lineTo(rope.x+arrow.w+12,arc.y);
  c.lineTo(rope.x+arrow.w,arc.y+4);
  c.fill();
  }else{
  //arrow shaft
  c.fillRect(arrow.x,arrow.y-3,10,6);
  c.fillRect(arrow.x,arrow.y-1,arrow.w,2);
  //arrow head
  c.beginPath();
  c.moveTo(arrow.x+arrow.w,arrow.y-4);
  c.lineTo(arrow.x+arrow.w+12,arrow.y);
  c.lineTo(arrow.x+arrow.w,arrow.y+4);
  c.fill();

  arrow.x+=12
  if(arrow.x>c.w){
    arrow.set=true
  }
  }

  if(arc.y>c.h-c.h*.3 || arc.y<50){
    arc.dy*=-1;
  }
  arc.y+=arc.dy;

}

const arrow ={
  x:0,
  y:0,
  w: 100,
  set:true
}
const arc = {
  x:0,
  y:0,
  dy:3,
    r:50,
    start:Math.PI+Math.PI/2,
    end:Math.PI-Math.PI/2
}
const rope = {
    h:arc.r*2,
    x:arc.x-25,
    status:true
}

function defend(){
  let arrows = playerData.supplies.Arrows.n
  tx("Your camp is under attack!", c.w / 2, c.h * .34, 5.3, colors[3])
  tx("Arrows: "+arrows, c.w / 2, c.h *.45, 3, colors[3])
  
  if(arrows>0){
    bow()
  }else{
    robbed()
    timerStatus="off"
    buttons[1].onClick()
  }
  if(nBadGuy<1){
    newEvent("You defended your camp from marauders!")
    timerStatus="off"
    buttons[1].onClick()
  }

  badGuys()
}

function setEnemies(){
  state="defend"
  buttons[8].label="Continue"
  buttons[8].color= colors [1]

  nBadGuy = badGArr.length
  for(bg of badGArr){
    bg.v = 1+(Math.random() * 2)
    bg.alive = true
    bg.x = c.w*.2+Math.random()*c.w*.7
    bg.y = c.h*.1+Math.random()*c.h*.6
    bg.s= 1+Math.random() * 3
  }
}

// might need to modify if price goes up and down along the wayToDo 
function shop(){
  tx("Market", c.w / 2, c.h * .1, 5.3, colors[3])
  let H=c.h*.19, weight=0
  let supplies = playerData.supplies
  sum = 0
  tx("Item", c.w*.2, H, 4,colors[2])
  tx("$", c.w*.35, H, 4,colors[2])
  tx("Num", c.w*.45, H, 4,colors[2])
  tx("Value", c.w*.55, H, 4, colors[2])
  H+=c.h*.06
for(item in supplies){
  tx(item, c.w*.2, H, 3, colors[3])
  tx(supplies[item].cost, c.w*.35, H, 3, colors[3])
  tx(supplies[item].n, c.w*.45, H, 3, colors[2])
  let value = supplies[item].n/supplies[item].q*supplies[item].cost << 0
  tx(value, c.w*.55, H, 3, colors[2])
  H+=c.h*.06
  sum+=value
}

tx("Total "+sum+"$", c.w*.5, H+=c.h*.05, 3, colors[2])
tx("You have "+playerData.money+"$", c.w*.5, H+=c.h*.05, 3, colors[2])
tx(loadCalc()+" lbs per camel", c.w*.5, H+c.w*.05, 3, (overloaded ? "red" : colors[2]))
}

const loadCalc = ()=>{
  let supplies = playerData.supplies, weight=0
  if(supplies["Camels"].n){
    for(item in supplies){
      weight+=supplies[item].n
    }
    weight = weight/(supplies["Camels"].n)<<0
    playerData.settings.load = weight<150 ? "light" : weight<250 ? "medium" : "heavy"
    buttons[13].label = playerData.settings.load
    overloaded = weight>450
    return weight 
  }
  return 0
}

function score(){
  let sum=0
  // what the value is of all their supplies
  let supplies = playerData.supplies
  for(item in playerData.supplies){
    let value = supplies[item].n/supplies[item].q*supplies[item].cost << 0
    sum+=value
  }
  playerData.score = (sum + playerData.money )*(5-playerData.dead)*(brownie?brownNum:1)
}

function map(){
  let scale1 = fullScreen && thin ? {s:2, w: c.w*.2, h: -c.h*.16}  : {s:2,w: c.w*.2, h: -c.h*.08}
  c.fillStyle = "lightblue"
  c.fillRect(0, 0, c.w, c.h)
  drawMap(scale1.s, scale1.w, scale1.h)
  tx("Map", c.w / 2, c.h * .1, 5.3, colors[3])
}
function drawMap(size, tX, tY){
  if(fullScreen){
  }
  // draw map
  svg.forEach((svgPath, i) => {
    const path = new Path2D(svgPath)

    // making it fit correctly
    c.save()
    c.scale(size,size) // make it bigger
    c.translate(tX, tY) // Adjust the x-coordinates to center

    if (i === svg.length - 1) {
      c.strokeStyle = colors[2] // line for route
      c.stroke(path)

      // line for progress
      steps.forEach(step=>{
        
        if(step.country==="Mongolia"){
          c.strokeStyle = colors[0]
        }else{
          c.strokeStyle = colors[1] 
        }
        drawPercentOfLine(step.start.x, step.start.y, step.end.x, step.end.y, step.percentage)
        
        if(touch(mouse.x/size-tX,mouse.y/size-tY, step.start.x , step.start.y, 6)){
          tx(step.name+", "+step.country,step.start.x, step.start.y-40, 2.5, colors[2])
        }
      })

      dots.forEach(({ x, y }) => {
        c.beginPath();
        c.arc(x, y, 3, 0, Math.PI * 2)
        c.fillStyle = "#E35A31"
        if(touch(mouse.x/size-tX,mouse.y/size-tY, x , y, 6)){
          c.fillStyle=colors[2]
        }
        c.fill()
        c.closePath()
    })

  }else{
      if(i ===1 || i===2|| i===3){
        c.fillStyle = "lightblue"
      }else{
        c.fillStyle = "BlanchedAlmond"
      }
      c.fill(path)
  }
    c.restore() // Restore the canvas transformation
  })
}

start()

function lose(){
  clearInterval(travelTimer)
  timerStatus="lose"
  state="lose"
  let ht = c.h/4
  tx("All your members are dead, you lose!",c.w/2, ht, 4, colors[2])
  Object.values(playerData.members).forEach((mem)=>{
    ht+=c.h*.1
    tx(mem.k+" died of "+mem.ill+"!",c.w/2, ht, 3, colors[2])
  })
}

function win(){
 s=10
 score()
// change the music
musicPlay(1)
}

function winScreen(){
  let sx = 12<7 ? 12*80 : (12-7)*80
  let sy = 12<7 ? 0 : 75
  c.drawImage(cities,sx,sy, 80, 75, c.w/2-80*5/2,c.h*.15, 80*5, 75*5)
  let dateDiff = Math.round(Math.abs((firstDay - playerData.date) / oneDay));
  
  tx("Congratulations you win!", c.w/2, c.h*.1, 4, colors[3])
  tx("Traveled "+totalMiles+" miles in "+dateDiff, c.w/2, c.h*.6, 3, colors[2])
  tx("Score: "+playerData.score, c.w/2, c.h*.66, 3, colors[2])
}

/** UTILS */

function start() {
    reqAnimationId = requestAnimationFrame(smoothAnimation)
}

function tx(t, w, h, f, s, a) {
    c.textAlign = a || 'center'
    c.fillStyle = s
    const fSize = Math.min(c.w, c.h) *.12* (f / 100)
    c.font = fSize + 'em Consolas'
    c.fillText(t, w, h)
}

function handleButtonClick(x, y, s) {
    buttons.forEach(button => {
      if (
        x >= button.x &&
        x <= button.x + button.width &&
        y >= button.y &&
        y <= button.y + button.height &&
        (button.s).includes(s)
      ) {
        button.isClicked = !button.isClicked;
        button.onClick()
        drawButtons()
        return true
      }
    });
    return false
  }

function drawButtons() {
    buttons.forEach(button => (button.s).includes(s) && button.draw())
}

function toggleTextContainer(show) {
    textContainer.style.display = show ? "block" : "none";
}

function changeText(newText) {
  textContainer.textContent = newText;
}

function drawRoundedRect(c, x, y, width, height) {
  const cornerRadius = 10
  c.beginPath()
  c.moveTo(x + cornerRadius, y)
  c.arcTo(x + width, y, x + width, y + height, cornerRadius)
  c.arcTo(x + width, y + height, x, y + height, cornerRadius)
  c.arcTo(x, y + height, x, y, cornerRadius)
  c.arcTo(x, y, x + width, y, cornerRadius)
  c.closePath()
  c.fill()
}

function drawPercentOfLine( x1, y1, x2, y2, percentage) {
  const interpolated_x = x1 + percentage * (x2 - x1)
  const interpolated_y = y1 + percentage * (y2 - y1)

  c.lineWidth=3.5
  c.beginPath()
  c.moveTo(x1, y1)
  c.lineTo(interpolated_x, interpolated_y)
  c.stroke()
  c.lineWidth=1
}

function logs(start, end){
  if(end>log.length){end=log.length}
  tx("Travel Logs", c.w/2, c.h*.15 , 4, colors[3])
  H=c.h*.3
  for(i=start;i<end;i++){
    tx(log[i], c.w/2, H , 2, colors[2])
    H+=c.h*.1
  }
  // button active
  buttons[14].active = start!==0
  buttons[15].active = end!==log.length 
} 

const touch =(x1,y1,x2,y2, d) =>{
  return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2) < d
}


// const drawKillBox=(c, x,y, d)=>{
//   c.beginPath()
//   c.lineWidth = "6"
//   c.strokeStyle = "red"
//   c.rect(x-d/2, y-d/2, d, d)
//   c.stroke()
// }

  function setMouse(e){
    const canvasRect = a.getBoundingClientRect()
    const scaleX = a.width / canvasRect.width
    const scaleY = a.height / canvasRect.height

    mouse.x = (e.clientX - a.getBoundingClientRect().left)*scaleX
    mouse.y = (e.clientY - a.getBoundingClientRect().top)*scaleY
  }
    
  function resizeCanvas() {
    const targetAspectRatio = 16 / 9;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const screenAspectRatio = screenWidth / screenHeight;

    thin = screenHeight < 400
  
    if (screenAspectRatio > targetAspectRatio) {
      // Screen is wider, adjust canvas height
      c.h = screenHeight
      c.w = screenHeight * targetAspectRatio
    } else {
      // Screen is more square or taller, adjust canvas width
      c.w = screenWidth
      c.h = screenWidth / targetAspectRatio
    }
    a.style.position = 'absolute'
    a.style.left = `${(screenWidth - c.w) / 2}px`
    a.style.top = `${(screenHeight - c.h) / 2}px`

    // reposition text container
    textContainer.style.width = `100%`
    txtInput.style.marginTop = `${(txtInput.clientHeight - txtInput.clientHeight) / 2}px`
    
    // Update arrow and arc positions and sizes based on canvas size
    arrow.x = c.w/2+c.w*.1
    arrow.y = c.h/2
    arc.x = 30 
    arc.y = c.h/2 
    rope.x = arc.x-25

    // reposition other elements
    buttons.length=0
    setButtons()

    if(fullScreen){
      buttons[18].label="X"
      buttons[17].label= loggedIn ? "logout" : "login"
      buttons[16].label= music ? "🔈":"🔇"
    }
  }

  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)


  
  