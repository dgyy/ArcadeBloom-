// Ultra-compressed Pathfinder 2e for 13KB - only essential features
const P = {
  // Cat classes - minimal data
  C: {
    F: { n: 'Fighter', h: 10, a: 1, s: [] }, // name, hitDie, attack bonus, spells
    R: { n: 'Rogue', h: 8, a: 1, s: ['hide', 'sneak'] }, // stealth abilities
    W: { n: 'Wizard', h: 6, a: 0, s: ['firebolt'] }, // spell list
    C: { n: 'Cleric', h: 8, a: 1, s: ['heal1', 'heal2', 'heal3', 'harm'] } // healing + harm
  },
  
  // Generate cat (ultra-minimal)
  g(n = 'Cat') {
    const keys = Object.keys(this.C);
    const c = this.C[keys[Math.floor(Math.random() * keys.length)]];
    const s = () => 10 + (Math.random() * 8 | 0); // 10-17 base stats
    const st = { S: s(), D: s(), C: s(), I: s(), W: s(), H: s() }; // STR,DEX,CON,INT,WIS,CHA
    
    // Give classes their primary stat boost and secondary stats
    if (c.n === 'Fighter') { st.S += 3; st.D += 2; } // STR 13-20, DEX 12-19 for AC
    else if (c.n === 'Rogue') st.D += 3; // DEX 13-20  
    else if (c.n === 'Wizard') { st.I += 3; st.D += 1; } // INT 13-20, DEX 11-18
    else if (c.n === 'Cleric') { st.W += 3; st.D += 1; } // WIS 13-20, DEX 11-18
    
    const hp = c.h + Math.floor((st.C - 10) / 2);
    
    // Calculate AC with class armor bonuses
    let ac = 10 + Math.floor((st.D - 10) / 2); // Base AC + DEX
    if (c.n === 'Fighter') ac += 3; // Chain mail armor
    else if (c.n === 'Cleric') ac += 2; // Scale mail armor
    
    return {
      n, c, s: st, h: hp, m: hp, // name, class, stats, hp, maxhp
      a: ac, // AC with armor
      p: { x: 0, y: 0, z: 0 }, // position
      v: true, t: 0 // alive, time
    };
  },
  
  // Roll d20 + modifier
  r(m = 0) { return Math.floor(Math.random() * 20) + 1 + m; },
  
  // Initiative
  i(cat) { return cat.i = this.r(Math.floor((cat.s.D - 10) / 2)); },
  
  // Attack (with optional MAP)
  k(a, t, map = 0) {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const atkBonus = a.c.a + Math.floor((a.s.S - 10) / 2) + map;
    const total = d20 + atkBonus;
    const hit = total >= t.a;
    
    if (hit) {
      const d6 = Math.floor(Math.random() * 6) + 1;
      const strMod = Math.floor((a.s.S - 10) / 2);
      const dmg = Math.max(1, d6 + strMod);
      t.h = Math.max(0, t.h - dmg);
      if (t.h <= 0) t.v = false;
      return { h: true, d: dmg, d20, atkBonus, total, targetAC: t.a, d6, strMod };
    }
    return { h: false, d: 0, d20, atkBonus, total, targetAC: t.a };
  },
  
  // Diplomacy
  d(cat) { return this.r(Math.floor((cat.s.H - 10) / 2)) >= 12; },
  
  // Spell attacks and abilities
  spell(caster, target, spellName, range = 30) {
    const dist = target ? Math.sqrt(Math.pow(target.pos.x - caster.pos.x, 2) + Math.pow(target.pos.z - caster.pos.z, 2)) : 0;
    
    switch(spellName) {
      case 'firebolt': // Wizard ranged attack
        if (dist > range) return { h: false, msg: 'Out of range' };
        const d20 = Math.floor(Math.random() * 20) + 1;
        const intMod = Math.floor((caster.s.I - 10) / 2);
        const atkBonus = caster.c.a + intMod;
        const total = d20 + atkBonus;
        const hit = total >= target.a;
        if (hit) {
          const d10 = Math.floor(Math.random() * 10) + 1;
          const dmg = d10;
          target.h = Math.max(0, target.h - dmg);
          if (target.h <= 0) target.v = false;
          return { h: true, d: dmg, d20, atkBonus, total, targetAC: target.a, die: 'd10' };
        }
        return { h: false, d: 0, d20, atkBonus, total, targetAC: target.a };
        
      case 'harm': // Cleric ranged attack  
        if (dist > range) return { h: false, msg: 'Out of range' };
        const d20h = Math.floor(Math.random() * 20) + 1;
        const wisMod = Math.floor((caster.s.W - 10) / 2);
        const atkBonusH = caster.c.a + wisMod;
        const totalH = d20h + atkBonusH;
        const hitH = totalH >= target.a;
        if (hitH) {
          const d8 = Math.floor(Math.random() * 8) + 1;
          const dmgH = d8 + wisMod;
          target.h = Math.max(0, target.h - dmgH);
          if (target.h <= 0) target.v = false;
          return { h: true, d: dmgH, d20: d20h, atkBonus: atkBonusH, total: totalH, targetAC: target.a, die: 'd8+Wis' };
        }
        return { h: false, d: 0, d20: d20h, atkBonus: atkBonusH, total: totalH, targetAC: target.a };
        
      case 'heal1': // 1-action heal
        const heal1 = Math.floor(Math.random() * 8) + 1 + Math.floor((caster.s.W - 10) / 2);
        caster.h = Math.min(caster.m, caster.h + heal1);
        return { heal: heal1, msg: '1d8+Wis healing' };
        
      case 'heal2': // 2-action heal  
        const heal2 = (Math.floor(Math.random() * 8) + 1) * 2 + Math.floor((caster.s.W - 10) / 2);
        caster.h = Math.min(caster.m, caster.h + heal2);
        return { heal: heal2, msg: '2d8+Wis healing' };
        
      case 'heal3': // 3-action heal
        const heal3 = (Math.floor(Math.random() * 8) + 1) * 3 + Math.floor((caster.s.W - 10) / 2);
        caster.h = Math.min(caster.m, caster.h + heal3);
        return { heal: heal3, msg: '3d8+Wis healing' };
        
      case 'hide': // Rogue stealth
        caster.hidden = true;
        return { msg: 'Hidden until next attack' };
        
      case 'sneak': // Rogue sneak attack bonus
        return { sneakDmg: Math.floor(Math.random() * 6) + 1, msg: '+1d6 sneak attack' };
    }
    
    return { msg: 'Unknown spell' };
  }
};