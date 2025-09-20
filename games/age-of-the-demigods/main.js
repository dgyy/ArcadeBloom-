//Copyright ©️ Armaan Mohammed 2023 onwards All Rights Reserved

//js13k Submission 2023 by Armaan.M

//Updated and Improved version of game with ANIMATIONS is available on https://armaanm.itch.io/ageofthedemigods

//Project Created By @Armaan.M (Armaan Mohammed) on 14/8/23


//Basic Game Setup
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 295;

//missions To Display At game.

let tasks = ['Find a demigod.','Find petrol.','Meetup with head Centaur', 'Listen To The Prophecy of Night 0', 'Find A Torch.','Train a Pegasus','Defeat Nyx', 'Climb Mt.Olympus'];

let task = tasks[0];

let backgroundSpriteNum = undefined;

//
let drawableObjects = [];
let movableObjects = [];

//variables To track DrawableObjects
let currDo;
let currDo2;
let currMo;
let currMo2;

//forMission7
let nyxDefeated = false;

//touch screen compatibility

let rightBtn = document.getElementById('rightBtn');
let leftBtn = document.getElementById('leftBtn');
let jumpBtn = document.getElementById('jumpBtn');
let crouchBtn = document.getElementById('crouchBtn');

let touchScreen = false;
//
let keyRight = false;
let keyLeft = false;
let keyUp = false;

//checks song loop;
let songLoopStarted = false;

//unlocked on mission 2
let keyCrouch = false;

//For End Scene
let blackedOut = false;
let gameEnded = false;

window.onload = function(){
blurt('Welcome To The Age Of The Demigods By Armaan.M!');
//calls gameloop
setInterval(GameLoop,1000/30);
setTimeout(() => {
    rules()
}, 5000);
setTimeout(() => {
    PlayCutsceneChapter1();
}, 7000);

setInterval(() => {
    for(let i = 0;i<nyx.length;i++){
        nyx[i].move();
    }
}, 1800);
}


function GameLoop(){
    game.loop()
}


let game = new Game();

//basic Canvas settings in game Object
function Game(){
    this.x = canvas.getBoundingClientRect().x;
    this.y = canvas.getBoundingClientRect().y;
    this.width = canvas.width;
    this.height = canvas.height;
    this.loop = function(){
        Draw();
    
        //gameLoop

        this.x = canvas.getBoundingClientRect().x;
        this.y = canvas.getBoundingClientRect().y;
        this.width = canvas.width;
        this.height = canvas.height;

        player.move();
    }
}



let player = new Player(200,canvas.height - 75 * 2)

//player Object

function Player(x,y){
    this.x = x;
    this.y = y;
    this.width = 75;
    this.height = 75;
    this.facing = 'right';
    this.velocity = {
        x: 0,
        y: 0,
    }
    this.grv = 0.9;
    this.friction = 0.2;
    this.onGround = false;
    this.hasTorch = false;
    this.frame = 1;
    this.maxHorrizontalVelocity = 8;
    this.movementAllowed = true;
    this.crouching = false;
    this.normalHeight = undefined;
    this.normalY = undefined;
    this.health = 100;
    this.maxHealth = 100;
    this.hasPetrol = false;
    this.img = new Image();
    this.move = function(){
       if(this.movementAllowed){
        if(keyRight){
      this.velocity.x += 1;
      this.facing = 'right';
        }
        if(keyLeft){
            this.velocity.x -= 1;
            this.facing = 'left';
        }
       }

       for(let i = 0;i<pegasuses.length;i++){
        pegasuses[i].move();
       }
       for(let i = 0;i<rocks.length;i++){
        rocks[i].move();
       }
       if(keyCrouch && this.normalHeight == undefined){
        this.normalY = this.y;
        this.normalHeight = this.height;
        this.y += this.normalHeight/3;
        this.height -= this.normalHeight/3;
        this.crouching = true;
       }
       
        if(!keyRight && !keyLeft || keyRight && keyLeft){
            this.velocity.x *= this.friction;
        }

        if(this.velocity.x > this.maxHorrizontalVelocity){
            this.velocity.x = this.maxHorrizontalVelocity;
        }
        else if(this.velocity.x < -this.maxHorrizontalVelocity){
            this.velocity.x = -this.maxHorrizontalVelocity;
        }

        if(touchScreen){
            rightBtn.style.display = 'block';
            leftBtn.style.display = 'block';
            jumpBtn.style.display = 'block';
        }
        if(this.health <= 0){
            if(task = tasks[1]){
                blurt('You Died');
                this.health = 100;
                clearInterval(cyclops[0].interval)
                    transitionMission2();  
             

            }
        }

        for(let i = 0;i<cyclops.length;i++){
            cyclops[i].move();
        }

        if(this.movementAllowed){


        if(keyUp && !this.crouching){
            if(!this.onGround){
                keyUp = false;
            }
            this.velocity.y -= 6.5;
        }
    }
        this.onGround = false;

       this.velocity.y += this.grv


       //collision detector Relative to velocity
        let horrizontalRect = {
            x:this.x + this.velocity.x,
            y:this.y,
            width:this.width,
            height:this.height,
        }
        let verticalRect = {
            x:this.x,
            y: this.y + this.velocity.y,
            width:this.width,
            height:this.height,
        }

         //ensures player is always displayed on top of other sprites
        array_move(drawableObjects,drawableObjects.indexOf(player),drawableObjects.length - 1);
        //checks collision

        for(let i = 0;i<blocks.length;i++){
            let borderRect = {
                x:blocks[i].x,
                y:blocks[i].y,
                width:blocks[i].width,
                height:blocks[i].height,
            }
            if(checkIntersection(horrizontalRect,borderRect)){
                this.velocity.x = 0;
            }
            if(checkIntersection(verticalRect,borderRect)){
                if(blocks[i].isTeleportBlock){
                    this.velocity.y = 0;
                    player.movementAllowed = false;
                    PlayEndScene();
                    ClearStuff();
                }
                else{
                this.onGround = true;
                if(blocks[i]);
                this.velocity.y = 0;
                }
            }
        }


        for(let i = 0;i<barriers.length;i++){
            let borderRect = {
                x:barriers[i].x,
                y:barriers[i].y,
                width:barriers[i].width,
                height:barriers[i].height,
            }
            if(checkIntersection(horrizontalRect,borderRect)){
                this.velocity.x = 0;
            }
            if(checkIntersection(verticalRect,borderRect)){
                this.onGround = true;
                this.velocity.y = 0;
            }
        }

        for(let i = 0;i<rocks.length;i++){
            let borderRect = {
                x:rocks[i].x,
                y:rocks[i].y,
                width:rocks[i].width,
                height:rocks[i].height,
            }
           
             if(checkIntersection(verticalRect,borderRect)){
                //thisv.y = 0;
                for(let j = 0;j<rocks.length;j++){
                    rocks[j].y = - 100;
                }
                blurt('You Died.');
                rocks.splice(0,rocks.length);
                ClearStuff();
                transitionMission7();
            }
        }

        for(let i = 0; i<cyclops.length;i++){
            let borderRect = {
                x:cyclops[i].x,
                y:cyclops[i].y,
                width:cyclops[i].width,
                height:cyclops[i].height,
            }
            if(checkIntersection(horrizontalRect,borderRect)){
                this.velocity.x = 0;
            }
        }

        //





        //Moves Object Giving illusion of playerMovement
        
        for(let i = 0;i<movableObjects.length;i++){
            currMo = movableObjects[i];
            if(Array.isArray(currMo)){
                for(let j = 0;j<currMo.length;j++){
                    currMo2 = currMo[j];
                    currMo2.x -= this.velocity.x;
                    currMo2.y -= this.velocity.y;
                }
            }
            else{
                currMo.x -= this.velocity.x;
                currMo.y -= this.velocity.y;
            }
        }
        for(let i = 0;i<clouds.length;i++){
            clouds[i].x -= this.velocity.x * clouds[i].speed;
            clouds[i].y -= this.velocity.y
        }
    }
    this.draw = function(){
        if(this.facing == 'right'){
            if(this.crouching){
                 this.img.src = 'demigodRightCrouchImg.png';
            }
            else if(this.frame == 1 || this.frame == 3){
               this.img.src = 'demigodRightImg.png';
            
            }
            else if(this.frame == 2){
                this.img.src = 'demigodRightImg2.png'
            }
            else if(this.frame == 4){
                this.img.src = 'demigodRightImg3.png';
               
            }
        }
        else if(this.facing == 'left'){
            if(this.crouching){
                
              this.img.src = 'demigodLeftCrouchImg.png';
            }
            else if(this.frame == 1 || this.frame == 3){
          this.img.src = 'demigodLeftImg.png';
            }
            else if(this.frame == 2){
                this.img.src = 'demigodLeftImg2.png'
            }
            else if(this.frame == 4){
                this.img.src = 'demigodLeftImg3.png'
            }
               }
               if(this.crouching){
                ctx.drawImage(this.img,this.x,this.normalY,this.width,this.normalHeight);
               }
               else{
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
               }

               if(task == tasks[1]){
                ctx.fillStyle = 'black';
                ctx.fillRect(this.x - 15,this.y - 15,this.maxHealth,15);
               
                ctx.fillStyle = 'red';
                ctx.fillRect(this.x - 15,this.y - 15,this.health,15);
               }
    }
}


