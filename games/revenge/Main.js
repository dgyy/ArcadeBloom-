// import Armor from "./Armor.js";
// import Game from "./Game.js";
// import PlayerMainAttribute from "./PlayerMainAttribute.js";
// import RandomEnemyGenerator from "./RandomEnemyGenerator.js";
// import Shield from "./Shield.js";
// import Sprite from "./Sprite.js";
// import Sword from "./Sword.js";
// import Weapon from "./Weapon.js";
// import { Random, Vector2 } from "./mMath.js";

//Play the music
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
            o1vol = instr.i[1],
            o1xenv = instr.i[3]/32,
            osc2 = mOscillators[instr.i[4]],
            o2vol = instr.i[5],
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

class MainAttribute
{
    constructor()
    {
        this.velocity=Random(120, 100);
        this.strength=Random(699, 312);

        this.leftArmSpeed=Random(0.02, 0.01);
        this.rightArmSpeed=Random(0.02, 0.01);
        this.walkAnimationSpeed=Random(0.02, 0.01);
        
        this.SelectedArmor=[new Armor(0,0,'Head'), new Armor(0,0,'LeftArm1'), new Armor(0,0,'LeftArm2'), new Armor(0,0, 'RightArm1'), new Armor(0,0,'RightArm2'), new Armor(0,0,'Body'), new Armor(0,0, 'LeftLeg'), new Armor(0,0, 'RightLeg')];
        this.SelectedWeapons=[new Sword(100,100,10), new Shield(100,75,0)];
    }
};

function dot(x1, y1, x2, y2)
{
    return x1*x2+y1*y2;
}

class Vector2
{
    constructor(x, y)
    {
        this.x=x;
        this.y=y;
    }

    Normalize()
    {
        var Length=this.Length;
        this.x=this.x/Length;
        this.y=this.y/Length;
    }


    get Length()
    {
        return Math.sqrt(this.x*this.x+this.y*this.y);
    }
    
} 

var RightVector=new Vector2(0,1);

function Random(m, n)
{
    return Math.random()*(m-n)+n;
}

function Lerp(l1, l2, w)
{
    return new Vector2(l1.x+w*(l2.x-l1.x), l1.y+w*(l2.y-l1.y));
}

function Rotate(l, angle)
{
    return new Vector2(l.x*Math.cos(angle)-l.y*Math.sin(angle), l.x*Math.sin(angle)+l.y*Math.cos(angle));   
}

function rotatePoint(ptSrc,ptRotationCenter,angle){
  var a = ptRotationCenter.x
  var b = ptRotationCenter.y
  var x0 = ptSrc.x
  var y0 = ptSrc.y
  var rx = a + (x0-a) * Math.cos(angle) - (y0-b) * Math.sin(angle);
  var ry = b + (x0-a) * Math.sin(angle) + (y0-b) * Math.cos(angle);

  return new Vector2(rx, ry);
}


class AIController
{
    constructor(InputManager, sprite)
    {
        this.sprite=sprite;
        
        this.keysDown={};
        this.mousex=0;
        this.mousey=0;
        this.leftbutton=false;
        this.rightbutton=false;

        this.InputManager=InputManager;


        this.waitTimeCount=0;
        
        
        this.isjump=1;
    }

    Update(PlayerLocation)
    {
        this.PlayerLocation=PlayerLocation;

        var ActionIndex= Math.floor(Math.random() * 15) + 1;

        this.waitTimeCount+=1;

        if(this.waitTimeCount>10)
        {
            this.waitTimeCount=0;

        switch (ActionIndex) {
            case 1:
                this.LeftAttack();
                break;

            case 2:
                this.LefRelease();
                break;

            case 3:
                this.LeftWave();
                break;

            case 4:
                this.RightAttack();
                break;

            case 5:
                this.RightRelease();
                break;

            case 6:
                this.RightWave();
                break;

            case 7:
                this.Jump();
                break;

            case 8:
                this.JumpStop();
                break;

            case 9:
                this.MoveTo();
                break;

            case 10:
                this.MoveStop();
                break;
        
            default:
                break;
        }
        }
        else
            return;
            
    }

    LeftAttack()
    {
        this.mousex=this.PlayerLocation.x;
        this.mousey=this.PlayerLocation.y;
        this.mousey+=79*(Math.random()*(1+1)-1);
        this.leftbutton=true;
    }

    LefRelease()
    {
        this.leftbutton=false;
    }

    LeftWave()
    {
        this.mousey+=455*Math.random();
    }

    RightWave()
    {
        this.mousey+=455*Math.random();
    }

    RightAttack()
    {
        this.mousex=this.PlayerLocation.x;
        this.mousey=this.PlayerLocation.y;
        this.mousey+=79*(Math.random()*(1+1)-1);
        this.rightbutton=true;
    }

    RightRelease()
    {
        this.rightbutton=false;
    }

    MoveTo()
    {
        this.mousex=this.PlayerLocation.x;
        this.mousey=this.PlayerLocation.y;
        
        if(this.mousex<this.sprite.location.x)
            this.keysDown['a']=true;
        else
            this.keysDown['d']=true;
    }

    MoveStop()
    {
        this.keysDown['a']=false;
        this.keysDown['d']=false;
    }

    Jump()
    {
        this.keysDown['w']=true;    
           
    }

    JumpStop()
    {
        this.keysDown['w']=false;
    }
}


class Animation
{
    constructor(rate, from, to) //0.01 to 1
    {
        this.isPlay=0;//0 for already stopped, 1 for do the animation, 2 for do the back animation
        this.count=0;
        this.rate=rate;
        this.from=from;
        this.to=to;
    }

    Play()
    {   
        if(this.Loop&&this.isPlay==2)
            this.isPlay=2;
        else
            this.isPlay=1;
    }

    SetLoop()
    {
        this.Loop=1;
    }

    StopPlay()
    {
        this.isPlay=0;
        this.count=0;
    }

    BackPlay()
    {
        this.isPlay=2;
    }

    Update()// return the certain location of vertices
    {
        
        if(this.isPlay==1)
        {
            this.count+=this.rate;
            if(this.count>=1)
            {
                this.count=1;
                if(this.Loop)
                {
                    this.isPlay=2;
                    console.log("shiteater");
                }
            }
    
            return [Lerp(this.from[0], this.to[0], this.count), Lerp(this.from[1], this.to[1], this.count)];
        }
        else
            if(this.isPlay==2)
            {
                    console.log("Locve");
                this.count-=this.rate;
                if(this.count<=0)
                {
                    this.isPlay=0;
                    this.count=0;

                    if(this.Loop)
                    {
                        this.isPlay=1;
                    }
                }

                return  [Lerp(this.to[0], this.from[0], 1-this.count), Lerp(this.to[1], this.from[1], 1-this.count)];
            }
        
    }
}

var StandBy=[new Vector2(0,0), new Vector2(35, 20), new Vector2(64, -15), new Vector2(20, 30), new Vector2(45, 0), new Vector2(0, 47), new Vector2(-29, 93), new Vector2(29, 93)];

var RightAttack=[new Vector2(45, 0), new Vector2(73, 0)];

var LeftAttack=[new Vector2(45, 0), new Vector2(79, 0)];

// export var RightAttackBack=[new Vector2(-45, 0), new Vector2(-73, 0)];

// export var LeftAttackBack=[new Vector2(-45, 0), new Vector2(-79, 0)];

// export var StandByBack=[new Vector2(-35, 20), new Vector2(-64, -15), new Vector2(-20, 30), new Vector2(-45, 0)];

var move=[new Vector2(0,93),new Vector2(0,93)];

function combine(r, l, m)
{
    return [StandBy[0],...r,...l,StandBy[5],...m];
}

class AnimationComponent
{
    constructor(r1, r2, r3)//will be a dictionary
    {
        this.animations=[new Animation(r1, [StandBy[3],StandBy[4]], LeftAttack),new Animation(r2, [StandBy[1],StandBy[2]], RightAttack),new Animation(r3, [StandBy[6],StandBy[7]],move)];//, new Animation(r1, [StandByBack[0], StandByBack[1]], LeftAttackBack), new Animation(r2, [StandByBack[2], StandByBack[3]], RightAttackBack)];
    }

