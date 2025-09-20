//'fear or avoidance of the number 13'

class Game{

    constructor(mob)
    {
        this.plays = 0;
        this.yval=0;
        this.mob = mob;
        this.btn = mob?"[BTN]":"[SPACE]";
        this.plrPos;
        this.bonuspt=2;
        this.bonusp=0;
        this.bonusn=0;
        this.score = 0;
        this.pause = 0;
        this.music = 1;
        this.M;//gameMode
        this.O = new ObjectPool(); 
        this.calls = [];
        this.mapId = 0;

        this.creds = Factory.Credits();
        this.introText = [
            {y:-200, timer:new Timer(0.6), text:new TextSprite("GET THE FLOCK", 4, 1, "#ff0")},
            {y:-126,timer:new Timer(0.8), text:new TextSprite("OUTTA", 6, 1, "#ff0")},
            {y:-40,timer:new Timer(1), text:new TextSprite("HERE", 6, 1, "#ff0")}
        ];

        this.titlebgc=0;
        this.titlebg=new Color("#000",1);
        this.titlesct = 0;

        this.plrselect = 0;
        this.plots = [];//lvl2 data
        this.bg = 0;      
        this.lvlTm = 0;
        this.Start(0, 0);//C.MODE.TITLE
    }

    BG(f, t, c){
        var cc = new Color("#000",f).Lerp(new Color("#000",t), c).RGBA();
        SFX.Box(0,0, 800, 608 ,cc);
    }
    ReGen(){
        this.plots = [];
        for (let i = 0; i < DEF.maps.length; i++) {
            var mdt = this.MapGen(DEF.maps[i]);
            DEF.maps[i].data = mdt;  
            DEF.maps[i].obj = this.FixedAssets(DEF.maps[i]);            
        }
    }

    MapGen(mapDef){        
        var data = [];
        var trow = [];
        
        var rows = mapDef.world[1];
        var o = mapDef.world[2];
        var cols= mapDef.world[0];	
        var d = (cols-o)*rows;
        for (let c = 0; c < cols; c++) {	
            trow[c] = 1;
        }
    
        data.push(trow);
    
        for (let r = 0; r < rows-2; r++) {	
            var row = [];
    
            for (var c=0; c < cols; c++) {			
                row[c] = c==o || c==cols-1 ? 1 : 0;
            }
    
            data.push(row);
        }
        data.push(trow);
        

        var dd = d<1500?10:60;
            for (let i = 0; i < dd; i++) {	
                var f = [
                    [0,0,7,7,7,7,0,0],
                    [0,7,7,7,7,7,7,0],
                    [7,7,8,8,7,7,7,7],
                    [7,7,8,8,7,7,7,7],
                    [0,7,7,7,7,7,7,0],
                    [0,0,7,7,7,7,0,0]
                    ];

                var ylength = ((f.length)/2)|0;
                var xlength = ((f[0].length)/2)|0;

                this.Feature(data, f, Util.RndI(o+1+xlength, cols-xlength), Util.RndI(1+ylength, rows-ylength),Util.RndI(1,3),Util.RndI(1,3));
            }
        //}


        for (let i = 0; i < mapDef.tr[0]; i++) {	
            var x = Util.RndI(o+1,cols);		
            var y = Util.RndI(1,rows-1);
            var t = Util.OneOf(mapDef.tr[1]);
            if(t==2 && (data[y][x-1] == 2 || data[y+1][x] == 2)) t = 5;
            if(t==3 && (data[y][x-1] == 3 || data[y+1][x] == 3)) t = 6;
            data[y][x]=t;
        }
    
        for (let i = 0; i < mapDef.fr; i++) {	
            var f = Util.OneOf(rfeature);
            var hh = (f.length/2)|0;
            var hl = (f[0].length/2)|0;

            this.Feature(data, f, Util.RndI(o+1+hl, cols-hl), Util.RndI(1+hh, rows-hh));
        }
    
        //player base
        if(mapDef.start){
            this.Feature(data, sfeature[mapDef.start.v?0:5], mapDef.start.x, mapDef.start.y);
            if(mapDef.start.v==2){
                this.Feature(data, sfeature[0], mapDef.start.x, mapDef.start.y-4);
                this.Feature(data, sfeature[0], mapDef.start.x, mapDef.start.y-7);
            }
        }
            //sheep base
        if(mapDef.end){
            if(mapDef.end.x){
                this.Feature(data, sfeature[mapDef.end.t], mapDef.end.x, mapDef.end.y);            
            }
        }

        if(mapDef.plt){
            let ix = 0;
            var n = mapDef.plt[0];
            var s = mapDef.plt[1];
            for (var i = 2; i < mapDef.plt.length; i++) {	
                for (var p=0; p < n; p++) {
                    var t = {p:new Vector2(((mapDef.world[2]+s+(p*s))*32)+16, (mapDef.plt[i]*32)+16), a:0, i:ix++};
                    this.Feature(data, sfeature[3], mapDef.world[2]+s+(p*s), mapDef.plt[i]);
                    this.plots.push(t);
                }
            }
        }

        if(mapDef.shp){
            for (let i = 0; i < mapDef.shp.length; i++) {
                this.Feature(data, sfeature[mapDef.shp[i].t||2], mapDef.shp[i].x, mapDef.shp[i].y);
            }
        }
        return data;
    }

