export default class MovementComponent
{
    //gravity
    
    
    constructor(velocity, floor, owner)
    {
        this.floor=floor;
        this.velocity=velocity;
        this.rate=1;//hurt will reduce the rate for movement
        this.upwardspeed=250;
        this.isJumped=false;
        this.owner=owner;
    }

    Update(InputManager, location, deltatime)
    {
        var x=location.x;
        var y=location.y;

        location.y+=1;
        
        var direction=0;
        
        if(InputManager.keysDown['a'])
            direction=-1;
        if(InputManager.keysDown['d'])
            direction=1;
        if(InputManager.keysDown['w']&&!this.isJumped)
        {
            this.isJumped=true;
        }

        x+=direction*this.velocity*this.rate*deltatime;

        y+=1*deltatime;

        if(this.isJumped)
        {
            y-=this.upwardspeed*deltatime*this.rate;
            this.upwardspeed-=300*deltatime;
        }

        if(y>=this.floor)
        {
            this.isJumped=false
            this.upwardspeed=250;
            y=this.floor;
        }
        
        return [x, y, direction];
    }
}