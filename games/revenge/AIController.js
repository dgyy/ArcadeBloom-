export default class AIController
{
    constructor(InputManager, sprite)
    {
        this.sprite=sprite;
        
        this.keysDown={};
        this.mousex=0;
        this.mousey=0;
        this.leftbutton=false;
        this.rightbutton=false;

        this.InputManager=InputManager;


        this.waitTimeCount=0;
        
        
        this.isjump=1;
    }

    Update(PlayerLocation)
    {
        this.PlayerLocation=PlayerLocation;

        var ActionIndex= Math.floor(Math.random() * 15) + 1;

        this.waitTimeCount+=1;

        if(this.waitTimeCount>10)
        {
            this.waitTimeCount=0;

        switch (ActionIndex) {
            case 1:
                this.LeftAttack();
                break;

            case 2:
                this.LefRelease();
                break;

            case 3:
                this.LeftWave();
                break;

            case 4:
                this.RightAttack();
                break;

            case 5:
                this.RightRelease();
                break;

            case 6:
                this.RightWave();
                break;

            case 7:
                this.Jump();
                break;

            case 8:
                this.JumpStop();
                break;

            case 9:
                this.MoveTo();
                break;

            case 10:
                this.MoveStop();
                break;
        
            default:
                break;
        }
        }
        else
            return;
            
    }

    LeftAttack()
    {
        this.mousex=this.PlayerLocation.x;
        this.mousey=this.PlayerLocation.y;
        this.mousey+=79*(Math.random()*(1+1)-1);
        this.leftbutton=true;
    }

    LefRelease()
    {
        this.leftbutton=false;
    }

    LeftWave()
    {
        this.mousey+=455*Math.random();
    }

    RightWave()
    {
        this.mousey+=455*Math.random();
    }

    RightAttack()
    {
        this.mousex=this.PlayerLocation.x;
        this.mousey=this.PlayerLocation.y;
        this.mousey+=79*(Math.random()*(1+1)-1);
        this.rightbutton=true;
    }

    RightRelease()
    {
        this.rightbutton=false;
    }

    MoveTo()
    {
        this.mousex=this.PlayerLocation.x;
        this.mousey=this.PlayerLocation.y;
        
        if(this.mousex<this.sprite.location.x)
            this.keysDown['a']=true;
        else
            this.keysDown['d']=true;
    }

    MoveStop()
    {
        this.keysDown['a']=false;
        this.keysDown['d']=false;
    }

    Jump()
    {
        this.keysDown['w']=true;    
           
    }

    JumpStop()
    {
        this.keysDown['w']=false;
    }
}