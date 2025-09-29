const fs = require('fs');

// Quick size checker for development
function checkCurrentSize() {
  const files = ['./cats-13k.zip'];
  const maxSize = 13312; // 13KB
  
  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.log(`📦 ${file} not found. Run 'npm run build' first.`);
      continue;
    }
    
    const stats = fs.statSync(file);
    const sizeMB = (stats.size / 1024).toFixed(2);
    const percent = ((stats.size / maxSize) * 100).toFixed(1);
    const remaining = maxSize - stats.size;
    
    console.log(`📏 ${file}: ${stats.size} bytes (${sizeMB}KB)`);
    console.log(`📊 ${percent}% of 13KB limit used`);
    
    if (stats.size > maxSize) {
      console.log(`❌ OVER LIMIT by ${Math.abs(remaining)} bytes!`);
    } else {
      console.log(`✅ ${remaining} bytes remaining`);
    }
  }
}

checkCurrentSize();