import BackPack from "./BackPack.js";
import MainAttribute from "./MainAttributes.js";

export default class PlayerMainAttribute extends MainAttribute
{
    constructor()
    {
        super();
        
        this.money=1000;
        this.backpack=new BackPack();

       
    }
}