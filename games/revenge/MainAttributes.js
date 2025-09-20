import Armor from "./Armor.js";
import Shield from "./Shield.js";
import Sword from "./Sword.js";
import { Random } from "./mMath.js";

export default class MainAttribute
{
    constructor()
    {
        this.velocity=Random(120, 100);
        this.strength=Random(699, 312);

        this.leftArmSpeed=Random(0.02, 0.01);
        this.rightArmSpeed=Random(0.02, 0.01);
        this.walkAnimationSpeed=Random(0.02, 0.01);
        
        this.SelectedArmor=[new Armor(0,0,'Head'), new Armor(0,0,'LeftArm1'), new Armor(0,0,'LeftArm2'), new Armor(0,0, 'RightArm1'), new Armor(0,0,'RightArm2'), new Armor(0,0,'Body'), new Armor(0,0, 'LeftLeg'), new Armor(0,0, 'RightLeg')];
        this.SelectedWeapons=[new Sword(100,100,10), new Shield(100,75,0)];
    }
}