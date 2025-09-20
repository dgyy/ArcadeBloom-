// When Your Neighbors Are MONGOLS!
// My 2023 entry for js13k (https://js13kgames.com/).
// By Cliff Earl, Antix Development, 2023 (https://github.com/Antix-Development).

let

  log = (t) => console.log(t),

  WIDTH = 1920,
  HEIGHT = 1080,

  TEXTURE_ATLAS, // HTML canvas where all SVG images will be rendered. Used as a TextureAtlas (or SpriteSheet) by the webGL renderer.
  FIELD_OF_BATTLE, // HTML canvas where grassy lines and blood splatters will be rendered. Visible in game.
  fieldOfBattleContext, // HTML canvas context where grassy lines and blood splatters will be rendered.

  // Keyboard variables.
  keysEnabled,
  waitingForKey, // 1 if app is waiting for a new control key to be pressed.
  upHeld, // Movement flags
  downHeld,
  controlIndex, // Index of control key to be changed.
  controlLabel, // UI element to change when new control is set.
  CONTROL_UP = 0, // Indexes into array of keyboard controls.
  CONTROL_DOWN = 1,

  // DOM variables.
  W = window,
  D = document,
  BODY = D.body,
  storage = W.localStorage,

  // Math variables.
  M = Math,
  // floor = M.floor,
  min = M.min,
  max = M.max,
  abs = M.abs,
  cos = M.cos,
  sin = M.sin,
  PI2 = M.PI * 2,
  imul = M.imul,

  // Game timing variables.
  DT,
  thisFrame,
  lastFrame,
  // paused,

  animCounter,
  totalGameTime,
  MULTIPLIER,

  lightningStriking,
  lightningTimer,
  lightningCounter,

  // Music player variables.
  musicalNote = 0,
  metronome,

  // Sound effect identifiers (0-3 are musical notes).
  FX_CLICK = 4,
  FX_LEAP = 5,
  FX_DAMAGE = 6,
  FX_BOMB = 7,
  FX_HIHAT = 8,
  FX_DRUM = 9,
  FX_MONGOL_DIE_1 = 10,
  FX_MONGOL_DIE_2 = 11,
  FX_MONGOL_DIE_3 = 12,
  FX_MONGOL_DIE_4 = 13,

  FX_POWERUP = 14,
  FX_AIRSTRIKE = 15,
  FX_RAILGUN = 16,
  FX_WEAPON_POWERUP = 17,
  FX_GAMEOVER = 18,
  FX_POINTS = 19,
  FX_HEALTH = 20,
  FX_LIGHTNING = 21,

  // Actor types
  ACTOR_TYPE_MONGOL_SWORD = 0,
  ACTOR_TYPE_MONGOL_RAM = 1,
  ACTOR_TYPE_MONGOL_SPEAR = 2,
  ACTOR_TYPE_MONGOL_BOMB = 3,
  ACTOR_TYPE_MONGOL_UNNARMED = 4,
  ACTOR_TYPE_SAMURAI = 5,
  ACTOR_TYPE_PARTICLE = 6,
  ACTOR_TYPE_PROJECTILE = 7,
  ACTOR_TYPE_POWERUP = 8,

  cloudX = 0, // Cloud x offset

  // Game modes
  GAME_MODE_MENUS = 1,
  GAME_MODE_GAMEOVER = 2,
  GAME_MODE_PLAYING = 0,

  gameMode = GAME_MODE_MENUS,

  particles,
  renderList,
  playerProjectiles,
  enemyProjectiles,

  mongols, // Array containing mongols. NOTE: Powerups will also get shoe-horned into this array because they need to interact with mongols.

  timeBeforeNextMongolSpawns,
  mongolSpawnDelay,

  playerHealth, // Current health of player.

  playerScore, // Current score.
  gotBestScore, // 1 if the player beat the best score in the currently running game.

  weaponReloadSpeed,
  weaponBulletSpeed,
  playerSpeed,

  railGun,

  playerRefireDelay = 0,

  //#region - gl2.js.
  // A modified version of gl2.js (https://github.com/Antix-Development/gl2), which in its self is a modified version of gl1.js (https://github.com/curtastic/gl1) (basically I made it a bit smaller).
  gl2_gl,
  gl2_canvas,
  gl2_shaderProgram,
  gl2_extension,

  gl2_ready,

  gl2_jsImage,
  gl2_texdestWidth,
  gl2_texdestHeight,

  gl2_rgbas,
  gl2_rotations,
  gl2_positions,

  gl2_maxDraws = 4e4, // Max amount of images on the screen at the same time. You can set this to any number, it's just the array size.
  gl2_draws = 0, // Internal count of images drawn so far this frame.

  // Draw the defined rectangular area of the sprite-sheet to the screen at the given coordinates with the given scale, alpha blend, and rotation.
  // rgba (optional). You can tint the image for example to green by passing 0x00FF007F. rgba alpha goes from 0 to 127 (0x7F) where 127 is not transparent at all. Higher than 127 will brighten the image more than normal.
  // rotation is (optional). In radians. Negative is allowed. Rotated about its center.
  gl2_drawImage = (sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, rgba, rotation) => {
    let
      positions = gl2_positions, // Use a local variable so it's faster to access.

      i = gl2_draws * 6;

    // console.log(rgba);

    gl2_rgbas[i + 4] = rgba || 0xFFFFFF7F; // Store rgba after position/texture. Default to white and fully opaque.
    gl2_rotations[i + 5] = rotation || 0; // Store how rotated we want this image to be.

    // Positions array is 2-byte shorts not 4-byte floats so there's twice as many slots.
    i *= 2;

    // Store where we want to draw the image.
    positions[i] = destX;
    positions[i + 1] = destY;
    positions[i + 2] = destWidth;
    positions[i + 3] = destHeight;

    // Store what portion of our PNG we want to draw.
    positions[i + 4] = sourceX;
    positions[i + 5] = sourceY;
    positions[i + 6] = sourceWidth;
    positions[i + 7] = sourceHeight;

    gl2_draws++;
  },

  // A handy function for when you want to draw rectangles. For example debugging hitboxes, or to darken everything with semi-transparent black overlay. This assumes the top left pixel in your texture is white, so you can stretch/tint it to any size/color rectangle.
  gl2_drawRect = (x, y, width, height, rgba, rotation) => gl2_drawImage(0, 0, 1, 1, x, y, width, height, rgba, rotation),

  // Call this every frame to actually draw everything onto your canvas. Renders all drawImage calls since the last time you called drawEverything.
  gl2_drawEverything = () => {
    gl2_gl.clear(gl2_gl.COLOR_BUFFER_BIT); // Clear the canvas.
    gl2_gl.bufferSubData(gl2_gl.ARRAY_BUFFER, 0, gl2_rgbas.subarray(0, gl2_draws * 6)); // Only send to gl the amount slots in our arrayBuffer that we used this frame.
    gl2_extension.drawElementsInstancedANGLE(gl2_gl.TRIANGLES, 6, gl2_gl.UNSIGNED_BYTE, 0, gl2_draws); // Draw everything. 6 is because 2 triangles make a rectangle.
    gl2_draws = 0; // Go back to index 0 of our arrayBuffer, since we overwrite its slots every frame.
  },

  // Set the gl canvas background color with the given RGBA values.
  gl2_setBackgroundColor = (r, g, b, a) => gl2_gl.clearColor(r, g, b, a),

  gl2_setup = (canvas) => {

    gl2_canvas = canvas;

    gl2_gl = canvas.getContext('webgl', { antialias: 0, preserveDrawingBuffer: 1 }); // Get the canvas/context from html.
    // gl2_gl = canvas.getContext('webgl', { antialias: 0, alpha: 0, preserveDrawingBuffer: 1 }); // Get the canvas/context from html.
    gl2_extension = gl2_gl.getExtension('ANGLE_instanced_arrays'); // This extension allows us to repeat the draw operation 6 times (to make 2 triangles) on the same 12 slots in gl2_positions, so we only have to put the image data into gl2_positions once for each image each time we want to draw an image.

    gl2_setBackgroundColor(0, 0, 0, 0); // Set the gl canvas background color.

    let
      byteOffset = 0,

      // Tell gl where read from our arrayBuffer to set our shader attibute variables each time an image is drawn.
      setupAttribute = (name, dataType, amount) => {
        var attribute = gl2_gl.getAttribLocation(shaderProgram, name);
        gl2_gl.enableVertexAttribArray(attribute);
        gl2_gl.vertexAttribPointer(attribute, amount, dataType, 0, bytesPerImage, byteOffset);
        gl2_extension.vertexAttribDivisorANGLE(attribute, 1);
        if (dataType == gl2_gl.SHORT) amount *= 2;
        if (dataType == gl2_gl.FLOAT) amount *= 4;
        byteOffset += amount;
      },

      // Create a shader object of the the given type with the given code.
      createShader = (type, code) => {
        var shader = gl2_gl.createShader(type);
        gl2_gl.shaderSource(shader, code);
        gl2_gl.compileShader(shader);
        return shader;
      },

      // Bind the given buffer of the given type with the given usage.
      bindBuffer = (bufferType, buffer, usage = gl2_gl.STATIC_DRAW) => {
        gl2_gl.bindBuffer(bufferType, gl2_gl.createBuffer());
        gl2_gl.bufferData(bufferType, buffer, usage);
      },

      // Common strings that are reused in the shader code strings
      ATTRIBUTE = 'attribute',
      VARYING = 'varying',
      UNIFORM = 'uniform',

      // Create shaders
      vertShader = createShader(gl2_gl.VERTEX_SHADER, `${ATTRIBUTE} vec2 a;${ATTRIBUTE} vec2 b;${ATTRIBUTE} vec2 c;${ATTRIBUTE} vec4 d;${ATTRIBUTE} vec4 e;${ATTRIBUTE} float f;${VARYING} highp vec2 g;${VARYING} vec4 h;${UNIFORM} vec2 i;${UNIFORM} vec2 j;void main(void){vec2 k;if(f!=0.0){float l=cos(f);float m=sin(f);vec2 n=c*(a-0.5);k=(b+vec2(l*n.x-m*n.y,m*n.x+l*n.y)+c/2.0)/i;}else{k=(b+c*a)/i;}gl_Position=vec4(k.x-1.0,1.0-k.y,0.0,1.0);g=(d.xy+d.zw*a)/j;if(e.x>127.0){float o=pow(2.0,(e.x-127.0)/16.0)/255.0;h=vec4(e.w*o,e.z*o,e.y*o,1.0);}else h=vec4(e.w/255.0,e.z/255.0,e.y/255.0,e.x/127.0);}`), // Each time we draw an image it will run this 6 times. Once for each point of the 2 triangles we use to make the image's rectangle area. The only thing that changes on each repeated draw for the same image is a, so we can get to each corner of the image's rectangle area.
      fragShader = createShader(gl2_gl.FRAGMENT_SHADER, `${VARYING} highp vec2 g;${VARYING} highp vec4 h;${UNIFORM} sampler2D p;void main(void){gl_FragColor=texture2D(p,g)*h;}`),

      // Create a shader program object and attach the shaders.
      shaderProgram = gl2_gl.createProgram();
    gl2_gl.attachShader(shaderProgram, vertShader);
    gl2_gl.attachShader(shaderProgram, fragShader);
    gl2_gl.linkProgram(shaderProgram);
    gl2_gl.useProgram(shaderProgram);
    gl2_shaderProgram = shaderProgram;

    // Tell gl that when we set the opacity, it should be semi transparent above what was already drawn.
    gl2_gl.blendFunc(gl2_gl.SRC_ALPHA, gl2_gl.ONE_MINUS_SRC_ALPHA);
    gl2_gl.enable(gl2_gl.BLEND);
    gl2_gl.disable(gl2_gl.DEPTH_TEST);

    bindBuffer(gl2_gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 2, 1, 3])); // Map triangle vertexes to our multiplier array, for which corner of the image drawn's rectangle each triangle point is at.

    bindBuffer(gl2_gl.ARRAY_BUFFER, new Float32Array([0, 0, 0, 1, 1, 0, 1, 1])); // Our multiplier array for destWidth/destHeight so we can get to each corner of the image drawn.

    // Size multiplier vec2 variable. This code goes here so that it's linked to the Float32Array above, using those values.
    var attribute = gl2_gl.getAttribLocation(shaderProgram, "a");
    gl2_gl.enableVertexAttribArray(attribute);
    gl2_gl.vertexAttribPointer(attribute, 2, gl2_gl.FLOAT, 0, 0, 0);

    var
      shortsPerImagePosition = 2, // Whenever we call our drawImage(), we put in 2 shorts into our arrayBuffer for position (destX,destY)
      shortsPerImageSize = 2, // Whenever we call our drawImage(), we put in 2 shorts into our arrayBuffer for size (destWidth,destHeight)
      shortsPerImageTexPos = 4, // Whenever we call our drawImage(), we also store 4 shorts into our arrayBuffer (texX,texY,texdestWidth,texdestHeight)
      bytesPerImageRgba = 4, // Whenever we call our drawImage(), we also store 4 bytes into our arrayBuffer (r,g,b,a) for color and alpha.
      floatsPerImageRotation = 1, // Whenever we call our drawImage(), we also put a float for rotation.
      bytesPerImage = shortsPerImagePosition * 2 + shortsPerImageSize * 2 + shortsPerImageTexPos * 2 + bytesPerImageRgba + floatsPerImageRotation * 4, // Total bytes stored into arrayBuffer per image = 24
      arrayBuffer = new ArrayBuffer(gl2_maxDraws * bytesPerImage); // Make a buffer big enough to have all the data for the max images we can show at the same time.
    gl2_positions = new Int16Array(arrayBuffer); // Make 3 views on the same arrayBuffer, because we store 3 data types into this same byte array. When we store image positions/UVs into our arrayBuffer we store them as shorts (int16's)
    gl2_rotations = new Float32Array(arrayBuffer); // When we store image rotation into our arrayBuffer we store it as float, because it's radians.
    gl2_rgbas = new Uint32Array(arrayBuffer); // When we store image rgbas into our arrayBuffer we store it as 1 4-byte int32.

    bindBuffer(gl2_gl.ARRAY_BUFFER, arrayBuffer, gl2_gl.DYNAMIC_DRAW); // Make the gl vertex buffer and link it to our arrayBuffer. Using DYNAMIC_DRAW because these change as images move around the screen.

    setupAttribute("b", gl2_gl.SHORT, shortsPerImagePosition); // Tell gl that each time an image is drawn, have it read 2 array slots from our arrayBuffer as short, and store them in the vec2 I made "b"
    setupAttribute("c", gl2_gl.SHORT, shortsPerImageSize); // Then read the next 2 array slots and store them in my vec2 "c"
    setupAttribute("d", gl2_gl.SHORT, shortsPerImageTexPos); // Then read the next 4 array slots and store them in my vec4 "d"
    setupAttribute("e", gl2_gl.UNSIGNED_BYTE, bytesPerImageRgba); // Then read the next 4 bytes and store them in my vec4 "e"
    setupAttribute("f", gl2_gl.FLOAT, floatsPerImageRotation); // Then read the next 4 bytes as 1 float and store it in my float "f"
  },

  // Set the parameter with the given name.
  gl2_setTexParameter = (name) => gl2_gl.texParameteri(gl2_gl.TEXTURE_2D, name, gl2_gl.NEAREST),

  // Load texture from the given canvas
  gl2_loadTexture = (texture) => {
    // Create a gl texture from image file.
    gl2_gl.bindTexture(gl2_gl.TEXTURE_2D, gl2_gl.createTexture());

    gl2_gl.texImage2D(gl2_gl.TEXTURE_2D, 0, gl2_gl.RGBA, gl2_gl.RGBA, gl2_gl.UNSIGNED_BYTE, texture);

    gl2_gl.generateMipmap(gl2_gl.TEXTURE_2D);
    gl2_gl.activeTexture(gl2_gl.TEXTURE0);

    // Tell gl that when draw images scaled up, keep it pixellated and don't smooth it.
    gl2_setTexParameter(gl2_gl.TEXTURE_MAG_FILTER);
    gl2_setTexParameter(gl2_gl.TEXTURE_MIN_FILTER);

    // Store texture size in vertex shader.
    gl2_texdestWidth = texture.width;
    gl2_texdestHeight = texture.height;
    gl2_gl.uniform2f(gl2_gl.getUniformLocation(gl2_shaderProgram, "j"), gl2_texdestWidth, gl2_texdestHeight);

    gl2_gl.viewport(0, 0, gl2_canvas.width, gl2_canvas.height); // Resize the gl viewport to be the new size of the canvas.
    gl2_gl.uniform2f(gl2_gl.getUniformLocation(gl2_shaderProgram, "i"), gl2_canvas.width / 2, gl2_canvas.height / 2); // Update the shader variables for canvas size. Sending it to gl now so we don't have to do the math in JavaScript on every draw, since gl wants to draw at a position from 0 to 1, and we want to do drawImage with a screen pixel position.

    gl2_ready = 1;
  },

  //#endregion

  // #region - Sound Effects.


  /*
Sound Effects v2.0.0.

A basic sound effect player that plays sounds created using ZzFX.

By Cliff Earl, Antix Development, 2022.

Usage:
------
To add a new sound effect, call fx_add(parameters) like so...
fx_add(1.01,.05,259,0,.1,.2,2,1.58,0,0,0,0,0,0,1.1,0,0,.7,.07,0);

To play a sound effect call fx_play(index)

If you were pondering  how parameters for new sound  effects are created, use
ZzFX  (https://github.com/KilledByAPixel/ZzFX).  NOTE:  Untick  the  "spread"
checkbox!

IMPORTANT!! THIS VERSION OF  THE CODE HAS  THE RANDOMNESS REMOVED SO YOU WILL 
HAVE TO MODIFY ANY SAMPLE DATA THAT YOU COPY FROM ZZFX BY REMOVING THE SECOND
NUMBER FROM  THE ARRAY (0.5  IN THE ABOVE  EXAMPLE STRING), WHICH  REPRESENTS 
RANDOMNESS.
  
There is also a global volume variable that you can poke... globalVolume

History:
--------
v1.0.1 (18/8/2022)
- Removed sound randomness.

v1.0.2 (6/9/2022)
- Added code to resolve strange repeating sound issue.

v2.0.0 (12/9/2023)
- Major rewrite.
- Sampling rate increased from 44100 to 48000.
- fx_bs() functionality is now part of fx_add().
- parameters are now passed directly to fx_add(), instead of being passed as an array.
- Playing sound effects will now be stopped before plaing them again. This resolves the cacophony caused by playing the same sound effect in quick succession.
- General code refactoring.

Acknowledgements:
-----------------
This code is a modified version of zzfx.js, part of ZzFX.

ZzFX - Zuper Zmall Zound Zynth v1.1.6
By Frank Force 2019
https://github.com/KilledByAPixel/ZzFX

ZzFX MIT License

Copyright (c) 2019 - Frank Force

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

globalVolume = .5, // Global volume.
sampleRate = 48e3, // Sample rate.
audioContext = 0, // Audio context.
effects = [], // List of all sound effects (stored and accessed by index).

// Create and add samples to the list of all playable effects, using the given zzfx parameters (minus the random parameter).
fx_add = (volume, frequency, attack, sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo) => {

  // init parameters
  let 
  sign = v => v > 0 ? 1 : -1, 
  startSlide = slide *= 500 * PI2 / sampleRate / sampleRate, 
  startFrequency = frequency *= PI2 / sampleRate, 
  samples = [], 
  t = 0, 
  tm = 0, 
  i = 0, 
  j = 1, 
  r = 0, 
  c = 0, 
  s = 0, 
  f, 
  length;

  // scale by sample rate
  attack *= sampleRate + 9; // minimum attack to prevent pop
  decay *= sampleRate;
  sustain *= sampleRate;
  release *= sampleRate;
  delay *= sampleRate;
  deltaSlide *= 500 * PI2 / sampleRate ** 3;
  modulation *= PI2 / sampleRate;
  pitchJump *= PI2 / sampleRate;
  pitchJumpTime *= sampleRate;
  repeatTime = repeatTime * sampleRate | 0;

  // generate waveform
  for (length = attack + decay + sustain + release + delay | 0; i < length; samples[i++] = s) {
    if (!(++c % (bitCrush * 100 | 0))) { // bit crush
      s = shape ? shape > 1 ? shape > 2 ? shape > 3 ? sin((t % PI2) ** 3) : M.max(min(M.tan(t), 1), -1) : 1 - (2 * t / PI2 % 2 + 2) % 2 : 1 - 4 * abs(M.round(t / PI2) - t / PI2) : sin(t);
      s = (repeatTime ? 1 - tremolo + tremolo * sin(PI2 * i / repeatTime) : 1) * sign(s) * (abs(s) ** shapeCurve) * volume * globalVolume * (i < attack ? i / attack : i < attack + decay ? 1 - ((i - attack) / decay) * (1 - sustainVolume) : i < attack + decay + sustain ? sustainVolume : i < length - delay ? (length - i - delay) / release * sustainVolume : 0);
      s = delay ? s / 2 + (delay > i ? 0 : (i < length - delay ? 1 : (length - i) / delay) * samples[i - delay | 0] / 2) : s;
    }

    f = (frequency += slide += deltaSlide) * cos(modulation * tm++); // Frequency
    t += f - f * noise * (1 - (sin(i) + 1) * 1e9 % 2); // Noise

    if (j && ++j > pitchJumpTime) { // Pitch jump
      frequency += pitchJump; // Apply pitch jump
      startFrequency += pitchJump; // Also apply to start
      j = 0; // Stop pitch jump time
    }

    if (repeatTime && !(++r % repeatTime)) { // Repeat
      frequency = startFrequency; // Reset frequency
      slide = startSlide; // Reset slide
      j = j || 1; // Reset pitch jump time
    }
  }

  effects.push({
    samples: samples,
    buffer: 0
  });

},

// Play the fx with the given index, so long as audio is enabled.
fx_play = id => {
  if (OPTIONS.audio) {
    if (!audioContext) fx_newAudioContext(); // Create audio context if it does not exist.

    let soundEffect = effects[id];
  
    if (soundEffect.buffer) soundEffect.buffer.disconnect(audioContext.destination);
  
    let audioBuffer = audioContext.createBuffer(1, soundEffect.samples.length, sampleRate), // NOTE: `createBuffer` is a method of `BaseAudioContext`, the parent class of `AudioContext`
    audioBufferSourceNode = audioContext.createBufferSource();
    audioBuffer.getChannelData(0).set(soundEffect.samples);
    audioBufferSourceNode.buffer = audioBuffer;
    audioBufferSourceNode.connect(audioContext.destination);
    audioBufferSourceNode.start(0);

    soundEffect.buffer = audioBufferSourceNode;
  };
},

// Create the `AudioContext`.
fx_newAudioContext = () => audioContext = new (W.AudioContext || W.webkitAudioContext),

// Close the `AudioContext` and create a new one. This resolves a strange issue where sometimes a little droning sound plays and keeps playing, all the time gaining volume, until it is really annoying.
fx_reset = () => {
  audioContext.close();
  fx_newAudioContext();
},


  // #endregion

  // Constrain the given value to the given range.
  clamp = (v, min, max) => (v < min ? min : v > max ? max : v),

  // Get the HTML element with the given id.
  getByID = (id) => D.getElementById(id),

  // Remove the element from the given array at the given index.
  removeAtIndex = (arr, i) => arr.splice(i, 1),

  // Show (or hide) the given element according to the given state.
  showElement = (el, state) => el.style.display = (state) ? 'block' : 'none',

  // Update the background gradient, changing the y coordinate where the gradient changes from sky to ground.
  updateBackgroundGradient = (y) => BACKGROUND.style.background = `linear-gradient(#1af 0%, #fff ${y}px, #6e5 ${y}px, #5c6 100%)`,

  // Clear background of blood stains and draw faux grassy lines if required.
  resetFieldOfBattle = (drawGrass = 0) => {
    fieldOfBattleContext.clearRect(0, 0, WIDTH, HEIGHT); // Clear the field of all previous blood stains.
    if (drawGrass) for (let i = 256; i < HEIGHT; i += 4) fieldOfBattleContext.fillRect(randomInt(0, WIDTH), i, randomInt(8, 48), 2); // Create grassy lines.
  },

  // Create a new HTML canvas element with the given id and dimensions.
  newCanvas = (id, w, h) => injectHTML(BODY, `<canvas id=${id} width=${w} height=${h}></canvas>`),

  // Set the given HTML elements innerHTML to the given HTML
  setHTML = (el, html) => el.innerHTML = html,

  // Inject the given HTML into the given HTML element.
  injectHTML = (el, html) => el.innerHTML += html,

  // Inject a heading style directly into the documents style.
  injectHEadingStyle = (headingSize, fontSize, lineHeight) => injectHTML(D9, `h${headingSize}{font-size:${fontSize}px;line-height:${lineHeight}px;}`),

  // Set the health bar height readout to the given height.
  updateHealthBar = () => HEALTH.style.height = playerHealth + 'px',

  // Set the given HTML elements `onclick` handler to play the button click sound then call the given function.
  setClickHandler = (el, handler) => {
    el.onclick = e => {
      fx_play(FX_CLICK);
      handler();
    };
  },

  // Vertically scroll the `MENUS` div to the given y coordinate.
  scrollToMenu = (y) => MENUS.style.top = y + 'px',

  // TODO: Fabricate a comment for this janky ass code.
  getRangeValue = (actor, range = .25, value = 3) => ((animCounter + actor.randomness) % range > range / 2 ? 0 : value),

  // Return 1 if the given array is not empty.
  isNotEmpty = (arr) => (arr.length),

  // #region - Persistent storage management.

  NAMESPACE = 'wynam', // Persistent data filename.
  OPTIONS, // Persistent data buffer.

  // Load the item with the given name from local storage
  loadOptions = () => storage.getItem(NAMESPACE),

  // Save options to local storage
  saveOptions = () => storage.setItem(NAMESPACE, JSON.stringify(OPTIONS)),

  // Reset the options to default and save them to local storage
  resetOptions = () => {
    OPTIONS = {
      best: 0,
      audio: 1, // Audio enabled
      controls: [ // Controls
        { // Up
          key: 81, // Keycode
          code: 'KeyQ' // Ascii representation
        },
        { // Down
          key: 65,
          code: 'KeyA'
        },
        // { // Cycle weapons
        //   key: 32,
        //   code: 'Space'
        // },
      ]
    };

    saveOptions(); // Save options to local storage
  },
  // #endregion

  // #region -- Pseudo Random Number Generator

  // A deterministic random number generator (Mulberry32)
  rng = {
    seed: 0,

    // Set the random seed
    setSeed: (n) => rng.seed = n,

    // Get the random seed
    getSeed: () => (rng.seed),

    // Get a new random number (0-1)
    random: () => {
      rng.seed += 0x6D2B79F5;
      let t = rng.seed;
      t = imul(t ^ t >>> 15, t | 1);
      t ^= t + imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  },

  // Get a random float between 0 and 1
  random = () => (rng.random()),

  // Get a random number in the given range
  randomInt = (min, max) => (~~((random() * (max - min)) + min)), //The maximum is inclusive and the minimum is inclusive.
  // #endregion

  // Initiate mode where the user has chosen to change a control key.
  initiateWaitingForKeyPress = (index, label) => {
    controlIndex = index;
    controlLabel = label;
    KEYPRESS.style.zIndex = 9;
    waitingForKey = 1;
  },

  // Set the audio label according to the setting in `OPTIONS`.
  updateAudioLabel = () => setHTML(TOGGLE_AUDIO_LABEL, (OPTIONS.audio) ? 'ON' : 'OFF'),

  // Award the given number of points to the player and handle cases where best score was reached in this game.
  awardPoints = (n) => {
    playerScore += n;
    setHTML(SCORE_LABEL, playerScore.toLocaleString());
    if (!gotBestScore) {
      if (playerScore > OPTIONS.best) {
        gotBestScore = 1;

        for (let j = 0; j < 7; j++) {
          newParticle(
            2, // ttl
            (960 - 128) + randomInt(0, 256), // x
            40 + randomInt(0, 40), // y
            random() * PI2, // rotation
            MUZZLE_PARTICLE_NAME + randomInt(0, 2),// texture
            300 + random() * 100, // speed
            1, // fades
            2, // alpha
            0, // shrinks
            1 + random(), // scale
            (random() < .5) ? -PI2 * .05 : PI2 * .05, // rotationRate
            -10 + random() * 20, // gravityX
            -10 + random() * 20 // gravityY
          );
        }
      }
    }
  },

  // Create a new actor object with the given attributes.
  newActor = (type, x, y, vx, vy, radius, leaping, leaving, collides, actionDelay, randomness, timed, damage, texture, ttl, rotation, iX, iY, scale, alpha, rotationRate, gx, gy, fades, shrinks) => ({
    // Player, Mongol, Projectile, Particle.
    type,
    x,
    y,
    vx,
    vy,

    // Mongol.
    radius,
    leaping,
    leaving,
    collides,
    actionDelay,
    randomness,

    // Projectile.
    timed,
    damage,
    texture,
    ttl,

    // Projectile, Particle.
    rotation,
    iX,
    iY,
    scale,
    alpha,

    // Particle

    rotationRate,
    gx,
    gy,
    fades,
    shrinks,
    counter: ttl,
    originalAlpha: alpha,
    originalScale: scale
  }),

  // Spawn a particle using the given parameters.
  newParticle = (ttl, x, y, rotation, texture, speed, fades, alpha, shrinks, scale, rotationRate, gx = 0, gy = 0) => {

    particles.push(newActor(
      ACTOR_TYPE_PARTICLE, // type
      x, // x
      y, // y
      cos(rotation) * speed, // vx
      sin(rotation) * speed, // vy
      0, // radius
      0, // leaping
      0, // leaving
      0, // collides
      0, // actionDelay
      0, // randomness
      0, // timed
      0, // damage
      getTextureRegion(texture), // texture
      ttl, // ttl
      rotation, // rotation
      0, // iX
      0, // iY
      scale, // scale
      alpha, // alpha
      rotationRate, // rotationRate
      gx, // gx
      gy, // gy
      fades,  // fades
      shrinks // shrinks
    ));
  },

  // Update the given actors position.
  moveActor = (actor) => {
    actor.x += actor.vx * DT; // Update position.
    actor.y += actor.vy * DT;
  },

  // Spawn the given number of shrapnel projectiles, moving in random directions, and expiring after the given time in seconds.
  spawnShrapnel = (actor, count, ttl) => {
    let r = PI2 * random();

    // Spawn the actual projectiles
    for (let i = 0; i < count; i++) {
      playerProjectiles.push(newActor(
        ACTOR_TYPE_PROJECTILE, // type
        actor.x, // x
        actor.y - 60, // y
        cos(r) * 650, // vx
        sin(r) * 650, // vy
        0, // radius
        0, // leaping
        0, // leaving
        0, // collides
        0, // actionDelay
        0, // randomness
        1, // timed
        0, // damage
        getTextureRegion('shrapnel2'), // texture
        ttl, // ttl
        0, // rotation
        0, // iX
        0, // iY
        1, // scale
        1, // alpha
      ));
      r += PI2 / count;
    }

    // Spawn a bomb flash particle.
    newParticle(
      .4, // ttl
      actor.x - 66, // x
      actor.y - 120, // y
      random() * PI2,  // rotation
      MUZZLE_PARTICLE_NAME + randomInt(0, 2), // texture
      0, // speed
      1, // fades
      1, // alpha
      0, // shrinks
      2 + random(), // scale
      0, // rotationRate
      0, // gravityX
      0 // gravityY
    );

    // Spawn some smoke particles
    for (let k = 0; k < 5; k++) {
      newParticle(
        .75, // ttl
        actor.x - 80 + (randomInt(0, 80)), // x
        actor.y - 160 + (randomInt(0, 80)), // y
        PI2 * -.375 + (random() * (PI2 * .25)),  // rotation
        SMOKE_NAME + randomInt(0, 2), // texture
        20 + randomInt(0, 20), // speed
        1, // fades
        random() * .25, // alpha
        0, // shrinks
        2 + random() * .5, // scale
        PI2 * .005 * (random()), // rotationRate
        0, // gravityX
        0 // gravityY
      );
    }
  },

  // Spawn a shower of blood particle effect at the given actors position, with the given number of blood splatters.
  spawnBloodShower = (actor, n) => {
    // Spawn a shower of blood
    for (let k = 0; k < n; k++) {
      newParticle(
        1, // ttl
        actor.x - 30, // x
        actor.y - 40, // y
        PI2 * -.375 + (random() * (PI2 * .25)),  // rotation
        BLOOD_NAME + randomInt(0, 9), // texture
        500 + randomInt(50, 250), // speed
        1, // fades
        1, // alpha
        1, // shrinks
        .5 + random() * .5, // scale
        0, // rotationRate
        0, // gravityX
        15 + randomInt(10, 20) // gravityY
      );
    }
  },

  // Damage the player by removing the given amount of health, and 
  damagePlayer = (v) => {

    fx_play(FX_DAMAGE);

    spawnBloodShower(player, 7 + randomInt(0, 5));

    if ((playerHealth -= v) <= 0) {

      playerHealth = 0;

      fx_play(FX_GAMEOVER);
      showElement(GAMEOVER, 1);
      gameMode = GAME_MODE_GAMEOVER;
      keysEnabled = 0;
      if (gotBestScore) {
        OPTIONS.best = playerScore;
        setHTML(BEST_SCORE_LABEL, OPTIONS.best.toLocaleString());
        saveOptions();
      }
    }
  },

  // Create the player.
  player = newActor(
    ACTOR_TYPE_SAMURAI, // type
    WIDTH - 200, // x
    0, // y
    0, // vx
    0 // vy
  ),

  // Powerup timers.
  increaseWeaponReloadTimer,
  increaseProjectileSpeedTimer,
  regenerateHealthTimer,
  airstrikeTimer,
  railgunTimer,
  awardBonusPointsTimer,
  increaseWalkSpeedPointsTimer,
  lightningstrikeTimer,

  // Powerup types.
  POWERUP_HEALTH = 0,
  POWERUP_AIRSTRIKE = 1,
  POWERUP_POINTS = 2,
  POWERUP_WEAPON_RELOAD_SPEED = 3,
  POWERUP_WEAPON_SPEED = 4,
  POWERUP_RAILGUN = 5,
  POWERUP_WALKSPEED = 6,
  POWERUP_LIGHTNINGSTRIKE = 7,

  powerups = [
    { // POWERUP_HEALTH
      c1: `d00`,
      c2: '800',
      t: 'H', // Additional health.
      p: () => {
        fx_play(FX_HEALTH);
        playerHealth = clamp(playerHealth + 100, 0, 1048);
      }
    },

    { // POWERUP_AIRSTRIKE
      c1: `9b0`,
      c2: '560',
      t: 'B', // Airstrike.
      p: () => {

        fx_play(FX_AIRSTRIKE);

        for (let i = 0; i < 7; i++) {

          let y = -HEIGHT + randomInt(0, 999);
          playerProjectiles.push(newActor(
            ACTOR_TYPE_PROJECTILE, // type
            50 + randomInt(0, 1500), // x
            y, // y
            0, // vx
            700 + randomInt(0, 300), // vy
            0, // radius
            1, // leaping // isBomb
            y + HEIGHT * 1.25, // leaving // targetY
            0, // collides
            0, // actionDelay
            0, // randomness
            0, // timed
            0, // damage
            getTextureRegion(BOMB_PROJECTILE_NAME), // texture
            0, // ttl
            0, // rotation
            0, // iX
            0, // iY
            1, // scale
            1, // alpha
          ));
        }

      },
    },
    
    { // POWERUP_POINTS
      c1: `59f`,
      c2: '04a',
      t: 'Y', // Additional points.
      p: (actor) => {
        fx_play(FX_POINTS);

        awardPoints(5000);

        newParticle(
          1, // ttl
          actor.x - 30, // x
          actor.y - 40, // y
          0,  // rotation
          'points', // texture
          0, // speed
          1, // fades
          1, // alpha
          0, // shrinks
          1, // scale
          0, // rotationRate
          0, // gravityX
          -150 // gravityY
        );


      },
    },

    { // POWERUP_WEAPON_RELOAD_SPEED
      c1: `e50`,
      c2: '940',
      t: 'R', // Additional firing speed.
      p: () => {
        fx_play(FX_POWERUP);
        weaponReloadSpeed = clamp(weaponReloadSpeed - .1, .1, 9);
      }
    },

    { // POWERUP_WEAPON_SPEED
      c1: `3ca`,
      c2: '276',
      t: 'P',
      p: () => {
        fx_play(FX_WEAPON_POWERUP);
        weaponBulletSpeed = clamp(weaponBulletSpeed - 50, -1200, -400);
      }
    },

    { // POWERUP_RAILGUN
      c1: `c4e`,
      c2: '80b',
      t: 'G',
      p: () => {
        fx_play(FX_RAILGUN);

        railGun = 1;

        for (let i = 0; i < 4; i++) {

          newParticle(
            1, // ttl
            -275 + randomInt(0, 24),//randomInt(100, WIDTH - 400), // x
            (player.y - 75) + randomInt(0, 30),//randomInt(300, HEIGHT - 200), // y
            0, // rotation
            'rail' + randomInt(0, 3),
            0, // speed
            1, // fades
            .6, // alpha
            0, // shrinks
            2, // scale
            0, // rotationRate
            0, // gravityX
            0 // gravityY
          );
        }

  
      },
    },

    { // POWERUP_WALKSPEED
      c1: `aaa`,
      c2: '777',
      t: 'S',
      p: () => {
        fx_play(FX_POWERUP);
        playerSpeed = clamp(playerSpeed + 25, 0, 350);
      },
    },

    { // POWERUP_LIGHTNINGSTRIKE
      c1: `f59`,
      c2: 'd05',
      t: 'Z',
      p: () => {
        lightningStriking = 1;
        lightningCounter = 6;
        lightningTimer = .2;
      },
    },
  ],

  // Spawn powerups when required.
  spawnPowerups = () => {

    // Spawn a new powerup
    spawnPowerup = (powerup) => {

      // Spawn at a random position.
      let 
      x = randomInt(100, WIDTH - 400),
      y = randomInt(300, HEIGHT - 200);

      // Spawn the powerup.
      mongols.push(newActor(
        ACTOR_TYPE_POWERUP, // type
        x,
        y,
        0,
        0,
        50, // Used
        powerup.p, // Callback function.
        0,
        1,
        0,
        random(),
        POWERUP_NAME + powerup.t,
        0,
        getTextureRegion(POWERUP_NAME + powerup.t),
        4 + random(),
        0,
        0,
      ));

      // Spawn some bad effects.
      newParticle(
        .1, // ttl
        x - 1,//randomInt(100, WIDTH - 400), // x
        y - 1,//randomInt(300, HEIGHT - 200), // y
        0, // rotation
        'powerup_flash',
        0, // speed
        1, // fades
        1, // alpha
        0, // shrinks
        1, // scale
        0, // rotationRate
        0, // gravityX
        0 // gravityY
      );
    }

    if ((increaseWalkSpeedPointsTimer -= DT) < 0) {
      increaseWalkSpeedPointsTimer += 2 + random();
      spawnPowerup(powerups[POWERUP_WALKSPEED]);
    }

    if ((awardBonusPointsTimer -= DT) < 0) {
      awardBonusPointsTimer += 4 + random();
      spawnPowerup(powerups[POWERUP_POINTS]);
    }

    if ((railgunTimer -= DT) < 0) {
      railgunTimer += 5 + random();
      spawnPowerup(powerups[POWERUP_RAILGUN]);
    }

    if ((airstrikeTimer -= DT) < 0) {
      airstrikeTimer += 7 + random();
      spawnPowerup(powerups[POWERUP_AIRSTRIKE]);
    }

    if ((lightningstrikeTimer -= DT) < 0) {
      lightningstrikeTimer += 12 + random();
      spawnPowerup(powerups[POWERUP_LIGHTNINGSTRIKE]);
    }

    if ((regenerateHealthTimer -= DT) < 0) {
      regenerateHealthTimer += 9 + random();
      spawnPowerup(powerups[POWERUP_HEALTH]);
    }

    if ((increaseWeaponReloadTimer -= DT) < 0) {
      increaseWeaponReloadTimer += 1 + (random() * MULTIPLIER);
      spawnPowerup(powerups[POWERUP_WEAPON_RELOAD_SPEED]);
    }

    if ((increaseProjectileSpeedTimer -= DT) < 0) {
      increaseProjectileSpeedTimer += 1 + (random() * MULTIPLIER);
      spawnPowerup(powerups[POWERUP_WEAPON_SPEED]);
    }
  },

  // #region - Asset generation.
  textureRegions = [], // Array of texture regions.
  allAssetsGenerated, // When 1, `gl2_loadTexture()` is called from `newTextureRegion()`.

  overlayImages,

  svgString, // String used to generate SVG images, before they are mime encoded and rendered to the TEXTURE_ATLAS canvas.
  tempString,

  SVG_ID = 0, // Used to generate unique filter identities.

  // Reusable SVG strings.
  SVG_FEFLOOD = 'feFlood',
  SVG_FILTER = 'filter',
  SVG_FEGAUSSIANBLUR = 'feGaussianBlur',
  SVG_FECOLORMATRIX = 'feColorMatrix',
  SVG_FETURBULENCE = 'feTurbulence',
  SVG_FEDISPLACEMENTMAP = 'feDisplacementMap',
  SVG_FECOMPOSITE = 'feComposite',
  SVG_OPERATOR = ' operator="',
  SVG_FESPECULARLIGHTING = 'feSpecularLighting',
  SVG_FEPOINTLIGHT = 'fePointLight',
  SVG_RESULT = '" result="',
  SVG_STDDEVIATION = 'stdDeviation',
  SVG_EMPTY_MATRIX = '0 0 0 0 0, ',
  SVG_TRANSPARENT_COLOR = '0000',

  // Functions that return strings representing SVG elements (or attributes) with the given parameters.

  // SVG_FILTER_OR_FILL = (fill) => ((fill.match(/[0-9a-f]/g)) ? `fill="#${fill}"` : `filter="url(#${fill})"`), // Applies a fill if the chars in `fill` are hex ascii chars (0-9, a-f), otherwise applies a filter for all other chars (g-z). NOTE: Generated fills start with 'Z' then are followed by a number (which makes them unique).
  SVG_FILTER_OR_FILL = (fill) => ((fill.match(/[G-Z]/g)) ? `filter="url(#${fill})"` : `fill="#${fill}"`), // Applies a fill if the chars in `fill` are hex ascii chars (0-9, a-f), otherwise applies a filter for all other chars (g-z). NOTE: Generated fills start with 'Z' then are followed by a number (which makes them unique).
  SVG_HEAD = (w, h) => `<svg width="${w}" height="${h}" version="1.1" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`,
  SVG_RECT = (x, y, w, h, fill, rx = 0, ry = rx, strokeWidth = 0, stroke = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" ${(SVG_FILTER_OR_FILL(fill))} rx="${rx}" ry="${ry}" stroke-width="${strokeWidth}" stroke="#${stroke}"/>`,
  SVG_RECT_ROTATED = (x, y, w, h, fill, rx, a) => `<rect transform="rotate(${a})" x="${x}" y="${y}" width="${w}" height="${h}" fill="#${fill}" rx="${rx}"/>`,
  SVG_PATH = (path, fill, strokeWidth = 0, stroke = SVG_TRANSPARENT_COLOR) => `<path d="${path}" fill="#${fill}" stroke-width="${strokeWidth}" stroke="#${stroke}"/>`,
  SVG_USE = (href, x, y) => `<use href="#${href}" x="${x}" y="${y}"/>`, // Reuse (stamp) the referenced SVG object at the given coordinates.
  SVG_TEXT = (x, y, text, color, size) => `<text x="${x}" y="${y}" fill="#${color}" font-family="Arial" font-size="${size}px" font-weight="900">${text}</text>`,

  // Generate a mongol hand (used by most mongol weapons).
  MONGOL_HAND = (x, y) => (`${SVG_RECT(x, y, 11, 18, MONGOL_SKIN_DARK_COLOR)} ${SVG_RECT(x + 10, y, 14, 18, MONGOL_SKIN_LIGHT_COLOR)}`), // <rect x="nnn" y="nnn" width="11" height="18" fill="#dd765b"/><rect x="nnn" y="nnn" width="14" height="18" fill="#f9b087"/>

  // Create a new texture region with the given attributes and draw the SVG image to the texture atlas canvas at the given coordinates and scaled to the given scale.
  newTextureRegion = (name, x, y, scale = 1) => {
    let image = new Image();
    image.onload = () => { // When the image has loaded...
      let 
      w = image.width,
      h = image.height;
      TEXTURE_ATLAS.getContext('2d').drawImage(image, x, y, w * scale, h * scale); // draw image to the textureAtlas.
      textureRegions[name] = { x, y, w: w * scale, h: h * scale }; // Create new texture region.

      if (allAssetsGenerated) {

        // 
        // Do stuff once ALL assets have been generated
        // 

        gl2_loadTexture(TEXTURE_ATLAS); // Initialize webGL texture.

        // These objects correspond to a given actors `type`. They are only applicable to mongols and the samurai, not projectiles, particles, etc.
        overlayImages = [
          {
            body: getTextureRegion(MONGOL_BODY_NAME), // TextureRegion
            bodyX: -44, // Drawing offsets
            bodyY: -100,
            weapon: getTextureRegion(MONGOL_SWORD_NAME),
            weaponX: -50,
            weaponX2: 0,
            weaponY: -100,
            foot: getTextureRegion(MONGOL_FOOT_NAME),
            leftFootX: -45,
            leftFootY: 0,
            rightFootX: 1,
            rightFootY: 3,
          },

          {
            body: getTextureRegion(MONGOL_BODY_NAME),
            bodyX: -44,
            bodyY: -100,
            weapon: getTextureRegion(MONGOL_RAM_NAME),
            weaponX: -50,
            weaponX2: 5,
            weaponY: -50,
            foot: getTextureRegion(MONGOL_FOOT_NAME),
            leftFootX: -45,
            leftFootY: 0,
            rightFootX: 1,
            rightFootY: 3,
          },

          {
            body: getTextureRegion(MONGOL_BODY_NAME),
            bodyX: -44,
            bodyY: -100,
            weapon: getTextureRegion(MONGOL_SPEAR_NAME),
            weaponX: -110,
            weaponX2: 0,
            weaponY: -75,
            foot: getTextureRegion(MONGOL_FOOT_NAME),
            leftFootX: -45,
            leftFootY: 0,
            rightFootX: 1,
            rightFootY: 3,
          },

          {
            body: getTextureRegion(MONGOL_BODY_NAME),
            bodyX: -44,
            weaponX2: 0,
            bodyY: -100,
            weapon: getTextureRegion(MONGOL_BOMB_NAME),
            weaponX: -65,
            weaponY: -70,
            foot: getTextureRegion(MONGOL_FOOT_NAME),
            leftFootX: -45,
            leftFootY: 0,
            rightFootX: 1,
            rightFootY: 3,
          },

          {
            body: getTextureRegion(MONGOL_BODY_NAME),
            bodyX: -44,
            weaponX2: 0,
            bodyY: -100,
            weapon: getTextureRegion(MONGOL_UNNARMED_NAME),
            weaponX: -45,
            weaponY: -30,
            foot: getTextureRegion(MONGOL_FOOT_NAME),
            leftFootX: -45,
            leftFootY: 0,
            rightFootX: 1,
            rightFootY: 3,
          },

          {
            body: getTextureRegion(SAMURAI_BODY_NAME),
            bodyX: -60,
            bodyY: -120,
            weapon: getTextureRegion(BFG_NAME),
            weaponX: -92,
            weaponY: -64,
            foot: getTextureRegion(SAMURAI_FOOT_NAME),
            leftFootX: -40,
            leftFootY: -10,
            rightFootX: 10,
            rightFootY: -7,
          },
        ];

        // Set 1x1 white pixel for drawing rectangles.
        // let cxt = TEXTURE_ATLAS.getContext('2d');
        // cxt.fillStyle = '#fff';
        // cxt.fillRect(0, 0, 1, 1);
      }

    }
    image.src = `data:image/svg+xml;base64,${btoa(svgString + '</svg>')}`; // Encode the SVG and set it to the images source (start it loading) .
  },

  // Get the texture region with the given name.
  getTextureRegion = (name) => (textureRegions[name]),

  cloudData = [-24, 13, 48, 7, 21, 48, 33, 43, 48, 69, 64, 48, 105, 70, 90, 192, 75, 64, 243, 88, 56, 295, 94, 48, 328, 83, 56, 368, 51, 56, 411, 19, 64, 464, 1, 48], // Y coordinates where capsules representing clouds will be drawn.
  bushData = [-20, 37, 10, 51, 46, 56, 77, 52, 109, 43, 139, 34, 159, 31, 182, 24, 214, 31, 237, 41, 267, 54, 303, 58, 337, 53, 371, 49, 406, 37, 440, 27, 472, 16], // Pairs of x,y coordinates where capsules representing bushes will be drawn.
  leafData = [87, -20, 251, -2, 342, -11, 412, -35], // Pairs of x, y coordinates where the leaf brush will be stamped (reused).

  // Sub-image names (names of images contained inside the TextureAtlas).
  SAMURAI_BODY_NAME = 's_body',
  SAMURAI_FOOT_NAME = 's_foot',

  MONGOL_BODY_NAME = 'm_body',
  MONGOL_FOOT_NAME = 'm_foot',

  BFG_NAME = 'bfg',
  MONGOL_SWORD_NAME = 'w_sword',
  MONGOL_SPEAR_NAME = 'w_spear',
  MONGOL_BOMB_NAME = 'w_bomb',
  MONGOL_UNNARMED_NAME = 'w_unnarmed',
  MONGOL_RAM_NAME = 'w_ram',

  BFG_PROJECTILE_NAME = 'p_bfg',
  SPEAR_PROJECTILE_NAME = 'p_spear',
  BOMB_PROJECTILE_NAME = 'p_bomb',
  SWORD_PROJECTILE_NAME = 'p_sword',

  MOUNTAIN_NAME = 'd_mountain',
  TEMPLE_NAME = 'd_temple',
  CLOUD_NAME = 'd_cloud',
  BACK_BUSHES_NAME = 'd_bush_b', // Back bushes.
  FRONT_BUSHES_NAME = 'd_bush_f', // Front bushes.

  MUZZLE_PARTICLE_NAME = 'muzzle',
  POWERUP_NAME = 'powerup',
  SMOKE_NAME = 'smoke',
  BLOOD_NAME = 'blood',

  // RGB colors.
  MONGOL_CLOTHING_LIGHT_COLOR = '658',
  MONGOL_CLOTHING_DARK_COLOR = '546',
  MONGOL_SKIN_LIGHT_COLOR = 'fb8',
  MONGOL_SKIN_DARK_COLOR = 'd76',
  MONGOL_HAIR_COLOR = '633',
  MONGOL_HAT_BRIM_LIGHT_COLOR = 'a86',
  MONGOL_HAT_BRIM_DARK_COLOR = '975',
  WOOD_DARK_COLOR = '743',
  WOOD_LIGHT_COLOR = 'da7',
  IRON_DARK_COLOR = '777',
  IRON_LIGHT_COLOR = 'bbb',
  SAMURAI_SKIN_DARK_COLOR = 'c98',
  SAMURAI_SKIN_LIGHT_COLOR = 'ecb',
  SAMURAI_CLOTHING_DARK_COLOR = 'aaa',
  SAMURAI_CLOTHING_LIGHT_COLOR = 'eee',
  SAMURAI_HAT_DARK_COLOR = '654',
  SAMURAI_HAT_LIGHT_COLOR = 'a76',
  BFG_DARK_COLOR = '860',
  BFG_LIGHT_COLOR = 'b93',
  BFG_BARREL_DARK_COLOR = '540',
  MOUNTAIN_DARK_COLOR = '19d',
  MOUNTAIN_LIGHT_COLOR = '28c',
  TEMPLE_DARK_COLOR = '955',
  TEMPLE_LIGHT_COLOR = 'd56',
  TEMPLE_ACCENT_COLOR = '356',
  CLOUD_COLOR = 'fff',
  BACK_BUSHES_COLOR = '4a4',
  FRONT_BUSHES_COLOR = '5c4',

  SHADOW_COLOR = '0006',

  BLOOD_RED = 'f00',

  // Generate a new bloody filter with the given parameters.
  newBloodyFilter = (flatten, seed = 0, color = BLOOD_RED) => (`<${SVG_FILTER} id="Z${++SVG_ID}" x="-25%" y="-25%" width="150%" height="160%"><feFlood flood-color="#${color}${SVG_RESULT}J"></feFlood><${SVG_FETURBULENCE} baseFrequency="0.1" type="fractalNoise" numOctaves="1" seed="${seed}${SVG_RESULT}K"></${SVG_FETURBULENCE}><${SVG_FEGAUSSIANBLUR} in="SourceAlpha" ${SVG_STDDEVIATION}="0.1${SVG_RESULT}L"></${SVG_FEGAUSSIANBLUR}><${SVG_FEDISPLACEMENTMAP} in="L" in2="K" scale="25${SVG_RESULT}M"></${SVG_FEDISPLACEMENTMAP}><${SVG_FECOMPOSITE} in="J" in2="M"${SVG_OPERATOR}in${SVG_RESULT}N"></${SVG_FECOMPOSITE}><${SVG_FECOLORMATRIX} type="matrix" values="${SVG_EMPTY_MATRIX}${SVG_EMPTY_MATRIX}${SVG_EMPTY_MATRIX}0 0 0 1 0" in="N${SVG_RESULT}O"></${SVG_FECOLORMATRIX}><${SVG_FEGAUSSIANBLUR} ${SVG_STDDEVIATION}="2" in="O${SVG_RESULT}P"></${SVG_FEGAUSSIANBLUR}><${SVG_FESPECULARLIGHTING} surfaceScale="5" specularConstant=".75" specularExponent="30" lighting-color="#fff" in="P${SVG_RESULT}Q">${(flatten ? '' : `<${SVG_FEPOINTLIGHT} x="-50" y="-100" z="400"></${SVG_FEPOINTLIGHT}>`)}</${SVG_FESPECULARLIGHTING}><${SVG_FECOMPOSITE} ${SVG_OPERATOR}in" in="Q" in2="O"></${SVG_FECOMPOSITE}><${SVG_FECOMPOSITE} ${SVG_OPERATOR}arithmetic" k1="0" k2="1" k3="1" k4="0" in="N"></${SVG_FECOMPOSITE}></${SVG_FILTER}>`),

  // NOTE TO SELF: The following code could be modified to NOT use the svg USE function, and instead just draw everything manually, which might reduce the code size if required.
  newBushes = (height, color) => {
    svgString = SVG_HEAD(512, height) + // <svg version="1.1" width="512" height="181" viewBox="0 0 512 181" xmlns="http://www.w3.org/2000/svg">
    '<g id="a" fill="#4a2">' + // Generate reusable leaf brush.
    SVG_RECT(47, 37, 14, 48, color, 24) + // <rect x="47" y="37" width="14" height="48" rx="24"/>
    SVG_RECT_ROTATED(17, 53, 14, 48, color, 24, -18) + // <rect transform="rotate(-18)" x="17" y="53" width="14" height="48" rx="24"/>
    SVG_RECT_ROTATED(71, 20, 14, 48, color, 24, 18) + // <rect transform="rotate(18)" x="71" y="20" width="14" height="48" rx="24"/>
    '</g> ';
    for (let i = 0; i < bushData.length; i += 2) svgString += SVG_RECT(bushData[i], bushData[i + 1], 40, 200, color, 20); // Draw capsules.
    for (let i = 0; i < leafData.length; i += 2) svgString += SVG_USE('a', leafData[i], leafData[i + 1]); // Draw leaf brushes.
  },

  // Generate a string for the mongol sword projectile consisting of the blade and hilt.
  swordString =
  SVG_RECT(1, 61, 15, 6, BFG_DARK_COLOR) + // <rect x="1" y="61" width="15" height="6" fill="#966f0e" stroke-width=".7"/> // HILT
  SVG_RECT(16, 61, 15, 6, BFG_LIGHT_COLOR) + // <rect x="16" y="61" width="15" height="6" fill="#e3a424" stroke-width=".5"/>
  SVG_PATH('m16 61v-60l10 15-5 45z', SAMURAI_CLOTHING_DARK_COLOR) + // <path d="m16 61v-60l10 15-5 45z" fill="#eee"/> // BLADE
  SVG_PATH('m16 61v-60l-10 15 5 45z', SAMURAI_CLOTHING_LIGHT_COLOR), // <path d="m16 61v-60l-10 15 5 45z" fill="#ccc"/>

  // #endregion

  // Queue a sub-image to be drawn from the TextureAtlas as defined by the given TextureRegion.
  drawImage = (r, x, y, rgba = 0xFFFFFF7F, rotation = 0) => gl2_drawImage(r.x, r.y, r.w, r.h, x, y, r.w, r.h, rgba, rotation);

// Window onload event handler (fired when page fully loaded). Initialize everything and start gameloop.
W.onload = e => {

  rng.setSeed(578945323);

  // Load persistent data.
  OPTIONS = loadOptions();
  (!OPTIONS) ? resetOptions() : OPTIONS = JSON.parse(OPTIONS);

  // Set HTML elements according to options.
  setHTML(MOVE_UP_LABEL, OPTIONS.controls[CONTROL_UP].code);
  setHTML(MOVE_DOWN_LABEL, OPTIONS.controls[CONTROL_DOWN].code);
  setHTML(BEST_SCORE_LABEL, OPTIONS.best.toLocaleString());
  setHTML(TOGGLE_AUDIO_LABEL, (OPTIONS.audio) ? 'ON' : 'OFF');

  scrollToMenu(-HEIGHT); // Scroll `MENUS` div to show main menu.

  // Inject heading styles into document > head > style element.
  injectHEadingStyle(1, 240, 240); // headingSize, fontSize, lineHeight.
  injectHEadingStyle(2, 150, 150);
  injectHEadingStyle(3, 80, 80);
  injectHEadingStyle(4, 150, 150);

  injectHTML(UI, SVG_HEAD(0, 0) + newBloodyFilter(0, randomInt(0, 1e9)) + '</svg>'); // Inject bloody filter into `UI` div (used to make all UI elements look like they are dripping blood).

  // Create canvasses.
  newCanvas('FIELD_OF_BATTLE', WIDTH, HEIGHT); // id, width, height.
  newCanvas('FOREGROUND', WIDTH, HEIGHT);
  newCanvas('TEXTURE_ATLAS', 1024, 2048); // Atlas.

  FIELD_OF_BATTLE = getByID('FIELD_OF_BATTLE'); // For some reason, these two need to be "fetched", the rest (BACKGROUND, FOREGROUND, etc) can just be poked directly.
  TEXTURE_ATLAS = getByID('TEXTURE_ATLAS');

  fieldOfBattleContext = FIELD_OF_BATTLE.getContext('2d'); // Get context for rendering grassy lines and blood splatters.
  fieldOfBattleContext.globalAlpha = .6;
  fieldOfBattleContext.fillStyle = '#0002'; // Near transparent black color that represent grassy lines.

  updateBackgroundGradient(918); // Set background gradient for menus.

  // Generate sound effects.
  for (let i = 0; i < 4; i++) fx_add(.04, [261.6, 293.6, 329.6, 391.9][i], 0, .07, .49, 0, .62, 0, 0, 0, 0, .05, .1, 0, 0, 0, .33, .11, .04); // Generate 4 musical notes (C2, FIELD_OF_BATTLE, E2, and G2) for the uber random music player.
  // for (let i = 0; i < 4; i++) fx_add([.2,[130.8, 146.8, 164.8, 195.9][i],0,.21,.14,0,1.32,0,0,0,0,0,0,0,0,.01,.22,.12,0]); // Generate 4 musical notes (C1, BACKGROUND, E1, and G1) for the uber random music player.
  // for (let i = 0; i < 4; i++) fx_add([.2,[65.406, 73.416, 82.406, 97.998][i],0,.21,.14,0,1.32,0,0,0,0,0,0,0,0,.01,.22,.12,0]); // Generate 4 musical notes (C, D, E, and G) for the uber random music player.

  fx_add(.1, 633,.02,.01,.01,0,.99,79,0,633,.02,.06,0,63,.1,.05,.58,.02,.99); // FX_CLICK 4
  // fx_add(.1, 975, .01, .02, .01, 1, .55, 50, 4.5, 0, 0, 0, 0, 35, 0, 0, .38, 0, .01); // FX_CLICK 4
  fx_add(.06, 499, .02, .02, .06, 1, 1.65, -23, 3.2, 0, 0, 0, 1.7, 0, .1, 0, .77, .02, 0); // FX_LEAP 5
  fx_add(.02, 444, .02, .03, .1, 3, 1.92, -8.9, -0.6, 0, 0, .05, .8, 0, .5, 0, .54, .08, .02); // FX_DAMAGE 6
  fx_add(.07, 382, .03, .27, .48, 4, .07, .2, .2, 0, 0, 0, 1.9, -66, 1, 0, .46, .15, 0); // FX_BOMB 7
  fx_add(.02, 1e4, 0, 0, .1, 0, 1, 0, 0, 0, 0, .01, 6.8, -0.02, 0, 0, 1, 0, 0); // FX_HIHAT 8
  fx_add(.03, 360, 0, 0, .12, 2, 2, 0, 0, 0, 0, 0, 9, 0, .1, 0, 1, 0, 0); // FX_DRUM 9
  fx_add(.05, 337, 0, .07, .2, 0, 1.65, 0, 1.7, 50, 0, .05, 1.5, 74, .3, .02, .91, .07, .03); // FX_MONGOL_DIE_1 10
  fx_add(.05, 494, .03, .05, .05, 2, 1.67, 2.8, 0, 0, 0, 0, .5, 0, .5, .12, .91, .06, 0); // FX_MONGOL_DIE_2 11
  fx_add(.05, 364, 0, .08, .17, 3, 1.08, 2.9, 0, 0, 0, 0, .6, 13, .4, .15, .86, .05, .26); // FX_MONGOL_DIE_3 12 
  fx_add(.06,388,.01,.12,.5,3,4.1,0,0,0,0,.01,.7,-29,.4,.01,.31,.08,.47); // FX_MONGOL_DIE_4 13
  fx_add(.05,189,.01,.09,.13,2,.07,1.1,-1.5,870,.03,.11,0,0,0,.05,.67,.03,0); // FX_POWERUP 14 
  fx_add(.3,294,.09,.29,.29,3,0,-2.4,-0.1,-17,.05,.01,0,0,0,.18,.94,.18,.09); // FX_AIRSTRIKE 15 
  fx_add(.4,717,.08,.24,.14,3,1.77,30,0,-66,.07,0,0,-73,0,0,.72,.03,.22); // FX_RAILGUN 16 
  // fx_add(.3,232,0,.04,.03,4,1.33,-8.4,0,0,0,.03,0,0,0,.12,.93,.1,0); // FX_RAILGUN 16 
  fx_add(.1,1986,.01,.1,.16,2,.75,0,0,0,0,0,0,0,0,.03,.61,.04,0); // FX_WEAPON_POWERUP 17 
  fx_add(1,891,.03,.15,.32,2,2.51,.8,.9,0,0,0,1.2,1.3,.1,.33,.46,.08,.08); // FX_GAMEOVER 18
  fx_add(.3,72,.01,.19,.2,1,.16,-3.9,0,358,.01,.03,0,0,0,.09,.67,.14,0); // FX_POINTS 19
  fx_add(.3,189,.01,.09,.13,2,.07,1.1,-1.5,870,.03,.11,0,0,0,.05,.67,.03,0); // FX_HEALTH 20
  fx_add(.06,384,.02,.27,.53,4,3.02,0,.1,50,.01,-0.02,0,0,.1,.05,.47,.18,0); // FX_LIGHTNING 21

  
  // fx_add(.7,508,.05,.27,.49,2,1.24,0,0,573,.09,.16,0,15,0,0,.98,.27,0); // FX_BESTSCORE

  // #region - Asset generation.

  // 
  // Generate the graphical assets.
  // 

  // 
  // The protagonist.. the noble samurai.
  // 

  // Samurai.
  svgString = SVG_HEAD(117, 130) + // <svg width="117" height="118" version="1.1" viewBox="0 0 117 118" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(29, 51, 44, 20, SAMURAI_SKIN_DARK_COLOR) + // <rect x="29" y="51" width="44" height="20" fill="#C98"/> // Head
  SVG_RECT(73, 51, 17, 20, SAMURAI_SKIN_LIGHT_COLOR) + // <rect x="73" y="51" width="17" height="20" fill="#ecb"/>
  SVG_RECT(29, 71, 42, 31, SAMURAI_CLOTHING_DARK_COLOR) + // <rect x="29" y="71" width="42" height="31" fill="#aaa"/> // Torso
  SVG_RECT(71, 71, 14, 31, SAMURAI_CLOTHING_LIGHT_COLOR) + // <rect x="71" y="71" width="14" height="31" fill="#eee"/>
  SVG_RECT(0, 116, 114, 16, SHADOW_COLOR, 55) + // <rect x="1" y="106" width="93" height="16" rx="46" fill="#0006"/>
  SVG_PATH('m1 51h77l-20-50z', SAMURAI_HAT_DARK_COLOR) + // <path d="m1 51h77l-20-50z" fill="#654"/> // Hat
  SVG_PATH('m78 51h38l-58-50z', SAMURAI_HAT_LIGHT_COLOR); // <path d="m78 51h38l-58-50z" fill="#a76"/>
  newTextureRegion(SAMURAI_BODY_NAME, 94, 0);

  // Samurai foot.
  svgString = SVG_HEAD(39, 11) + // <svg width="39" height="11" version="1.1" viewBox="0 0 39 11" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(25, 1, 13, 9, SAMURAI_CLOTHING_LIGHT_COLOR) + // <rect x="25" y="1" width="13" height="9" fill="#a9a7aa"/>
  SVG_RECT(1, 1, 25, 9, SAMURAI_CLOTHING_DARK_COLOR); // <rect x="1" y="1" width="25" height="9" fill="#ececec"/>
  newTextureRegion(SAMURAI_FOOT_NAME, 94, 140);

  // 
  // The antagonist.. the barbaric mongol.
  // 

  // Mongol body.
  svgString = SVG_HEAD(93, 123) + // <svg width="93" height="113" version="1.1" viewBox="0 0 93 113" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(8, 1, 69, 59, MONGOL_CLOTHING_DARK_COLOR, 35, 30) + // <rect x="8" y="1" width="69" height="59" rx="35" ry="30" fill="#546"/> // Hat Top
  SVG_RECT(8, 1, 69, 59, MONGOL_CLOTHING_DARK_COLOR, 35, 30) + // <rect x="8" y="1" width="69" height="59" rx="35" ry="30" fill="#546"/> // Hat Top
  SVG_RECT(16, 1, 61, 56, MONGOL_CLOTHING_LIGHT_COLOR, 30, 28) + // <rect x="16" y="1" width="61" height="56" rx="30" ry="28" fill="#658"/>
  SVG_RECT(15, 67, 56, 32, MONGOL_CLOTHING_DARK_COLOR) + // <rect x="15" y="67" width="56" height="32" fill="#546"/> // Torso
  SVG_RECT(29, 91, 42, 8, MONGOL_CLOTHING_LIGHT_COLOR) + // <rect x="29" y="91" width="42" height="8" fill="#658"/>
  SVG_RECT(29, 67, 42, 21, MONGOL_CLOTHING_LIGHT_COLOR) + // <rect x="29" y="67" width="42" height="21" fill="#658"/>
  SVG_RECT(10, 35, 61, 32, MONGOL_SKIN_DARK_COLOR) + // <rect x="10" y="35" width="61" height="32" fill="#d76"/> // Face
  SVG_RECT(27, 52, 44, 15, MONGOL_SKIN_LIGHT_COLOR) + // <rect x="27" y="52" width="44" height="15" fill="#fb8"/>
  SVG_RECT(3, 30, 36, 18, MONGOL_HAT_BRIM_DARK_COLOR, 6) + // <rect x="3" y="30" width="36" height="18" rx="6" fill="#975"/> // Hat brim
  SVG_RECT(26, 30, 55, 18, MONGOL_HAT_BRIM_LIGHT_COLOR, 5) + // <rect x="26" y="30" width="55" height="18" rx="5" fill="#a86"/>
  SVG_RECT(0, 106, 88, 16, SHADOW_COLOR, 43) + // <rect x="1" y="106" width="93" height="16" rx="46" fill="#0006"/>
  SVG_PATH('m70 64-2-7-11-2-19 2-2 7', SVG_TRANSPARENT_COLOR, 3, MONGOL_HAIR_COLOR) + // <path d="m70 64-2-7-11-2-19 2-2 7" fill="none" stroke="#633" stroke-width="3"/> // Moustache
  SVG_PATH('m42 62h21l-8 19z', MONGOL_HAIR_COLOR); // <path d="m42 62h21l-8 19z" fill="#633"/> // Beard
  newTextureRegion(MONGOL_BODY_NAME, 0, 0);

  // Mongol foot.
  svgString = SVG_HEAD(39, 11) + // <svg width="39" height="11" version="1.1" viewBox="0 0 39 11" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(1, 1, 13, 9, MONGOL_HAT_BRIM_DARK_COLOR) + // <rect x="1" y="1" width="13" height="9" fill="#732"/>
  SVG_RECT(13, 1, 25, 9, MONGOL_HAT_BRIM_LIGHT_COLOR); //<rect x="13" y="1" width="25" height="9" fill="#843"/>
  newTextureRegion(MONGOL_FOOT_NAME, 0, 140);

  // 
  // The instruments of war.
  // 

  // Big Frikkin Gun (Samurai's weapon of choice).
  svgString = SVG_HEAD(140, 50) + // <svg width="140" height="50" version="1.1" viewBox="0 0 140 50" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(105, 1, 32, 42, BFG_LIGHT_COLOR, 16, 21) + // <rect x="105" y="1" width="32" height="42" rx="16" ry="21" fill="#b93"/> // Bamboo weapon
  SVG_RECT(63, 3, 72, 38, BFG_DARK_COLOR, 15, 19) + // <rect x="63" y="3" width="72" height="38" rx="15" ry="19" fill="#860"/>
  SVG_RECT(53, 1, 32, 42, BFG_LIGHT_COLOR, 16, 21) + // <rect x="53" y="1" width="32" height="42" rx="16" ry="21" fill="#b93"/>
  SVG_RECT(11, 3, 72, 38, BFG_DARK_COLOR, 15, 19) + // <rect x="11" y="3" width="72" height="38" rx="15" ry="19" fill="#860"/>
  SVG_RECT(1, 2, 30, 40, BFG_DARK_COLOR, 15, 20, 2, BFG_LIGHT_COLOR) + // <rect x="1" y="2" width="30" height="40" rx="15" ry="20" fill="#540" stroke="#b93" stroke-width="2"/>
  SVG_RECT(128, 24, 11, 22, SAMURAI_SKIN_LIGHT_COLOR) + // <rect x="128" y="24" width="11" height="22" fill="#ecb"/> // Left hand
  SVG_RECT(114, 24, 14, 22, SAMURAI_SKIN_DARK_COLOR) + // <rect x="114" y="24" width="14" height="22" fill="#C98"/>
  SVG_RECT(63, 36, 11, 13, SAMURAI_SKIN_LIGHT_COLOR) + // <rect x="63" y="36" width="11" height="13" fill="#ecb"/> // Right hand
  SVG_RECT(49, 36, 14, 13, SAMURAI_SKIN_DARK_COLOR); // <rect x="49" y="36" width="14" height="13" fill="#C98"/>
  newTextureRegion(BFG_NAME, 220, 0);

  // Mongol unnarmed.
  svgString = SVG_HEAD(89, 28) + // <svg width="89" height="86" version="1.1" viewBox="0 0 89 86" xmlns="http://www.w3.org/2000/svg">
  MONGOL_HAND(3, 1) +
  MONGOL_HAND(69, 7);
  newTextureRegion(MONGOL_UNNARMED_NAME, 220, 430);

  // Mongol spear.
  svgString = SVG_HEAD(163, 32) + // <svg width="163" height="32" version="1.1" viewBox="0 0 163 32" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(1, 12, 123, 8, WOOD_DARK_COLOR) + // <rect x="1" y="12" width="123" height="8" ry="4" fill="#75492c"/>
  SVG_PATH('m117 16h45l-40-15z', SAMURAI_CLOTHING_LIGHT_COLOR) + // <path d="m117 16h45l-40-15z" fill="#e6e6e6"/>
  SVG_PATH('m117 16h45l-40 15z', SAMURAI_CLOTHING_DARK_COLOR); // <path d="m117 16h45l-40 15z" fill="#b3b3b3"/>
  newTextureRegion(SPEAR_PROJECTILE_NAME, 220, 390);

  // Mongol spear (with hands).
  svgString += MONGOL_HAND(70, 7);
  newTextureRegion(MONGOL_SPEAR_NAME, 220, 52);

  // Mongol ram.
  svgString = SVG_HEAD(138, 55) + // <svg width="138" height="55" version="1.1" viewBox="0 0 138 55" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(1, 8, 134, 38, WOOD_DARK_COLOR, 15, 19) + // <rect x="1" y="8" width="134" height="38" rx="15" ry="19" fill="#75492c"/>
  SVG_RECT(107, 8, 30, 38, WOOD_LIGHT_COLOR, 15, 19) + // <rect x="107" y="8" width="30" height="38" rx="15" ry="19" fill="#d5a878"/>
  MONGOL_HAND(65, 36) +
  MONGOL_HAND(19, 1) +
  SVG_PATH('m120 28c-1-6 10-3 3 4-6 5-15-8-5-14 11-5 18 13 7 21', SVG_TRANSPARENT_COLOR, 2, WOOD_DARK_COLOR); // <path d="m120 28c-1-6 10-3 3 4-6 5-15-8-5-14 11-5 18 13 7 21" fill="none" stroke="#75492c" stroke-width="2"/>
  newTextureRegion(MONGOL_RAM_NAME, 220, 88);

  // Mongol bomb.
  svgString = SVG_HEAD(86, 73) + // <svg width="86" height="73" version="1.1" viewBox="0 0 86 73" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(1, 9, 77, 63, IRON_DARK_COLOR, 37) + // <rect x="1" y="9" width="77" height="63" rx="37" fill="#6d6e70"/>
  SVG_RECT(15, 11, 63, 58, IRON_LIGHT_COLOR, 31) + // <rect x="15" y="11" width="63" height="58" rx="31" ry="0" fill="#bbbdbf"/>
  SVG_RECT(34, 1, 7, 10, IRON_DARK_COLOR) + // <rect x="34" y="1" width="7" height="10" fill="#6d6e70"/>
  SVG_RECT(41, 1, 9, 11, IRON_LIGHT_COLOR); // <rect x="41" y="1" width="9" height="11" fill="#bbbdbf"/>
  newTextureRegion(BOMB_PROJECTILE_NAME, 320, 144);

  // Mongol bomb (with hands).
  svgString += MONGOL_HAND(58, 49) +
  MONGOL_HAND(1, 49);
  newTextureRegion(MONGOL_BOMB_NAME, 220, 144);

  // Mongol sword projectile.
  svgString = SVG_HEAD(32, 86) + // <svg width="32" height="86" version="1.1" viewBox="0 0 32 86" xmlns="http://www.w3.org/2000/svg">
  swordString +
  SVG_RECT(11, 67, 5, 18, WOOD_DARK_COLOR) + // <rect x="1" y="61" width="15" height="6" fill="#966f0e" stroke-width=".7"/>
  SVG_RECT(16, 67, 5, 18, WOOD_LIGHT_COLOR); // <rect x="16" y="67" width="5" height="18" fill="#da7"/>
  newTextureRegion(SWORD_PROJECTILE_NAME, 220, 465);

  // Mongol sword (with hands).
  svgString = SVG_HEAD(89, 86) + // <svg width="89" height="86" version="1.1" viewBox="0 0 89 86" xmlns="http://www.w3.org/2000/svg">
  MONGOL_HAND(3, 67) +
  MONGOL_HAND(69, 67) +
  SVG_RECT(1, 61, 15, 6, BFG_DARK_COLOR) + // <rect x="1" y="61" width="15" height="6" fill="#966f0e" stroke-width=".7"/>
  SVG_RECT(16, 61, 15, 6, BFG_LIGHT_COLOR) + // <rect x="16" y="61" width="15" height="6" fill="#e3a424" stroke-width=".5"/>
  SVG_PATH('m16 61v-60l10 15-5 45z', SAMURAI_CLOTHING_DARK_COLOR) + // <path d="m16 61v-60l10 15-5 45z" fill="#f9f9f9"/>
  SVG_PATH('m16 61v-60l-10 15 5 45z', SAMURAI_CLOTHING_LIGHT_COLOR); // <path d="m16 61v-60l-10 15 5 45z" fill="#ccc"/>
  newTextureRegion(MONGOL_SWORD_NAME, 220, 300);

  // BFG projectile.
  svgString = SVG_HEAD(23, 26) + // <svg width="23" height="26" version="1.1" viewBox="0 0 23 26" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(1, 1, 21, 24, IRON_DARK_COLOR, 12) + // <rect x="1" y="1" width="21" height="24" ry="12" fill="#888"/>
  SVG_RECT(6, 2, 16, 21, SAMURAI_CLOTHING_LIGHT_COLOR, 10); // <rect x="6" y="2" width="16" height="21" ry="10" fill="#eee"/>
  newTextureRegion(BFG_PROJECTILE_NAME, 220, 242);

  // Shrapnel.
  for (let i = 0; i < 3; i++) {
    svgString = SVG_HEAD(36, 36) + SVG_PATH('m1 1 34 7-22 27z', [BLOOD_RED, 'f80', 'ff0'][i]);// <svg width="36" height="36" version="1.1" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg"> <path d="m1 1 34 7-22 27z" fill="#f00"/>
    newTextureRegion('shrapnel' + i, 130, 440 + (i * 40));
  }

  // 
  // Powerup boxes.
  // 

  for (let i = 0; i < powerups.length; i++) {
    let data = powerups[i];
    svgString = SVG_HEAD(107, 72) + // <svg width="107" height="72" version="1.1" viewBox="0 0 85 66" xmlns="http://www.w3.org/2000/svg">
    SVG_RECT(12, 59, 83, 12, SHADOW_COLOR) + // <rect x="1" y="61" width="105" height="10" rx="53" fill="#393"/>
    SVG_RECT(12, 1, 24, 64, data.c2) + // <rect x="12" y="1" width="24" height="64" fill="#6d6e70"/>
    SVG_RECT(31, 1, 64, 64, data.c1) + // <rect x="31" y="1" width="64" height="64" fill="#bbbdbf"/>
    SVG_TEXT(36, 55, data.t, SAMURAI_CLOTHING_LIGHT_COLOR, 64); // `<text x="36" y="55" fill="#eee" font-family="Arial" font-size="64px" font-weight="900">G</text>`;
    newTextureRegion(POWERUP_NAME + data.t, 400, i * 75);
  }

  // 
  // Particles.
  // 

  svgString = SVG_HEAD(120, 48) + 
  SVG_TEXT(1, 32, 5e3, SAMURAI_CLOTHING_LIGHT_COLOR, 32);
  newTextureRegion('points', 400, 600);

  svgString = SVG_HEAD(85, 66) + 
  SVG_RECT(1, 1, 83, 64, SAMURAI_CLOTHING_LIGHT_COLOR);
  newTextureRegion('powerup_flash', 512, 405);

  // Blood splatters.
  for (let i = 0; i < 10; i++) {
    svgString = SVG_HEAD(60, 60) + newBloodyFilter(1, randomInt(1, 1e9)) + SVG_RECT(5, 5, 50, 50, 'Z' + SVG_ID, 20);
    newTextureRegion(BLOOD_NAME + i, 0, 155 + (i * 64));
  }

  // Smoke. NOTE: also used for clouds in menus.
  for (let i = 0; i < 10; i++) {
    svgString = SVG_HEAD(60, 60) + newBloodyFilter(0, randomInt(1, 1e9), 'ccc') + SVG_RECT(5, 5, 50, 50, 'Z' + SVG_ID, 20);
    newTextureRegion(SMOKE_NAME + i, 65, 155 + (i * 64));
  }

  // Muzzle flash.
  for (let i = 0; i < 4; i++) {
    svgString = SVG_HEAD(66, 66) + SVG_PATH('m50 65-21-19-28 4 19-20-5-29 22 18 28-3-19 21z', [BLOOD_RED, 'f80', 'ff0', '9df'][i]); // <svg width="66" height="66" version="1.1" viewBox="0 0 66 66" xmlns="http://www.w3.org/2000/svg"> <path d="m50 65-21-19-28 4 19-20-5-29 22 18 28-3-19 21z" fill="#f00"/>
    newTextureRegion(MUZZLE_PARTICLE_NAME + i, 130, 155 + (i * 70));
  }

  // Railgun.
  for (let i = 0; i < 4; i++) {
    svgString = SVG_HEAD(960, 32) + newBloodyFilter(1, randomInt(1, 1e9), '08f') + SVG_RECT(5, 5, 950, 22, 'Z' + SVG_ID, 8);
    newTextureRegion('rail' + i, 0, 800 + i * 40);
  }

  // 
  // Aesthetic background decorations.
  // 

  // Temple.
  svgString = SVG_HEAD(226, 200) + // <svg version="1.1" viewBox="0 0 226 200" xmlns="http://www.w3.org/2000/svg">
  SVG_RECT(31, 35, 11, 164, TEMPLE_DARK_COLOR) + // <rect x="31" y="35" width="11" height="164" fill="#955"/>
  SVG_RECT(41, 35, 14, 164, TEMPLE_LIGHT_COLOR) + // <rect x="41" y="35" width="14" height="164" fill="#d56"/>
  SVG_RECT(161, 35, 11, 164, TEMPLE_DARK_COLOR) + // <rect x="161" y="35" width="11" height="164" fill="#955"/>
  SVG_RECT(171, 35, 14, 164, TEMPLE_LIGHT_COLOR) + // <rect x="171" y="35" width="14" height="164" fill="#d56"/>
  SVG_RECT(94, 35, 11, 25, TEMPLE_DARK_COLOR) + // <rect x="94" y="35" width="11" height="25" fill="#955"/>
  SVG_RECT(104, 35, 14, 25, TEMPLE_LIGHT_COLOR) + // <rect x="104" y="35" width="14" height="25" fill="#d56"/>
  SVG_RECT(4, 55, 14, 15, TEMPLE_DARK_COLOR) + // <rect x="4" y="55" width="14" height="15" fill="#955"/>
  SVG_RECT(15, 55, 210, 15, TEMPLE_LIGHT_COLOR) + // <rect x="15" y="55" width="210" height="15" fill="#d56"/>
  SVG_RECT(1, 15, 14, 20, TEMPLE_DARK_COLOR) + // <rect x="1" y="15" width="14" height="20" fill="#955"/>
  SVG_RECT(13, 15, 210, 20, TEMPLE_LIGHT_COLOR) + // <rect x="13" y="15" width="210" height="20" fill="#d56"/>
  SVG_RECT(1, 1, 222, 15, TEMPLE_ACCENT_COLOR); // <rect x="1" y="1" width="222" height="15" fill="#356"/>
  newTextureRegion(TEMPLE_NAME, 160, 580);
  // newTextureRegion(TEMPLE_NAME, 395, 393);

  // 220, 430);

  // Mountain.
  svgString = SVG_HEAD(401, 228) + // <svg version="1.1" viewBox="0 0 401 228" xmlns="http://www.w3.org/2000/svg">
  SVG_PATH('m1 227 205-226 194 226z', MOUNTAIN_DARK_COLOR) + // <path d="m1 227 205-226 194 226z" fill="#1592d6"/>
  SVG_PATH('m1 227h150l55-226z', MOUNTAIN_LIGHT_COLOR); // <path d="m1 227h150l55-226z" fill="#1c88c2"/>
  newTextureRegion(MOUNTAIN_NAME, 623, 393);

  // Parallax clouds.
  svgString = SVG_HEAD(512, 181); // <svg version="1.1" width="512" height="181" viewBox="0 0 512 181" xmlns="http://www.w3.org/2000/svg">
  for (let i = 0; i < cloudData.length; i += 3) svgString += SVG_RECT(cloudData[i], cloudData[i + 1], cloudData[i + 2], 200, CLOUD_COLOR, cloudData[i + 2] / 2); // Draw capsules.
  newTextureRegion(CLOUD_NAME, 512, 0);

  // Back bushes.
  newBushes(135, BACK_BUSHES_COLOR);
  newTextureRegion(BACK_BUSHES_NAME, 512, 183);

  // Front bushes.
  newBushes(70, FRONT_BUSHES_COLOR);
  allAssetsGenerated = 1; // MUST BE PRESENT ON GENERATING FINAL ASSET FOR TEXTURE TO WORK!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< !important
  newTextureRegion(FRONT_BUSHES_NAME, 512, 320);

  // #endregion

  // #region - Install button click handlers.

  // The play button was pressed.. let the bloodshed begin!!!
  setClickHandler(PLAY_BUTTON, e => {

    // Reset everything.

    // Reset music (and animation) variables.
    metronome = .25;
    animCounter = 0;

    // Reset powerup timers.
    increaseWeaponReloadTimer = .5;
    increaseProjectileSpeedTimer = 1;
    regenerateHealthTimer = 20;
    airstrikeTimer = 15;
    lightningstrikeTimer = 18;
    railgunTimer = 12;
    awardBonusPointsTimer = 7;
    increaseWalkSpeedPointsTimer = 6;

    totalGameTime = 0;

    MULTIPLIER = 1; // Most "things" get multiplied by this to ramp up difficulty

    timeBeforeNextMongolSpawns = 0;
    mongolSpawnDelay = 3;

    upHeld = 0; // Player control related.
    downHeld = 0;

    // Reset firing variables.
    playerRefireDelay = 2;
    weaponReloadSpeed = 1.5;
    weaponBulletSpeed = -400;

    playerProjectiles = [];
    enemyProjectiles = [];
    mongols = [];
    particles = [];

    // Reset score.
    gotBestScore = 0;
    playerScore = 0;
    setHTML(SCORE_LABEL, 0);

    // Reset player health.
    playerHealth = 1048;
    updateHealthBar();

    playerSpeed = 100;

    player.y = HEIGHT / 2; // Set player position.

    // Initialize BACKGROUND for game scene
    scrollToMenu(-HEIGHT * 2); // Scroll `MENUS` div to display the ingame HUD.
    updateBackgroundGradient(256); // Set background gradient for game scene.
    // showCursor(0);
    resetFieldOfBattle(1);

    gameMode = GAME_MODE_PLAYING;
    keysEnabled = 1;
  });

  // Show the options menu.
  // setClickHandler(OPTIONS_BUTTON, e => {
  //    with(new AudioContext)with(createScriptProcessor(k=8192,t=0,1))connect(destination),onaudioprocess=x=>{
  //     for (i = 0; i < k; t += 2e-5) x.outputBuffer.getChannelData(0)[i++]='%,IW7:A'.charCodeAt(i%7)*t%.1*(1-t/(Math.tan(i%7)+9)%1)}

  //   scrollToMenu(0)});
  setClickHandler(OPTIONS_BUTTON, e => scrollToMenu(0));

  // "Okay" button clicked on game over menu.
  setClickHandler(CONFIRM_GAMEOVER_BUTTON, e => {
    gameMode = GAME_MODE_MENUS; // Set game mode.
    keysEnabled = 0; // Disable key presses.
    showElement(GAMEOVER, 0); // Hide game over menu.
    resetFieldOfBattle();
    updateBackgroundGradient(918); // Set background gradient for menus.

    scrollToMenu(-HEIGHT);
  });

  // Toggle audio.
  setClickHandler(TOGGLE_AUDIO_BUTTON, e => {
    OPTIONS.audio = !OPTIONS.audio;
    updateAudioLabel();
    saveOptions();
  });

  // Player wants to change the control for up.
  setClickHandler(MOVE_UP_BUTTON, e => initiateWaitingForKeyPress(CONTROL_UP, MOVE_UP_LABEL));

  // Player wants to change the control for down.
  setClickHandler(MOVE_DOWN_BUTTON, e => initiateWaitingForKeyPress(CONTROL_DOWN, MOVE_DOWN_LABEL));

  // Return to main menu
  setClickHandler(CONFIRM_OPTIONS_BUTTON, e => scrollToMenu(-HEIGHT));

  // #endregion

  gl2_setup(FOREGROUND); // Initialize webGL renderer.

  // #region - Install other DOM event handlers

  // Window onclick event handler. Manage clicking on powerups.
  UI.onclick = e => {

    if (gameMode === GAME_MODE_PLAYING) {

      let x = e.offsetX,
        y = e.offsetY;

      if (isNotEmpty(mongols)) {
        for (let i = mongols.length - 1; i >= 0; i--) {
          actor = mongols[i];

          if (actor.type === ACTOR_TYPE_POWERUP) {

            if (x > actor.x - 58 && x < actor.x + 58 && y > actor.y - 40 && y < actor.y + 40) {

              removeAtIndex(mongols, i);

              actor.leaping(actor); // we are using this attribute to save code bytes, it make it stupidly un-understandable.

              for (let j = 0; j < 7; j++) {
                newParticle(
                  .2, // ttl
                  e.offsetX - 33, // x
                  e.offsetY - 33, // y
                  random() * PI2, // rotation
                  MUZZLE_PARTICLE_NAME + randomInt(0, 2),// texture
                  750 + random() * 100, // speed
                  1, // fades
                  1, // alpha
                  0, // shrinks
                  .5 + random(), // scale
                  (random() < .5) ? -PI2 * .05 : PI2 * .05, // rotationRate
                  0, // gravityX
                  0 // gravityY
                );
              }
              return;
            }
          }
        }
      }
    }
  }

  // Key down event handler
  W.onkeydown = e => {
    let k = e.keyCode; // Get the key that was pressed.

    if (keysEnabled) {
      // Process keydown events when the game is running.
      if (!upHeld && (k == 38 || k == OPTIONS.controls[CONTROL_UP].key)) upHeld = 1;
      if (!downHeld && (k == 40 || k == OPTIONS.controls[CONTROL_DOWN].key)) downHeld = 1;
    }
  };

  // Key up event handler
  W.onkeyup = e => {
    let k = e.keyCode; // Get the key that was released.

    if (waitingForKey) {
      // Process keyup events when the game is waiting for a new controll key to be pressed
      setHTML(controlLabel, e.code);
      OPTIONS.controls[controlIndex].code = e.code;
      OPTIONS.controls[controlIndex].key = k;
      waitingForKey = 0; // No longer waiting for this event.
      KEYPRESS.style.zIndex = -1;
      saveOptions();

    } else if (keysEnabled) {
      // Process keyup events when the game is running.
      if (upHeld && (k == 38 || k == OPTIONS.controls[CONTROL_UP].key)) upHeld = 0;
      if (downHeld && (k == 40 || k == OPTIONS.controls[CONTROL_DOWN].key)) downHeld = 0;
    }
  };

  // Window resize event handler. Scale and center display several elements.
  W.onresize = e => {
    let innerWidth = W.innerWidth;
    scaleAndCenter = (el) => {
      el.style.transform = `scale(${min(innerWidth / WIDTH, W.innerHeight / HEIGHT)})`; // Scale the canvas
      el.style.left = (~~(innerWidth - BACKGROUND.getBoundingClientRect().width) / 2) + 'px'; // Center the canvas on the x-axis
      // el.style.left = (floor(innerWidth - BACKGROUND.getBoundingClientRect().width) / 2) + 'px'; // Center the canvas on the x-axis
    };
    scaleAndCenter(BACKGROUND);
    scaleAndCenter(FIELD_OF_BATTLE);
    scaleAndCenter(FOREGROUND);
    scaleAndCenter(UI);
    scaleAndCenter(KEYPRESS);
  }
  W.onresize(); // Force initial resize.
  // #endregion

  particles = [];

  lastFrame = Date.now(); // Setup game timing
  onEnterFrame(); // Start the game loop
};


let updateParticles = () => {
  // Process particles here so they appear on top of everything else

  if (isNotEmpty(particles)) { // Check to be sure there is at least one partlcle

    for (let i = particles.length - 1; i >= 0; i--) {
      actor = particles[i];

      // actor.counter -= DT;

      if ((actor.counter -= DT) <= 0) {
        // if (actor.counter <= 0) {
        // Particle has expired.
        removeAtIndex(particles, i); // If the ttl reaches 0 or below, remove the particle from the list

      } else {

        actor.vx += actor.gx; // Apply gravity.
        actor.vy += actor.gy;

        moveActor(actor);

        actor.rotation += actor.rotationRate;
        let ratio = 1 / actor.ttl * actor.counter; // Scaling ratio.
        if (actor.fades) actor.alpha = actor.originalAlpha * ratio; // Scale alpha.
        if (actor.shrinks) {
          actor.scale = actor.originalScale * ratio; // Scale size.
          actor.iX = ((actor.texture.w * actor.originalScale) * (1 - ratio)) / 2;
          actor.iY = ((actor.texture.h * actor.originalScale) * (1 - ratio)) / 2;
        }
        // if (actor.frames > 0) setTextureRegion(actor, [actor.iX + (actor.tR[2] * clamp(actor.frames - floor(actor.frames * ratio) - 1, 0, actor.frames - 1)), actor.tR[1], actor.tR[2], actor.tR[3]]); // Animate a frame based particle over time.

        renderList.push(actor);
      }
    }
  }
},

// Spawn a new mongol of the given type
newMongol = e => {
  timeBeforeNextMongolSpawns = mongolSpawnDelay + random() * .1;

  let
  randomness = random(),
  type = ACTOR_TYPE_MONGOL_SWORD; // Swordsman.

  if (randomness < .6) type++; // Door knocker.
  if (randomness < .4) type++; // Spear thrower.
  if (randomness < .1) type++; // Bomb runner.

  // type = 2;

  musicalNote = type; // Set current musical note (c2, d2, e2, or g2).

  mongols.push(newActor(
    type, // type
    -150 + randomInt(0, 70), // x
    randomInt(350, HEIGHT - 100), // y
    [100 * MULTIPLIER, 80 * MULTIPLIER, 60 * MULTIPLIER, 300 * MULTIPLIER][type] + randomInt(10, 30), // vx
    0, // vy
    30, // radius
    0, // leaping
    0, // leaving
    1, // collides
    2 + random() * 2, // actionDelay
    randomness // randomness
  ));
};

// Process all mongols (and powerups) according to their AI. Whilst it might seem strange to process the powerups here, it is necessary because mongols will move around powerups.
let updateMongols = () => {
  if (isNotEmpty(mongols)) { // Proceed only if there is at least 1 mongol.

    let
      actor,
      mongolCount = mongols.length;

    for (let i = mongolCount - 1; i >= 0; i--) {
      actor = mongols[i];

      if (actor.type != ACTOR_TYPE_POWERUP) {

        // 
        // Process mongols
        // 

        moveActor(actor);

        if (actor.leaping || actor.leaving) {

          // 
          // Process mongols who are leaping (reached the end of the field of battle), or leaving (were killed by the player).
          // 

          actor.vy += 45; // Apply gravity.

          if (actor.x > WIDTH + 200) { // Did the mongol make it past the player? NOTE: Mongols who are leaving will never satisfy this condition (hopefully lol)
            removeAtIndex(mongols, i);
            damagePlayer([10, 25, 50, 100, 25][actor.type]);

          } else if (actor.y > HEIGHT + 150) { // Is the mongol no longer visible?
            removeAtIndex(mongols, i);

          } else { // Mongol is visible, draw them.
            renderList.push(actor);
          }

        } else {

          // 
          // Mongol is just moving from left to right across the field of battle.
          // 

          if (actor.type === ACTOR_TYPE_MONGOL_SPEAR) {

            // 
            // Process mongols that throw spears.
            // 

            if ((actor.actionDelay -= DT) < 0) { // Ready to throw?

              // 
              // Throw a spear at the player, then change type to unnarmed.
              // 

              let 
              angle = M.atan2(player.y + 20 - actor.y, player.x - actor.x), // Get the angle to roughly the middle of the players body.
              speed = (800 * MULTIPLIER) + (random() * 100); // Every spear is thrown at a different speed.

              // Spawn a new mongol spear projectile.
              enemyProjectiles.push(newActor(
                ACTOR_TYPE_PROJECTILE, // type
                actor.x - 110, // x
                actor.y - 75, // y
                cos(angle) * speed, // vx
                sin(angle) * speed, // vy
                160, // radius // collision point xoffset
                0, // leaping // collision point yoffset
                0, // leaving
                0, // collides
                0, // actionDelay
                0, // randomness
                0, // timed
                40, // damage
                getTextureRegion(SPEAR_PROJECTILE_NAME), // texture
                0, // ttl
                0, // rotation
                0, // iX
                0, // iY
                1, // scale
                1 // alpha
              ));

              actor.type = ACTOR_TYPE_MONGOL_UNNARMED; // Change to an unnarmed mongol.
            }

          } else if (actor.type === ACTOR_TYPE_MONGOL_SWORD) {

            // 
            // Process mongols that throw swords.
            // 

            if ((actor.actionDelay -= DT) < 0) { // Ready to throw?

              // 
              // Throw a sword towards the right side of the field of battle, then change type to unnarmed.
              // 

              // Spawn a new mongol sword projectile.
              enemyProjectiles.push(newActor(
                ACTOR_TYPE_PROJECTILE, // type
                actor.x - 60, // x
                actor.y - 92, // y
                (600 * MULTIPLIER) + (random() * 100), // vx
                0, // vy
                16, // radius // collision point xoffset
                43, // leaping // collision point yoffset
                0, // leaving
                0, // collides
                0, // actionDelay
                0, // randomness
                0, // timed
                20, // damage
                getTextureRegion(SWORD_PROJECTILE_NAME), // texture
                0, // ttl
                0, // rotation
                0, // iX
                0, // iY
                1, // scale
                1, // alpha
                (PI2 * .07) + (random() * .02)
              ));

              // paused = 1;
              actor.type = ACTOR_TYPE_MONGOL_UNNARMED; // Change to an unnarmed mongol.
            }
          }

          if (actor.x > WIDTH - 275) { // Has mongol reached the x coordinates where it can leap?

            // 
            // Make mongol leap off the right edge of the field of battle. Once they have completely left the field of battle, the player will take damage according to the mongols type.
            // 

            actor.leaping = 1;
            actor.collides = 0;
            actor.vx = 700;
            actor.vy = -850;
            fx_play(FX_LEAP);
          }
        }

      } else {

        // 
        // Process powerups
        // 

        if ((actor.ttl -= DT) < 0) { // Ready to expire?
          removeAtIndex(mongols, i);

          // Spawn a particle with the same imagery as the powerup, moving up and fading to invisible
          newParticle(
            .3, // ttl
            actor.x - 53, // x
            actor.y - 36, // y
            0,  // rotation
            actor.timed, // texture
            0, // speed
            1, // fades
            1, // alpha
            0, // shrinks
            1, // scale
            0, // rotationRate
            0, // gravityX
            -200 // gravityY
          );

        } else {
          if ((actor.randomness -= DT) < 0) { // Ready to flash?

            // Flash.
            actor.randomness++;
            newParticle(
              .15, // ttl
              actor.x - 42, // x
              actor.y - 36, // y
              0,  // rotation
              'powerup_flash', // texture
              0, // speed
              1, // fades
              1, // alpha
              0, // shrinks
              1, // scale
              0, // rotationRate
              0, // gravityX
              0 // gravityY
            );
          }
        }
      }
      renderList.push(actor);
    }

    mongolCount = mongols.length;

    // Check for and resolve collisions between mongols.

    for (let i = 0; i < mongolCount - 1; i++) { // Outer loop.

      actor = mongols[i];

      for (let j = i + 1; j < mongolCount; j++) { // Inner loop.

        let otherMongol = mongols[j];

        if (actor.collides && otherMongol.collides) { // Leaping mongols and leaving don't collide with anything.

          let
            dx = otherMongol.x - actor.x, // Vector between them.
            dy = otherMongol.y - actor.y,
            dist = M.sqrt(dx * dx + dy * dy); // Distance between them.

          // then check overlap
          if (actor.radius + otherMongol.radius >= dist) { // the mongols overlap.

            let
              nx = dx / dist, // Normalise the vector between mongols.
              ny = dy / dist,

              // Move mongols away from each other.
              distFromA = (dist * (actor.radius / (actor.radius + otherMongol.radius))),

              contactX = actor.x + nx * distFromA,
              contactY = actor.y + ny * distFromA;

            actor.x = contactX - nx * actor.radius; // Move this mongol so that it does not collide.
            actor.y = clamp(contactY - ny * actor.radius, 300, HEIGHT - 50); // Nasty but works to constrain mongol to field of battle.

            otherMongol.x = contactX + nx * otherMongol.radius; // Move the other mongol so that it does not collide.
            otherMongol.y = contactY + ny * otherMongol.radius;
          }
        }
      }
    }
  }
}

// Main game loop.
onEnterFrame = (t) => {
  requestAnimationFrame(onEnterFrame); // Request this function be executed on the next frame.

  // Update game timing.
  thisFrame = Date.now();
  DT = (thisFrame - lastFrame) / 1000;
  lastFrame = thisFrame;

  if (gameMode === GAME_MODE_PLAYING) {

    // 
    // Player is inside game
    // 

    // if (paused) return;
      
    let 
    actor,
    texture,
    x,
    y,
    projectile,

    // Return true if the given point is inside the given rect (with set dimensions).
    pointInRect = (point, rect) => ((point.x > rect.x - 30 && point.x < rect.x + 30 && point.y > rect.y - 80 && point.y < rect.y));

    totalGameTime += DT; // Increment total play time counter.

    MULTIPLIER = clamp(MULTIPLIER + 0.0003, 0, 2); // Scale base speed of mongols and their projectiles.
    
    if ((animCounter += DT) >= 1) { // Update the global animation counter.
      animCounter -= 1;
      fx_play(FX_DRUM); // Play drum sound every second.
    }

    // Let's play some music!!!! (random notes from C2, FIELD_OF_BATTLE, E2, and G2). The notes are set according to which type of mongol just spawned (0-3).
    if ((metronome -= DT) <= 0) { // Countdown till next random musical note plays.
      fx_play(musicalNote); // Play random musical note.
      fx_play(FX_HIHAT); // Play hihat sound ever 1/4 second.
      metronome += .25; // Reset metronome.
    }

    // Draw background.
    drawImage(getTextureRegion(MOUNTAIN_NAME), 135, 28);
    drawImage(getTextureRegion(MOUNTAIN_NAME), 890, 28);
    cloudX = cloudX + (30 * DT);
    for (let x = -(cloudX % 512); x < WIDTH; x += 512) drawImage(getTextureRegion(CLOUD_NAME), x, 75, 0, 0, 0xFFFFFF10);
    for (let x = 0; x < WIDTH; x += 512) drawImage(getTextureRegion(BACK_BUSHES_NAME), x, 124);
    drawImage(getTextureRegion(TEMPLE_NAME), 1600, 60);
    for (let x = -197; x < WIDTH; x += 512) drawImage(getTextureRegion(FRONT_BUSHES_NAME), x, 189);

    spawnPowerups(); // Spawn powerups according to their indvidual timers.

    renderList = [player]; // Reset list of actors to be drawn this frame

    // Process player movement up/down
    player.vy = 0;
    if (upHeld) player.vy = -playerSpeed;
    if (downHeld) player.vy = playerSpeed;
    player.y = clamp(player.y + (player.vy * DT), 300, HEIGHT - 25);

    // Manage player firing
    if ((playerRefireDelay -= DT) <= 0) { // Alow player to refire if counter reaches or goes below zero.
      playerRefireDelay = weaponReloadSpeed; // Set delay until next refire.

      // Calculate base bullet spawn position.
      x = player.x - 80;
      y = player.y - 50;

      playerProjectiles.push(newActor(
        ACTOR_TYPE_PROJECTILE, // type
        x, // x
        y - 6 + randomInt(0, 12), // y
        weaponBulletSpeed, // vx
        0, // vy
        0, // radius
        0, // leaping
        0, // leaving
        0, // collides
        0, // actionDelay
        0, // randomness
        0, // timed
        0, // damage
        getTextureRegion(BFG_PROJECTILE_NAME), // texture
        0, // ttl
        0, // rotation
        0, // iX
        0, // iY
        1, // scale
        1, // alpha
      ));

      newParticle(
        .5, // ttl
        x - 30, // x
        y - 30, // y
        PI2 * .5, // rotation
        SMOKE_NAME + randomInt(0, 9),// + randomInt(0, 9), // texture
        280 + randomInt(0, 70), // speed
        1, // fades
        .75, // alpha
        1, // shrinks
        1, // scale
        0, // rotationRate
        15 - random(), // gravityX
        -15 + random() // gravityY
      );

      newParticle(
        .05, // ttl
        x - 30, // x
        y - 20, // y
        random() * PI2, // rotation
        MUZZLE_PARTICLE_NAME + randomInt(0, 2),// texture
        0, // speed
        1, // fades
        1, // alpha
        0, // shrinks
        1, // scale
        0, // rotationRate
        0, // gravityX
        0 // gravityY
      );
    }

    if (isNotEmpty(playerProjectiles)) { // Check to be sure there is at least one bullet.

      for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        actor = playerProjectiles[i];

        moveActor(actor);

        if (actor.leaping) { // We use this property to determine if this projectile is a falling bomb.

          // Process bombs.

          if (actor.y >= actor.leaving) {
            removeAtIndex(playerProjectiles, i);
            spawnShrapnel(actor, 3, .25);

          } else {
            renderList.push(actor);
          }

        } else {

          // Process normal projectiles.
          (actor.timed) ? ((actor.ttl -= DT) < 0) ? removeAtIndex(playerProjectiles, i) : renderList.push(actor) : (actor.x < -64) ? removeAtIndex(playerProjectiles, i) : renderList.push(actor); // Expire timed projectiles and ones that left the field of battle, otherwise add them to the render list.
        }

        // 
        // TODO: Move mongol collision in here since its the best place for it.
        // 

      }
    }

    // 
    // Update player projectile positions and check for (and resolve) collisions between them and all mongols.
    // 

    if (isNotEmpty(mongols) && isNotEmpty(playerProjectiles)) {

      mongols.sort((a, b) => (a.x > b.x) ? 1 : -1); // Sort into ascending x order.
      playerProjectiles.sort((a, b) => (b.x > a.x) ? 1 : -1); // Sort into descending x order.

      // Kill the mongol at the given index.
      let killMongol = (i) => {
        fx_play([FX_MONGOL_DIE_1, FX_MONGOL_DIE_2, FX_MONGOL_DIE_3, FX_BOMB, FX_MONGOL_DIE_3][mongol.type]); // Play the appropriate death sound

        // Set mongol in leaving state.
        mongol.leaving = 1;
        mongol.collides = 0;
        mongol.vy = -1e3 - randomInt(200, 500);
        mongol.vx = -500 + randomInt(0, 1e3);

        if (mongol.type === ACTOR_TYPE_MONGOL_BOMB) spawnShrapnel(mongol, 3, .25); // Spawn some shrapnel that can kill other nearby mongols.

        spawnBloodShower(mongol, 9);

        // Draw a randomized blood splatter on the background.
        texture = getTextureRegion(BLOOD_NAME + randomInt(0, 9));
        fieldOfBattleContext.drawImage(TEXTURE_ATLAS, texture.x, texture.y, texture.w, texture.h, mongol.x - 20, mongol.y, texture.w * 1.5, texture.h / randomInt(2, 6));

        awardPoints([100, 250, 500, 1000, 50][mongol.type]); // Award points.

        removeAtIndex(playerProjectiles, i); // Remove projectile.
      };

      // Check collisions between the current projectile and all other mongols.
      let checkBulletVsMongols = (i) => {
        for (let j = mongols.length - 1; j >= 0; j--) {
          mongol = mongols[j];

          if (!mongol.leaping && !mongol.leaving && mongol.type != ACTOR_TYPE_POWERUP) {

            if (pointInRect(projectile, mongol)) {

              // 
              // Process mongol death.
              // 

              killMongol(i);
              return;

            }
          }
        }
      };

      // Kill any mongols inside the railgun beam.
      if (railGun) {
        for (let j = mongols.length - 1; j >= 0; j--) {
          mongol = mongols[j];
          if (!mongol.leaping && !mongol.leaving && mongol.type != ACTOR_TYPE_POWERUP) {
            if ((mongol.y - 32) > (player.y - 80) && mongol.y + 16 < player.y) killMongol(j); // Kill the mongol if it is inside the beam.
          }
        }
        railGun = 0;
      }

      if (lightningStriking) {
        if ((lightningTimer -= DT) <= 0) {
          lightningTimer += .2;
          
          let j = randomInt(0, mongols.length - 1);
          mongol = mongols[j];

          if (mongol.type != ACTOR_TYPE_POWERUP && !mongol.leaving && !mongol.leaping) {
            let x = mongol.x - 480,
            y = mongol.y - 535;
  
            // let x = (randomInt(100, WIDTH - 300)),
            // y = (randomInt(-HEIGHT + 300, -300 ));
    
            for (let i = 0; i < 3; i++) {
    
              fx_play(FX_LIGHTNING);
              newParticle(
                .5, // ttl
                x + (randomInt(0, 20)),
                y, // y
                PI2 * .25, // rotation
                'rail' + randomInt(0, 3), // texture
                0, // speed
                1, // fades
                .75, // alpha
                0, // shrinks
                1, // scale
                0, // rotationRate
                0, // gravityX
                0 // gravityY
              );
            }
            newParticle(
              .5, // ttl
              mongol.x - 45,
              mongol.y - 80, // y
              random() * PI2, // rotation
              'muzzle3', // texture
              0, // speed
              1, // fades
              2, // alpha
              0, // shrinks
              1.5, // scale
              0, // rotationRate
              0, // gravityX
              0 // gravityY
            );

            killMongol(j);
    
            if ((lightningCounter --) < 0) lightningStriking = 0;
  
          }
  



        }
      }


      // Check for and resolve collisions between player projectiles and all mongols.
      for (let i = playerProjectiles.length - 1; i >= 0; i--) {
        projectile = playerProjectiles[i];
        checkBulletVsMongols(i);
      }
    }

    updateHealthBar(playerHealth); // Visually update the health bar greenIndicator.

    if (mongolSpawnDelay > .05) mongolSpawnDelay = clamp(mongolSpawnDelay -= (DT / 10), .05, 10); // Scale mongol spawning speed.

    if ((timeBeforeNextMongolSpawns -= DT) <= 0) newMongol(); // Spawn new mongol when timer expired.

    updateMongols();

    // 
    // Queue sub-images to be rendered this frame.
    // 

    // 
    // Sort into ascending y order in a feeble attempt to maintain scene perspective.
    // 

    renderList.sort((a, b) => (a.y > b.y) ? 1 : -1); // Sort into ascending y order.

    // 
    // Process enemy projectiles.
    // 

    if (isNotEmpty(enemyProjectiles)) { // Check to be sure there is at least one bullet.

      for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        actor = enemyProjectiles[i];

        moveActor(actor);

        (actor.x > WIDTH) ? removeAtIndex(enemyProjectiles, i) : renderList.push(actor); // Remove or add to renderlist.

        if (pointInRect({ x: actor.x + actor.radius, y: actor.y + actor.leaping }, player)) { // Did the projectle touch the player?
          damagePlayer(actor.damage);
          removeAtIndex(enemyProjectiles, i);
        }
      }
    }


    updateParticles();

    
    let normal = 0xFFFFFF7F;


    for (let i = 0; i < renderList.length; i++) {
      actor = renderList[i];
      x = actor.x;
      y = actor.y;

      if (actor.type < ACTOR_TYPE_PARTICLE) {

        overlayImage = overlayImages[actor.type];

        drawImage(overlayImage.body, x + overlayImage.bodyX, y + overlayImage.bodyY, normal, (actor.leaving) ? M.PI * -.125 : 0);
        // gl2_drawRect(actor.x - 30, actor.y - 80, 60, 80, 0xFFFFFF20);

        // 
        // Draw mongols and samurai
        // 

        if (actor != player) {
          // r, x, y, w, h, rgba = 0xFFFFFF7F, rotation = 0
          drawImage(overlayImage.foot, x + overlayImage.leftFootX, (y + overlayImage.leftFootY) + getRangeValue(actor), normal, (actor.leaving) ? M.PI * .125 : 0);
          drawImage(overlayImage.foot, x + overlayImage.rightFootX, (y + overlayImage.rightFootY) - getRangeValue(actor), normal, (actor.leaving) ? M.PI * -.25 : 0);
          // gl2_drawRect(actor.x, actor.y - 1, 64, 3, 0xff00ffc0);

        } else {             

          // gl2_drawRect(0, player.y - 64, 1920, 64, 0xff00ff60);
          drawImage(overlayImage.foot, x + overlayImage.leftFootX, (y + overlayImage.leftFootY) + ((actor.vy != 0) ? getRangeValue(actor) : 0));
          drawImage(overlayImage.foot, x + overlayImage.rightFootX, (y + overlayImage.rightFootY) - ((actor.vy != 0) ? getRangeValue(actor) : 0));
        }

        drawImage(overlayImage.weapon, (x + overlayImage.weaponX) + getRangeValue(actor, 1, overlayImage.weaponX2), (y + overlayImage.weaponY) + getRangeValue(actor, .5, 5));

      } else {

        // 
        // Draw projectiles and particles
        // 

        let r = actor.texture;

        if (actor.type === ACTOR_TYPE_POWERUP) {

          gl2_drawImage(r.x, r.y, r.w, r.h, actor.x - 53, actor.y - 36, r.w, r.h);
          // gl2_drawRect(actor.x, actor.y, 107, 72, 0xFFFFFF20);

        } else {
          if (actor.rotationRate != 0) actor.rotation += actor.rotationRate;

          gl2_drawImage(r.x, r.y, r.w, r.h, actor.x + actor.iX, actor.y + actor.iY, ~~(r.w * actor.scale), ~~(r.h * actor.scale), 0xFFFFFF00 + (0x7F * actor.alpha), actor.rotation);
        }
      }
    }

  }

  gl2_drawEverything();
};
