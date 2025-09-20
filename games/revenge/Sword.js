import { Vector2, dot, RightVector, Rotate } from "./mMath.js";
import Weapon from "./Weapon.js";

export default class Sword extends Weapon
{
    constructor(weight, length, Attack) 
    {
        super(weight, length, Attack);

        this.type='Sword';
    }

    Update(l1, l2)
    {
        this.SwordPointing=new Vector2(l2.x-l1.x, l2.y-l1.y);
        this.Start=l2;
        var r=this.SwordPointing;
        r.Normalize();
        this.End=new Vector2(this.Start.x+r.x* this.length, this.Start.y+r.y*this.length);
        
    }

    Draw(context, location2)// Vector2
    {
        var d=dot(this.SwordPointing.x, this.SwordPointing.y, RightVector.x, RightVector.y);
        //console.log(d);
        //console.log(SwordPointing.x)

        //console.log(SwordPointing.Length)
        
        var angle=Math.asin(d/(this.SwordPointing.Length*RightVector.Length));

        //console.log(angle);

        context.beginPath();

        if(this.SwordPointing.x<RightVector.x)
            angle=Math.PI-angle;
        
        context.save();
        context.translate(location2.x, location2.y);
        context.rotate(angle);
        
        context.moveTo(0,0);

        var sq=this.length*0.29;

        context.moveTo(0,0);

        context.lineWidth=4;

        context.lineTo(sq,0);

        context.stroke();

        context.moveTo(sq,0);
        
        context.lineWidth=2;

        context.fillStyle='#6C717E';
        
        context.strokeStyle='#6C717E';

        context.lineTo(this.length,0);

        context.stroke();

        context.restore();
        
        // context.beginPath();

        // context.moveTo(0, 0);
        
        // context.lineTo(this.Start.x, this.Start.y);
        // context.stroke();
        // context.lineTo(this.End.x, this.End.y);

        // context.stroke();

        // context.lineWidth=1;
        
        
    }
}