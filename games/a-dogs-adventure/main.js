const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 295;

let drawableObjects = [];
let currDO;
let curr2DO;
let movableObjects = [];

let jumpMaximum = 0;
let maxJump = 2;

let scoreTag = document.getElementById('scoreTag');

let keyRight;
let keyLeft;
let keyJump;



let highScore = 0;

if(localStorage.length > 0 ){
highScore = localStorage.getItem('highScore');
}


let started = false;

let jumpBtn = document.getElementById('jumpBtn');

let lost = false;

let barksTag = document.getElementById('barksTag');
let amountOfBarks = 7;

let barkBtn = document.getElementById('barkBtn');

const tick = 1000/60
//60 FPS

window.onload = setInterval(setGameLoop,tick);
window.onload = function(){
    blurt(`Run away from the Bubonic Plague and Infected Dogs! Use SpaceBar Or Jump Button To Jump And Press 'b' or Bark button to Bark`);
  setTimeout(() => {
    started = true;
  }, 3000);
}

setInterval(() => {
    if(started){
    player.velocity.max += 2;
    player.velocity.x = player.velocity.max;
    }
}, 10000);

setInterval(() => {
    if(started){
   player.score ++;
    }
}, 10);


function setGameLoop(){
    if(started){
    game.loop();
    }
    
}

const game = {
    x:canvas.getBoundingClientRect().x,
    y:canvas.getBoundingClientRect().y,
    width:canvas.width,
    height:canvas.height,
    loop:function(){
       Draw();
       player.move();
       scoreTag.innerHTML = `Score: ${player.score}`
       barksTag.innerHTML = `Amount Of Barks: ${amountOfBarks}`
    }
}


const player = new Player(400,100);

drawableObjects.push(player);




