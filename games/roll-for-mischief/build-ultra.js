const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const { minify } = require('terser');

async function buildUltra() {
  console.log('🐱 Building ULTRA-COMPRESSED JS13k game...');
  
  // Read source files
  const pathfinder = fs.readFileSync('./src/micro-pathfinder.js', 'utf8');
  const engine = fs.readFileSync('./src/engine-3d.js', 'utf8');
  const game = fs.readFileSync('./src/tactical-game.js', 'utf8');
  const sprites = fs.readFileSync('./src/sprites.js', 'utf8');
  
  // Combine files
  let combined = sprites + '\n' + pathfinder + '\n' + engine + '\n' + game;
  
  console.log('📏 Original size:', combined.length, 'bytes');
  
  // Focus on minimal safe optimizations only
  combined = combined
    // Safe UI string shortening
    .replace(/Use W\/S or Arrow Keys to navigate/g, "Use W/S to navigate")
    .replace(/Press ENTER to select/g, "ENTER to select")
    .replace(/Press SPACE to continue/g, "SPACE to continue")
    .replace(/Other players can join with room code/g, "Players join with code")
    .replace(/WASD: Move camera/g, "WASD: Camera")
    .replace(/Mouse: Look around/g, "Mouse: Look")
    .replace(/Arrows: Move cat/g, "Arrows: Move")
    .replace(/I: Isometric view/g, "I: Isometric");
  
  console.log('📏 After string optimization:', combined.length, 'bytes');
  
  // DRY optimization - only safe, specific patterns
  combined = combined
    // Only replace the most common, safest patterns
    .replace(/this\.p\.pos\./g, 'this.p.pos.')  // Keep as-is, too risky to change
    .replace(/document\.getElementById/g, 'document.getElementById')  // Keep as-is
    
    // Safe string literal replacements only
    .replace(/Math\.random\(\)/g, 'Math.random()');
  
  console.log('📏 After DRY optimization:', combined.length, 'bytes');

  // Terser minification with even more aggressive settings
  console.log('🗜️ Running Terser...');
  const terserResult = await minify(combined, {
    compress: {
      ecma: 2020,
      passes: 5,
      unsafe: true,
      unsafe_comps: true,
      unsafe_math: true,
      unsafe_proto: true,
      unsafe_regexp: true,
      unsafe_undefined: true,
      drop_console: true,
      drop_debugger: true,
      pure_funcs: ['console.log', 'console.error', 'console.warn'],
      booleans_as_integers: true,
      keep_fargs: false,
      keep_infinity: false,
      hoist_funs: true,
      hoist_vars: true,
      reduce_vars: true,
      reduce_funcs: true,
      collapse_vars: true,
      inline: 3,
      join_vars: true,
      sequences: true,
      properties: true,
      dead_code: true,
      conditionals: true,
      comparisons: true,
      evaluate: true,
      loops: true,
      unused: true,
      toplevel: true,
    },
    mangle: {
      toplevel: true,
    },
    format: {
      quote_style: 1, // Use single quotes
      ascii_only: true,
      inline_script: true,
      comments: false,
      beautify: false,
    }
  });
  
  if (terserResult.error) {
    console.error('❌ Terser error:', terserResult.error);
    return;
  }
  
  let minified = terserResult.code;
  console.log('📏 After Terser:', minified.length, 'bytes');
  
  // Read and minify HTML
  let html = fs.readFileSync('./src/index.html', 'utf8');
  
  // Ultra-aggressive HTML minification
  html = html
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/> </g, '><') // Remove spaces between tags
    .replace(/\s*([{}:;,])\s*/g, '$1') // Remove spaces around CSS
    .replace(/;\s*}/g, '}') // Remove last semicolon in CSS blocks
    .replace(/"\s*([^"]*?)\s*"/g, '"$1"') // Trim quoted strings
    .replace(/'\s*([^']*?)\s*'/g, "'$1'") // Trim single quoted strings
    .replace(/\s*=\s*/g, '=') // Remove spaces around equals
    .replace(/\s*{\s*/g, '{') // Remove spaces around braces
    .replace(/\s*}\s*/g, '}')
    .replace(/\s*:\s*/g, ':') // Remove spaces around colons
    .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
    .replace(/;\s*([}])/g, '$1') // Remove semicolons before closing braces
    .replace(/\s*,\s*/g, ',') // Remove spaces around commas
    .replace(/\n\s*/g, '') // Remove all line breaks and indentation
    .replace(/\s*<\s*/g, '<') // Remove spaces before opening tags
    .replace(/\s*>\s*/g, '>'); // Remove spaces after closing tags
  
  // Write minified JS to temp file for Roadroller
  fs.writeFileSync('./temp-minified.js', minified);
  
  console.log('🗜️ Running Roadroller CLI...');
  try {
    execSync('roadroller ./temp-minified.js -o ./temp-roadroller.js');
    const roadrollerResult = fs.readFileSync('./temp-roadroller.js', 'utf8');
    console.log('📏 After Roadroller:', roadrollerResult.length, 'bytes');
    
    // Clean up temp files
    fs.unlinkSync('./temp-minified.js');
    fs.unlinkSync('./temp-roadroller.js');
    
    // Use Roadroller output
    minified = roadrollerResult;
  } catch (error) {
    console.warn('⚠️ Roadroller failed, using Terser output:', error.message);
    console.log('📏 Using Terser output only:', minified.length, 'bytes');
    // Clean up temp files if they exist
    try { fs.unlinkSync('./temp-minified.js'); } catch(e) {}
    try { fs.unlinkSync('./temp-roadroller.js'); } catch(e) {}
  }
  
  // Inline JS into HTML - use unique marker
  html = html.replace('/* INLINE_JS_PLACEHOLDER */', minified);
  
  // Write output
  if (fs.existsSync('./dist')) {
    fs.rmSync('./dist', { recursive: true });
  }
  fs.mkdirSync('./dist');
  fs.writeFileSync('./dist/index.html', html);
  
  // Create ZIP
  try {
    execSync('cd dist && zip -9 -r ../cats-13k-ultra.zip .');
    console.log('📦 Created cats-13k-ultra.zip');
    
    const stats = fs.statSync('./cats-13k-ultra.zip');
    const sizeMB = (stats.size / 1024).toFixed(2);
    const percent = ((stats.size / 13312) * 100).toFixed(1);
    
    console.log(`📏 ZIP Size: ${stats.size} bytes (${sizeMB}KB) - ${percent}% of limit`);
    
    if (stats.size > 13312) {
      console.error(`❌ Over limit by ${stats.size - 13312} bytes!`);
      console.log('\n🔍 Suggestions for further reduction:');
      console.log('   - Remove stat block display feature');
      console.log('   - Simplify sprite data encoding');
      console.log('   - Reduce number of event messages');
      console.log('   - Remove some UI polish');
    } else {
      console.log(`✅ SUCCESS! ${13312 - stats.size} bytes remaining`);
    }
  } catch (error) {
    console.error('❌ Failed to create ZIP:', error.message);
  }
}

buildUltra().catch(console.error);