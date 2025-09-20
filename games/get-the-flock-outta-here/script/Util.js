//util
var Easing = {
    // elastic bounce effect at the beginning and end
    eInOutE: function (t) { return (t -= .5) < 0 ? (.01 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 }
}

var SUtil ={
    Context: function(w, h){
        var c = document.createElement('canvas');
        if(w)c.width = w;
		if(h)c.height = h;
        return {ctx:c.getContext('2d'), canvas:c};
    },
    Resize: function(src,size, o){
        var arr = [];
        for (let i = 0; i < src.length; i+=2) {
            arr.push(src[i]);
            var  a = [];
            for (let j = 0; j < src[i+1].length; j+=3) {
                a.push((src[i+1][j]*size.x)+o.x);
                a.push((src[i+1][j+1]*size.y)+o.y);
                a.push((src[i+1][j+2]*size.z)+o.z);
            }
            arr.push(a);
        }
        return arr;
    },
    Merge: function(src){
        return [].concat(...src);
    }
};

var GOUtil = {
    Collisions: function(bodies){
        for(var i=0, l=bodies.length; i<l; i++){        
            for(var j=i+1; j<l; j++){

                        var p = bodies[i].pos.Clone().Subtract(bodies[j].pos);
                        var length = p.Length();

                        if(length < 32){
                            var factor = (length-32)/length;
                            p.Multiply(factor*0.5);                            
                            
                            if(GOUtil.CanMove(bodies[i].pos, 12, -p.x, 0) )
                            {
                                if(!bodies[i].static){
                                    bodies[i].pos.x -= p.x;                                    
                                }

                                bodies[i].Collider(bodies[j]);
                            }
                            if(GOUtil.CanMove(bodies[i].pos, 12, 0, -p.y) )
                            {
                                if(!bodies[i].static){
                                    bodies[i].pos.y -= p.y;
                                }
                                bodies[i].Collider(bodies[j]);
                            }

                            if(GOUtil.CanMove(bodies[j].pos, 12, p.x, 0) )
                            {
                                if(!bodies[j].static){
                                    bodies[j].pos.x += p.x;
                                }
                                bodies[j].Collider(bodies[i]);
                            }
                            if(GOUtil.CanMove(bodies[j].pos, 12, 0, p.y) )
                            {
                                if(!bodies[j].static){
                                    bodies[j].pos.y += p.y;
                                }
                                bodies[j].Collider(bodies[i]);
                            }        
                        }                        

            }
        }
    },
    CanMove: function(p, b, vx, vy){
        var clx = [1,4];

        if(clx.includes(MAP.Content( new Vector2(p.x - b + vx, p.y - b + vy)))) {//t left
            return false;
        }
        if(clx.includes(MAP.Content( new Vector2(p.x + b + vx, p.y - b + vy)))) {//t right
            return false;
        }
        if(clx.includes(MAP.Content( new Vector2(p.x - b + vx, p.y + b + vy)))) {//b left
            return false;
        }
        if(clx.includes(MAP.Content( new Vector2(p.x + b + vx, p.y + b +vy)))) {//b right
            return false;
        }
        return true;
    },
    Dir: function(perp, prot){
        var inp = {
            up: false,
            down: false,
            left: false,
            right: false,
            d:0
        };
        var distx = Util.AbsDist( perp.x, prot.x);
        var disty = Util.AbsDist( perp.y, prot.y);
        inp.d = Util.PDist(distx, disty);
        if(distx > disty){
            if(perp.x > prot.x){
                inp.right = true;
            }
            else if(perp.x < prot.x){
                inp.left = true;      
            }
        }else{
            if(perp.y > prot.y){
                inp.down = true;           
            }
            else if(perp.y < prot.y){
                inp.up = true;
            }
        }
        return inp;
    }
};

var Util = {
    Arc: function(i, items, radius)
    {
        return (radius * Math.sin( Math.PI * i / items));
    },
    OneIn: function(c){
        return Util.RndI(0,c)==0;
    },
    OneOf: function(arr){
        return arr[Util.RndI(0,arr.length)];
    },
    //int min to max-1
    RndI: function (min, max){
        return ((Math.random() * (max-min))|0) + min;
    },
    Rnd: function (max){
        return Math.random() * max;
    },  
    Min: function(a, b)
    {
        return (a<b)? a : b;
    },
    Max: function(a, b){
        return (a>b)? a : b;
    },
    Clamp: function(v, min, max){        
        return Util.Min(Util.Max(v, min), max);
    },
    Lerp: function(start, end, amt)
    {
        return (end-start) * amt+start;
    },
    InvLerp: function(start, end, amt)
    {
        return (amt-start) / (end - start);
    },
    Remap: function(origFrom, origTo, targetFrom, targetTo, value)
    {
        var rel = Util.InvLerp(origFrom, origTo, value);
        return Util.Lerp(targetFrom, targetTo, rel);
    },
    AbsDist: function(p1, p2){
        return Math.abs( p1 - p2);
    },
    PDist: function(x, y){        
        return Math.sqrt(x*x + y*y);
    },
    IsoPoint: function(x, y)
    {
        return new Vector2((x - (y * (1-.85))), ((y + (x * (1-.85)))*.85));
    }
}

// a v simple object pooler
var ObjectPool = function () {
    var list = [];

    return {
        Add: function(obj){
            list.push(obj);         
        },
        All: function(type){
            return list.filter(l => type.indexOf(l.type) != -1);
        },
        Get: function(type){
            if(type){                
                return list.filter(l => l.enabled && type.indexOf(l.type) != -1);
            }else{
                return list.filter(l => l.enabled);
            }
        },
        Clear: function(){
            list = [];
        },
        Set: function(g){
            list = g;
        }    
    }
};

