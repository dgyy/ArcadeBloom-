export default class PlayerState
{
    constructor(owner)
    {
        //red, yellow, green
        //head, LeftArm1, LeftArm2, RightArm1, RightArm2, body, LeftLeg, RightLeg
        this.Health=[100, 100, 100,100, 100, 100, 100, 100];

        this.isAttacked=[[], [], [],[],[],[],[],[]];

        this.owner=owner;

        //stomach*50%+rest*50% 75 30
    }

    Update()
    {
        var allHealth=this.Health[0]*0.3+this.Health[1]*0.05+this.Health[2]*0.05+this.Health[3]*0.05 +this.Health[4]*0.05 +this.Health[5]*0.3+this.Health[6]*0.1+this.Health[7]*0.1;
        if(allHealth<=30)
        {
            // this.owner.components['AnimationComponent'].animations[0].rate*=0.5;
            // this.owner.components['AnimationComponent'].animations[1].rate*=0.5;

           //console.log("shiteater");
        }

        if(this.Health[0]<=0||this.Health[5]<=0)
            this.owner.game.Stop(this.owner.index);

        //if legs health below 30 in average will reduce the speed of movement and the rate of jump
        if((this.Health[6]+this.Health[7])/2<=30)
            this.owner.components['MovementComponent'].rate=0.5;
    }

    TakeDamage(part, amount, from)
    {
        if(from in this.isAttacked[part])
            return;

        this.isAttacked[part].push(from);
        
        var armor=this.owner.components['ArmorComponent'].Armors[part];
        if(armor)
            this.Health[part]-=amount*(1-armor.protectiveLevel);
    }

    //remove the tag of being attacked
    RemoveAttack(part, from)
    {
        var index = this.isAttacked[part].indexOf(from);
        if(index>-1){//大于0 代表存在，
        this.isAttacked[part].splice(index,1);//存在就删除
    }
            
    }
}