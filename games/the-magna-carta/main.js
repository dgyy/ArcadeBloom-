const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 295;

let drawableObjects = [];

let currDo;
let curr2Do;

let gameStarted = false;
let gameEnded = false;

let score = 0;

//buttons
const text = document.getElementById('text');
const newGameBtn = document.getElementById('newGameBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const leftBtn = document.getElementById('leftBtn');
const rightBtn = document.getElementById('rightBtn');
const upBtn = document.getElementById('upBtn');
const downBtn = document.getElementById('downBtn');

const body = document.querySelector('body');
const magnaCarta = document.getElementById('magnaCarta');

let keyRight = false;
let keyLeft = false;
let keyDown = false;
let keyUp = false;

function SetGameLogic(){
    setInterval(gameLoop,1000/30);
    setInterval(() => {
        SpawnEnemy();
    }, 17000);
}

function gameLoop(){
    if(gameStarted){
    player.move();
    }
}




const player = new Player(canvas.width/2,canvas.height/2);
drawableObjects.push(player);

function Player(x,y){
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 64;
    this.facing = 'front';
    this.friction = 0.9;
    this.velocity = {
        x:0,
        y:0,
        max:3,
    }
    this.img = new Image();
    this.move = function(){

        if(!gameEnded && gameStarted){
        score++;
        }

       for(let i = 0;i<enemies.length;i++){
        if(checkIntersection(player,enemies[i])){
            playEndScene();
          enemies.splice(i,1);
          enemies.splice(0,enemies.length);
          drawableObjects = [];
        };
       }

       let borderRect = {
        x: this.x + this.velocity.x,
        y: this.y,
        width: this.width,
        height: this.height,
       }

       let verticalRect = {
        x: this.x + this.velocity.x,
        y: this.y,
        width: this.width,
        height: this.height,
       }

       if(checkIntersection(borderRect,box)){
        score += 200;
        box.x = Math.floor(Math.random() * ((canvas.width - 100) + 1));
        box.y = Math.floor(Math.random() * ((canvas.height - 100) + 1));
       }
       else if(checkIntersection(verticalRect,box)){
        score += 200;
        box.x = Math.floor(Math.random() * ((canvas.width - 100) + 1));
        box.y = Math.floor(Math.random() * ((canvas.height - 100) + 1));
       }


     Draw();

     for(let i = 0;i<enemies.length;i++){
        enemies[i].move();
     }

     if(keyRight){
        this.velocity.x += 0.5
     }
     if(keyLeft){
        this.velocity.x -= 0.5
     }
     if(keyUp){
        this.velocity.y -= 0.5
     }
     if(keyDown){
        this.velocity.y += 0.5
     }

     //friction

     if(!keyRight && !keyLeft || keyRight && keyLeft){
        this.velocity.x *= this.friction;
     }
     if(!keyUp && !keyDown || keyUp && keyDown){
        this.velocity.y *= this.friction;
     }

    if(this.x + this.velocity.x >= canvas.width - this.width){
        this.velocity.x = 0;
    }
    if(this.x + this.velocity.x <= 0){
        this.velocity.x = 0;
    }
    if(this.y + this.velocity.y <= 0){
        this.velocity.y = 0;
    }
    if(this.y + this.velocity.y >= canvas.height - this.height){
        this.velocity.y = 0;
    }

     this.x += this.velocity.x;
     this.y += this.velocity.y;
    }
    this.draw = function(){
        if(this.facing == 'front'){
     this.img.src = 'playerImg.png';
        }
        else if(this.facing == 'right'){
            this.img.src = 'playerImg4.png';
        }
        else if(this.facing == 'left'){
            this.img.src = 'playerImg3.png';
        }
        else if(this.facing == 'back'){
            this.img.src = 'playerImg2.png';
        }
     ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
}



//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================

function Draw(){
    //Disables image smoothing to keep pixel art sharp when resized.
    ctx.ImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;  
    //
    ctx.clearRect(0,0,canvas.width,canvas.height);

    if(!gameEnded){
    ctx.fillStyle = '#2F6542';
    ctx.fillRect(0,0,canvas.width,canvas.height);


    ctx.fillStyle = 'aquamarine';
    ctx.font = '40px Arial';
    ctx.fillText(`Score: ${score}`,canvas.width - 200,60,200);

    for(let i = 0;i<drawableObjects.length;i++){
        currDo = drawableObjects[i];
        if(Array.isArray(currDo)){
            for(let j = 0;j<currDo.length;j++){
                curr2Do = currDo[j];
                curr2Do.draw();
            }
        }
        else{
            currDo.draw();
        }
    }
}
else{
    player.draw();

    ctx.fillStyle = 'lightgoldenrodyellow';
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = 'black';
    ctx.font = '40px Arial';
    ctx.fillText(`Score: ${score}`,canvas.width/2 - 70,40,200);
    ctx.font = '60px Arial';
    ctx.fillText('Oh No! You Were FORCED to Sign',0,canvas.height/2 + 10,canvas.width);
    ctx.fillStyle = 'orange';
    ctx.fillText('The Magna Carta!',100,canvas.height/2 + 100,canvas.width);
    ctx.fillStyle = 'black';
    ctx.stroke();

    playAgainBtn.style.display = 'block';

    leftBtn.style.display = 'none';
    rightBtn.style.display = 'none';
    upBtn.style.display = 'none';
    downBtn.style.display = 'none';
}

}
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================
//=============================================================================================

window.addEventListener('keydown',(e)=>{
if(e.key == 'w' || e.key == 'ArrowUp' || e.key == ' '){
    keyUp = true;
    player.facing = 'back';
}
if(e.key == 's' || e.key == 'ArrowDown'){
    keyDown = true;
    player.facing = 'front';
}
if(e.key == 'd' || e.key == 'ArrowRight'){
    keyRight = true;
    player.facing = 'right';
}
if(e.key == 'a' || e.key == 'ArrowLeft'){
    keyLeft = true;
    player.facing = 'left';
}
});




window.addEventListener('keyup',(e)=>{
    if(e.key == 'w' || e.key == 'ArrowUp' || e.key == ' '){
        keyUp = false;
    }
    if(e.key == 's' || e.key == 'ArrowDown'){
        keyDown = false;
    }
    if(e.key == 'd' || e.key == 'ArrowRight'){
        keyRight = false;
    }
    if(e.key == 'a' || e.key == 'ArrowLeft'){
        keyLeft = false;
    }
    });


leftBtn.addEventListener('touchstart',()=>{
    keyLeft = true;
});

rightBtn.addEventListener('touchstart',()=>{
    keyRight = true;
});

upBtn.addEventListener('touchstart',()=>{
    keyUp = true;
});

downBtn.addEventListener('touchstart',()=>{
    keyDown = true;
});

newGameBtn.addEventListener('touchstart',()=>{




    newGameBtn.style.display = 'none';
    body.style.backgroundColor = 'darkslategray';
    text.style.display = 'none';

    canvas.style.display = 'block';
    leftBtn.style.display = 'block';
    rightBtn.style.display = 'block';
    upBtn.style.display = 'block';
    downBtn.style.display = 'block';

    blurt('You Are King John and your Barons Have Revolted!');
    setTimeout(() => {
        blurt('Collect the boxes and avoid being Forced to sign the Magna Carta!');
    }, 3000);
    setTimeout(() => {
        gameStarted = true;
    SetGameLogic();

SpawnEnemy();
box.x = Math.floor(Math.random() * ((canvas.width - 100) + 1));
box.y = Math.floor(Math.random() * ((canvas.height - 100) + 1));
console.log(box);
PlaySong();
    }, 8000);


});

playAgainBtn.onclick = function(){
    window.location = window.location;
}
playAgainBtn.addEventListener('touchstart',()=>{window.location = widnow.location;});



leftBtn.addEventListener('touchend',()=>{
    keyLeft = false;
});

rightBtn.addEventListener('touchend',()=>{
    keyRight = false;
});

upBtn.addEventListener('touchend',()=>{
    keyUp = false;
});

downBtn.addEventListener('touchend',()=>{
    keyDown = false;
});


leftBtn.addEventListener('touchcancel',()=>{
    keyLeft = false;
});

rightBtn.addEventListener('touchcancel',()=>{
    keyRight = false;
});

upBtn.addEventListener('touchcancel',()=>{
    keyUp = false;
});

downBtn.addEventListener('touchcancel',()=>{
    keyDown = false;
});



function SpawnEnemy(){
    if(!gameEnded && gameStarted){
enemies.push(new Enemy(60,0,64,64));
enemies.push(new Enemy(canvas.width - 67,0,64,64));
enemies.push(new Enemy(0,canvas.height - 69,64,64));
enemies.push(new Enemy(canvas.width - 64,canvas.height - 64,64,64));
    }
};

let enemies = [];

drawableObjects.push(enemies);

function Enemy(x,y,width,height){
this.x = x;
this.y = y;
this.width = width;
this.height = height;
this.img = new Image();
this.facing = 'right';
this.target = {
    x: undefined,
    y: undefined,
}
this.move = function(){
  this.target.x = Math.round(player.x + player.width/2);
  this.target.y = Math.round(player.y + player.height/2);

  if(this.y < this.target.y){
    this.facing = 'back';
    this.y++;
  }
  if(this.y > this.target.y){
    this.facing = 'front';
    this.y--;
  }
  if(this.x < this.target.x){
    this.facing = 'right';
    this.x++;
  }
  if(this.x > this.target.x){
    this.facing = 'left';
    this.x--;
  }
} 
this.draw = function(){
    if(this.facing == 'front'){
        this.img.src = 'enemyImg.png';
           }
           else if(this.facing == 'right'){
               this.img.src = 'enemyImg4.png';
           }
           else if(this.facing == 'left'){
               this.img.src = 'enemyImg3.png';
           }
           else if(this.facing == 'back'){
               this.img.src = 'enemyImg2.png';
           }
   ctx.drawImage(this.img,this.x,this.y,this.width,this.height);        
}
}

function checkIntersection(r1, r2){
    if(r1.x >= r2.x+r2.width){
        return false;
    }
    else if(r1.x + r1.width <= r2.x){
        return false;
    }
    else if(r1.y >= r2.y + r2.height){
        return false;
    }
    else if(r1.y + r1.height <= r2.y){
        return false;
    }

else{
    return true;
}



}

newGameBtn.onclick = function(){

    newGameBtn.style.display = 'none';
    body.style.backgroundColor = 'darkslategray';
    text.style.display = 'none';

    canvas.style.display = 'block';
    leftBtn.style.display = 'block';
    rightBtn.style.display = 'block';
    upBtn.style.display = 'block';
    downBtn.style.display = 'block';

    blurt('You Are King John and your Barons Have Revolted!');
    setTimeout(() => {
        blurt('Collect the boxes and avoid being Forced to sign the Magna Carta!');
    }, 3000);
    setTimeout(() => {
        gameStarted = true;
    SetGameLogic();

    SpawnEnemy();

    box.x = Math.floor(Math.random() * ((canvas.width - 100) + 1));
    box.y = Math.floor(Math.random() * ((canvas.height - 100) + 1));
    console.log(box,drawableObjects[2]);
    PlaySong();
        }, 8000);



}














//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================


//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================


//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================


//=================================================================
//=================================================================
//=====//=============================================================================================================================
//=================================================================
//=================================================================
//=====//=============================================================================================================================

//music






var CPlayer = function() {

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    // Oscillators
    var osc_sin = function (value) {
        return Math.sin(value * 6.283184);
    };

    var osc_saw = function (value) {
        return 2 * (value % 1) - 1;
    };

    var osc_square = function (value) {
        return (value % 1) < 0.5 ? 1 : -1;
    };

    var osc_tri = function (value) {
        var v2 = (value % 1) * 4;
        if(v2 < 2) return v2 - 1;
        return 3 - v2;
    };

    var getnotefreq = function (n) {
        // 174.61.. / 44100 = 0.003959503758 (F3)
        return 0.003959503758 * (2 ** ((n - 128) / 12));
    };

    var createNote = function (instr, n, rowLen) {
        var osc1 = mOscillators[instr.i[0]],
            o1vol = instr.i[1] + 200,
            o1xenv = instr.i[3]/32,
            osc2 = mOscillators[instr.i[4]],
            o2vol = instr.i[5] + 200,
            o2xenv = instr.i[8]/32,
            noiseVol = instr.i[9],
            attack = instr.i[10] * instr.i[10] * 4,
            sustain = instr.i[11] * instr.i[11] * 4,
            release = instr.i[12] * instr.i[12] * 4,
            releaseInv = 1 / release,
            expDecay = -instr.i[13]/16,
            arp = instr.i[14],
            arpInterval = rowLen * (2 **(2 - instr.i[15]));

        var noteBuf = new Int32Array(attack + sustain + release);

        // Re-trig oscillators
        var c1 = 0, c2 = 0;

        // Local variables.
        var j, j2, e, t, rsample, o1t, o2t;

        // Generate one note (attack + sustain + release)
        for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
            if (j2 >= 0) {
                // Switch arpeggio note.
                arp = (arp >> 8) | ((arp & 255) << 4);
                j2 -= arpInterval;

                // Calculate note frequencies for the oscillators
                o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
                o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
            }

            // Envelope
            e = 1;
            if (j < attack) {
                e = j / attack;
            } else if (j >= attack + sustain) {
                e = (j - attack - sustain) * releaseInv;
                e = (1 - e) * (3 ** (expDecay * e));
            }

            // Oscillator 1
            c1 += o1t * e ** o1xenv;
            rsample = osc1(c1) * o1vol;

            // Oscillator 2
            c2 += o2t * e ** o2xenv;
            rsample += osc2(c2) * o2vol;

            // Noise oscillator
            if (noiseVol) {
                rsample += (2 * Math.random() - 1) * noiseVol;
            }

            // Add to (mono) channel buffer
            noteBuf[j] = (80 * rsample * e) | 0;
        }

        return noteBuf;
    };


    //--------------------------------------------------------------------------
    // Private members
    //--------------------------------------------------------------------------

    // Array of oscillator functions
    var mOscillators = [
        osc_sin,
        osc_square,
        osc_saw,
        osc_tri
    ];

    // Private variables set up by init()
    var mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;


    //--------------------------------------------------------------------------
    // Initialization
    //--------------------------------------------------------------------------

    this.init = function (song) {
        // Define the song
        mSong = song;

        // Init iteration state variables
        mLastRow = song.endPattern;
        mCurrentCol = 0;

        // Prepare song info
        mNumWords =  song.rowLen * song.patternLen * (mLastRow + 1) * 2;

        // Create work buffer (initially cleared)
        mMixBuf = new Int32Array(mNumWords);
    };


    //--------------------------------------------------------------------------
    // Public methods
    //--------------------------------------------------------------------------

    // Generate audio data for a single track
    this.generate = function () {
        // Local variables
        var i, j, b, p, row, col, n, cp,
            k, t, lfor, e, x, rsample, rowStartSample, f, da;

        // Put performance critical items in local variables
        var chnBuf = new Int32Array(mNumWords),
            instr = mSong.songData[mCurrentCol],
            rowLen = mSong.rowLen,
            patternLen = mSong.patternLen;

        // Clear effect state
        var low = 0, band = 0, high;
        var lsample, filterActive = false;

        // Clear note cache.
        var noteCache = [];

         // Patterns
         for (p = 0; p <= mLastRow; ++p) {
            cp = instr.p[p];

            // Pattern rows
            for (row = 0; row < patternLen; ++row) {
                // Execute effect command.
                var cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
                if (cmdNo) {
                    instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

                    // Clear the note cache since the instrument has changed.
                    if (cmdNo < 17) {
                        noteCache = [];
                    }
                }

                // Put performance critical instrument properties in local variables
                var oscLFO = mOscillators[instr.i[16]],
                    lfoAmt = instr.i[17] / 512,
                    lfoFreq = (2 ** (instr.i[18] - 9)) / rowLen,
                    fxLFO = instr.i[19],
                    fxFilter = instr.i[20],
                    fxFreq = instr.i[21] * 43.23529 * 3.141592 / 44100,
                    q = 1 - instr.i[22] / 255,
                    dist = instr.i[23] * 1e-5,
                    drive = instr.i[24] / 32,
                    panAmt = instr.i[25] / 512,
                    panFreq = 6.283184 * (2 ** (instr.i[26] - 9)) / rowLen,
                    dlyAmt = instr.i[27] / 255,
                    dly = instr.i[28] * rowLen & ~1;  // Must be an even number

                // Calculate start sample number for this row in the pattern
                rowStartSample = (p * patternLen + row) * rowLen;

                // Generate notes for this pattern row
                for (col = 0; col < 4; ++col) {
                    n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
                    if (n) {
                        if (!noteCache[n]) {
                            noteCache[n] = createNote(instr, n, rowLen);
                        }

                        // Copy note from the note cache
                        var noteBuf = noteCache[n];
                        for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                          chnBuf[i] += noteBuf[j];
                        }
                    }
                }

                // Perform effects for this pattern row
                for (j = 0; j < rowLen; j++) {
                    // Dry mono-sample
                    k = (rowStartSample + j) * 2;
                    rsample = chnBuf[k];

                    // We only do effects if we have some sound input
                    if (rsample || filterActive) {
                        // State variable filter
                        f = fxFreq;
                        if (fxLFO) {
                            f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
                        }
                        f = 1.5 * Math.sin(f);
                        low += f * band;
                        high = q * (rsample - band) - low;
                        band += f * high;
                        rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

                        // Distortion
                        if (dist) {
                            rsample *= dist;
                            rsample = rsample < 1 ? rsample > -1 ? osc_sin(rsample*.25) : -1 : 1;
                            rsample /= dist;
                        }

                        // Drive
                        rsample *= drive;

                        // Is the filter active (i.e. still audiable)?
                        filterActive = rsample * rsample > 1e-5;

                        // Panning
                        t = Math.sin(panFreq * k) * panAmt + 0.5;
                        lsample = rsample * (1 - t);
                        rsample *= t;
                    } else {
                        lsample = 0;
                    }

                    // Delay is always done, since it does not need sound input
                    if (k >= dly) {
                        // Left channel = left + right[-p] * t
                        lsample += chnBuf[k-dly+1] * dlyAmt;

                        // Right channel = right + left[-p] * t
                        rsample += chnBuf[k-dly] * dlyAmt;
                    }

                    // Store in stereo channel buffer (needed for the delay effect)
                    chnBuf[k] = lsample | 0;
                    chnBuf[k+1] = rsample | 0;

                    // ...and add to stereo mix buffer
                    mMixBuf[k] += lsample | 0;
                    mMixBuf[k+1] += rsample | 0;
                }
            }
        }

        // Next iteration. Return progress (1.0 == done!).
        mCurrentCol++;
        return mCurrentCol / mSong.numChannels;
    };

    // Create a AudioBuffer from the generated audio data
    this.createAudioBuffer = function(context) {
        var buffer = context.createBuffer(2, mNumWords / 2, 44100);
        for (var i = 0; i < 2; i ++) {
            var data = buffer.getChannelData(i);
            for (var j = i; j < mNumWords; j += 2) {
                data[j >> 1] = mMixBuf[j] / 65536;
            }
        }
        return buffer;
    };
    
    // Create a WAVE formatted Uint8Array from the generated audio data
    this.createWave = function() {
        // Create WAVE header
        var headerLen = 44;
        var l1 = headerLen + mNumWords * 2 - 8;
        var l2 = l1 - 36;
        var wave = new Uint8Array(headerLen + mNumWords * 2);
        wave.set(
            [82,73,70,70,
             l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
             87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
             68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
             l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255]
        );

        // Append actual wave data
        for (var i = 0, idx = headerLen; i < mNumWords; ++i) {
            // Note: We clamp here
            var y = mMixBuf[i];
            y = y < -32767 ? -32767 : (y > 32767 ? 32767 : y);
            wave[idx++] = y & 255;
            wave[idx++] = (y >> 8) & 255;
        }

        // Return the WAVE formatted typed array
        return wave;
    };

    // Get n samples of wave data at time t [s]. Wave data in range [-2,2].
    this.getData = function(t, n) {
        var i = 2 * Math.floor(t * 44100);
        var d = new Array(n);
        for (var j = 0; j < 2*n; j += 1) {
            var k = i + j;
            d[j] = t > 0 && k < mMixBuf.length ? mMixBuf[k] / 32768 : 0;
        }
        return d;
    };
};










