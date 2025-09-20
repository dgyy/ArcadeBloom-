

import InputManager from "./InputManager.js";
import Sword from "./Sword.js";
import { Random, Vector2 } from "./mMath.js";
import Sprite from "./Sprite.js";
import AIController from "./AIController.js";
import { MainPage, Start } from "./Main.js";

export default class Game{
    constructor()
    {
        this.isRunning=true;
        this.mTickCount=0;
    }

    Initialize(MainAttribute)
    {
        this.canvas=document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.style="display: block";
        this.context=this.canvas.getContext('2d');

        this.canvaswidth=this.canvas.width = window.innerWidth;
        this.canvasheight=this.canvas.height = window.innerHeight;

        this.MainAttribute=MainAttribute;
        
        this.SpriteArray=[];
        this.SpriteArray[0]=new Sprite(this.canvasheight*0.618-59, 200,200, [MainAttribute[0].velocity,MainAttribute[0].leftArmSpeed,MainAttribute[0].rightArmSpeed, MainAttribute[0].walkAnimationSpeed, MainAttribute[0].SelectedArmor, MainAttribute[0].SelectedWeapons], this.SpriteArray, 0, this);
        this.SpriteArray[1]=new Sprite(this.canvasheight*0.618-59, 1000, 200, [MainAttribute[1].velocity,MainAttribute[1].leftArmSpeed,MainAttribute[1].rightArmSpeed, MainAttribute[1].walkAnimationSpeed, MainAttribute[1].SelectedArmor, MainAttribute[1].SelectedWeapons], this.SpriteArray, 1, this)

        this.InputManager=new InputManager();
        this.AIController=new AIController(this.InputManager, this.SpriteArray[1]);
        
        
        
        // this.AIController.Update(this.SpriteArray[0].location);
        
        
        
    }

    Update()
    {
        
        var deltatime=(Date.now()-this.mTickCount)/1000;

        //console.log(deltatime);
        this.mTickCount=Date.now();

        this.AIController.Update(this.SpriteArray[0].location);
        
        this.SpriteArray[0].Update(this.InputManager, deltatime);        
        this.SpriteArray[1].Update(this.AIController, deltatime);
    }

    GenerateOutput()
    {

        this.context.beginPath();
        this.context.clearRect(0,0,this.canvaswidth,this.canvasheight);

        //Draw the battlefield

        this.context.moveTo(0,0);
        this.context.fillStyle='orange';
        this.context.fillRect(0, this.canvasheight*0.618, this.canvaswidth, this.canvasheight);

        
        this.context.stroke();
        this.SpriteArray[0].Draw(this.context);        
        this.SpriteArray[1].Draw(this.context);
        

        this.context.moveTo(500, 500);
        this.context.lineTo(0,0);

        this.context.stroke();
    }

    Loop()
    {
        this.loop=setInterval(() => {
        this.Update();
        this.GenerateOutput();
        if(!this.isRunning)
            clearInterval(this.loop);
        }, 1);
    }

    Stop(index)
    {
        this.isRunning=false;

        if(index==1)
        {
            alert("You Win");
            this.MainAttribute[0].money+=Math.round(Random(500, 300));
            if(this.type)
                FinalPage();
            else
                MainPage();
        }
        else
        {
            alert("You Lose");
            Start();
        }
        this.canvas.remove();

    }
}