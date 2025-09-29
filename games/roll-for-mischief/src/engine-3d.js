// Minimal 3D engine for tactical cat battle royale
const E = {
  // Initialize 3D engine
  init(canvas) {
    this.c = canvas;
    this.ctx = canvas.getContext('2d');
    this.w = canvas.width = innerWidth;
    this.h = canvas.height = innerHeight;
    
    // Camera with full control
    this.cam = {
      x: 0, y: 50, z: 100,  // Position
      rx: -0.5, ry: 0, rz: 0,  // Rotation (looking down at city)
      fov: 60,  // Field of view
      zoom: 1
    };
    
    // Projection constants
    this.near = 1;
    this.far = 1000;
    
    // Scene objects
    this.objects = [];
    
    // Store cat screen positions by ID (for arrow rendering)
    this.catScreenPositions = {};
    
    // Grid size (5ft squares for Pathfinder)
    this.gridSize = 5;
  },
  
  // Add object to scene
  add(type, x, y, z, w, h, d, color) {
    const obj = { type, x, y, z, w, h, d, color };
    
    // Pre-generate window colors for buildings to prevent vibration
    if (type === 'building') {
      const windowColors = ['#FFA500', '#FFD700', '#FF8C00', '#FFAA00', '#FFCC00'];
      const floors = Math.floor(h / 10);
      obj.windowColors = [];
      
      // Generate colors for each potential window position
      for (let f = 0; f < floors; f++) {
        obj.windowColors[f] = [];
        for (let side = 0; side < 4; side++) { // front, back, left, right
          for (let pos = 0; pos < 2; pos++) { // left/right or front/back positions
            const randomIndex = Math.floor(Math.random() * windowColors.length);
            obj.windowColors[f][side * 2 + pos] = windowColors[randomIndex];
          }
        }
      }
    }
    
    this.objects.push(obj);
  },
  
  // Project 3D point to 2D screen
  project(x, y, z) {
    // Transform to camera space
    let dx = x - this.cam.x;
    let dy = y - this.cam.y;
    let dz = z - this.cam.z;
    
    // Rotate around Y (horizontal rotation)
    const cosY = Math.cos(this.cam.ry);
    const sinY = Math.sin(this.cam.ry);
    let tx = dx * cosY - dz * sinY;
    let tz = dx * sinY + dz * cosY;
    dx = tx;
    dz = tz;
    
    // Rotate around X (vertical tilt)
    const cosX = Math.cos(this.cam.rx);
    const sinX = Math.sin(this.cam.rx);
    let ty = dy * cosX - dz * sinX;
    tz = dy * sinX + dz * cosX;
    dy = ty;
    dz = tz;
    
    // Don't render behind camera
    if (dz < this.near) return null;
    
    // Perspective projection
    const scale = (this.h * 0.5) / Math.tan((this.cam.fov * 0.5) * Math.PI / 180);
    const px = (dx * scale / dz) * this.cam.zoom + this.w / 2;
    const py = (-dy * scale / dz) * this.cam.zoom + this.h / 2;
    
    return { x: px, y: py, z: dz };
  },
  
  // Draw a 3D box
  drawBox(x, y, z, w, h, d, color, opacity = 1) {
    // Define 8 vertices of the box
    const vertices = [
      { x: x, y: y, z: z },
      { x: x + w, y: y, z: z },
      { x: x + w, y: y, z: z + d },
      { x: x, y: y, z: z + d },
      { x: x, y: y + h, z: z },
      { x: x + w, y: y + h, z: z },
      { x: x + w, y: y + h, z: z + d },
      { x: x, y: y + h, z: z + d }
    ];
    
    // Project all vertices
    const projected = vertices.map(v => this.project(v.x, v.y, v.z));
    if (projected.some(p => !p)) return;
    
    // Define faces with normals for culling
    const faces = [
      { indices: [4, 5, 6, 7], color: color, normal: [0, 1, 0] },  // Top
      { indices: [0, 1, 2, 3], color: this.darken(color, 0.9), normal: [0, -1, 0] },  // Bottom
      { indices: [0, 4, 7, 3], color: this.darken(color, 0.95), normal: [-1, 0, 0] },  // Left  
      { indices: [1, 5, 6, 2], color: this.darken(color, 0.95), normal: [1, 0, 0] },  // Right
      { indices: [0, 1, 5, 4], color: this.darken(color, 0.98), normal: [0, 0, -1] },  // Front
      { indices: [3, 2, 6, 7], color: this.darken(color, 0.95), normal: [0, 0, 1] }   // Back
    ];
    
    // Face culling - only draw faces pointing toward camera
    const visibleFaces = faces.filter(face => {
      const faceCenter = [
        x + w/2 + face.normal[0] * w/2,
        y + h/2 + face.normal[1] * h/2,
        z + d/2 + face.normal[2] * d/2
      ];
      const toCam = [
        this.cam.x - faceCenter[0],
        this.cam.y - faceCenter[1], 
        this.cam.z - faceCenter[2]
      ];
      // Dot product with face normal - positive means facing camera
      return face.normal[0] * toCam[0] + face.normal[1] * toCam[1] + face.normal[2] * toCam[2] > 0;
    });
    
    // Calculate depths for visible faces
    const facesWithDepth = visibleFaces.map(face => {
      const avgZ = face.indices.reduce((sum, i) => sum + projected[i].z, 0) / face.indices.length;
      return { ...face, depth: avgZ };
    });
    
    // Sort faces by depth (painter's algorithm)
    facesWithDepth.sort((a, b) => b.depth - a.depth);
    
    // Draw faces
    this.ctx.globalAlpha = opacity;
    facesWithDepth.forEach(face => {
      this.ctx.fillStyle = face.color;
      this.ctx.beginPath();
      this.ctx.moveTo(projected[face.indices[0]].x, projected[face.indices[0]].y);
      for (let i = 1; i < face.indices.length; i++) {
        this.ctx.lineTo(projected[face.indices[i]].x, projected[face.indices[i]].y);
      }
      this.ctx.closePath();
      this.ctx.fill();
      
      // Outline for definition
      this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
      this.ctx.lineWidth = 1;
      this.ctx.stroke();
    });
    this.ctx.globalAlpha = 1;
  },
  
  // Draw grid for tactical movement - draw as grid squares instead of lines
  drawGrid() {
    this.ctx.strokeStyle = 'rgba(100,100,150,0.3)';
    this.ctx.lineWidth = 1;
    
    const gridRange = 500; // Expand to cover entire play area
    for (let x = -gridRange; x <= gridRange; x += this.gridSize) {
      for (let z = -gridRange; z <= gridRange; z += this.gridSize) {
        // Draw each grid square
        const corners = [
          this.project(x, 0, z),
          this.project(x + this.gridSize, 0, z),
          this.project(x + this.gridSize, 0, z + this.gridSize),
          this.project(x, 0, z + this.gridSize)
        ];
        
        // Only draw if all corners are visible
        if (corners.every(c => c)) {
          this.ctx.beginPath();
          this.ctx.moveTo(corners[0].x, corners[0].y);
          this.ctx.lineTo(corners[1].x, corners[1].y);
          this.ctx.lineTo(corners[2].x, corners[2].y);
          this.ctx.lineTo(corners[3].x, corners[3].y);
          this.ctx.closePath();
          this.ctx.stroke();
        }
      }
    }
  },
  
  // Darken color (handles both hex and named colors)
  darken(color, factor) {
    // Handle undefined/null colors
    if (!color) return '#666666';
    
    // Handle hex colors
    if (typeof color === 'string' && color.startsWith('#')) {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      const dr = Math.floor(r * factor);
      const dg = Math.floor(g * factor);
      const db = Math.floor(b * factor);
      
      return `rgb(${dr},${dg},${db})`;
    }
    
    // For non-hex colors, return as-is
    return color;
  },
  
  // Clear and setup frame
  clear() {
    // Night sky gradient
    const grad = this.ctx.createLinearGradient(0, 0, 0, this.h);
    grad.addColorStop(0, '#0a0a1a');
    grad.addColorStop(0.5, '#1a1a2e');
    grad.addColorStop(1, '#2a2a3e');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.w, this.h);
    
    // Fog effect
    const fog = this.ctx.createRadialGradient(this.w/2, this.h/2, 0, this.w/2, this.h/2, this.w*0.7);
    fog.addColorStop(0, 'rgba(255,165,0,0.02)');
    fog.addColorStop(1, 'rgba(100,100,200,0.05)');
    this.ctx.fillStyle = fog;
    this.ctx.fillRect(0, 0, this.w, this.h);
  },
  
  // Render scene
  render() {
    this.clear();
    this.drawGrid();
    
    // Separate objects by type for better depth sorting
    const buildings = this.objects.filter(obj => obj.type === 'building');
    const cats = this.objects.filter(obj => obj.type === 'cat' || obj.type === 'boss');
    
    // Sort buildings by distance (back to front)
    const sortedBuildings = buildings.map(obj => {
      const dx = obj.x + obj.w/2 - this.cam.x;
      const dy = obj.y + obj.h/2 - this.cam.y;
      const dz = obj.z + obj.d/2 - this.cam.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      return { ...obj, dist };
    }).sort((a, b) => b.dist - a.dist);
    
    // Sort cats by distance
    const sortedCats = cats.map(obj => {
      const dx = obj.x + obj.w/2 - this.cam.x;
      const dy = obj.y + obj.h/2 - this.cam.y;
      const dz = obj.z + obj.d/2 - this.cam.z;
      const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
      return { ...obj, dist };
    }).sort((a, b) => b.dist - a.dist);
    
    // Draw buildings first (furthest to nearest)
    sortedBuildings.forEach(obj => {
      this.drawBox(obj.x, obj.y, obj.z, obj.w, obj.h, obj.d, obj.color);
      this.drawBuildingWindows(obj);
    });
    
    // Draw cats on top (with proper depth relative to buildings)
    sortedCats.forEach(catObj => {
      // Check if cat is behind any building
      let blocked = false;
      for (const buildingObj of sortedBuildings) {
        if (this.isObjectBehind(catObj, buildingObj)) {
          blocked = true;
          break;
        }
      }
      
      if (!blocked) {
        this.drawCat(catObj);
      }
    });
    
    // Calculate screen positions for ALL cats after rendering (for arrow positioning)
    sortedCats.forEach(catObj => {
      this.calculateCatScreenPosition(catObj);
    });
  },
  
  // Calculate screen position for cat sprite (for arrow positioning)
  calculateCatScreenPosition(obj) {
    if (!obj.catId) return; // Skip if no catId
    
    const { x, y, z, w, h, d } = obj;
    
    // Project sprite center to screen (same logic as drawCat)
    const screenPos = this.project(x + w/2, y + h, z + d/2);
    if (!screenPos) return;
    
    // Calculate sprite size (same logic as drawCat)
    const dx = (x + w/2) - this.cam.x;
    const dy = (y + h/2) - this.cam.y;  
    const dz = (z + d/2) - this.cam.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    const worldSize = 5; // 5 feet tall in game world
    const distanceFromCamera = screenPos.z;
    const spriteSize = Math.max(8, worldSize * 800 / distanceFromCamera);
    
    // Store in global map by catId
    const spriteTop = screenPos.y - spriteSize;
    this.catScreenPositions[obj.catId] = { x: screenPos.x, y: spriteTop };
  },
  
  // Check if object A is behind object B from camera perspective
  isObjectBehind(objA, objB) {
    const aCenter = {
      x: objA.x + objA.w/2,
      y: objA.y + objA.h/2,
      z: objA.z + objA.d/2
    };
    const bCenter = {
      x: objB.x + objB.w/2,
      y: objB.y + objB.h/2,
      z: objB.z + objB.d/2
    };
    
    // Simple AABB intersection test in 2D (x,z plane)
    const aLeft = objA.x;
    const aRight = objA.x + objA.w;
    const aFront = objA.z;
    const aBack = objA.z + objA.d;
    
    const bLeft = objB.x;
    const bRight = objB.x + objB.w;
    const bFront = objB.z;
    const bBack = objB.z + objB.d;
    
    // Check for 2D overlap in x,z plane
    const overlapX = aRight > bLeft && aLeft < bRight;
    const overlapZ = aBack > bFront && aFront < bBack;
    
    if (overlapX && overlapZ) {
      // Calculate distance from camera
      const aDist = Math.sqrt(
        (aCenter.x - this.cam.x) ** 2 + 
        (aCenter.y - this.cam.y) ** 2 + 
        (aCenter.z - this.cam.z) ** 2
      );
      const bDist = Math.sqrt(
        (bCenter.x - this.cam.x) ** 2 + 
        (bCenter.y - this.cam.y) ** 2 + 
        (bCenter.z - this.cam.z) ** 2
      );
      
      // A is behind B if it's further from camera and overlaps
      return aDist > bDist;
    }
    
    return false;
  },
  
  // Draw a 3D triangle
  drawTriangle(v1, v2, v3, color) {
    // Project vertices
    const p1 = this.project(v1.x, v1.y, v1.z);
    const p2 = this.project(v2.x, v2.y, v2.z);
    const p3 = this.project(v3.x, v3.y, v3.z);
    
    // Skip if any vertex is behind camera
    if (!p1 || !p2 || !p3) return;
    
    // Calculate normal for backface culling
    const edge1 = { x: v2.x - v1.x, y: v2.y - v1.y, z: v2.z - v1.z };
    const edge2 = { x: v3.x - v1.x, y: v3.y - v1.y, z: v3.z - v1.z };
    const normal = {
      x: edge1.y * edge2.z - edge1.z * edge2.y,
      y: edge1.z * edge2.x - edge1.x * edge2.z,
      z: edge1.x * edge2.y - edge1.y * edge2.x
    };
    
    // Face center for culling test
    const center = {
      x: (v1.x + v2.x + v3.x) / 3,
      y: (v1.y + v2.y + v3.y) / 3,
      z: (v1.z + v2.z + v3.z) / 3
    };
    
    const toCam = {
      x: this.cam.x - center.x,
      y: this.cam.y - center.y,
      z: this.cam.z - center.z
    };
    
    // Skip back-facing triangles
    const dot = normal.x * toCam.x + normal.y * toCam.y + normal.z * toCam.z;
    if (dot < 0) return;
    
    // Draw triangle
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.lineTo(p3.x, p3.y);
    this.ctx.closePath();
    this.ctx.fill();
    
    // Subtle outline
    this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    this.ctx.lineWidth = 0.5;
    this.ctx.stroke();
  },
  
  // Sprite system - uses generated SPRITES data
  sprites: typeof SPRITES !== 'undefined' ? {
    cat: SPRITES.cat.data,
    colors: SPRITES.cat.colors,
    size: SPRITES.cat.size
  } : {
    // Fallback sprites if SPRITES not loaded
    cat: '00000000000000000000000000000000',
    colors: {'0': 'rgba(0,0,0,0)'},
    size: 16
  },
  
  // Draw sprite using classic matrix access [row*size+col] 
  drawSprite(spriteStr, colors, x, y, size, spriteSize = 32, tintColor = null, options = {}) {
    const pixelSize = size / spriteSize;
    const { isDefeated = false, clipToHead = false, isBoss = false } = options;
    
    // For defeated cats, only render the head portion (skull effect)
    const startRow = clipToHead ? 2 : 0; // Start a bit lower to get ears
    const endRow = clipToHead ? 16 : spriteSize; // Include more of head
    const startCol = clipToHead ? 8 : 0; // Trim left side  
    const endCol = clipToHead ? spriteSize : spriteSize; // Keep full right side
    
    for (let row = startRow; row < endRow; row++) {
      for (let col = startCol; col < endCol; col++) {
        const char = spriteStr[row * spriteSize + col];
        let color = colors[char];
        
        if (color) { // Skip transparent (0)
          // Apply defeated effect (bleached/grayscale)
          if (isDefeated) {
            color = this.bleachColor(color);
          } else if (isBoss) {
            // Boss cat is pure black/dark
            color = this.darkenColor(color);
          } else if (tintColor && tintColor !== '#f07010' && tintColor !== null) {
            // Apply strong tint for non-orange cats, no tint for orange or null
            color = this.strongTint(color, tintColor);
          }
          
          this.ctx.fillStyle = color;
          this.ctx.fillRect(x + col * pixelSize, y + row * pixelSize, pixelSize, pixelSize);
        }
      }
    }
    
    // Draw special eyes
    if (isDefeated && clipToHead) {
      this.drawDefeatedEyes(x, y, size, spriteSize);
    } else if (isBoss) {
      this.drawBossEyes(x, y, size, spriteSize);
    }
  },
  
  // Strong tint - replaces orange pixels with target color, modulates others
  strongTint(baseColor, tintColor) {
    // For main orange sprite color, replace entirely
    if (baseColor === '#f07010') {
      return tintColor;
    }
    
    // For grey cats, use much stronger tinting to remove orange cast
    const tint = this.hexToRgb(tintColor);
    const isGrey = (tint.r === tint.g && tint.g === tint.b) || 
                   (Math.abs(tint.r - tint.g) < 20 && Math.abs(tint.g - tint.b) < 20);
    
    if (isGrey) {
      // For grey cats, almost completely replace with grey
      const base = this.hexToRgb(baseColor);
      const tintStrength = 0.85; // Very strong for greys
      
      const r = Math.floor(base.r * (1 - tintStrength) + tint.r * tintStrength);
      const g = Math.floor(base.g * (1 - tintStrength) + tint.g * tintStrength);
      const b = Math.floor(base.b * (1 - tintStrength) + tint.b * tintStrength);
      
      return `rgb(${r},${g},${b})`;
    } else {
      // For other colors, use moderate blend
      const base = this.hexToRgb(baseColor);
      const tintStrength = 0.6;
      
      const r = Math.floor(base.r * (1 - tintStrength) + tint.r * tintStrength);
      const g = Math.floor(base.g * (1 - tintStrength) + tint.g * tintStrength);
      const b = Math.floor(base.b * (1 - tintStrength) + tint.b * tintStrength);
      
      return `rgb(${r},${g},${b})`;
    }
  },

  // Blend original color with tint color  
  blendColors(baseColor, tintColor) {
    // Moderate tint blend - mix 60% original + 40% tint
    const base = this.hexToRgb(baseColor);
    const tint = this.hexToRgb(tintColor);
    const tintStrength = 0.4;
    
    const r = Math.floor(base.r * (1 - tintStrength) + tint.r * tintStrength);
    const g = Math.floor(base.g * (1 - tintStrength) + tint.g * tintStrength);
    const b = Math.floor(base.b * (1 - tintStrength) + tint.b * tintStrength);
    
    return `rgb(${r},${g},${b})`;
  },
  
  // Convert hex to RGB
  hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  },
  
  // Convert color to bleached/grayscale for defeated cats
  bleachColor(color) {
    const rgb = this.hexToRgb(color);
    // Convert to grayscale using luminance formula, then brighten
    const gray = Math.floor((rgb.r * 0.3 + rgb.g * 0.59 + rgb.b * 0.11) * 1.5);
    const bleached = Math.min(255, gray);
    return `rgb(${bleached},${bleached},${bleached})`;
  },
  
  // Darken color for boss cat
  darkenColor(color) {
    const rgb = this.hexToRgb(color);
    // Make it very dark/black
    const dark = Math.floor((rgb.r * 0.3 + rgb.g * 0.3 + rgb.b * 0.3) * 0.2);
    return `rgb(${dark},${dark},${dark})`;
  },
  
  // Draw X eyes for defeated cats
  drawDefeatedEyes(x, y, size, spriteSize) {
    const pixelSize = size / spriteSize;
    this.ctx.fillStyle = '#000000';
    
    // Eye positions (adjusted to match actual cat eye locations)
    const leftEyeX = x + 14 * pixelSize;
    const rightEyeX = x + 22 * pixelSize;
    const eyeY = y + 10 * pixelSize;
    const eyeWidth = pixelSize * 4;
    const eyeHeight = pixelSize * 3;
    
    // Draw black rectangle for left eye
    this.ctx.fillRect(leftEyeX, eyeY, eyeWidth, eyeHeight);
    
    // Draw black rectangle for right eye  
    this.ctx.fillRect(rightEyeX, eyeY, eyeWidth, eyeHeight);
  },
  
  // Draw yellow eyes for boss cat
  drawBossEyes(x, y, size, spriteSize) {
    const pixelSize = size / spriteSize;
    this.ctx.fillStyle = '#ffff00';
    
    // Eye positions (same as defeated eyes)
    const leftEyeX = x + 14 * pixelSize;
    const rightEyeX = x + 22 * pixelSize;
    const eyeY = y + 10 * pixelSize;
    const eyeWidth = pixelSize * 4;
    const eyeHeight = pixelSize * 3;
    
    // Draw yellow rectangle for left eye
    this.ctx.fillRect(leftEyeX, eyeY, eyeWidth, eyeHeight);
    
    // Draw yellow rectangle for right eye  
    this.ctx.fillRect(rightEyeX, eyeY, eyeWidth, eyeHeight);
  },
  
  // Draw cat using DOOM-style billboard sprite system
  drawCat(obj) {
    const { x, y, z, w, h, d, color, type } = obj;
    
    // Calculate distance from camera to original position for culling
    const dx = x - this.cam.x;
    const dy = (y + h/2) - this.cam.y;  
    const dz = z - this.cam.z;
    const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);
    
    // Skip if too far away
    if (distance > this.far) return;
    
    // Calculate grid square bounds and force cat to ground plane center
    const gridX = Math.floor(x / this.gridSize) * this.gridSize;
    const gridZ = Math.floor(z / this.gridSize) * this.gridSize;
    const gridSize = type === 'boss' ? this.gridSize * 2 : this.gridSize;
    
    // Force cat to exact center of grid square on ground plane
    const centerX = gridX + gridSize/2;
    const centerZ = gridZ + gridSize/2;
    const screenPos = this.project(centerX, 0, centerZ); // Force to ground (y=0)
    if (!screenPos) return;
    
    // Calculate corners for highlight
    const corners = [
      this.project(gridX, 0, gridZ),
      this.project(gridX + gridSize, 0, gridZ),
      this.project(gridX + gridSize, 0, gridZ + gridSize),
      this.project(gridX, 0, gridZ + gridSize)
    ];
    
    // Fixed size sprites - consistent size regardless of distance
    const spriteSize = type === 'boss' ? 80 : 40; // Boss bigger than regular cats
    
    // Check if cat is defeated by looking up in game state
    let isDefeated = false;
    if (obj.catId && window.G && window.G.turnOrder) {
      const catData = window.G.turnOrder.find(cat => cat.id === obj.catId);
      isDefeated = catData && !catData.v; // v = alive
      if (isDefeated) {
        console.log(`Cat ${obj.catId} is defeated: hp=${catData.h}, alive=${catData.v}`);
      }
    }
    
    // Draw highlight square for active player's grid position only
    if (window.G && window.G.combat && window.G.turnOrder) {
      const activeCat = window.G.turnOrder[window.G.currentTurn];
      const isActiveCat = obj.catId === activeCat.id;
      
      if (isActiveCat) {
        this.ctx.strokeStyle = isDefeated ? 'rgba(100,100,100,0.8)' : 'rgba(255,255,0,0.8)';
        this.ctx.lineWidth = 3;
        
        // Fill the square with a subtle glow
        this.ctx.fillStyle = isDefeated ? 'rgba(100,100,100,0.1)' : 'rgba(255,255,0,0.1)';
        if (corners.every(c => c)) {
          this.ctx.beginPath();
          this.ctx.moveTo(corners[0].x, corners[0].y);
          this.ctx.lineTo(corners[1].x, corners[1].y);
          this.ctx.lineTo(corners[2].x, corners[2].y);
          this.ctx.lineTo(corners[3].x, corners[3].y);
          this.ctx.closePath();
          this.ctx.fill();
          this.ctx.stroke();
        }
      }
    }
    
    // Draw sprite as billboard (always faces camera)
    let spriteTop = screenPos.y - spriteSize;
    
    // Boss cat needs to render lower since it's bigger
    if (type === 'boss') {
      spriteTop += 10; // Lower the boss sprite (split the difference)
    }
    
    // Defeated cats need offset too since they're clipped
    if (isDefeated) {
      spriteTop += spriteSize * 0.4; // Pull skull sprites down
    }
    
    this.drawSprite(
      this.sprites.cat, 
      this.sprites.colors,
      screenPos.x - spriteSize/2, 
      spriteTop, 
      spriteSize,
      this.sprites.size, // Use dynamic sprite size
      type === 'boss' ? null : color, // Boss is black (no tint), others get tint
      { isDefeated, clipToHead: isDefeated, isBoss: type === 'boss' } // Pass defeat options
    );
    
    // Store sprite screen position for arrow rendering
    obj.screenTop = { x: screenPos.x, y: spriteTop };
  },
  
  // Draw windows only on visible building faces with varied colors/sizes
  drawBuildingWindows(building) {
    const { x, y, z, w, h, d, windowColors } = building;
    
    // Check which faces are visible using same logic as drawBox
    const faces = [
      { normal: [-1, 0, 0], side: 'left', index: 0 },   // Left face
      { normal: [1, 0, 0], side: 'right', index: 1 },   // Right face
      { normal: [0, 0, -1], side: 'front', index: 2 },  // Front face
      { normal: [0, 0, 1], side: 'back', index: 3 }     // Back face
    ];
    
    // Use exact same face culling logic as drawBox
    const visibleFaces = faces.filter(face => {
      const faceCenter = [
        x + w/2 + face.normal[0] * w/2,
        y + h/2 + face.normal[1] * h/2,
        z + d/2 + face.normal[2] * d/2
      ];
      const toCam = [
        this.cam.x - faceCenter[0],
        this.cam.y - faceCenter[1], 
        this.cam.z - faceCenter[2]
      ];
      // Dot product with face normal - positive means facing camera
      return face.normal[0] * toCam[0] + face.normal[1] * toCam[1] + face.normal[2] * toCam[2] > 0;
    });

    visibleFaces.forEach(face => {
        // More windows per building - every 6 units instead of 10
        const windowSpacing = 6;
        const windowRows = Math.floor(h / windowSpacing);
        
        for (let f = 1; f <= windowRows; f++) {
          const wy = f * windowSpacing - 3;
          
          // Minimum square height that can grow taller
          const windowW = 2.5; // Fixed width
          const minH = windowW; // Minimum = square (same as width)
          const maxH = windowW * 2; // Can grow up to 2x width
          const seed = Math.sin(f * 1.7 + x * 0.3 + z * 0.7) * 0.5 + 0.5;
          
          // Check if window would exceed building height with padding
          const padding = 3; // Leave 3 units from top
          const maxAllowedH = Math.max(minH, h - wy - padding);
          const clampedMaxH = Math.min(maxH, maxAllowedH);
          const windowH = minH + seed * (clampedMaxH - minH);
          
          // Use pre-generated colors to prevent vibration
          const colorIndex = Math.floor((f - 1) * 4 + face.index * 2);
          const windowColor = windowColors && windowColors[f - 1] && windowColors[f - 1][colorIndex] 
            ? windowColors[f - 1][colorIndex] 
            : '#FFA500'; // fallback
          
          if (face.side === 'front') {
            this.drawBox(x + 2, y + wy, z - 0.1, windowW, windowH, 0.2, windowColor);
            if (w > 10) {
              const colorIndex2 = colorIndex + 1;
              const windowColor2 = windowColors && windowColors[f - 1] && windowColors[f - 1][colorIndex2] 
                ? windowColors[f - 1][colorIndex2] 
                : '#FFD700'; // fallback
              this.drawBox(x + w - 2 - windowW, y + wy, z - 0.1, windowW, windowH, 0.2, windowColor2);
            }
          } else if (face.side === 'back') {
            this.drawBox(x + 2, y + wy, z + d - 0.1, windowW, windowH, 0.2, windowColor);
            if (w > 10) {
              const colorIndex2 = colorIndex + 1;
              const windowColor2 = windowColors && windowColors[f - 1] && windowColors[f - 1][colorIndex2] 
                ? windowColors[f - 1][colorIndex2] 
                : '#FFD700'; // fallback
              this.drawBox(x + w - 2 - windowW, y + wy, z + d - 0.1, windowW, windowH, 0.2, windowColor2);
            }
          } else if (face.side === 'left') {
            this.drawBox(x - 0.1, y + wy, z + 2, 0.2, windowH, windowW, windowColor);
            if (d > 10) {
              const colorIndex2 = colorIndex + 1;
              const windowColor2 = windowColors && windowColors[f - 1] && windowColors[f - 1][colorIndex2] 
                ? windowColors[f - 1][colorIndex2] 
                : '#FFD700'; // fallback
              this.drawBox(x - 0.1, y + wy, z + d - 2 - windowW, 0.2, windowH, windowW, windowColor2);
            }
          } else if (face.side === 'right') {
            this.drawBox(x + w - 0.1, y + wy, z + 2, 0.2, windowH, windowW, windowColor);
            if (d > 10) {
              const colorIndex2 = colorIndex + 1;
              const windowColor2 = windowColors && windowColors[f - 1] && windowColors[f - 1][colorIndex2] 
                ? windowColors[f - 1][colorIndex2] 
                : '#FFD700'; // fallback
              this.drawBox(x + w - 0.1, y + wy, z + d - 2 - windowW, 0.2, windowH, windowW, windowColor2);
            }
          }
        }
    });
  },
  
  // Camera controls
  moveCamera(dx, dy, dz) {
    this.cam.x += dx;
    this.cam.y += dy;
    this.cam.z += dz;
  },
  
  rotateCamera(drx, dry) {
    this.cam.rx = Math.max(-Math.PI/2, Math.min(Math.PI/2, this.cam.rx + drx));
    this.cam.ry += dry;
  },
  
  zoomCamera(factor) {
    this.cam.zoom = Math.max(0.5, Math.min(3, this.cam.zoom * factor));
  },
  
  // Set camera to isometric view
  setIsometric() {
    this.cam.rx = -Math.PI / 4;
    this.cam.ry = Math.PI / 4;
    this.cam.y = 50;
    this.cam.zoom = 1;
  }
};