function PlaySong(){
    songLoopStarted = true;
    var song = {
        songData: [
          { // Instrument 0
            i: [
            2, // OSC1_WAVEFORM
            255, // OSC1_VOL
            128, // OSC1_SEMI
            0, // OSC1_XENV
            3, // OSC2_WAVEFORM
            255, // OSC2_VOL
            128, // OSC2_SEMI
            0, // OSC2_DETUNE
            0, // OSC2_XENV
            0, // NOISE_VOL
            5, // ENV_ATTACK
            6, // ENV_SUSTAIN
            58, // ENV_RELEASE
            0, // ENV_EXP_DECAY
            0, // ARP_CHORD
            0, // ARP_SPEED
            0, // LFO_WAVEFORM
            195, // LFO_AMT
            6, // LFO_FREQ
            1, // LFO_FX_FREQ
            2, // FX_FILTER
            135, // FX_FREQ
            0, // FX_RESONANCE
            0, // FX_DIST
            32, // FX_DRIVE
            147, // FX_PAN_AMT
            6, // FX_PAN_FREQ
            121, // FX_DELAY_AMT
            6 // FX_DELAY_TIME
            ],
            // Patterns
            p: [1],
            // Columns
            c: [
              {n: [114,114,114,114,114,114,114,114,114,112,112,114,112,114,112,115,127,127,127,127,127,127,112,127,127,117,117,117,117,127,127,127],
               f: []}
            ]
          },
        ],
        rowLen: 5513,   // In sample lengths
        patternLen: 32,  // Rows per pattern
        endPattern: 0,  // End pattern
        numChannels: 1  // Number of channels
      };
  //----------------------------------------------------------------------------
  // Demo program section
  //----------------------------------------------------------------------------

  // Initialize music generation (player).
  var t0 = new Date();
  var player1 = new CPlayer();
  player1.init(song);

  // Generate music...
  var done = false;
  setInterval(function () {
      
    if(done){
        return
    }

   // var s = document.getElementById("status");
    //s.textContent = s.textContent + ".";

    done = player1.generate() >= 1;

    //if (done) {
      //var t1 = new Date();
     // s.textContent = s.textContent + "done (" + (t1 - t0) + "ms)";

      // Put the generated song in an Audio element.
      var wave = player1.createWave();
      audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      audio.play();

  //  }
})
}