//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$

//Draw Function 
function Draw(){
//Disables image smoothing to keep pixel art sharp when resized.
    ctx.ImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;  
    //
    ctx.clearRect(0,0,game.width,game.height);
    ctx.shadowBlur = 0;
                    ctx.shadowColor = '#ff00';
              ctx.fillStyle = 'darkorange';

    //draws Background for each task
    let backgroundImg = new Image();
    if(task == tasks[0]){
    ctx.fillStyle = '#37C6FF';
    FillRect();
    }
    else if(task == tasks[1]){
       ctx.fillStyle = '#333333'; 
       FillRect();
    }
    else if(task == tasks[2]){
        ctx.fillStyle = 'rgb(245,245,222)'; 
        FillRect();
     }
     else if(task == tasks[3]){
        
        backgroundImg.src = 'backgroundImg.png';
        DrawImage(backgroundImg);
     }

     else if(task == tasks[4] || task == tasks[5] || task == tasks[6]){
        ctx.fillStyle = 'rgb(34,34,34)'; 
        FillRect();
     }

     else if(task == tasks[7]){
        ctx.fillStyle = '#37C6FF';
        FillRect()
        }

     if(backgroundSpriteNum == 1){
        backgroundImg.src = 'zuesImg.png';
        DrawImage(backgroundImg)
     }   

     else if(backgroundSpriteNum == 2){
        backgroundImg.src = 'EndSceneSave-1.png';
        DrawImage(backgroundImg)
     }  
     else if(backgroundSpriteNum == 3){
        backgroundImg.src = 'EndSceneSave-2.png.png';
        DrawImage(backgroundImg);
     } 
     else if(backgroundSpriteNum == 4){
        backgroundImg.src = 'EndSceneSave-3.png.png';
        DrawImage(backgroundImg);
     } 
     else if(backgroundSpriteNum == 5){
        backgroundImg.src = 'EndSceneSave-4.png.png';
        DrawImage(backgroundImg);
     } 
     else if(backgroundSpriteNum == 6){
        backgroundImg.src = 'EndSceneSave-5.png.png';
        DrawImage(backgroundImg);
     } 
     else if(backgroundSpriteNum == 7){
        backgroundImg.src = 'EndSceneImg.png';
        DrawImage(backgroundImg);
     } 


     


            //draws Objects in array drawableObjects
            if(!blackedOut){
    for(let i = 0;i<drawableObjects.length;i++){
         currDo = drawableObjects[i];
        if(Array.isArray(currDo)){
            for(let j = 0;j<currDo.length;j++){
                ctx.shadowBlur = 0;
                    ctx.shadowColor = '#ff00';
              ctx.fillStyle = 'darkorange';
                currDo2 = currDo[j];
                currDo2.draw();
            }
        }
        else{
            ctx.shadowBlur = 0;
                    ctx.shadowColor = '#ff00';
              ctx.fillStyle = 'darkorange';
            currDo.draw();
        }
    }
}

    //displays mission
    if(backgroundSpriteNum == undefined){
    ctx.font = 'bold 25px serif';
    ctx.fillStyle = 'red';

    ctx.fillText(`Mission ${tasks.indexOf(task) + 1}: ${task}`,canvas.width - 300,30,300);
    }

    if(blackedOut){
        ctx.fillStyle = 'black';
        FillRect();
    }


}
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$


function rules(){
    blurt('You Are Hercules Son Of Zues!');
}

function PlayCutsceneChapter1(){
        blurt('You: Last Thing I remember I was on a mission in an abandoned temple about to find something important...');
    setTimeout(() => {
        blurt(`I have to find a demigod and get back to base!`);
    }, 5000);

    setTimeout(() => {
        blurt('Click People or Objects to Interact');
    }, 8000);

    setTimeout(() => {
        brompt('Are You On A touchscreen Device(Y or N)',function(ans){
            if(ans == 'Y' || ans == 'y' || ans == 'yes'){
              touchScreen = true;
            }
        })
    }, 11000);
  

};

