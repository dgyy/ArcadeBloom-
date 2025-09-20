import { Vector2, dot, RightVector, Rotate } from "./mMath.js";

export default class Weapon
{
    constructor(weight, length, Attack)
    {
        this.weight=weight;
        this.length=length;

        //this.Attack=Math.random()*weight*length*0.5;

        this.Attack=Attack;

        this.Start=new Vector2(0,0);
        this.End=new Vector2(0,0);

        this.category='Weapon';
    }
}