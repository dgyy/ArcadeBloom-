// Pure 2D isometric sprite renderer
const R = {
  i(canvas) {
    this.c = canvas;
    this.x = canvas.getContext('2d');
    this.w = canvas.width = innerWidth;
    this.h = canvas.height = innerHeight;
    this.cam = { x: 0, z: 0 };
    this.tileSize = 32;
    this.sprites = {};
    this.createSprites();
    
    // Disable smoothing for crisp pixel art
    this.x.imageSmoothingEnabled = false;
  },
  
  // Create simple 2D isometric sprites
  createSprites() {
    const ts = this.tileSize;
    
    // Ground sprite - simple flat tile
    this.sprites.ground = this.drawSprite(ts, ts, (ctx) => {
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(0, 0, ts, ts);
      ctx.strokeStyle = '#1a1a2a';
      ctx.strokeRect(0, 0, ts, ts);
    });
    
    // Building sprite - crisp isometric building
    const building = document.createElement('canvas');
    building.width = building.height = ts;
    const bctx = building.getContext('2d');
    
    // Building base (copy ground)
    bctx.drawImage(ground, 0, 0);
    
    // Building walls with clean pixel edges
    bctx.fillStyle = '#4a4a6a';
    bctx.beginPath();
    bctx.moveTo(ts/2, ts/4);
    bctx.lineTo(ts-6, ts/6);
    bctx.lineTo(ts-6, ts/3);
    bctx.lineTo(ts/2, ts/2-2);
    bctx.closePath();
    bctx.fill();
    
    bctx.fillStyle = '#3a3a5a';
    bctx.beginPath();
    bctx.moveTo(6, ts/4);
    bctx.lineTo(ts/2, ts/6);
    bctx.lineTo(ts/2, ts/3);
    bctx.lineTo(6, ts/2-2);
    bctx.closePath();
    bctx.fill();
    
    // Building top
    bctx.fillStyle = '#5a5a7a';
    bctx.beginPath();
    bctx.moveTo(ts/2, ts/6);
    bctx.lineTo(ts-6, ts/6);
    bctx.lineTo(ts/2, 4);
    bctx.lineTo(6, ts/6);
    bctx.closePath();
    bctx.fill();
    
    // Clean window pixels
    bctx.fillStyle = '#FFA500';
    bctx.fillRect(ts*0.6, ts*0.18, 3, 3);
    bctx.fillRect(ts*0.3, ts*0.22, 3, 3);
    
    this.sprites.set('building', building);
    
    // Tower sprite - taller isometric building
    const tower = document.createElement('canvas');
    tower.width = ts;
    tower.height = ts * 1.4;
    const tctx = tower.getContext('2d');
    
    // Tower base
    tctx.drawImage(ground, 0, ts*0.9);
    
    // Tower walls (taller, crisp)
    tctx.fillStyle = '#5a5a7a';
    tctx.beginPath();
    tctx.moveTo(ts/2, ts*0.65);
    tctx.lineTo(ts-6, ts*0.55);
    tctx.lineTo(ts-6, ts*0.1);
    tctx.lineTo(ts/2, 4);
    tctx.closePath();
    tctx.fill();
    
    tctx.fillStyle = '#4a4a6a';
    tctx.beginPath();
    tctx.moveTo(6, ts*0.65);
    tctx.lineTo(ts/2, ts*0.55);
    tctx.lineTo(ts/2, ts*0.1);
    tctx.lineTo(6, ts*0.2);
    tctx.closePath();
    tctx.fill();
    
    // Clean window grid
    const colors = ['#FFA500', '#FFD700', '#FF6347'];
    for (let row = 0; row < 6; row++) {
      const y = ts*0.15 + row * 8;
      tctx.fillStyle = colors[row % 3];
      tctx.fillRect(ts*0.6, y, 2, 2);
      tctx.fillRect(ts*0.35, y+2, 2, 2);
    }
    
    this.sprites.set('tower', tower);
    
    // Skyscraper sprite - very tall isometric building
    const skyscraper = document.createElement('canvas');
    skyscraper.width = ts;
    skyscraper.height = ts * 1.8;
    const sctx = skyscraper.getContext('2d');
    
    // Skyscraper base
    sctx.drawImage(ground, 0, ts*1.3);
    
    // Skyscraper walls (very tall, crisp)
    sctx.fillStyle = '#6a6a8a';
    sctx.beginPath();
    sctx.moveTo(ts/2, ts*1.05);
    sctx.lineTo(ts-6, ts*0.95);
    sctx.lineTo(ts-6, ts*0.05);
    sctx.lineTo(ts/2, 2);
    sctx.closePath();
    sctx.fill();
    
    sctx.fillStyle = '#5a5a7a';
    sctx.beginPath();
    sctx.moveTo(6, ts*1.05);
    sctx.lineTo(ts/2, ts*0.95);
    sctx.lineTo(ts/2, ts*0.05);
    sctx.lineTo(6, ts*0.15);
    sctx.closePath();
    sctx.fill();
    
    // Dense window pattern
    for (let row = 0; row < 12; row++) {
      const y = ts*0.1 + row * 6;
      const color = colors[row % 3];
      sctx.fillStyle = color;
      sctx.fillRect(ts*0.6, y, 2, 2);
      sctx.fillRect(ts*0.35, y+1, 2, 2);
      sctx.fillRect(ts*0.75, y+2, 1, 1);
    }
    
    this.sprites.set('skyscraper', skyscraper);
    
    // Street sprite - clean isometric road
    const street = document.createElement('canvas');
    street.width = street.height = ts;
    const stctx = street.getContext('2d');
    
    // Street base (darker diamond)
    stctx.fillStyle = '#1a1a2a';
    stctx.beginPath();
    stctx.moveTo(ts/2, 2);
    stctx.lineTo(ts-2, ts/4);
    stctx.lineTo(ts/2, ts/2-2);
    stctx.lineTo(2, ts/4);
    stctx.closePath();
    stctx.fill();
    
    // Street markings - clean lines
    stctx.strokeStyle = '#444';
    stctx.lineWidth = 1;
    stctx.beginPath();
    stctx.moveTo(ts/4, ts/8);
    stctx.lineTo(ts*3/4, ts*3/8);
    stctx.stroke();
    
    this.sprites.set('street', street);
    
    // Cat sprite - detailed isometric cat
    const cat = document.createElement('canvas');
    cat.width = cat.height = ts;
    const cctx = cat.getContext('2d');
    
    // Cat shadow (isometric ellipse)
    cctx.fillStyle = 'rgba(0,0,0,0.4)';
    cctx.beginPath();
    cctx.ellipse(ts/2, ts*0.75, ts*0.15, ts*0.08, 0, 0, Math.PI*2);
    cctx.fill();
    
    // Cat body (isometric perspective)
    cctx.fillStyle = '#8B4513';
    cctx.fillRect(ts*0.4, ts*0.55, ts*0.2, ts*0.15);
    
    // Cat side body
    cctx.fillStyle = '#A0522D';
    cctx.beginPath();
    cctx.moveTo(ts*0.6, ts*0.55);
    cctx.lineTo(ts*0.7, ts*0.5);
    cctx.lineTo(ts*0.7, ts*0.65);
    cctx.lineTo(ts*0.6, ts*0.7);
    cctx.closePath();
    cctx.fill();
    
    // Cat head
    cctx.fillStyle = '#8B4513';
    cctx.fillRect(ts*0.42, ts*0.42, ts*0.16, ts*0.13);
    
    // Cat ears (pixel perfect)
    cctx.fillStyle = '#8B4513';
    cctx.fillRect(ts*0.44, ts*0.38, 3, 4);
    cctx.fillRect(ts*0.53, ts*0.38, 3, 4);
    
    // Cat eyes (tiny pixels)
    cctx.fillStyle = '#FFD700';
    cctx.fillRect(ts*0.46, ts*0.45, 1, 1);
    cctx.fillRect(ts*0.53, ts*0.45, 1, 1);
    
    this.sprites.set('cat', cat);
  },
  
  // Convert world coordinates to screen isometric position
  toScreen(wx, wz) {
    const cam_x = wx - this.cam.x;
    const cam_z = wz - this.cam.z;
    
    return {
      x: (cam_x - cam_z) * (this.tileSize / 2) + this.w / 2,
      y: (cam_x + cam_z) * (this.tileSize / 4) + this.h / 2
    };
  },
  
  // Render frame
  r() {
    // Clear with night sky
    const grad = this.x.createLinearGradient(0, 0, 0, this.h);
    grad.addColorStop(0, '#0f0f23');
    grad.addColorStop(1, '#1a1a2e');
    this.x.fillStyle = grad;
    this.x.fillRect(0, 0, this.w, this.h);
  },
  
  // Draw sprite at world position
  drawSprite(type, wx, wz, offset = 0) {
    const sprite = this.sprites.get(type);
    if (!sprite) return;
    
    const screen = this.toScreen(wx, wz);
    this.x.drawImage(sprite, 
      Math.floor(screen.x - sprite.width/2), 
      Math.floor(screen.y - sprite.height/2 - offset)
    );
  },
  
  // Update camera
  u(x, y, z) {
    this.cam.x = x;
    this.cam.z = z;
  }
};