//event listeners

    window.addEventListener('keydown',(e)=>{
        if(e.key == 'ArrowRight' ||  e.key == 'd'){
            e.preventDefault();
         keyRight = true;
        }
        if(e.key == 'ArrowLeft' ||  e.key == 'a'){
            e.preventDefault();
            keyLeft = true;
           }
        if(e.key == 'ArrowUp' ||  e.key == 'w' || e.key == ' '){
            e.preventDefault();
            if(player.onGround){
            keyUp = true;
            player.frame = 1;
            }
           }

           if(tasks.indexOf(task)>0){
            if(e.key == 'c' && player.onGround == true && player.crouching == false){
                keyCrouch = true;
            }
            else if(e.key == 'c' && player.crouching == true){
                keyCrouch = false;
                player.y = player.normalY;
                player.height = player.normalHeight;
                player.normalHeight = undefined;
                player.normalY = undefined;
                player.crouching = false;
            }
           }
    })

    



    window.addEventListener('keyup',(e)=>{
        player.frame = 1;
        if(e.key == 'ArrowRight' ||  e.key == 'd'){
            e.preventDefault();
         keyRight = false;
        }
        if(e.key == 'ArrowLeft' ||  e.key == 'a'){
            e.preventDefault();
            keyLeft = false;
           }
        if(e.key == 'ArrowUp' ||  e.key == 'w' || e.key == ' '){
            e.preventDefault();
            keyUp = false;
           }
    });


   let blocks = [];

   drawableObjects.push(blocks);
   movableObjects.push(blocks);

   for(let i = -2;i<35;i++){
    blocks.push(new Block(i*75,canvas.height,75,75));
   }

    function Block(x,y,width,height,type,isTeleportBlock){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.isTeleportBlock = isTeleportBlock;
        this.img = new Image();
        this.draw = function(){
            if(this.type == 1){
                this.img.src = 'rockImg.png';
            }
            else if(this.type == 2){
                this.img.src = 'baseFloorImg.png';
            }
            else if(this.type == 3){
                if(this.isTeleportBlock){
                    ctx.shadowBlur = 30;
                    ctx.shadowColor = "yellow";
                    ctx.fillStyle = 'yellow';
                }
                else{
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = '#ff00';
              ctx.fillStyle = 'darkorange';
                }
              ctx.fillRect(this.x,this.y,this.width,this.height);
            }
            else{
                this.img.src = 'grassImg.png';
            }
            if(this.type != 3){
           ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
             }
    }
    }


    let barriers = [];

    spawnBarriers();

    movableObjects.push(barriers);

    function Barrier(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }



    let humans = [];

    movableObjects.push(humans);
    drawableObjects.push(humans);

    humans.push(new Humans(75*10,canvas.height - 75,1,'right'));

    humans.push(new Humans(75*15,canvas.height - 75,2,'left'));

    humans.push(new Humans(75*20,canvas.height - 75,3,'right'));

    humans.push(new Humans(75*25,canvas.height - 75,'adnos','left'));

    function Humans(x,y,type,facing){
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 75;
        this.clickedOn = 0;
        this.type = type;
        this.id = RandomId();
        this.facing = facing;
        this.img = new Image();
        this.draw = function(){
          if(this.type == 1){
                this.img.src = 'humanType1Right.png';
            
          }

          else if(this.type == 2){
            this.img.src = 'humanType2Left.png';
            
          }

          else if(this.type == 3){
                this.img.src = 'humanType3Right.png';
            
          }

          else if(this.type == 'adnos'){
            this.width = 75;
            if(this.facing == 'left'){
            this.img.src = 'adnosLeftImg.png';
            }
            else if(this.facing == 'right'){
                this.img.src = 'adnosRightImg.png';
            }
          }
          else if(this.type == 4){
            this.width = 75;
            this.img.src = 'demigodRightImg2png.png';
            
        }

        else if(this.type == 5){
            this.width = 75;
            
            this.img.src = 'penelopeRightImg.png';
            
        }

        else if(this.type == 'chiron'){
            this.width = 100;this.height = 100;
           
            this.img.src = 'chironImg.png';
            
        }

          ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }


    let moons = [];

    drawableObjects.push(moons);

    function Moon(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.draw = function(){
         this.img.src = 'moonImg.png';
         ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }







    let clouds = [];

    drawableObjects.push(clouds);

    clouds.push(new Cloud(100,100,100,100,0.1));
    clouds.push(new Cloud(500,100,100,100,0.2));
    clouds.push(new Cloud(300,50,100,100,0.3));
    clouds.push(new Cloud(700,50,100,100,0.3));

    clouds.push(new Cloud(100,-50,100,100,0.1));
    clouds.push(new Cloud(500,-50,100,100,0.2));
    clouds.push(new Cloud(300,-100,100,100,0.3));
    clouds.push(new Cloud(700,-200,100,100,0.3));

    function Cloud(x,y,width,height,speed,type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.type = type
        this.img = new Image();
        this.draw = function(){
            if(this.type == 1){
                this.img.src = 'stormCloudImg.png';
            }
            else{
            this.img.src = 'cloudImg.png';
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
            if(this.x + this.width < 0){
                this.x = canvas.width;
            }
        }
    }



    let cars = [];

    drawableObjects.push(cars);
    movableObjects.push(cars);

    function Car(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.draw = function(){
            this.img.src = 'carImg.png';
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }





    let cyclops = [];

    drawableObjects.push(cyclops);
    movableObjects.push(cyclops);

    function Cyclops(x,y,width,height,type){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.hasTrigeredSpawns = false;
        this.type = type;
        this.facing = 'left';
        this.img = new Image();
        this.health = 100;
        this.maxHealth = 100;
        this.attacking = false;
        this.id = RandomId();
        this.pos;
        this.interval;
        this.grv = 0.9;
        this.velocityY = 0;
        this.move = function(){
          if(this.type == 2){
            for(let i = 0;i<cyclops.length;i++){
                if(this.id == cyclops[i].id){
                    this.pos = i;
                }
            }

            this.velocityY += this.grv

            let horrizontalRect = {
                x:player.x + player.velocity.x,
                y:player.y,
                width:player.width,
                height:player.height,
            }
            
            if(!checkIntersection(horrizontalRect,cyclops[this.pos])){
            this.x --;
            }
            else{
                this.attack();
            }
            for(let i = 0;i<blocks.length;i++){
                if(checkIntersection(blocks[i],cyclops[this.pos])){
                    this.velocityY = 0;
                } 
            }
            
            this.y += this.velocityY;
          }
        }
        this.attack = function(){
         if(!player.crouching){
            player.health -= 0.2;
         }
        }
        this.spawn = function(){
            this.interval = setInterval(() => {
                cyclops.push(new Cyclops(this.x,this.y,40,40,2))
            }, 2000);
        }
        this.draw = function(){
            if(this.type == 1){
                if(this.x < canvas.width && this.hasTrigeredSpawns == false){
                    this.spawn();
                    this.hasTrigeredSpawns = true;
                    blurt('crouch to resist small Cyclops,click the king to damage him while uncrouched')
                }
            }
            if(this.facing == 'left'){
                if(this.type == 1){
                this.img.src = 'cyclopsLeftImg1.png';
                }
                else{
                    this.img.src = 'cyclopsLeftImg2.png';   
                }
            }
            else if(this.facing == 'right'){
                if(this.type == 1){
                this.img.src = 'cyclopsRightImg1.png';
                }
                else{
                    this.img.src = 'cyclopsRightImg2.png';   
                }
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
            if(this.type == 1){
                ctx.fillStyle = 'black';
             ctx.fillRect(this.x,this.y - 50,this.maxHealth * 2,50)
             ctx.fillStyle = 'red';
             ctx.fillRect(this.x,this.y - 50,this.health * 2,50)
            }
        }
    }


    let items = [];

    drawableObjects.push(items);
    movableObjects.push(items);


    function Item(x,y,width,height,type,hasTorch){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
        this.hasTorch = hasTorch;
        this.img = new Image();
        this.draw = function(){
            if(this.type == 'petrol'){
                this.img.src = 'petrolImg.png';
            }
            else if(this.type == 'torchFront'){
                this.img.src = 'torchImg2.png';
            }
            else if(this.type == 'torchSide'){
                this.img.src = 'torchImg1.png';
            }
            else if(this.type == 'chest'){
                this.img.src = 'chestImg.png'
            }
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }
   



    let pegasuses = [];

    drawableObjects.push(pegasuses)
    movableObjects.push(pegasuses)


    function Pegasus(x,y,type){
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.type = type;
        this.img = new Image();
        this.trainBarMax = 100;
        this.trainBar = 0;
        this.facing = 'right';
        this.destination = {
            x: undefined,
            y: undefined,
        }
        this.move = function(){
            //script for random movement!
            if(this.type == 0){
                //Math.floor(Math.random() * (max - min + 1)) + min
             if(this.destination.x == undefined && this.destination.y == undefined||this.destination.x == undefined||this.destination.y == undefined || Math.round(this.x) == this.destination.x && Math.round(this.y) == this.destination.y){
                this.destination.x = Math.floor(Math.random() * (canvas.width - this.width + 1));
                this.destination.y = Math.floor(Math.random() * (canvas.height - 121));
             }

             if(Math.round(this.x) > this.destination.x){
                this.x --;
            }

            else if(Math.round(this.x) < this.destination.x){
                this.x ++;
            }

             if(Math.round(this.y) < this.destination.y){
                this.y ++;
            }
            else if(Math.round(this.y) > this.destination.y){
                this.y --;
            }
            }
        }
        this.draw = function(){
          if(this.facing == 'right'){
            this.img.src = 'pegasusRightImg.png'
          }
          if(this.facing == 'left'){
            this.img.src = 'pegasusLeftImg.png'
          }
          ctx.drawImage(this.img,this.x,this.y,this.width,this.height);

          ctx.fillStyle = 'black';
          ctx.fillRect(this.x,this.y - 20,this.trainBarMax,20);

          ctx.fillStyle = 'skyblue';
          ctx.fillRect(this.x,this.y - 20,this.trainBar,20);
        }
    }




    let hermes = [];

    drawableObjects.push(hermes);
    movableObjects.push(hermes);

    function Hermes(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.draw = function(){
            this.img.src = 'hermesImg.png';
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
    }





    let nyx = [];

    drawableObjects.push(nyx);
    movableObjects.push(nyx);


    function Nyx(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.maxHealth = 100;
        this.id = RandomId();
        this.health = 100;
        this.attack = function(){
            //attack with rocks
            rocks.push(new Rock(Math.floor(Math.random() * ((player.x + 100) - (player.x - 100) + 1)) + (player.x - 100),0,60,60));
           }
        this.teleport = function(){
            this.x = Math.floor(Math.random() * (canvas.width - this.width + 1));
            this.y = Math.floor(Math.random() * (canvas.height - 171));
        }   
        this.move = function(){
            this.teleport();
        
        setTimeout(() => {
            this.attack();
        }, 500);
        }
        this.damage = function(){
            this.health -= 6.25;
            if(this.health <= 0){
                rocks.splice(0,rocks.length);
                blurt('You Defeated Nyx! You Can Now Reach Hermes');
                nyx.splice(0,nyx.length);
                nyxDefeated = true;
            }
        };
        this.draw = function(){
         
          this.img.src = 'nyxImg.png';
          ctx.drawImage(this.img,this.x,this.y,this.width,this.height);

          ctx.fillStyle = 'gray';
          ctx.fillRect(this.x,this.y-20,this.maxHealth,20);
          ctx.fillStyle = 'red';
          ctx.fillRect(this.x,this.y-20,this.health,19);
        }
    }



    let rocks = [];

    drawableObjects.push(rocks);
    movableObjects.push(rocks);

    function Rock(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.ySpeed = 0;
        this.img = new Image();
        this.move = function(){
          //gravity
          this.ySpeed += 0.4;
          this.y += this.ySpeed;
        }
        this.draw = function(){
          this.img.src = 'boulderImg.png';
          ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
        }
       }




       let mountOlympus = [];

       movableObjects.push(mountOlympus);
       drawableObjects.push(mountOlympus);

       function MountOlympus(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.img = new Image();
        this.draw = function(){
            this.img.src = 'mountOlympusImg.png';
            ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
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




//set to get z position max
drawableObjects.push(player);



function RandomId(){
    return Math.random().toString(36);
}


//Makes Game Interactive using eventlsitener click.

window.addEventListener('click',(e)=>{
    if(!songLoopStarted){
        PlaySong();
    }
    if(!touchScreen){
    let x = e.x - game.x;
    let y  = e.y - game.y;
 for(let i = 0;i<blocks.length;i++){
    if(RegisterClick(x,y,blocks[i])){
         if(blocks[i].type == undefined){
        blurt('Smells earthy...');
         }
         else if(blocks[i].type == 1){
            blurt('Its Rock...');
             }
             else if(blocks[i].type == 2){
                blurt('The Floor is Made out of a Unique Rock called Tanzanite!');
                 }
    }
      
 }




 for(let i = 0;i<items.length;i++){
    if(RegisterClick(x,y,items[i])){
     if(items[i].type == 'petrol'){
        player.hasPetrol = true;
        items.splice(i,1);
     }
     else if(items[i].type == 'chest'){
        if(items[i].hasTorch == true){
            player.hasTorch = true;
            blurt('Finally, a Torch!');
            transitionMission6();
        }
        else{
            blurt('Nothing in there.');
        }
     }
    }
 }

 for(let i = 0;i<humans.length;i++){
    if(RegisterClick(x,y,humans[i])){
    if(humans[i].type == 1){
       blurt('Jack: Weird Costume Dude!')
    }
    if(humans[i].type == 2){
        blurt('Mellanie: Get Away From Me Creep!!')
     }

     if(humans[i].type == 3){
        blurt('Policeman: Going to a cosplay?')
     }
     if(humans[i].type == 'adnos' && humans[i].clickedOn == 0){
        if(task == tasks[0]){
        humans[i].clickedOn +=1;
        player.movementAllowed = false;
        blurt('???: Oh my god it really is The Mighty Hercules son of Zues!');
        setTimeout(() => {
        blurt('You: Hi I just need to get back to base.');
        }, 3000);
        setTimeout(() => {
            blurt('Adnos: Sure... I am Adnos Son of Hades.');
            }, 6000);
            setTimeout(() => {
                blurt(`Adnos: Let's Go..`);
                }, 9000);
                setTimeout(() => {
                    blurt('Mission 1 completed!');
                    transitionMission2(1)
                    }, 11000);
     }
    }

    if(humans[i].type == 4){
    blurt(`Orion: You're finnally back. I made my hair look like a mortal I saw!`);
    }
    if(humans[i].type == 5){
        blurt(`Penelope: Oh My Hercules You're Back... Chiron Needs to see you!`);
        }

        if(humans[i].type == 'chiron' && humans[i].clickedOn == 0){
            humans[i].clickedOn += 1;
            player.movementAllowed = false;
            blurt(`Chiron: Hercules There is something Urgent!!!`);
            setTimeout(() => {
                blurt(`Chiron: The Oracle of Delphi Has Summoned You!`);
            }, 3500);
            setTimeout(() => {
                blurt(`You: Me.. Why?`);
            }, 8000);
            setTimeout(() => {
                blurt(`Chiron: We Don't Know but its the First Time in 400 Years that the Oracle Has Summoned Someone!`);
            },10500);
            setTimeout(() => {
                blurt(`You: Well I guess we have to check it out.`);
                
            },14000);

            setTimeout(() => {
            transitionMission4();
            blurt('Mission 3 Completed!');
        },17000);
    }
}
 }

 for(let i = 0;i<cars.length;i++){
    if(RegisterClick(x,y,cars[i])){
        if(task == tasks[1]){
            if(player.hasPetrol == false){
            blurt('It Needs fuel.');
            }
            else{
                transitionMission3();
                }
        }
    }
 }

 for(let i = 0;i<moons.length;i++){
    if(RegisterClick(x,y,moons[i])){
        if(task == tasks[1]){
            blurt('Oh, Hi Selene Your Moon-Chariot is looking nice!');
        }
    }
 }

 for(let i = 0;i<cyclops.length;i++){
    if(RegisterClick(x,y,cyclops[i]) && player.crouching == false){
    
     if(cyclops[i].type == 1){
        cyclops[i].health -= 10;
        if(cyclops[i].health <= 0){
            blurt('Congrats, You Have Defeated the King Cyclops!');
            drawableObjects.splice(drawableObjects.indexOf(cyclops),1);
            clearInterval(cyclops[i].interval);
            spawnPetrol(cyclops[i].x);
            cyclops = [];
            drawableObjects.push(cyclops);
            movableObjects.push(cyclops)
        }

    }
}
 }


 for(let i = 0;i<pegasuses.length;i++){
    if(RegisterClick(x,y,pegasuses[i])){
        pegasuses[i].trainBar += 2.5
        if(pegasuses[i].trainBar >= pegasuses[i].trainBarMax){
            blurt('Congrats You Have Trained The Pegasus!');

            setTimeout(() => {
                blurt('You Have Unlocked Chapter 4: Mount Olympus!');
                transitionMission7(true);
            }, 3000);
        }

    }
 }

 for(let i = 0;i<nyx.length;i++){
    if(RegisterClick(x,y,nyx[i])){
        nyx[i].damage();
    }
 }

 for(let i = 0;i<hermes.length;i++){
    if(RegisterClick(x,y,hermes[i])){
        if(nyxDefeated){
            transitionMission8();
        }
        else{
            blurt('defeat Nyx!');
        }
    }
 }

}
 
})



function RegisterClick(x,y,obj){
    if(Math.round(x) > Math.round(obj.x) && Math.round(x) < Math.round(obj.x) + obj.width){
        if(Math.round(y) > Math.round(obj.y) && Math.round(y) < Math.round(obj.y) + obj.height){
            return true;
        }
    }
    else{
        return false;
    }
}




//Makes Game Interactive using eventlsitener touchstart.


canvas.addEventListener('touchstart',(e)=>{
    if(!songLoopStarted){
        PlaySong();
    }

   // blurt(`You Clicked!`);
    if(touchScreen &&!keyRight && !keyLeft && !keyUp){
    let x = Math.round(e.touches[0].clientX - (game.x));
    let y  = Math.round(e.touches[0].clientY - (game.y));
    
 for(let i = 0;i<blocks.length;i++){
    if(RegisterClick(x,y,blocks[i])){
        if(blocks[i].type == undefined){
            blurt('Smells earthy...');
             }
             else if(blocks[i].type == 1){
                blurt('Its Rock...');
                 }
                 else if(blocks[i].type == 2){
                    blurt('The Floor is Made out of a Unique gem called Tanzanite!');
                     }

    }
      
 }

 for(let i = 0;i<items.length;i++){
    if(RegisterClick(x,y,items[i])){
     if(items[i].type == 'petrol'){
        player.hasPetrol = true;
        items.splice(i,1);
     }
     else if(items[i].type == 'chest'){
        if(items[i].hasTorch == true){
            player.hasTorch = true;
            blurt('Finally, a Torch!');
            transitionMission6();
        }
        else{
            blurt('Nothing in there.');
        }
     }
    }
 }
 for(let i = 0;i<humans.length;i++){
    if(RegisterClick(x,y,humans[i])){
    if(humans[i].type == 1){
       blurt('Jack: Weird Costume Dude!')
    }
    if(humans[i].type == 2){
        blurt('Mellanie: Get Away From Me Creep!!')
     }

     if(humans[i].type == 3){
        blurt('Policeman: Going to a cosplay?')
     }
     if(humans[i].type == 'adnos' && humans[i].clickedOn == 0){
        if(task == tasks[0]){
        humans[i].clickedOn +=1;
        player.movementAllowed = false;
        blurt('???: Oh my god it really is The Mighty Hercules son of Zues!');
        setTimeout(() => {
        blurt('You: Hi I just need to get back to base.');
        }, 3000);
        setTimeout(() => {
            blurt('Adnos: Sure... I am Adnos Son of Hades.');
            }, 6000);
            setTimeout(() => {
                blurt(`Adnos: Let's Go..`);
                }, 9000);
                setTimeout(() => {
                    blurt('Mission 1 completed!');
                    transitionMission2(1);
                    }, 11000);

                 
                     
             
     }
    }


    if(humans[i].type == 4){
        blurt(`Orion: You're finnally back. I made my hair look like a mortal I saw!`);
        }
        if(humans[i].type == 5){
            blurt(`Penelope: Oh My Hercules You're Back... Chiron Needs to see you!`);
            }
    
            if(humans[i].type == 'chiron' && humans[i].clickedOn == 0){
                humans[i].clickedOn += 1;
                player.movementAllowed = false;
                blurt(`Chiron: Hercules There is something Urgent!!!`);
                setTimeout(() => {
                    blurt(`Chiron: The Oracle of Delphi Has Summoned You!`);
                }, 3500);
                setTimeout(() => {
                    blurt(`You: Me.. Why?`);
                }, 8000);
                setTimeout(() => {
                    blurt(`Chiron: We Don't Know but its the First Time in 400 Years that the Oracle Has Summoned Someone!`);
                },10500);
                setTimeout(() => {
                    blurt(`You: Well I guess we have to check it out.`);
                    
                },15000);

                setTimeout(() => {
                transitionMission4();
                blurt('Mission 3 Completed!');
            },18000);
                }


}
 }
 for(let i = 0;i<cars.length;i++){
    if(RegisterClick(x,y,cars[i])){
        if(task == tasks[1]){
            if(player.hasPetrol == false){
            blurt('It Needs fuel.');
            }
            else{
                transitionMission3();
                }
        }
    }
 }

 for(let i = 0;i<moons.length;i++){
    if(RegisterClick(x,y,moons[i])){
        if(task == tasks[1]){
            blurt('Oh, Hi Selene Your Moon-Chariot is looking nice!');
        }
    }
 }

 for(let i = 0;i<cyclops.length;i++){
    if(RegisterClick(x,y,cyclops[i]) && player.crouching == false){
     if(cyclops[i].type == 1){
        cyclops[i].health -= 10;
        if(cyclops[i].health <= 0){
            blurt('Congrats, You Have Defeated the King Cyclops!');
            drawableObjects.splice(drawableObjects.indexOf(cyclops),1);
            clearInterval(cyclops[i].interval);
            spawnPetrol(cyclops[i].x);
            cyclops = [];
            drawableObjects.push(cyclops);
            movableObjects.push(cyclops)
        }

    }
}
 }
 for(let i = 0;i<pegasuses.length;i++){
    if(RegisterClick(x,y,pegasuses[i])){
        pegasuses[i].trainBar += 2.5
        if(pegasuses[i].trainBar >= pegasuses[i].trainBarMax){
            blurt('Congrats You Have Trained The Pegasus!');

            setTimeout(() => {
                blurt('You Have Unlocked Chapter 4: Mount Olympus!');
                transitionMission7(true);
            }, 3000);
        }

    }
 }
 for(let i = 0;i<nyx.length;i++){
    if(RegisterClick(x,y,nyx[i])){
        nyx[i].damage();
    }
 }
 for(let i = 0;i<hermes.length;i++){
    if(RegisterClick(x,y,hermes[i])){
        if(nyxDefeated){
            transitionMission8();
        }
        else{
            blurt('defeat Nyx!');
        }
    }
 }
}

});


//makes touch controlls functional

rightBtn.addEventListener('touchstart',(e)=>{
    keyRight = true;
})
leftBtn.addEventListener('touchstart',(e)=>{
    keyLeft = true;
})

jumpBtn.addEventListener('touchstart',(e)=>{
    if(player.onGround == true){
    keyUp = true;
    player.frame = 0;
    }
})


crouchBtn.addEventListener('touchstart',(e)=>{
      if(tasks.indexOf(task)>0){
            if(player.onGround == true && player.crouching == false){
                keyCrouch = true;
                player.frame = 0;
            }
            else if(player.crouching == true){
                player.frame = 0;
                keyCrouch = false;
                player.y = player.normalY;
                player.height = player.normalHeight;
                player.normalHeight = undefined;
                player.normalY = undefined;
                player.crouching = false;
            }
           }
})


rightBtn.addEventListener('touchend',(e)=>{
    keyRight = false;
    player.frame = 0;
})
leftBtn.addEventListener('touchend',(e)=>{
    keyLeft = false;
    player.frame = 0;
})

jumpBtn.addEventListener('touchend',(e)=>{
   
    keyUp = false;
    
});
rightBtn.addEventListener('touchcancel',(e)=>{
    keyRight = false;
})
leftBtn.addEventListener('touchcancel',(e)=>{
    keyLeft = false;
})

jumpBtn.addEventListener('touchcancel',(e)=>{
   
    keyUp = false;
    
});


function transitionMission2(a){
    if(touchScreen == true){
    crouchBtn.style.display = 'block';
    }
   ClearStuff();
   spawnBarriers()

    spawnClouds();

    moons.push(new Moon(0,0,100,100));

    humans.push(new Humans(75 * 4,canvas.height - 75,'adnos','left'));


    cars.push(new Car(100,canvas.height - 100,100,100));

    cyclops.push(new Cyclops(800,canvas.height - 200,200,200,1))


    player.health = 100;


    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }
    task = tasks[1];

    if(a == 1){

    setTimeout(() => {
        blurt('Adnos: Shoot We Ran Out Of Fuel!');
    }, 3000);
    setTimeout(() => {
        blurt('Adnos: We need to defeat the Cyclops Ahead and get Fuel!');
    }, 7200);
}

   
    setTimeout(() => {
        blurt('Crouch to Use Shield by pressing "c"');
    }, 10500);
        player.movementAllowed = true;

    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }

}

function transitionMission3(){
    blurt('You have Unlocked : Chapter 2: The Base Of Heavens');

    setTimeout(() => {
        blurt('Meet up With Chiron Head Centaur!');
    }, 3000);
    
    task = tasks[2];
    player.health = 100;

    ClearStuff();

    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,2));
       }
       spawnBarriers()


    for(let i = 0;i<2500; i+= 100){
      items.push(new Item(i,100,40,40,'torchFront'));
    }

    humans.push(new Humans(canvas.width - 200,canvas.height - 75,4,'left'));
    humans.push(new Humans(canvas.width * 3 - 500,canvas.height - 75,5,'right'));

    humans.push(new Humans(canvas.width *3 + 200,canvas.height - 100,'chiron','left'));




}


function transitionMission4(){

    
    task = tasks[3];
    player.health = 100;

    ClearStuff();


    startDialogSequence();
    player.x = 100000;


}


function spawnPetrol(x){
items.push(new Item(x,blocks[0].y - 75,75,75,'petrol'));
}

function ClearStuff(){
    blocks.splice(0,blocks.length);
    cars.splice(0,cars.length);
    cyclops.splice(0,cyclops.length);
    moons.splice(0,moons.length);
    items.splice(0,items.length);
    humans.splice(0,humans.length);
    clouds.splice(0,clouds.length);
    barriers.splice(0,barriers.length);
    hermes.splice(0,hermes.length);
    nyx.splice(0,nyx.length);
    pegasuses.splice(0,1);
    rocks.splice(0,1);
    mountOlympus.splice(0,mountOlympus.length);
}


function startDialogSequence(){
    setTimeout(() => {
        blurt('The Oracle: I Am The Oracle Of Delphi SPEAKER Of PROPHECIES!');
    }, 3000);
    setTimeout(() => {
        blurt('You: Hi Im..');
    }, 8000);
    setTimeout(() => {
        blurt('The Oracle In a Trance:THIS NIGHT SHALL BE KNOWN AS NIGHT 0,');
    }, 9000);
    setTimeout(() => {
        blurt('The Oracle In a Trance: THE GODS SHALL IGNORE BUT COMES THE SAME HERO,');
    }, 14000);
    setTimeout(() => {
        blurt('The Oracle In a Trance: YOU SHALL CLIMB THE TOP OF THEIR PALACE,');
    }, 18000);
    setTimeout(() => {
        blurt('The Oracle In a Trance: YOU SHALL CLIMB THE TOP OF THEIR PALACE,');
    }, 22500);
    setTimeout(() => {
        blurt('The Oracle In a Trance: ELSE THE WORLD SHALL FORDO!');
    }, 25000);
    setTimeout(() => {
        player.velocity.y = 0;
        player.velocity.x = 0;
        player.x = 200;
        player.movementAllowed == true;
        transitionMission5();
    }, 30000);
}


function transitionMission5(){
    blurt('Cograts You Have Unlocked Chapter 3: Night 0');
    ClearStuff()
    spawnBarriers()
    spawnClouds()

    player.health = 100;


    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }
       //sets task;
    task = tasks[4];

    for(let i = 400;i<2400; i+= 200){
        if(i == 2200){
        items.push(new Item(i,canvas.height - 71,75,75,'chest',true));
        }
        else{
            items.push(new Item(i,canvas.height - 71,75,75,'chest'));
        }
      }

      setTimeout(() => {
        blurt('How Is It Night At 10 AM ??')
    }, 2000);
    setTimeout(() => {
        player.movementAllowed = true
    }, 3000);
    setTimeout(() => {
        blurt('It Must Be What The Oracle Must Be Talking About!')
    }, 5000);
    setTimeout(() => {
        blurt('I Have To Find A Torch!');
    }, 9000);

}


function transitionMission6(){

    setTimeout(() => {
        blurt('Hmm... According to the prophecy I have to reach olympus QUICKLY!');
    }, 3000);
    setTimeout(() => {
        blurt('How About I train this Pegasus!');
    }, 7000);
    setTimeout(() => {
        blurt('Click on The Pegasus to Train it!');
    }, 10000);
    ClearStuff()
    spawnBarriers()
    spawnClouds()

    pegasuses.push(new Pegasus(200,50,0));

    player.health = 100;


    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }
       //sets task;
    task = tasks[5]
}


function transitionMission7(a){
    //console.log('a');

ClearStuff();
    if(a == true){
setTimeout(() => {
    blurt(' You: I have to reach lord Hermes But Godess Of Night NYX Is Blocking the path!')
}, 2000);

setTimeout(() => {
    blurt('Mission: Defeat Nyx')
}, 7500);
    }

  spawnBarriers();
    spawnClouds()

    player.health = 100;


    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75,1));
       }

       hermes.push(new Hermes(canvas.width * 2 + 300,canvas.height - 200,200,200));

       if(a == true){
        setTimeout(() => {
            nyx.push(new Nyx(canvas.width - 50,canvas.height - 100,100,100))
        }, 7500);
       }
       else{
        setTimeout(() => {
            nyx.push(new Nyx(canvas.width - 50,canvas.height - 100,100,100))
        }, 2000);
       }
       //sets task;
    task = tasks[6]
}


