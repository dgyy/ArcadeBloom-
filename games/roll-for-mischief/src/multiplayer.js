// WebSocket multiplayer system using PartySocket for cat battle royale
class MultiplayerManager {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.playerId = this.generatePlayerId();
    this.roomId = null;
    this.players = new Map();
    this.messageHandlers = new Map();
    
    // Initialize message handlers
    this.setupMessageHandlers();
  }
  
  generatePlayerId() {
    return 'cat_' + Math.random().toString(36).substr(2, 8);
  }
  
  // Connect to game room
  async connect(roomId = null) {
    try {
      this.roomId = roomId || this.generateRoomId();
      
      // Use PartySocket (provided by competition, doesn't count toward size limit)
      const partySocketUrl = `wss://cats-13k.your-username.partykit.dev/parties/main/${this.roomId}`;
      
      // Fallback to native WebSocket if PartySocket unavailable
      const socketUrl = typeof PartySocket !== 'undefined' 
        ? partySocketUrl 
        : `ws://localhost:8080/room/${this.roomId}`;
      
      this.socket = typeof PartySocket !== 'undefined'
        ? new PartySocket({ 
            host: 'cats-13k.your-username.partykit.dev',
            room: this.roomId,
            party: 'main'
          })
        : new WebSocket(socketUrl);
      
      this.setupSocketListeners();
      
      return new Promise((resolve, reject) => {
        this.socket.onopen = () => {
          this.connected = true;
          console.log('🐱 Connected to cat battle royale room:', this.roomId);
          this.sendMessage('player_join', { playerId: this.playerId });
          resolve();
        };
        
        this.socket.onerror = (error) => {
          console.error('❌ Connection failed:', error);
          reject(error);
        };
      });
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      throw error;
    }
  }
  
  generateRoomId() {
    return 'room_' + Math.random().toString(36).substr(2, 6);
  }
  
  setupSocketListeners() {
    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        this.handleMessage(message);
      } catch (error) {
        console.error('❌ Failed to parse message:', error);
      }
    };
    
    this.socket.onclose = () => {
      this.connected = false;
      console.log('🔌 Disconnected from room');
    };
  }
  
  setupMessageHandlers() {
    this.messageHandlers.set('player_join', (data) => {
      console.log('🐱 Player joined:', data.playerId);
      if (!this.players.has(data.playerId)) {
        this.players.set(data.playerId, {
          id: data.playerId,
          character: data.character,
          position: data.position || { x: 0, y: 0, z: 0 },
          lastSeen: Date.now()
        });
      }
    });
    
    this.messageHandlers.set('player_leave', (data) => {
      console.log('👋 Player left:', data.playerId);
      this.players.delete(data.playerId);
    });
    
    this.messageHandlers.set('player_move', (data) => {
      const player = this.players.get(data.playerId);
      if (player) {
        player.position = data.position;
        player.lastSeen = Date.now();
      }
    });
    
    this.messageHandlers.set('player_attack', (data) => {
      console.log('⚔️ Player attacked:', data);
      // Combat will be handled by combat system
    });
    
    this.messageHandlers.set('combat_start', (data) => {
      console.log('⚔️ Combat started:', data);
    });
    
    this.messageHandlers.set('boss_spawn', (data) => {
      console.log('😼 Boss cat spawned!', data);
    });
    
    this.messageHandlers.set('player_died', (data) => {
      const player = this.players.get(data.playerId);
      if (player && player.character) {
        player.character.alive = false;
        console.log('💀 Player died:', data.playerId);
      }
    });
    
    this.messageHandlers.set('game_state', (data) => {
      // Sync full game state
      this.syncGameState(data);
    });
  }
  
  handleMessage(message) {
    const handler = this.messageHandlers.get(message.type);
    if (handler) {
      handler(message.data);
    } else {
      console.warn('⚠️ Unknown message type:', message.type);
    }
  }
  
  // Send message to all players in room
  sendMessage(type, data = {}) {
    if (!this.connected || !this.socket) return;
    
    const message = {
      type: type,
      data: {
        ...data,
        playerId: this.playerId,
        timestamp: Date.now()
      }
    };
    
    try {
      this.socket.send(JSON.stringify(message));
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  }
  
  // Player actions
  broadcastPlayerJoin(character) {
    this.sendMessage('player_join', {
      character: character,
      position: character.position
    });
  }
  
  broadcastMove(position) {
    this.sendMessage('player_move', { position });
  }
  
  broadcastAttack(targetId, attackResult) {
    this.sendMessage('player_attack', {
      targetId,
      attackResult
    });
  }
  
  broadcastDeath(survivalTime) {
    this.sendMessage('player_died', {
      survivalTime
    });
  }
  
  // Diplomacy action
  broadcastDiplomacy(targetId, diplomacyResult) {
    this.sendMessage('diplomacy_attempt', {
      targetId,
      diplomacyResult
    });
  }
  
  // Get all active players
  getActivePlayers() {
    const now = Date.now();
    const activeTimeout = 5000; // 5 seconds
    
    return Array.from(this.players.values()).filter(
      player => now - player.lastSeen < activeTimeout
    );
  }
  
  // Get player count
  getPlayerCount() {
    return this.getActivePlayers().length;
  }
  
  // Sync game state (for late joiners or reconnects)
  syncGameState(gameState) {
    if (gameState.players) {
      this.players.clear();
      for (const player of gameState.players) {
        this.players.set(player.id, player);
      }
    }
  }
  
  // Clean up disconnected players
  cleanupPlayers() {
    const now = Date.now();
    const timeout = 10000; // 10 seconds
    
    for (const [playerId, player] of this.players.entries()) {
      if (now - player.lastSeen > timeout) {
        this.players.delete(playerId);
        console.log('🧹 Cleaned up inactive player:', playerId);
      }
    }
  }
  
  // Disconnect and cleanup
  disconnect() {
    if (this.socket) {
      this.sendMessage('player_leave');
      this.socket.close();
    }
    this.connected = false;
    this.players.clear();
  }
  
  // Get room info for UI
  getRoomInfo() {
    return {
      roomId: this.roomId,
      connected: this.connected,
      playerCount: this.getPlayerCount(),
      playerId: this.playerId
    };
  }
}