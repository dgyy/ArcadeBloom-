//gameobjects
class Vector2 
{
    constructor(x=0, y=0) { this.x = x; this.y = y; }    
    Clone(s=1)            { return (new Vector2(this.x, this.y)).Multiply(s); }
	Add(v)                { (v instanceof Vector2)? (this.x += v.x, this.y += v.y) : (this.x += v, this.y += v); return this;  }
	Subtract(v)           { (this.x -= v.x, this.y -= v.y) ; return this;  }
	Multiply(v)           { (v instanceof Vector2)? (this.x *= v.x, this.y *= v.y) : (this.x *= v, this.y *= v); return this;  }
	Set(x, y)             { this.x = x; this.y = y; return this;  }
    AddXY(x, y)           { this.x += x; this.y += y; return this;  }
    Length()              { return Math.hypot(this.x, this.y ); }
    Dist(v,o)           { return Math.hypot(this.x - (v.x*o), this.y - (v.y*o) ); }
}
class Color
{
    constructor(c,a=1) { 
        var s = c.split(''); 
        var rgb = [];
        for (var i = 1; i < s.length; i++) {
            rgb.push(parseInt(s[i], 16));
        }
        this.r=rgb[0]*16;this.g=rgb[1]*16;this.b=rgb[2]*16;this.a=a; 
    } 
    Clone(s=1) { 
        var r = new Color("#000", this.a*s); 
        r.r = this.r*s;
        r.g = this.g*s;
        r.b = this.b*s; 
        return r;
    }
    Subtract(c) { this.r-=c.r;this.g-=c.g;this.b-=c.b;this.a-=c.a; return this; }
    Lerp(c,p)   { return c.Clone().Subtract(c.Clone().Subtract(this).Clone(1-p)); }
    RGBA()  { return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
    }
}

class TextSprite{
    constructor(txt, size, style, col){
        this.enabled = 1;
        
        this.g = SUtil.Context();
        this.rend = new Render(this.g.ctx);
        this.size;	
        this.Create(txt, size, style, col);
    }

    Create(txt, size, style, col){
        this.size = this.rend.Text(txt, 0, 0 ,size, style, col); 
    }

    get TextImg(){
        return this.g.canvas;
    }

    get Size(){
        return this.size;
    }
}

class Timer{
    constructor(t){
        this.start = t;
        this.time = t;
        this.enabled = t>0;
    }

    Set(t){
        this.time = t;
        this.enabled = t>0;
    }
    Update(dt){
        var r = false;
        if(this.enabled){
            this.time -= dt;

            if(this.time <= 0)
            {
                this.time = 0;
                this.enabled = false;
                r = true;
            }
        }
        return r;
    }
}

class GameObjectBase{

    constructor(pos, type)
    {
        this.type = type;
        this.enabled = true;
        this.pos = pos;	
        this.V = new Vector2();
        this.body=[];
        this.frame = 0;
        this.action = 0;

        this.speed = 0;
        this.damping = 0.8;
        this.bounds = 12;
        this.hits = 16;
        this.z = 0;
        this.size = {x:1,y:1,z:1};
        this.shadow = 0;
        this.alpha = 1;
        this.static = 0;
    }

    Update(dt){
    }

    get Body() {
        return this.body[this.action][this.frame];
    }

    Render(x,y){
        if(this.enabled){
            var pt = Util.IsoPoint(this.pos.x, this.pos.y);  
            
            if(this.shadow){
                GFX.Polygon(pt.x-x, pt.y-y, this.shadow, 4, this.size, 1, 0.2);//C.col.shadow
            }
            var b = this.Body;
            GFX.Polygon(pt.x-x, pt.y-y-this.z, b.src, b.col, this.size, 1, this.alpha);
        }
    }

    Collider(perp){
    }
}

class Dood extends GameObjectBase {
    
    constructor(pos, type)
    {
        super(pos, type);  
        this.mtype = 0;
        this.maxJumpHt=0;
        this.jumpHt = 0;
        this.zd = 0;
        this.zV = 80;
        this.invince = 0;
    }

    Moves(dt, d){
        if(this.mtype){
            this.Moving(dt, d);
        }
        else{
            this.Hopping(dt, d);
        }
    }

    Dth(){
        if(!this.invince){
            var p = MAP.Content(this.pos);
            
            if(p==2 || p==5){
                GAME.Hat(this.hat, new Vector2(Util.Rnd(64)-32, Util.Rnd(64)-32));
                GAME.Splash(this.pos.Clone());                
                this.enabled = false;
                AUDIO.Play(2);
            }
            if(p==3|| p==6){
                GAME.Hat(this.hat);
                this.enabled = false;
                AUDIO.Play(1);
            }            
        }

    }
    Hopping(dt, d){
        if(this.jumpHt > 0){            
            this.z = Util.Arc(this.zd, 32, this.jumpHt); 
            this.zd-=(this.zV*dt);
            if(this.zd<0){
                this.z=0;
                this.V = new Vector2(0,0);
                this.jumpHt=0;

                this.Dth();

                this.Play(1);
            }       
        }
        else
        {
            this.Hop(dt,d);
            if(d.up||d.down||d.left||d.right)
            {
                this.jumpHt = this.maxJumpHt;
                this.zd = 32;
            }

            this.Point(d);           
        }
    }