    FixedAssets(map){
        var col = map.world[0];
        var row = map.world[1];
        var obj = [];  
        //add trees
        for(var r = 0; r < row; r++) 
        {
            for(var c = 0; c < col; c++) 
            {
                var p = map.data[r][c];                
                if(p==4){
                    var sz = Util.Rnd(1)+0.8;
                    obj.push(
                        new Grunt(new Vector2((c*32)+16, (r*32)+16),
                        [[{src:Util.OneOf([assetstree1,assetstree2]), col:6}]],//C.col.tree
                        3,{x:sz,y:sz,z:sz},0,0));
                }
            }
        }

        if(map.plt){

            for (var i=0; i < this.plots.length; i++) {
                if(Util.OneIn(5)){
                    this.plots[i].a=1;
                    obj.push(    
                        new Grunt(this.plots[i].p,
                            [[{src:assetstree2, col:12}]],//C.col.tree
                            6, {x:0.5,y:0.5,z:0.5},0,this.plots[i].i, 1
                        ));                       
                }
             
            }
        }

        if(map.shp){
            for (let i = 0; i < map.shp.length; i++) {
                var s = this.Sheep(map.shp[i].x, map.shp[i].y, SheepActors[SINDEX++]);
                if(map.shp[i].s)s.speed = map.shp[i].s;
                obj.push(s);
            }
        }

        if(map.ppl)
        {
            var r = (row/map.gr[1]);
            for (let i = 0; i < map.ppl.length; i++) {
                var p;
                if(map.ppl[i].p){
                    p = new Vector2(map.ppl[i].p.x, map.ppl[i].p.y).Add(0.5).Multiply(32); 
                }
                else{
                    do{
                        var x = Util.RndI(2, col-map.world[2]-2);
                        var y = ((map.ppl[i].r*r)+(r/2))|0;
                        var m = map.data[y][x+map.world[2]];
                    }while (m!=0);
                    p = new Vector2(map.world[2]+x, y).Add(0.5).Multiply(32);                    
                }

                var d = Actors[map.ppl[i].act];
                
                obj.push(
                    new Gunt(p, 2, d, Factory.Man(d.c, d.d), map.ppl[i].lvl)//C.ASSETS.PPL
                );
            }
        }

        if(map.simp)
        {
            for (let i = 0; i < map.simp.length; i++) {
                var p = new Vector2(map.simp[i].x, map.simp[i].y).Add(0.5).Multiply(32);

                var d = Supporting[i];
                d.c[2] = Util.RndI(0,3);
                var t = new Gunt(p, 7, d, Factory.Man(d.c, d.d), 0)//C.ASSETS.THIEF;
                t.target = {pos:new Vector2((map.end.x+6)*32, map.end.y*32)};
                obj.push(t);
            }
        }

        if(map.rsimp)
        {
            var x = -(map.rsimp/3)|0;

            for (let i = 0; i < map.rsimp; i++) {
                var y = (i%2)+1;
                x += (i%2)*1.3;
                var p = new Vector2(
                            map.start.x-x, 
                            map.start.y-y-8)
                            .Add(0.5).Multiply(32);

                obj.push(this.Trany(p, {pos:new Vector2((map.end.x)*32, map.end.y*32)}, 60,90));
            }
        }

        if(map.rshp){
            var gps=[];
            var c = col-map.world[2];
            for (var i = 0; i < map.rshp; i++) {
                do{
                    //??? other sheep
                    //var g = map.gr;
                    var x = Util.RndI(2, c-2);
                    var y = Util.RndI(2, row-20);
                    var gx = x/(c/map.gr[0])|0;
                    var gy = y/(row/map.gr[1])|0;
                    var m = map.data[y][x+map.world[2]];
                    var b = gps.filter(f=>f.x == gx && f.y == gy).length;
                }while (m!=0 || b>0);

                var s = this.Sheep(map.world[2]+x, y, SheepActors[SINDEX++]);

                obj.push(s);
                gps.push({x:gx,y:gy});
            }
        }
        return obj;
    }

    MapAssets(map, rp){
        var obj = [];  

        if(map.start){
            var p = rp ? rp 
                    : new Vector2(map.start.x, map.start.y).Add(0.5).Multiply(32);

            this.player = new Player(p, Actors[this.plrselect]);
            obj.push(this.player);
        }

        return obj;
    }

