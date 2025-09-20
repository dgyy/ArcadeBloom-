class MapManger{

    constructor(ctx){
        this.tileset = [0,10,1,2,10 ,1,2,10,11,13];
        
        this.offset = new Vector2();

        
        this.tileSize = 32;//md.map.size.tile.width;
        this.screenSize = new Vector2(25, 19);
        //this.screenSize = new Vector2(md.map.size.screen.width, md.map.size.screen.height);
        this.screenSize.Multiply(this.tileSize);//md.tile.width);

        this.scale = 1;
        this.maxScale = 1;
        this.minScale = 0.3;

        this.screenCtx = ctx;
        this.screenCtx.imageSmoothingEnabled = true;    
        this.osCanvas = SUtil.Context(100,100);
    }

    Set(md){
        this.mapSize = new Vector2(md.world[0], md.world[1]);
        this.mapSize.Multiply(this.tileSize);

        this.area = new Vector2(md.world[0], md.world[1]);
        this.bounds = new Vector2(this.mapSize.x,this.mapSize.y);

        this.mapData = md.data;


        this.tileCanvas = SUtil.Context(this.mapSize.x, this.mapSize.y);
        this.osCanvas = SUtil.Context(this.mapSize.x, this.mapSize.y);

        this.rend = new Render(this.tileCanvas.ctx);

        this.SetScale();
    }

    Init(){
        var h = this.tileSize/2;

        this.rend.Box(0,0,this.mapSize.x,this.mapSize.y, PAL[16]);

        for(var r = 0; r < this.area.y; r++) 
        {
            for(var c = 0; c < this.area.x; c++) 
            {            
                var pt = Util.IsoPoint((c * this.tileSize)+h, (r * this.tileSize)+h); 
                var n = this.mapData[r][c];
                this.rend.Polygon(
                    pt.x,
                    pt.y,
                    n==2||n==3?assetstileh:assetstile,
                    this.tileset[n], {x:1,y:1,z:1},1); 
             }
        }
    }

    get Pos(){
        return {t:this.offset.y,
            b:this.offset.y+(this.screenSize.y*this.scale),
            l:this.offset.x, 
            r:this.offset.x+(this.screenSize.x*this.scale),
            m:this.offset.x+((this.screenSize.x*this.scale)/2)};
    }
    
    SetScale(){
        if(this.mapSize.y > this.mapSize.x){
			this.maxScale = this.mapSize.x/this.screenSize.x;
		}
		else{
			this.maxScale = this.mapSize.y/this.screenSize.y;
		}
    }

    Zoom(rate, t, l){
        this.scale = Util.Clamp(this.scale+rate, this.minScale, this.maxScale);
        if(t&&l){
            this.ScrollTo(t, l);
        }
    }

    // MaxZoom(){
    //     this.scale = this.maxScale;
    // }

    // MinZoom(){
    //     this.scale = this.minScale;
    // }

    ScrollTo(target, lerp){
        var pt = Util.IsoPoint(target.x, target.y);
        var sc = this.screenSize.Clone();
        var bn = this.bounds.Clone();
        sc.Multiply(this.scale);
        
        var destx = pt.x - (sc.x/2);
        var desty = pt.y - (sc.y/2);

        if(lerp)
        {
            destx = Util.Lerp(this.offset.x, pt.x - (sc.x/2), lerp);
            desty = Util.Lerp(this.offset.y, pt.y - (sc.y/2), lerp);
        }

        if(destx < 0){
            destx = 0;
        }
        if(destx > bn.x - (sc.x)){
            destx = bn.x - (sc.x);
        }

        if(desty < 0){
            desty = 0;
        }
        if(desty > bn.y - (sc.y)){
            desty = bn.y - (sc.y);
        }

        this.offset.x = destx;
        this.offset.y = desty;

        return this.offset;
    }

    ScreenBounds(){
        var sc = this.screenSize.Clone();
        return {Min:this.offset, Max:sc};
    }

    PreRender(){
        var sc = this.screenSize.Clone();
        sc.Multiply(this.scale);
        
        this.osCanvas.ctx.drawImage
        (
            this.tileCanvas.canvas, 
            this.offset.x, this.offset.y, sc.x, sc.y,
            0, 0, sc.x, sc.y
        );

        return this.offset;
    }
    
    PostRender(){
        var sc = this.screenSize.Clone();
        sc.Multiply(this.scale);
        
        this.screenCtx.drawImage
        (
            this.osCanvas.canvas, 
            0, 0, sc.x, sc.y,
            0, 0, this.screenSize.x, this.screenSize.y
        );
    }

    Content(pos){
        var c = Math.floor(pos.x / this.tileSize);
        var r = Math.floor(pos.y / this.tileSize);
        return this.mapData[r][c];
    } 
}

