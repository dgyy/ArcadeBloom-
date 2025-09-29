// Tactical cat battle royale with full 3D movement
let G = {
  s: 'splash', // 'splash', 'menu', 'playing', 'combat'
  p: null,
  cs: [],
  t: 0,
  k: new Set(),
  mouseDrag: false,
  rightMouseDrag: false,
  lastMouse: { x: 0, y: 0 },
  
  // WebSocket
  w: null,
  id: 'cat_' + (Math.random() * 1e6 | 0),
  
  // Combat state
  combat: null,
  turnOrder: [],
  currentTurn: 0,
  currentActions: 3,
  actionType: null, // 'move' or 'attack'
  attackCount: 0,
  moveDistance: 0, // Track movement used this turn
  eventLog: [],
  targetDialog: null, // Target selection state
  healDialog: false, // Healing spell selection
  showStatBlock: false, // T key toggle for stat display
  
  // Menu state
  menuSelection: 0, // 0 = Start Game, 1 = Join Game
  roomCode: '', // 4-letter room code
  gameMode: null, // 'host' or 'join'
  connectedPlayers: 0, // Number of connected players
  ws: null, // WebSocket connection
  

  // Initialize
  init() {
    console.log('INIT CALLED');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initAfterDOM());
    } else {
      this.initAfterDOM();
    }
  },
  
  initAfterDOM() {
    console.log('INIT AFTER DOM CALLED');
    const canvas = document.querySelector('canvas');
    console.log('CANVAS FOUND:', canvas);
    
    E.init(canvas);
    
    // Initialize city/grid for menu background
    this.generateCity();
    
    // Natural cat colors - sequential assignment, no replacement  
    this.catColors = [null, '#CD853F', '#D2691E', '#A0A0A0', '#F5DEB3', '#DDA0DD']; // Original Orange, Sandy Brown, Tan, Light Gray, Cream, Plum
    
    // Camera controls - set up once
    canvas.addEventListener('mousedown', e => {
      if (e.button === 0) {  // Left click
        this.mouseDrag = true;
      } else if (e.button === 2) {  // Right click
        this.rightMouseDrag = true;
        e.preventDefault();
      }
      this.lastMouse = { x: e.clientX, y: e.clientY };
    });
    
    canvas.addEventListener('mouseup', () => {
      this.mouseDrag = false;
      this.rightMouseDrag = false;
    });
    
    canvas.addEventListener('contextmenu', e => {
      e.preventDefault(); // Disable right-click menu
    });
    
    canvas.addEventListener('mousemove', e => {
      if (this.mouseDrag || this.rightMouseDrag) {
        const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        
        if (this.mouseDrag) {
          // Left drag: rotate camera
          E.rotateCamera(-dy * 0.01, dx * 0.01);
        } else if (this.rightMouseDrag) {
          // Right drag: move camera relative to rotation
          const moveSpeed = 0.5;
          const camYaw = E.cam.ry;
          const cos = Math.cos(camYaw);
          const sin = Math.sin(camYaw);
          
          // Horizontal drag = strafe left/right relative to camera
          const strafeX = dx * cos * moveSpeed;
          const strafeZ = dx * sin * moveSpeed;
          
          // Vertical drag = move forward/back relative to camera
          const forwardX = -dy * sin * moveSpeed;
          const forwardZ = dy * cos * moveSpeed;
          
          E.moveCamera(strafeX + forwardX, 0, strafeZ + forwardZ);
        }
        
        this.lastMouse = { x: e.clientX, y: e.clientY };
      }
    });
    
    // Set up keyboard controls now that DOM is ready
    this.setupKeyboardControls();
    
    // Hide UI elements initially (in splash state)
    this.updateUI();
    
    // Start animation loop
    this.loop();
  },
  
  spawnCats() {
    // Clear any existing objects
    E.objects = [];
    this.cs = [];
    
    // Only generate player if not already created (for non-multiplayer or if missing)
    if (!this.p) {
      this.p = P.g('You');
      this.p.id = this.id; // Use the unique session ID
      const angle = Math.random() * Math.PI * 2;
      const distance = 4 + Math.floor(Math.random() * 7); // 4-10 grid units from center
      const rawX = Math.cos(angle) * distance * 5; // 5-unit grid
      const rawZ = Math.sin(angle) * distance * 5;
      this.p.pos = { 
        x: Math.round(rawX / 5) * 5, // Snap to 5-unit grid
        y: 0, 
        z: Math.round(rawZ / 5) * 5 
      };
      this.p.color = this.catColors[0] || '#f07010'; // Player gets original orange (no tint)
    }
    this.lastCatPos = { x: this.p.pos.x, z: this.p.pos.z };
    
    // Add player to scene
    E.add('cat', this.p.pos.x, this.p.pos.y, this.p.pos.z, 3, 5, 3, this.p.color);
    // Set catId on the player's object
    const playerObj = E.objects[E.objects.length - 1];
    playerObj.catId = this.p.id;
    
    // Add BOSS CAT - 10ft x 10ft black cat
    const boss = P.g('??????');
    boss.id = 'boss';
    boss.n = '??????';
    // Create copy of class to avoid corrupting shared reference
    boss.c = { ...boss.c, n: '??????' };
    boss.isBoss = true;
    boss.isAI = true; // Boss is AI controlled
    // Make boss challenging but balanced
    boss.h = boss.m = 60; // 60 HP (reduced from 100)
    boss.a = 16; // High but not impossible AC
    boss.c.a = 3; // Moderate attack bonus
    boss.s = { S: 16, D: 14, C: 16, I: 10, W: 12, H: 8 }; // Strong but balanced stats
    boss.color = '#000000'; // Black
    boss.pos = { x: 0, y: 0, z: 30 }; // Center-back position
    this.cs.push(boss);
    const bossObj = { type: 'boss', x: boss.pos.x, y: boss.pos.y, z: boss.pos.z, w: 10, h: 10, d: 10, color: boss.color, catId: boss.id };
    E.objects.push(bossObj);
    
    // Add any joined players to the cats array
    if (this.joinedPlayers) {
      this.joinedPlayers.forEach(joinedPlayer => {
        this.cs.push(joinedPlayer);
        E.add('cat', joinedPlayer.pos.x, joinedPlayer.pos.y, joinedPlayer.pos.z, 3, 5, 3, joinedPlayer.color);
        E.objects[E.objects.length - 1].catId = joinedPlayer.id;
      });
    }

    // Fill remaining slots with AI cats up to 6 total players (not counting boss)
    const totalPlayers = 6;
    const aiCatsNeeded = totalPlayers - this.connectedPlayers;
    const usedPositions = new Set([`${this.p.pos.x},${this.p.pos.z}`, '0,30']); // Player actual pos, boss at 0,30
    
    // Mark joined player positions as used
    if (this.joinedPlayers) {
      this.joinedPlayers.forEach(p => {
        usedPositions.add(`${p.pos.x},${p.pos.z}`);
      });
    }
    
    for (let i = 0; i < aiCatsNeeded; i++) {
      const aiCat = P.g(`AI Cat ${i+1}`);
      aiCat.id = `ai_${i}`;
      aiCat.isAI = true; // Mark as AI for turn behavior
      // Sequential color assignment - player gets 0, AI cats get 1,2,3,4,5
      const colorIndex = (i + 1) % this.catColors.length;
      aiCat.color = this.catColors[colorIndex] || '#f07010';
      
      // Find available grid position
      let x, z, posKey;
      do {
        x = (Math.floor(Math.random() * 12) - 6) * 5; // -30 to +30 in 5ft increments
        z = (Math.floor(Math.random() * 12) - 6) * 5;
        posKey = `${x},${z}`;
      } while (usedPositions.has(posKey));
      
      usedPositions.add(posKey);
      aiCat.pos = { x, y: 0, z };
      this.cs.push(aiCat);
      const catObj = { type: 'cat', x: aiCat.pos.x, y: aiCat.pos.y, z: aiCat.pos.z, w: 3, h: 5, d: 3, color: aiCat.color, catId: aiCat.id };
      E.objects.push(catObj);
    }
    
    // Add player to cats array
    this.cs.unshift(this.p);
    
    // Debug: Log final cat breakdown
    console.log('=== FINAL CAT BREAKDOWN ===');
    console.log('Total cats:', this.cs.length);
    console.log('Connected players:', this.connectedPlayers);
    console.log('AI cats needed:', 6 - this.connectedPlayers);
    console.log('Cats by type:');
    this.cs.forEach((c, i) => {
      const type = c.isBoss ? 'BOSS' : (c.isAI ? 'AI' : 'PLAYER');
      console.log(`  ${i}: ${type} - ${c.c.n}(${c.id})`);
    });
    console.log('===========================');
    
    // Position camera behind and above cat for proper view
    E.cam.x = this.p.pos.x;
    E.cam.y = 25;  
    E.cam.z = this.p.pos.z + 25;  // Behind cat (positive Z)
    E.cam.rx = -0.3;  // Looking down at cat
    E.cam.ry = Math.PI;  // Face towards cat
    
    // Camera controls - use E.canvas
    if (E.canvas && !this.cameraControlsSetup) {
      this.cameraControlsSetup = true; // Prevent duplicate listeners
      E.canvas.addEventListener('mousedown', e => {
        if (e.button === 0) {  // Left click
          this.mouseDrag = true;
        } else if (e.button === 2) {  // Right click
          this.rightMouseDrag = true;
          e.preventDefault();
        }
        this.lastMouse = { x: e.clientX, y: e.clientY };
      });
    
      E.canvas.addEventListener('mouseup', () => {
        this.mouseDrag = false;
        this.rightMouseDrag = false;
      });
      
      E.canvas.addEventListener('contextmenu', e => {
        e.preventDefault(); // Disable right-click menu
      });
      
      E.canvas.addEventListener('mousemove', e => {
        if (this.mouseDrag || this.rightMouseDrag) {
          const dx = e.clientX - this.lastMouse.x;
        const dy = e.clientY - this.lastMouse.y;
        
        if (this.mouseDrag) {
          // Left drag: rotate camera
          E.rotateCamera(-dy * 0.01, dx * 0.01);
        } else if (this.rightMouseDrag) {
          // Right drag: move camera relative to rotation
          const moveSpeed = 0.5;
          const camYaw = E.cam.ry;
          const cos = Math.cos(camYaw);
          const sin = Math.sin(camYaw);
          
          // Horizontal drag = strafe left/right relative to camera
          const strafeX = dx * cos * moveSpeed;
          const strafeZ = dx * sin * moveSpeed;
          
          // Vertical drag = move up/down (global Y)
          E.moveCamera(strafeX, -dy * moveSpeed, strafeZ);
        }
        
        this.lastMouse = { x: e.clientX, y: e.clientY };
      }
    });
    
      E.canvas.addEventListener('wheel', e => {
        const factor = e.deltaY > 0 ? 1.1 : 0.9;
        E.zoomCamera(factor);
        e.preventDefault();
      });
    }
    
  },
  
  setupKeyboardControls() {
    console.log('SETTING UP KEYBOARD CONTROLS');
    
    // Complete keyboard handler
    document.addEventListener('keydown', (e) => {
      console.log('KEY:', e.key, e.code, 'STATE:', this.s);
      this.k.add(e.code);
      
      if (e.code === 'Space' || e.key === ' ') {
        console.log('SPACE DETECTED IN STATE:', this.s);
        e.preventDefault();
        if (this.s === 'splash') {
          this.s = 'menu';
          console.log('CHANGED STATE TO MENU');
        } else if (this.combat) {
          if (this.gameMode === 'host') {
            this.nextTurn();
          } else {
            this.send('end_turn', {});
          }
        }
      }
      
      // Menu navigation
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.menuUp();
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        this.menuDown();
      }
      if (e.code === 'Enter') {
        this.menuSelect();
      }
      
      // Game controls
      if (e.code === 'KeyI') E.setIsometric();
      
      // Only allow action commands if it's the player's turn
      const isMyTurn = this.combat && this.turnOrder && this.turnOrder[this.currentTurn]?.id === this.p?.id;
      if (isMyTurn) {
        if (e.code === 'KeyM') this.setAction('move');
        if (e.code === 'KeyX') this.setAction('attack');
        if (e.code === 'KeyC') this.setAction('cast');
        if (e.code === 'KeyH') this.setAction('heal');
        if (e.code === 'KeyZ') this.setAction('stealth');
      }
      if (e.code === 'KeyT') this.showStatBlock = !this.showStatBlock;
      if (e.code === 'Escape') this.endAction();
      
      // Target selection with digit keys
      if (this.targetDialog) {
        if (e.code === 'Digit1') this.selectTarget(1);
        if (e.code === 'Digit2') this.selectTarget(2);
        if (e.code === 'Digit3') this.selectTarget(3);
        if (e.code === 'Digit4') this.selectTarget(4);
        if (e.code === 'Digit5') this.selectTarget(5);
        if (e.code === 'Digit6') this.selectTarget(6);
      }
      
      // Heal selection with digit keys
      if (this.healDialog) {
        if (e.code === 'Digit1') this.executeHeal(1);
        if (e.code === 'Digit2') this.executeHeal(2);
        if (e.code === 'Digit3') this.executeHeal(3);
      }
    });
    
    document.addEventListener('keyup', (e) => {
      this.k.delete(e.code);
    });
    
    console.log('KEYBOARD SETUP COMPLETE');
  },
  
  // Connect to multiplayer
  connect() {
    try {
      this.w = new WebSocket('wss://relay.js13kgames.com/roll-for-mischief');
      this.w.onopen = () => this.send('join', { id: this.id, cat: this.p });
      this.w.onmessage = e => {
        try {
          const msg = JSON.parse(e.data);
          this.handle(msg);
        } catch (err) {}
      };
    } catch (e) {}
  },
  
  // Send message
  send(type, data) {
    if (this.w && this.w.readyState === 1) {
      this.w.send(JSON.stringify({ type, data: { ...data, id: this.id } }));
    }
  },
  
  // Handle message
  handle(msg) {
    switch (msg.type) {
      case 'join':
        if (msg.data.id !== this.id) {
          const cat = msg.data.cat;
          cat.id = msg.data.id;
          this.cs.push(cat);
          E.add('cat', cat.pos.x, cat.pos.y, cat.pos.z, 3, 5, 3, '#654321');
        }
        break;
      case 'move':
        if (msg.data.id !== this.id) {
          const cat = this.cs.find(c => c.id === msg.data.id);
          if (cat) {
            cat.pos = msg.data.pos;
            const catObj = E.objects.find(obj => obj.type === 'cat' && obj.x === cat.pos.x && obj.z === cat.pos.z);
            if (catObj) {
              catObj.x = cat.pos.x;
              catObj.z = cat.pos.z;
            }
          }
        }
        break;
    }
  },
  
  // Generate 3D city with proper streets
  generateCity(forGame = false, buildingData = null) {
    console.log('generateCity called:', { forGame, hasBuildingData: !!buildingData, state: this.s });
    
    // Only generate buildings when explicitly requested or in playing state
    if (forGame) {
      console.log('BUILDING GENERATION STARTING');
      
      if (buildingData) {
        console.log('Using provided building data:', buildingData.length);
        // Use provided building data (for clients)
        buildingData.forEach(b => {
          E.add('building', b.x, b.y, b.z, b.w, b.h, b.d, b.color);
        });
        return;
      }
      
      console.log('Generating new buildings for host');
      // Street width = 20ft (4 tiles)
      // Buildings are 30x30ft on average
      
      for (let bx = -5; bx <= 5; bx++) {
        for (let bz = -5; bz <= 5; bz++) {
          // Building block position
          const blockX = bx * 60; // 30ft building + 30ft space
          const blockZ = bz * 60;
          
          // Skip center for spawn
          if (Math.abs(bx) <= 1 && Math.abs(bz) <= 1) continue;
          
          // Building dimensions
          const w = 25 + Math.random() * 10; // 25-35ft
          const h = 15 + Math.random() * 50; // 15-65ft tall
          const d = 25 + Math.random() * 10;
          
          // Building color variants
          const colors = ['#4a4a6a', '#5a5a7a', '#6a5a7a', '#5a6a7a'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          const x = blockX - w/2, y = 0, z = blockZ - d/2;
          console.log('Adding building:', { x, y, z, w, h, d, color });
          E.add('building', x, y, z, w, h, d, color);
          
          // Store building data for syncing
          if (this.buildings) {
            this.buildings.push({ x, y, z, w, h, d, color });
            console.log('Stored building, total:', this.buildings.length);
          }
        }
      }
      
      // Add some smaller buildings between blocks
      for (let i = 0; i < 20; i++) {
        const x = (Math.random() - 0.5) * 400;
        const z = (Math.random() - 0.5) * 400;
        
        // Don't place too close to center
        if (Math.abs(x) < 50 && Math.abs(z) < 50) continue;
        
        const w = 10 + Math.random() * 15;
        const h = 8 + Math.random() * 25;
        const d = 10 + Math.random() * 15;
        
        const y = 0, color = '#3a3a5a';
        E.add('building', x, y, z, w, h, d, color);
        
        // Store building data for syncing
        if (this.buildings) {
          this.buildings.push({ x, y, z, w, h, d, color });
        }
      }
    }
  },
  
  // Game loop
  loop() {
    this.update();
    this.render();
    requestAnimationFrame(() => this.loop());
  },
  
  // Update
  update() {
    // Only update game world when actually playing and player exists
    if (this.s === 'playing' && this.p) {
      this.updateCamera();
      this.updatePlayer();
    }
  },
  
  // Update camera movement
  updateCamera() {
    const speed = 2;
    
    // Calculate movement relative to camera rotation
    const camYaw = -E.cam.ry;  // Try negative to fix coordination
    const cos = Math.cos(camYaw);
    const sin = Math.sin(camYaw);
    
    
    if (this.k.has('KeyW')) {
      // Forward relative to camera
      E.moveCamera(-sin * speed, 0, cos * speed);
    }
    if (this.k.has('KeyS')) {
      // Backward relative to camera
      E.moveCamera(sin * speed, 0, -cos * speed);
    }
    if (this.k.has('KeyA')) {
      // Left relative to camera
      E.moveCamera(-cos * speed, 0, -sin * speed);
    }
    if (this.k.has('KeyD')) {
      // Right relative to camera
      E.moveCamera(cos * speed, 0, sin * speed);
    }
    if (this.k.has('KeyQ')) E.moveCamera(0, speed, 0);
    if (this.k.has('KeyE')) E.moveCamera(0, -speed, 0);
  },
  
  // Check if position is occupied by a cat
  occupied(x, z, e = null) {
    // Check player position (only if alive)
    if (this.p && this.p !== e && this.p.v && this.p.pos.x === x && this.p.pos.z === z) return 1;
    
    // Check all cats (only living cats block movement)
    return this.cs.some(c => {
      if (c === e || !c.v) return false; // Dead cats don't block
      
      if (c.isBoss) {
        // Boss cat occupies 2x2 grid - use EXACT same logic as 3D rendering engine
        const gridSize = 5; // this.gridSize
        const gridX = Math.floor(c.pos.x / gridSize) * gridSize;
        const gridZ = Math.floor(c.pos.z / gridSize) * gridSize;
        const bossGridSize = gridSize * 2; // Boss is 2x2
        
        return x >= gridX && x < gridX + bossGridSize && 
               z >= gridZ && z < gridZ + bossGridSize;
      } else {
        // Regular cat occupies single 5ft square
        return c.pos.x === x && c.pos.z === z;
      }
    });
  },
  
  // Update player
  updatePlayer() {
    if (!this.p || !this.p.pos) return; // Wait for player and position to be initialized
    
    const moveDelay = 300; // Turn-based feel
    const now = Date.now();
    
    if (this.combat) {
      // In combat, only current player can move and must have actions/move selected
      if (this.turnOrder[this.currentTurn]?.id !== this.p.id) return;
      if (this.actionType !== 'move' || this.currentActions <= 0) return;
      if (this.moveDistance >= 25) return; // Max 25ft movement per turn
    }
    
    if (!this.lastMove || now - this.lastMove > moveDelay) {
      let moved = false; // Define moved outside both branches
      
      if (this.gameMode === 'host') {
        // Host processes movement locally
        const gridSize = 5; // 5ft squares
        let newX = this.p.pos.x;
        let newZ = this.p.pos.z;
        
        // Calculate new position based on input
        if (this.k.has('ArrowUp')) {
          newZ -= gridSize;  // North
        }
        if (this.k.has('ArrowDown')) {
          newZ += gridSize;  // South
        }
        if (this.k.has('ArrowLeft')) {
          newX += gridSize;  // East
        }
        if (this.k.has('ArrowRight')) {
          newX -= gridSize;  // West
        }
        
        // Only move if the new position is not occupied
        if ((newX !== this.p.pos.x || newZ !== this.p.pos.z) && !this.occupied(newX, newZ, this.p)) {
          this.p.pos.x = newX;
          this.p.pos.z = newZ;
          moved = true;
        }
      } else {
        // Client sends movement request to host
        const gridSize = 5;
        let newX = this.p.pos.x;
        let newZ = this.p.pos.z;
        let requestMove = false;
        
        // Calculate desired position
        if (this.k.has('ArrowUp')) {
          newZ -= gridSize;
          requestMove = true;
        }
        if (this.k.has('ArrowDown')) {
          newZ += gridSize;
          requestMove = true;
        }
        if (this.k.has('ArrowLeft')) {
          newX += gridSize;
          requestMove = true;
        }
        if (this.k.has('ArrowRight')) {
          newX -= gridSize;
          requestMove = true;
        }
        
        if (requestMove && (newX !== this.p.pos.x || newZ !== this.p.pos.z)) {
          this.send('player_move', { 
            targetX: newX, 
            targetZ: newZ, 
            playerId: this.p.id,
            currentActions: this.currentActions,
            moveDistance: this.moveDistance 
          });
          this.lastMove = now; // Prevent spam
          
          // Track movement distance locally for client
          if (this.combat && this.actionType === 'move') {
            this.moveDistance += 5;
            this.addEvent(`Moved 5ft (${this.moveDistance}/25ft used)`);
            
            // Consume action every 25ft of movement
            if (this.moveDistance >= 25) {
              this.currentActions--;
              this.moveDistance = 0;
              this.addEvent(`Movement action consumed. ${this.currentActions} actions remaining.`);
              if (this.currentActions <= 0) this.actionType = null;
              
              // Send updated action count to host
              this.send('player_move', { 
                targetX: newX, 
                targetZ: newZ, 
                playerId: this.p.id,
                currentActions: this.currentActions,
                moveDistance: this.moveDistance 
              });
            }
          }
        }
        return; // Don't process position locally - host handles that
      }
      
      if (moved) {
        this.lastMove = now;
        
        // Track movement distance in combat
        if (this.combat && this.actionType === 'move') {
          this.moveDistance += 5;
          this.addEvent(`Moved 5ft (${this.moveDistance}/25ft used)`);
          
          // Consume action every 25ft of movement
          if (this.moveDistance >= 25) {
            this.currentActions--;
            this.moveDistance = 0; // Reset for next action
            this.addEvent(`Movement action consumed. ${this.currentActions} actions remaining.`);
            if (this.currentActions <= 0) this.actionType = null;
          }
        }
        
        // Update cat in scene
        const catIndex = E.objects.findIndex(obj => obj.type === 'cat');
        if (catIndex >= 0) {
          E.objects[catIndex].x = this.p.pos.x;
          E.objects[catIndex].z = this.p.pos.z;
        }
        
        // Send movement to other players
        this.send('move', { pos: this.p.pos });
        
        // Check for nearby enemies
        this.checkCombat();
        
        // Camera following - only for host (clients don't manage their own position)
        if (this.gameMode === 'host') {
          const deltaX = this.p.pos.x - this.lastCatPos.x;
          const deltaZ = this.p.pos.z - this.lastCatPos.z;
          
          E.cam.x += deltaX;  // Move camera by exact same amount
          E.cam.z += deltaZ;
        }
        
        // Store current cat position for next time
        this.lastCatPos = { x: this.p.pos.x, z: this.p.pos.z };
      }
    }
  },
  
  // Check for combat initiation
  checkCombat() {
    // Look for nearby cats within 30ft (6 squares)
    const nearby = this.cs.filter(cat => {
      const dx = cat.pos.x - this.p.pos.x;
      const dz = cat.pos.z - this.p.pos.z;
      const dist = Math.sqrt(dx*dx + dz*dz);
      return dist <= 30 && cat.v;
    });
    
    if (nearby.length > 0 && !this.combat) {
      this.startCombat([this.p, ...nearby]);
    }
  },
  
  // Start tactical combat
  startCombat(cats) {
    this.combat = {
      participants: cats,
      round: 1
    };
    
    // Roll initiative for all participants
    cats.forEach(cat => P.i(cat));
    this.turnOrder = cats.sort((a, b) => b.i - a.i);
    
    // Start with highest initiative (index 0)
    this.currentTurn = 0;
    
    console.log(`Combat started! Turn order: ${this.turnOrder.map(c => c.c.n).join(', ')}`);
    
    // Start the first turn
    const firstCat = this.turnOrder[0];
    this.addEvent(`${firstCat.c.n}'s turn begins`);
    
    // If first cat is AI, trigger its behavior
    if (firstCat.isAI && firstCat.v) {
      setTimeout(() => this.runAITurn(firstCat), 1000);
    }
    
    // Position camera for combat
    const centerX = cats.reduce((sum, c) => sum + c.pos.x, 0) / cats.length;
    const centerZ = cats.reduce((sum, c) => sum + c.pos.z, 0) / cats.length;
    
    E.cam.x = centerX;
    E.cam.z = centerZ + 40;
    E.cam.y = 25;
    E.cam.rx = -0.3;
  },
  
  // Handle space key
  handleSpace() {
    if (this.s === 'splash') {
      this.s = 'menu';
    } else if (this.combat) {
      this.nextTurn();
    }
  },
  
  // Menu navigation
  menuUp() {
    if (this.s === 'menu') {
      this.menuSelection = Math.max(0, this.menuSelection - 1);
    } else if (this.s === 'lobby' && this.gameMode === 'host') {
      this.menuSelection = Math.max(0, this.menuSelection - 1);
    }
  },
  
  menuDown() {
    if (this.s === 'menu') {
      this.menuSelection = Math.min(1, this.menuSelection + 1);
    } else if (this.s === 'lobby' && this.gameMode === 'host') {
      this.menuSelection = Math.min(2, this.menuSelection + 1);
    }
  },
  
  menuSelect() {
    if (this.s === 'menu') {
      if (this.menuSelection === 0) {
        this.startGame();
      } else {
        this.joinGame();
      }
    } else if (this.s === 'lobby') {
      if (this.gameMode === 'host') {
        if (this.menuSelection === 0) {
          // Start with current players
          console.log('Host starting game, sending game_start message');
          this.send('game_start', { roomCode: this.roomCode });
          this.s = 'playing';
          this.initGame();
          // Send full game state after initialization
          setTimeout(() => {
            console.log('Host sending game state');
            this.syncGameState();
          }, 500);
        } else if (this.menuSelection === 1) {
          // Start solo
          this.connectedPlayers = 1;
          this.s = 'playing';
          this.initGame();
        } else {
          // Back to menu
          this.s = 'menu';
          this.menuSelection = 0;
        }
      } else {
        // Joined player - only back to menu option
        this.s = 'menu';
        this.menuSelection = 0;
      }
    }
  },
  
  startGame() {
    this.gameMode = 'host';
    this.roomCode = this.generateRoomCode();
    console.log('Starting game with room code:', this.roomCode);
    this.s = 'lobby';
    this.connectToLobby();
  },
  
  joinGame() {
    this.gameMode = 'join';
    const code = prompt('Enter 4-letter room code:');
    if (code && code.length === 4) {
      this.roomCode = code.toUpperCase();
      console.log('Joining game with room code:', this.roomCode);
      this.s = 'lobby';
      this.connectToJoinLobby();
    }
  },

  connectToJoinLobby() {
    try {
      this.connectedPlayers = 0; // Will be updated when we join
      this.ws = new WebSocket('wss://relay.js13kgames.com/roll-for-mischief');
      this.ws.onopen = () => {
        // Generate client's player character
        this.generateClientPlayer();
        this.send('join_room', { id: this.id, playerData: this.p });
        console.log('Joining lobby as player:', this.roomCode);
        // Request current room state after a brief delay
        setTimeout(() => {
          this.send('request_room_state', { id: this.id });
        }, 100);
      };
      this.ws.onmessage = e => {
        // Skip non-JSON messages (relay server sends @ and + prefixed messages)
        if (typeof e.data === 'string' && (e.data.startsWith('@') || e.data.startsWith('+'))) {
          return;
        }
        try {
          const msg = JSON.parse(e.data);
          this.handleLobbyMessage(msg);
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      };
      this.ws.onclose = () => console.log('WebSocket closed');
      this.ws.onerror = err => console.error('WebSocket error:', err);
    } catch (err) {
      console.error('WebSocket connection failed:', err);
      this.connectedPlayers = 1; // Fallback to offline mode
    }
  },
  
  connectToLobby() {
    try {
      // Generate host's player character  
      this.generateClientPlayer();
      this.connectedPlayers = 1; // Host starts with 1
      this.ws = new WebSocket('wss://relay.js13kgames.com/roll-for-mischief');
      this.ws.onopen = () => {
        this.send('create_room', { roomCode: this.roomCode, id: this.id, host: true });
        console.log('Connected to lobby as host:', this.roomCode);
      };
      this.ws.onmessage = e => {
        // Skip non-JSON messages (relay server sends @ and + prefixed messages)
        if (typeof e.data === 'string' && (e.data.startsWith('@') || e.data.startsWith('+'))) {
          return;
        }
        try {
          const msg = JSON.parse(e.data);
          this.handleLobbyMessage(msg);
        } catch (err) {
          console.error('WebSocket message error:', err);
        }
      };
      this.ws.onclose = () => console.log('WebSocket closed');
      this.ws.onerror = err => console.error('WebSocket error:', err);
    } catch (err) {
      console.error('WebSocket connection failed:', err);
      this.connectedPlayers = 1; // Fallback to offline mode
    }
  },

  send(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Send to relay - it will broadcast to other clients
      const message = JSON.stringify({ type, ...data, room: this.roomCode });
      this.ws.send(message);
      console.log('Sending:', message);
    }
  },

  handleLobbyMessage(msg) {
    console.log('Lobby message received:', msg);
    
    // Filter messages by room code
    if (msg.room !== this.roomCode && msg.roomCode !== this.roomCode) {
      console.log('Ignoring message from different room:', msg.room || msg.roomCode, 'vs', this.roomCode);
      return;
    }
    
    if (msg.type === 'create_room' && msg.host && msg.id !== this.id) {
      // Someone else created this room - shouldn't happen
      return;
    }
    
    if (msg.type === 'join_room' && msg.id !== this.id) {
      // Another player joined our room
      if (this.gameMode === 'host') {
        this.connectedPlayers++;
        // Store the joining player's character data
        if (msg.playerData && msg.playerData.id !== this.id) {
          if (!this.joinedPlayers) this.joinedPlayers = [];
          this.joinedPlayers.push(msg.playerData);
        }
        // Host broadcasts updated count to all
        this.send('room_update', { playerCount: this.connectedPlayers });
      }
    } else if (msg.type === 'room_update') {
      // Update from host about room state
      if (msg.playerCount !== undefined) {
        this.connectedPlayers = msg.playerCount;
      }
    } else if (msg.type === 'request_room_state') {
      // Someone is requesting room state - host responds
      if (this.gameMode === 'host') {
        this.send('room_update', { playerCount: this.connectedPlayers });
      }
    } else if (msg.type === 'game_start') {
      // Host started the game - clients wait for game_state
      console.log('Client received game_start message');
      if (this.gameMode !== 'host') {
        console.log('Client transitioning to playing state');
        this.s = 'playing';
        // Don't generate anything - wait for complete game_state from host
      }
    } else if (msg.type === 'game_state') {
      // Receive full game state from host
      this.receiveGameState(msg);
    } else if (msg.type === 'turn_update') {
      // Receive turn state update
      this.receiveTurnUpdate(msg);
    } else if (msg.type === 'player_attack' && this.gameMode === 'host') {
      // Client is requesting to attack - process on host
      this.clearTurnTimeout(); // Player took action, clear timeout
      this.handleClientAttack(msg);
    } else if (msg.type === 'end_turn' && this.gameMode === 'host') {
      // Client is requesting to end turn - process on host
      this.clearTurnTimeout(); // Player took action, clear timeout
      this.nextTurn();
    } else if (msg.type === 'player_move' && this.gameMode === 'host') {
      // Client is requesting to move - process on host
      this.clearTurnTimeout(); // Player took action, clear timeout
      this.handleClientMove(msg);
    } else if (msg.type === 'event_broadcast') {
      if (this.gameMode === 'host') {
        // Host receives event from client - broadcast to all clients
        this.addEvent(msg.text);
      } else {
        // Client receives event from host - add directly to avoid prompt filtering
        this.eventLog.unshift(msg.text);
        if (this.eventLog.length > 8) this.eventLog.pop();
        
        // Update HTML event log directly
      const eventList = document.querySelector('#event-list');
      if (eventList) {
        const eventDiv = document.createElement('div');
        eventDiv.style.color = '#00ff00';
        eventDiv.style.marginBottom = '2px';
        eventDiv.textContent = msg.text;
        eventList.insertBefore(eventDiv, eventList.firstChild);
        
        while (eventList.children.length > 8) {
          eventList.removeChild(eventList.lastChild);
        }
      }
      }
    } else if (msg.type === 'action_update' && this.gameMode === 'host') {
      // Host receives action count update from client
      this.currentActions = msg.currentActions;
    }
  },

  // Generate client player (clients only)
  generateClientPlayer() {
    // Add player-specific entropy to randomization
    const idHash = this.id.split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff, 0);
    const entropy = Math.abs(idHash) / 0xffffffff;
    
    // Add small delay based on ID to offset random timing
    Math.random(); // Consume one random for entropy offset
    for (let i = 0; i < (Math.abs(idHash) % 10); i++) {
      Math.random(); // Advance random state by different amounts per player
    }
    
    this.p = P.g('You');
    this.p.id = this.id; // Use unique session ID
    
    // Use ID-based angle to ensure different positions
    const angle = (entropy * Math.PI * 2) + Math.random() * Math.PI * 0.5;
    const distance = 4 + Math.floor(Math.random() * 7);
    const rawX = Math.cos(angle) * distance * 5;
    const rawZ = Math.sin(angle) * distance * 5;
    this.p.pos = { 
      x: Math.round(rawX / 5) * 5, 
      y: 0, 
      z: Math.round(rawZ / 5) * 5 
    };
    
    // Assign client a unique color based on ID hash
    const colorIndex = 1 + (Math.abs(idHash) % (this.catColors.length - 1));
    this.p.color = this.catColors[colorIndex];
  },

  // Handle client attack request (host only)
  handleClientAttack(msg) {
    // Find the attacking player and target
    const attackerId = msg.id || msg.playerId; // Message should include client's player ID
    const attacker = this.turnOrder.find(c => c.id === attackerId);
    const target = this.turnOrder.find(c => c.id === msg.targetId);
    
    if (!attacker || !target) {
      console.error('Invalid attack request:', { attackerId, targetId: msg.targetId });
      return;
    }
    
    // Use client's action count and attack count
    if (msg.currentActions !== undefined) {
      this.currentActions = msg.currentActions;
    }
    if (msg.attackCount !== undefined) {
      this.attackCount = msg.attackCount;
    }
    
    // Process the attack (use attackCount - 1 for MAP since client already incremented)
    const map = (msg.attackCount - 1) * -5; // Multiple Attack Penalty
    const result = P.k(attacker, target, map);
    
    // Add event log
    const mapText = map < 0 ? ` (MAP ${map})` : '';
    const bonusText = result.atkBonus >= 0 ? `+${result.atkBonus}` : `${result.atkBonus}`;
    const rollText = `1d20${bonusText} [${result.total}] vs AC ${result.targetAC}`;
    
    if (result.h) {
      const strText = result.strMod >= 0 ? `+${result.strMod}` : `${result.strMod}`;
      const dmgText = `1d6${strText} [${result.d}]`;
      this.addEvent(`${attacker.c.n} claw attack${mapText}: ${rollText} HIT for ${dmgText} damage`);
      if (!target.v) this.addEvent(`${target.c.n} is defeated!`);
    } else {
      this.addEvent(`${attacker.c.n} claw attack${mapText}: ${rollText} MISS`);
    }
    
    // Sync the updated game state to all clients
    this.syncGameState();
  },

  // Handle client move request (host only)
  handleClientMove(msg) {
    // Find the moving player
    const playerId = msg.playerId;
    const player = this.turnOrder.find(c => c.id === playerId);
    
    if (!player) {
      console.error('Invalid move request - player not found:', playerId);
      return;
    }
    
    // Check if move is valid
    const newX = msg.targetX;
    const newZ = msg.targetZ;
    
    if (!this.occupied(newX, newZ, player)) {
      // Move is valid - update position
      player.pos.x = newX;
      player.pos.z = newZ;
      
      // Update visual object
      const catIndex = E.objects.findIndex(obj => (obj.type === 'cat' || obj.type === 'boss') && obj.catId === player.id);
      if (catIndex >= 0) {
        E.objects[catIndex].x = newX;
        E.objects[catIndex].z = newZ;
      }
      
      // Use client's action count if provided (client manages its own movement economy)
      if (msg.currentActions !== undefined) {
        this.currentActions = msg.currentActions;
      }
      if (msg.moveDistance !== undefined) {
        this.moveDistance = msg.moveDistance;
      }
      
      // Sync updated game state
      this.syncGameState();
    }
  },

  // Sync full game state (host only)
  syncGameState() {
    console.log('syncGameState called:', { gameMode: this.gameMode, hasCombat: !!this.combat });
    if (this.gameMode !== 'host' || !this.combat) {
      console.log('syncGameState early return:', { gameMode: this.gameMode, hasCombat: !!this.combat });
      return;
    }
    
    const gameState = {
      cats: this.cs.map(c => ({
        id: c.id, n: c.n, pos: c.pos, h: c.h, m: c.m, a: c.a, v: c.v,
        c: c.c, s: c.s, color: c.color, i: c.i, isBoss: c.isBoss, isAI: c.isAI
      })),
      buildings: this.buildings || [],
      turnOrder: this.turnOrder.map(c => c.id),
      currentTurn: this.currentTurn,
      currentActions: this.currentActions,
      combat: { round: this.combat.round },
      eventLog: this.eventLog || []
    };
    
    this.send('game_state', gameState);
  },

  // Receive game state from host
  receiveGameState(msg) {
    if (this.gameMode === 'host') return; // Ignore if we're host
    
    console.log('Receiving game state:', msg);
    
    // Clear all existing objects
    E.objects = [];
    
    // Generate buildings from host data
    if (msg.buildings && msg.buildings.length > 0) {
      this.generateCity(true, msg.buildings);
    }
    
    // Update cats
    this.cs = msg.cats.map(data => {
      const cat = { ...data };
      if (cat.isBoss) {
        // Boss cat is 10x10x10
        const bossObj = { type: 'boss', x: cat.pos.x, y: cat.pos.y, z: cat.pos.z, w: 10, h: 10, d: 10, color: cat.color, catId: cat.id };
        E.objects.push(bossObj);
      } else {
        // Regular cat
        E.add('cat', cat.pos.x, cat.pos.y, cat.pos.z, 3, 5, 3, cat.color);
        E.objects[E.objects.length - 1].catId = cat.id;
      }
      return cat;
    });

    // Find this client's player in the cats array
    const newP = this.cs.find(c => c.id === this.id);
    
    if (newP) {
      // Camera following for clients - only move camera if player moved
      if (this.p && this.lastCatPos) {
        const deltaX = newP.pos.x - this.p.pos.x;
        const deltaZ = newP.pos.z - this.p.pos.z;
        
        E.cam.x += deltaX;  // Move camera by same amount player moved
        E.cam.z += deltaZ;
      } else {
        // First time setup - position camera behind player
        E.cam.x = newP.pos.x;
        E.cam.y = 25;  
        E.cam.z = newP.pos.z + 25;
        E.cam.rx = -0.3;
        E.cam.ry = Math.PI;
      }
      
      this.p = newP;
      this.lastCatPos = { x: this.p.pos.x, z: this.p.pos.z };
    }
    
    // Update turn order - all cats are already in this.cs
    this.turnOrder = msg.turnOrder.map(id => 
      this.cs.find(c => c.id === id)
    ).filter(c => c);
    
    // Update combat state
    this.currentTurn = msg.currentTurn;
    this.currentActions = msg.currentActions;
    this.combat = { participants: [...this.cs, this.p], ...msg.combat };
    
    // Update event log
    if (msg.eventLog) {
      this.eventLog = msg.eventLog;
    }
    
    console.log('Client game state updated:', { 
      cats: this.cs.length, 
      turnOrder: this.turnOrder.map(c => c.c.n), 
      currentTurn: this.currentTurn 
    });
  },

  // Send turn update (host only)
  syncTurnState() {
    if (this.gameMode !== 'host') return;
    
    this.send('turn_update', {
      currentTurn: this.currentTurn,
      currentActions: this.currentActions,
      round: this.combat.round,
      actionType: this.actionType,
      moveDistance: this.moveDistance,
      attackCount: this.attackCount
    });
  },

  // Receive turn update
  receiveTurnUpdate(msg) {
    if (this.gameMode === 'host') return;
    
    this.currentTurn = msg.currentTurn;
    this.currentActions = msg.currentActions;
    if (this.combat) this.combat.round = msg.round;
    this.actionType = msg.actionType;
    this.moveDistance = msg.moveDistance || 0;
    this.attackCount = msg.attackCount || 0;
  },
  
  renderLobby() {
    const ctx = E.ctx;
    
    const centerX = E.w / 2;
    const centerY = E.h / 2;
    
    // Title
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffaa00';
    ctx.fillText('Game Lobby', centerX, centerY - 150);
    
    // Room code display
    ctx.font = '32px monospace';
    ctx.fillStyle = '#00ffff';
    ctx.fillText(`Room Code: ${this.roomCode}`, centerX, centerY - 80);
    
    // Player count
    ctx.font = '24px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`Players Connected: ${this.connectedPlayers}/6`, centerX, centerY - 40);
    
    // Options - different for host vs joined players
    ctx.font = '20px monospace';
    if (this.gameMode === 'host') {
      const options = ['Start Game (with current players)', 'Start Game (solo)', 'Back to Menu'];
      options.forEach((option, i) => {
        const y = centerY + 20 + (i * 30);
        ctx.fillStyle = this.menuSelection === i ? '#ffffff' : '#888888';
        ctx.fillText(option, centerX, y);
      });
    } else {
      // Joined player - just show waiting status
      ctx.fillStyle = '#cccccc';
      ctx.fillText('Waiting for host to start the game...', centerX, centerY + 20);
      ctx.font = '16px monospace';
      const option = 'Back to Menu';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(option, centerX, centerY + 60);
    }
    
    // Instructions
    ctx.font = '16px monospace';
    ctx.fillStyle = '#cccccc';
    ctx.textAlign = 'left';
    ctx.fillText('Use W/S or Arrow Keys to navigate', 20, E.h - 60);
    ctx.fillText('Press ENTER to select', 20, E.h - 40);
    ctx.fillText('Other players can join with room code', 20, E.h - 20);
  },
  
  generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  },
  
  initGame() {
    if (this.gameInitialized) {
      console.log('INITGAME ALREADY CALLED - SKIPPING');
      return;
    }
    this.gameInitialized = true;
    
    console.log('INITGAME CALLED - HOST GENERATING WORLD');
    // Initialize game world  
    this.buildings = []; // Store building data
    this.spawnCats();
    this.generateCity(true);
    
    // Start combat after a brief delay with all cats
    setTimeout(() => {
      const allCats = this.cs.filter(c => c && c.v);
      if (allCats.length > 0) {
        this.startCombat(allCats);
      }
    }, 500);
  },
  
  // Add event to log
  addEvent(text, isPrompt = false) {
    this.eventLog.unshift(text);
    if (this.eventLog.length > 8) this.eventLog.pop(); // Keep last 8 events
    
    // Host broadcasts non-prompt events to clients
    // Never broadcast player-specific prompts or selections
    const shouldNotBroadcast = isPrompt || 
      text.includes('Selected') && text.includes('action') ||
      text.includes('Choose') ||
      text.includes('No enemies in range') ||
      text.includes('Not enough actions') ||
      /^\d+\)/.test(text); // Any line starting with number and parenthesis
    
    const shouldBroadcast = this.gameMode === 'host' && !shouldNotBroadcast;
    
    if (shouldBroadcast) {
      this.send('event_broadcast', { text });
    }
    
    // Update HTML event log
    const eventList = document.querySelector('#event-list');
    if (eventList) {
      const eventDiv = document.createElement('div');
      eventDiv.style.color = '#00ff00';
      eventDiv.style.marginBottom = '2px';
      eventDiv.textContent = text;
      eventList.insertBefore(eventDiv, eventList.firstChild);
      
      // Remove old events
      while (eventList.children.length > 8) {
        eventList.removeChild(eventList.lastChild);
      }
    }
  },
  
  // Simple text wrapping
  wrapText(text, maxLength) {
    if (text.length <= maxLength) return [text];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    
    words.forEach(word => {
      if ((currentLine + word).length <= maxLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) lines.push(currentLine);
    return lines;
  },
  
  // Show target selection dialog
  showTargetDialog(targets, actionType) {
    this.targetDialog = { targets, actionType };
    this.addEvent(`Choose target (1-${targets.length}):`, true);
    targets.forEach((t, i) => {
      this.addEvent(`${i + 1}) ${t.c.n} Cat`, true);
    });
  },
  
  // Handle target selection input
  selectTarget(number) {
    if (!this.targetDialog) return;
    
    const index = number - 1;
    if (index >= 0 && index < this.targetDialog.targets.length) {
      const target = this.targetDialog.targets[index];
      if (this.targetDialog.actionType === 'attack') {
        this.executeAttack(target);
      } else if (this.targetDialog.actionType === 'cast') {
        this.executeCast(target, this.targetDialog.spell);
      }
      this.targetDialog = null;
    }
  },

  // Set current action type
  setAction(type) {
    if (!this.combat || this.currentActions <= 0) return;
    if (this.turnOrder[this.currentTurn]?.id !== this.p.id) return;
    
    this.clearTurnTimeout(); // Player took action, clear timeout
    this.actionType = type;
    this.addEvent(`Selected ${type} action`, true);
    
    // Auto-execute based on action type
    if (type === 'attack') {
      this.attemptAttack();
    } else if (type === 'cast') {
      this.attemptCast();
    } else if (type === 'heal') {
      this.attemptHeal();
    } else if (type === 'stealth') {
      this.attemptStealth();
    }
  },
  
  // End current action
  endAction() {
    if (!this.combat || this.turnOrder[this.currentTurn]?.id !== this.p.id) return;
    
    if (this.actionType === 'move' && this.moveDistance > 0) {
      // Consume action for partial movement
      this.currentActions--;
      this.addEvent(`Movement ended. ${this.currentActions} actions remaining.`);
      this.moveDistance = 0;
    }
    
    this.actionType = null;
  },
  
  // Attempt attack on nearby enemies
  attemptAttack() {
    const enemies = this.cs.filter(cat => {
      if (!cat.v || cat.id === this.p.id) return false; // Exclude dead cats and self
      
      if (cat.isBoss) {
        // Boss cat occupies 2x2 grid - use EXACT same logic as occupancy detection
        const gridSize = 5;
        const playerGridX = Math.floor(this.p.pos.x / gridSize) * gridSize;
        const playerGridZ = Math.floor(this.p.pos.z / gridSize) * gridSize;
        const bossGridX = Math.floor(cat.pos.x / gridSize) * gridSize;
        const bossGridZ = Math.floor(cat.pos.z / gridSize) * gridSize;
        const bossGridSize = gridSize * 2; // Boss is 2x2
        
        // Check if player grid square is adjacent to any boss grid square
        for (let bx = bossGridX; bx < bossGridX + bossGridSize; bx += gridSize) {
          for (let bz = bossGridZ; bz < bossGridZ + bossGridSize; bz += gridSize) {
            const dx = Math.abs(playerGridX - bx);
            const dz = Math.abs(playerGridZ - bz);
            if ((dx === 5 && dz === 0) || (dx === 0 && dz === 5) || (dx === 5 && dz === 5)) {
              return true; // Adjacent (including diagonal)
            }
          }
        }
        return false;
      } else {
        // Regular cat - use grid-based adjacency like boss occupancy detection
        const gridSize = 5;
        const playerGridX = Math.floor(this.p.pos.x / gridSize) * gridSize;
        const playerGridZ = Math.floor(this.p.pos.z / gridSize) * gridSize;
        const catGridX = Math.floor(cat.pos.x / gridSize) * gridSize;
        const catGridZ = Math.floor(cat.pos.z / gridSize) * gridSize;
        
        const dx = Math.abs(playerGridX - catGridX);
        const dz = Math.abs(playerGridZ - catGridZ);
        return (dx === 5 && dz === 0) || (dx === 0 && dz === 5) || (dx === 5 && dz === 5); // Adjacent including diagonal
      }
    });
    
    if (enemies.length === 0) {
      // Debug: show nearby cats and their distances
      const nearbyCats = this.cs.filter(cat => cat.v && cat.id !== this.p.id);
      if (nearbyCats.length > 0) {
        const nearest = nearbyCats[0];
        const dx = Math.abs(nearest.pos.x - this.p.pos.x);
        const dz = Math.abs(nearest.pos.z - this.p.pos.z);
        this.addEvent(`No enemies in range for attack (nearest: dx=${dx}, dz=${dz})`, true);
      } else {
        this.addEvent('No enemies in range for attack', true);
      }
      return;
    }
    
    if (enemies.length === 1) {
      // Auto-attack single target
      const target = enemies[0];
      this.executeAttack(target);
    } else {
      // Multiple targets - show numbered selection
      this.showTargetDialog(enemies, 'attack');
    }
  },
  
  // Execute attack on specific target
  executeAttack(target) {
    if (this.gameMode === 'host') {
      // Host processes attack locally
      const map = this.attackCount * -5; // Multiple Attack Penalty
      const result = P.k(this.p, target, map);
      
      this.currentActions--;
      this.attackCount++;
      
      const mapText = map < 0 ? ` (MAP ${map})` : '';
      const bonusText = result.atkBonus >= 0 ? `+${result.atkBonus}` : `${result.atkBonus}`;
      const rollText = `1d20${bonusText} [${result.total}] vs AC ${result.targetAC}`;
      
      if (result.h) {
        const strText = result.strMod >= 0 ? `+${result.strMod}` : `${result.strMod}`;
        const dmgText = `1d6${strText} [${result.d}]`;
        this.addEvent(`Claw attack${mapText}: ${rollText} HIT for ${dmgText} damage`);
        if (!target.v) this.addEvent(`${target.c.n} is defeated!`);
      } else {
        this.addEvent(`Claw attack${mapText}: ${rollText} MISS`);
      }
      
      // Sync game state after player attack
      this.syncGameState();
    } else {
      // Client tracks attack count locally and sends to host
      this.currentActions--;
      this.attackCount++;
      
      this.send('player_attack', { 
        targetId: target.id, 
        playerId: this.p.id,
        currentActions: this.currentActions,
        attackCount: this.attackCount
      });
    }
    
    // Check if combat should end
    const alive = this.turnOrder.filter(cat => cat.v);
    if (alive.length <= 1) {
      this.endCombat();
      return;
    }
    
    if (this.currentActions <= 0) this.actionType = null;
  },
  
  // Attempt cast spell
  attemptCast() {
    const spells = this.p.c.s || [];
    const offensiveSpells = spells.filter(s => s === 'firebolt' || s === 'harm');
    
    if (offensiveSpells.length === 0) {
      this.addEvent('No offensive spells available');
      return;
    }
    
    const spell = offensiveSpells[0]; // Use first available
    const enemies = this.cs.filter(cat => {
      if (!cat.v || cat.id === this.p.id) return false; // Exclude dead cats and self
      const dx = cat.pos.x - this.p.pos.x;
      const dz = cat.pos.z - this.p.pos.z;
      const dist = Math.sqrt(dx*dx + dz*dz);
      return dist <= 30; // 30ft range
    });
    
    if (enemies.length === 0) {
      this.addEvent('No enemies in spell range (30ft)');
      return;
    }
    
    if (enemies.length === 1) {
      this.executeCast(enemies[0], spell);
    } else {
      this.targetDialog = { targets: enemies, actionType: 'cast', spell };
      this.addEvent(`Cast ${spell} - Choose target (1-${enemies.length}):`, true);
      enemies.forEach((t, i) => {
        this.addEvent(`${i + 1}) ${t.c.n} Cat`, true);
      });
    }
  },
  
  // Execute spell cast
  executeCast(target, spell) {
    const result = P.spell(this.p, target, spell);
    
    this.currentActions--;
    
    let eventText;
    if (result.h) {
      const rollText = `1d20+${result.atkBonus} [${result.total}] vs AC ${result.targetAC}`;
      eventText = `${this.p.c.n} ${spell}: ${rollText} HIT for ${result.d} damage (${result.die})`;
      if (!target.v) {
        const defeatText = `${target.c.n} is defeated!`;
        if (this.gameMode === 'host') {
          this.addEvent(eventText);
          this.addEvent(defeatText);
        } else {
          this.send('event_broadcast', { text: eventText });
          this.send('event_broadcast', { text: defeatText });
        }
      } else {
        if (this.gameMode === 'host') {
          this.addEvent(eventText);
        } else {
          this.send('event_broadcast', { text: eventText });
        }
      }
    } else if (result.msg) {
      eventText = `${this.p.c.n} ${spell}: ${result.msg}`;
      if (this.gameMode === 'host') {
        this.addEvent(eventText);
      } else {
        this.send('event_broadcast', { text: eventText });
      }
    } else {
      const rollText = `1d20+${result.atkBonus} [${result.total}] vs AC ${result.targetAC}`;
      eventText = `${this.p.c.n} ${spell}: ${rollText} MISS`;
      if (this.gameMode === 'host') {
        this.addEvent(eventText);
      } else {
        this.send('event_broadcast', { text: eventText });
      }
    }
    
    // Clients send action count to host
    if (this.gameMode !== 'host') {
      this.send('action_update', { playerId: this.p.id, currentActions: this.currentActions });
    }
    
    const alive = this.turnOrder.filter(cat => cat.v);
    if (alive.length <= 1) {
      this.endCombat();
      return;
    }
    
    if (this.currentActions <= 0) this.actionType = null;
  },
  
  // Attempt heal
  attemptHeal() {
    const spells = this.p.c.s || [];
    const healSpells = spells.filter(s => s.startsWith('heal'));
    
    if (healSpells.length === 0) {
      this.addEvent('No healing spells available');
      return;
    }
    
    // Show heal options
    this.addEvent('Choose healing spell:', true);
    this.addEvent('1) Heal (1 action) - 1d8+Wis', true);
    this.addEvent('2) Greater Heal (2 actions) - 2d8+Wis', true);  
    this.addEvent('3) Mass Heal (3 actions) - 3d8+Wis', true);
    
    this.healDialog = true;
  },
  
  // Execute heal
  executeHeal(level) {
    const actionCost = level;
    if (this.currentActions < actionCost) {
      this.addEvent(`Not enough actions (need ${actionCost}, have ${this.currentActions})`);
      return;
    }
    
    const spellName = `heal${level}`;
    const result = P.spell(this.p, null, spellName);
    
    this.currentActions -= actionCost;
    const eventText = `${this.p.c.n} ${spellName}: Healed ${result.heal} HP (${result.msg})`;
    this.addEvent(eventText);
    
    // Clients send their events and action count to host
    if (this.gameMode !== 'host') {
      this.send('event_broadcast', { text: eventText });
      this.send('action_update', { playerId: this.p.id, currentActions: this.currentActions });
    }
    
    if (this.currentActions <= 0) this.actionType = null;
    this.healDialog = false;
  },
  
  // Attempt stealth
  attemptStealth() {
    const spells = this.p.c.s || [];
    
    if (!spells.includes('hide')) {
      this.addEvent('Stealth not available for this class');
      return;
    }
    
    const result = P.spell(this.p, null, 'hide');
    this.currentActions--;
    const eventText = `${this.p.c.n} Hide: ${result.msg}`;
    this.addEvent(eventText);
    
    // Clients send their events and action count to host
    if (this.gameMode !== 'host') {
      this.send('event_broadcast', { text: eventText });
      this.send('action_update', { playerId: this.p.id, currentActions: this.currentActions });
    }
    
    if (this.currentActions <= 0) this.actionType = null;
  },
  
  // Next combat turn
  clearTurnTimeout() {
    if (this.turnTimeout) {
      clearTimeout(this.turnTimeout);
      this.turnTimeout = null;
    }
  },

  nextTurn() {
    this.clearTurnTimeout(); // Clear any pending timeout
    // Only host can advance turns
    if (this.gameMode !== 'host') return;
    
    // Skip dead cats
    do {
      this.currentTurn = (this.currentTurn + 1) % this.turnOrder.length;
    } while (!this.turnOrder[this.currentTurn].v);
    
    this.currentActions = 3; // Reset actions for new turn
    this.actionType = null;
    this.attackCount = 0;
    this.moveDistance = 0; // Reset movement
    
    if (this.currentTurn === 0) {
      this.combat.round++;
    }
    
    const currentCat = this.turnOrder[this.currentTurn];
    this.addEvent(`${currentCat.c.n}'s turn begins`);
    
    // Sync turn state to all players
    this.syncTurnState();
    
    // AI behavior for NPCs only (not human clients)
    if (currentCat.isAI && currentCat.v) {
      setTimeout(() => this.runAITurn(currentCat), 1500);
    } else if (currentCat.v) {
      // Human player gets 30 seconds before auto-pass
      this.turnTimeout = setTimeout(() => {
        this.addEvent(`${currentCat.c.n}'s turn timed out`);
        this.nextTurn();
      }, 30000);
    }
  },
  
  // Run AI turn for a cat
  runAITurn(currentCat) {
    let actions = 3;
    let attacks = 0;
    
    // Find alive targets (exclude self)
    const targets = this.turnOrder.filter(cat => cat.v && cat.id !== currentCat.id);
    if (targets.length === 0) {
      this.endCombat();
      return;
    }
    
    console.log(`${currentCat.c.n} (${currentCat.id}) has ${targets.length} targets: ${targets.map(t => t.c.n + '(' + t.id + ')').join(', ')}`);
    
    // Pick closest target (simple AI - they may attack each other or boss)
    let target = targets[0];
    let minDist = Infinity;
    targets.forEach(cat => {
      if (cat.id === currentCat.id) return; // Double-check to avoid self-targeting
      const dx = cat.pos.x - currentCat.pos.x;
      const dz = cat.pos.z - currentCat.pos.z;
      const dist = Math.sqrt(dx*dx + dz*dz);
      if (dist < minDist) {
        minDist = dist;
        target = cat;
      }
    });
    
    // Safety check - if somehow still targeting self, end turn
    if (target.id === currentCat.id) {
      console.error(`ERROR: ${currentCat.c.n} is targeting itself!`);
      this.nextTurn();
      return;
    }
    
    while (actions > 0 && currentCat.v) {
      // Re-check if target is still alive each action
      if (!target.v) {
        // Target died, find new target
        const newTargets = this.turnOrder.filter(cat => cat.v && cat.id !== currentCat.id);
        if (newTargets.length === 0) {
          this.endCombat();
          return;
        }
        target = newTargets[0]; // Just pick the first available
      }
      
      const dx = target.pos.x - currentCat.pos.x;
      const dz = target.pos.z - currentCat.pos.z;
      const dist = Math.sqrt(dx*dx + dz*dz);
      
      console.log(`${currentCat.c.n}(${currentCat.id}) targeting ${target.c.n}(${target.id}): distance=${dist.toFixed(1)}, dx=${dx}, dz=${dz}`);
      
      if (dist <= 5 && target.v) {
        // In range - attack
        const map = attacks * -5;
        const result = P.k(currentCat, target, map);
        
        const mapText = map < 0 ? ` (MAP ${map})` : '';
        const bonusText = result.atkBonus >= 0 ? `+${result.atkBonus}` : `${result.atkBonus}`;
      const rollText = `1d20${bonusText} [${result.total}] vs AC ${result.targetAC}`;
        
        if (result.h) {
          const strText = result.strMod >= 0 ? `+${result.strMod}` : `${result.strMod}`;
        const dmgText = `1d6${strText} [${result.d}]`;
          this.addEvent(`${currentCat.c.n} claw attack${mapText}: ${rollText} HIT for ${dmgText} damage`);
          if (!target.v) this.addEvent(`${target.c.n} is defeated!`);
        } else {
          this.addEvent(`${currentCat.c.n} claw attack${mapText}: ${rollText} MISS`);
        }
        attacks++;
        actions--;
        
        // Sync game state after AI attack
        this.syncGameState();
      } else if (dist > 5) {
        // Move closer - try multiple movement options
        let moved = false;
        let moveDistance = 0;
        
        // Try different movement directions in order of preference
        const directions = [];
        
        if (Math.abs(dx) > Math.abs(dz)) {
          // Prefer X movement, fallback to Z (in grid squares)
          directions.push(
            { x: dx > 0 ? 5 : -5, z: 0 }, // 25ft = 5 grid squares
            { x: dx > 0 ? 4 : -4, z: 0 }, // 20ft = 4 grid squares
            { x: dx > 0 ? 3 : -3, z: 0 }, // 15ft = 3 grid squares  
            { x: dx > 0 ? 2 : -2, z: 0 }, // 10ft = 2 grid squares
            { x: dx > 0 ? 1 : -1, z: 0 }, // 5ft = 1 grid square
            { x: 0, z: dz > 0 ? 5 : -5 },
            { x: 0, z: dz > 0 ? 4 : -4 },
            { x: 0, z: dz > 0 ? 3 : -3 },
            { x: 0, z: dz > 0 ? 2 : -2 },
            { x: 0, z: dz > 0 ? 1 : -1 }
          );
        } else {
          // Prefer Z movement, fallback to X (in grid squares)
          directions.push(
            { x: 0, z: dz > 0 ? 5 : -5 }, // 25ft = 5 grid squares
            { x: 0, z: dz > 0 ? 4 : -4 }, // 20ft = 4 grid squares
            { x: 0, z: dz > 0 ? 3 : -3 }, // 15ft = 3 grid squares
            { x: 0, z: dz > 0 ? 2 : -2 }, // 10ft = 2 grid squares
            { x: 0, z: dz > 0 ? 1 : -1 }, // 5ft = 1 grid square
            { x: dx > 0 ? 5 : -5, z: 0 },
            { x: dx > 0 ? 4 : -4, z: 0 },
            { x: dx > 0 ? 3 : -3, z: 0 },
            { x: dx > 0 ? 2 : -2, z: 0 },
            { x: dx > 0 ? 1 : -1, z: 0 }
          );
        }
        
        // Try each direction until one works
        for (const dir of directions) {
          const newX = currentCat.pos.x + dir.x;
          const newZ = currentCat.pos.z + dir.z;
          
          if (!this.occupied(newX, newZ, currentCat)) {
            currentCat.pos.x = newX;
            currentCat.pos.z = newZ;
            moveDistance = (Math.abs(dir.x) + Math.abs(dir.z)) * 5; // Convert to feet
            moved = true;
            break;
          }
        }
        
        if (moved) {
          // Update cat in scene
          const catIndex = E.objects.findIndex(obj => (obj.type === 'cat' || obj.type === 'boss') && obj.catId === currentCat.id);
          if (catIndex >= 0) {
            E.objects[catIndex].x = currentCat.pos.x;
            E.objects[catIndex].z = currentCat.pos.z;
          }
          actions--;
          this.addEvent(`${currentCat.c.n} moves ${moveDistance}ft closer. ${actions} actions remaining.`);
          
          // Sync game state after AI movement
          this.syncGameState();
        } else {
          // Can't move at all, skip action
          actions--;
          this.addEvent(`${currentCat.c.n} is blocked.`);
        }
      } else {
        break; // No valid actions
      }
    }
    
    // Check if combat should end
    const remaining = this.turnOrder.filter(cat => cat.v);
    if (remaining.length <= 1) {
      this.endCombat();
      return;
    }
    
    this.nextTurn();
  },
  
  // End combat
  endCombat() {
    const aliveCats = this.turnOrder.filter(cat => cat.v);
    const boss = this.turnOrder.find(cat => cat.isBoss);
    
    // Check victory conditions
    if (boss && !boss.v) {
      // Boss defeated - major victory!
      this.addEvent(`🏆🏆🏆 ?????? DEFEATED! The alley is saved!`);
      if (this.p && this.p.v) {
        this.addEvent(`You are victorious!`);
      } else {
        this.addEvent(`You are defeated but witnessed the victory!`);
      }
    } else if (aliveCats.length === 1) {
      if (aliveCats[0].isBoss) {
        this.addEvent(`💀 ?????? reigns supreme! All hope is lost...`);
      } else {
        this.addEvent(`🏆 ${aliveCats[0].c.n} wins the battle!`);
      }
      if (this.p && !this.p.v) {
        this.addEvent(`You are defeated!`);
      }
    } else if (aliveCats.length === 0) {
      this.addEvent(`💀 All cats have fallen...`);
    }
    
    this.combat = null;
    this.currentTurn = 0;
    this.currentActions = 3;
    this.actionType = null;
  },
  
  // Render
  render() {
    // Always render the 3D scene for consistent grid background
    E.render();
    
    if (this.s === 'splash' || this.s === 'menu' || this.s === 'lobby') {
      this.renderMenuOverlay();
    } else {
      this.renderUI();
    }
  },
  
  // Render menu overlay on top of 3D scene
  renderMenuOverlay() {
    const ctx = E.ctx;
    
    if (this.s === 'splash') {
      this.renderSplash(ctx);
    } else if (this.s === 'menu') {
      this.renderGameMenu(ctx);
    } else if (this.s === 'lobby') {
      this.renderLobby();
    }
  },
  
  renderSplash(ctx) {
    ctx.textAlign = 'center';
    
    const centerX = E.w / 2;
    const centerY = E.h / 2;
    
    ctx.font = '36px monospace';
    ctx.fillStyle = '#00ffff'; // Cyan
    ctx.fillText('polyhedron games', centerX, centerY - 100);
    
    ctx.font = '24px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('presents', centerX, centerY - 50);
    
    ctx.font = '48px monospace';
    ctx.fillStyle = '#ffaa00';
    ctx.fillText('Roll for Mischief', centerX, centerY + 20);
    
    ctx.font = '24px monospace';
    ctx.fillStyle = '#888888';
    ctx.fillText('https://polyhedron.games', centerX, centerY + 80);
    
    ctx.font = '18px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Press SPACE to continue', centerX, centerY + 140);
    
    ctx.textAlign = 'left';
  },
  
  renderGameMenu(ctx) {
    const centerX = E.w / 2;
    const centerY = E.h / 2;
    
    // Normal cat cursor position
    const cursorX = centerX - 60;
    const cursorY = centerY + (this.menuSelection * 60) - 52;
    
    // Align title with cursor - get cursor left edge
    ctx.font = '48px monospace';
    ctx.textAlign = 'left'; // Change to left align
    ctx.fillStyle = '#ffaa00';
    ctx.fillText('Roll for Mischief', cursorX, centerY - 100);
    
    // Big boss cat on the left side - render actual sprite
    const bossX = centerX - 350;
    const bossY = centerY - 120;
    this.renderCatSprite(ctx, bossX, bossY, 200, '#000000', true); // Boss sprite
    
    // Menu options
    ctx.font = '32px monospace';
    const options = ['Start Game', 'Join Game'];
    
    options.forEach((option, i) => {
      const y = centerY + (i * 60) - 20;
      ctx.fillStyle = this.menuSelection === i ? '#ffffff' : '#888888';
      ctx.fillText(option, centerX + 60, y);
    });
    
    // Normal cat cursor - render actual sprite
    this.renderCatSprite(ctx, cursorX, cursorY, 48, '#ffaa00', false);
    
    ctx.textAlign = 'left';
    
    // Instructions
    ctx.font = '16px monospace';
    ctx.fillStyle = '#cccccc';
    ctx.fillText('Use W/S or Arrow Keys to navigate', 20, E.h - 60);
    ctx.fillText('Press ENTER to select', 20, E.h - 40);
  },
  
  renderCatSprite(ctx, x, y, size, baseColor, isBoss) {
    // Use the actual sprite data from SPRITES.cat
    if (!SPRITES || !SPRITES.cat) return;
    
    const spriteData = SPRITES.cat.data;
    const colors = SPRITES.cat.colors;
    const spriteSize = SPRITES.cat.size; // 32x32
    const pixelSize = size / spriteSize;
    
    // Each character in spriteData represents one pixel
    // '0' = transparent, other characters = color keys
    let pixelIndex = 0;
    
    for (let i = 0; i < spriteData.length; i++) {
      const colorKey = spriteData[i];
      
      if (colorKey !== '0') { // Skip transparent pixels
        const color = isBoss && colorKey !== '0' ? '#000000' : (colors[colorKey] || baseColor);
        if (color) {
          const px = pixelIndex % spriteSize;
          const py = Math.floor(pixelIndex / spriteSize);
          
          ctx.fillStyle = color;
          ctx.fillRect(
            x + px * pixelSize,
            y + py * pixelSize,
            pixelSize,
            pixelSize
          );
        }
      }
      
      pixelIndex++;
    }
    
    // Add boss cat yellow eyes if needed
    if (isBoss) {
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(x + 14 * pixelSize, y + 10 * pixelSize, 4 * pixelSize, 3 * pixelSize);
      ctx.fillRect(x + 22 * pixelSize, y + 10 * pixelSize, 4 * pixelSize, 3 * pixelSize);
    }
  },
  
  // Update UI elements
  updateUI() {
    // Hide UI elements in lobby/menu states
    const hideUI = this.s === 'splash' || this.s === 'menu' || this.s === 'lobby';
    
    const stats = document.querySelector('.stats-panel');
    if (stats) stats.style.display = hideUI ? 'none' : 'block';
    
    const eventLog = document.querySelector('.event-log');
    if (eventLog) eventLog.style.display = hideUI ? 'none' : 'block';
    
    const leaderboard = document.querySelector('.leaderboard');
    if (leaderboard) leaderboard.style.display = hideUI ? 'none' : 'block';
    
    if (!hideUI) {
      const statsDiv = document.querySelector('#player-stats div');
      if (statsDiv && this.p) {
        statsDiv.innerHTML = `<strong>${this.p.c.n} Cat</strong><br>HP: ${this.p.h}/${this.p.m}<br>AC: ${this.p.a}<br>Pos: (${this.p.pos.x}, ${this.p.pos.z})`;
      }
      
      const lb = document.querySelector('#leaderboard-list');
      if (lb) {
        const connected = (this.ws && this.ws.readyState === 1) || (this.w && this.w.readyState === 1);
        const count = this.cs.filter(c => c.v).length + (this.p && this.p.v ? 1 : 0);
        lb.innerHTML = connected ? `Connected: ${count} cats` : 'Connecting...';
      }
    }
  },
  
  // Render UI
  renderUI() {
    this.updateUI();
    
    const ctx = E.ctx;
    
    // Combat UI - horizontal initiative bar like screenshot
    if (this.combat) {
      // Initiative tracker - horizontal bar in top center
      const boxWidth = 120;
      const boxHeight = 60; // Increased height for bigger cats
      const startX = (E.w - (this.turnOrder.length * boxWidth)) / 2;
      const startY = 10;
      
      this.turnOrder.forEach((cat, i) => {
        const x = startX + i * boxWidth;
        const active = i === this.currentTurn;
        
        // Box background - boss gets dark grey, others get black
        const isBoss = cat.isBoss || cat.id === 'boss';
        ctx.fillStyle = active ? 'rgba(255,255,0,0.8)' : (isBoss ? 'rgba(64,64,64,0.8)' : 'rgba(0,0,0,0.7)');
        ctx.fillRect(x, startY, boxWidth - 2, boxHeight);
        
        // Border
        ctx.strokeStyle = active ? '#ffff00' : '#666666';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, startY, boxWidth - 2, boxHeight);
        
        // Cat head sprite (using same clip as skull effect) - bigger now
        if (SPRITES && SPRITES.cat) {
          const headSize = 30; // Bigger size for initiative tracker
          const headX = x + 5;
          const headY = startY + 5;
          
          // Calculate 75% height clip (same as skull effect)
          const spriteSize = SPRITES.cat.size;
          const clipHeight = Math.floor(spriteSize * 0.75);
          
          // Render clipped sprite
          for (let sy = 0; sy < clipHeight; sy++) {
            for (let sx = 0; sx < spriteSize; sx++) {
              const index = sy * spriteSize + sx;
              const char = SPRITES.cat.data[index];
              
              if (char && char !== '0' && SPRITES.cat.colors[char]) {
                let color = SPRITES.cat.colors[char];
                
                // Special handling for boss cat
                if (cat.isBoss || cat.id === 'boss') {
                  // Make everything black except specific eye colors
                  if (color === '#f0a030' || color === '#e09030' || color === '#e06010' || color === '#d06010') {
                    color = '#ffff00'; // Yellow eyes for boss
                  } else {
                    color = '#000000'; // Everything else black
                  }
                } else if (cat.color && cat.color !== '#f07010' && cat.color !== null) {
                  // Simple color replacement based on cat's assigned color
                  if (color === '#f07010') { // Main orange color
                    color = cat.color;
                  } else {
                    // For other sprite colors, blend with cat color
                    const catR = parseInt(cat.color.slice(1, 3), 16);
                    const catG = parseInt(cat.color.slice(3, 5), 16);
                    const catB = parseInt(cat.color.slice(5, 7), 16);
                    const origR = parseInt(color.slice(1, 3), 16);
                    const origG = parseInt(color.slice(3, 5), 16);
                    const origB = parseInt(color.slice(5, 7), 16);
                    
                    // Better blending - use cat color as base, modulate by original
                    const tintedR = Math.min(255, Math.floor(catR * (origR / 240)));
                    const tintedG = Math.min(255, Math.floor(catG * (origG / 112)));
                    const tintedB = Math.min(255, Math.floor(catB * (origB / 16)));
                    
                    color = `#${tintedR.toString(16).padStart(2,'0')}${tintedG.toString(16).padStart(2,'0')}${tintedB.toString(16).padStart(2,'0')}`;
                  }
                }
                
                ctx.fillStyle = color;
                const pixelX = headX + Math.floor(sx * headSize / spriteSize);
                const pixelY = headY + Math.floor(sy * headSize / spriteSize);
                const pixelSize = Math.max(1, Math.floor(headSize / spriteSize));
                ctx.fillRect(pixelX, pixelY, pixelSize, pixelSize);
              }
            }
          }
        }
        
        // Text - use black text for readability on yellow highlight
        ctx.font = '10px monospace';
        // Choose readable text color based on background
        const isDarkBrown = cat.color === '#8B4513' || cat.color === '#CD853F';
        ctx.fillStyle = active ? '#000000' : (isBoss || isDarkBrown ? '#ffffff' : cat.color);
        ctx.fillText(cat.c.n, x + 40, startY + 15); // Moved further right for bigger sprite
        
        // Regular text color
        ctx.fillStyle = active ? '#000000' : '#ffffff'; // Black for active cat, white otherwise
        
        // Show HP for player's cat, health status for others
        if (cat === this.p) {
          ctx.fillText(`HP: ${cat.h}/${cat.m}`, x + 40, startY + 28); // Second line
          ctx.fillText(`Init: ${cat.i}`, x + 40, startY + 45); // Third line
        } else {
          // Show health status for other cats
          const hpPercent = cat.h / cat.m;
          let healthStatus = 'Healthy';
          if (hpPercent <= 0) healthStatus = 'Defeated';
          else if (hpPercent <= 0.25) healthStatus = 'Critical';
          else if (hpPercent <= 0.5) healthStatus = 'Bloodied';
          else if (hpPercent <= 0.75) healthStatus = 'Injured';
          
          ctx.fillText(healthStatus, x + 40, startY + 28); // Second line  
          ctx.fillText(`Init: ${cat.i}`, x + 40, startY + 45); // Third line
        }
      });
      
    }
    
    // Bottom left panel
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(10, E.h - 100, 300, 90);
    ctx.fillStyle = '#fff';
    ctx.font = '12px monospace';
    
    if (this.combat) {
      // Stat block display (T key toggle)
      if (this.showStatBlock && this.p.v) {
        const statY = E.h - 250; // Higher above the combat controls
        ctx.fillStyle = '#00ffff';
        ctx.fillText(`${this.p.c.n} Stats:`, 20, statY);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(`HP: ${this.p.h}/${this.p.m}`, 20, statY + 15);
        ctx.fillText(`AC: ${this.p.a}`, 20, statY + 30);
        
        // Left column - ability scores
        const strMod = Math.floor((this.p.s.S - 10) / 2);
        const dexMod = Math.floor((this.p.s.D - 10) / 2);
        const conMod = Math.floor((this.p.s.C - 10) / 2);
        const intMod = Math.floor((this.p.s.I - 10) / 2);
        const wisMod = Math.floor((this.p.s.W - 10) / 2);
        const chaMod = Math.floor((this.p.s.H - 10) / 2);
        
        ctx.fillText(`STR: ${this.p.s.S} (${strMod >= 0 ? '+' : ''}${strMod})`, 20, statY + 45);
        ctx.fillText(`DEX: ${this.p.s.D} (${dexMod >= 0 ? '+' : ''}${dexMod})`, 20, statY + 60);
        ctx.fillText(`CON: ${this.p.s.C} (${conMod >= 0 ? '+' : ''}${conMod})`, 20, statY + 75);
        ctx.fillText(`INT: ${this.p.s.I} (${intMod >= 0 ? '+' : ''}${intMod})`, 20, statY + 90);
        ctx.fillText(`WIS: ${this.p.s.W} (${wisMod >= 0 ? '+' : ''}${wisMod})`, 20, statY + 105);
        ctx.fillText(`CHA: ${this.p.s.H} (${chaMod >= 0 ? '+' : ''}${chaMod})`, 20, statY + 120);
        
        // Right column - combat stats with damage
        const meleeBonus = this.p.c.a + strMod;
        const meleeDmg = `1d6+${strMod}`;
        ctx.fillText(`Melee: +${meleeBonus} (${meleeDmg})`, 180, statY + 45);
        
        // Show spell attack bonus if has spells
        const classSpells = this.p.c.s || [];
        if (classSpells.includes('firebolt')) {
          const spellBonus = this.p.c.a + intMod;
          ctx.fillText(`Spell: +${spellBonus} (1d10)`, 180, statY + 60);
        }
        if (classSpells.includes('harm')) {
          const spellBonus = this.p.c.a + wisMod;
          const spellDmg = `1d8+${wisMod}`;
          ctx.fillText(`Spell: +${spellBonus} (${spellDmg})`, 180, statY + 60);
        }
        if (classSpells.includes('hide')) {
          ctx.fillText(`Stealth: +${dexMod}`, 180, statY + 75);
        }
      }
      
      // Combat controls in green in bottom left
      const currentCat = this.turnOrder[this.currentTurn];
      if (currentCat === this.p && this.p.v) {
        ctx.fillStyle = '#00ff00';
        const actionsText = `Actions: ${this.currentActions}/3`;
        ctx.fillText(actionsText, 20, E.h - 80);
        
        // Action dots with space after Actions text
        const textWidth = ctx.measureText(actionsText).width;
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = i < this.currentActions ? '#00ff00' : '#666666';
          ctx.beginPath();
          ctx.arc(30 + textWidth + i * 15, E.h - 85, 4, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.fillStyle = '#00ff00';
        const modeText = this.actionType === 'move' 
          ? `Mode: ${this.actionType} (${this.moveDistance}/25ft)`
          : `Mode: ${this.actionType || 'None'}`;
        ctx.fillText(modeText, 20, E.h - 65);
        const classSpells = this.p.c.s || [];
        let helpText = 'M=Move, X=Attack';
        if (classSpells.includes('firebolt') || classSpells.includes('harm')) helpText += ', C=Cast';
        if (classSpells.some(s => s.startsWith('heal'))) helpText += ', H=Heal';
        if (classSpells.includes('hide')) helpText += ', Z=Stealth';
        
        // Always show basic controls on first line
        const basicText = 'M=Move, X=Attack, T=Stats';
        ctx.fillText(basicText, 20, E.h - 50);
        
        // Show specials on second line if any
        const specialsText = helpText.replace('M=Move, X=Attack', '').trim();
        if (specialsText) {
          ctx.fillText(specialsText.substring(2), 20, E.h - 35); // Remove leading ', '
        }
        
        // Show end turn on third line
        ctx.fillText('Space=End Turn', 20, E.h - 20);
      } else {
        ctx.fillStyle = '#ffff00';
        ctx.fillText(`${currentCat.c.n}'s Turn`, 20, E.h - 80);
        ctx.fillStyle = '#fff';
        if (!this.p.v) {
          ctx.fillStyle = '#ff0000';
          ctx.fillText('You are defeated!', 20, E.h - 65);
          ctx.fillText('Watching remaining combat...', 20, E.h - 50);
        } else {
          ctx.fillText('Waiting for enemy...', 20, E.h - 65);
        }
      }
    } else {
      // Regular help text
      ctx.fillText('WASD: Move camera', 20, E.h - 80);
      ctx.fillText('Mouse: Look around', 20, E.h - 65);
      ctx.fillText('Scroll: Zoom', 20, E.h - 50);
      ctx.fillText('Arrows: Move cat', 20, E.h - 35);
      ctx.fillText('I: Isometric view', 20, E.h - 20);
    }
    
    // Event log is now handled via HTML element
  }
};

// Start
document.addEventListener('DOMContentLoaded', () => {
  window.G = G; // Make globally accessible for 3D engine
  G.init();
});