    Init(map, id, r, tx){
        this.introEvent = 0;
        this.introEvents = [];
        if(map.start){
            if(r){
                this.introEvents = tx;
            }else{
                if(id==2){
                    var p = Util.OneOf(this.plots.filter(l => !l.a));
                    var t = Util.OneOf(this.plots.filter(l => l.a));
                    this.introEvents = [
                        {t:4, p: new Vector2(map.start.x*32, map.start.y*32), tx:"'THE SHEEP CRISIS'",s:7,c:5,x:100},
                        {t:3, p: p.p, tx:'PLANT FLOWERS '+this.btn},
                        {t:3, p: t.p, tx:'KEEP SHEEP AWAY'},
                        {t:3, p: new Vector2(map.start.x*32, map.start.y*32), tx:'SAVE THE PLANET!',s:6}
                    ];
                }                
                if(id==3){
                    this.introEvents = [
                        {t:4, p: new Vector2(map.start.x*32, map.start.y*32), tx:"'A PAIR OF NICKERS'",s:7,c:5,x:100},
                        {t:3, p: new Vector2((map.start.x+12)*32, map.start.y*32), tx:'STOP THE THIEVES'},
                        {t:3, p: new Vector2(map.end.x*32, map.end.y*32), tx:'BEFORE THEY GET AWAY'},
                        {t:3, p: new Vector2(map.start.x*32, map.start.y*32), tx:'GO GETTEM',s:6}
                    ];
                }
                if(id==4){
                    this.introEvents = [
                        {t:4, p: new Vector2(map.start.x*32, (map.start.y*32)-80), tx:"'RUN '"+this.player.name+"' RUN'",s:7,c:5,x:100},
                        {t:3, p: new Vector2(map.end.x*32, (map.end.y*32)-80), tx:'GET HOME'},
                        {t:3, p: new Vector2(map.start.x*32, (map.start.y*32)-80), tx:'RUN FOR YOUR LIFE!',s:5,x:100}
                    ];
                }
            }

            if(this.introEvents.length){
                this.gameTimer = new Timer(this.introEvents[this.introEvent].t);
            }
        }
        this.yval=0;
    }
    
    Feature(d, f, x, y,sx=1,sy=1){
        y -= ((f.length)/2)|0;
        x -= ((f[0].length)/2)|0;
        var rp = 0;
        var cp=0;
        for (let r = 0; r < f.length; r+=sy) {
            for (let c = 0; c < f[r|0].length; c+=sx) {
                d[y+rp][x+cp]=f[r|0][c|0];
                cp++;
            }
            rp++;
            cp=0;
        }
    }

    
    Zoom(t,p,l){
        if(t){
            MAP.Zoom(0.002,p,l);
        }
        else if(MAP.scale > 0.7){
            MAP.Zoom(-0.002,p,l);
        } 
    }

    End(win){
        this.gameTimer = new Timer(6);
        if(win){
            if(this.mapId==1){
                this.M = 3;//C.MODE.WIN;
                this.bg=0;   
                var sp = this.O.Get([1]).filter(f=>f.follow);
                sp.forEach((n, i) => {
                    this.Score(200, n.pos);
                });
            }
            else{
                this.NextLvl(1);
            }
        }
        else{
            this.M = 5;//C.MODE.LOSE;
            this.bg=0;
        } 

    }

    NextLvl(l, p, n){
        if(n){
            this.bonusn = n;
        } else {
            if(this.mapId==3){
                this.bonusn = Supporting[0].n;
            }
            if(this.mapId==4){
                this.bonusn = '';
            }
        }
        if(p)this.bonusp = p.Clone();
        this.pending = l;
        this.gameTimer = new Timer(1.3); 
        this.M = 7;//C.MODE.SIMP;
        this.bg = 0;
        if(l<0){
            this.simpTxt = converations[l+2];
            this.simpIx = 0;
        }
        else if(l==1){
            var s = this.O.Get([1]).filter(f=>f.follow).length;

            if(this.mapId==2){
                var p = this.O.Get([6]).length;                
                var b = p>11?' 2 EXTRA SHEEP':p>6?' A SHEEP':'NO SHEEP';
                this.bonuspt = p>11?2:p>6?1:0;
                this.simpTxt = [
                    {s:'WE HAVE '+p+' LOVELY FLOWERS. YOU EARNED '+b},
                    {s:'BONUS',ns:s,ex:p,v:10}];
                    this.score += (s*p*10);
            }
            if(this.mapId==3){
                if(this.lvlTm.enabled){
                    var b = this.lvlTm.time>12?'THESE':this.lvlTm.time>0?'THIS':'';
                    this.bonuspt = this.lvlTm.time>10?2:this.lvlTm.time>0?1:0;
                    this.simpTxt = [
                        {p:'CAUGHT YOU FINALLY'},
                        {s:'YOU WILL NEVER TAKE US ALIVE'},
                        {p:'TAKE THIS...'},
                        {p:'NICE BUNCH OF FLOWERS'},
                        {s:'OH THATS SO KIND'},
                        {s:'WERE SO SORRY, HERES YOUR PUMPKINS BACK'}
                    ];
                    this.simpTxt.push({s:'AND '+b+' SHEEP WE NICKED'});
                    this.simpTxt.push({s:'BONUS',ns:s,ex:0,v:100});
                    this.score += (100*s);
                }
                else{
                    this.bonuspt = 0;
                    this.simpTxt = [
                        {s:'BETTER LUCK NEXT TIME'},
                        {s:'AND THANKS FOR ALL THE PUMPKINS'}
                    ];
                }
            }
            if(this.mapId==4){
                this.bonuspt = 2;
                this.simpTxt = [
                    {s:'YOU MADE IT HOME. ENJOY 2 EXTRA SHEEP'}
                ];
                this.simpTxt.push({s:'BONUS',ns:s,ex:0,v:100});
                this.score += (100*s);
            }

            this.simpIx = 0;
        }
        else {
            this.simpTxt = converations[l];
            this.simpIx = 0;
        }
        MUSIC.Stop();
    }