    Play(index)
    {
        this.animations[index].Play();
    }

    StopPlay(index)
    {
        this.animations[index].StopPlay();
    }

    BackPlay(index)
    {
        this.animations[index].BackPlay();
    }

    LoopPlay(index)
    {
        this.animations[index].SetLoop();
    }
    
    Update()
    {
        var array=[[new Vector2(StandBy[3].x,StandBy[3].y),new Vector2(StandBy[4].x,StandBy[4].y)],[new Vector2(StandBy[1].x,StandBy[1].y), new Vector2(StandBy[2].x, StandBy[2].y)],[new Vector2(StandBy[6].x,StandBy[6].y),new Vector2(StandBy[7].x,StandBy[7].y)]];
        
        for(var iter=0;iter<3;iter++)
        {
            // var i=iter;
            // if(iter>2)
            //     i-=3;
            if(this.animations[iter].isPlay!=0)
            {
                array[iter]=this.animations[iter].Update();
            }
        }

        return combine(array[0], array[1], array[2]);
    }
    
    
}

class Armor
{
    constructor(weight, protectiveLevel, type)
    {
        this.weight=weight;
        this.protectiveLevel=protectiveLevel;

        this.color='#101010';//TODO: According to the protectiveLevel
        
        this.type=type;

        this.category='Armor';
        
    }

    Draw(context, bodyVerticeArray, direction, Location)
    {
        var d=-1;
        if(!direction)
            d=1;

        function DrawTriangle(from, to)
        {
            var width=5;
            var pointing=new Vector2(bodyVerticeArray[to].x-bodyVerticeArray[from].x,bodyVerticeArray[to].y-bodyVerticeArray[from].y);
            var d=dot(pointing.x, pointing.y, RightVector.x, RightVector.y);
            var angle=Math.asin(d/(pointing.Length*RightVector.Length));
            
            
            context.save();
            
            context.translate(Location.x+bodyVerticeArray[from].x, Location.y+bodyVerticeArray[from].y);


            //console.log(RightVector.x);

            //console.log(angle);

            
              if(pointing.x<RightVector.x)
                      angle=Math.PI-angle;

            //console.log(angle);

            
            context.rotate(angle);

            context.fillRect(0, -width+width/2, pointing.Length, width);

            context.stroke();

            context.restore();
            
            }

            context.fillStyle=this.color;
        
        switch(this.type)
        {
            case 'Head':
                var height=17;
                var width=100;
                var crest=bodyVerticeArray[0].y+100;

                context.beginPath();
                context.fillRect(Location.x+bodyVerticeArray[0].x-width/2, Location.y-crest, width, height);
                context.stroke();


                var offset=0;

                if(direction==-1)
                    offset=-width/6;
                context.beginPath();
                context.fillRect((Location.x+direction*(bodyVerticeArray[0].x-width/2)+offset), Location.y-crest, height, width);
                context.stroke();
                break;


            
            case 'Body':
                var width=10;
                context.beginPath();
                context.fillRect(Location.x+bodyVerticeArray[0].x-width,Location.y+bodyVerticeArray[0].y,bodyVerticeArray[5].x+2*width, bodyVerticeArray[5].y);
                context.stroke();
                break;

            case 'LeftArm1':
                DrawTriangle(0,1);
                break;

            case 'LeftArm2':
                DrawTriangle(1,2);
                break;
                
            case 'RightArm1':
                DrawTriangle(0,3);
                break;
            case 'RightArm2':
                DrawTriangle(3,4);
                break;

            case 'LeftLeg':
                DrawTriangle(5,6);
                break;

            case 'RightLeg':
                DrawTriangle(5,7);
                break;

            case 'LeftFeet':

            case 'RightFeet':
        }
    }
}

class ArmorComponent
{
    constructor(Armors) {
        this.Armors=Armors;
    }//Amors will be a dictionary such as head: armorItem

    Draw(context,bodyVerticeArray, direction, Location)
    {
        if(this.Armors)
        {
            for(var x of this.Armors)
            {
                if(x)
                    if(x.weight&&x.weight!=0)
                        x.Draw(context, bodyVerticeArray, direction, Location);
            }
        }
    }
}

class BackPack
{
    constructor()
    {
        this.backpack=[];
    }
}

class PlayerMainAttribute extends MainAttribute
{
    constructor()
    {
        super();
        
        this.money=10;
        this.backpack=new BackPack();

       
    }
}

class Collider
{
    constructor(l1, l2, type)
    {
        this.start=l1;
        this.end=l2;
        this.type=type;
    }
}

function CheckIsCollide(c1, c2)
{
    if(c2.type==1)//square
    {
        return lineRect(c1.start, c1.end, c2.start, c2.end);
    }
    else
    {
        return lineLine(c1.start, c1.end, c2.start, c2.end);
    }
}

function lineLine ( a1, a2, b1, b2 ) {
    // b1->b2向量 与 a1->b1向量的向量积
    var ua_t = (b2.x - b1.x) * (a1.y - b1.y) - (b2.y - b1.y) * (a1.x - b1.x);
    // a1->a2向量 与 a1->b1向量的向量积
    var ub_t = (a2.x - a1.x) * (a1.y - b1.y) - (a2.y - a1.y) * (a1.x - b1.x);
    // a1->a2向量 与 b1->b2向量的向量积
    var u_b  = (b2.y - b1.y) * (a2.x - a1.x) - (b2.x - b1.x) * (a2.y - a1.y);
    // u_b == 0时，角度为0或者180 平行或者共线不属于相交
    if ( u_b !== 0 ) {
        var ua = ua_t / u_b;
        var ub = ub_t / u_b;

        if ( 0 <= ua && ua <= 1 && 0 <= ub && ub <= 1 ) {
            return true;
        }
    }

    return false;
}

function lineRect ( a1, a2, b1, b2 ) {

    var r0=b1;
    var r1=new Vector2(b2.x, b1.y);
    var r2=new Vector2(b1.x, b2.y);
    var r3=b2;
    
    if ( lineLine( a1, a2, r0, r1 ) )
        return true;
    if ( lineLine( a1, a2, r1, r2 ) )
        return true;
    if ( lineLine( a1, a2, r2, r3 ) )
        return true;
    if ( lineLine( a1, a2, r3, r0 ) )
        return true;
    return false;
}


class Weapon
{
    constructor(weight, length, Attack)
    {
        this.weight=weight;
        this.length=length;

        //this.Attack=Math.random()*weight*length*0.5;

        this.Attack=Attack;

        this.Start=new Vector2(0,0);
        this.End=new Vector2(0,0);

        this.category='Weapon';
    }
}


class InputManager
{
    constructor()
    {

        let self=this;

        this.keysDown={};

        addEventListener("keydown", function(e){
            self.keysDown[e.key]=true;
        }, false);

        addEventListener('keyup', function(e){
            self.keysDown[e.key]=false;
        }, false);

        addEventListener('mousemove', function(e){
            self.mousex=e.offsetX;
            self.mousey=e.offsetY;
        }, false);

        addEventListener('mouseup', function(e){
            if(e.button==0)
                self.leftbutton=false;
            else
                self.rightbutton=false;
        }, false);

        addEventListener('mousedown', function(e)
        {
            if(e.button==0)
            {
                 self.leftbutton=true;
                console.log('Lily');
            }
            else
            {
                self.rightbutton=true;
                console.log("Elaine");
            }
        }, false);
    }
}




