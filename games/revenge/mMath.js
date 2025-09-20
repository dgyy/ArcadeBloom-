export function dot(x1, y1, x2, y2)
{
    return x1*x2+y1*y2;
}

export class Vector2
{
    constructor(x, y)
    {
        this.x=x;
        this.y=y;
    }

    Normalize()
    {
        var Length=this.Length;
        this.x=this.x/Length;
        this.y=this.y/Length;
    }


    get Length()
    {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    
} 

export var RightVector=new Vector2(0,1);

export function Random(m, n)
{
    return Math.random()*(m-n)+n;
}

export function Lerp(l1, l2, w)
{
    return new Vector2(l1.x+w*(l2.x-l1.x), l1.y+w*(l2.y-l1.y));
}

export function Rotate(l, angle)
{
    return new Vector2(l.x*Math.cos(angle)-l.y*Math.sin(angle), l.x*Math.sin(angle)+l.y*Math.cos(angle));   
}

export function rotatePoint(ptSrc,ptRotationCenter,angle){
  var a = ptRotationCenter.x
  var b = ptRotationCenter.y
  var x0 = ptSrc.x
  var y0 = ptSrc.y
  var rx = a + (x0-a) * Math.cos(angle) - (y0-b) * Math.sin(angle);
  var ry = b + (x0-a) * Math.sin(angle) + (y0-b) * Math.cos(angle);

  return new Vector2(rx, ry);
}
