class Vector2 
{
    constructor(x=0, y=0) { this.x = x; this.y = y; }    
    Clone(s=1)            { return (new Vector2(this.x, this.y)).Multiply(s); }
    CloneAdd(v)           { return (new Vector2(this.x, this.y)).Add(new Vector2(v.x, v.y)); }
	Add(v)                { (v instanceof Vector2)? (this.x += v.x, this.y += v.y) : (this.x += v, this.y += v); return this;  }
	Subtract(v)           { (this.x -= v.x, this.y -= v.y) ; return this;  }
	Multiply(v)           { (v instanceof Vector2)? (this.x *= v.x, this.y *= v.y) : (this.x *= v, this.y *= v); return this;  }
	Set(x, y)             { this.x = x; this.y = y; return this;  }
    AddXY(x, y)           { this.x += x; this.y += y; return this;  }
    Normalize(scale=1)    { let l = this.Length();  return l > 0 ? this.Multiply(scale/l) : this.Set(scale,0);  }
     rotate (center, angle, x = this.x - center.x, y = this.y - center.y) {
        this.Set(x * Math.cos(angle) - y * Math.sin(angle) + center.x, x * Math.sin(angle) + y * Math.cos(angle) + center.y);
    }
    Length()              { return Math.hypot(this.x, this.y ); }
    Distance(v)           { return Math.hypot(this.x - v.x, this.y - v.y ); }
}

class Anim{
    constructor(r, m ){
        this.rt = r;
        this.max = m;
        this.ct = 0;
    }

    Next(fr, del){
        if(++this.ct == this.rt){
            this.ct = 0;
            if(del){
                del();
            }
            if(++fr==this.max)
            {
                return 0;
            }
        }
        return fr;
    }
}

class Timer{
    constructor(t){
        this.st = t;
        this.tm = t;
        this.enabled = t>0;
    }

    get Start(){
        return this.st;
    }

    get Value(){
        return this.tm;
    }

    Set(t){
        this.tm = t;
        this.enabled = t>0;
    }
    Update(dt){
        var r = false;
        if(this.enabled){
            this.tm -= dt;

            if(this.tm <= 0)
            {
                this.tm = 0;
                this.enabled = false;
                r = true;
            }
        }
        return r;
    }
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
    Sub(c) { this.r-=c.r;this.g-=c.g;this.b-=c.b;this.a-=c.a; return this; }
    Lerp(c,p)  { return c.Clone().Sub(c.Clone().Sub(this).Clone(1-p)); }
    RGBA() { return 'rgba('+this.r+','+this.g+','+this.b+','+this.a+')';
    }
}

class RigidShape{

    constructor(C, mass, F, R, T, B, W, H)
    {        
        this.T = T; // 0 circle / 1 rectangle
        this.C = C; // center
        this.F = F; // friction
        this.R = R; // restitution (bouncing)
        this.M = mass ? 1 / mass : 0; // inverseMass (0 if immobile)
        this.V = new Vector2(0, 0); // velocity (speed)
        this.A = mass ? PHYSICS.mGravity : new Vector2(0, 0); // acceleration
        this.G = 0; // angle
        this.v = 0; // angle velocity
        this.a = 0; // angle acceleration
        this.B = B; // (bounds) radius
        this.W = W; // width
        this.H = H; // height
        this.I = T // inertia
                ? (Math.hypot(W, H) / 2, mass > 0 ? 1 / (mass * (W ** 2 + H ** 2) / 12) : 0) // rectangle
                : (mass > 0 ? (mass * B ** 2) / 12 : 0); // circle
        this.N = []; // face normals array (rectangles)
        this.X = [ // Vertex: 0: TopLeft, 1: TopRight, 2: BottomRight, 3: BottomLeft (rectangles)
                new Vector2(C.x - W / 2, C.y - H / 2),
                new Vector2(C.x + W / 2, C.y - H / 2),
                new Vector2(C.x + W / 2, C.y + H / 2),
                new Vector2(C.x - W / 2, C.y + H / 2)
                ];
        PHYSICS.computeRectNormals(this);
    }
}

class GameObject extends RigidShape{