function DrawHead(context, x, y, d, index)// location is the middle of the head,
    //direction 0 for left 1 for right
{
    //direction=1;

    context.beginPath();
    //context.moveTo(x, y);
    context.arc(x, y, 50, 0, Math.PI * 2, true); // 绘制

    if(index)
        context.fillStyle='#F0E68C';
    else
        context.fillStyle="#907080";
    
    context.fill();

    context.stroke();
    
    var MouseOffset=44;

    var EyeOffset=30;
    var EyeOffsetx=6;
    if(d==-1)
    {
        MouseOffset*=-1;
        EyeOffset*=-1;
        EyeOffsetx*=-1;
    }

    context.beginPath();
    //ontext.moveTo(x+6, y-10);
    context.ellipse(x+EyeOffsetx, y-10, 10, 15, 0, 0, 2*Math.PI, true);
    context.fillStyle="#A9A9A9";
    context.fill();
    context.stroke();
    //context.fillStyle="#0000";
    //context.fill();
    //context.moveTo(x+EyeOffset, y-10);
    //context.ellipse(x+EyeOffset, y-10, 7, 14, 0, 0, 2*Math.PI, true);

    context.beginPath();
    context.ellipse(x+EyeOffset, y-10, 8, 12, 0, 0, 2*Math.PI, true);
    context.fillStyle="#A9A9A9";
    context.fill();
    context.stroke();

    context.beginPath();
    //ontext.moveTo(x+6, y-10);
    context.ellipse(x+EyeOffsetx*1.5, y-10, 5, 7.5, 0, 0, 2*Math.PI, true);
    context.fillStyle="#000000";
    context.fill();
    context.stroke();

    
    context.beginPath();
    context.ellipse(x+EyeOffset*1.1, y-10, 4, 6, 0, 0, 2*Math.PI, true);
    context.fillStyle="	#000000";
    context.fill();
    context.stroke();
    
    
    var MouseDownOffset=23;

    context.moveTo(x, y+MouseDownOffset);
    context.lineTo(x+MouseOffset, y+MouseDownOffset);
    
    context.stroke();

    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(x,y);
}

function DrawBody(context, nbv, Location)
{
    var x=Location.x;
    var y=Location.y;

    context.beginPath();
    context.moveTo(nbv[0].x+x, nbv[0].y+y);
    context.lineTo(nbv[1].x+x, nbv[1].y+y);
    context.lineTo(nbv[2].x+x, nbv[2].y+y);
    context.stroke();

    context.beginPath();
    context.moveTo(nbv[0].x+x, nbv[0].y+y);
    context.lineTo(nbv[3].x+x, nbv[3].y+y);
    context.lineTo(nbv[4].x+x, nbv[4].y+y);
    context.stroke();

    context.beginPath();
    context.moveTo(nbv[0].x+x, nbv[0].y+y);
    context.lineTo(nbv[5].x+x, nbv[5].y+y);
    context.stroke();
    
    context.beginPath();
    context.moveTo(nbv[5].x+x, nbv[5].y+y);
    context.lineTo(nbv[6].x+x, nbv[6].y+y);
    context.moveTo(nbv[5].x+x, nbv[5].y+y);
    context.lineTo(nbv[7].x+x, nbv[7].y+y);
    context.stroke(); 
}

class PlayerState
{
    constructor(owner)
    {
        //red, yellow, green
        //head, LeftArm1, LeftArm2, RightArm1, RightArm2, body, LeftLeg, RightLeg
        this.Health=[100, 100, 100,100, 100, 100, 100, 100];

        this.isAttacked=[[], [], [],[],[],[],[],[]];

        this.owner=owner;

        this.isScalttered=true;

        //stomach*50%+rest*50% 75 30
    }

    Update()
    {
        var allHealth=this.Health[0]*0.3+this.Health[1]*0.05+this.Health[2]*0.05+this.Health[3]*0.05 +this.Health[4]*0.05 +this.Health[5]*0.3+this.Health[6]*0.1+this.Health[7]*0.1;
        if(allHealth<=30&&this.isScalttered)
        {
            this.owner.components['AnimationComponent'].animations[0].rate*=0.5;
            this.owner.components['AnimationComponent'].animations[1].rate*=0.5;

            this.isScalttered=false;

           //console.log("shiteater");
        }
        
        

        if(this.Health[0]<=0||this.Health[5]<=0)
            this.owner.game.Stop(this.owner.index);

        //if legs health below 30 in average will reduce the speed of movement and the rate of jump
        if((this.Health[6]+this.Health[7])/2<=30)
            this.owner.components['MovementComponent'].rate=0.5;
    }

    TakeDamage(part, amount, from)
    {
        if(from in this.isAttacked[part])
            return;

        this.isAttacked[part].push(from);
        
        var armor=this.owner.components['ArmorComponent'].Armors[part];
        if(armor)
            this.Health[part]-=amount*(1-armor.protectiveLevel);
    }

    //remove the tag of being attacked
    RemoveAttack(part, from)
    {
        var index = this.isAttacked[part].indexOf(from);
        if(index>-1){//大于0 代表存在，
        this.isAttacked[part].splice(index,1);//存在就删除
    }
            
    }
}

class MovementComponent
{
    //gravity
    
    
    constructor(velocity, floor, owner)
    {
        this.floor=floor;
        this.velocity=velocity;
        this.rate=1;//hurt will reduce the rate for movement
        this.upwardspeed=250;
        this.isJumped=false;
        this.owner=owner;
    }

    Update(InputManager, location, deltatime)
    {
        var x=location.x;
        var y=location.y;

        location.y+=1;
        
        var direction=0;
        
        if(InputManager.keysDown['a'])
            direction=-1;
        if(InputManager.keysDown['d'])
            direction=1;
        if(InputManager.keysDown['w']&&!this.isJumped)
        {
            this.isJumped=true;
        }

        x+=direction*this.velocity*this.rate*deltatime;

        y+=1*deltatime;

        if(this.isJumped)
        {
            y-=this.upwardspeed*deltatime*this.rate;
            this.upwardspeed-=300*deltatime;
        }

        if(y>=this.floor)
        {
            this.isJumped=false
            this.upwardspeed=250;
            y=this.floor;
        }
        
        return [x, y, direction];
    }
}

class RandomEnemyGenerator extends MainAttribute
{
    constructor()
    {
        super();
    }

    Easy()
    {
        this.SelectedArmor=[new Armor(1,Random(0.3, 0.1),'Head'), new Armor(1,Random(0.3, 0.1),'LeftArm1'), new Armor(1,Random(0.3, 0.1),'LeftArm2'), new Armor(1,Random(0.3, 0.1), 'RightArm1'), new Armor(1,Random(0.3, 0.1),'RightArm2'), new Armor(1,Random(0.3, 0.1),'Body'), new Armor(1,Random(0.3, 0.1), 'LeftLeg'), new Armor(1,Random(0.3, 0.1), 'RightLeg')];
        this.SelectedWeapons=[new Sword(Random(200, 100),Random(100, 50), Random(10, 5)), new Sword(Random(200, 100),Random(100, 50), Random(10, 5))];
    }

    Mid()
    {
        this.leftArmSpeed=Random(0.05, 0.02);
        this.rightArmSpeed=Random(0.05, 0.02);
        
        this.velocity=Random(150, 120);

        this.SelectedArmor=[new Armor(1,Random(0.5, 0.37),'Head'), new Armor(1,Random(0.5, 0.25),'LeftArm1'), new Armor(1,Random(0.5, 0.25),'LeftArm2'), new Armor(1,Random(0.5, 0.37), 'RightArm1'), new Armor(1,Random(0.5, 0.37),'RightArm2'), new Armor(1,Random(0.5, 0.37),'Body'), new Armor(1,Random(0.5, 0.37), 'LeftLeg'), new Armor(1,Random(0.5, 0.37), 'RightLeg')];
        var o=Math.round(Math.random());
        if(o)
            this.SelectedWeapons=[new Sword(Random(200, 100),Random(100, 50), Random(37, 17)), new Sword(Random(200, 100),Random(100, 50), Random(37, 17))];
        else
            this.SelectedWeapons=[new Sword(Random(200, 100),Random(100, 50), Random(37, 17)), new Shield(Random(200, 100),Random(150, 100), 0)];
    }

