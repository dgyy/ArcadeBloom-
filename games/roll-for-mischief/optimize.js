const fs = require('fs');
const path = require('path');

// Aggressive optimization for 13KB target
class CodeOptimizer {
  constructor() {
    this.minificationRules = [
      // Remove all comments
      [/\/\*[\s\S]*?\*\//g, ''],
      [/\/\/.*$/gm, ''],
      
      // Compress whitespace
      [/\s+/g, ' '],
      [/\s*{\s*/g, '{'],
      [/\s*}\s*/g, '}'],
      [/\s*;\s*/g, ';'],
      [/\s*,\s*/g, ','],
      [/\s*\(\s*/g, '('],
      [/\s*\)\s*/g, ')'],
      [/\s*=\s*/g, '='],
      [/\s*\+\s*/g, '+'],
      [/\s*-\s*/g, '-'],
      [/\s*\*\s*/g, '*'],
      [/\s*\/\s*/g, '/'],
      
      // Remove unnecessary semicolons
      [/;}/g, '}'],
      [/;]/g, '}'],
      
      // Compress common patterns
      [/console\.log\([^)]*\);?/g, ''], // Remove console.log
      [/console\.error\([^)]*\);?/g, ''], // Remove console.error
      [/console\.warn\([^)]*\);?/g, ''], // Remove console.warn
      
      // Compress variable names (common patterns)
      [/function\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g, 'function $1'],
      [/this\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, 'this.$1'],
      
      // Remove debug code
      [/assert\.[^;]*;/g, ''],
      
      // Compress string patterns
      [/addEventListener/g, 'AEL'], // Will need to alias this
      [/removeEventListener/g, 'REL'],
      [/getElementById/g, 'GEI'],
      [/querySelector/g, 'QS'],
      [/classList\.add/g, 'CLA'],
      [/classList\.remove/g, 'CLR'],
      [/Math\.floor/g, 'MF'],
      [/Math\.random/g, 'MR'],
      [/Math\.sqrt/g, 'MS'],
      [/Math\.cos/g, 'MC'],
      [/Math\.sin/g, 'MSI'],
      [/Math\.PI/g, 'MP'],
      
      // Final cleanup
      [/^\s+/gm, ''],
      [/\s+$/gm, ''],
      [/\n+/g, '\n'],
    ];
  }
  
  optimize(code) {
    let optimized = code;
    
    // Apply all minification rules
    for (const [pattern, replacement] of this.minificationRules) {
      optimized = optimized.replace(pattern, replacement);
    }
    
    // Add aliases for compressed functions
    const aliases = `
var AEL=addEventListener,REL=removeEventListener,GEI=getElementById,QS=querySelector,
CLA='add',CLR='remove',MF=Math.floor,MR=Math.random,MS=Math.sqrt,MC=Math.cos,
MSI=Math.sin,MP=Math.PI;
Document.prototype.AEL=Document.prototype.addEventListener;
Document.prototype.GEI=Document.prototype.getElementById;
`.replace(/\s+/g, '');
    
    return aliases + optimized;
  }
  
  // Identify largest code sections for potential removal
  analyzeSize(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const sections = this.extractSections(content);
    
    console.log(`📊 ${path.basename(filePath)} analysis:`);
    sections
      .sort((a, b) => b.size - a.size)
      .slice(0, 5)
      .forEach(section => {
        console.log(`  ${section.name}: ${section.size} bytes`);
      });
  }
  
  extractSections(content) {
    const sections = [];
    
    // Extract classes
    const classMatches = content.matchAll(/class\s+(\w+)[^}]*{([\s\S]*?)^}/gm);
    for (const match of classMatches) {
      sections.push({
        name: `class ${match[1]}`,
        size: match[0].length,
        type: 'class'
      });
    }
    
    // Extract functions
    const funcMatches = content.matchAll(/(?:function\s+(\w+)|(\w+)\s*\([^)]*\)\s*{)([\s\S]*?)^}/gm);
    for (const match of funcMatches) {
      const name = match[1] || match[2] || 'anonymous';
      sections.push({
        name: `function ${name}`,
        size: match[0].length,
        type: 'function'
      });
    }
    
    return sections;
  }
}

// Analyze current files
const optimizer = new CodeOptimizer();
const srcFiles = [
  'src/main.js',
  'src/renderer.js', 
  'src/geometry.js',
  'src/pathfinder.js',
  'src/multiplayer.js',
  'src/combat.js',
  'src/battleRoyale.js',
  'src/ui.js'
];

console.log('📊 Code size analysis:');
let totalSize = 0;
for (const file of srcFiles) {
  if (fs.existsSync(file)) {
    const size = fs.statSync(file).size;
    totalSize += size;
    console.log(`${file}: ${size} bytes`);
    optimizer.analyzeSize(file);
  }
}

console.log(`\n📦 Total uncompressed JS: ${totalSize} bytes`);
console.log(`🎯 Target after compression: ~13KB`);
console.log(`⚠️  Current overage: ${totalSize > 20000 ? 'MAJOR' : 'manageable'}`);

module.exports = CodeOptimizer;