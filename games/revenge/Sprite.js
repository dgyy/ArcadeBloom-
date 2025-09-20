import AnimationComponent from "./AnimationComponent.js";
import { StandBy, RightAttack, LeftAttack } from "./Animationlib.js";
import Armor from "./Armor.js";
import ArmorComponent from "./ArmorComponent.js";
import Collider, { CheckIsCollide } from "./Collider.js";
import MovementComponent from "./MovementComponent.js";
import PlayerState from "./PlayerState.js";
import Shield from "./Shield.js";
import Sword from "./Sword.js";
import { Vector2, dot, RightVector, Rotate } from "./mMath.js"

function DrawHead(context, x, y, d)// location is the middle of the head,
    //direction 0 for left 1 for right
{
    //direction=1;

    context.beginPath();
    //context.moveTo(x, y);
    context.arc(x, y, 50, 0, Math.PI * 2, true); // 绘制
    context.fillStyle="#ffcba4";
    context.fill();

    context.stroke();
    
    var MouseOffset=44;

    var EyeOffset=30;
    var EyeOffsetx=6;
    if(d==-1)
    {
        MouseOffset*=-1;
        EyeOffset*=-1;
        EyeOffsetx*=-1;
    }

    context.beginPath();
    //ontext.moveTo(x+6, y-10);
    context.ellipse(x+EyeOffsetx, y-10, 10, 15, 0, 0, 2*Math.PI, true);
    context.fillStyle="#A9A9A9";
    context.fill();
    context.stroke();
    //context.fillStyle="#0000";
    //context.fill();
    //context.moveTo(x+EyeOffset, y-10);
    //context.ellipse(x+EyeOffset, y-10, 7, 14, 0, 0, 2*Math.PI, true);

    context.beginPath();
    context.ellipse(x+EyeOffset, y-10, 8, 12, 0, 0, 2*Math.PI, true);
    context.fillStyle="#A9A9A9";
    context.fill();
    context.stroke();

    context.beginPath();
    //ontext.moveTo(x+6, y-10);
    context.ellipse(x+EyeOffsetx*1.5, y-10, 5, 7.5, 0, 0, 2*Math.PI, true);
    context.fillStyle="#000000";
    context.fill();
    context.stroke();

    
    context.beginPath();
    context.ellipse(x+EyeOffset*1.1, y-10, 4, 6, 0, 0, 2*Math.PI, true);
    context.fillStyle="	#000000";
    context.fill();
    context.stroke();
    
    
    var MouseDownOffset=23;

    context.moveTo(x, y+MouseDownOffset);
    context.lineTo(x+MouseOffset, y+MouseDownOffset);
    
    context.stroke();

    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(x,y);
}

function DrawBody(context, nbv, Location)
{
    var x=Location.x;
    var y=Location.y;

    context.beginPath();
    context.moveTo(nbv[0].x+x, nbv[0].y+y);
    context.lineTo(nbv[1].x+x, nbv[1].y+y);
    context.lineTo(nbv[2].x+x, nbv[2].y+y);
    context.stroke();

    context.beginPath();
    context.moveTo(nbv[0].x+x, nbv[0].y+y);
    context.lineTo(nbv[3].x+x, nbv[3].y+y);
    context.lineTo(nbv[4].x+x, nbv[4].y+y);
    context.stroke();

    context.beginPath();
    context.moveTo(nbv[0].x+x, nbv[0].y+y);
    context.lineTo(nbv[5].x+x, nbv[5].y+y);
    context.stroke();
    
    context.beginPath();
    context.moveTo(nbv[5].x+x, nbv[5].y+y);
    context.lineTo(nbv[6].x+x, nbv[6].y+y);
    context.moveTo(nbv[5].x+x, nbv[5].y+y);
    context.lineTo(nbv[7].x+x, nbv[7].y+y);
    context.stroke(); 
}

