class KeyInput{
    
    static pres = [];//pressed
    static rel = [];//released

    static IsDown(key) {
        return this.pres[key];
    }

    static IsSingle(key) {
        var k = this.pres[key] && (this.rel[key] !== null || this.rel[key]);
        if(k){
            this.rel[key] = null;
        }
        return k;
    }
    
    static Pressed(e, status) {
        var k = this.SetKey(e, status);
        this.pres[k] = status;
        return k;
    }

    static Released(e, status) {
        var k = this.SetKey(e, status);
        this.rel[k] = status;
    }

    static SetKey(event, status) {
        return event.key;
    }
}

class GamePad extends KeyInput{
    static pads = () => (navigator.getGamepads ? Array.from(navigator.getGamepads()) : []).filter(x => !!x);

    static bpres = [];
    static meta = [
        {i:1,v:-1,b:12},
        {i:1,v:1,b:13},
        {i:0,v:-1,b:14},
        {i:0,v:1,b:15}];

    static Btn(i, p, h) {
        const pads = this.pads();        
        try {
            var s = pads[p].buttons[i].pressed;
            var d = (h&&s) || (s && (this.bpres[i+10] != s));
            this.bpres[i+10] = s;
            return d;
        } catch (e) {}
    };

    static Joy(p, i, h){
        var m = this.meta[i];
        var s = this.Pad(m.i,m.v, p) || this.Btn(m.b, p, h);
        var d = (h&&s) || (s && (this.bpres[i] != s));
        this.bpres[i] = s;
        return d;
    }

    static Pad (i, v, p) {
        const pads = this.pads();
        try {
            if (Math.abs(v - pads[p].axes[i]) < 0.5) {
                return true;
            }
        } catch (e) {}
    };

    static Pads(){
        return this.pads();
    }
}


class Input extends GamePad{
    static Up(){return this.IsSingle('w') || this.IsSingle('ArrowUp') || this.Btn(1,0) || this.Joy(0,0,0)}
    static Down(){return this.IsDown('s') || this.IsDown('ArrowDown') || this.Joy(0,1,1)}
    static Left(){return this.IsDown('a') || this.IsDown('ArrowLeft') || this.Joy(0,2,1)}
    static Right(){return this.IsDown('d') || this.IsDown('ArrowRight') || this.Joy(0,3,1)}
    static Fire1(){return this.IsSingle(' ') || this.Btn(0,0)}
    static Space(){return this.IsDown(' ') || this.Btn(1,0) || this.Btn(0,0)}
}


