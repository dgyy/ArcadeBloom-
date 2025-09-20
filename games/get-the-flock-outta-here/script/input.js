class KeyInput{
    
    static pres = [];//pressed
    static rel = [];//released

    static IsDown(k1, k2) {
        return this.pres[k1] || this.pres[k2];
    }

    static IsSingle(key) {
        var k = this.pres[key] && (this.rel[key] !== null || this.rel[key]);
        if(k){
            this.rel[key] = null;
        }
        return k;
    }
    
    static Pressed(e, status) {
        var k = this.SetKey(e);
        this.pres[k] = status;
        return k;
    }

    static Released(e, status) {
        var k = this.SetKey(e);
        this.rel[k] = status;
    }

    static SetKey(event) {
        return event.key;
    }
}

class TouchPad extends KeyInput{
    static TouchEnabled = false;
    static tpres = [];

    static zones = [
        {x:0,y:-80,r:64},
        {x:0,y:80,r:64},
        {x:-80,y:0,r:64},
        {x:80,y:0,r:64},
        {x:520,y:0,r:64}];
    
    static press = [];

    static Init(canvas, enabled, rend){//, b2){
        this.TouchEnabled = enabled;
        this.rend = rend;

        var m = this;
        var TouchMove = function(e){
            e.preventDefault();
            if (e.touches) {
                var rect = canvas.getBoundingClientRect(); // abs. size of element
                m.press = [];
                for (var i = 0; i < e.touches.length; i++) {
                    var touch = e.touches[i];
                    m.press.push({e:1,
                        x:Math.round((touch.pageX - rect.left)*(canvas.width / rect.width)),
                        y:Math.round((touch.pageY - rect.top)*(canvas.height / rect.height))});
                }
                
            } 
        }

        var TouchEnd = function(e){
            e.preventDefault();
            m.press = [];
        }

        canvas.addEventListener("touchstart", TouchMove);
        canvas.addEventListener("touchmove", TouchMove);
        canvas.addEventListener("touchend", TouchEnd);
        canvas.addEventListener("touchcancel", TouchEnd);
    }

    static Render(){
        if(this.TouchEnabled){
            this.rend.Circle(132, 500,128, '#000');
            this.rend.Circle(132, 500,32, '#000');
            this.rend.Circle(132+this.zones[4].x, 500,64, '#000');

            for (var i = 0; i < this.press.length; i++) {
                this.rend.Circle(this.press[i].x,this.press[i].y,64, '#999');
            }     
        }
    }

    static Touched(i) {
        var s = this.Touch(i);
        var d = s && (this.tpres[i] != s);
        this.tpres[i] = s;
        return d;
    }

    static Touching(i) {
        var s = this.Touch(i);
        this.tpres[i] = s;
        return s;
    }

    // static Any() {
    //     return this.press.length > 0;
    // }

    static Touch(indx) {
        for (var i = 0; i < this.press.length; i++) {
            var p = this.press[i];
            var z = this.zones[indx];
            
            return (Math.sqrt( ((p.x-(132+z.x)) * (p.x-(132+z.x)))+((p.y-(500+z.y)) * (p.y-(500+z.y))) ) < 16 + z.r);
        } 
        return 0;
    }
}

class Input extends TouchPad{
    static Up(){return this.Touching(0) || this.IsDown('w','ArrowUp')}
    static Down(){return this.Touching(1) || this.IsDown('s','ArrowDown')}
    static Left(){return this.Touching(2) || this.IsDown('a','ArrowLeft')}
    static Right(){return this.Touching(3) || this.IsDown('d','ArrowRight')}
    static Fire1(){return this.Touching(4) || this.IsSingle(' ')}
    static LeftS(){return this.Touched(2) || this.IsSingle('a') || this.IsSingle('ArrowLeft')}
    static RightS(){return this.Touched(3) || this.IsSingle('d') || this.IsSingle('ArrowRight')}
    static Space(){return this.Touched(4) || this.IsSingle(' ')}
}


