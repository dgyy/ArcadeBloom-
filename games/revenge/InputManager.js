export default class InputManager
{
    constructor()
    {

        let self=this;

        this.keysDown={};

        addEventListener("keydown", function(e){
            self.keysDown[e.key]=true;
        }, false);

        addEventListener('keyup', function(e){
            self.keysDown[e.key]=false;
        }, false);

        addEventListener('mousemove', function(e){
            self.mousex=e.offsetX;
            self.mousey=e.offsetY;
        }, false);

        addEventListener('mouseup', function(e){
            if(e.button==0)
                self.leftbutton=false;
            else
                self.rightbutton=false;
        }, false);

        addEventListener('mousedown', function(e)
        {
            if(e.button==0)
            {
                 self.leftbutton=true;
                console.log('Lily');
            }
            else
            {
                self.rightbutton=true;
                console.log("Elaine");
            }
        }, false);
    }
}