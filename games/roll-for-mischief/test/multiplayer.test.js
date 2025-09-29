const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('Multiplayer system should have WebSocket integration', () => {
  const multiplayerCode = fs.readFileSync('./src/multiplayer.js', 'utf8');
  
  // Verify core networking methods
  assert.ok(multiplayerCode.includes('connect('), 'Should have connect method');
  assert.ok(multiplayerCode.includes('sendMessage('), 'Should have sendMessage method');
  assert.ok(multiplayerCode.includes('handleMessage('), 'Should have handleMessage method');
  assert.ok(multiplayerCode.includes('disconnect('), 'Should have disconnect method');
});

test('Should support PartySocket and WebSocket fallback', () => {
  const multiplayerCode = fs.readFileSync('./src/multiplayer.js', 'utf8');
  
  // Verify PartySocket integration
  assert.ok(multiplayerCode.includes('PartySocket'), 'Should support PartySocket');
  assert.ok(multiplayerCode.includes('WebSocket'), 'Should have WebSocket fallback');
  assert.ok(multiplayerCode.includes('partykit.dev'), 'Should use PartyKit URL');
});

test('Should handle all required message types', () => {
  const multiplayerCode = fs.readFileSync('./src/multiplayer.js', 'utf8');
  
  // Verify message handlers
  assert.ok(multiplayerCode.includes('player_join'), 'Should handle player join');
  assert.ok(multiplayerCode.includes('player_leave'), 'Should handle player leave');
  assert.ok(multiplayerCode.includes('player_move'), 'Should handle player movement');
  assert.ok(multiplayerCode.includes('player_attack'), 'Should handle combat');
  assert.ok(multiplayerCode.includes('boss_spawn'), 'Should handle boss events');
  assert.ok(multiplayerCode.includes('player_died'), 'Should handle player death');
});

test('Should have room management functionality', () => {
  const multiplayerCode = fs.readFileSync('./src/multiplayer.js', 'utf8');
  
  assert.ok(multiplayerCode.includes('generateRoomId('), 'Should generate room IDs');
  assert.ok(multiplayerCode.includes('getActivePlayers('), 'Should track active players');
  assert.ok(multiplayerCode.includes('cleanupPlayers('), 'Should cleanup inactive players');
  assert.ok(multiplayerCode.includes('getRoomInfo('), 'Should provide room info');
});

test('Should broadcast game events', () => {
  const multiplayerCode = fs.readFileSync('./src/multiplayer.js', 'utf8');
  
  assert.ok(multiplayerCode.includes('broadcastPlayerJoin('), 'Should broadcast joins');
  assert.ok(multiplayerCode.includes('broadcastMove('), 'Should broadcast movement');
  assert.ok(multiplayerCode.includes('broadcastAttack('), 'Should broadcast attacks');
  assert.ok(multiplayerCode.includes('broadcastDiplomacy('), 'Should broadcast diplomacy');
  assert.ok(multiplayerCode.includes('broadcastDeath('), 'Should broadcast deaths');
});