// Main game controller - ties all systems together for cat battle royale
class CatBattleRoyale {
  constructor() {
    // Initialize core systems
    this.canvas = document.getElementById('gameCanvas');
    this.renderer = new Renderer(this.canvas);
    this.ui = new UIManager();
    this.multiplayer = new MultiplayerManager();
    this.combat = new CombatSystem(this.multiplayer, PathfinderSystem);
    this.battleRoyale = new BattleRoyaleManager(this.multiplayer, this.combat, this.ui);
    
    // Game state
    this.gameState = 'menu'; // menu, connecting, playing
    this.playerCharacter = null;
    this.lastUpdate = Date.now();
    this.gameObjects = []; // All renderable objects
    
    // Input handling
    this.keys = new Set();
    this.mousePos = { x: 0, y: 0 };
    
    this.setupEventListeners();
    this.initializeGame();
  }
  
  setupEventListeners() {
    // Keyboard input
    document.addEventListener('keydown', (e) => {
      this.keys.add(e.code);
      this.handleKeyPress(e);
    });
    
    document.addEventListener('keyup', (e) => {
      this.keys.delete(e.code);
    });
    
    // Mouse input
    this.canvas.addEventListener('mousemove', (e) => {
      this.mousePos.x = e.clientX;
      this.mousePos.y = e.clientY;
    });
    
    this.canvas.addEventListener('click', (e) => {
      this.handleMouseClick(e);
    });
    
    // Window resize
    window.addEventListener('resize', () => {
      this.renderer.resize();
    });
  }
  
  async initializeGame() {
    this.ui.showSystemMessage('🐱 Welcome to the Cat Battle Royale!');
    
    // Generate player character
    this.playerCharacter = PathfinderSystem.generateRandomCat('Your Cat');
    
    // Position player randomly in starting area
    this.playerCharacter.position = this.getRandomStartPosition();
    
    // Update UI with player stats
    this.ui.updatePlayerStats(this.playerCharacter);
    
    // Connect to multiplayer
    await this.connectToMultiplayer();
    
    // Start game loop
    this.gameLoop();
    
    this.ui.showSystemMessage('Use WASD to move, click to interact with other cats');
  }
  
  getRandomStartPosition() {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * 10; // Within 10 units of center
    
    return {
      x: Math.cos(angle) * radius,
      y: 0,
      z: Math.sin(angle) * radius
    };
  }
  
  async connectToMultiplayer() {
    try {
      this.gameState = 'connecting';
      await this.multiplayer.connect();
      
      // Broadcast player join
      this.multiplayer.broadcastPlayerJoin(this.playerCharacter);
      
      // Update connection status
      const roomInfo = this.multiplayer.getRoomInfo();
      this.ui.updateConnectionStatus(true, roomInfo.playerCount, roomInfo.roomId);
      
      this.gameState = 'playing';
      
      // Start battle royale if enough players
      this.checkGameStart();
      
    } catch (error) {
      console.error('Failed to connect to multiplayer:', error);
      this.ui.showSystemMessage('⚠️ Playing in offline mode');
      this.gameState = 'playing';
    }
  }
  
  checkGameStart() {
    const playerCount = this.multiplayer.getPlayerCount();
    
    if (playerCount >= 2 && this.battleRoyale.gameState === 'waiting') {
      // Collect all players for battle royale
      const players = [
        { playerId: this.multiplayer.playerId, character: this.playerCharacter },
        ...this.multiplayer.getActivePlayers()
      ];
      
      setTimeout(() => {
        this.battleRoyale.startGame(players);
      }, 3000); // 3 second delay for more players to join
    }
  }
  
  // Main game loop
  gameLoop() {
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
    
    if (this.gameState === 'playing') {
      this.update(deltaTime);
    }
    
    this.render();
    
    requestAnimationFrame(() => this.gameLoop());
  }
  
  update(deltaTime) {
    // Update player character
    this.updatePlayer(deltaTime);
    
    // Update battle royale mechanics
    this.battleRoyale.update(deltaTime);
    
    // Update combat system
    if (this.combat.isInCombat()) {
      // Combat is turn-based, no real-time updates needed
    }
    
    // Update UI elements
    this.updateUI();
    
    // Generate world objects for rendering
    this.generateWorldObjects();
  }
  