    Start(l, m, r){
        if(l==0){
            this.score = 0;
            SINDEX = 0;            
            this.ReGen();
            MUSIC.Stop(1);
        }
        var bonus = this.mapId > 1 && l == 1;
        this.gameTimer = new Timer(0); 
        //remember plr pos for lvl1
        this.plrPos = l>1 && this.mapId == 1 ? this.player.pos.Clone() : this.plrPos;
        this.player = null;
        this.mapId = l;
        MAP.Set(DEF.maps[this.mapId]);
        GFX = new Render(MAP.osCanvas.ctx);	
        MAP.Init();

        var sp = [];
        if(l>1){
            var a = this.O.Get([1]);//C.ASSETS.SHEEP
            sp = a.filter(f=>f.follow);
        }
        else if(l==1){
            sp = this.O.All([1]);//C.ASSETS.SHEEP
        }

        this.O.Clear();
        var o = DEF.maps[this.mapId].obj;//add fixed assets
        var g = o.concat(this.MapAssets(DEF.maps[this.mapId], r?this.plrPos:0));
        this.O.Set(g);

        if((l>1)){
            var y = -(sp.length/3)|0;
            var v = DEF.maps[this.mapId].start.v;
            sp.forEach((n, i) => {
                var x = (i%2)+1;
                y += (i%2);

                var s = this.Sheep(DEF.maps[this.mapId].start.x-(v?y:x), 
                    DEF.maps[this.mapId].start.y-(v?x:y), {n:n.name,s:n.sz});
                s.speed = n.speed;
                this.O.Add(s);
            });
        }

        var tx = [];
        var lb = [];
        var a = this.O.Get([1,2,8]);//C.ASSETS.SHEEP, C.ASSETS.PPL,C.ASSETS.TRANY
        a.forEach(s => {
            s.target = this.player;
            if(sp.length){
                var f = sp.find((e) => e.type == 1 && e.name == s.name);//C.ASSETS.SHEEP
                if(f){
                    s.enabled = f.enabled;
                    s.follow = f.follow;
                    s.found = f.found;
                    if(l==1){
                        if(s.type == 2 && s.activated){//C.ASSETS.PPL
                            s.enabled = 0;
                        }
                        
                        if(f){
                            if(!f.enabled){
                                tx.push(f.name);
                            }
                            if(f.enabled && !f.follow){
                                lb.push(f.name);
                                s.enabled = false;
                            }
                        }
                    } 
                }               
            }

        });

        var bs = [];
        if(bonus){
            for (let i = 0; i < this.bonuspt; i++) {
                var a = SheepActors[SINDEX++];
                var s = this.Sheep(this.player.pos.x/32, this.player.pos.y/32, a);

                s.z = 100+(i*32);
                s.fall = 1;
                s.target = this.player;
                s.HatUpdate();  
                this.O.Add(s);   
                bs.push(a.n);           
            }

        }
        this.calls = [];
        
        var ttt = [];
        if(tx.length) ttt.push({t:4, p: this.bonusp, tx:tx.join()+' WAS LOST.'});
        if(lb.length) ttt.push({t:4, p: this.bonusp, tx:lb.join()+' WAS LEFT BEHIND.'});
        if(bonus && this.bonuspt){
            ttt.push({t:4, p: this.bonusp, tx:bs.join()+' WAS ADDED.'});
        }

        this.Init(DEF.maps[this.mapId], this.mapId, r, ttt);
        MAP.offset = new Vector2(0,0);
        MAP.scale = 1.1; //??
        if(this.player)MAP.ScrollTo(this.player.pos);
        this.M = m;
        this.pending = 0;

        this.lvlTm = DEF.maps[this.mapId].tme ? new Timer(DEF.maps[this.mapId].tme) : null;

    }

    Quit(){
        this.Start(0, 0);//C.MODE.TITLE
    }

    Pause(){
        if(this.M == 1){//C.MODE.GAME
            if(this.pause){
                this.pause = 0;
                this.Quit();
            }
            else{
                this.pause = !this.pause;
            }
        }
    }

    Sheep(x, y, a){
        var b = Factory.Sheep(9);//C.col.sheep
        return new Gunt(new Vector2(x, y).Add(0.5).Multiply(32), 1, a, b, 0);//C.ASSETS.SHEEP
    }