    Point(d){
        if(d.up){
            this.action = 0;//C.DIR.UP;
        }
        else if(d.down){
            this.action = 1;//C.DIR.DOWN;
        }
        else if(d.left){
            this.action = 2;//C.DIR.LEFT;
        }
        else if(d.right){
            this.action = 3;//C.DIR.RIGHT;
        }
    }

    Moving(dt, d){

        this.Move(dt, d);
        this.Dth();
        this.Point(d); 
    }

    Hop(dt, input){    
        var sp = this.speed *dt;  
        if(input.down){
            this.V.y = sp;
        }
        else if(input.up){
            this.V.y = -sp;
        }
        else
        if(input.right){
            this.V.x = sp;
        }
        else if(input.left){
            this.V.x = -sp;
        }
    }

    Move(dt, input){    
        var sp = this.speed *dt; 

        if(input.down){
            this.V.y += sp;
        }
        else if(input.up){
            this.V.y -= sp;
        }
        else
        if(input.right){
            this.V.x += sp;
        }
        else if(input.left){
            this.V.x -= sp;
        }

        this.V.Multiply(this.damping);
    }

    Update(dt){
        if(this.enabled ){
            if(!this.invince){

                if(!GOUtil.CanMove(this.pos, this.bounds, this.V.x, 0) )
                {
                    this.V.x=0;
                }
                if(!GOUtil.CanMove(this.pos, this.bounds, 0, this.V.y) )
                {
                    this.V.y=0;
                }

            }

           this.pos.Add(this.V);
       }

       super.Update(dt);
    }
}

class Player extends Dood {
    
    constructor(pos, def)
    {
        super(pos, 0);//C.ASSETS.PLAYER);
        this.mtype = def.d.t;
        this.speed= def.d.t?2:128;

        this.maxJumpHt = 16;
        this.zV = 160;
        this.damping=0.98;

        this.z = 0;

        var leght = def.d.l;
        var hsz = def.d.h;
        this.body = Factory.Man(def.c, def.d);

        this.tall = (8*leght)+(16*1)+(16*hsz);
        this.shadow = assetstile;
        this.action = 3;//C.DIR.DOWN;

        this.name = def.n;
        this.gen = def.g;
        this.hat = new Grunt(this.pos.Clone(),
                [[{src:assetshat, col:8}]],//C.col.hat
                4,//C.ASSETS.GRUNT,
                {x:0.6,y:0.6,z:0.6});
                
        this.HatUpdate();
    }

    HatUpdate(){
        this.hat.z = this.z  +this.tall;
        this.hat.pos.x = this.pos.x;
        this.hat.pos.y = this.pos.y;
    }
    Play(){
        AUDIO.Play(0);
    }
    Collider(perp){
        if(perp.type==8 && GAME.M == 1){//TRANY
            GAME.Hat(this.hat);
            this.enabled = false;
            AUDIO.Play(1);
        }
    }
    Update(dt){
        var d = {
            up:0,
            down:0,
            left:0,
            right:0
        };
        if(GAME.M == 1){
            d = {
                up:Input.Up(),
                down:Input.Down(),
                left:Input.Left(),
                right:Input.Right()
            };
        }
        
        super.Moves(dt, d);

        if(Input.Fire1()){
            GAME.Plant(this.pos, this.action);
        }
        

        super.Update(dt);

        this.HatUpdate();
        this.hat.Update(dt);
    }

    Render(x,y){
        if(this.enabled){
            super.Render(x, y);            
        }

        this.hat.Render(x,y);
    }
}


//mostly a sheep
//or a simp or man in a dress
class Gunt extends Dood {
    
