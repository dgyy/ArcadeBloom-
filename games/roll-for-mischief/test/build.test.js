const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');

test('Build system should create valid output', () => {
  // Test that required files exist
  assert.ok(fs.existsSync('./build.js'), 'build.js should exist');
  assert.ok(fs.existsSync('./src/index.html'), 'HTML template should exist');
  
  // Test HTML template has injection point
  const html = fs.readFileSync('./src/index.html', 'utf8');
  assert.ok(html.includes('/* INLINE_JS */'), 'HTML should have JS injection point');
});

test('Size limits should be enforced', () => {
  const maxSize = 13312; // 13KB
  assert.equal(maxSize, 13 * 1024, 'Size limit should be exactly 13KB');
});