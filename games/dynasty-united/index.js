// function createpath(params) {

//     for (let index = 0; index < 100; index++) {

//         const element = array[index];

//     }

// }
// function nextTurn() {

// }

// function evaluateLoss(params) {

// }

// indexes of bases (clickable)

const ALLYCAMP = [
    309,
310,
311,
312,
313,
314,
315,
316,
333,
332,
331,
330,
329,
328,
327,
326,
325,
324,
340,
356,
357,
341,
342,
358,
359,
343,
344,
360,
361,
345,
346,
362,
347,
363,
348,
364,
349,
365

]

const EnemyMainArmy = [
    148,
149,
150,
151,
152,
153,
154,
155,
156,
157,
173,
172,
171,
170,
169,
168,
167,
166,
165,
164,
180,
181,
182,
183,
184,
185,
186,
187,
188,
189,
205,
204,
203,
202,
201,
200,
199,
198,
197,
196,
212,
213,
214,
215,
216,
217,
218,
219,
220,
221,
237,
236,
235,
234,
233,
232,
231,
230,
229,
228,
244,
245,
246,
247,
248,
249,
250,
251

]
const enenyMainBase = [
    70,
71,
72,
73,
74,
75,
92,
91,
90,
89,
88,
87,
86,
85,
101,
102,
103,
104,
105,
106,
107,
108,
124,
123,
122,
121,
120,
119,
118,
117
]

const enemyBackBase = [
    [   63,
        47,
        31,
        30,
        29,
        45,
        61,
        62,
        46],
    [23,
        24,
        25,
        26,
        42,
        41,
        40,
        39],
    [52,
        51,
        50,
        34,
        18,
        19,
        35,
        20,
        36]
]


let GRID = document.getElementById("grid")

function createGrid() {


    // for (let index = 0; index < array.length; index++) {
    //     const element = array[index];

    // }
    let index = 0
    for (j = 0; j < 32; j++) {
        for (i = 0; i < 16; i++) {
            index++
            addGrid(index)
            // console.log('thdfg')
        }
    }



}
const mainDash = document.getElementById("main-dash")
let currentPosition = "ally-base"
function clickPosition(num){
    
    if(currentPosition === 'ally-base' || currentPosition === 'right-wing' || currentPosition === 'left-wing'){

        for (let i = 0; i < enemyBackBase.length; i++) {
            if (enemyBackBase[i].includes(num)) {
                if(i === 0 && currentPosition === "ally-base"){
                    // console.log("backright")
                    goTo('right-wing')
                    logActions(`Go to enemy right wing army`)
                    
    
                }
                if(i === 1){
                    // console.log("center")
                    goTo('center-back')
                    logActions(`Go to enemy center back army`)
                    
    
                }
                if(i === 2 && currentPosition === "ally-base"){
                    // console.log("backleft")
                    goTo('left-wing')
                    logActions(`Go to enemy left wing army`)
                    
                }

                mainDash.style.display = "block"
                GRID.style.pointerEvents = "none"
                landing.style.display = "none"

                return
            }
        }


    }
    

    if(enenyMainBase.includes(num)){
        // console.log('nigga')
        goTo('enemy-base')
        mainDash.style.display = "block"
        GRID.style.pointerEvents = "none"
        landing.style.display = "none"
        logActions(`Arrived Enemy Base`)
        
    }
    
}


function addGrid(params) {
    let gridCell = document.createElement("div")
    GRID.appendChild(gridCell)
    gridCell.addEventListener("click", () => {
        clickPosition(params) 
        computerChoose()})
    
}
const me = document.getElementById("me")
function addPlayer(colored) {
    
    let gridCell = document.createElement("div")
    gridCell.style.backgroundColor = "none"
    if(colored){
        gridCell.style.backgroundColor = "yellow"
    }

    me.appendChild(gridCell)

}

function createPlayer() {
    for (let i = 0; i < 6; i++) {
        if(i === 0 || i === 2){
            addPlayer(false)
        }else{
            addPlayer(true)
        }
        
    }
    
}



