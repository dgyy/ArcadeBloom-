import MainAttribute from "./MainAttributes.js";
import Armor from "./Armor.js";
import Shield from "./Shield.js";
import Sword from "./Sword.js";
import { Random } from "./mMath.js";

export default class RandomEnemyGenerator extends MainAttribute
{
    constructor()
    {
        super();
    }

    Easy()
    {
        this.SelectedArmor=[new Armor(1,Random(0.3, 0.1),'Head'), new Armor(1,Random(0.3, 0.1),'LeftArm1'), new Armor(1,Random(0.3, 0.1),'LeftArm2'), new Armor(1,Random(0.3, 0.1), 'RightArm1'), new Armor(1,Random(0.3, 0.1),'RightArm2'), new Armor(1,Random(0.3, 0.1),'Body'), new Armor(1,Random(0.3, 0.1), 'LeftLeg'), new Armor(1,Random(0.3, 0.1), 'RightLeg')];
        this.SelectedWeapons=[new Sword(Random(200, 100),Random(100, 50), Random(10, 5)), new Sword(Random(200, 100),Random(100, 50), Random(10, 5))];
    }

    Mid()
    {
        this.leftArmSpeed=Random(0.05, 0.02);
        this.rightArmSpeed=Random(0.05, 0.02);
        
        this.velocity=Random(150, 120);

        this.SelectedArmor=[new Armor(1,Random(0.5, 0.37),'Head'), new Armor(1,Random(0.5, 0.25),'LeftArm1'), new Armor(1,Random(0.5, 0.25),'LeftArm2'), new Armor(1,Random(0.5, 0.37), 'RightArm1'), new Armor(1,Random(0.5, 0.37),'RightArm2'), new Armor(1,Random(0.5, 0.37),'Body'), new Armor(1,Random(0.5, 0.37), 'LeftLeg'), new Armor(1,Random(0.5, 0.37), 'RightLeg')];
        var o=Math.round(Math.random());
        if(o)
            this.SelectedWeapons=[new Sword(Random(200, 100),Random(100, 50), Random(37, 17)), new Sword(Random(200, 100),Random(100, 50), Random(37, 17))];
        else
            this.SelectedWeapons=[new Sword(Random(200, 100),Random(100, 50), Random(37, 17)), new Shield(Random(200, 100),Random(150, 100), 0)];
    }

    Hard()
    {
        this.leftArmSpeed=Random(0.08, 0.05);
        this.rightArmSpeed=Random(0.08, 0.05);
        
        this.velocity=Random(180, 150);
        this.SelectedArmor=[new Armor(1,Random(0.76, 0.59),'Head'), new Armor(1,Random(0.76, 0.59),'LeftArm1'), new Armor(1,Random(0.76, 0.59),'LeftArm2'), new Armor(1,Random(0.76, 0.59), 'RightArm1'), new Armor(1,Random(0.76, 0.59),'RightArm2'), new Armor(1,Random(0.76, 0.59),'Body'), new Armor(1,Random(0.76, 0.59), 'LeftLeg'), new Armor(1,Random(0.76, 0.59), 'RightLeg')];
        var o=Math.round(Math.random());
        if(o)
            this.SelectedWeapons=[new Sword(Random(300, 200),Random(150, 50), Random(67, 47)), new Sword(Random(350, 200),Random(150, 50), Random(67, 47))];
        else
            this.SelectedWeapons=[new Sword(Random(300, 200),Random(150, 50), Random(67, 47)), new Shield(Random(500, 354),Random(200, 150), Random(37, 17))];
    }
}