var audio = document.createElement("audio");

audio.addEventListener('ended',()=>{
    if(!gameEnded && gameStarted){
    PlaySong();
    }
})


function playEndScene(){
    gameEnded = true;
    audio.pause();
    
}

let box = new Box(canvas.width * 10,100,50,50);

drawableObjects.push(box);

function Box(x,y,width,height){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = new Image();
    this.draw = function(){
     this.img.src = 'boxImg.png';
     ctx.drawImage(this.img,this.x,this.y,this.width,this.height);
    }
}



window.addEventListener('click',(e)=>{
    let mouseX = e.x - canvas.getBoundingClientRect().x;
    let mouseY = e.y - canvas.getBoundingClientRect().y;
    if(!gameStarted || gameEnded){
        SpawnMagnaCarta(e);
    }
    else{
            if(RegisterClick(mouseX,mouseY,box)){
                score += 200;
                box.x = Math.floor(Math.random() * ((canvas.width - 100) + 1));
                box.y = Math.floor(Math.random() * ((canvas.height - 100) + 1));
            }
    }
});

window.addEventListener('touchstart',(e)=>{
    let mouseX = e.x - canvas.getBoundingClientRect().x;
    let mouseY = e.y - canvas.getBoundingClientRect().y;
    if(!gameStarted || gameEnded){
        SpawnMagnaCarta(e);
    }
    else{
        if(RegisterClick(mouseX,mouseY,box)){
            score += 200;
            box.x = Math.floor(Math.random() * ((canvas.width - 100) + 1));
            box.y = Math.floor(Math.random() * ((canvas.height - 100) + 1));
        }
}
});



