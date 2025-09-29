const fs = require('fs');

// Build with new sprite system
function buildSprite() {
  console.log('🐱 Building 2D sprite version...');
  
  // Read components
  const pathfinder = fs.readFileSync('./src/micro-pathfinder.js', 'utf8');
  const renderer = fs.readFileSync('./src/sprite-renderer.js', 'utf8');
  const game = fs.readFileSync('./src/sprite-game.js', 'utf8');
  
  // Combine
  let combined = pathfinder + '\n' + renderer + '\n' + game;
  
  // Basic compression
  combined = combined.replace(/\/\*[\s\S]*?\*\//g, '');
  
  // Read HTML
  let html = fs.readFileSync('./src/index.html', 'utf8');
  html = html.replace('/* INLINE_JS */', combined);
  
  // Write
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true });
  }
  fs.mkdirSync('./dist');
  fs.writeFileSync('./dist/index.html', html);
  
  // Create ZIP
  try {
    const { execSync } = require('child_process');
    execSync('cd dist && zip -9 -r ../cats-13k-sprite.zip .');
    console.log('📦 Created cats-13k-sprite.zip');
    
    const stats = fs.statSync('./cats-13k-sprite.zip');
    const sizeMB = (stats.size / 1024).toFixed(2);
    const percent = ((stats.size / 13312) * 100).toFixed(1);
    
    console.log(`📏 ZIP Size: ${stats.size} bytes (${sizeMB}KB) - ${percent}% of limit`);
    
    if (stats.size > 13312) {
      console.error(`❌ Over limit by ${stats.size - 13312} bytes!`);
    } else {
      console.log(`✅ SUCCESS! ${13312 - stats.size} bytes remaining`);
    }
    
  } catch (error) {
    console.error('❌ Failed to create ZIP:', error.message);
  }
}

buildSprite();