  updatePlayer(deltaTime) {
    if (!this.playerCharacter || !this.playerCharacter.alive) return;
    
    const moveSpeed = 5; // units per second
    const deltaSeconds = deltaTime / 1000;
    
    let moved = false;
    
    // Handle movement input
    if (this.keys.has('KeyW') || this.keys.has('ArrowUp')) {
      this.playerCharacter.position.z -= moveSpeed * deltaSeconds;
      moved = true;
    }
    if (this.keys.has('KeyS') || this.keys.has('ArrowDown')) {
      this.playerCharacter.position.z += moveSpeed * deltaSeconds;
      moved = true;
    }
    if (this.keys.has('KeyA') || this.keys.has('ArrowLeft')) {
      this.playerCharacter.position.x -= moveSpeed * deltaSeconds;
      moved = true;
    }
    if (this.keys.has('KeyD') || this.keys.has('ArrowRight')) {
      this.playerCharacter.position.x += moveSpeed * deltaSeconds;
      moved = true;
    }
    
    // Broadcast movement if connected
    if (moved && this.multiplayer && this.multiplayer.connected) {
      this.multiplayer.broadcastMove(this.playerCharacter.position);
    }
    
    // Update camera to follow player
    this.renderer.updateCamera(
      this.playerCharacter.position.x,
      this.playerCharacter.position.y,
      this.playerCharacter.position.z
    );
  }
  
  updateUI() {
    // Update player stats
    this.ui.updatePlayerStats(this.playerCharacter);
    
    // Update leaderboard
    if (this.multiplayer) {
      const players = [
        { character: this.playerCharacter, playerId: this.multiplayer.playerId },
        ...this.multiplayer.getActivePlayers()
      ];
      this.ui.updateLeaderboard(players);
    }
    
    // Update connection status
    if (this.multiplayer) {
      const roomInfo = this.multiplayer.getRoomInfo();
      this.ui.updateConnectionStatus(roomInfo.connected, roomInfo.playerCount, roomInfo.roomId);
    }
  }
  
  generateWorldObjects() {
    this.gameObjects = [];
    
    // Generate city environment
    this.generateCityBlocks();
    
    // Add player cat
    if (this.playerCharacter && this.playerCharacter.alive) {
      this.addCatToScene(this.playerCharacter, '#8B4513');
    }
    
    // Add other player cats
    if (this.multiplayer) {
      for (const player of this.multiplayer.getActivePlayers()) {
        if (player.character && player.character.alive) {
          this.addCatToScene(player.character, this.getPlayerColor(player.playerId));
        }
      }
    }
    
    // Add boss cat if spawned
    const gameState = this.battleRoyale.getGameState();
    if (gameState.boss && gameState.boss.alive) {
      this.addCatToScene(gameState.boss, '#FF0000', true); // Red boss cat
    }
  }
  
  generateCityBlocks() {
    // Simple city grid
    const blockSize = 8;
    const spacing = 12;
    
    for (let x = -30; x <= 30; x += spacing) {
      for (let z = -30; z <= 30; z += spacing) {
        if (Math.random() > 0.3) { // Not every block has building
          const building = GeometryGenerator.createCityBlock(x, z, blockSize, 8 + Math.random() * 8, blockSize);
          this.gameObjects.push(...building);
        }
        
        // Add occasional street furniture
        if (Math.random() > 0.8) {
          const furniture = Math.random() > 0.5 
            ? GeometryGenerator.createStreetLamp(x + 4, z + 4)
            : GeometryGenerator.createTree(x + 4, z + 4);
          this.gameObjects.push(...furniture);
        }
      }
    }
  }
  
  addCatToScene(character, color, isBoss = false) {
    const cat = GeometryGenerator.createCat(color);
    const pos = character.position;
    
    // Add all cat parts to scene with position offset
    for (const part of Object.values(cat)) {
      for (const polygon of part) {
        const offsetVertices = polygon.vertices.map(v => ({
          x: v.x + pos.x,
          y: v.y + pos.y,
          z: v.z + pos.z
        }));
        
        this.gameObjects.push({
          vertices: offsetVertices,
          color: polygon.color
        });
      }
    }
    
    // Add name tag above cat
    if (character.name) {
      // Simple name indicator (would be text in full implementation)
      this.gameObjects.push({
        vertices: [
          { x: pos.x - 0.5, y: pos.y + 3.5, z: pos.z },
          { x: pos.x + 0.5, y: pos.y + 3.5, z: pos.z },
          { x: pos.x + 0.5, y: pos.y + 4, z: pos.z },
          { x: pos.x - 0.5, y: pos.y + 4, z: pos.z }
        ],
        color: isBoss ? '#FF4444' : '#FFFFFF'
      });
    }
  }
  