    Trany(p, t, s1, s2){
        var d ={
                s:Util.Rnd(0.3)+0.7,
                n:"",
                c:[Util.RndI(0,2),Util.RndI(0,5),Util.RndI(0,3),Util.RndI(0,4),Util.RndI(0,1),Util.RndI(0,3)],
                d:{l:1.2,f:1.1,h:1.1,b:Util.RndI(0,2),m:Util.RndI(0,4),w:Util.RndI(0,3),t:0},
                call:["GETTEM","ATTACK"]
            }

        var o = new Gunt(p, 8, d, Factory.Man(d.c, d.d), 0)//C.ASSETS.TRANY;
        o.target = t;
        o.speed = 30;
        o.accel = Util.RndI(s1, s2);
        return o;
    }
    Splash(pos){
        for(var i=0;i<16;i++){    
            var b = new Grunt(new Vector2(pos.x+Util.Rnd(16), pos.y+Util.Rnd(16)),
                        [[{src:assetsblock, col:5}]],//C.col.splash
                        5,//C.ASSETS.SPLASH,
                        {x:0.2,y:0.2,z:0.2},
                        new Vector2(Util.Rnd(64)-32, Util.Rnd(64)-32));
            b.zV = 189;        
            this.O.Add(b);
        }
    }

    Hat(g, v){  
        if(g){
            g.V = v;
            g.zV = 189;
            this.O.Add(g);            
        }
    }

    Score(s, p){
        if(this.M &&  s){
            this.score+=s;
            this.calls.push({p:Util.IsoPoint(p.x, p.y-32),
                tx:new TextSprite(s, 3, 0, "#0ff"),tm:new Timer(3)});            
        }
    }

    Plant(p, a){
        var f = this.plots.find((e) => e.a == 0 && Math.abs(p.Dist(e.p,1))<48);
        if(f){
            f.a=1;
            var g = new Grunt(new Vector2(p.x+(a==2?-16:a==3?16:0), p.y+(a==0?-16:a==1?16:0)),
                [[{src:assetstree2, col:12}]],//C.col.tree);
                6,{x:0.5,y:0.5,z:0.5},0, f.i,1);
            this.O.Add(g); 
            this.Score(10, g.pos);            
        }
    }

    CallOut(p, t){  
        var pt = Util.IsoPoint(p.x, p.y-32);
        this.calls.push({p:pt,tx:new TextSprite(t, 4, 1, "#000"),tm:new Timer(3)});
    }