class Render{

    constructor(context, width, height)
    {
        this.ctx = context;
        this.boundsw = width;
        this.boundsh = height;
    }

    PT(p){
        return Math.round(p);
    }

    Polygon(x, y, poly, coli, size, d, a){
        for(var i = 0; i < poly.length; i+=2) 
        {
            var t = Array.isArray(coli) ? PAL[coli[poly[i]]] : PAL[ COLS[coli][poly[i]] ];
            this.Side(x, y, poly[i+1], t, size, a, d);
        } 
    }

    Side(x, y, pts, col, sz, a, d){
        this.ctx.fillStyle = new Color(col, a).RGBA();//col;   

        this.ctx.beginPath();
        var pt = d?Util.IsoPoint(pts[0]*sz.x, pts[1]*sz.y):new Vector2(pts[0]*sz.x, pts[2]*sz.z);
        var z = d?pts[2]*sz.z:0;
        this.ctx.moveTo(
            this.PT(pt.x + x), 
            this.PT((pt.y + z) + y)
            );

        for(var p = 3; p < pts.length; p+=3) {
            pt = d?Util.IsoPoint(pts[p]*sz.x, pts[p+1]*sz.y):new Vector2(pts[p]*sz.x, pts[p+2]*sz.z);
            z = d?pts[p+2]*sz.z:0;
            this.ctx.lineTo(
                this.PT(pt.x + x), 
                this.PT((pt.y + z) + y)
                ); 
        }
        
        this.ctx.closePath();
        this.ctx.fill();
    }
 

    Clear(){
        this.ctx.clearRect(0, 0, this.boundsw, this.boundsh);
    }
    Box(x,y,w,h,c){
        this.ctx.fillStyle = c || '#000';
        this.ctx.fillRect(x, y, w, h);
    }

    Circle(x,y,r,c){
        this.ctx.beginPath();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = c;
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        this.ctx.stroke();
    }
    Image(img, pos, size, src, clip, op){
        this.ctx.globalAlpha = op;
        this.ctx.drawImage
        (
            img, 
            src.x, src.y, clip.x, clip.y,
            pos.x, pos.y, size.x, size.y
        );
        this.ctx.globalAlpha = 1;
    }
    Text(str, xs, ys, size, sc, col, bx) {

        str = !isNaN(str) ? ""+str : str;
        this.ctx.fillStyle = col || '#fff';

        var cr = xs;
        var length = new Vector2(0,0);

        for (var i = 0; i < str.length; i++) {
            var xp = 0;
            var yp = 0;
            var mx = 0; 

            var chr = str.charAt(i);
            if(chr == '|' || bx && xs>bx && (chr==',' || chr==' '))
            {
                ys += (size*8);
                xs=cr;
            }
            else
            {
                var l = FONT[str.charAt(i)];
                var chrSize = new Vector2(0,0);
                for (var r = 0; r < l.length; r++) 
                {
                    chrSize.x = 0;
                    xp = 0;
                    var row = l[r];
                    for (var c = 0; c < row.length; c++) 
                    {                    
                        var szx = (sc && c==row.length-1) ? size*2 : size;
                        var szy = (sc && r==l.length-1) ? size*2 : size;
                        if (row[c]) {
                            this.ctx.fillRect(Math.round(xp + xs), Math.round(yp + ys), szx, szy);
                        }
                        xp += szx;
                        chrSize.x += szx;
                    }
                    mx = xp>mx ? xp : mx;
                    yp += szy;
                    chrSize.y += szy;
                }
                length.x += chrSize.x + size;
                length.y = chrSize.y;

                xs += mx + size; 
            }
        }

        return length;
    }  
}
