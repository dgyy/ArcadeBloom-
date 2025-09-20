import Weapon from "./Weapon.js";
import { Vector2, rotatePoint } from "./mMath.js";

export default class Shield extends Weapon
{
    constructor(weight, length, attack) 
    {
        super(weight, length, attack);

        this.type='Shield';
    }

    Update(l1, l2)
    {
        this.pointing=new Vector2(l2.x-l1.x, l2.y-l1.y);
        var length=this.length/2;
        var r=rotatePoint(l2, l1, Math.PI/2);
        r.x-=l1.x;
        r.y-=l1.y;
        r.Normalize();
        this.Start=new Vector2(l2.x+r.x*length,l2.y+r.y*length);
        this.End=new Vector2(l2.x-r.x*length, l2.y-r.y*length);

        // this.Start=r1;
        // this.End=r2;
    }

    Draw(context, location2)
    {
        context.lineWidth=4;
        context.beginPath();
        context.moveTo(this.Start.x, this.Start.y);
        context.lineTo(this.End.x, this.End.y);

        context.stroke();

        context.lineWidth=1;
    }
}