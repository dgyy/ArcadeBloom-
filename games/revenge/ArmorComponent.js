export default class ArmorComponent
{
    constructor(Armors) {
        this.Armors=Armors;
    }//Amors will be a dictionary such as head: armorItem

    Draw(context,bodyVerticeArray, direction, Location)
    {
        if(this.Armors)
        {
            for(var x of this.Armors)
            {
                if(x)
                    if(x.weight&&x.weight!=0)
                        x.Draw(context, bodyVerticeArray, direction, Location);
            }
        }
    }
}