    Hard()
    {
        this.leftArmSpeed=Random(0.08, 0.05);
        this.rightArmSpeed=Random(0.08, 0.05);
        
        this.velocity=Random(180, 150);
        this.SelectedArmor=[new Armor(1,Random(0.76, 0.59),'Head'), new Armor(1,Random(0.76, 0.59),'LeftArm1'), new Armor(1,Random(0.76, 0.59),'LeftArm2'), new Armor(1,Random(0.76, 0.59), 'RightArm1'), new Armor(1,Random(0.76, 0.59),'RightArm2'), new Armor(1,Random(0.76, 0.59),'Body'), new Armor(1,Random(0.76, 0.59), 'LeftLeg'), new Armor(1,Random(0.76, 0.59), 'RightLeg')];
        var o=Math.round(Math.random());
        if(o)
            this.SelectedWeapons=[new Sword(Random(300, 200),Random(150, 50), Random(67, 47)), new Sword(Random(350, 200),Random(150, 50), Random(67, 47))];
        else
            this.SelectedWeapons=[new Sword(Random(300, 200),Random(150, 50), Random(67, 47)), new Shield(Random(500, 354),Random(200, 150), Random(37, 17))];
    }
}

class Shield extends Weapon
{
    constructor(weight, length, attack) 
    {
        super(weight, length, attack);

        this.type='Shield';
    }

    Update(l1, l2)
    {
        this.pointing=new Vector2(l2.x-l1.x, l2.y-l1.y);
        var length=this.length/2;
        var r=rotatePoint(l2, l1, Math.PI/2);
        r.x-=l1.x;
        r.y-=l1.y;
        r.Normalize();
        this.Start=new Vector2(l2.x+r.x*length,l2.y+r.y*length);
        this.End=new Vector2(l2.x-r.x*length, l2.y-r.y*length);

        // this.Start=r1;
        // this.End=r2;
    }

    Draw(context, location2)
    {
        
        context.save();
        context.lineWidth=4;

        context.strokeStyle='#36777';
        
        context.beginPath();
        context.moveTo(this.Start.x, this.Start.y);
        context.lineTo(this.End.x, this.End.y);

        context.stroke();

        context.restore();
    }
}

class Sword extends Weapon
{
    constructor(weight, length, Attack) 
    {
        super(weight, length, Attack);

        this.type='Sword';
    }

    Update(l1, l2)
    {
        this.SwordPointing=new Vector2(l2.x-l1.x, l2.y-l1.y);
        this.Start=l2;
        var r=this.SwordPointing;
        r.Normalize();
        this.End=new Vector2(this.Start.x+r.x* this.length, this.Start.y+r.y*this.length);
        
    }

    Draw(context, location2)// Vector2
    {
        var d=dot(this.SwordPointing.x, this.SwordPointing.y, RightVector.x, RightVector.y);
        //console.log(d);
        //console.log(SwordPointing.x)

        //console.log(SwordPointing.Length)
        
        var angle=Math.asin(d/(this.SwordPointing.Length*RightVector.Length));

        //console.log(angle);

        context.beginPath();

        if(this.SwordPointing.x<RightVector.x)
            angle=Math.PI-angle;
        
        context.save();
        context.translate(location2.x, location2.y);
        context.rotate(angle);

        var sq=this.length*0.23;

        
        
        context.moveTo(sq,0);
        
        context.strokeStyle='#C0C0C0';
        
        context.lineWidth=2;

        context.lineTo(this.length,0);

        context.stroke();
        
        
        context.beginPath();
        
        context.moveTo(0,0);

        context.strokeStyle='#766666';
        
        context.lineWidth=4;

        context.lineTo(sq,0);

        context.stroke();



        context.restore();    

        
    }
}

class Sprite{
    constructor(floor, x, y, attributes, SpriteArray, index, game)
    {  
        this.location=new Vector2(x, y);
        this.facing=1;
        this.direction=1;
        this.currentPose=StandBy;

        // this.LWeapong=;
        // this.RWeapong=;

        this.Weapons=attributes[5];
        
        this.components={MovementComponent:new MovementComponent(attributes[0], floor, this),AnimationComponent:new AnimationComponent(attributes[1], attributes[2], attributes[3]),ArmorComponent:new ArmorComponent(attributes[4])};       

        this.MyCollisionArray=[];



        this.State=new PlayerState(this);
        
        
        this.SpriteArray=SpriteArray;
        this.index=index;
        this.game=game;
    }
        
    Draw(context)
    {   
        var index;
        if(this.game.type)
            index=this.index;
        else
            index=1;



        DrawHead(context, this.location.x, this.location.y-50, this.facing, index);
        DrawBody(context, this.currentPose, this.location);

        this.Weapons[0].Draw(context, new Vector2(this.currentPose[2].x+this.location.x, this.currentPose[2].y+this.location.y));
        this.Weapons[1].Draw(context, new Vector2(this.currentPose[3].x+this.location.x, this.currentPose[3].y+this.location.y), new Vector2(this.currentPose[4].x+this.location.x, this.currentPose[4].y+this.location.y));

        this.components['ArmorComponent'].Draw(context, this.currentPose, this.facing, this.location);
        
        
    }