function transitionMission8(){
    blurt('You: Lord Hermes I need to get to Mount Olympus Urgently...');
    setTimeout(() => {
        blurt('The World Is In Danger!!!');
    }, 3000);
    setTimeout(() => {
        blurt(`Sure I'll get you there tho cant help you any further than the base of Mt.Olympus`);
    }, 7000);
    setTimeout(() => {
        blurt(`FINAL Mission: Climb Olympus`);
    }, 11000);
    ClearStuff();

     spawnBarriers();
    player.health = 100;


    mountOlympus.push(new MountOlympus(100,canvas.height - 1500,900,1500))


    for(let i = -2;i<35;i++){
        blocks.push(new Block(i*75,canvas.height,75,75));
       }

       blocks.push(new Block(75*8,canvas.height - 75*1,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*1.8,75,18,3));
       blocks.push(new Block(75*2,canvas.height - 75*2.6,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*3.6,75,18,3));
       blocks.push(new Block(75*7.5,canvas.height - 75*4.4,75,18,3));

       blocks.push(new Block(75*5,canvas.height - 75*5.4,75,18,3));
       blocks.push(new Block(75*2,canvas.height - 75*6.2,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*7.2,75,18,3));
       blocks.push(new Block(75*7.5,canvas.height - 75*7.4,75,18,3));
       blocks.push(new Block(75*10,canvas.height - 75*8.2,75,18,3));
       blocks.push(new Block(75*7.5,canvas.height - 75*9.2,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*10,75,18,3));
       blocks.push(new Block(75*8,canvas.height - 75*11,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*12,75,18,3));
       blocks.push(new Block(75*8,canvas.height - 75*13,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*14,75,18,3));
       blocks.push(new Block(75*8,canvas.height - 75*15,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*16,75,18,3));
       blocks.push(new Block(75*8,canvas.height - 75*17,75,18,3));
       blocks.push(new Block(75*5,canvas.height - 75*18,75,18,3));
       blocks.push(new Block(75*8,canvas.height - 75*19,75,18,3,true));
     


    array_move(drawableObjects,drawableObjects.indexOf(blocks),drawableObjects.length - 1);
       //sets task;
    task = tasks[7]
}















