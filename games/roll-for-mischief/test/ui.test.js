const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('UI system should have JRPG dialog functionality', () => {
  const uiCode = fs.readFileSync('./src/ui.js', 'utf8');
  
  // Verify dialog system methods
  assert.ok(uiCode.includes('showDialog('), 'Should have showDialog method');
  assert.ok(uiCode.includes('processNextDialog('), 'Should have processNextDialog method');
  assert.ok(uiCode.includes('typewriterEffect('), 'Should have typewriter effect');
  assert.ok(uiCode.includes('closeDialog('), 'Should have closeDialog method');
});

test('Should support different dialog types and styling', () => {
  const uiCode = fs.readFileSync('./src/ui.js', 'utf8');
  
  assert.ok(uiCode.includes('styleDialogBox('), 'Should style dialog boxes');
  assert.ok(uiCode.includes("type: 'combat'"), 'Should support combat dialogs');
  assert.ok(uiCode.includes("type: 'diplomacy'"), 'Should support diplomacy dialogs');
  assert.ok(uiCode.includes("type: 'boss'"), 'Should support boss dialogs');
  assert.ok(uiCode.includes("type: 'system'"), 'Should support system dialogs');
});

test('Should handle dialog choices and callbacks', () => {
  const uiCode = fs.readFileSync('./src/ui.js', 'utf8');
  
  assert.ok(uiCode.includes('showChoices('), 'Should show dialog choices');
  assert.ok(uiCode.includes('selectChoice('), 'Should handle choice selection');
  assert.ok(uiCode.includes('choices:'), 'Should support choice options');
  assert.ok(uiCode.includes('callback:'), 'Should support callbacks');
});

test('Should have combat-specific UI methods', () => {
  const uiCode = fs.readFileSync('./src/ui.js', 'utf8');
  
  assert.ok(uiCode.includes('showCombatStart('), 'Should show combat start');
  assert.ok(uiCode.includes('showCombatAction('), 'Should show combat actions');
  assert.ok(uiCode.includes('showBossEncounter('), 'Should show boss encounters');
  assert.ok(uiCode.includes('showDiplomacyOptions('), 'Should show diplomacy options');
});

test('Should update player stats and leaderboard', () => {
  const uiCode = fs.readFileSync('./src/ui.js', 'utf8');
  
  assert.ok(uiCode.includes('updatePlayerStats('), 'Should update player stats');
  assert.ok(uiCode.includes('updateLeaderboard('), 'Should update leaderboard');
  assert.ok(uiCode.includes('updateConnectionStatus('), 'Should update connection status');
  assert.ok(uiCode.includes('showSystemMessage('), 'Should show system messages');
});

test('Should have proper event handling', () => {
  const uiCode = fs.readFileSync('./src/ui.js', 'utf8');
  
  assert.ok(uiCode.includes('setupEventListeners('), 'Should setup event listeners');
  assert.ok(uiCode.includes('addEventListener'), 'Should add event listeners');
  assert.ok(uiCode.includes('keydown'), 'Should handle keyboard input');
  assert.ok(uiCode.includes('click'), 'Should handle mouse input');
});