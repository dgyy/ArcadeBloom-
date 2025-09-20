class MapManger{

    constructor(ctx, world, screen, tile){
        this.mapData = null;
        this.lvlData = null;
        this.offset = new Vector2();

        this.planSize = new Vector2(world.w, world.h);
        this.mapSize = new Vector2(world.w, world.h);
        this.mapSize.Multiply(tile);
        this.screenSize = new Vector2(screen.w, screen.h);
        this.screenSize.Multiply(tile);

        this.bounds = new Vector2(this.mapSize.x,this.mapSize.y);

        this.tileSize = tile;
        this.scale = 1;
        this.maxScale = 1;
        this.minScale = 0.3;

        this.screenCtx = ctx;

        this.tileCanvas = Util.Context(this.mapSize.x, this.mapSize.y);
        this.osCanvas = Util.Context(this.mapSize.x, this.mapSize.y);

        this.screenCtx.imageSmoothingEnabled = false;        

        this.rend = new Render(this.tileCanvas.ctx);

        this.SetScale();
    }

    SetScale(){
        if(this.mapSize.y > this.mapSize.x){
			this.maxScale = this.mapSize.x/this.screenSize.x;
		}
		else{
			this.maxScale = this.mapSize.y/this.screenSize.y;
		}
    }
    get Pos(){
        return {l:this.offset.x, 
            r:this.offset.x+(this.screenSize.x*this.scale),
            m:this.offset.x+((this.screenSize.x*this.scale)/2)};
    }

    Init(reset, bgData, lvlData, w){
        this.planSize.x = w;
        this.mapSize.x = w*this.tileSize;
        this.SetScale();
        this.bounds.x = this.mapSize.x;
        
        if(reset){            
            this.rend.Box(0,0,this.mapSize.x,this.mapSize.y);
        }
        this.mapData = bgData;
        this.lvlData = lvlData;
        this.TileInit();
    }

    Tile(t){

        for (var i = 0; i < t.t.length; i++) {
            var c = t.t[i];
            var r = t.y;
            this.lvlData[r][c] = 0;

            var p =this.mapData[r][c];
            var pt = new Vector2(c * this.tileSize, r * this.tileSize); 
            var s = GAMEOBJ.find(o=>o.id == p);
            this.Add(pt.x, pt.y, s.col, s.src);
        }          
        
    }

    TileInit(){
        var p,l;
        var col = this.planSize.x;
        var row = this.planSize.y;

        for(var r = 0; r < row; r++) 
        {
            for(var c = 0; c < col; c++) 
            {
                p = this.mapData[r][c];
                l = this.lvlData[r][c];
                var pt = new Vector2(c * this.tileSize, r * this.tileSize);   

                var s = GAMEOBJ.find(o=>o.id == p);
                this.Add(pt.x, pt.y, s.col, s.src);

                if(l>0){
                    s = GAMEOBJ.find(o=>o.id == l);
                    this.Add(pt.x, pt.y, s.col, s.src);
                }
            }
        }           
    }

    Add(x,y, col, src){
        if(col){
            this.rend.Box(x, y,32,32,col);
        }
        else{
            this.rend.Sprite(x+16, y+16, SPRITES.Get(src, 0), 1, 0);
        }
    }

    Zoom(rate){
        this.scale = Util.Clamp(this.scale+rate, this.minScale, this.maxScale);
    }

    MaxZoom(){
        this.scale = this.maxScale;
    }

    MinZoom(){
        this.scale = this.minScale;
    }

    ScrollTo(target, lerp){
        var sc = this.screenSize.Clone();
        var bn = this.bounds.Clone();
        sc.Multiply(this.scale);

        var destx = target.x - (sc.x/2);
        var desty = target.y - (sc.y/2);

        if(lerp)
        {
            destx = Util.Lerp(this.offset.x, target.x - (sc.x/2), lerp);
            desty = Util.Lerp(this.offset.y, target.y - (sc.y/2), lerp);
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

    // Content(pos){
    //     var c = Math.floor(pos.x / this.tileSize);
    //     var r = Math.floor(pos.y / this.tileSize);
    //     return this.mapData[r][c];
    // } 

}