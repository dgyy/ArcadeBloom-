import { dot, Vector2 , RightVector} from "../mMath.js";

export default class Armor
{
    constructor(weight, protectiveLevel, type)
    {
        this.weight=weight;
        this.protectiveLevel=protectiveLevel;

        this.color='#000000';//TODO: According to the protectiveLevel
        
        this.type=type;

        this.category='Armor';
        
    }

    Draw(context, bodyVerticeArray, direction, Location)
    {
        var d=-1;
        if(!direction)
            d=1;

        function DrawTriangle(from, to)
        {
            var width=5;
            var pointing=new Vector2(bodyVerticeArray[to].x-bodyVerticeArray[from].x,bodyVerticeArray[to].y-bodyVerticeArray[from].y);
            var d=dot(pointing.x, pointing.y, RightVector.x, RightVector.y);
            var angle=Math.asin(d/(pointing.Length*RightVector.Length));
            
            
            context.save();
            
            context.translate(Location.x+bodyVerticeArray[from].x, Location.y+bodyVerticeArray[from].y);


            //console.log(RightVector.x);

            //console.log(angle);

            
              if(pointing.x<RightVector.x)
                      angle=Math.PI-angle;

            //console.log(angle);

            
            context.rotate(angle);

            context.fillRect(0, -width+width/2, pointing.Length, width);

            context.stroke();

            context.restore();
            
            }

            context.fillStyle=this.color;
        
        switch(this.type)
        {
            case 'Head':
                var height=17;
                var width=100;
                var crest=bodyVerticeArray[0].y+100;

                context.beginPath();
                context.fillRect(Location.x+bodyVerticeArray[0].x-width/2, Location.y-crest, width, height);
                context.stroke();


                var offset=0;

                if(direction==-1)
                    offset=-width/6;
                context.beginPath();
                context.fillRect((Location.x+direction*(bodyVerticeArray[0].x-width/2)+offset), Location.y-crest, height, width);
                context.stroke();
                break;


            
            case 'Body':
                var width=10;
                context.beginPath();
                context.fillRect(Location.x+bodyVerticeArray[0].x-width,Location.y+bodyVerticeArray[0].y,bodyVerticeArray[5].x+2*width, bodyVerticeArray[5].y);
                context.stroke();
                break;

            case 'LeftArm1':
                DrawTriangle(0,1);
                break;

            case 'LeftArm2':
                DrawTriangle(1,2);
                break;
                
            case 'RightArm1':
                DrawTriangle(0,3);
                break;
            case 'RightArm2':
                DrawTriangle(3,4);
                break;

            case 'LeftLeg':
                DrawTriangle(5,6);
                break;

            case 'RightLeg':
                DrawTriangle(5,7);
                break;

            case 'LeftFeet':

            case 'RightFeet':
        }
    }
}