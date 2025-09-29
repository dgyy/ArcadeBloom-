// Battle royale mechanics with roaming boss cat for multiplayer survival
class BattleRoyaleManager {
  constructor(multiplayerManager, combatSystem, uiManager) {
    this.multiplayer = multiplayerManager;
    this.combat = combatSystem;
    this.ui = uiManager;
    
    // Battle royale state
    this.gameState = 'waiting'; // waiting, active, ending
    this.playArea = { centerX: 0, centerZ: 0, radius: 50 }; // Starting area
    this.shrinkRate = 0.1; // Units per second
    this.nextShrink = Date.now() + 30000; // 30 seconds until first shrink
    this.shrinkInterval = 20000; // 20 seconds between shrinks
    
    // Boss cat system
    this.boss = null;
    this.bossSpawnTimer = Date.now() + 60000; // Boss spawns after 1 minute
    this.bossPatrolRoute = [];
    this.bossLastSeen = null;
    
    // Survival tracking
    this.survivors = new Map();
    this.gameStartTime = null;
    this.lastUpdate = Date.now();
    
    // Environmental hazards
    this.hazards = [];
    
    this.setupBossAI();
  }
  
  // Start battle royale game
  startGame(players) {
    this.gameState = 'active';
    this.gameStartTime = Date.now();
    
    // Initialize survivors
    for (const player of players) {
      this.survivors.set(player.playerId, {
        ...player,
        entryTime: Date.now(),
        isInPlayArea: true,
        damageFromStorm: 0
      });
    }
    
    // Generate boss patrol route through city
    this.generateBossPatrolRoute();
    
    this.ui.showSystemMessage('🏁 The great cat battle royale begins! Survive as long as possible!');
    this.ui.showSystemMessage('🌪️ The play area will shrink over time. Stay inside the safe zone!');
    
    console.log('🏁 Battle Royale started with', players.length, 'cats');
    
    // Broadcast game start
    if (this.multiplayer) {
      this.multiplayer.sendMessage('battle_royale_start', {
        playArea: this.playArea,
        playerCount: players.length
      });
    }
  }
  
  // Main game loop update
  update(deltaTime) {
    if (this.gameState !== 'active') return;
    
    const now = Date.now();
    this.lastUpdate = now;
    
    // Update survival times
    this.updateSurvivalTimes(deltaTime);
    
    // Check play area shrinking
    this.updatePlayArea(now);
    
    // Update boss AI
    this.updateBoss(deltaTime, now);
    
    // Check storm damage
    this.checkStormDamage();
    
    // Check win condition
    this.checkEndGame();
    
    // Clean up inactive players
    if (this.multiplayer) {
      this.multiplayer.cleanupPlayers();
    }
  }
  
  // Update player survival times
  updateSurvivalTimes(deltaTime) {
    for (const [playerId, survivor] of this.survivors.entries()) {
      if (survivor.character && survivor.character.alive) {
        PathfinderSystem.updateSurvival(survivor.character, deltaTime);
      }
    }
  }
  
  // Handle play area shrinking
  updatePlayArea(now) {
    if (now >= this.nextShrink && this.playArea.radius > 5) {
      this.shrinkPlayArea();
      this.nextShrink = now + this.shrinkInterval;
      
      this.ui.showSystemMessage(`⚠️ The safe area is shrinking! New radius: ${this.playArea.radius.toFixed(1)} units`);
      
      // Broadcast shrink event
      if (this.multiplayer) {
        this.multiplayer.sendMessage('play_area_shrink', {
          playArea: this.playArea,
          nextShrink: this.nextShrink
        });
      }
    }
  }
  
  shrinkPlayArea() {
    this.playArea.radius = Math.max(5, this.playArea.radius - 5); // Shrink by 5 units
    
    // Move center slightly (random drift)
    const drift = 2;
    this.playArea.centerX += (Math.random() - 0.5) * drift;
    this.playArea.centerZ += (Math.random() - 0.5) * drift;
    
    console.log('🌪️ Play area shrunk to radius', this.playArea.radius);
  }
  
  // Check if position is in safe area
  isInSafeArea(x, z) {
    const dx = x - this.playArea.centerX;
    const dz = z - this.playArea.centerZ;
    const distance = Math.sqrt(dx * dx + dz * dz);
    return distance <= this.playArea.radius;
  }
  
