// Ultra-compressed 3D engine for tactical cat battle royale
const E={
  // Initialize
  i(c){
    this.c=c;this.ctx=c.getContext('2d');this.w=c.width=innerWidth;this.h=c.height=innerHeight;
    this.m={x:0,y:50,z:100,rx:-.5,ry:0,fov:60,zoom:1};this.near=1;this.far=1000;this.o=[];this.g=5;
  },
  
  // Add object
  add(t,x,y,z,w,h,d,c){this.o.push({t,x,y,z,w,h,d,c})},
  
  // Project 3D to 2D
  p(x,y,z){
    let dx=x-this.m.x,dy=y-this.m.y,dz=z-this.m.z;
    const cy=Math.cos(this.m.ry),sy=Math.sin(this.m.ry);
    let tx=dx*cy-dz*sy,tz=dx*sy+dz*cy;dx=tx;dz=tz;
    const cx=Math.cos(this.m.rx),sx=Math.sin(this.m.rx);
    let ty=dy*cx-dz*sx;tz=dy*sx+dz*cx;dy=ty;dz=tz;
    if(dz<this.near)return null;
    const s=(this.h*.5)/Math.tan((this.m.fov*.5)*Math.PI/180);
    return{x:(dx*s/dz)*this.m.zoom+this.w/2,y:(-dy*s/dz)*this.m.zoom+this.h/2,z:dz};
  },
  
  // Draw triangle
  t(v1,v2,v3,c){
    const p1=this.p(v1.x,v1.y,v1.z),p2=this.p(v2.x,v2.y,v2.z),p3=this.p(v3.x,v3.y,v3.z);
    if(!p1||!p2||!p3)return;
    const e1={x:v2.x-v1.x,y:v2.y-v1.y,z:v2.z-v1.z},e2={x:v3.x-v1.x,y:v3.y-v1.y,z:v3.z-v1.z};
    const n={x:e1.y*e2.z-e1.z*e2.y,y:e1.z*e2.x-e1.x*e2.z,z:e1.x*e2.y-e1.y*e2.x};
    const cx=(v1.x+v2.x+v3.x)/3,cy=(v1.y+v2.y+v3.y)/3,cz=(v1.z+v2.z+v3.z)/3;
    const tc={x:this.m.x-cx,y:this.m.y-cy,z:this.m.z-cz};
    if(n.x*tc.x+n.y*tc.y+n.z*tc.z<0)return;
    this.ctx.fillStyle=c;this.ctx.beginPath();this.ctx.moveTo(p1.x,p1.y);
    this.ctx.lineTo(p2.x,p2.y);this.ctx.lineTo(p3.x,p3.y);this.ctx.closePath();this.ctx.fill();
  },
  
  // Draw box using triangles
  b(x,y,z,w,h,d,c){
    const v=[{x,y,z},{x:x+w,y,z},{x:x+w,y,z:z+d},{x,y,z:z+d},
             {x,y:y+h,z},{x:x+w,y:y+h,z},{x:x+w,y:y+h,z:z+d},{x,y:y+h,z:z+d}];
    // Top: 4,5,6 & 4,6,7  Bottom: 1,2,0 & 0,2,3  Front: 0,4,5 & 0,5,1  Back: 2,6,7 & 2,7,3  Left: 3,7,4 & 3,4,0  Right: 1,5,6 & 1,6,2
    const tri=[[4,5,6,c],[4,6,7,c],[1,2,0,this.k(c,.6)],[0,2,3,this.k(c,.6)],
               [0,4,5,this.k(c,.8)],[0,5,1,this.k(c,.8)],[2,6,7,this.k(c,.7)],[2,7,3,this.k(c,.7)],
               [3,7,4,this.k(c,.9)],[3,4,0,this.k(c,.9)],[1,5,6,this.k(c,.85)],[1,6,2,this.k(c,.85)]];
    tri.forEach(([i1,i2,i3,cl])=>this.t(v[i1],v[i2],v[i3],cl));
  },
  
  // Draw cat
  cat(o){
    const {x,y,z,w,h,d,c}=o;
    const v=[{x,y,z},{x:x+w,y,z},{x:x+w,y,z:z+d},{x,y,z:z+d},
             {x:x+w*0.2,y:y+h*0.6,z:z+d*0.2},{x:x+w*0.8,y:y+h*0.6,z:z+d*0.2},
             {x:x+w*0.8,y:y+h*0.6,z:z+d*0.8},{x:x+w*0.2,y:y+h*0.6,z:z+d*0.8},
             {x:x+w*0.3,y:y+h*0.7,z:z+d*1.1},{x:x+w*0.7,y:y+h*0.7,z:z+d*1.1},
             {x:x+w*0.5,y:y+h*0.9,z:z+d*1.4},{x:x+w*0.5,y:y+h*0.5,z:z+d*1.4},
             {x:x+w*0.35,y:y+h*1.1,z:z+d*1.15},{x:x+w*0.65,y:y+h*1.1,z:z+d*1.15},
             {x:x-w*0.2,y:y+h*0.8,z:z+d*0.5},{x:x+w*0.1,y:y+h*0.7,z:z+d*0.4}];
    const tri=[[0,1,4,c],[1,5,4,c],[1,2,5,c],[2,6,5,c],[2,3,6,c],[3,7,6,c],
               [3,0,7,c],[0,4,7,c],[4,5,7,c],[5,6,7,c],[7,8,9,this.k(c,.9)],
               [8,10,11,this.k(c,.8)],[9,11,10,this.k(c,.8)],[8,9,10,c],
               [8,11,9,this.k(c,.7)],[8,12,10,this.k(c,.9)],[9,10,13,this.k(c,.9)],
               [4,15,14,this.k(c,.8)],[15,7,4,this.k(c,.85)]];
    const st=tri.map(([i1,i2,i3,cl])=>{
      const v1=v[i1],v2=v[i2],v3=v[i3];const az=(v1.z+v2.z+v3.z)/3;
      const dt=Math.sqrt((az-this.m.z)**2+((v1.x+v2.x+v3.x)/3-this.m.x)**2+((v1.y+v2.y+v3.y)/3-this.m.y)**2);
      return{v1,v2,v3,cl,d:dt};
    }).sort((a,b)=>b.d-a.d);
    st.forEach(tr=>this.t(tr.v1,tr.v2,tr.v3,tr.cl));
  },
  
  // Draw windows
  win(o){
    const {x,y,z,w,h,d}=o;const wc=['#FFA500','#FFD700','#FF8C00','#FFAA00','#FFCC00'];
    const f=[{n:[-1,0,0],s:'l'},{n:[1,0,0],s:'r'},{n:[0,0,-1],s:'f'},{n:[0,0,1],s:'b'}];
    f.forEach(f=>{
      const fc=[x+w/2+f.n[0]*w/2,y+h/2+f.n[1]*h/2,z+d/2+f.n[2]*d/2];
      const tc=[this.m.x-fc[0],this.m.y-fc[1],this.m.z-fc[2]];
      if(f.n[0]*tc[0]+f.n[1]*tc[1]+f.n[2]*tc[2]>0){
        const wr=Math.floor(h/6);for(let i=1;i<=wr;i++){
          const wy=i*6-3,ww=2.5,wh=1.5+Math.sin(i+x+z)*.8;
          const c1=wc[Math.floor((i+x+z)%wc.length)],c2=wc[Math.floor((i+x+z+2)%wc.length)];
          if(f.s==='f'){this.b(x+2,y+wy,z-.1,ww,wh,.2,c1);if(w>8)this.b(x+w-2-ww,y+wy,z-.1,ww,wh,.2,c2);}
          else if(f.s==='b'){this.b(x+2,y+wy,z+d-.1,ww,wh,.2,c1);if(w>8)this.b(x+w-2-ww,y+wy,z+d-.1,ww,wh,.2,c2);}
          else if(f.s==='l'){this.b(x-.1,y+wy,z+2,.2,wh,ww,c1);if(d>8)this.b(x-.1,y+wy,z+d-2-ww,.2,wh,ww,c2);}
          else if(f.s==='r'){this.b(x+w-.1,y+wy,z+2,.2,wh,ww,c1);if(d>8)this.b(x+w-.1,y+wy,z+d-2-ww,.2,wh,ww,c2);}
        }
      }
    });
  },
  
  // Darken color
  k(c,f){if(!c)return'#666';if(typeof c==='string'&&c.startsWith('#')){
    const r=parseInt(c.slice(1,3),16),g=parseInt(c.slice(3,5),16),b=parseInt(c.slice(5,7),16);
    return`rgb(${Math.floor(r*f)},${Math.floor(g*f)},${Math.floor(b*f)})`;
  }return c;},
  
  // Clear
  clear(){
    const g=this.ctx.createLinearGradient(0,0,0,this.h);
    g.addColorStop(0,'#0a0a1a');g.addColorStop(.5,'#1a1a2e');g.addColorStop(1,'#2a2a3e');
    this.ctx.fillStyle=g;this.ctx.fillRect(0,0,this.w,this.h);
    const fg=this.ctx.createRadialGradient(this.w/2,this.h/2,0,this.w/2,this.h/2,this.w*.7);
    fg.addColorStop(0,'rgba(255,165,0,.02)');fg.addColorStop(1,'rgba(100,100,200,.05)');
    this.ctx.fillStyle=fg;this.ctx.fillRect(0,0,this.w,this.h);
  },
  
  // Draw grid
  grid(){
    this.ctx.strokeStyle='rgba(100,100,150,.2)';this.ctx.lineWidth=1;const r=100;
    for(let x=-r;x<=r;x+=this.g){
      const s=this.p(x,0,-r),e=this.p(x,0,r);
      if(s&&e){this.ctx.beginPath();this.ctx.moveTo(s.x,s.y);this.ctx.lineTo(e.x,e.y);this.ctx.stroke();}
    }
    for(let z=-r;z<=r;z+=this.g){
      const s=this.p(-r,0,z),e=this.p(r,0,z);
      if(s&&e){this.ctx.beginPath();this.ctx.moveTo(s.x,s.y);this.ctx.lineTo(e.x,e.y);this.ctx.stroke();}
    }
  },
  
  // Check if behind
  behind(a,b){
    const ac={x:a.x+a.w/2,y:a.y+a.h/2,z:a.z+a.d/2},bc={x:b.x+b.w/2,y:b.y+b.h/2,z:b.z+b.d/2};
    const ox=a.x+a.w>b.x&&a.x<b.x+b.w,oz=a.z+a.d>b.z&&a.z<b.z+b.d;
    if(ox&&oz){
      const ad=Math.sqrt((ac.x-this.m.x)**2+(ac.y-this.m.y)**2+(ac.z-this.m.z)**2);
      const bd=Math.sqrt((bc.x-this.m.x)**2+(bc.y-this.m.y)**2+(bc.z-this.m.z)**2);
      return ad>bd;
    }return false;
  },
  
  // Render
  r(){
    this.clear();this.grid();
    const bld=this.o.filter(o=>o.t==='building'),cats=this.o.filter(o=>o.t==='cat');
    const sb=bld.map(o=>{
      const dx=o.x+o.w/2-this.m.x,dy=o.y+o.h/2-this.m.y,dz=o.z+o.d/2-this.m.z;
      return{...o,d:Math.sqrt(dx*dx+dy*dy+dz*dz)};
    }).sort((a,b)=>b.d-a.d);
    const sc=cats.map(o=>{
      const dx=o.x+o.w/2-this.m.x,dy=o.y+o.h/2-this.m.y,dz=o.z+o.d/2-this.m.z;
      return{...o,d:Math.sqrt(dx*dx+dy*dy+dz*dz)};
    }).sort((a,b)=>b.d-a.d);
    sb.forEach(o=>{this.b(o.x,o.y,o.z,o.w,o.h,o.d,o.c);this.win(o);});
    sc.forEach(co=>{let bl=false;for(const bo of sb){if(this.behind(co,bo)){bl=true;break;}}if(!bl)this.cat(co);});
  },
  
  // Camera controls
  move(dx,dy,dz){this.m.x+=dx;this.m.y+=dy;this.m.z+=dz;},
  rotate(rx,ry){this.m.rx=Math.max(-Math.PI/2,Math.min(Math.PI/2,this.m.rx+rx));this.m.ry+=ry;},
  zoom(f){this.m.zoom=Math.max(.5,Math.min(3,this.m.zoom*f));},
  iso(){this.m.rx=-Math.PI/4;this.m.ry=Math.PI/4;this.m.y=50;this.m.zoom=1;}
};