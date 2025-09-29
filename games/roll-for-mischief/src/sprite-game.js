// Simple 2D sprite-based cat battle royale
let G = {
  // Game state
  s: 'playing',
  p: null,
  cs: [],
  a: { x: 0, z: 0, r: 50 },
  t: 0,
  k: new Set(),
  
  // WebSocket
  w: null,
  id: 'cat_' + (Math.random() * 1e6 | 0),
  
  // Initialize
  i() {
    const canvas = document.querySelector('canvas');
    R.i(canvas);
    
    // Generate player
    this.p = P.g('You');
    this.p.p = { x: 0, y: 0, z: 0 };
    
    // Generate simple city
    this.generateCity();
    
    // Update UI
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
        if (msg.data.id !== this.id) this.cs.push(msg.data.cat);
        break;
      case 'move':
        if (msg.data.id !== this.id) {
          const cat = this.cs.find(c => c.id === msg.data.id);
          if (cat) cat.p = msg.data.pos;
        }
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
  
  // Update
  update(dt) {
    this.updatePlayer(dt);
    if (this.p.v) this.p.t += dt;
  },
  
  // Update player
  updatePlayer(dt) {
    if (!this.p.v) return;
    
    const moveDelay = 200;
    const now = Date.now();
    
    if (!this.lastMove || now - this.lastMove > moveDelay) {
      let moved = false;
      
      if (this.k.has('KeyW')) { this.p.p.z -= 1; moved = true; }
      if (this.k.has('KeyS')) { this.p.p.z += 1; moved = true; }
      if (this.k.has('KeyA')) { this.p.p.x -= 1; moved = true; }
      if (this.k.has('KeyD')) { this.p.p.x += 1; moved = true; }
      
      if (moved) {
        this.p.p.x = Math.max(-10, Math.min(10, this.p.p.x));
        this.p.p.z = Math.max(-10, Math.min(10, this.p.p.z));
        
        this.lastMove = now;
        this.send('move', { pos: this.p.p });
        R.u(this.p.p.x, this.p.p.y, this.p.p.z);
        this.addEvent(`Moved to (${this.p.p.x}, ${this.p.p.z})`, 'move');
      }
    }
  },
  
  // Interact
  interact() {
    this.addEvent('Looking for other cats...', 'info');
  },
  
  // Update UI
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
  
  // Add event
  addEvent(msg, type = 'info') {
    const log = document.querySelector('#event-list');
    if (!log) return;
    
    const colors = { info: '#aaa', move: '#6666ff' };
    const time = new Date().toLocaleTimeString().slice(-8);
    
    const event = document.createElement('div');
    event.style.color = colors[type] || '#aaa';
    event.style.marginBottom = '2px';
    event.innerHTML = `[${time}] ${msg}`;
    
    log.appendChild(event);
    log.scrollTop = log.scrollHeight;
    
    while (log.children.length > 10) {
      log.removeChild(log.firstChild);
    }
  },
  
  // Generate city
  generateCity() {
    this.city = [];
    
    for (let x = -10; x <= 10; x += 2) {
      for (let z = -10; z <= 10; z += 2) {
        // Center area is streets
        if (Math.abs(x) <= 2 && Math.abs(z) <= 2) {
          this.city.push({ x, z, type: 'street' });
          continue;
        }
        
        // Create street grid
        if (x % 4 === 0 || z % 4 === 0) {
          this.city.push({ x, z, type: 'street' });
        } else {
          // More varied building distribution
          const r = Math.random();
          const dist = Math.abs(x) + Math.abs(z);
          
          if (r < 0.25) {
            this.city.push({ x, z, type: 'building' });
          } else if (r < 0.4) {
            this.city.push({ x, z, type: 'building2' });
          } else if (r < 0.5) {
            this.city.push({ x, z, type: 'building3' });
          } else if (r < 0.7 && dist > 4) {
            this.city.push({ x, z, type: 'tower' });
          } else {
            this.city.push({ x, z, type: 'ground' });
          }
        }
      }
    }
  },
  
  // Render
  render() {
    this.updateUI();
    
    // Clear screen
    R.clear();
    
    // Draw city tiles
    for (const tile of this.city) {
      R.draw(R[tile.type], tile.x, tile.z);
    }
    
    // Draw player cat
    if (this.p && this.p.v) {
      R.draw(R.cat, this.p.p.x, this.p.p.z);
    }
    
    // Draw other cats
    for (const cat of this.cs) {
      if (cat.v) R.draw(R.cat, cat.p.x, cat.p.z);
    }
  }
};

// Start game
document.addEventListener('DOMContentLoaded', () => {
  G.i();
});