  getPlayerColor(playerId) {
    // Generate consistent color for each player ID
    const hash = playerId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    const colors = ['#8B4513', '#CD853F', '#DEB887', '#F4A460', '#D2691E', '#A0522D'];
    return colors[Math.abs(hash) % colors.length];
  }
  
  render() {
    // Add all game objects to renderer
    for (const obj of this.gameObjects) {
      this.renderer.addPolygon(obj.vertices, obj.color);
    }
    
    // Render the frame
    this.renderer.render();
  }
  
  handleKeyPress(event) {
    // Combat actions
    if (this.combat.isInCombat()) {
      const currentParticipant = this.combat.getCurrentParticipant();
      if (currentParticipant && currentParticipant.playerId === this.multiplayer.playerId) {
        this.handleCombatInput(event);
      }
      return;
    }
    
    // Other key actions
    switch (event.code) {
      case 'Space':
        this.checkNearbyInteractions();
        break;
      case 'Escape':
        // Show/hide menu
        break;
    }
  }
  
  handleCombatInput(event) {
    const action = this.getCombatActionFromKey(event.code);
    if (action) {
      this.combat.processTurn(this.multiplayer.playerId, action);
    }
  }
  
  getCombatActionFromKey(keyCode) {
    switch (keyCode) {
      case 'Digit1':
        return { type: 'attack', targetId: this.getNearestEnemy() };
      case 'Digit2':
        return { type: 'defend' };
      case 'Digit3':
        return { type: 'diplomacy', targetId: this.getNearestEnemy() };
      default:
        return null;
    }
  }
  
  getNearestEnemy() {
    // Find nearest other player
    let nearest = null;
    let nearestDistance = Infinity;
    
    for (const player of this.multiplayer.getActivePlayers()) {
      if (!player.character || !player.character.alive) continue;
      
      const dx = player.character.position.x - this.playerCharacter.position.x;
      const dz = player.character.position.z - this.playerCharacter.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = player.playerId;
      }
    }
    
    return nearest;
  }
  
  handleMouseClick(event) {
    // Handle UI clicks or world interactions
    if (this.combat.isInCombat()) {
      // Show combat options
      this.showCombatMenu();
    }
  }
  
  showCombatMenu() {
    const nearestEnemy = this.getNearestEnemy();
    if (nearestEnemy) {
      this.ui.showDiplomacyOptions(nearestEnemy, (choice) => {
        const action = { type: 'diplomacy', targetId: nearestEnemy, choice: choice };
        this.combat.processTurn(this.multiplayer.playerId, action);
      });
    }
  }
  
  checkNearbyInteractions() {
    const interactionRange = 3;
    
    // Check for nearby players
    for (const player of this.multiplayer.getActivePlayers()) {
      if (!player.character || !player.character.alive) continue;
      
      const dx = player.character.position.x - this.playerCharacter.position.x;
      const dz = player.character.position.z - this.playerCharacter.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < interactionRange) {
        // Start encounter
        this.startEncounter([
          { playerId: this.multiplayer.playerId, character: this.playerCharacter },
          player
        ]);
        break;
      }
    }
  }
  
  startEncounter(participants) {
    this.ui.showDialog('Another cat approaches! What do you do?', {
      type: 'combat',
      choices: [
        { text: 'Start combat', value: 'combat', callback: () => this.combat.startCombat(participants) },
        { text: 'Attempt diplomacy', value: 'diplomacy', callback: () => this.attemptDiplomacy(participants[1]) },
        { text: 'Try to flee', value: 'flee', callback: () => this.attemptFlee() }
      ]
    });
  }
  
  attemptDiplomacy(target) {
    this.ui.showDiplomacyOptions(target.character.name, (choice) => {
      const result = PathfinderSystem.diplomacyCheck(this.playerCharacter);
      this.ui.showCombatAction({
        type: 'diplomacy',
        participant: this.playerCharacter.name,
        target: target.character.name,
        diplomacyRoll: result
      });
    });
  }
  
  attemptFlee() {
    const fleeCheck = PathfinderSystem.skillCheck(this.playerCharacter, 'Athletics', 10);
    if (fleeCheck.success) {
      this.ui.showSystemMessage('You successfully flee from the encounter!');
    } else {
      this.ui.showSystemMessage('Failed to flee! Combat begins!');
    }
  }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
  window.game = new CatBattleRoyale();
});