    constructor(C, mass, F, R, T, B, W, H)
    {        
        super(C, mass, F, R, T, B, W, H);

        this.frame = 0; 
        this.enabled = 1;    
        this.size = 1;
        this.type;
        this.hits = null;
        this.dmgIgnore = [];
        this.ignore = [];
        this.isStatic = 0;
        this.spriteId;
        this.body;
        this.damage = 0;
        this.breakPoint = 0;
        this.collidedWith = [];
        this.invincible = 0;
        this.particle = null;
    }

    Update(dt, ci)
    {   
        if(!this.isStatic && (this.C.y > MAP.mapSize.y || GAME.IsLeftBehind(this.C.x))){
            this.enabled = 0;
        }
        if(!this.invincible && this.damage > 0 && ci.length != 0){ 
            for (var i = 0; i < ci.length; i++) {
                var perp = ci[i].P1 != this ? ci[i].P1 : ci[i].P2;
                var cx = ci[i].C;
                if(this.dmgIgnore.indexOf(perp.type) == -1 && 
                    this.collidedWith.indexOf(perp) == -1){
                    this.collidedWith.push(perp);
                    if(cx.I>3){
                        this.damage -= cx.I;                        
                        if(this.damage <= 0){
                            AUDIO.Play(2);
                            this.enabled = 0;
                            if(this.particle){
                                GAME.ParticleGen(this.C.Clone(), this.particle);
                            }
                        }
                        else{
                            AUDIO.Play(1);
                        }
                    }
                } 
            }
        }        
    }

    Legs(x, y){
        var rk = SPRITES.Get('l', this.altF);
        var pt = this.C.CloneAdd({x:0,y:10});
        pt.rotate(this.C, this.G);
        GFX.Sprite(pt.x-x, pt.y-y, rk, this.size, this.G);
    }

    get Body() {
        return SPRITES.Get(this.body, this.frame);
    }

    Render(x, y)
    {
        GFX.Sprite(this.C.x-x, this.C.y-y, this.Body, this.size, this.G);
    }
}


class StaticBody extends GameObject{

    constructor(tiles, type, center, width, height, mass, friction, restitution, dmg)
    {        
        super(center, mass, friction, restitution, 1, Math.hypot(width, height)/2, width, height);
        this.enabled = 1;
        this.type = type;

        this.dmgIgnore = [7];
        this.deadly = 0;
        this.isStatic = 1;
        this.damage = dmg||0;
        
        this.tiles = tiles;
    }

    Update(dt, ci)
    {
        super.Update(dt, ci);

        if(!this.enabled){       
            MAP.Tile(this.tiles);
            GAME.PlatformBreak(this.tiles);
        }
    }

    Render(x,y)
    {
        //super.Render(x, y);
    }
}

class Circle extends GameObject{

    constructor(type, sprId, center, radius, mass, friction, restitution, dmg, pt)
    {        
        super(center, mass, friction, restitution, 0 ,radius);
        this.enabled = 1;
        this.type = type;

        this.ignore = [5];
        this.spriteId = sprId;
        this.body = GAMEOBJ.find(o=>o.id == sprId).src;
        this.damage = dmg;
        this.breakPoint = this.damage /2;
        this.particle = pt;
    }

    Update(dt, ci)
    {   
        if(this.damage < this.breakPoint){
            this.frame=1;
        }
        super.Update(dt, ci);
    }

    Render(x,y)
    {
        super.Render(x, y);
    }
}

class Rectangle extends GameObject{

    constructor(type, sprId, center, width, height, mass, friction, restitution, dmg, pt)
    {        
        super(center, mass, friction, restitution, 1, Math.hypot(width, height)/2, width, height);
        this.enabled = 1;       
        this.type = type;

        this.ignore = [5];
        this.spriteId = sprId;
        this.body = GAMEOBJ.find(o=>o.id == sprId).src;
        this.damage = dmg;
        this.breakPoint = this.damage /2;
        this.particle = pt;
    }