    Update(InputManager, deltaTime)
    {


        
        
        
        this.Weapons[0].Update(new Vector2(this.currentPose[1].x+this.location.x, this.currentPose[1].y+this.location.y), new Vector2(this.currentPose[2].x+this.location.x, this.currentPose[2].y+this.location.y));
        this.Weapons[1].Update(new Vector2(this.currentPose[3].x+this.location.x, this.currentPose[3].y+this.location.y), new Vector2(this.currentPose[4].x+this.location.x, this.currentPose[4].y+this.location.y));
        
        
        if(InputManager.mousex<=this.location.x)
            this.facing=-1;
        else
            this.facing=1;
        
        // console.log(deltaTime);
        var re=this.components['MovementComponent'].Update(InputManager, this.location, deltaTime);
         //console.log(newPosition);
         this.location.x=re[0];
         this.location.y=re[1];
         this.direction=re[2];

        //Do the attack animation
        if(InputManager.leftbutton)
        {
            this.components['AnimationComponent'].Play(0);
            this.Weapons[0].isAttack=true;
        }
        if(!InputManager.leftbutton&&this.components['AnimationComponent'].animations[0].isPlay==1)
        {
            this.components['AnimationComponent'].BackPlay(0);
            this.Weapons[0].isAttack=false;
        }

        if(InputManager.rightbutton)
        {
            this.components['AnimationComponent'].Play(1);
            this.Weapons[1].isAttack=true;
        }
        if(!InputManager.rightbutton&&this.components['AnimationComponent'].animations[1].isPlay==1)
        {
            this.components['AnimationComponent'].BackPlay(1);
            this.Weapons[1].isAttack=false;
        }

        this.components['AnimationComponent'].LoopPlay(2);
        
        if(InputManager.keysDown['d'])
        {
            this.components['AnimationComponent'].Play(2);
        }
        if(InputManager.keysDown['a'])
        {
            this.components['AnimationComponent'].Play(2);
        }

        if(this.direction==0)
            this.components['AnimationComponent'].StopPlay(2);

        
        
        this.currentPose=this.components['AnimationComponent'].Update();
            
        //Aim the target

        function Aim(location, currentPose, index)
        {
            var mx=InputManager.mousex-location.x;
            var my=InputManager.mousey;

            if(mx<0)
                mx*=-1;
            
            var pointing=new Vector2(currentPose[0].x-mx, currentPose[0].y-(my-location.y));
            var orignal=new Vector2(currentPose[index].x-currentPose[0].x, currentPose[index].y-currentPose[0].x);

      //      console.log(orin);
            
            var d=dot(pointing.x, pointing.y, orignal.x, orignal.y);
  //        console.log(d);
            var angle=0.5*Math.PI+Math.asin(d/(pointing.Length*orignal.Length));

            if(InputManager.mousey<location.y)
                angle*=-1;
            
            //console.log(angle);
            currentPose[index-1]=Rotate(currentPose[index-1], angle);
            currentPose[index]=Rotate(currentPose[index], angle);


        }
        
        if(this.components['AnimationComponent'].animations[0].isPlay)
        {
            Aim(this.location, this.currentPose, 2);
        }
        if(this.components['AnimationComponent'].animations[1].isPlay)
        {
            Aim(this.location, this.currentPose, 4);
        }

         if(this.facing==-1)
         {
            for(var i=1;i<=4;i++)
            {
                this.currentPose[i].x*=-1;
            }
         }

         //Left and Right Weapon Collision
        this.MyCollisionArray[0]=new Collider(this.Weapons[0].Start, this.Weapons[0].End, 0);
        this.MyCollisionArray[1]=new Collider(this.Weapons[1].Start, this.Weapons[1].End, 0);
        //Head Collision
        this.MyCollisionArray[2]=new Collider(new Vector2(this.location.x-30, this.location.y-90), new Vector2(this.location.x+30, this.location.y-13), 1);
        //Arms Collision
        this.MyCollisionArray[3]=new Collider(new Vector2(this.location.x+this.currentPose[0].x, this.location.y+this.currentPose[0].y), new Vector2(this.location.x+this.currentPose[1].x, this.location.y+this.currentPose[1].y));
        this.MyCollisionArray[4]=new Collider(new Vector2(this.location.x+this.currentPose[1].x, this.location.y+this.currentPose[1].y), new Vector2(this.location.x+this.currentPose[2].x, this.location.y+this.currentPose[2].y));
        this.MyCollisionArray[5]=new Collider(new Vector2(this.location.x+this.currentPose[0].x, this.location.y+this.currentPose[0].y), new Vector2(this.location.x+this.currentPose[3].x, this.location.y+this.currentPose[3].y));
        this.MyCollisionArray[6]=new Collider(new Vector2(this.location.x+this.currentPose[3].x, this.location.y+this.currentPose[3].y), new Vector2(this.location.x+this.currentPose[4].x, this.location.y+this.currentPose[4].y));
        //Body Collision
        this.MyCollisionArray[7]=new Collider(new Vector2(this.currentPose[0].x+this.location.x, this.currentPose[0].y+this.location.y),new Vector2(this.currentPose[5].x+this.location.x, this.currentPose[5].y+this.location.y), 0);
        //Legs Collision
        this.MyCollisionArray[8]=new Collider(new Vector2(this.currentPose[5].x+this.location.x, this.currentPose[5].y+this.location.y), new Vector2(this.location.x+this.currentPose[6].x, this.currentPose[6].y+this.location.y),0);
        this.MyCollisionArray[9]=new Collider(new Vector2(this.currentPose[5].x+this.location.x, this.currentPose[5].y+this.location.y), new Vector2(this.location.x+this.currentPose[7].x, this.currentPose[7].y+this.location.y),0);
         
         
        var opponentIndex;
         
        if(this.index==1)
            opponentIndex=0;
        else    
            opponentIndex=1;

        this.State.Update();

        for(var i=0;i<2;i++)
        {
            for(var j=0;j<10;j++)
            {
                if(this.SpriteArray[opponentIndex].MyCollisionArray[j])
                if(CheckIsCollide(this.MyCollisionArray[i], this.SpriteArray[opponentIndex].MyCollisionArray[j]))
                {
                    if(this.Weapons[i].isAttack)
                    {
                        
                        if(j>=2)
                        {
                            this.SpriteArray[opponentIndex].State.TakeDamage(j-2, this.Weapons[i].Attack, i);
                        }
                        else
                        {
                            var oWeapon=this.SpriteArray[opponentIndex].Weapons[j];
                            if(oWeapon)
                            if(oWeapon.isAttack)
                            {
                                //if opponent's weapon is a shield, we knockedback
                                if(this.SpriteArray[opponentIndex].Weapons[j].type=='Shield')
                                    this.location.x-=this.facing*11;
                                //if opponent's weapon's weight is bigger than ours, we knockedback
                                if(this.Weapons[i].weight<=this.SpriteArray[opponentIndex].Weapons[j].weight)
                                    this.location.x-=this.facing*5.0;
                            }
                        }
                    }
                }
                else
                {
                    if(j>=2)
                    {
                        this.SpriteArray[opponentIndex].State.RemoveAttack(j-2,i);
                    }
                }
            }
        }



         
        }

        
}




class Game{
    constructor()
    {
        this.isRunning=true;
        this.mTickCount=0;
    }

    Initialize(MainAttribute, type)
    {
        this.canvas=document.createElement('canvas');
        document.body.appendChild(this.canvas);
        this.canvas.style="display: block";
        this.context=this.canvas.getContext('2d');

        this.canvaswidth=this.canvas.width = window.innerWidth;
        this.canvasheight=this.canvas.height = window.innerHeight;

        this.MainAttribute=MainAttribute;
        
        this.SpriteArray=[];
        this.SpriteArray[0]=new Sprite(this.canvasheight*0.618-59, 200,200, [MainAttribute[0].velocity,MainAttribute[0].leftArmSpeed,MainAttribute[0].rightArmSpeed, MainAttribute[0].walkAnimationSpeed, MainAttribute[0].SelectedArmor, MainAttribute[0].SelectedWeapons], this.SpriteArray, 0, this);
        this.SpriteArray[1]=new Sprite(this.canvasheight*0.618-59, 1000, 200, [MainAttribute[1].velocity,MainAttribute[1].leftArmSpeed,MainAttribute[1].rightArmSpeed, MainAttribute[1].walkAnimationSpeed, MainAttribute[1].SelectedArmor, MainAttribute[1].SelectedWeapons], this.SpriteArray, 1, this)

        this.InputManager=new InputManager();
        this.AIController=new AIController(this.InputManager, this.SpriteArray[1]);

        this.points=[];
        this.fillstyle=[];
        var fillstyles=['#977156', '#343c3c', '#43321e'];
        for(var i=0;i<91;i++)
        {
            this.fillstyle.push(fillstyles[Math.round(Random(2,0))]);
            this.points.push(new Vector2(Math.round(Random(this.canvaswidth, 0)), Math.round(Random(this.canvasheight*0.618, this.canvasheight))));
        }

        var groundcolor=['#D2B48C', '#8B4513', '#228B22', '#808080', '#FFD700'];
        this.groundcolor=groundcolor[Math.round(Random(4, 0))];
        
        this.type=type;
        
    }

    Update()
    {
        
        var deltatime=(Date.now()-this.mTickCount)/1000;

        //console.log(deltatime);
        this.mTickCount=Date.now();

        this.AIController.Update(this.SpriteArray[0].location);
        
        this.SpriteArray[0].Update(this.InputManager, deltatime);        
        this.SpriteArray[1].Update(this.AIController, deltatime);
    }

    GenerateOutput()
    {

        this.context.beginPath();
        //this.context.clearRect(0,0,this.canvaswidth,this.canvasheight);
        if(this.type)
            this.context.fillStyle='#200000';
        else
            this.context.fillStyle='#00BFFF';
        this.context.fillRect(0,0,this.canvaswidth, this.canvasheight);

        //Draw the battlefield

        this.context.moveTo(0,0);
        if(this.type)
            this.context.fillStyle='#3D1D1D';
        else
        {
            this.context.fillStyle=this.groundcolor;
        }
        this.context.fillRect(0, this.canvasheight*0.618, this.canvaswidth, this.canvasheight);

        for(var i=0;i<91;i++)
        {
            this.context.fillStyle=this.fillstyle[i];
            this.context.fillRect(this.points[i].x, this.points[i].y, 13, 13);
        }
        
        this.context.stroke();
        this.SpriteArray[0].Draw(this.context);        
        this.SpriteArray[1].Draw(this.context);

        this.context.stroke();
    }

