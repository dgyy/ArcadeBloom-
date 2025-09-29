// Minimal cat battle royale - essential gameplay only
let G = {
  // Game state
  s: 'menu', // state
  p: null, // player
  cs: [], // other cats
  a: { x: 0, z: 0, r: 50 }, // play area
  b: null, // boss
  t: 0, // time
  k: new Set(), // keys
  
  // WebSocket connection
  w: null,
  id: 'cat_' + (Math.random() * 1e6 | 0),
  
  // Initialize
  i() {
    const canvas = document.querySelector('canvas');
    R.i(canvas);
    
    // Generate player
    this.p = P.g('You');
    this.p.p = { x: 0, y: 0, z: 0 };
    
    // City generation state
    this.cityGenerated = false;
    
    // Update UI immediately
    this.updateUI();
    this.addEvent(`${this.p.c.n} cat spawned in the city`, 'info');
    
    // Events
    document.addEventListener('keydown', e => {
      this.k.add(e.code);
      if (e.code === 'Space') this.interact();
    });
    document.addEventListener('keyup', e => this.k.delete(e.code));
    
    // Connect multiplayer
    this.connect();
    
    // Start game loop
    this.loop();
  },
  
  // Connect to multiplayer
  connect() {
    try {
      // Use JS13kGames relay
      this.w = new WebSocket('wss://relay.js13kgames.com/roll-for-mischief');
      
      this.w.onopen = () => {
        this.send('join', { id: this.id, cat: this.p });
      };
      
      this.w.onmessage = e => {
        try {
          const msg = JSON.parse(e.data);
          this.handle(msg);
        } catch (err) {
          // Ignore non-JSON messages (connection tokens, etc.)
        }
      };
    } catch (e) {
      // Offline mode
    }
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
          this.cs.push(msg.data.cat);
        }
        break;
      case 'move':
        if (msg.data.id !== this.id) {
          const cat = this.cs.find(c => c.id === msg.data.id);
          if (cat) cat.p = msg.data.pos;
        }
        break;
      case 'boss':
        this.b = msg.data.boss;
        break;
    }
  },
  
  // Game loop
  loop() {
    const now = Date.now();
    const dt = now - this.t;
    this.t = now;
    
    this.update(dt);
    this.render();
    
    requestAnimationFrame(() => this.loop());
  },
  
  // Update game
  update(dt) {
    if (this.s !== 'playing') return;
    
    this.updatePlayer(dt);
    this.updateArea();
    this.updateBoss(dt);
  },
  
  // Update player (grid-based movement)
  updatePlayer(dt) {
    if (!this.p.v) return;
    
    // Grid-based movement with smooth interpolation
    const moveDelay = 200; // ms between moves
    const now = Date.now();
    
    if (!this.lastMove || now - this.lastMove > moveDelay) {
      let moved = false;
      const oldPos = { ...this.p.p };
      
      if (this.k.has('KeyW')) { this.p.p.z -= 2; moved = true; }
      if (this.k.has('KeyS')) { this.p.p.z += 2; moved = true; }
      if (this.k.has('KeyA')) { this.p.p.x -= 2; moved = true; }
      if (this.k.has('KeyD')) { this.p.p.x += 2; moved = true; }
      
      if (moved) {
        // Check bounds
        this.p.p.x = Math.max(-10, Math.min(10, this.p.p.x));
        this.p.p.z = Math.max(-10, Math.min(10, this.p.p.z));
        
        this.lastMove = now;
        this.send('move', { pos: this.p.p });
        R.u(this.p.p.x, this.p.p.y, this.p.p.z);
        this.addEvent(`Moved to (${this.p.p.x}, ${this.p.p.z})`, 'move');
      }
    }
    
    // Check area damage
    const dx = this.p.p.x - this.a.x;
    const dz = this.p.p.z - this.a.z;
    if (dx*dx + dz*dz > this.a.r*this.a.r) {
      this.p.h = Math.max(0, this.p.h - 1);
      if (this.p.h <= 0) this.p.v = false;
    }
    
    // Update survival time
    if (this.p.v) this.p.t += dt;
  },
  
  // Update play area
  updateArea() {
    // Shrink area every 30 seconds
    if (this.t % 30000 < 100 && this.a.r > 5) {
      this.a.r = Math.max(5, this.a.r - 5);
    }
  },
  
  // Update boss
  updateBoss(dt) {
    if (!this.b) {
      // Spawn boss after 60 seconds
      if (this.t > 60000) {
        this.b = P.g('Boss');
        this.b.h *= 3; // Triple HP for boss
        this.b.p = { x: 0, y: 0, z: 0 };
        this.send('boss', { boss: this.b });
      }
      return;
    }
    
    // Simple boss AI - move toward nearest player
    const players = [this.p, ...this.cs].filter(c => c.v);
    if (players.length === 0) return;
    
    let nearest = players[0];
    let minDist = this.dist(this.b.p, nearest.p);
    
    for (const player of players) {
      const d = this.dist(this.b.p, player.p);
      if (d < minDist) {
        minDist = d;
        nearest = player;
      }
    }
    
    // Move boss toward nearest player
    const speed = 3;
    const ds = dt / 1000 * speed;
    const dx = nearest.p.x - this.b.p.x;
    const dz = nearest.p.z - this.b.p.z;
    const dist = Math.sqrt(dx*dx + dz*dz);
    
    if (dist > 0.5) {
      this.b.p.x += (dx / dist) * ds;
      this.b.p.z += (dz / dist) * ds;
    }
  },
  
  // Distance between two points
  dist(p1, p2) {
    const dx = p1.x - p2.x;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx*dx + dz*dz);
  },
  
  // Handle interactions
  interact() {
    // Find nearby cats
    for (const cat of this.cs) {
      if (this.dist(this.p.p, cat.p) < 3) {
        this.combat([this.p, cat]);
        break;
      }
    }
    
    // Check boss encounter
    if (this.b && this.dist(this.p.p, this.b.p) < 3) {
      this.combat([this.p, this.b]);
    }
  },
  
  // Simple combat
  combat(cats) {
    this.addEvent(`Combat initiated between ${cats.map(c => c.c.n).join(' and ')}`, 'combat');
    
    // Roll initiative
    cats.forEach(c => P.i(c));
    cats.sort((a, b) => b.i - a.i);
    
    // Simple auto-resolve for space
    for (let i = 0; i < cats.length; i++) {
      const attacker = cats[i];
      const target = cats[(i + 1) % cats.length];
      
      if (!attacker.v || !target.v) continue;
      
      // Try diplomacy first (50% chance)
      if (Math.random() > 0.5 && P.d(attacker)) {
        this.addEvent(`${attacker.c.n} uses diplomacy successfully`, 'diplomacy');
        continue; // Diplomacy successful, skip attack
      }
      
      // Attack
      const result = P.k(attacker, target);
      if (result.h) {
        this.addEvent(`${attacker.c.n} hits ${target.c.n} for ${result.d} damage`, 'combat');
        if (!target.v) {
          this.addEvent(`${target.c.n} is defeated!`, 'combat');
          break;
        }
      } else {
        this.addEvent(`${attacker.c.n} misses ${target.c.n}`, 'combat');
      }
    }
  },
  
  // Render game
  // Update UI elements
  updateUI() {
    const stats = document.querySelector('#player-stats div');
    if (stats && this.p) {
      const minutes = Math.floor(this.p.t / 60000);
      const seconds = Math.floor((this.p.t % 60000) / 1000);
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      stats.innerHTML = `<strong>${this.p.c.n} Cat</strong><br>HP: ${this.p.h}/${this.p.m}<br>Survival: ${timeStr}`;
    }
    
    const lb = document.querySelector('#leaderboard-list');
    if (lb) {
      const connected = this.w && this.w.readyState === 1;
      const count = this.cs.filter(c => c.v).length + (this.p.v ? 1 : 0);
      lb.innerHTML = connected ? `Connected: ${count} cats` : 'Offline mode';
    }
  },
  
  // Add event to log
  addEvent(msg, type = 'info') {
    const log = document.querySelector('#event-list');
    if (!log) return;
    
    const colors = { info: '#aaa', combat: '#ff6666', diplomacy: '#66ff66', move: '#6666ff' };
    const time = new Date().toLocaleTimeString().slice(-8);
    
    const event = document.createElement('div');
    event.style.color = colors[type] || '#aaa';
    event.style.marginBottom = '2px';
    event.innerHTML = `[${time}] ${msg}`;
    
    log.appendChild(event);
    log.scrollTop = log.scrollHeight;
    
    // Keep only last 10 events
    while (log.children.length > 10) {
      log.removeChild(log.firstChild);
    }
  },
  
  render() {
    // Update UI
    this.updateUI();
    
    // Generate static city (only if not already done)
    if (!this.cityGenerated) {
      this.generateCity();
      this.cityGenerated = true;
    }
    
    // Clear and start render
    R.r();
    
    // Render visible tiles in isometric order (back to front)
    this.renderTileMap();
    
    // Render cats on top
    if (this.p && this.p.v) {
      R.drawSprite('cat', this.p.p.x, this.p.p.z);
    }
    
    // Render other cats
    for (const cat of this.cs) {
      if (cat.v) R.drawSprite('cat', cat.p.x, cat.p.z);
    }
    
    // Render boss cat (larger)
    if (this.b && this.b.v) {
      R.drawSprite('cat', this.b.p.x, this.b.p.z);
    }
  },
  
  
  // Generate static city layout as tile map
  generateCity() {
    // Use seeded random for consistent city
    let seed = 12345;
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    
    this.tileMap = new Map();
    
    // Generate 15x15 tile grid with streets and varied buildings
    for (let x = -7; x <= 7; x++) {
      for (let z = -7; z <= 7; z++) {
        const key = `${x * 2},${z * 2}`;
        
        // Center area stays as streets for gameplay
        if (Math.abs(x) <= 1 && Math.abs(z) <= 1) {
          this.tileMap.set(key, 'street');
          continue;
        }
        
        // Create street grid every 3 tiles
        if (x % 3 === 0 || z % 3 === 0) {
          this.tileMap.set(key, 'street');
          continue;
        }
        
        // Place varied buildings
        const r = seededRandom();
        const distFromCenter = Math.abs(x) + Math.abs(z);
        
        if (distFromCenter > 5 && r < 0.2) {
          this.tileMap.set(key, 'skyscraper'); // Outer rim has skyscrapers
        } else if (r < 0.3) {
          this.tileMap.set(key, 'tower');
        } else if (r < 0.6) {
          this.tileMap.set(key, 'building');
        } else {
          this.tileMap.set(key, 'ground');
        }
      }
    }
  },
  
  // Render the tile map
  renderTileMap() {
    // Render in isometric order (back to front)
    for (let z = -14; z <= 14; z += 2) {
      for (let x = -14; x <= 14; x += 2) {
        const key = `${x},${z}`;
        const tile = this.tileMap.get(key);
        if (tile) {
          R.drawSprite(tile, x, z);
        }
      }
    }
  }
};

// Start game when loaded
document.addEventListener('DOMContentLoaded', () => {
  G.s = 'playing';
  G.i();
});