    Update(dt, ci)
    {
        if(this.damage < this.breakPoint){
            this.frame=1;
        }
        super.Update(dt, ci);

        if(!this.enabled){
            if(this.spriteId == 30){
                var p = new BadGuy(this.C.Clone(), Util.OneOf([20,31]), 10);
                GAME.gameObjects.Add(p);
                p.Set(50);
                p.V.y = -(8*dt);
                p.V.x = this.V.x;
            }
            else if(this.spriteId == 27){ //collectable
                var s = 0;

                if(s==0){ //shots
                    if(GAME.help.c == null){
                        GAME.help.c = new Timer(4);
                    }
                    for (var i = 0; i < 3; i++) {
                        var p =new PickUp(this.C.CloneAdd(new Vector2(Util.RndI(-8,8), Util.RndI(-8,8))), 
                                            28, 12);
                        p.V = new Vector2(this.V.x, -Util.Rnd(24));
                        GAME.gameObjects.Add(p);
                    }
                }
            }
        }
    }

    Render(x,y)
    {
        super.Render(x, y);
    }
}

class Player extends GameObject{

    constructor(input, center)
    {        
        var b = GAMEOBJ.find(o=>o.id == 3);

        super(center, b.d, b.f, b.r, 1, Math.hypot(b.w, b.h)/2, b.w, b.h);
        this.type = 7;
        this.spriteId = b.id;

        this.body = b.src;
        this.dmgIgnore = [9, 12, 13];

        this.damage = 0;  
        this.hatDmg =         
        this.ignore = [8];
        this.input = input;
        this.anim = new Anim(16, 2);     
        this.shots = 0;  
        this.hat = 0; 
        this.hats = [
            0,
            {y:-6, s:SPRITES.Get('h', 0)},
            {y:-16, s:SPRITES.Get('k', 0)}
        ];
        this.altF = 0;
    }

    Update(dt, ci)
    {  
        super.Update(dt, ci);

        if(ci.length > 0){
            for (var i = 0; i < ci.length; i++) {
                var perp = ci[i].P1 != this ? ci[i].P1 : ci[i].P2;
                if(perp.enabled && perp.type == 12){
                    this.collidedWith.push(perp);
                    perp.enabled = 0;
                    this.shots+=1;
                }
                else if(perp.enabled && (perp.type == 13 || perp.type == 14)){
                    this.collidedWith.push(perp);
                    perp.enabled = 0;
                    this.hat = perp.type == 13 ? 2 :1;
                    this.damage = Util.Clamp(this.damage+100, 300,500);
                    AUDIO.Play(3);
                }
                
            }
            if(this.input.Left() || this.input.Right()){
                GAME.help.mv = 0;
                if(this.input.Left()){
                    this.V.x -=2;
                }
                else{
                    this.V.x +=2;
                } 

                this.altF = this.anim.Next(this.altF, () =>{
                    AUDIO.Play(0);
                });                
            }

            this.V.x *=0.9;

            if(this.input.Up()){
                GAME.help.up = 0;
                this.V.y -=28;
            }
        }

        if(this.shots > 0 && this.input.Fire1()){
            this.shots --;
            GAME.help.f = 0;
            GAME.AddObject(15, 8, this.C.Clone(), 
                    new Vector2(32,-40));
        }

        if(ci.length != 0){
             this.G = 0;    
        }

        if(this.hat && this.damage <= 250){            
            GAME.AddObject(26, 8, this.C.Clone().AddXY(0, this.hats[this.hat].y), 
                            new Vector2(Util.RndI(-16,16),-32));
            this.hat = 0;
        }
    }
    Render(x,y)
    {
        super.Render(x,y);

        this.Legs(x,y);

        if(this.hat){
            var pt = this.C.CloneAdd({x:0,y:this.hats[this.hat].y});
            pt.rotate(this.C, this.G);
            GFX.Sprite(pt.x-x, pt.y-y, this.hats[this.hat].s, this.size, this.G);
        }
    }
}

class BadGuy extends GameObject{