    Loop()
    {
        this.loop=setInterval(() => {
        this.Update();
        this.GenerateOutput();
        if(!this.isRunning)
            clearInterval(this.loop);
        }, 1);
    }

    Stop(index)
    {
        this.isRunning=false;

        if(index==1)
        {
            alert("You Win");
            this.MainAttribute[0].money+=Math.round(Random(20, 10));
            if(this.type)
                FinalPage();
            else
                MainPage();
        }
        else
        {
            alert("You Lose");
            Start();
        }
        this.canvas.remove();

    }
}





















var mainAttribute=[new PlayerMainAttribute(), new RandomEnemyGenerator()];

function Start()
{

    MainAudio?.pause();
    
    mainAttribute[0] =new PlayerMainAttribute();
    mainAttribute[1]=new RandomEnemyGenerator();
    
    // var title=document.createElement('h1');
    // title.innerHTML='REVENGE'
    // title.setAttribute('id',  '1');
    // document.body.appendChild(title);

    // var button=document.createElement('button');
    // button.innerHTML='START';
    // button.setAttribute('id', '2');

    // var img=new Image();
    // img.src='svg.svg';

    // img.onload=function()
    // {
    //     var canvas=document.createElement('canvas');
    //     //canvas.style="display: block";
    //     canvas.width=window.innerWidth;
    //     canvas.height=window.innerHeight;
        
    //     document.body.appendChild(canvas);

    //     var context=canvas.getContext('2d');

    //     context.drawImage(img, 0,0);
    // }

    var img=document.createElement('img');
    
    img.src='svg.svg';
    img.style.height='100%';
    img.style.width='100%';
    document.body.appendChild(img);

    img.id=1;

    var handle=img.addEventListener('click', function(){img.removeEventListener('click', handle);remove();});

}

function remove()
{
    document.getElementById('1').remove();
    Introduction(text, finishText);
}

var text=["Ages and ages past, you found yourself captivated by the allure of a stunning young woman.","The sentiment was mutual, as she too harbored a deep fondness for you.", "However, fate's whims placed another admirer on the scene, one who grew infatuated with her as well.", "This individual cunningly orchestrated a plan that left you destitute and bereft of your fortunes.", "Yet now, driven by a thirst for retribution, you stand resolute, determined to reclaim every fragment of what rightfully belongs to you!"];
var finishText='... Press Any Key To Start ...';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
async function Introduction(text, finishText)
{     

     var div=document.createElement('div');
     div.setAttribute("class", 'text');
     //div.setAttribute('id', '1');
     document.body.appendChild(div);

    //  var p=document.createElement('p');
    //  p.setAttribute("class", 'text')
    //  p.innerHTML='213231231231';
    //  div.appendChild(p);
     
    
    
     
    for(var i=0; i<text.length; i++)
    {
        console.log(i);

        var p=document.createElement('p');
        p.setAttribute("class", 'text')
        div.appendChild(p);
        p.innerHTML=text[i];
        await sleep(10000);

        while(div.hasChildNodes())
        {
            div.removeChild(div.firstChild);
        }
    }
    
    var p=document.createElement('p');
    p.setAttribute('class', 'undertext');
    p.innerHTML=finishText;
    div.appendChild(p);

    var isRemoved=false;
    
function removeIntroduction()
{
    if(!isRemoved)
    {
        p.remove(); 
        div.remove();
        MainPage();
        isRemoved=true;
    }
}
    
    var handle=addEventListener('keydown', function(){removeEventListener('keydown', handle);removeIntroduction()});
}

function Remove()
{
    MainAudio?.pause();
    
    document.getElementById('MainPage')?.remove();   
}

function GenerateSpeed(weight)
{
    console.log(1/weight);
    
    return 1/weight;
}

function ABATOIR()
{
    Remove();
    
    var game=new Game();

    var o=Math.round(Math.random());
    
    if(o)
    mainAttribute[1].Easy();
    else
    mainAttribute[1].Mid();

    for(var i=0;i<2;i++)
        mainAttribute[i].leftArmSpeed=GenerateSpeed(mainAttribute[i].SelectedWeapons[i].weight);
    
    startDemo(backgroundSound);
        
    game.Initialize(mainAttribute, 0);
    game.Loop();

}

function REVENGE()
{
    Remove();
    
    var game=new Game();

    mainAttribute[1].Hard();
    
    for(var i=0;i<1;i++)
        mainAttribute[i].leftArmSpeed=GenerateSpeed(mainAttribute[i].SelectedWeapons[i].weight);

    startDemo(WindSong);
        
    game.Initialize(mainAttribute, 1);
    game.Loop();

    
   
}

function RandomAttackGenerator(weight, length, value)
{
    return (weight/length+0.4*value*Random(14,1))/10;
}

function RandomProtectiveLevelGenerator(weight, value)
{
    var protectiveLevel=(weight*0.1+value*0.05*Random(14,1))/100;
    if(protectiveLevel>=0.9)
        protectiveLevel=0.9;
    return protectiveLevel;
}

function SMITHY()
{
    Remove();
    
    alert('You have '+mainAttribute[0].money+'$');
    
    var type=document.createElement('select');

    var Text=['Head', 'LeftArm1', 'LeftArm2', 'RightArm1', 'RightArm2', 'Body', 'LeftLeg', 'RightLeg', 'Sword', 'Shield'];

    for(var i=0;i<10;i++)
    {
        var option=document.createElement('option');
        option.innerHTML=Text[i];
        type.add(option);
    }

    var div=document.createElement('div');
    
    div.appendChild(type);

    var dm=document.createElement('p')
    dm.innerHTML='Money:';
    div.appendChild(dm);

    var money=document.createElement('input');
    div.appendChild(money);
    
    var dw=document.createElement('p')
    dw.innerHTML='Weight:';
    div.appendChild(dw);

    var weight=document.createElement('input'); 
    div.appendChild(weight);
    
    var dl=document.createElement('p')
    dl.innerHTML='Length:';
    div.appendChild(dl);

    var br=document.createElement('br');
    div.appendChild(br);
    
    var length=document.createElement('input');
    div.appendChild(length);  

    var button=document.createElement('button');
    button.innerHTML='FORGE';

    div.appendChild(button);

    button.onclick=function(){
        var cost=parseInt(money.value);
        if(!cost)
            return;

        if(mainAttribute[0].money<cost)
        {
            alert('Not Enough Money!');
            return;
        }
        mainAttribute[0].money-=cost;

        var item;

        var index=type.selectedIndex;
        
        var slength=length.value;
        var sweight=weight.value;
        
        switch (type.options[index].outerText) {
            case 'Sword':
                item=new Sword(sweight, slength, RandomAttackGenerator(sweight, slength, cost));
                break;
            
            case 'Shield':
                item=new Shield(sweight, slength, 0);
                break;
        
            default:
                item=new Armor(sweight, RandomProtectiveLevelGenerator(sweight, cost), type.options[index].outerText);
                break;
        }

        mainAttribute[0].backpack.backpack.push(item);
        
        
    }

    var back=document.createElement('button');
    back.innerHTML='Back';
    back.onclick=function(){
        div.remove();
        MainPage();
    }

    div.appendChild(back);
    
    document.body.appendChild(div);


}



function Drag(ev)
{
    ev.dataTransfer.setData('Item', ev.target.id);
    ev.dataTransfer.setData('type', ev.target.type);
}

function allowDrop(ev)
{
    ev.preventDefault();
}