function Player(x,y){
    this.x = x;
    this.y = y;
    this.startingX = x;
    this.startingY = y;
    this.width = 98;
    this.height = 70;
    this.score = 0;
    this.animation = 'normal';
    this.woof = function(){
        
    }
    this.grv = 0.8;
    this.friction = 0.2;
    this.velocity = {
        x: 4,
        y: 0,
        max: 4,
    }
    this.img = new Image();
    this.move = function(){

        if(this.x + this.width < 0){
            if(!lost){
                if(player.score > highScore){
                    localStorage.setItem('highScore',player.score.toString());
                    highScore = localStorage.getItem('highScore');
                }
            alert(`You Got Infected! You Have A Score of ${player.score} and a High Score of ${highScore}`);
            lost = true;
            }
            window.location = window.location;
        }

        this.animation = 'normal';

        if(barks.length > 0){
            this.animation = 'Bark';
        }

      if(keyJump){
        this.velocity.y -= 1.3;
       }

       this.velocity.x += 5

      //gravity
      this.velocity.y += this.grv

      
 
      
      if(this.velocity.x > this.velocity.max){
        this.velocity.x = this.velocity.max;
      }

      if(this.velocity.x < -this.velocity.max){
        this.velocity.x = -this.velocity.max;
      }

    


      let horrizontalRect = {
        x:this.x + this.velocity.x,
        y:this.y,
        width:this.width,
        height:this.height,
      }
      let verticalRect = {
        x:this.x,
        y:this.y + this.velocity.y,
        width:this.width,
        height:this.height,
      }


      for(let i = 0;i<blocks.length;i++){
        let borderRect = {
            x: blocks[i].x,
            y:blocks[i].y,
            width:blocks[i].width,
            height:blocks[i].height,
        }
        if(checkIntersection(horrizontalRect,borderRect)){
            player.x -= player.velocity.x;
        }
        if(checkIntersection(verticalRect,borderRect)){
            this.velocity.y = 0;
            //player.x -= player.velocity.x;
        }
        if(blocks[i].x + blocks[i].width <= 0){
            blocks[i].x = canvas.width;
            let randomNum;
            let randomNum1;
            let randomNum2;
            let randomNum3;
            let randomNum4;
            let randomNum5;
            if(this.velocity.x < 8){
             randomNum = Math.floor(Math.random() * (10 - 1 + 1) + 1);
             randomNum1 = Math.floor(Math.random() * (15 - 1 + 1) + 1);
             randomNum2 = Math.floor(Math.random() * (15 - 1 + 1) + 1);
             randomNum5 = Math.floor(Math.random() * (35 - 1 + 1) + 1);
            }
            if(this.velocity.x >= 8 && this.velocity.x < 16){
                 randomNum = Math.floor(Math.random() * (20 - 1 + 1) + 1);
                 randomNum1 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                 randomNum2 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                 randomNum3 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                 randomNum5 = Math.floor(Math.random() * (50 - 1 + 1) + 1);
                }

                if(this.velocity.x >= 16 && this.velocity.x < 24){
                    randomNum = Math.floor(Math.random() * (20 - 1 + 1) + 1);
                    randomNum1 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                    randomNum2 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                    randomNum3 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                    randomNum4 = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                    randomNum5 = Math.floor(Math.random() * (75 - 1 + 1) + 1);
                   }

                   if(this.velocity.x >= 24 ){
                    randomNum = Math.floor(Math.random() * (30 - 1 + 1) + 1);
                    randomNum1 = Math.floor(Math.random() * (40 - 1 + 1) + 1);
                    randomNum2 = Math.floor(Math.random() * (40 - 1 + 1) + 1);
                    randomNum3 = Math.floor(Math.random() * (40 - 1 + 1) + 1);
                    randomNum4 = Math.floor(Math.random() * (50 - 1 + 1) + 1);
                    randomNum5 = Math.floor(Math.random() * (95 - 1 + 1) + 1);
                   }
        

            
            if(randomNum == 3){
                blocks.push(new Block(canvas.width,blocks[0].y - 100,100,100));
            }
            else if(randomNum1 == 4){
                blocks.push(new Block(canvas.width,blocks[0].y - 200,100,100));
            }

            if(randomNum2 == 5){
                if(Math.floor(this.velocity.y) == 0 || Math.round(this.velocity.y) == 0 || Math.round(this.velocity.y) == 0 && Math.floor(this.velocity.y) == 0){
               if( blocks[blocks.length - 1].x != canvas.width ||  blocks[blocks.length-1].y !=player.y){
                if(blocks[blocks.length - 2].x != canvas.width || blocks[blocks.length - 2].y != player.y){
                enemies.push(new Enemy(canvas.width,player.y));
                }
              
            }
        }
            }
             if(randomNum3 == 4){
                blocks.push(new Block(canvas.width,blocks[0].y - 300,100,100));
            }

            if(randomNum4 == 5){
                blocks.push(new Block(canvas.width,blocks[0].y - 400,100,100));
            }

            if(randomNum5 == 6){
                console.log('hai');
                bark(true)
            }
            


        }

      }



      for(let y = 0;y<barkObjects.length;y++){
        borderRect = {
            x:barkObjects[y].x,
            y:barkObjects[y].y,
            width:barkObjects[y].width,
            height:barkObjects[y].height,
        }
        if(checkIntersection(horrizontalRect,borderRect)){
            barkObjects.splice(y,1);
            amountOfBarks++;
        }
      }






      for(let d = 0;d<barks.length;d++){
        let borderRect = {
            x:barks[d].x,
            y:barks[d].y,
            width:barks[d].width,
            height:barks[d].height,
            id:barks[d].id,
        }
        for(let i = 0;i<blocks.length;i++){
            
       
        let borderRect2 = {
            x:blocks[i].x,
            y:blocks[i].y,
            width:blocks[i].width,
            height:blocks[i].height, 
        }
      
        if(checkIntersection(borderRect2,borderRect) && barks[d].isObject == undefined){
         barks.splice(d,1);
         blocks.splice(i,1);
        }
      
      
    }
    }




    for(let d = 0;d<barks.length;d++){
        for(let i = 0;i<enemies.length;i++){
            
        let borderRect = {
            x:barks[d].x,
            y:barks[d].y,
            width:barks[d].width,
            height:barks[d].height,
            id:barks[d].id,
        }
        let borderRect2 = {
            x:enemies[i].x,
            y:enemies[i].y,
            width:enemies[i].width,
            height:enemies[i].height, 
        }
      
        if(checkIntersection(borderRect2,borderRect)){
            barks.splice(d,1);
         
         enemies.splice(i,1);
        }
       
      
    }
    }



    for(let m = 0;m<enemies.length;m++){
        borderRect = {
            x:enemies[m].x,
            y:enemies[m].y,
            width:enemies[m].width,
            height:enemies[m].height,
        }
        if(checkIntersection(horrizontalRect,borderRect)){
            this.velocity.x = 0;
            this.velocity.y = 0;
            enemies.splice[m,1];
            
                if(!lost){
                    if(player.score > highScore){
                        localStorage.setItem('highScore',player.score.toString());
                        highScore = localStorage.getItem('highScore');
                    }
                alert(`You Got Infected! You Have A Score of ${player.score} and a High Score of ${highScore}`);
                lost = true;
                }
                window.location = window.location;
        }
        else if(checkIntersection(verticalRect,borderRect)){
            this.velocity.x = 0;
            this.velocity.y = 0;
            enemies.splice[m,1];
            if(!lost){
                if(player.score > highScore){
                    localStorage.setItem('highScore',player.score.toString());
                    highScore = localStorage.getItem('highScore');
                }
            alert(`You Got Infected! You Have A Score of ${player.score} and a High Score of ${highScore}`);
            lost = true;
            }
                window.location = window.location;
        }
    }


     




    for(let k = 0;k<enemies.length;k++){
        for(let i = 0;i<blocks.length;i++){
            if(Math.round(blocks[i].x) == Math.round(enemies[k].x) && Math.round(blocks[i].y) == Math.round(enemies[k].y) ){
                blocks.splice[i,1]
            }
        }
    }
      
      

    

      for(let i = 0;i<movableObjects.length;i++){
        if(Array.isArray(movableObjects[i])){
            let curr = movableObjects[i];
            for(let j = 0;j<curr.length;j++){
                curr[j].x -= this.velocity.x;
                curr[j].y -= this.velocity.y;
            }
        }
        else{
            movableObjects[i].x -= this.velocity.x;
            movableObjects[i].y -= this.velocity.y;
        }
      }

    }
    this.draw = function(){
        if(this.animation == 'normal'){
            this.img.src = 'jumboFrame1.png';
        }
        else if(this.animation.toLowerCase() == 'bark'){
            this.img.src = 'jumboFrame2.png';
        }
       
    ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
}


//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================

function Draw(){
    ctx.clearRect(0,0,game.width,game.height);

    ctx.fillStyle = '#e28743';
    ctx.fillRect(0,0,game.width,game.height);

    ctx.fillStyle = 'black';
    ctx.font = '65px Ariel';
    ctx.fillText("A Dog's Adventure",280,670);

    for(let i = 0;i<drawableObjects.length;i++){
        if(Array.isArray(drawableObjects[i])){
            currDO = drawableObjects[i]
            for(let j = 0;j<currDO.length;j++){
                if(Array.isArray(currDO[j])){
                    curr2DO = currDO[j];
                    for(let k = 0;k<curr2DO.length;k++){
                        curr2DO[k].draw();
                    }
                }
                else{
                 
               
                    currDO[j].draw();
                    
                }
            }
        }
        else{
            drawableObjects[i].draw();
        }
    }
}

//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================
//===========================================================================================


//eventListeners


window.addEventListener('keydown',(e)=>{
    if(e.key == 'ArrowRight' || e.key == 'd'){
        keyRight = true;
    }
    if(e.key == 'ArrowLeft' || e.key == 'a'){
        keyLeft = true;
    }
    
    if(e.key == 'ArrowUp' || e.key == 'w' || e.key == ' '){
        if(jumpMaximum < maxJump){
            e.preventDefault();
            jumpMaximum += 1;
            keyJump = true;
     
            setTimeout(() => {
                keyJump = false;
            }, 300);
     
    }
    }
})

window.addEventListener('keyup',(e)=>{
    if(e.key == 'ArrowRight' || e.key == 'd'){
        keyRight = false;
    }
    if(e.key == 'ArrowLeft' || e.key == 'a'){
        keyLeft = false;
    }
    if(e.key == 'b'){
        if(amountOfBarks > 0){
            bark();
            amountOfBarks --;
            }
    }
    if(e.key == 'ArrowUp' || e.key == 'w' || e.key == ' '){
        keyJump = false;
        jumpMaximum = 0;
    }
})


barkBtn.onclick = function(){
    if(amountOfBarks > 0){
    bark();
    amountOfBarks --;
    }
}

barkBtn.addEventListener('touchend',(e)=>{
    if(amountOfBarks > 0){
        bark();
        amountOfBarks --;
        }
})
    



jumpBtn.addEventListener('mousedown',(e)=>{
    if(jumpMaximum < maxJump){
        e.preventDefault();
        jumpMaximum += 1;
        keyJump = true;
 
        setTimeout(() => {
            keyJump = false;
        }, 300);
 
}
})

jumpBtn.addEventListener('mouseup',(e)=>{
    keyJump = false;
        jumpMaximum = 0;
})


jumpBtn.addEventListener('touchstart',(e)=>{
    if(jumpMaximum < maxJump){
        e.preventDefault();
        jumpMaximum += 1;
        keyJump = true;
 
        setTimeout(() => {
            keyJump = false;
        }, 300);
 
}
})

jumpBtn.addEventListener('touchend',(e)=>{
    keyJump = false;
        jumpMaximum = 0;
});



window.addEventListener('blur',()=>{
    started = false;
})

window.addEventListener('focus',()=>{
    started = true;
})










//++++++++++++++++++++++++++++++++++++++++++++++++





let blocks = [];

drawableObjects.push(blocks);
movableObjects.push(blocks);

blocks.push(new Block(5000000000000000000000000,500,100,100));
blocks.push(new Block(0,500,100,100));
blocks.push(new Block(100,500,100,100));
blocks.push(new Block(200,500,100,100));
blocks.push(new Block(300,500,100,100));
blocks.push(new Block(400,500,100,100));
blocks.push(new Block(500,500,100,100));
blocks.push(new Block(600,500,100,100));
blocks.push(new Block(700,500,100,100));
blocks.push(new Block(800,500,100,100));
blocks.push(new Block(900,500,100,100));
blocks.push(new Block(1000,500,100,100));

function Block(x,y,width,height,type){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type;
    this.img = new Image();
    this.draw = function(){
        if(this.type = 'normal' || this.type == undefined || this.type == null){
            this.img.src = 'blockImg.png';
        }
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
}






let enemies = [];

drawableObjects.push(enemies);

movableObjects.push(enemies);


function Enemy(x,y){
    this.x =x ;
    this.y = y;
    this.width = player.width;
    this.height = player.height;
    this.id = RandomId();
    this.pos = undefined;
    this.img = new Image();
    this.draw = function(){
     this.img.src = 'strayDogImg.png';
     ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
     for(let i = 0;i<enemies.length;i++){
      if(enemies[i].id == this.id){
        this.pos = i;
      }
     }
     for(let i = 0;i<blocks.length;i++){
        let borderRect = {
            x:blocks[i].x,
            y:blocks[i].y,
            width:blocks[i].width,
            height:blocks[i].height,
        }
     if(checkIntersection(enemies[this.pos],borderRect)){
       blocks.splice(i,1);
     }
     }
    }
}


let barks = [];
let barkObjects = [];

drawableObjects.push(barks);
drawableObjects.push(barkObjects);
movableObjects.push(barkObjects);

function Bark(x,y,width,height,isObject){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.id = RandomId();
    this.img = new Image();
    this.isObject = isObject;
    this.draw = function(){
        
        this.img.src = 'barkImg.png'
        ctx.drawImage(this.img,this.x,this.y,this.width,this.height);

        if(this.isObject == undefined){this.x += 5;}
        
        if(this.x > canvas.width && this.isObject == undefined){
        for(let i = 0;i<barks.length;i++){
            if(barks[i].id == this.id){
                barks.splice(i,1);
            }
        }
    }
    else if(this.x + this.width < 0  && this.isObject == true){
        for(let i = 0;i<barks.length;i++){
            if(barks[i].id == this.id){
                barks.splice(i,1);
            }
        }
    }
       
        

        
    }
    }








function checkIntersection(r1, r2){
    if(r1.x >= r2.x+r2.width){
        return false;
    }
    else if(r1.x + r1.width <= r2.x){
        return false;
    }
    else if(r1.y >= r2.y + r2.height){
        return false;
    }
    else if(r1.y + r1.height <= r2.y){
        return false;
    }

else{
    return true;
}



}

function bark(isObject){
    if(isObject == true){
        barkObjects.push(new Bark(canvas.width,player.y + 15,60,50,true));
    }
    else{
barks.push(new Bark(player.x+player.width,player.y + 15,60,50));

    }
}




function RandomId(){
    return Math.random().toString(36);
}