    Update(dt)
    {

        //shut that infernal racket
// if(Input.IsSingle('q') ) {
//     MUSIC.Stop(1);	
//     this.plays=3;
// }

        MUSIC.Update(dt);

        this.gameTimer.Update(dt);        

        if(this.M == 7){//C.MODE.SIMP
            if(this.bg < 1){
                this.bg+=(0.3*dt);
            }
            this.Zoom(0, this.player.pos, 0.01);
            
            if(Input.Space()){
                this.simpIx++;
                if(this.simpIx==this.simpTxt.length){

                    if(this.pending==-2){
                        this.M = 2;
                        MAP.scale = 1.1; //??

                        var shp = this.O.Get([1]);//C.ASSETS.SHEEP
                        var smp = this.O.Get([2]);//C.ASSETS.PPL
                        this.introEvent = 0;
                        this.introEvents = [
                            {t:4, p: new Vector2(DEF.maps[this.mapId].start.x*32, DEF.maps[this.mapId].start.y*32), tx:"'O'SHEA'S 13'",s:7,c:5,x:180},
                            {t:3, p: new Vector2(DEF.maps[this.mapId].start.x*32, DEF.maps[this.mapId].start.y*32), tx:'GET SHEEP'},
                            {t:3, p: new Vector2(DEF.maps[this.mapId].end.x*32, DEF.maps[this.mapId].end.y*32), tx:'BRING HOME'},
                            {t:3, p: shp[3].pos, tx:'COLLECT STRAYS'},
                            {t:3, p: smp[0].pos, tx:'HELP STRANGERS'},
                            {t:3, p: new Vector2(DEF.maps[this.mapId].start.x*32, DEF.maps[this.mapId].start.y*32), tx:'GO!',s:6}
                        ];
                        this.gameTimer = new Timer(this.introEvents[this.introEvent].t);

                    }
                    else{
                        this.Start(this.pending, 2, this.pending==1); //C.MODE.GINTRO
                        this.bg = 0;                            
                    }

                }
            }                

        }
        if(this.M == 0){//C.MODE.TITLE
            for (var i = 0; i < this.introText.length; i++){
                this.introText[i].timer.Update(dt);
            }

            if(this.titlebgc < 1){
                this.titlebgc+=dt;
            }
            else{
                if(Util.OneIn(500)){
                    var b = this.O.Get([1]);
                    if(b.length && !b[0].target)b[0].target = {pos:b[0].pos.Clone().AddXY(240,0)};
                }
                if(Input.Space()){
                    if(this.titlesct){
                        this.titlesct = 0;
                        this.Start(1, 1);//C.MODE.GINTRO
                    }
                    else{
                        this.titlesct = 1;
                    }
                }
            }  

            if(this.titlesct){
                if(Input.LeftS()){
                    this.plrselect=Util.Clamp(this.plrselect-1,0,ATH);
                }
                else if(Input.RightS()){
                    this.plrselect=Util.Clamp(this.plrselect+1,0,ATH);
                }
            }

        }
        //if(this.M == C.MODE.WON || this.M == C.MODE.LOST){
        if(this.M == 4 || this.M == 6){
            if(Input.Space()){
                this.Start(0, 0);//C.MODE.TITLE
            }
            this.yval-=(dt*64);            
        }
        if(this.M == 2){//C.MODE.GINTRO
            if(this.bg < 1){
                this.bg+=(0.4*dt);
            }
            this.introEvents[this.introEvent].p;
            MAP.ScrollTo(this.introEvents[this.introEvent].p, 0.05);     

            if(!this.gameTimer.enabled){
                this.introEvent++;
                if(this.introEvent==this.introEvents.length){
                    if(this.music){
                        MUSIC.Play(this.mapId==3||this.mapId==4?.5:1, this.mapId==2 || this.mapId==3);
                    }
                    this.M = 1;//C.MODE.GAME
                    this.plays++;
                }
                else{
                    this.gameTimer = new Timer(this.introEvents[this.introEvent].t);                                        
                }
            }
            if(this.mapId==1 && this.plays>2 && Input.Space()){
                if(this.music){
                    MUSIC.Play();
                }
                this.M = 1;//C.MODE.GAME
            }
        }
        //if(this.M == C.MODE.GAME || this.M == C.MODE.TITLE || this.M == C.MODE.WIN || this.M == C.MODE.LOSE || this.M == C.MODE.SIMP){
        if(this.M == 1 || this.M == 0 || this.M == 3 || this.M == 5 || this.M == 7){ 

            if(this.pause){
                if(Input.Fire1() ) {
                    this.pause = 0;
                }
            }
            else{
                if(this.mapId==4){
                    if(Util.OneIn(480)){
                        this.O.Add(this.Trany(this.player.pos.Clone().AddXY(0, -(12*32)), 
                                this.player, 90,120));
                    }
                }
                var bodies = this.O.Get();      

                for (var i = 0; i < bodies.length; i++) {
                    bodies[i].Update(dt);
                }

                var b = this.O.Get([0,1,2,6,8]);//C.ASSETS.PLAYER, C.ASSETS.SHEEP, C.ASSETS.PPL PLANT TRANY

                GOUtil.Collisions(b);

                //callouts 
                for (var i = 0; i < this.calls.length; i++) {
                    this.calls[i].tm.Update(dt);
                }
                
                //if(this.M == C.MODE.WIN || this.M == C.MODE.LOSE)
                if(this.M == 3 || this.M == 5)
                {
                    if(this.bg < 1){
                        this.bg+=dt;
                    }
                    if(!this.gameTimer.enabled){
                        this.M++;
                    }
//??                    
this.player.action = 1;//C.DIR.DOWN;
                    this.Zoom(0, this.player.pos, 0.02);
                }
                else if (this.M == 1 ){//C.MODE.GAME
                    MAP.ScrollTo(this.player.pos, 0.02); 

                    if(!this.player.enabled){ //plr dies
                        this.End(0);
                    }
                    //win conditions
                    if(this.lvlTm){
                        if(this.lvlTm.Update(dt)){
                            this.End(1);
                        }
                    }
                    // plr reaches zone
                    if(DEF.maps[this.mapId].end && 
                        Math.abs(this.player.pos.Dist(DEF.maps[this.mapId].end,32))<64){
                        this.End(1);
                    }

                }
            }
        }
    }