export default class Sprite{
    constructor(floor, x, y, attributes, SpriteArray, index, game)
    {  
        this.location=new Vector2(x, y);
        this.facing=1;
        this.direction=1;
        this.currentPose=StandBy;

        // this.LWeapong=;
        // this.RWeapong=;

        this.Weapons=attributes[5];
        
        this.components={MovementComponent:new MovementComponent(attributes[0], floor, this),AnimationComponent:new AnimationComponent(attributes[1], attributes[2], attributes[3]),ArmorComponent:new ArmorComponent(attributes[4])};       

        this.MyCollisionArray=[];



        this.State=new PlayerState(this);
        
        
        this.SpriteArray=SpriteArray;
        this.index=index;
        this.game=game;
    }
        
    Draw(context)
    {   
        DrawHead(context, this.location.x, this.location.y-50, this.facing);
        DrawBody(context, this.currentPose, this.location);

        this.Weapons[0].Draw(context, new Vector2(this.currentPose[2].x+this.location.x, this.currentPose[2].y+this.location.y));
        this.Weapons[1].Draw(context, new Vector2(this.currentPose[3].x+this.location.x, this.currentPose[3].y+this.location.y), new Vector2(this.currentPose[4].x+this.location.x, this.currentPose[4].y+this.location.y));

        this.components['ArmorComponent'].Draw(context, this.currentPose, this.facing, this.location);
        
        
    }