  // Apply storm damage to players outside safe area
  checkStormDamage() {
    const stormDamagePerSecond = 2;
    const deltaSeconds = 1; // Simplified to 1 second intervals
    
    for (const [playerId, survivor] of this.survivors.entries()) {
      if (!survivor.character || !survivor.character.alive) continue;
      
      const pos = survivor.character.position;
      const inSafeArea = this.isInSafeArea(pos.x, pos.z);
      
      if (!inSafeArea) {
        if (survivor.isInPlayArea) {
          // Just left safe area
          this.ui.showDialog(`${survivor.character.name} is caught in the storm!`, {
            type: 'system'
          });
          survivor.isInPlayArea = false;
        }
        
        // Apply storm damage
        const damage = stormDamagePerSecond * deltaSeconds;
        PathfinderSystem.applyDamage(survivor.character, damage);
        survivor.damageFromStorm += damage;
        
        if (!survivor.character.alive) {
          this.handlePlayerDeath(survivor, 'storm');
        }
      } else if (!survivor.isInPlayArea) {
        // Re-entered safe area
        this.ui.showDialog(`${survivor.character.name} makes it back to safety!`, {
          type: 'system'
        });
        survivor.isInPlayArea = true;
      }
    }
  }
  
  // Boss AI setup and management
  setupBossAI() {
    // Boss cat stats (much stronger than players)
    this.bossTemplate = {
      name: 'The Shadow Cat',
      class: {
        name: 'Alpha Predator',
        hitDie: 20,
        baseAttackBonus: 8
      },
      stats: { STR: 20, DEX: 18, CON: 18, INT: 14, WIS: 16, CHA: 12 },
      modifiers: { STR: 5, DEX: 4, CON: 4, INT: 2, WIS: 3, CHA: 1 },
      hp: 80,
      maxHP: 80,
      ac: 18,
      position: { x: 0, y: 0, z: 0 },
      alive: true,
      isboss: true
    };
  }
  