function spawnClouds(){
    clouds.push(new Cloud(100,100,100,100,0.1,1));
    clouds.push(new Cloud(500,100,100,100,0.2,1));
    clouds.push(new Cloud(300,50,100,100,0.3,1));
    clouds.push(new Cloud(700,50,100,100,0.3,1));

    clouds.push(new Cloud(100,-50,100,100,0.1,1));
    clouds.push(new Cloud(500,-50,100,100,0.2,1));
    clouds.push(new Cloud(300,-100,100,100,0.3,1));
    clouds.push(new Cloud(700,-200,100,100,0.3,1));
}


function spawnBarriers(){
    barriers.push(new Barrier(75,canvas.height - 75 * 1000,75,75 * 1000));


    barriers.push(new Barrier(75 * 30,canvas.height - 75 * 1000,75,75 * 1000));
}




//cleared Out in 13Kb compressed form{


function TrailerMode(){
    setInterval(() => {
        
task = tasks[tasks.indexOf(task)+1];


    }, 1000);
}














//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================


//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================


//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================


//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================

//music






let CPlayer = function() {

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    // Oscillators
    let osc_sin = function (value) {
        return Math.sin(value * 6.283184);
    };

    let osc_saw = function (value) {
        return 2 * (value % 1) - 1;
    };

    let osc_square = function (value) {
        return (value % 1) < 0.5 ? 1 : -1;
    };

    let osc_tri = function (value) {
        let v2 = (value % 1) * 4;
        if(v2 < 2) return v2 - 1;
        return 3 - v2;
    };

    let getnotefreq = function (n) {
        // 174.61.. / 44100 = 0.003959503758 (F3)
        return 0.003959503758 * (2 ** ((n - 128) / 12));
    };

    let createNote = function (instr, n, rowLen) {
        let osc1 = mOscillators[instr.i[0]],
            o1vol = instr.i[1] + 200,
            o1xenv = instr.i[3]/32,
            osc2 = mOscillators[instr.i[4]],
            o2vol = instr.i[5] + 200,
            o2xenv = instr.i[8]/32,
            noiseVol = instr.i[9],
            attack = instr.i[10] * instr.i[10] * 4,
            sustain = instr.i[11] * instr.i[11] * 4,
            release = instr.i[12] * instr.i[12] * 4,
            releaseInv = 1 / release,
            expDecay = -instr.i[13]/16,
            arp = instr.i[14],
            arpInterval = rowLen * (2 **(2 - instr.i[15]));

        let noteBuf = new Int32Array(attack + sustain + release);

        // Re-trig oscillators
        let c1 = 0, c2 = 0;

        // Local letiables.
        let j, j2, e, t, rsample, o1t, o2t;

        // Generate one note (attack + sustain + release)
        for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
            if (j2 >= 0) {
                // Switch arpeggio note.
                arp = (arp >> 8) | ((arp & 255) << 4);
                j2 -= arpInterval;

                // Calculate note frequencies for the oscillators
                o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
                o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
            }

            // Envelope
            e = 1;
            if (j < attack) {
                e = j / attack;
            } else if (j >= attack + sustain) {
                e = (j - attack - sustain) * releaseInv;
                e = (1 - e) * (3 ** (expDecay * e));
            }

            // Oscillator 1
            c1 += o1t * e ** o1xenv;
            rsample = osc1(c1) * o1vol;

            // Oscillator 2
            c2 += o2t * e ** o2xenv;
            rsample += osc2(c2) * o2vol;

            // Noise oscillator
            if (noiseVol) {
                rsample += (2 * Math.random() - 1) * noiseVol;
            }

            // Add to (mono) channel buffer
            noteBuf[j] = (80 * rsample * e) | 0;
        }

        return noteBuf;
    };


    //--------------------------------------------------------------------------
    // Private members
    //--------------------------------------------------------------------------

    // Array of oscillator functions
    let mOscillators = [
        osc_sin,
        osc_square,
        osc_saw,
        osc_tri
    ];

    // Private letiables set up by init()
    let mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;


    //--------------------------------------------------------------------------
    // Initialization
    //--------------------------------------------------------------------------

    this.init = function (song) {
        // Define the song
        mSong = song;

        // Init iteration state letiables
        mLastRow = song.endPattern;
        mCurrentCol = 0;

        // Prepare song info
        mNumWords =  song.rowLen * song.patternLen * (mLastRow + 1) * 2;

        // Create work buffer (initially cleared)
        mMixBuf = new Int32Array(mNumWords);
    };


    //--------------------------------------------------------------------------
    // Public methods
    //--------------------------------------------------------------------------

    // Generate audio data for a single track
    this.generate = function () {
        // Local letiables
        let i, j, b, p, row, col, n, cp,
            k, t, lfor, e, x, rsample, rowStartSample, f, da;

        // Put performance critical items in local letiables
        let chnBuf = new Int32Array(mNumWords),
            instr = mSong.songData[mCurrentCol],
            rowLen = mSong.rowLen,
            patternLen = mSong.patternLen;

        // Clear effect state
        let low = 0, band = 0, high;
        let lsample, filterActive = false;

        // Clear note cache.
        let noteCache = [];

         // Patterns
         for (p = 0; p <= mLastRow; ++p) {
            cp = instr.p[p];

            // Pattern rows
            for (row = 0; row < patternLen; ++row) {
                // Execute effect command.
                let cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
                if (cmdNo) {
                    instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

                    // Clear the note cache since the instrument has changed.
                    if (cmdNo < 17) {
                        noteCache = [];
                    }
                }

                // Put performance critical instrument properties in local letiables
                let oscLFO = mOscillators[instr.i[16]],
                    lfoAmt = instr.i[17] / 512,
                    lfoFreq = (2 ** (instr.i[18] - 9)) / rowLen,
                    fxLFO = instr.i[19],
                    fxFilter = instr.i[20],
                    fxFreq = instr.i[21] * 43.23529 * 3.141592 / 44100,
                    q = 1 - instr.i[22] / 255,
                    dist = instr.i[23] * 1e-5,
                    drive = instr.i[24] / 32,
                    panAmt = instr.i[25] / 512,
                    panFreq = 6.283184 * (2 ** (instr.i[26] - 9)) / rowLen,
                    dlyAmt = instr.i[27] / 255,
                    dly = instr.i[28] * rowLen & ~1;  // Must be an even number

                // Calculate start sample number for this row in the pattern
                rowStartSample = (p * patternLen + row) * rowLen;

                // Generate notes for this pattern row
                for (col = 0; col < 4; ++col) {
                    n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
                    if (n) {
                        if (!noteCache[n]) {
                            noteCache[n] = createNote(instr, n, rowLen);
                        }

                        // Copy note from the note cache
                        let noteBuf = noteCache[n];
                        for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                          chnBuf[i] += noteBuf[j];
                        }
                    }
                }

                // Perform effects for this pattern row
                for (j = 0; j < rowLen; j++) {
                    // Dry mono-sample
                    k = (rowStartSample + j) * 2;
                    rsample = chnBuf[k];

                    // We only do effects if we have some sound input
                    if (rsample || filterActive) {
                        // State letiable filter
                        f = fxFreq;
                        if (fxLFO) {
                            f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
                        }
                        f = 1.5 * Math.sin(f);
                        low += f * band;
                        high = q * (rsample - band) - low;
                        band += f * high;
                        rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

                        // Distortion
                        if (dist) {
                            rsample *= dist;
                            rsample = rsample < 1 ? rsample > -1 ? osc_sin(rsample*.25) : -1 : 1;
                            rsample /= dist;
                        }

                        // Drive
                        rsample *= drive;

                        // Is the filter active (i.e. still audiable)?
                        filterActive = rsample * rsample > 1e-5;

                        // Panning
                        t = Math.sin(panFreq * k) * panAmt + 0.5;
                        lsample = rsample * (1 - t);
                        rsample *= t;
                    } else {
                        lsample = 0;
                    }

                    // Delay is always done, since it does not need sound input
                    if (k >= dly) {
                        // Left channel = left + right[-p] * t
                        lsample += chnBuf[k-dly+1] * dlyAmt;

                        // Right channel = right + left[-p] * t
                        rsample += chnBuf[k-dly] * dlyAmt;
                    }

                    // Store in stereo channel buffer (needed for the delay effect)
                    chnBuf[k] = lsample | 0;
                    chnBuf[k+1] = rsample | 0;

                    // ...and add to stereo mix buffer
                    mMixBuf[k] += lsample | 0;
                    mMixBuf[k+1] += rsample | 0;
                }
            }
        }

        // Next iteration. Return progress (1.0 == done!).
        mCurrentCol++;
        return mCurrentCol / mSong.numChannels;
    };

    // Create a AudioBuffer from the generated audio data
    this.createAudioBuffer = function(context) {
        let buffer = context.createBuffer(2, mNumWords / 2, 44100);
        for (let i = 0; i < 2; i ++) {
            let data = buffer.getChannelData(i);
            for (let j = i; j < mNumWords; j += 2) {
                data[j >> 1] = mMixBuf[j] / 65536;
            }
        }
        return buffer;
    };
    
    // Create a WAVE formatted Uint8Array from the generated audio data
    this.createWave = function() {
        // Create WAVE header
        let headerLen = 44;
        let l1 = headerLen + mNumWords * 2 - 8;
        let l2 = l1 - 36;
        let wave = new Uint8Array(headerLen + mNumWords * 2);
        wave.set(
            [82,73,70,70,
             l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
             87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
             68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
             l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255]
        );

        // Append actual wave data
        for (let i = 0, idx = headerLen; i < mNumWords; ++i) {
            // Note: We clamp here
            let y = mMixBuf[i];
            y = y < -32767 ? -32767 : (y > 32767 ? 32767 : y);
            wave[idx++] = y & 255;
            wave[idx++] = (y >> 8) & 255;
        }

        // Return the WAVE formatted typed array
        return wave;
    };

    // Get n samples of wave data at time t [s]. Wave data in range [-2,2].
    this.getData = function(t, n) {
        let i = 2 * Math.floor(t * 44100);
        let d = new Array(n);
        for (let j = 0; j < 2*n; j += 1) {
            let k = i + j;
            d[j] = t > 0 && k < mMixBuf.length ? mMixBuf[k] / 32768 : 0;
        }
        return d;
    };
};