    Render()
    {
        var p = MAP.PreRender();

        // if(this.M == C.MODE.GAME || this.M == C.MODE.GINTRO 
        //     || this.M == C.MODE.TITLE
        //     || this.M == C.MODE.WIN || this.M == C.MODE.LOSE
        //     || this.M == C.MODE.WON || this.M == C.MODE.LOST
        //     || this.M == C.MODE.SIMP){
        // if(this.M == 1 || this.M == 2 
        //     || this.M == 0
        //     || this.M == 3 || this.M == 5
        //     || this.M == 4 || this.M == 6
        //     || this.M == 7){
            var bodies = this.O.Get();

            bodies.sort(function(a, b){
                var p1 = Util.IsoPoint(a.pos.x, a.pos.y);
                var p2 = Util.IsoPoint(b.pos.x, b.pos.y);
                return p1.y - p2.y;
            });

            for (var i = 0; i < bodies.length; i++) {
                bodies[i].alpha = 1;
                var p1 = Util.IsoPoint(bodies[i].pos.x, bodies[i].pos.y);
                if((p1.x>MAP.Pos.l-32 && p1.x<MAP.Pos.r+32) && (p1.y>MAP.Pos.t-32 && p1.y<MAP.Pos.b+64)){
                    if(this.player && bodies[i].type == 3){//C.ASSETS.TREE
                        var xd = Math.abs(bodies[i].pos.x - this.player.pos.x);
                        var yd = bodies[i].pos.y - this.player.pos.y;
                        if((xd<96) && (yd>0 && yd<128)){
                            bodies[i].alpha = xd<32 ? 0.2 : xd<64 ? 0.4 : 0.8;
                        }
                    }

                    bodies[i].Render(p.x, p.y);
                }
            }

            //callouts 
            for (var i = 0; i < this.calls.length; i++) {
                if(this.calls[i].tm.enabled){  
                    var pt = this.calls[i].p;
                    if(pt.x<MAP.Pos.l) pt.x = MAP.Pos.l+64;
                    if(pt.x>MAP.Pos.r) pt.x = MAP.Pos.r-64;
                    if(pt.y<MAP.Pos.t) pt.y = MAP.Pos.t+48;
                    if(pt.y>MAP.Pos.b) pt.y = MAP.Pos.b-48;
                    var op = Util.Remap(this.calls[i].tm.start,0, 1, 0, this.calls[i].tm.time);
                    var y = 90-(op*90);
                    var sc = this.calls[i].tx.Size;
                    GFX.Image(this.calls[i].tx.TextImg, 
                        new Vector2(pt.x-p.x - (sc.x/2), pt.y-p.y-y), sc, 
                            {x:0,y:0}, sc, op);
                }

            }    

            MAP.PostRender();
            
            //var shp = this.O.All([1]);//C.ASSETS.SHEEP
            //if(this.M == C.MODE.GAME || this.M == C.MODE.SIMP){
            if(this.M == 1 || this.M == 3 || this.M == 4 || this.M == 5 || this.M == 6 || this.M == 7){
                
                if(this.M == 1 || this.M == 3 || this.M == 4 || this.M == 5 || this.M == 6){
                    var ob = this.mob?40:0;
                    SFX.Box(0,0, 800, 40+ob ,"rgba(0,0,0,0.6)");
                    var p = Actors[this.plrselect];
                    var b = Factory.Head(p.c, p.d);
                    SFX.Polygon(16, 30+ob, b.src, b.col, {x:.8,y:.8,z:1.6}, 0);
                    SFX.Text(this.score,440,10+ob,4,0);  
                    
                    var b = Factory.Sheep(9);//C.col.sheep
                    var g = this.mapId==1 ? {s:b[1][0].src, c:b[1][0].col} 
                                            : {s:assetstree2, c:12};

                    var shp = this.O.All([this.mapId==1?1:6]);//C.ASSETS.SHEEP or PLANT
                    var p = 48;
                    for (let i = 0; i < shp.length; i++) {
                        if(shp[i].found){
                            var sz = 0.5*shp[i].size.x;
                            SFX.Polygon(p, 30+ob, g.s, g.c, {x:sz,y:sz,z:sz}, 0);
                            if(!shp[i].enabled || !shp[i].follow){
                                SFX.Polygon(p, 30+ob, assetsx, 
                                    !shp[i].enabled ? 3 : 0, {x:sz,y:sz,z:sz}, 0);//C.col.red
                            }
                            p+=16;
                        }
                    }

                }
                if(this.lvlTm){
                    SFX.Text(this.lvlTm.time|0,640,100,this.lvlTm.time<10?8:6,1,this.lvlTm.time<10?"#f00":"#ff0");  
                }
                if(this.M == 7){//C.MODE.SIMP
                    this.BG(0, 0.6, this.bg);

                    var e = this.simpTxt[this.simpIx];
                    if(e.s){   
                        var a = Actors.find((e) => e.n == this.bonusn);
                       
                        if(!a){
                            a = Supporting.find((e) => e.n == this.bonusn);
                        }
                        if(a){
                            var h = Factory.Head(a.c, a.d);
                            SFX.Polygon(48, 132, h.src, h.col, {x:2,y:2,z:4}, 0); 
                        }           
                        if(this.bonusn){
                            SFX.Text(this.bonusn, 116,50, 4,0,'#dd0', 600);
                        }
                        if(e.ns){
                            var t=e.ns;
                            var x = 220;
                            SFX.Text(e.s, 300,200, 7,0,'#ff0', 600);

                            SFX.Text(e.ns, x,260, 6,0,'#ff0', 600);
                            x+=66;
                            var b = Factory.Sheep(9);//C.col.sheep
                            SFX.Polygon(x, 292, b[1][0].src, b[1][0].col, {x:1.2,y:1.2,z:1.2}, 0);
                            x+=40;
                            
                            if(e.ex){
                                t*=e.ex;
                                SFX.Text('X '+e.ex, x,260, 6,0,'#ff0', 600);x+=100;
       
                                SFX.Polygon(x, 292, assetstree2, 12, {x:.8,y:.8,z:.8}, 0);
                                x+=40;
                            }
                            t*=e.v;
                            SFX.Text('X '+e.v+' = '+t, x,260, 6,0,'#ff0', 600);x+=40;
                        }
                        else{
                            SFX.Text(e.s, 116,80, 5,0,'#ff0', 600);
                        }
                    }else{
                        var a = Actors[this.plrselect];
                        var h = Factory.Head(a.c, a.d);
                        SFX.Polygon(48, 132, h.src, h.col, {x:2,y:2,z:4}, 0);
                        SFX.Text(this.player.name, 116,50, 4,0,'#0dd', 700);
                        SFX.Text(e.p, 116,80, 5,0,'#0ff', 700);
                    }

                    SFX.Text(this.btn,280,560,4,0);
                }
            }

            if(this.M == 2){//C.MODE.GINTRO
                this.BG(1, 0, this.bg);

                var e = this.introEvents[this.introEvent];
                SFX.Text(e.tx, e.x?e.x:200,240, e.s|4,1,PAL[e.c|0], 720);

                if(this.mapId==1 && this.plays>2)
                {
                    SFX.Text(this.btn+" TO SKIP",280,560,4,0);
                }
            }
        //}

        //if(this.M == C.MODE.WIN || this.M == C.MODE.WON){
        if(this.M == 3 || this.M == 4){
            this.BG(0, 0.6, this.bg);
            var shp = this.O.All([1]);
            var d = shp.filter(l => !l.enabled).length;
            var l = shp.filter(l => l.enabled && !l.found).length;
            var f = shp.filter(l => l.enabled && l.follow).length;
            var  y = 200+this.yval;

            var c= PAL[5];//C.col.title
            SFX.Text(this.player.name,200,y,4,1,c); 
            SFX.Text("YOUR A REAL HERO NOW",200,y+40,4,1,c);

            SFX.Text("YOU SAVED " +f+" SHEEP",200,y+80,3,0,c); 
            SFX.Text(d+" WAS LOST",200,y+110,3,0,c); 
            if(l)SFX.Text("AND " +l+" WAS NEVER FOUND",200,y+140,3,0,c); 
            SFX.Text("SCORE "+this.score,200,y+190,6,0,c); 

            if(this.M == 4){//C.MODE.WON
                var cr= this.creds;
                for (let i = 0; i < cr.length; i++) {

                    SFX.Text(cr[i].a, 200, y+cr[i].y+(i*30),4,1,c);
                    SFX.Text(cr[i].b.replace('{p}', this.player.name), 500, y+cr[i].y+(i*30),4,1,c); 
                }
                
                SFX.Text(this.btn,280,560,4,0); 
            } 
        }
        //if(this.M == C.MODE.LOST || this.M == C.MODE.LOSE){
        if(this.M == 6 || this.M == 5){
            this.BG(0, 0.6, this.bg);
            var shp = this.O.All([1]);
            var f = shp.filter(l => l.enabled && l.follow).length;

            var t = f<4?0:f<7?1:2;
            var tx = ["SOME HERO YOU ARE!|TRY AGAIN BUT BETTER.",
            "YOU HAVE LOST THE TRUST|OF OUR SHEEP.",
            "TRY AGAIN {p}|THE SHEEP NEED YOU."
            ];

            SFX.Text(tx[t].replace('{p}', this.player.name),200, 230,4,1,PAL[5]);//C.col.title

            if(this.M == 6){//C.MODE.LOST
                SFX.Text(this.btn,280,560,4,0);                  
            }
        }
        if(this.M == 0){//C.MODE.TITLE


            this.BG(1, 0.6, this.titlebgc);
            
            if(this.titlesct){
                var t = 6;
                SFX.Text("PLAYER",300,60,t,1); 
                SFX.Text("SELECT",300,120,t,1); 
                var p = Actors[this.plrselect];
                var b = Factory.Man(p.c, p.d);
                SFX.Polygon(400, 440, b[1][0].src, b[1][0].col, {x:3,y:3,z:4.5}, 0);
                SFX.Text(p.n,360,200,4,0);
                if(p.g)SFX.Text(p.g,360,226,2,0);
                SFX.Text("LEFT",200,310,4,0);
                SFX.Text("RIGHT",520,310,4,0);

                if(!this.mob){
                    SFX.Text("MOVE                  ACTION",200,460,4,0);
                    SFX.Text("W", 220,486,3,0); 
                    SFX.Text("A S D / ARROWS                SPACE",200,504,3,0);                         
                }
                
            }
            else{
                var d = MAP.ScreenBounds();        
                for (var i = 0; i < this.introText.length; i++) {
                    var sc = Util.Remap(this.introText[i].timer.start,0, 0, 1, this.introText[i].timer.time);
                    var m = this.introText[i].text.Size.Clone().Multiply(Easing.eInOutE(sc)*2);
                    SFX.Image(this.introText[i].text.TextImg, new Vector2((d.Max.x/2)-(m.x/2), (d.Max.y/2)-(m.y/2)+this.introText[i].y), m, 
                            {x:0,y:0}, this.introText[i].text.Size);
                }

            }

            if(this.titlebgc>1){
                SFX.Text(this.btn+" TO START",280,560,4,0);   
            }
        }

        if(this.pause){
            SFX.Box(0,0, 800, 608 ,"rgba(100,100,100,0.6)");

            SFX.Box(300,200, 270, 100 ,"rgba(0,0,0,0.6)");
            SFX.Text("PAUSED",390,230,4,0);
            SFX.Text("[ESC] QUIT     "+this.btn+" CONTINUE",320,280,2,0);   
        }

        Input.Render();
    }
}