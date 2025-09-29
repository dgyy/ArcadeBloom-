const P=(M,L)=>{      // M = melody string (a-z + 0 for silence)
if(!M)return;   // L = Note length
const ctx=new AudioContext,G=ctx.createGain();
for(let i=0;i<M.length;i++){
const o=ctx.createOscillator();
if(M[i]&&M[i]!="0")
o.connect(G),
G.connect(ctx.destination),
o.start(i*L+.3),
o.frequency.setValueAtTime(440*1.06**(-105+M.charCodeAt(i)),i*L+.3),
o.type='sine',
G.gain.setValueAtTime(.01,i*L+.3),  // 0.25 volume
G.gain.setTargetAtTime(.001,i*L+.3+.1,.05),
o.stop(i*L+.3+L-.01);
}
}

const melody1 = 'a0d000000a0d000000a0d000000a0d000000aaddaadd0aaddaadd0aaddaadd0aaddaadd0';
const melody2 = 'hijklm000mlkjih000hijklm000mlkjih000hhiijjkk0kkjjiihh0hhiijjkk0kkjjiihh0';

function playMusic() {
  P(melody1,.3);
  P(melody2,.3);
}

let onFirstPlay = true;
function startMusic() {
  if (onFirstPlay) {
    onFirstPlay = false;
    playMusic();
    setInterval(playMusic, 22000);
  }
}