function SpawnMagnaCarta(e){

    magnaCarta.style.top = `${e.y - 40}px`;
    magnaCarta.style.left = `${e.x - 40}px`;
    magnaCarta.style.display = 'block';
    magnaCarta.style.width = '20px';
    magnaCarta.style.height = '20px';
    setTimeout(() => {
      magnaCarta.style.width = '40px';
    magnaCarta.style.height = '40px';
    }, 100);
    setTimeout(() => {
      magnaCarta.style.width = '60px';
    magnaCarta.style.height = '60px';
    }, 200);
    setTimeout(() => {
      magnaCarta.style.width = '80px';
    magnaCarta.style.height = '80px';
    }, 300);
    setTimeout(() => {
      magnaCarta.style.width = '90px';
    magnaCarta.style.height = '90px';
    }, 400);
    setTimeout(() => {
      magnaCarta.style.width = '100px';
    magnaCarta.style.height = '100px';
    }, 500);
    setTimeout(() => {
      magnaCarta.style.display = 'none';
    }, 1000);
}


function RegisterClick(x,y,obj){
    if(Math.round(x) > Math.round(obj.x) && Math.round(x) < Math.round(obj.x) + obj.width){
        if(Math.round(y) > Math.round(obj.y) && Math.round(y) < Math.round(obj.y) + obj.height){
            return true;
        }
    }
    else{
        return false;
    }
}