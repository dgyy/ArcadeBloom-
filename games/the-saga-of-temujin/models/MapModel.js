class Map{
    constructor(level){

        switch (level) {
            case 1:
                this.aestheticFeatures = [
                    //(inclusive) Bottom Left, Top Right, Type
                    [[1,1], [25,6],"dirt"],
                    [[19,21], [24,24],"dirt"],
                    [[12,11], [14,14],"bridge"],
                ]

                this.impassableFeatures = [
                    [[1,12], [11,13],"river"],
                    [[15,12], [25,13],"river"],
                ]

                this.buildableFeatures = [
                    [[2,2], [24,5],"dark_dirt"],
                    [[20,22], [23,23],"dark_dirt"],
                ]

                break;
        
            default:
                break;
        }

    }

    checkPassableTerrain([x,y]){
        this.impassableFeatures.forEach((feature)=>{
            if(x >= feature[0][0] && x <= feature[1][0]){
                if (y >= feature[0][1] && y <= feature[1][1]){
                    return false
                }
            }
        });

        return true;
    }


        


}