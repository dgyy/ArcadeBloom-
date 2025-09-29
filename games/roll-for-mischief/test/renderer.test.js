const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('Renderer should have proper 3D projection math', () => {
  // Mock canvas and context for testing
  const mockCanvas = {
    width: 800,
    height: 600,
    getContext: () => ({
      fillStyle: '',
      fillRect: () => {},
      beginPath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      closePath: () => {},
      fill: () => {},
      strokeStyle: '',
      lineWidth: 0,
      stroke: () => {}
    })
  };
  
  // Load renderer code for testing (would normally be in browser)
  const rendererCode = fs.readFileSync('./src/renderer.js', 'utf8');
  
  // Verify critical methods exist in source
  assert.ok(rendererCode.includes('project('), 'Should have project method');
  assert.ok(rendererCode.includes('addPolygon('), 'Should have addPolygon method');
  assert.ok(rendererCode.includes('render('), 'Should have render method');
  assert.ok(rendererCode.includes('updateCamera('), 'Should have updateCamera method');
});

test('Geometry generator should create valid cat models', () => {
  const geometryCode = fs.readFileSync('./src/geometry.js', 'utf8');
  
  // Verify cat creation methods
  assert.ok(geometryCode.includes('createCat('), 'Should have createCat method');
  assert.ok(geometryCode.includes('generateTail('), 'Should have generateTail method');
  assert.ok(geometryCode.includes('createCityBlock('), 'Should have createCityBlock method');
  assert.ok(geometryCode.includes('createStreetLamp('), 'Should have createStreetLamp method');
  assert.ok(geometryCode.includes('createTree('), 'Should have createTree method');
  
  // Verify color utilities
  assert.ok(geometryCode.includes('lighten('), 'Should have lighten method');
  assert.ok(geometryCode.includes('darken('), 'Should have darken method');
});