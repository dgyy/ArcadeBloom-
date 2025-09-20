var EF = {
    InQuad: function (t) { return t * t },
    InOutQuad: function (t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }
}

var Util = {
    OneIn: function(c){
        return Util.RndI(0,c)==0;
    },
    OneOf: function(arr){
        return arr[Util.RndI(0,arr.length)];
    },
    Clamp: function(v, min, max){        
        return Util.Min(Util.Max(v, min), max);
    }, 
    Min: function(a, b)
    {
        return (a<b)? a : b;
    },
    Max: function(a, b){
        return (a>b)? a : b;
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
    //int min to max-1
    RndI: function (min, max){
        return ((Math.random() * (max-min))|0) + min;
    },
    Rnd: function (max){
        return Math.random() * max;
    }, 
    Context: function(w, h){
        var canvas = document.createElement('canvas');
        canvas.width = w;
		canvas.height = h;
        return {ctx:canvas.getContext('2d'), canvas:canvas};
    },
    UnpackWorldObjects: function(m){

        var objs = [];

            for (var r = 0; r < m.length; r++) {
                var last = {};
                var l = 0;
                var sp = 0;
                for (var c = 0; c < m[r].length; c++) {
                    sp = GAMEOBJ[m[r][c]];
                    if(sp.s && (sp.pid == last.pid || !last.s)){
                        l++;
                    }
                    else{
                        if(l){
                            objs.push({x:c-l,y:r,w:l,s:last.pid,d:last.dm});
                        }
                        l=sp.s?1:0;
                    }
                    last = sp;
                }
                if(l > 0){
                    objs.push({x:c-l,y:r,w:l,s:sp.pid,d:sp.dm});
                }            
            }


            for (var i = 0; i < objs.length; i++) {
                var t = [];
                for (var c = 0; c < objs[i].w; c++) {
                    t.push(objs[i].x+c);
                }
                objs[i].t = t;
            }            


        return objs;
    },
    Unpack: function(zip){
        var map = [];
        var v, pts;
        var sec = zip.split("|");
        for(var i = 0; i < sec.length; i++){
            pts= sec[i].split(",");
            v = (pts[0])|0;
            map.push(v);
            if(pts.length > 1){                
                for(var p = 1; p < pts[1]; p++){
                    map.push(v);
                }
            }
        }
        return map;
    },
    NText: function(val,len){
        return ("000000"+val).slice(-len);
    }
}

// a v simple object pooler
var Pool = function () {
    var list = [];

    return {
        Is: function(type){
            for (var i = 0; i < list.length; i++) {
                if (list[i].enabled == false && list[i].type == type)
                {
                    return list[i];
                }
            }
            return null;
        },
        Add: function(obj){
            list.push(obj);
        },
        Get: function(type, not){
            if(type){
                if(not){
                    return list.filter(l => l.enabled && type.indexOf(l.type) == -1);
                }else{
                    return list.filter(l => l.enabled && type.indexOf(l.type) != -1);
                }
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

