import { Lerp } from "./mMath.js";

export default class Animation
{
    constructor(rate, from, to) //0.01 to 1
    {
        this.isPlay=0;//0 for already stopped, 1 for do the animation, 2 for do the back animation
        this.count=0;
        this.rate=rate;
        this.from=from;
        this.to=to;
    }

    Play()
    {   
        if(this.Loop&&this.isPlay==2)
            this.isPlay=2;
        else
            this.isPlay=1;
    }

    SetLoop()
    {
        this.Loop=1;
    }

    StopPlay()
    {
        this.isPlay=0;
        this.count=0;
    }

    BackPlay()
    {
        this.isPlay=2;
    }

    Update()// return the certain location of vertices
    {
        
        if(this.isPlay==1)
        {
            this.count+=this.rate;
            if(this.count>=1)
            {
                this.count=1;
                if(this.Loop)
                {
                    this.isPlay=2;
                    console.log("shiteater");
                }
            }
    
            return [Lerp(this.from[0], this.to[0], this.count), Lerp(this.from[1], this.to[1], this.count)];
        }
        else
            if(this.isPlay==2)
            {
                    console.log("Locve");
                this.count-=this.rate;
                if(this.count<=0)
                {
                    this.isPlay=0;
                    this.count=0;

                    if(this.Loop)
                    {
                        this.isPlay=1;
                    }
                }

                return  [Lerp(this.to[0], this.from[0], 1-this.count), Lerp(this.to[1], this.from[1], 1-this.count)];
            }
        
    }
}