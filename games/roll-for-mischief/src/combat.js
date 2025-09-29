// Turn-based combat system with initiative for multiplayer cat battle royale
class CombatSystem {
  constructor(multiplayerManager, pathfinderSystem) {
    this.multiplayer = multiplayerManager;
    this.pathfinder = pathfinderSystem;
    this.activeCombats = new Map(); // combatId -> combat instance
    this.initiativeOrder = [];
    this.currentTurnIndex = 0;
    this.combatPhase = 'exploration'; // exploration, initiative, combat, resolution
  }
  
  // Start combat between players or with boss
  startCombat(participants) {
    const combatId = this.generateCombatId();
    
    // Roll initiative for all participants
    const initiativeResults = participants.map(participant => ({
      ...participant,
      initiative: this.pathfinder.rollInitiative(participant.character)
    }));
    
    // Sort by initiative (highest first)
    this.initiativeOrder = initiativeResults.sort((a, b) => b.initiative - a.initiative);
    this.currentTurnIndex = 0;
    this.combatPhase = 'combat';
    
    const combat = {
      id: combatId,
      participants: this.initiativeOrder,
      round: 1,
      currentParticipant: this.initiativeOrder[0],
      startTime: Date.now()
    };
    
    this.activeCombats.set(combatId, combat);
    
    // Broadcast combat start
    if (this.multiplayer) {
      this.multiplayer.sendMessage('combat_start', {
        combatId: combatId,
        participants: this.initiativeOrder.map(p => ({
          playerId: p.playerId,
          initiative: p.initiative,
          character: this.pathfinder.getCharacterSummary(p.character)
        }))
      });
    }
    
    console.log('⚔️ Combat started! Initiative order:', this.initiativeOrder.map(p => `${p.playerId} (${p.initiative})`));
    
    return combat;
  }
  
  generateCombatId() {
    return 'combat_' + Math.random().toString(36).substr(2, 8);
  }
  
  // Get current turn participant
  getCurrentParticipant() {
    if (this.initiativeOrder.length === 0) return null;
    return this.initiativeOrder[this.currentTurnIndex];
  }
  
  // Process turn actions
  processTurn(participantId, action) {
    const currentParticipant = this.getCurrentParticipant();
    
    if (!currentParticipant || currentParticipant.playerId !== participantId) {
      console.warn('⚠️ Not your turn!', participantId);
      return { success: false, message: 'Not your turn!' };
    }
    
    const result = this.executeAction(currentParticipant, action);
    
    if (result.success) {
      this.endTurn();
    }
    
    return result;
  }
  
  // Execute combat action
  executeAction(participant, action) {
    switch (action.type) {
      case 'attack':
        return this.executeAttack(participant, action);
      case 'diplomacy':
        return this.executeDiplomacy(participant, action);
      case 'move':
        return this.executeMove(participant, action);
      case 'defend':
        return this.executeDefend(participant);
      default:
        return { success: false, message: 'Unknown action type' };
    }
  }
  
  // Execute attack action
  executeAttack(attacker, action) {
    const target = this.findParticipant(action.targetId);
    if (!target) {
      return { success: false, message: 'Target not found' };
    }
    
    // Make attack roll
    const attackRoll = this.pathfinder.makeAttackRoll(attacker.character, target.character);
    
    let result = {
      success: true,
      type: 'attack',
      attacker: attacker.playerId,
      target: target.playerId,
      attackRoll: attackRoll,
      damage: 0
    };
    
    if (attackRoll.hits) {
      const damage = this.pathfinder.rollDamage(attacker.character, attackRoll.critical);
      this.pathfinder.applyDamage(target.character, damage);
      
      result.damage = damage;
      result.targetHP = target.character.hp;
      result.critical = attackRoll.critical;
      
      console.log(`⚔️ ${attacker.playerId} hits ${target.playerId} for ${damage} damage!`);
      
      // Check for death
      if (!target.character.alive) {
        result.targetDied = true;
        this.handleParticipantDeath(target);
      }
    } else {
      console.log(`🛡️ ${attacker.playerId} misses ${target.playerId}`);
    }
    
    // Broadcast attack result
    if (this.multiplayer) {
      this.multiplayer.sendMessage('combat_action', result);
    }
    
    return result;
  }
  