    constructor(pos, type, def, bdy, lvl)
    {
        super(pos, type);
        this.speed=type==7 ? 135 : Util.RndI(110,132);
        this.maxJumpHt = 8;
        this.zV = 240;
        this.damping=0.85;
        this.accel=0;
        this.body = bdy;
        var sz = type==1 || type==8 ? def.s || Util.Rnd(0.3)+0.7 : 1;//C.ASSETS.PPL
        this.name = def.n;
        this.size = {x:sz,y:sz,z:sz};
        this.action = 1;// C.DIR.DOWN;
        this.target;
        this.follow = 0;
        this.found = 0;
        this.level = lvl;
        this.shadow = assetstile;
        this.call = type==2 || type==8 ? def.call : ["BAA","MEH"];//C.ASSETS.PPL
        this.fall = 0;
        this.ct = new Timer(2);
        
        this.invince = this.type == 7;
        if(type == 1){//C.ASSETS.SHEEP
            this.tall = 26;
            this.hatoff = [
                {x:0,y:-20},
                {x:0,y:16},
                {x:-20,y:0},
                {x:20,y:0}
            ];
            this.hat = new Grunt(this.pos.Clone(),
                    [[{src:assetshat, col:8}]],//C.col.hat
                    4,//C.ASSETS.GRUNT,
                    {x:0.4,y:0.4,z:0.4});
            this.HatUpdate();  
        }
      
    }

    HatUpdate(){
        this.hat.z = this.z+(this.tall*this.size.z);
        this.hat.pos.x = this.pos.x+(this.hatoff[this.action].x*this.size.x);
        this.hat.pos.y = this.pos.y+(this.hatoff[this.action].y*this.size.y);        
    }
    Play(){
       //AUDIO.Play(1);
    }
    Update(dt){
        this.ct.Update(dt);
        var d = {
            up: false,
            down: false,
            left: false,
            right: false,
            d:0
        };
        if(this.target){
            d = GOUtil.Dir(this.target.pos,this.pos);

            if(!this.found && this.type==1 && (d.d < 8*32)) {
                this.found=1;
                GAME.Score(100, this.pos.Clone().AddXY(0,-32));//collect sheep
            }
            this.follow = (d.d < 8*32);
            if(d.d > 15*32 && d.d < 24*32)
            {
                if(this.type!=7 && !this.ct.enabled && !this.activated && Util.OneIn(320))
                {
                    GAME.CallOut(this.pos, Util.OneOf(this.call));
                    this.ct.Set(2);
                }
            }

            if(this.type==2){
                if(!this.activated && d.d<11*32){
                    this.Point(d);
                }   
                
                if(!this.activated && d.d < 3*32){
                    this.activated = 1;
                    this.action = 1;//C.DIR.DOWN;
                    GAME.Score(this.level<0?0:50, this.pos.Clone().AddXY(0,-32));//speak to nob
                    GAME.NextLvl(this.level, this.pos, this.name);
                } 
            }
            else if(this.type!=8)
            {
                var m = this.type==1?8:999;
                var m2 = this.type==1?11:999;

                if(d.d <4*32 || d.d > m*32){
                    if(d.d >m*32 && d.d<m2*32){
                        this.Point(d);
                    }
                    if(this.type==7)this.action = 1;//C.DIR.DOWN;
                    d = {
                        up: false,
                        down: false,
                        left: false,
                        right: false,
                        d:0
                    }
                } 
            }
   
        }

        if(this.type==1 || this.type==7|| this.type==8){
            if(this.fall){
                this.z-=(148*dt);
                if(this.z<=0){
                    this.fall = 0;
                }
            }
            else{
                super.Moves(dt, d);
                //this.action = 0;
            }           
        }
        if(this.accel > this.speed){
            this.speed+=(8*dt);
        }
        super.Update(dt);
    
        if(this.type==1){
            this.HatUpdate();
            this.hat.Update(dt);
        }
    }
    Collider(perp){
        if(this.type==1 && GAME.M == 1  && perp.type==8){//SHEEP vs TRANY
            GAME.Hat(this.hat);
            this.enabled = false;
            AUDIO.Play(1);
        }
    }
    Render(x,y){
        if(this.enabled){
            super.Render(x, y);
        }
        if(this.type==1){
            this.hat.Render(x, y);
        }
    }
}

//something with or without a velocity then dies or not
//just like real life
class Grunt extends GameObjectBase {
    
    constructor(pos, bdy, type, sz, v, pi,st)
    {
        super(pos, type);
        this.speed=100;

        this.shadow=type == 3? assetstilew:0;
        this.damping=0.85;
        this.body = bdy; 
        this.size = sz;
        this.action = 0;
        this.V = v;
        this.zV = 40;
        this.pi = pi;
        this.static = st;
        this.found = 1;
        this.follow = 1;
    }

    Collider(perp){
        if(this.type==6 && perp.type==1){//PLANT - SHEEP
            GAME.plots[this.pi].a=0;
            this.enabled = 0;//C.ASSETS.SHEEP            
        }
    }

    Update(dt){

        if(this.zV!=0){
            this.z += this.zV*dt;

            this.zV-=480*dt;
            if(this.z<0){
                this.zV = 0;
                this.V = null;
                this.enabled = 0;
            }
        }

        if(this.V){
            this.pos.AddXY(this.V.x*dt, this.V.y*dt);
        }        
    }
}