    constructor(center, id, type)
    {        
        var b = GAMEOBJ.find(o=>o.id == id);

        super(center, b.d, b.f, b.r, 1, Math.hypot(b.w, b.h)/2, b.w, b.h);
        this.type = type;
        this.extra = this.type == 11;
        this.dmgIgnore = [9];
        
        this.spriteId = b.id;
        this.body = b.src;
        this.damage = 0;
        this.max = 0;
        this.anim = new Anim(16, 2);
        this.throw = 0;
        this.skill = 1;
        this.rates = [100,80,60];

        this.hat = this.extra ? 1 : Util.OneOf([2,3]);
        this.hats = [
            {},
            {y:-50,s:SPRITES.Get('k', 0)},
            {y:-6, s:SPRITES.Get('h2', 0),i:32},
            {y:-16, s:SPRITES.Get('h3', 0),i:33}
        ];
        this.dead = 0;
        this.jmpDelay = 80;
        this.hatP = null;
        this.face = 0;
        this.altF = 0;
    }

    Set(d, s){
        this.damage = d;
        this.max = d;
        this.enabled = 1;
        this.skill = s||1;
    }
    Update(dt, ci)
    {  
        super.Update(dt, ci);

        if(!this.dead){

            if(!this.enabled){

                this.dead = 1;
                this.enabled = 1;
                this.throw = 0;

                if(this.hat)
                {
                    var h = this.hats[this.hat];
                    if(this.hat ==1){
                        AUDIO.Play(4); 
                        this.hatP =new PickUp(this.C.Clone().AddXY(0, -48), 29, 13);
                        this.hatP.V = new Vector2(this.V.x, -Util.Rnd(24));
                        GAME.gameObjects.Add(this.hatP);                                               
                    } 
                    else{
                        GAME.AddObject(h.i, 8, this.C.Clone().AddXY(0, h.y), 
                            new Vector2(Util.RndI(-16,16),-32));
                    }
                    this.hat = 0;
                }
                this.face = 1;
            }

            if(ci.length > 0){
                if(this.type == 11){
                    var pd = GAME.plr.C.Distance(this.C);
                    if(this.C.x < GAME.plr.C.x || pd < 64){
                        if(GAME.plr.C.x < this.C.x){
                            this.V.x -=1.1;
                        }
                        else{
                            this.V.x +=1.1;
                        }

                        if(GAME.plr.C.y < (this.C.y-8) && Util.OneIn(80)){
                            this.V.y -=16;
                        }
                    }
                    else{
                        if(this.throw == 0){
                            if(Util.OneIn(this.rates[this.skill])){
                                this.throw = 1;
                            }
                        }
                        if(this.throw == 1 && Util.OneIn(this.rates[this.skill])){
                            this.throw = 0;
                            var s = Util.Remap(0,300, 2,24, pd);
                            var d = GAME.Launch(this.C.Clone().AddXY(4,-40), 
                                    new Vector2(-s,-40), 13);

                            d.ignore.push(11);
                        }
                    }
                }
                else{
                    if(GAME.plr.C.x < this.C.x){
                        this.V.x -=1.5;
                    }
                    else{
                        this.V.x +=1.5;
                    }

                    if(GAME.plr.C.y < (this.C.y-8) && Util.OneIn(80)){
                        this.V.y -=32;
                    }
                }

                this.altF = this.anim.Next(this.altF);

                this.V.x *=0.9;
            }

            if(ci.length != 0){
                this.G = 0;    
            } 
        }
        else{
            this.damage = 0;
        }
    }

    Render(x,y)
    {
        super.Render(x,y);

        if(this.type != 11)
        {
            this.Legs(x,y);
        }

        if(this.hat){
            var h = this.hats[this.hat];
            var pt = this.C.CloneAdd({x:0,y:h.y});
            pt.rotate(this.C, this.G);
            GFX.Sprite(pt.x-x, pt.y-y, h.s, 1, this.G);
        }

        if(this.extra){
            var am = SPRITES.Get('f', this.face);
            var pt = this.C.CloneAdd({x:0,y:-20});
            pt.rotate(this.C, this.G);
            GFX.Sprite(pt.x-x, pt.y-y, am, this.size, this.G); 

            if(this.throw==1){
                var rk = SPRITES.Get('tf', 0);
                var pt = this.C.CloneAdd({x:4,y:-40});
                GFX.Sprite(pt.x-x, pt.y-y, rk, this.size, this.G);
            }

            am = SPRITES.Get('r', 0);
            pt = this.C.CloneAdd(this.throw?{x:8,y:0}:{x:0,y:10});
            GFX.Sprite(pt.x-x, pt.y-y, am, this.size, this.throw ? this.G : this.G-1.3); 
        }
    }
}

