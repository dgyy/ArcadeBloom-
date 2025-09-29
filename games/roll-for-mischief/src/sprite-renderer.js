// Clean 2D isometric sprite renderer - fresh start
const R = {
  i(canvas) {
    this.c = canvas;
    this.x = canvas.getContext('2d');
    this.w = canvas.width = innerWidth;
    this.h = canvas.height = innerHeight;
    this.cam = { x: 0, z: 0 };
    this.tileSize = 32;
    
    // Disable smoothing for crisp sprites
    this.x.imageSmoothingEnabled = false;
    
    this.createSprites();
  },
  
  // Helper to create sprite canvas
  sprite(w, h, draw) {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    draw(ctx);
    return canvas;
  },
  
  // Helper to create building variants
  createBuildingVariant(ts, heightScale, frontColor, sideColor, topColor) {
    return this.sprite(ts*1.5, ts*(1.3+heightScale), ctx => {
      // Ground base
      ctx.drawImage(this.ground, 0, ts*(0.8+heightScale));
      
      const h = ts*heightScale;
      const w = ts*0.6;
      
      // Drop shadow behind building
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fillRect(ts*0.48, ts*(0.3+heightScale*0.2), w+4, h+4);
      
      // Front face
      ctx.fillStyle = frontColor;
      ctx.fillRect(ts*0.45, ts*(0.3+heightScale*0.2), w, h);
      
      // Right face with perspective
      ctx.fillStyle = sideColor;
      ctx.beginPath();
      ctx.moveTo(ts*0.45+w, ts*(0.3+heightScale*0.2));
      ctx.lineTo(ts*0.45+w+ts*0.3, ts*(0.3+heightScale*0.2)-ts*0.15);
      ctx.lineTo(ts*0.45+w+ts*0.3, ts*(0.3+heightScale*0.2)+h-ts*0.15);
      ctx.lineTo(ts*0.45+w, ts*(0.3+heightScale*0.2)+h);
      ctx.closePath();
      ctx.fill();
      
      // Top face
      ctx.fillStyle = topColor;
      ctx.beginPath();
      ctx.moveTo(ts*0.45, ts*(0.3+heightScale*0.2));
      ctx.lineTo(ts*0.45+ts*0.3, ts*(0.3+heightScale*0.2)-ts*0.15);
      ctx.lineTo(ts*0.45+w+ts*0.3, ts*(0.3+heightScale*0.2)-ts*0.15);
      ctx.lineTo(ts*0.45+w, ts*(0.3+heightScale*0.2));
      ctx.closePath();
      ctx.fill();
      
      // Windows with varied patterns
      const floors = Math.floor(h / (ts*0.2));
      for (let floor = 0; floor < floors; floor++) {
        const wy = ts*(0.4+heightScale*0.2) + floor * (ts*0.15);
        
        // Random window on/off pattern
        if ((floor + Math.floor(heightScale*10)) % 3 !== 0) {
          const color = floor % 2 ? '#FFD700' : '#FFA500';
          ctx.fillStyle = color;
          ctx.fillRect(ts*0.5, wy, 2, 2);
          ctx.fillRect(ts*0.8, wy, 2, 2);
          
          // Window glow
          ctx.shadowColor = color;
          ctx.shadowBlur = 3;
          ctx.fillRect(ts*0.5, wy, 2, 2);
          ctx.fillRect(ts*0.8, wy, 2, 2);
          ctx.shadowBlur = 0;
        }
      }
      
      // Building outline for definition
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.strokeRect(ts*0.45, ts*(0.3+heightScale*0.2), w, h);
    });
  },

  // Create polished isometric sprites
  createSprites() {
    const ts = this.tileSize;
    
    // Isometric ground tile with depth
    this.ground = this.sprite(ts*1.5, ts, ctx => {
      // Main ground diamond
      ctx.fillStyle = '#3a3a5a';
      ctx.beginPath();
      ctx.moveTo(ts*0.75, 2);
      ctx.lineTo(ts*1.5-2, ts/4);
      ctx.lineTo(ts*0.75, ts/2-2);
      ctx.lineTo(2, ts/4);
      ctx.closePath();
      ctx.fill();
      
      // Depth shadow
      ctx.fillStyle = '#2a2a4a';
      ctx.beginPath();
      ctx.moveTo(ts*0.75, ts/2-2);
      ctx.lineTo(ts*1.5-2, ts/4);
      ctx.lineTo(ts*1.5-2, ts/2);
      ctx.lineTo(ts*0.75, ts*0.75);
      ctx.closePath();
      ctx.fill();
      
      // Highlight edge
      ctx.strokeStyle = '#4a4a6a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ts*0.75, 2);
      ctx.lineTo(2, ts/4);
      ctx.stroke();
    });
    
    // Create multiple building variants for variety
    this.building = this.createBuildingVariant(ts, 0.6, '#5a5a7a', '#4a4a6a', '#6a6a8a');
    this.building2 = this.createBuildingVariant(ts, 0.8, '#6a5a7a', '#5a4a6a', '#7a6a8a');
    this.building3 = this.createBuildingVariant(ts, 0.5, '#5a6a7a', '#4a5a6a', '#6a7a8a');
    
    // Isometric tower
    this.tower = this.sprite(ts*1.5, ts*2.5, ctx => {
      ctx.drawImage(this.ground, 0, ts*2);
      
      const h = ts*1.3;
      const w = ts*0.5;
      
      // Front face
      ctx.fillStyle = '#6a6a8a';
      ctx.fillRect(ts*0.5, ts*0.5, w, h);
      
      // Right face
      ctx.fillStyle = '#5a5a7a';
      ctx.beginPath();
      ctx.moveTo(ts*0.5+w, ts*0.5);
      ctx.lineTo(ts*0.5+w+ts*0.25, ts*0.5-ts*0.125);
      ctx.lineTo(ts*0.5+w+ts*0.25, ts*0.5+h-ts*0.125);
      ctx.lineTo(ts*0.5+w, ts*0.5+h);
      ctx.closePath();
      ctx.fill();
      
      // Top face
      ctx.fillStyle = '#7a7a9a';
      ctx.beginPath();
      ctx.moveTo(ts*0.5, ts*0.5);
      ctx.lineTo(ts*0.5+ts*0.25, ts*0.5-ts*0.125);
      ctx.lineTo(ts*0.5+w+ts*0.25, ts*0.5-ts*0.125);
      ctx.lineTo(ts*0.5+w, ts*0.5);
      ctx.closePath();
      ctx.fill();
      
      // Many floors of windows
      for (let floor = 0; floor < 6; floor++) {
        const wy = ts*0.7 + floor * ts*0.2;
        ctx.fillStyle = floor % 2 ? '#FFD700' : '#FFA500';
        ctx.fillRect(ts*0.6, wy, 2, 2);
        ctx.fillRect(ts*0.8, wy, 2, 2);
      }
    });
    
    // Isometric street
    this.street = this.sprite(ts*1.5, ts, ctx => {
      // Street diamond (darker)
      ctx.fillStyle = '#2a2a3a';
      ctx.beginPath();
      ctx.moveTo(ts*0.75, 2);
      ctx.lineTo(ts*1.5-2, ts/4);
      ctx.lineTo(ts*0.75, ts/2-2);
      ctx.lineTo(2, ts/4);
      ctx.closePath();
      ctx.fill();
      
      // Road markings
      ctx.strokeStyle = '#4a4a5a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ts*0.4, ts*0.3);
      ctx.lineTo(ts*1.1, ts*0.2);
      ctx.stroke();
    });
    
    // Enhanced isometric cat with more detail
    this.cat = this.sprite(ts*1.2, ts*1.2, ctx => {
      const cx = ts*0.6;
      const cy = ts*0.6;
      
      // Larger shadow with better shape
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.save();
      ctx.scale(1.5, 0.6);
      ctx.beginPath();
      ctx.arc(cx*0.7, cy*1.4, 10, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      
      // Cat body with depth
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(cx-8, cy-4, 16, 14);
      
      // Body side (darker for depth)
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(cx+8, cy-4);
      ctx.lineTo(cx+14, cy-10);
      ctx.lineTo(cx+14, cy+6);
      ctx.lineTo(cx+8, cy+10);
      ctx.closePath();
      ctx.fill();
      
      // Body top
      ctx.fillStyle = '#CD853F';
      ctx.beginPath();
      ctx.moveTo(cx-8, cy-4);
      ctx.lineTo(cx-2, cy-10);
      ctx.lineTo(cx+14, cy-10);
      ctx.lineTo(cx+8, cy-4);
      ctx.closePath();
      ctx.fill();
      
      // Cat head (larger)
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(cx-6, cy-18, 12, 12);
      
      // Head side
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.moveTo(cx+6, cy-18);
      ctx.lineTo(cx+10, cy-22);
      ctx.lineTo(cx+10, cy-10);
      ctx.lineTo(cx+6, cy-6);
      ctx.closePath();
      ctx.fill();
      
      // Head top
      ctx.fillStyle = '#CD853F';
      ctx.beginPath();
      ctx.moveTo(cx-6, cy-18);
      ctx.lineTo(cx-2, cy-22);
      ctx.lineTo(cx+10, cy-22);
      ctx.lineTo(cx+6, cy-18);
      ctx.closePath();
      ctx.fill();
      
      // Ears with depth
      ctx.fillStyle = '#A0522D';
      ctx.fillRect(cx-5, cy-20, 3, 4);
      ctx.fillRect(cx+2, cy-20, 3, 4);
      
      // Ear sides
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(cx-2, cy-21, 2, 3);
      ctx.fillRect(cx+5, cy-21, 2, 3);
      
      // Eyes with better glow
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(cx-3, cy-14, 2, 2);
      ctx.fillRect(cx+1, cy-14, 2, 2);
      
      // Eye glow effect
      ctx.shadowColor = '#FFD700';
      ctx.shadowBlur = 4;
      ctx.fillRect(cx-3, cy-14, 2, 2);
      ctx.fillRect(cx+1, cy-14, 2, 2);
      ctx.shadowBlur = 0;
      
      // Subtle outline for definition
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(cx-8, cy-4, 16, 14);
    });
  },
  
  // Draw sprite at world position with proper isometric positioning
  draw(sprite, wx, wz) {
    // Isometric projection
    const isoX = (wx - wz) * this.tileSize * 0.5;
    const isoY = (wx + wz) * this.tileSize * 0.25;
    
    const x = isoX + this.w/2 - sprite.width/2;
    const y = isoY + this.h/2 - sprite.height/2;
    
    this.x.drawImage(sprite, Math.floor(x), Math.floor(y));
  },
  
  // Clear screen with atmospheric effects
  clear() {
    // Night sky gradient
    const grad = this.x.createLinearGradient(0, 0, 0, this.h);
    grad.addColorStop(0, '#0f0f23');
    grad.addColorStop(0.7, '#1a1a2e');
    grad.addColorStop(1, '#2a1a3e');
    this.x.fillStyle = grad;
    this.x.fillRect(0, 0, this.w, this.h);
    
    // Subtle city ambient lighting
    this.x.fillStyle = 'rgba(255, 165, 0, 0.02)';
    this.x.fillRect(0, this.h*0.4, this.w, this.h*0.6);
    
    // Add some distant city glow
    const cityGlow = this.x.createRadialGradient(this.w/2, this.h*0.8, 0, this.w/2, this.h*0.8, this.w*0.6);
    cityGlow.addColorStop(0, 'rgba(255, 165, 0, 0.05)');
    cityGlow.addColorStop(1, 'rgba(255, 165, 0, 0)');
    this.x.fillStyle = cityGlow;
    this.x.fillRect(0, 0, this.w, this.h);
  },
  
  // Update camera
  u(x, y, z) {
    this.cam.x = x;
    this.cam.z = z;
  }
};