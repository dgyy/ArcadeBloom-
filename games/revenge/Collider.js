import { Vector2 } from "./mMath.js";

export default class Collider
{
    constructor(l1, l2, type)
    {
        this.start=l1;
        this.end=l2;
        this.type=type;
    }
}

export function CheckIsCollide(c1, c2)
{
    if(c2.type==1)//square
    {
        return lineRect(c1.start, c1.end, c2.start, c2.end);
    }
    else
    {
        return lineLine(c1.start, c1.end, c2.start, c2.end);
    }
}

function lineLine ( a1, a2, b1, b2 ) {
    // b1->b2向量 与 a1->b1向量的向量积
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    // a1->a2向量 与 a1->b1向量的向量积
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    // a1->a2向量 与 b1->b2向量的向量积
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    // u_b == 0时，角度为0或者180 平行或者共线不属于相交
    if ( u_b !== 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            return true;
        }
    }

    return false;
}

function lineRect ( a1, a2, b1, b2 ) {

    var r0=b1;
    var r1=new Vector2(b2.x, b1.y);
    var r2=new Vector2(b1.x, b2.y);
    var r3=b2;
    
    if ( lineLine( a1, a2, r0, r1 ) )
        return true;
    if ( lineLine( a1, a2, r1, r2 ) )
        return true;
    if ( lineLine( a1, a2, r2, r3 ) )
        return true;
    if ( lineLine( a1, a2, r3, r0 ) )
        return true;
    return false;
}