function PlaySong(){
    songLoopStarted = true;
let song = {
    songData: [
      { // Instrument 0
        i: [
        2, // OSC1_WAVEFORM
        65, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        3, // OSC2_WAVEFORM
        150, // OSC2_VOL
        128, // OSC2_SEMI
        0, // OSC2_DETUNE
        0, // OSC2_XENV
        0, // NOISE_VOL
        5, // ENV_ATTACK
        6, // ENV_SUSTAIN
        58, // ENV_RELEASE
        0, // ENV_EXP_DECAY
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        195, // LFO_AMT
        6, // LFO_FREQ
        1, // LFO_FX_FREQ
        2, // FX_FILTER
        135, // FX_FREQ
        0, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        147, // FX_PAN_AMT
        6, // FX_PAN_FREQ
        121, // FX_DELAY_AMT
        6 // FX_DELAY_TIME
        ],
        // Patterns
        p: [1],
        // Columns
        c: [
          {n: [128,130,130,130,132,134,134,134,137,137,142,140,139,135,135,135,140,135,139,137,137,134,132,128,128,128,130,128,127,127,127,127],
           f: []}
        ]
      },
    ],
    rowLen: 7350,   // In sample lengths
    patternLen: 32,  // Rows per pattern
    endPattern: 0,  // End pattern
    numChannels: 1  // Number of channels
  };
  //----------------------------------------------------------------------------
  // Demo program section
  //----------------------------------------------------------------------------

  // Initialize music generation (player).
  let t0 = new Date();
  let player1 = new CPlayer();
  player1.init(song);

  // Generate music...
  let done = false;
  setInterval(function () {
      
    if(done){
        return
    }

   // let s = document.getElementById("status");
    //s.textContent = s.textContent + ".";

    done = player1.generate() >= 1;

    //if (done) {
      //let t1 = new Date();
     // s.textContent = s.textContent + "done (" + (t1 - t0) + "ms)";

      // Put the generated song in an Audio element.
      let wave = player1.createWave();
      audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      audio.play();

  //  }
})
}