  generateBossPatrolRoute() {
    // Create patrol points around the map
    this.bossPatrolRoute = [];
    const numPoints = 6;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * Math.PI * 2;
      const radius = 15; // Patrol within smaller radius
      
      this.bossPatrolRoute.push({
        x: Math.cos(angle) * radius,
        z: Math.sin(angle) * radius
      });
    }
  }
  
  updateBoss(deltaTime, now) {
    // Spawn boss if time has come
    if (!this.boss && now >= this.bossSpawnTimer) {
      this.spawnBoss();
    }
    
    if (!this.boss || !this.boss.alive) return;
    
    // Boss AI: patrol and hunt players
    this.updateBossAI(deltaTime);
    
    // Check for boss encounters with players
    this.checkBossEncounters();
  }
  
  spawnBoss() {
    this.boss = { ...this.bossTemplate };
    
    // Spawn at random patrol point
    const spawnPoint = this.bossPatrolRoute[Math.floor(Math.random() * this.bossPatrolRoute.length)];
    this.boss.position = { x: spawnPoint.x, y: 0, z: spawnPoint.z };
    this.boss.currentTarget = 0; // Index in patrol route
    
    this.ui.showBossEncounter(this.boss.name);
    console.log('😼 Boss spawned:', this.boss.name);
    
    // Broadcast boss spawn
    if (this.multiplayer) {
      this.multiplayer.sendMessage('boss_spawn', {
        boss: {
          name: this.boss.name,
          position: this.boss.position,
          hp: this.boss.hp,
          maxHP: this.boss.maxHP
        }
      });
    }
  }
  
  updateBossAI(deltaTime) {
    const speed = 3; // Units per second
    const detectionRange = 8;
    
    // Find nearest living player
    let nearestPlayer = null;
    let nearestDistance = Infinity;
    
    for (const survivor of this.survivors.values()) {
      if (!survivor.character || !survivor.character.alive) continue;
      
      const dx = survivor.character.position.x - this.boss.position.x;
      const dz = survivor.character.position.z - this.boss.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestPlayer = survivor;
      }
    }
    
    // If player is within detection range, hunt them
    if (nearestPlayer && nearestDistance < detectionRange) {
      this.moveBossToward(nearestPlayer.character.position, speed, deltaTime / 1000);
    } else {
      // Continue patrol route
      this.moveBossOnPatrol(speed, deltaTime / 1000);
    }
    
    // Broadcast boss position update
    if (this.multiplayer) {
      this.multiplayer.sendMessage('boss_update', {
        position: this.boss.position,
        hp: this.boss.hp
      });
    }
  }
  
  moveBossToward(targetPos, speed, deltaSeconds) {
    const dx = targetPos.x - this.boss.position.x;
    const dz = targetPos.z - this.boss.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance > 0.5) { // Don't move if very close
      const moveDistance = speed * deltaSeconds;
      const ratio = Math.min(moveDistance / distance, 1);
      
      this.boss.position.x += dx * ratio;
      this.boss.position.z += dz * ratio;
    }
  }
  
  moveBossOnPatrol(speed, deltaSeconds) {
    const target = this.bossPatrolRoute[this.boss.currentTarget];
    const dx = target.x - this.boss.position.x;
    const dz = target.z - this.boss.position.z;
    const distance = Math.sqrt(dx * dx + dz * dz);
    
    if (distance < 1) {
      // Reached patrol point, move to next
      this.boss.currentTarget = (this.boss.currentTarget + 1) % this.bossPatrolRoute.length;
    } else {
      // Move toward current patrol point
      const moveDistance = speed * deltaSeconds;
      const ratio = Math.min(moveDistance / distance, 1);
      
      this.boss.position.x += dx * ratio;
      this.boss.position.z += dz * ratio;
    }
  }
  
  checkBossEncounters() {
    const encounterRange = 3;
    
    for (const survivor of this.survivors.values()) {
      if (!survivor.character || !survivor.character.alive) continue;
      
      const dx = survivor.character.position.x - this.boss.position.x;
      const dz = survivor.character.position.z - this.boss.position.z;
      const distance = Math.sqrt(dx * dx + dz * dz);
      
      if (distance < encounterRange) {
        this.initiateBossFight([survivor, { character: this.boss, playerId: 'boss' }]);
        break; // Only one encounter at a time
      }
    }
  }
  
  initiateBossFight(participants) {
    console.log('😼 Boss fight initiated!');
    this.combat.startCombat(participants);
  }
  
  // Handle player death
  handlePlayerDeath(survivor, cause = 'combat') {
    const survivalTime = survivor.character.survivalTime;
    
    this.ui.showDialog(`💀 ${survivor.character.name} has been eliminated after surviving ${Math.floor(survivalTime / 1000)} seconds!`, {
      type: 'system'
    });
    
    // Update leaderboard
    survivor.deathTime = Date.now();
    survivor.deathCause = cause;
    
    // Broadcast death
    if (this.multiplayer) {
      this.multiplayer.broadcastDeath(survivalTime);
    }
    
    console.log('💀 Player eliminated:', survivor.character.name, 'Cause:', cause, 'Time:', Math.floor(survivalTime / 1000) + 's');
  }
  
  // Check game end conditions
  checkEndGame() {
    const aliveSurvivors = Array.from(this.survivors.values()).filter(s => s.character && s.character.alive);
    
    if (aliveSurvivors.length <= 1) {
      this.endGame(aliveSurvivors[0] || null);
    }
  }
  
  // End the battle royale game
  endGame(winner = null) {
    this.gameState = 'ending';
    
    if (winner) {
      const survivalTime = Math.floor(winner.character.survivalTime / 1000);
      this.ui.showDialog(`🏆 ${winner.character.name} wins the battle royale! Survived for ${survivalTime} seconds!`, {
        type: 'system'
      });
    } else {
      this.ui.showDialog('💀 No survivors remain. The alley claims all...', {
        type: 'system'
      });
    }
    
    // Broadcast game end
    if (this.multiplayer) {
      this.multiplayer.sendMessage('battle_royale_end', {
        winner: winner?.character.name || null,
        duration: Date.now() - this.gameStartTime
      });
    }
    
    console.log('🏁 Battle Royale ended. Winner:', winner?.character.name || 'None');
  }
  
  // Get current game state for UI
  getGameState() {
    return {
      state: this.gameState,
      playArea: this.playArea,
      nextShrink: this.nextShrink,
      survivorCount: Array.from(this.survivors.values()).filter(s => s.character && s.character.alive).length,
      boss: this.boss ? {
        name: this.boss.name,
        position: this.boss.position,
        hp: this.boss.hp,
        maxHP: this.boss.maxHP,
        alive: this.boss.alive
      } : null,
      gameTime: this.gameStartTime ? Date.now() - this.gameStartTime : 0
    };
  }
}