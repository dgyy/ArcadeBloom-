// JRPG-style dialog system with 90s bordered UI for cat battle royale
class UIManager {
  constructor() {
    this.dialogBox = document.getElementById('dialog-box');
    this.dialogText = document.getElementById('dialog-text');
    this.statsPanel = document.getElementById('player-stats');
    this.leaderboard = document.getElementById('leaderboard-list');
    
    this.dialogQueue = [];
    this.isDialogActive = false;
    this.typewriterSpeed = 30; // ms per character
    this.currentDialog = null;
    
    this.setupEventListeners();
  }
  
  setupEventListeners() {
    // Close dialog on click/enter
    document.addEventListener('click', () => {
      if (this.isDialogActive) {
        this.closeDialog();
      }
    });
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (this.isDialogActive) {
          this.closeDialog();
        }
      }
    });
  }
  
  // Show JRPG-style dialog with typewriter effect
  showDialog(text, options = {}) {
    this.dialogQueue.push({
      text: text,
      type: options.type || 'message',
      speaker: options.speaker,
      choices: options.choices,
      callback: options.callback
    });
    
    if (!this.isDialogActive) {
      this.processNextDialog();
    }
  }
  
  processNextDialog() {
    if (this.dialogQueue.length === 0) {
      this.isDialogActive = false;
      return;
    }
    
    this.currentDialog = this.dialogQueue.shift();
    this.isDialogActive = true;
    
    // Style dialog box based on type
    this.styleDialogBox(this.currentDialog.type);
    
    // Format text with speaker
    let displayText = this.currentDialog.text;
    if (this.currentDialog.speaker) {
      displayText = `${this.currentDialog.speaker}: ${displayText}`;
    }
    
    // Show dialog box
    this.dialogBox.classList.add('active');
    
    // Typewriter effect
    this.typewriterEffect(displayText);
  }
  
  typewriterEffect(text) {
    this.dialogText.innerHTML = '';
    let index = 0;
    
    const typeNext = () => {
      if (index < text.length) {
        // Handle special formatting
        if (text[index] === '<') {
          // Find closing tag
          const endTag = text.indexOf('>', index);
          if (endTag !== -1) {
            this.dialogText.innerHTML += text.substring(index, endTag + 1);
            index = endTag + 1;
          } else {
            this.dialogText.innerHTML += text[index];
            index++;
          }
        } else {
          this.dialogText.innerHTML += text[index];
          index++;
        }
        
        setTimeout(typeNext, this.typewriterSpeed);
      } else {
        // Text complete, show choices if any
        if (this.currentDialog.choices) {
          this.showChoices();
        }
      }
    };
    
    typeNext();
  }
  
  styleDialogBox(type) {
    // Remove all type classes
    this.dialogBox.className = 'dialog-box';
    
    switch (type) {
      case 'combat':
        this.dialogBox.style.borderColor = '#ff4444';
        this.dialogBox.style.backgroundColor = '#2a0000';
        break;
      case 'diplomacy':
        this.dialogBox.style.borderColor = '#44ff44';
        this.dialogBox.style.backgroundColor = '#002a00';
        break;
      case 'boss':
        this.dialogBox.style.borderColor = '#ff8844';
        this.dialogBox.style.backgroundColor = '#2a1500';
        break;
      case 'system':
        this.dialogBox.style.borderColor = '#4444ff';
        this.dialogBox.style.backgroundColor = '#00002a';
        break;
      default:
        this.dialogBox.style.borderColor = '#666';
        this.dialogBox.style.backgroundColor = '#000';
    }
  }
  
  showChoices() {
    if (!this.currentDialog.choices) return;
    
    const choicesHTML = this.currentDialog.choices.map((choice, index) => 
      `<div class="choice" data-index="${index}">► ${choice.text}</div>`
    ).join('');
    
    this.dialogText.innerHTML += `<div class="choices">${choicesHTML}</div>`;
    
    // Add choice event listeners
    const choiceElements = this.dialogText.querySelectorAll('.choice');
    choiceElements.forEach((element, index) => {
      element.addEventListener('click', (e) => {
        e.stopPropagation();
        this.selectChoice(index);
      });
    });
  }
  
  selectChoice(index) {
    const choice = this.currentDialog.choices[index];
    if (choice && choice.callback) {
      choice.callback(choice.value);
    }
    this.closeDialog();
  }
  
  closeDialog() {
    if (!this.isDialogActive) return;
    
    this.dialogBox.classList.remove('active');
    
    if (this.currentDialog && this.currentDialog.callback && !this.currentDialog.choices) {
      this.currentDialog.callback();
    }
    
    this.currentDialog = null;
    
    // Process next dialog after short delay
    setTimeout(() => {
      this.processNextDialog();
    }, 200);
  }
  
  // Combat-specific dialogs
  showCombatStart(participants) {
    const participantNames = participants.map(p => p.playerId).join(', ');
    this.showDialog(`Combat begins! Initiative order: ${participantNames}`, {
      type: 'combat',
      speaker: 'Combat System'
    });
  }
  
  showCombatAction(action) {
    let message = '';
    let type = 'combat';
    
    switch (action.type) {
      case 'attack':
        if (action.damage > 0) {
          message = `${action.attacker} ${action.critical ? 'critically hits' : 'hits'} ${action.target} for ${action.damage} damage!`;
          if (action.targetDied) {
            message += ` ${action.target} is defeated!`;
          }
        } else {
          message = `${action.attacker} misses ${action.target}!`;
        }
        break;
        
      case 'diplomacy':
        message = `${action.participant} attempts diplomacy with ${action.target}... ${action.diplomacyRoll.success ? 'Success!' : 'Failed!'}`;
        type = 'diplomacy';
        break;
        
      case 'defend':
        message = action.message;
        break;
    }
    
    if (message) {
      this.showDialog(message, { type: type });
    }
  }
  
  showBossEncounter(bossName) {
    this.showDialog(`A fearsome ${bossName} appears! All cats in the area must face this threat!`, {
      type: 'boss',
      speaker: 'The Alley'
    });
  }
  
  showDiplomacyOptions(targetName, callback) {
    this.showDialog(`How do you approach ${targetName}?`, {
      type: 'diplomacy',
      choices: [
        { text: 'Offer to share territory', value: 'share', callback },
        { text: 'Challenge to honorable duel', value: 'duel', callback },
        { text: 'Try to intimidate', value: 'intimidate', callback },
        { text: 'Attempt to flee', value: 'flee', callback }
      ]
    });
  }
  
  // Update player stats panel
  updatePlayerStats(character) {
    if (!character) return;
    
    const summary = PathfinderSystem.getCharacterSummary(character);
    
    this.statsPanel.innerHTML = `
      <h3>🐱 ${summary.name}</h3>
      <div><strong>Class:</strong> ${summary.class}</div>
      <div><strong>HP:</strong> ${summary.hp}</div>
      <div><strong>AC:</strong> ${summary.ac}</div>
      <div><strong>Survived:</strong> ${summary.survival}</div>
      <div class="stats-grid">
        <div>STR: ${character.stats.STR} (${character.modifiers.STR >= 0 ? '+' : ''}${character.modifiers.STR})</div>
        <div>DEX: ${character.stats.DEX} (${character.modifiers.DEX >= 0 ? '+' : ''}${character.modifiers.DEX})</div>
        <div>CON: ${character.stats.CON} (${character.modifiers.CON >= 0 ? '+' : ''}${character.modifiers.CON})</div>
        <div>INT: ${character.stats.INT} (${character.modifiers.INT >= 0 ? '+' : ''}${character.modifiers.INT})</div>
        <div>WIS: ${character.stats.WIS} (${character.modifiers.WIS >= 0 ? '+' : ''}${character.modifiers.WIS})</div>
        <div>CHA: ${character.stats.CHA} (${character.modifiers.CHA >= 0 ? '+' : ''}${character.modifiers.CHA})</div>
      </div>
    `;
  }
  
  // Update leaderboard
  updateLeaderboard(players) {
    if (!players || players.length === 0) {
      this.leaderboard.innerHTML = '<div>No other cats detected...</div>';
      return;
    }
    
    // Sort by survival time
    const sortedPlayers = players
      .filter(p => p.character)
      .sort((a, b) => b.character.survivalTime - a.character.survivalTime)
      .slice(0, 10); // Top 10
    
    const leaderboardHTML = sortedPlayers.map((player, index) => {
      const summary = PathfinderSystem.getCharacterSummary(player.character);
      const rank = index + 1;
      const statusIcon = summary.alive ? '🐱' : '💀';
      
      return `
        <div class="leaderboard-entry ${!summary.alive ? 'dead' : ''}">
          <span class="rank">${rank}.</span>
          <span class="status">${statusIcon}</span>
          <span class="name">${summary.name}</span>
          <span class="time">${summary.survival}</span>
        </div>
      `;
    }).join('');
    
    this.leaderboard.innerHTML = leaderboardHTML;
  }
  
  // Show system messages
  showSystemMessage(message) {
    this.showDialog(message, {
      type: 'system',
      speaker: 'System'
    });
  }
  
  // Show connection status
  updateConnectionStatus(connected, playerCount, roomId) {
    const statusHTML = `
      <div class="connection-status">
        ${connected ? '🟢' : '🔴'} ${connected ? 'Connected' : 'Disconnected'}
        ${connected ? `| Room: ${roomId} | Players: ${playerCount}` : ''}
      </div>
    `;
    
    // Add to stats panel
    this.statsPanel.innerHTML = statusHTML + this.statsPanel.innerHTML;
  }
}