function goTo(position) {
    if(position === 'right-wing'){
        me.style.animation = "goToRightWing  1.5s ease forwards"
        setTimeout(() => {
            me.style.bottom = "580px"
            me.style.left = "255px"
        }, 2000);
        
       
        currentPosition = position
    }
    if(position == 'left-wing'){
        me.style.animation = "goToLeftWing  1.5s ease forwards"
        setTimeout(() => {
        me.style.bottom = "580px"
        me.style.left = "35px"
        }, 2000);
        currentPosition = position

    }
    if(position == 'center-back'){
        
        if(currentPosition === 'right-wing'){
            me.style.animation = "goLeft 1s ease forwards"
        }
        if(currentPosition === 'left-wing'){
            me.style.animation = "goRight 1s ease forwards"  
        }
        setTimeout(() => {
            me.style.left = "140px"
  
        }, 500);
        currentPosition = position

    }
    if(position == 'enemy-base'){
        me.style.animation = "goEnemyBase 1s ease forwards"
        currentPosition = position
        

    }
    
}

let allyChoice = 'cavalry'
let enemyChoice 
const annouce = document.getElementById("announce")
const cavalry = document.getElementById("cavalry")
const archer = document.getElementById("archer")
const infantry = document.getElementById("infantry")
const computerChoice = document.getElementById("computer-choice")
const allyChoiceDisplay = document.getElementById("human-choice")
cavalry.addEventListener('click', ()=> {
    allyChoice = 'cavalry'
    allyChoiceDisplay.textContent = allyChoice

})
archer.addEventListener('click', ()=> {
    allyChoice = 'archer'
    allyChoiceDisplay.textContent = allyChoice
})
infantry.addEventListener('click', ()=> {
    allyChoice = 'infantry'
    allyChoiceDisplay.textContent = allyChoice
})



function computerChoose() {
    const options = ["Cavalry", "Archer", "Infantry"];
    const randomIndex = Math.floor(Math.random() * options.length);
    computerChoice.textContent = options[randomIndex] 
    enemyChoice = options[randomIndex] 
    // console.log(options[randomIndex])
}


function checkWinner(playerSelection, computerSelection) {
    playerSelection = playerSelection.toLowerCase();
    computerSelection = computerSelection.toLowerCase();

    if (playerSelection === computerSelection) {
        return "It's a tie!";
    } else if (
        (playerSelection === "cavalry" && computerSelection === "archer") ||
        (playerSelection === "archer" && computerSelection === "infantry") ||
        (playerSelection === "infantry" && computerSelection === "cavalry")
    ) {
        
        setTimeout(() => {
            GRID.style.pointerEvents = "auto"
            mainDash.style.display = "none"
            if (currentPosition === 'enemy-base') {
                logActions(`Executed <b style="color:red">Cao Cao</b> ` ) 
            }
            if(currentPosition === 'left-wing'){
                logActions(`Executed <b style="color:red">Sun Jian</b>` ) 
            }
            if(currentPosition === 'center-back'){
                logActions(`Executed <b style="color:red">Liu Bei</b>` ) 
            }
            if (currentPosition === 'right-wing') {
                logActions(`<b style="color:red">Guan Yu, Zhang Fe, and Zhao Yun</b> Defeated` ) 
            }
            logActions(`Won in the battle of ${currentPosition} army` ) 

            if(currentPosition === 'left-wing'){
                logActions(`<b style="color:pink">Wu</b> Dynasty Defeated` ) 
            }
            if(currentPosition === 'center-back'){
                logActions(`<b style="color:green">Shu</b> Dynasty Defeated` ) 
            }
            if (currentPosition === 'right-wing') {
                logActions(`<b style="color:green">Shu</b> Generals Defeated` ) 
            }
            if (currentPosition === 'enemy-base') {
                logActions(`<b style="color:yellow">Mongol Empire </b> Victory!!` ) 
            }
        }, 500);
        setTimeout(() => {
            landing.style.display = "block"
        }, 500);
        return `You win! ${playerSelection} beats ${computerSelection}.`;
        
    } else {
        return `You lose! ${computerSelection} beats ${playerSelection}.`;
    }
}


const attackBtn = document.getElementById("attack")

const landing = document.getElementById("landing")

attackBtn.addEventListener('click', ()=>{
   
    
    announce.textContent = checkWinner(allyChoice, enemyChoice)
    setTimeout(() => {
        announce.textContent = "Restraint: cavalry << archer << infantry"
    }, 500);


})

const logBook = document.getElementById("log")
function logActions(logtext){
    let list = document.createElement("li")
    list.innerHTML = logtext
    logBook.appendChild(list)

}



window.addEventListener('load', ()=>{
    createGrid()
    createPlayer()
    
    // goTo('right-wing')
    // setTimeout(() => {
    //     goTo('center-back')
    // }, 1000);
    
})