let audio = document.createElement("audio");

audio.addEventListener('ended',()=>{
    if(!gameEnded){
    PlaySong();
    }
})





setTimeout(() => {
    console.clear();
    }, 100);

//Easy Array Move Method;

function array_move(arr, old_index, new_index) {
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
};

function PlayEndScene(){
    task = undefined;
    backgroundSpriteNum = 1;
    player.x = 10000;
    player.y = -300;
    setTimeout(() => {
        blurt(`Zues: If You Were'nt my Son I Would Have Blasted you into a million pieces!`);
    }, 1000);
    setTimeout(() => {
        blurt(`Zues: What In The WORLD Are You Doing In Olympus!`)
    }, 6000);
    setTimeout(() => {
        blurt('You: Father The Oracle of Delphi has prophesized the END OF THE WORLD!');
    }, 10000);
    setTimeout(() => {
        blurt(`Zues: That's Immpossible!`);
    }, 16000);
    setTimeout(() => {
        blurt('You: Erebus The Lord Of Black Holes Has Risen And Is Coming To SWALLOW EARTH !!!');
    }, 18000);
    setTimeout(() => {
        blurt('You: The Gods Have To React Fast Or Else...');
    }, 25000);
    setTimeout(() => {
        blackedOut = true;
    }, 27000);
    setTimeout(() => {
        blackedOut = false;
        blurt(`You: Oh No... We're too late!`);
    }, 29000);
    setTimeout(() => {
        backgroundSpriteNum = 2;
    }, 32000);
    setTimeout(() => {
        backgroundSpriteNum = 3;
    }, 33000);
    setTimeout(() => {
        backgroundSpriteNum = 4;
    }, 34000);
    setTimeout(() => {
        backgroundSpriteNum = 5;
    }, 35000);
    setTimeout(() => {
        backgroundSpriteNum = 6;
    }, 37000);
    setTimeout(() => {
        backgroundSpriteNum = 7;
    }, 39000);

    setTimeout(() => {
       blurt('Hope You Enjoyed Playing Age Of The Demigods By Armaan.M!');
       gameEnded = true;
    }, 42000);
}


function DrawImage(backgroundImg){
    ctx.drawImage(backgroundImg,0,0,game.width,game.height);
}
function FillRect(){
  ctx.fillRect(0,0,game.width,game.height);
}

function PlayerFrames(){
    if(!player.crouching){
        if(player.frame <4){
            player.frame++
        }
        else{
            player.frame = 1;
        }
     }
     else{
        player.frame = 1;
     }
}

//Updated Animation Cycle fixes animation not playing on touchscreen devices (Not the same one used in js13k2023 subission) 

function GoToBio(){
    window.location.href = 'https://bio.link/armaanmohammed';
}

setInterval(() => {
    if(keyRight || keyLeft){
        PlayerFrames()
    }
},1000/8);


//js13kSubmission 2023 by Armaan.M
