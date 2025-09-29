// Simplified Pathfinder 2e mechanics for 13KB cat battle royale
class PathfinderSystem {
  
  // Core ability scores and modifiers
  static getAbilityModifier(score) {
    return Math.floor((score - 10) / 2);
  }
  
  // Cat classes with simplified features
  static CAT_CLASSES = {
    FIGHTER: {
      name: 'Alley Fighter',
      hitDie: 10,
      proficiencies: ['Athletics', 'Intimidation'],
      classFeatures: ['Combat Reflexes', 'Power Attack'],
      baseAttackBonus: 3
    },
    ROGUE: {
      name: 'Shadow Cat',
      hitDie: 8, 
      proficiencies: ['Stealth', 'Sleight of Hand', 'Perception'],
      classFeatures: ['Sneak Attack', 'Evasion'],
      baseAttackBonus: 2
    },
    WIZARD: {
      name: 'Mystic Cat',
      hitDie: 6,
      proficiencies: ['Arcana', 'Investigation'],
      classFeatures: ['Spellcasting', 'Familiar'],
      baseAttackBonus: 1,
      spells: ['Magic Missile', 'Shield', 'Sleep']
    },
    CLERIC: {
      name: 'Temple Cat',
      hitDie: 8,
      proficiencies: ['Medicine', 'Religion'],
      classFeatures: ['Healing', 'Turn Undead'],
      baseAttackBonus: 2,
      spells: ['Cure Wounds', 'Bless', 'Command']
    }
  };
  
  // Generate random cat character
  static generateRandomCat(playerName = 'Unknown Cat') {
    const classKeys = Object.keys(this.CAT_CLASSES);
    const selectedClass = this.CAT_CLASSES[classKeys[Math.floor(Math.random() * classKeys.length)]];
    
    // Roll stats (4d6 drop lowest, simplified to 3d6+3 for space)
    const stats = {
      STR: this.rollStat(),
      DEX: this.rollStat(), 
      CON: this.rollStat(),
      INT: this.rollStat(),
      WIS: this.rollStat(),
      CHA: this.rollStat()
    };
    
    // Calculate derived stats
    const conModifier = this.getAbilityModifier(stats.CON);
    const maxHP = selectedClass.hitDie + conModifier + (Math.random() * 3 | 0); // Slight randomization
    
    return {
      name: playerName,
      class: selectedClass,
      level: 1,
      stats: stats,
      modifiers: {
        STR: this.getAbilityModifier(stats.STR),
        DEX: this.getAbilityModifier(stats.DEX),
        CON: this.getAbilityModifier(stats.CON),
        INT: this.getAbilityModifier(stats.INT),
        WIS: this.getAbilityModifier(stats.WIS),
        CHA: this.getAbilityModifier(stats.CHA)
      },
      hp: maxHP,
      maxHP: maxHP,
      ac: 10 + this.getAbilityModifier(stats.DEX), // Base AC
      initiative: 0,
      position: { x: 0, y: 0, z: 0 },
      actions: 3, // Simplified action economy
      alive: true,
      survivalTime: 0
    };
  }
  
  // Simple stat rolling (3d6+3 for bounded results)
  static rollStat() {
    return 3 + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6);
  }
  
  // Roll d20 with modifier
  static rollD20(modifier = 0) {
    return Math.floor(Math.random() * 20) + 1 + modifier;
  }
  
  // Roll initiative for combat
  static rollInitiative(character) {
    character.initiative = this.rollD20(character.modifiers.DEX);
    return character.initiative;
  }
  
  // Attack roll mechanics
  static makeAttackRoll(attacker, target) {
    const baseAttack = attacker.class.baseAttackBonus || 1;
    const strModifier = attacker.modifiers.STR;
    const roll = this.rollD20(baseAttack + strModifier);
    
    const hits = roll >= target.ac;
    
    return {
      roll: roll,
      total: roll,
      hits: hits,
      critical: roll === 20 + baseAttack + strModifier
    };
  }
  
  // Damage calculation
  static rollDamage(attacker, critical = false) {
    let damage = Math.floor(Math.random() * 6) + 1 + attacker.modifiers.STR; // 1d6 + STR
    
    // Critical hit doubles damage
    if (critical) damage *= 2;
    
    // Minimum 1 damage
    return Math.max(1, damage);
  }
  
  // Apply damage to character
  static applyDamage(character, damage) {
    character.hp = Math.max(0, character.hp - damage);
    
    if (character.hp <= 0) {
      character.alive = false;
    }
    
    return character.hp;
  }
  
  // Diplomacy check (skip combat)
  static diplomacyCheck(character, difficulty = 12) {
    const roll = this.rollD20(character.modifiers.CHA);
    return {
      roll: roll,
      success: roll >= difficulty,
      margin: roll - difficulty
    };
  }
  
  // Skill checks
  static skillCheck(character, skill, difficulty = 12) {
    let modifier = 0;
    
    // Simple skill to stat mapping
    const skillMap = {
      'Athletics': 'STR',
      'Stealth': 'DEX', 
      'Perception': 'WIS',
      'Intimidation': 'CHA',
      'Medicine': 'WIS',
      'Arcana': 'INT',
      'Investigation': 'INT',
      'Religion': 'WIS',
      'Sleight of Hand': 'DEX'
    };
    
    const stat = skillMap[skill] || 'WIS';
    modifier = character.modifiers[stat];
    
    // Proficiency bonus for class skills
    if (character.class.proficiencies.includes(skill)) {
      modifier += 2; // Simplified proficiency bonus
    }
    
    const roll = this.rollD20(modifier);
    
    return {
      roll: roll,
      success: roll >= difficulty,
      margin: roll - difficulty
    };
  }
  
  // Update survival time (called each game tick)
  static updateSurvival(character, deltaTime) {
    if (character.alive) {
      character.survivalTime += deltaTime;
    }
    return character.survivalTime;
  }
  
  // Get character summary for UI
  static getCharacterSummary(character) {
    return {
      name: character.name,
      class: character.class.name,
      hp: `${character.hp}/${character.maxHP}`,
      ac: character.ac,
      level: character.level,
      survival: Math.floor(character.survivalTime / 1000) + 's',
      alive: character.alive
    };
  }
}