function Drop(ev)
{
    var data=ev.dataTransfer.getData('Item');
    var type=ev.dataTransfer.getData('type');

    var div=ev.target.getElementsByTagName('div');
    if(type==ev.target.type)
    {
        if(div[0])
        {
            var targetdiv=document.getElementById('Itemdiv');
            
            var attribtues=div[0].getElementsByTagName('p');
            switch (attribtues[0].outerText) {
                case 'Sword':
                    mainAttribute[0].backpack.backpack.push(new Sword(attribtues[1].outerText, attribtues[2].outerText, attribtues[3].outerText));
                    break;

                case 'Shield':
                    mainAttribute[0].backpack.backpack.push(new Shield(attribtues[1].outerText, attribtues[2].outerText, attribtues[3].outerText));
                    break;
            
                default:
                    mainAttribute[0].backpack.backpack.push(new Armor(attribtues[1].outerText, attribtues[2].outerText, attribtues[0].outerText));
                    break;
            }

            div[0].setAttribute('class', 'ritem');
            
            targetdiv.appendChild(div[0]);
        }
        var item=document.getElementById(data);
        item.setAttribute('class', 'item');
        ev.target.appendChild(item);

        mainAttribute[0].backpack.backpack.splice(data,1);
    }
}

function OUFIT()
{
    Remove();
    var div=document.createElement('div');
    document.body.appendChild(div);

    var selectdiv=document.createElement('div');
    div.appendChild(selectdiv);

    selectdiv.id='selectdiv';

    var parts=['Head', 'LeftArm1', 'LeftArm2', 'RightArm1', 'RightArm2', 'Body', 'LeftLeg', 'RightLeg', 'LeftWeapon', 'RightWeapon'];
    
    for(var i=0;i<10;i++)
    {
        var selectitem=document.createElement('div');
        selectitem.id='s'+i;

        selectitem.type=parts[i];

        //Weapons can be placed whether arms
        if(i>=8)
            selectitem.type='Weapon';

        selectitem.setAttribute('class', 'Item');

        selectitem.ondragover=allowDrop;
        
        selectitem.ondrop=Drop;

        selectitem.innerHTML=parts[i];


        //dealing with already selected weapons
        var s=document.createElement('div');
        s.id='a'+i;
        s.setAttribute('class', 'item')
        
        s.draggable=true;
        s.ondragstart=Drag;
        s.ondrop=Drop;
        
        //Create item blocks
     
            
        
        if(i>=8)
        //this is a weapon
        {
            var iter=i-8;

            var weapon=mainAttribute[0].SelectedWeapons[iter];
            
            var type=document.createElement('p');
            type.innerHTML=weapon.type;
            s.appendChild(type);
    
            var weight=document.createElement('p');
                weight.innerHTML=weapon.weight;
    
            s.appendChild(weight);
            
            var Length=document.createElement('p');
            Length.innerHTML=weapon.length;

            var attack=document.createElement('p');
            attack.innerHTML=weapon.Attack;

            s.appendChild(Length);
            s.appendChild(attack);

            s.type='Weapon';
        }
        //this is an armor
        else
        {
            var armor=mainAttribute[0].SelectedArmor[i];
            
            var type=document.createElement('p');
            type.innerHTML=armor.type;
            s.appendChild(type);
    
            var weight=document.createElement('p');
                weight.innerHTML=armor.weight;
    
            s.appendChild(weight);
            
            var protectiveLevel=document.createElement('p');
            protectiveLevel.innerHTML=armor.protectiveLevel;
            s.appendChild(protectiveLevel);

            s.type=armor.type;
        }

        selectitem.appendChild(s);
        
        selectdiv.appendChild(selectitem);
    }

    var dashedline=document.createElement('p');
    dashedline.innerHTML='--------------------------------------------------------------------';
    div.appendChild(dashedline);

    var Itemdiv=document.createElement('div');
    div.appendChild(Itemdiv);

    Itemdiv.id='Itemdiv';

    //Itemdiv.ondragover=allowDrop;
    Itemdiv.ondrop=Drop;

    Itemdiv.style.height=179+'px';
    
    for(var i=0;i<mainAttribute[0].backpack.backpack.length;i++)
    {
        var item=document.createElement('div');
        item.setAttribute('class', 'ritem');
        item.draggable=true;

        item.ondragstart=Drag;
        item.id=+i;

        var backpack=mainAttribute[0].backpack.backpack[i];
        if(backpack.category=='Weapon')
            item.type=backpack.category;
        else
            item.type=backpack.type;
        
        //Create item blocks
        var type=document.createElement('p');
        var it=mainAttribute[0].backpack.backpack[i];
        if(!it)
            continue;
        var t=it.type;
        type.innerHTML=t;
        item.appendChild(type);

        var weight=document.createElement('p');
            weight.innerHTML=it.weight;

        item.appendChild(weight);
            
        
        if(it.category=='Weapon')
        {
            var Length=document.createElement('p');
            Length.innerHTML=it.length;

            var attack=document.createElement('p');
            attack.innerHTML=it.Attack;

            item.appendChild(Length);
            item.appendChild(attack);
        }
        else
        {
            var protectiveLevel=document.createElement('p');
            protectiveLevel.innerHTML=it.protectiveLevel;
            item.appendChild(protectiveLevel);
        }

        Itemdiv.appendChild(item);
    }
    var back=document.createElement('button');
    back.innerHTML='Back';
    back.onclick=function(){

        var weight=0;
        var weightmax=1000;
        for(var i=0;i<10;i++)
        {
            var parts=document.getElementById('s'+i);
            var attribtues=parts.getElementsByTagName('p');
            weight+=parseInt(attribtues[1].outerText);
        }

        if(weight>weightmax)
        {
            alert('Outfits are too heavy!');
            return;
        }
        
        for(var i=0;i<10;i++)
        {
            var parts=document.getElementById('s'+i);
            var attribtues=parts.getElementsByTagName('p');

            if(i<8)
            {
                mainAttribute[0].SelectedArmor[i]=new Armor(attribtues[1].outerText, attribtues[2].outerText, attribtues[0].outerText);
            }
            else
            {
                if(attribtues[0].outerText=='Sword')
                mainAttribute[0].SelectedWeapons[i-8]=new Sword(attribtues[1].outerText, attribtues[2].outerText, attribtues[3].outerText);
                else
                mainAttribute[0].SelectedWeapons[i-8]=new Shield(attribtues[1].outerText, attribtues[2].outerText, attribtues[3].outerText);
            }
        }
        
        div.remove();
        MainPage();
    }

    div.appendChild(back);
    
}

function CASINO()
{
    Remove();

    alert('You have '+mainAttribute[0].money+'$');
    
    var div=document.createElement('div');
    document.body.appendChild(div);

    var title=document.createElement('h1');
    title.innerHTML='CASINO';
    var p1='';

    var inputresult=1;
    
    var money=document.createElement('input');
    
    var small=document.createElement('button');
    small.innerHTML='SMALL';
    small.onclick=function() {
        inputresult=1;
    };
    div.appendChild(small);
    var mid=document.createElement('button');
    mid.innerHTML='MID';
    mid.onclick=function() {
        inputresult=2;
    };
    div.appendChild(mid);
    var big=document.createElement('button');
    big.innerHTML='BIG';
    big.onclick=function() {
        inputresult=3;
    };
    div.appendChild(big);
    div.appendChild(money);
    var confirm=document.createElement('button');
    confirm.innerHTML='CONFIRM';
    confirm.onclick=function()
    {
        var result=Random(18,3);

    if(result<=10)
        result=1;
    else
        if(result==11)
            result=2;
                else
                    result=3;
        var cost=parseInt(money.value);
        if(!cost)
            return;
            
            if(mainAttribute[0].money<cost)
            {
                alert('Not Enough Money!');
                return;
            }
            mainAttribute[0].money-=cost;
        if(inputresult==result)
        {
            mainAttribute[0].money+=3*cost;
            if(inputresult==2)
            {
                mainAttribute[0].money+=7*cost;
            }
        }

        console.log(mainAttribute[0].money);
    }
    div.appendChild(confirm);

    var button=document.createElement('button');
    button.innerHTML='BACK';
    div.appendChild(button);
    button.onclick=function(){div.remove();MainPage();};
}

var MainAudio;