  // Execute diplomacy action
  executeDiplomacy(participant, action) {
    const target = this.findParticipant(action.targetId);
    if (!target) {
      return { success: false, message: 'Target not found' };
    }
    
    const diplomacyCheck = this.pathfinder.diplomacyCheck(participant.character, 12);
    
    const result = {
      success: true,
      type: 'diplomacy',
      participant: participant.playerId,
      target: target.playerId,
      diplomacyRoll: diplomacyCheck,
      resolved: diplomacyCheck.success
    };
    
    if (diplomacyCheck.success) {
      // Successfully avoid combat with this target
      result.message = `${participant.playerId} convinces ${target.playerId} to avoid conflict!`;
      this.removeParticipant(target.playerId);
    } else {
      result.message = `${participant.playerId} fails to convince ${target.playerId}`;
    }
    
    console.log(result.message);
    
    // Broadcast diplomacy result
    if (this.multiplayer) {
      this.multiplayer.sendMessage('combat_action', result);
    }
    
    return result;
  }
  
  // Execute move action
  executeMove(participant, action) {
    participant.character.position = action.position;
    
    const result = {
      success: true,
      type: 'move',
      participant: participant.playerId,
      position: action.position
    };
    
    if (this.multiplayer) {
      this.multiplayer.sendMessage('combat_action', result);
    }
    
    return result;
  }
  
  // Execute defend action
  executeDefend(participant) {
    // Temporary AC bonus until next turn
    participant.character.ac += 2;
    participant.character.defending = true;
    
    const result = {
      success: true,
      type: 'defend',
      participant: participant.playerId,
      message: `${participant.playerId} takes a defensive stance (+2 AC)`
    };
    
    console.log(result.message);
    
    if (this.multiplayer) {
      this.multiplayer.sendMessage('combat_action', result);
    }
    
    return result;
  }
  
  // End current turn and advance to next
  endTurn() {
    const currentParticipant = this.getCurrentParticipant();
    
    // Remove defensive bonuses
    if (currentParticipant && currentParticipant.character.defending) {
      currentParticipant.character.ac -= 2;
      currentParticipant.character.defending = false;
    }
    
    this.currentTurnIndex++;
    
    // Check if round is complete
    if (this.currentTurnIndex >= this.initiativeOrder.length) {
      this.nextRound();
    }
    
    // Check combat end conditions
    this.checkCombatEnd();
  }
  
  // Start next combat round
  nextRound() {
    this.currentTurnIndex = 0;
    
    for (const combat of this.activeCombats.values()) {
      combat.round++;
    }
    
    console.log(`🔄 Round ${this.getCurrentCombat()?.round} begins!`);
  }
  
  // Find participant by ID
  findParticipant(participantId) {
    return this.initiativeOrder.find(p => p.playerId === participantId);
  }
  
  // Remove participant from combat
  removeParticipant(participantId) {
    const index = this.initiativeOrder.findIndex(p => p.playerId === participantId);
    if (index >= 0) {
      this.initiativeOrder.splice(index, 1);
      
      // Adjust turn index if needed
      if (this.currentTurnIndex > index) {
        this.currentTurnIndex--;
      } else if (this.currentTurnIndex >= this.initiativeOrder.length) {
        this.currentTurnIndex = 0;
      }
    }
  }
  
  // Handle participant death
  handleParticipantDeath(participant) {
    console.log(`💀 ${participant.playerId} has died!`);
    
    if (this.multiplayer) {
      this.multiplayer.sendMessage('participant_died', {
        playerId: participant.playerId,
        survivalTime: participant.character.survivalTime
      });
    }
    
    this.removeParticipant(participant.playerId);
  }
  
  // Check if combat should end
  checkCombatEnd() {
    const aliveCombatants = this.initiativeOrder.filter(p => p.character.alive);
    
    if (aliveCombatants.length <= 1) {
      this.endCombat();
    }
  }
  
  // End combat
  endCombat() {
    const winner = this.initiativeOrder.find(p => p.character.alive);
    
    console.log('🏆 Combat ended!', winner ? `Winner: ${winner.playerId}` : 'No survivors');
    
    if (this.multiplayer) {
      this.multiplayer.sendMessage('combat_end', {
        winner: winner?.playerId || null,
        duration: Date.now() - this.getCurrentCombat()?.startTime
      });
    }
    
    this.combatPhase = 'exploration';
    this.initiativeOrder = [];
    this.currentTurnIndex = 0;
    
    // Clear all active combats
    this.activeCombats.clear();
  }
  
  // Get current combat instance
  getCurrentCombat() {
    return Array.from(this.activeCombats.values())[0] || null;
  }
  
  // Check if currently in combat
  isInCombat() {
    return this.combatPhase === 'combat' && this.initiativeOrder.length > 0;
  }
  
  // Get combat summary for UI
  getCombatSummary() {
    const combat = this.getCurrentCombat();
    if (!combat) return null;
    
    return {
      round: combat.round,
      currentTurn: this.getCurrentParticipant()?.playerId,
      participants: this.initiativeOrder.map(p => ({
        playerId: p.playerId,
        initiative: p.initiative,
        hp: p.character.hp,
        maxHP: p.character.maxHP,
        alive: p.character.alive
      }))
    };
  }
}