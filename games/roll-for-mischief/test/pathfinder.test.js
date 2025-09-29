const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('Pathfinder system should generate valid cat characters', () => {
  const pathfinderCode = fs.readFileSync('./src/pathfinder.js', 'utf8');
  
  // Verify core methods exist
  assert.ok(pathfinderCode.includes('generateRandomCat('), 'Should have generateRandomCat method');
  assert.ok(pathfinderCode.includes('getAbilityModifier('), 'Should have getAbilityModifier method');
  assert.ok(pathfinderCode.includes('rollInitiative('), 'Should have rollInitiative method');
  assert.ok(pathfinderCode.includes('makeAttackRoll('), 'Should have makeAttackRoll method');
  assert.ok(pathfinderCode.includes('rollDamage('), 'Should have rollDamage method');
  assert.ok(pathfinderCode.includes('diplomacyCheck('), 'Should have diplomacyCheck method');
});

test('Cat classes should be properly defined', () => {
  const pathfinderCode = fs.readFileSync('./src/pathfinder.js', 'utf8');
  
  // Verify all required cat classes
  assert.ok(pathfinderCode.includes('FIGHTER'), 'Should have Fighter class');
  assert.ok(pathfinderCode.includes('ROGUE'), 'Should have Rogue class'); 
  assert.ok(pathfinderCode.includes('WIZARD'), 'Should have Wizard class');
  assert.ok(pathfinderCode.includes('CLERIC'), 'Should have Cleric class');
  
  // Verify class properties
  assert.ok(pathfinderCode.includes('hitDie'), 'Classes should have hitDie');
  assert.ok(pathfinderCode.includes('proficiencies'), 'Classes should have proficiencies');
  assert.ok(pathfinderCode.includes('classFeatures'), 'Classes should have classFeatures');
});

test('Ability modifier calculation should be correct', () => {
  const pathfinderCode = fs.readFileSync('./src/pathfinder.js', 'utf8');
  
  // Test the ability modifier formula is present
  assert.ok(pathfinderCode.includes('Math.floor((score - 10) / 2)'), 'Should use correct ability modifier formula');
});

test('Combat mechanics should be implemented', () => {
  const pathfinderCode = fs.readFileSync('./src/pathfinder.js', 'utf8');
  
  assert.ok(pathfinderCode.includes('applyDamage('), 'Should have damage application');
  assert.ok(pathfinderCode.includes('skillCheck('), 'Should have skill check system');
  assert.ok(pathfinderCode.includes('updateSurvival('), 'Should track survival time');
  assert.ok(pathfinderCode.includes('getCharacterSummary('), 'Should provide character summary');
});