    Update(InputManager, deltaTime)
    {


        
        
        
        this.Weapons[0].Update(new Vector2(this.currentPose[1].x+this.location.x, this.currentPose[1].y+this.location.y), new Vector2(this.currentPose[2].x+this.location.x, this.currentPose[2].y+this.location.y));
        this.Weapons[1].Update(new Vector2(this.currentPose[3].x+this.location.x, this.currentPose[3].y+this.location.y), new Vector2(this.currentPose[4].x+this.location.x, this.currentPose[4].y+this.location.y));
        
        
        if(InputManager.mousex<=this.location.x)
            this.facing=-1;
        else
            this.facing=1;
        
        // console.log(deltaTime);
        var re=this.components['MovementComponent'].Update(InputManager, this.location, deltaTime);
         //console.log(newPosition);
         this.location.x=re[0];
         this.location.y=re[1];
         this.direction=re[2];

        //Do the attack animation
        if(InputManager.leftbutton)
        {
            this.components['AnimationComponent'].Play(0);
            this.Weapons[0].isAttack=true;
        }
        if(!InputManager.leftbutton&&this.components['AnimationComponent'].animations[0].isPlay==1)
        {
            this.components['AnimationComponent'].BackPlay(0);
            this.Weapons[0].isAttack=false;
        }

        if(InputManager.rightbutton)
        {
            this.components['AnimationComponent'].Play(1);
            this.Weapons[1].isAttack=true;
        }
        if(!InputManager.rightbutton&&this.components['AnimationComponent'].animations[1].isPlay==1)
        {
            this.components['AnimationComponent'].BackPlay(1);
            this.Weapons[1].isAttack=false;
        }

        this.components['AnimationComponent'].LoopPlay(2);
        
        if(InputManager.keysDown['d'])
        {
            this.components['AnimationComponent'].Play(2);
        }
        if(InputManager.keysDown['a'])
        {
            this.components['AnimationComponent'].Play(2);
        }

        if(this.direction==0)
            this.components['AnimationComponent'].StopPlay(2);

        
        
        this.currentPose=this.components['AnimationComponent'].Update();
            
        //Aim the target

        function Aim(location, currentPose, index)
        {
            var mx=InputManager.mousex-location.x;
            var my=InputManager.mousey;

            if(mx<0)
                mx*=-1;
            
            var pointing=new Vector2(currentPose[0].x-mx, currentPose[0].y-(my-location.y));
            var orignal=new Vector2(currentPose[index].x-currentPose[0].x, currentPose[index].y-currentPose[0].x);

      //      console.log(orin);
            
            var d=dot(pointing.x, pointing.y, orignal.x, orignal.y);
  //        console.log(d);
            var angle=0.5*Math.PI+Math.asin(d/(pointing.Length*orignal.Length));

            if(InputManager.mousey<location.y)
                angle*=-1;
            
            //console.log(angle);
            currentPose[index-1]=Rotate(currentPose[index-1], angle);
            currentPose[index]=Rotate(currentPose[index], angle);


        }
        
        if(this.components['AnimationComponent'].animations[0].isPlay)
        {
            Aim(this.location, this.currentPose, 2);
        }
        if(this.components['AnimationComponent'].animations[1].isPlay)
        {
            Aim(this.location, this.currentPose, 4);
        }

         if(this.facing==-1)
         {
            for(var i=1;i<=4;i++)
            {
                this.currentPose[i].x*=-1;
            }
         }

         //Left and Right Weapon Collision
        this.MyCollisionArray[0]=new Collider(this.Weapons[0].Start, this.Weapons[0].End, 0);
        this.MyCollisionArray[1]=new Collider(this.Weapons[1].Start, this.Weapons[1].End, 0);
        //Head Collision
        this.MyCollisionArray[2]=new Collider(new Vector2(this.location.x-45, this.location.y-90), new Vector2(this.location.x+45, this.location.y), 1);
        //Arms Collision
        this.MyCollisionArray[3]=new Collider(new Vector2(this.location.x+this.currentPose[0].x, this.location.y+this.currentPose[0].y), new Vector2(this.location.x+this.currentPose[1].x, this.location.y+this.currentPose[1].y));
        this.MyCollisionArray[4]=new Collider(new Vector2(this.location.x+this.currentPose[1].x, this.location.y+this.currentPose[1].y), new Vector2(this.location.x+this.currentPose[2].x, this.location.y+this.currentPose[2].y));
        this.MyCollisionArray[5]=new Collider(new Vector2(this.location.x+this.currentPose[0].x, this.location.y+this.currentPose[0].y), new Vector2(this.location.x+this.currentPose[3].x, this.location.y+this.currentPose[3].y));
        this.MyCollisionArray[6]=new Collider(new Vector2(this.location.x+this.currentPose[3].x, this.location.y+this.currentPose[3].y), new Vector2(this.location.x+this.currentPose[4].x, this.location.y+this.currentPose[4].y));
        //Body Collision
        this.MyCollisionArray[7]=new Collider(new Vector2(this.currentPose[0].x+this.location.x, this.currentPose[0].y+this.location.y),new Vector2(this.currentPose[5].x+this.location.x, this.currentPose[5].y+this.location.y), 0);
        //Legs Collision
        this.MyCollisionArray[8]=new Collider(new Vector2(this.currentPose[5].x+this.location.x, this.currentPose[5].y+this.location.y), new Vector2(this.location.x+this.currentPose[6].x, this.currentPose[6].y+this.location.y),0);
        this.MyCollisionArray[9]=new Collider(new Vector2(this.currentPose[5].x+this.location.x, this.currentPose[5].y+this.location.y), new Vector2(this.location.x+this.currentPose[7].x, this.currentPose[7].y+this.location.y),0);
         
         
        var opponentIndex;
         
        if(this.index==1)
            opponentIndex=0;
        else
            opponentIndex=1;

        this.State.Update();

        for(var i=0;i<2;i++)
        {
            for(var j=0;j<10;j++)
            {
                if(this.SpriteArray[opponentIndex].MyCollisionArray[j])
                if(CheckIsCollide(this.MyCollisionArray[i], this.SpriteArray[opponentIndex].MyCollisionArray[j]))
                {
                    if(this.Weapons[i].isAttack)
                    {
                        
                        if(j>=2)
                        {
                            this.SpriteArray[opponentIndex].State.TakeDamage(j-2, this.Weapons[i].Attack, i);
                        }
                        else
                        {
                            var oWeapon=this.SpriteArray[opponentIndex].Weapons[j];
                            if(oWeapon)
                            if(oWeapon.isAttack)
                            {
                                //if opponent's weapon is a shield, we knockedback
                                if(this.SpriteArray[opponentIndex].Weapons[j].type=='Shield')
                                    this.location.x-=this.facing*11;
                                //if opponent's weapon's weight is bigger than ours, we knockedback
                                if(this.Weapons[i].weight<=this.SpriteArray[opponentIndex].Weapons[j].weight)
                                    this.location.x-=this.facing*5.0;
                            }
                        }
                    }
                }
                else
                {
                    if(j>=2)
                    {
                        this.SpriteArray[opponentIndex].State.RemoveAttack(j-2,i);
                    }
                }
            }
        }



         
        }

        
}