class PickUp extends GameObject{

    constructor(center, id, type)
    {        
        var b = GAMEOBJ.find(o=>o.id == id);
        var t = b.t == 3;
        var r = t ? Math.hypot(b.w, b.h)/2 : b.w;
        super(center, b.d, b.f, b.r, t ,r, b.w, b.h);

        this.type = type;
        this.dmgIgnore = [9];
        this.spriteId = b.id;
        this.body = b.src;
        this.damage = 0;
        this.enabled = 1;
    }

    Update(dt, ci)
    {   
        super.Update(dt, ci);
    }

    Render(x,y)
    {
        super.Render(x,y);
    }
}


class Shot extends GameObject{

    constructor(id, type, center)
    {        
        var b = GAMEOBJ.find(o=>o.id == id);
        var t = b.t == 3;
        var r = t ? Math.hypot(b.w, b.h)/2 : b.w;
        super(center, b.d, b.f, b.r, t ,r, b.w, b.h);

        this.damage = b.dm;
        this.particle = b.p;
        this.type = type;
        this.spriteId = id;
        this.body = b.src;
    }

    Update(dt, ci)
    {   
        super.Update(dt, ci);
    }

    Render(x,y)
    {
        super.Render(x,y);
    }
}

class Chaser {

    constructor(start, stop, speed, rate)
    {        
        this.pos = new Vector2(start,0);
        this.timer = new Timer(rate);
        this.rate = rate;
        this.stop = stop;
        this.enabled = 1;
        this.type = 0;
        this.speed = speed || 60;   
        this.badChance = 5;     
    }

    Update(dt)
    {   
      
            if(this.pos.x < this.stop){
                this.pos.x += this.speed*dt;
            }

            this.timer.Update(dt);

            var p = MAP.Pos;
            if(!this.timer.enabled){
                var id = Util.OneOf([4,5,6,13,14,27]);
                var x = Util.RndI(p.m-50, p.m+50);
                var v = Util.RndI(-32, 32);
                if(!GAME.boss && Util.OneIn(this.badChance)){
                    id = 30;
                    x = p.r+300;
                    v = 0;
                }
                else if (!GAME.plr.shots){
                    id = Util.OneIn(3) ? 27 :id;
                }

                if(GAME.help.ln){
                    GAME.help.ln--;
                    id = GAME.help.ln ? Util.OneOf([4,5,6]) : 27;
                    x = Util.RndI(p.m-10, p.m+10);
                    v = Util.RndI(-2, 2);
                }

                GAME.Launch(
                    new Vector2(x, 0), 
                    new Vector2(v, 0), id);

                this.timer.Set(this.rate);
            }
    }

    Render(x,y)
    {
    }
}

class Particle{

    constructor(pos){
        this.dir;
        this.op = 1;
        this.size = 1;
        this.enabled = 1;
        this.velocity = new Vector2();
        this.damping = 0.8;
        this.speed = 0;
        this.body;
        this.rgb;
        this.bRgb;
        this.motion = 0;
        this.rot = 0
        this.rots = Util.Rnd(0.1)-0.05;
    }

    Body(){
        return this.body[this.motion];
    }

    Update(dt){
        if(this.enabled){
            var acc = this.dir.Clone().Normalize(dt).Multiply(this.speed);
            this.velocity.Add(acc);
            if(this.op>0){
                this.op-=0.01;
                this.rgb.a = this.op;
                this.col = [this.rgb.RGBA()];
                this.bRgb.a = this.op;
                this.bcol = [this.bRgb.RGBA()];
                if(this.op<=0){
                    this.enabled = 0;
                }             
            }
        
            this.pos.Add(this.velocity);

            // apply physics
            this.velocity.Multiply(this.damping);
            this.rot += this.rots;
        }
    }

    Render(x,y){
        if(this.enabled){
            GFX.SpritePoly(this.pos.x-x, this.pos.y-y, 
                this.Body(), this.col, this.size, this.rot, this.bcol);
        }
    }
}