var MainSong = {
    songData: [
      { // Instrument 0
        i: [
        2, // OSC1_WAVEFORM
        100, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        3, // OSC2_WAVEFORM
        201, // OSC2_VOL
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
          {n: [141,,,,,,,,143,,,,,,,,148,,,,153,,,,148,,,,,,,155,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,172,,,,167,,,,165,,,,167,,,,160,,,,172,,,,167,,,,,,,169],
           f: []}
        ]
      },
    ],
    rowLen: 5513,   // In sample lengths
    patternLen: 32,  // Rows per pattern
    endPattern: 0,  // End pattern
    numChannels: 1  // Number of channels
  };

  var WindSong = {
    songData: [
      { // Instrument 0
        i: [
        0, // OSC1_WAVEFORM
        0, // OSC1_VOL
        140, // OSC1_SEMI
        0, // OSC1_XENV
        0, // OSC2_WAVEFORM
        0, // OSC2_VOL
        140, // OSC2_SEMI
        0, // OSC2_DETUNE
        0, // OSC2_XENV
        255, // NOISE_VOL
        158, // ENV_ATTACK
        158, // ENV_SUSTAIN
        158, // ENV_RELEASE
        0, // ENV_EXP_DECAY
        0, // ARP_CHORD
        0, // ARP_SPEED
        0, // LFO_WAVEFORM
        51, // LFO_AMT
        2, // LFO_FREQ
        1, // LFO_FX_FREQ
        2, // FX_FILTER
        58, // FX_FREQ
        239, // FX_RESONANCE
        0, // FX_DIST
        32, // FX_DRIVE
        88, // FX_PAN_AMT
        1, // FX_PAN_FREQ
        157, // FX_DELAY_AMT
        2 // FX_DELAY_TIME
        ],
        // Patterns
        p: [1],
        // Columns
        c: [
          {n: [140],
           f: []}
        ]
      },
    ],
    rowLen: 5513,   // In sample lengths
    patternLen: 79,  // Rows per pattern
    endPattern: 0,  // End pattern
    numChannels: 1  // Number of channels
  };

  var backgroundSound = {
    songData: [
      { // Instrument 0
        i: [
        2, // OSC1_WAVEFORM
        100, // OSC1_VOL
        128, // OSC1_SEMI
        0, // OSC1_XENV
        3, // OSC2_WAVEFORM
        201, // OSC2_VOL
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
          {n: [140,149,146,138,147,152,142,140,147,154,140,147,151,151,144,146],
           f: []}
        ]
      },
    ],
    rowLen: 5513,   // In sample lengths
    patternLen: 16,  // Rows per pattern
    endPattern: 0,  // End pattern
    numChannels: 1  // Number of channels
  };
  
  function startDemo(song) {
    //----------------------------------------------------------------------------
    // Music data section
    //----------------------------------------------------------------------------
  
    // Song data
  //var song={songData:[{i:[2,192,128,0,2,192,128,3,0,0,32,222,60,0,0,0,2,188,3,1,3,55,241,60,67,53,5,75,5],p:[1,2,3,4,3,4],c:[{n:[123],f:[]},{n:[118],f:[]},{n:[123,111],f:[]},{n:[118,106],f:[]}]},{i:[3,100,128,0,3,201,128,7,0,0,17,43,109,0,0,0,3,113,4,1,1,23,184,2,29,147,6,67,3],p:[,,1,2,1,2],c:[{n:[123,,,,,,,,123,,,,,,,,123,,,,,,,,123,,,,,,,,126,,,,,,,,126,,,,,,,,126,,,,,,,,126,,,,,,,,130,,,,,,,,130,,,,,,,,130,,,,,,,,130],f:[]},{n:[122,,,,,,,,122,,,,,,,,122,,,,,,,,122,,,,,,,,125,,,,,,,,125,,,,,,,,125,,,,,,,,125,,,,,,,,130,,,,,,,,130,,,,,,,,130,,,,,,,,130],f:[]}]},{i:[0,192,99,64,0,80,99,0,0,3,4,0,66,0,0,0,0,19,4,1,2,86,241,18,195,37,4,0,0],p:[,,1,1,1,1,1],c:[{n:[147,,,,147,,,,147,,,,147,,,,147,,,,147,,,,147,,,,147],f:[]}]},{i:[2,146,140,0,2,224,128,3,0,0,84,0,95,0,0,0,3,179,5,1,2,62,135,11,15,150,3,157,6],p:[,,,,1,2],c:[{n:[147,,145,,147,,,,,,,,,,,,135],f:[11,,,,,,,,,,,,,,,,11,,,,,,,,,,,,,,,,27,,,,,,,,,,,,,,,,84]},{n:[142,,140,,142,,,,,,,,,,,,130],f:[11,,,,,,,,,,,,,,,,11,,,,,,,,,,,,,,,,27,,,,,,,,,,,,,,,,84]}]}],rowLen:6615,patternLen:32,endPattern:6,numChannels:4};
  


    //----------------------------------------------------------------------------
    // Demo program section
    //----------------------------------------------------------------------------
  
    // Initialize music generation (player).
    //var t0 = new Date();
    var player = new CPlayer();
    player.init(song);
  
    // Generate music...
    var done = false;
    setInterval(function () {
      if (done) {
        return;
      }
  
      //var s = document.getElementById("status");
      //s.textContent = s.textContent + ".";
  
      done = player.generate() >= 1;
  
      if (done) {
        //var t1 = new Date();
        //s.textContent = s.textContent + "done (" + (t1 - t0) + "ms)";
  
        // Put the generated song in an Audio element.
        var wave = player.createWave();
        MainAudio = document.createElement("audio");
        MainAudio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
        MainAudio.loop=true;
        MainAudio.play();
      }
    }, 0);
  }
  
function MainPage()
{

      startDemo(MainSong);



    
    var Text=['TATAKAI', 'REVENGE', 'SMITHY', 'OUTFIT', 'CASINO'];
    var width=[618,372,372,382,236,];
    var color=['darkred','darkblue','darkcyan','darksalmon','darkviolet'];

    var funtions=[ABATOIR, REVENGE,SMITHY, OUFIT, CASINO];
    
    var div=document.createElement('table');
    div.setAttribute('id','MainPage');

    var lines=[document.createElement('tr'), document.createElement('tr')];
    
    div.setAttribute('class', 'text');

    for(var i=0; i<5;i++)
    {
        var block=document.createElement('td');

        block.addEventListener('click', funtions[i]);
        
        block.setAttribute('class', 'block');
        block.style.width=width[i]+'px';
        block.innerHTML=Text[i];
        block.style.backgroundColor=color[i];
        
        var line=0;

        if(i>=2)
        {
            line=1;
        }

        lines[line].appendChild(block);
    }

    div.appendChild(lines[0]);
    div.appendChild(lines[1]);


    document.body.appendChild(div);
}

function FinalPage()
{
    var text=["I once poured my heart and soul into her, giving all my efforts and genuine affection.","I devoted my time, care, and unwavering support to her, regarding her as the most significant person in my life."," Each day, I contemplated ways to make her happy, fulfill her needs, and ensure she felt truly cherished.", "However, I now find myself deeply wounded and profoundly betrayed.", "I've uncovered hidden actions on her part that I cannot reconcile or accept.", "I'm left questioning if I missed something or if I was naively deceived all along.", "I used to believe our love was indestructible, but I'm now overwhelmed with profound disappointment and exhaustion.", "I yearn to understand, why has she treated me in this manner?", "Am I truly inadequate or unworthy of her affection?", "Despite the immense effort and devotion I invested in her, she has inflicted deep emotional pain.", "My heart weighs heavy, and the path forward remains uncertain, but I recognize the need to grant myself the time to heal and rediscover my identity.", "Perhaps one day, clarity will emerge, and I will comprehend the underlying reasons.", "For now, all I can do is confront the painful reality before me."];

    Introduction(text, '... THE END ...');
}


Start();

//ABATOIR();

//MainPage();








//FinalPage();


//Start();


document.body.addEventListener('touchmove', function (e) {
	e.preventDefault();
	e.stopPropagation();
}, {passive: false})


let objDemo = document.body;
objDemo.oncontextmenu = (e) => {
    e.preventDefault()
}













  



