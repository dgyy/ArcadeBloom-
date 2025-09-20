import Animation from "./Animation.js";
import { LeftAttack, RightAttack,  StandBy, combine, move } from "./Animationlib.js";
import { Vector2 } from "./mMath.js";

export default class AnimationComponent
{
    constructor(r1, r2, r3)//will be a dictionary
    {
        this.animations=[new Animation(r1, [StandBy[3],StandBy[4]], LeftAttack),new Animation(r2, [StandBy[1],StandBy[2]], RightAttack),new Animation(r3, [StandBy[6],StandBy[7]],move)];//, new Animation(r1, [StandByBack[0], StandByBack[1]], LeftAttackBack), new Animation(r2, [StandByBack[2], StandByBack[3]], RightAttackBack)];
    }

    Play(index)
    {
        this.animations[index].Play();
    }

    StopPlay(index)
    {
        this.animations[index].StopPlay();
    }

    BackPlay(index)
    {
        this.animations[index].BackPlay();
    }

    LoopPlay(index)
    {
        this.animations[index].SetLoop();
    }
    
    Update()
    {
        var array=[[new Vector2(StandBy[3].x,StandBy[3].y),new Vector2(StandBy[4].x,StandBy[4].y)],[new Vector2(StandBy[1].x,StandBy[1].y), new Vector2(StandBy[2].x, StandBy[2].y)],[new Vector2(StandBy[6].x,StandBy[6].y),new Vector2(StandBy[7].x,StandBy[7].y)]];
        
        for(var iter=0;iter<3;iter++)
        {
            // var i=iter;
            // if(iter>2)
            //     i-=3;
            if(this.animations[iter].isPlay!=0)
            {
                array[iter]=this.animations[iter].Update();
            }
        }

        return combine(array[0], array[1], array[2]);
    }
    
    
}