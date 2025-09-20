//https://xem.github.io/MiniSoundEditor/
let  t, n, q;
const A = new AudioContext();
const gainNode = A.createGain(); // Create a gain node for volume control
gainNode.gain.value = 0.2; // Set the volume (0.0 to 1.0)

// Sound player
export const sound = (f, sam = 96e3, i, m, b, s) => {

  //sets the sample rate (sam) to 96,000 Hz and creates a buffer with 48,000 samples.

   t = (i, n) => (n - i) / n; //calculates the normalized time based on the current sample index (i) and a fixed value (n):
  // const A = new AudioContext();

  m = A.createBuffer(1, sam, 48e3);
  b = m.getChannelData(0);
  for (i = sam; i--;) b[i] = f(i);

  s = A.createBufferSource();
  s.buffer = m;
  s.connect(gainNode); // Connect the source to the gain node
  gainNode.connect(A.destination); // Connect the gain node to the destination

  s.start();

}

//ak coin1
export const soundEnterVR  = i =>  {   var n=1.6e4;
  var c=n/7;
  if (i > n) return null;
  var q=Math.pow(t(i,n),2.1);
  return (i<c ? ((i+Math.sin(-i/900)*10)&16) : i&13) ?q:-q;}

//xem miniburn
export const soundAltUp  = i => {  
  var n=5e4;
  if (i > n) return null;
  var q = t(i,n);
  return Math.sin(-i*0.03*Math.sin(0.09*i+Math.sin(i/200))+Math.sin(i/100))/q/(i>5e4?i/8e3:5);
}

  //xem dooropen
  export const soundAltDown  = i => {
    var n=3e4;
    if (i > n) return null;
    var q = t(i,n);
    return Math.sin(i*0.001*Math.sin(0.009*i+Math.sin(i/200))+Math.sin(i/100))*q*q;
  }

  //ak what9
  export const soundTilt  = i => {
    var n=2e4;
    if (i > n) return null;
    var q = t(i,n);
    i=i*0.04;
    return Math.sin(-i*0.03*Math.sin(0.09*i+Math.sin(i/200))+Math.sin(i/100))*q
}

  //xem wand
  export const soundHome = i => {

    var n=5e4;
    var n1=1e5;
    if (i > n) return null;
    i=Math.pow(i,1.2-Math.sin(i*2/n1))*6;
    var x=Math.sin(i/30+Math.sin(i/1500));
    return Math.pow(x,9)*t(i,n);


  }

  //ak what 6
  export const soundNextLevel = i => {
    var n=11e4;
  if (i > n) return null;
  var q = t(i,n);
  return Math.sin(i*0.001*Math.sin(0.009*i+Math.sin(i/200))+Math.sin(i/100))*q*q;


  }

  //ak die0
  export const soundError = i => {
    var n=5e4;
    if (i > n) return null;
    return ((Math.pow(i,0.9)&200)?1:-1)*Math.pow(t(i,n),3);

  }

  //ak shoot 3
  export const soundLaunch = i => {
    var n=2e4;
    if (i > n) return null;
    var q = t(i,n);
    return (Math.pow(i*500000,0.3)&33)?q:-q;
  }

  //ak win0
  export const soundWin = i => {
    var notes = [0,4,7,12,undefined,7,12];
    var n=3.5e4;
    if (i > n) return null;
    var idx = ((notes.length*i)/n)|0;
    var note = notes[idx];
    if (note === undefined) return 0;
    var r = Math.pow(2,note/12)*0.8;
    var q = t((i*notes.length)%n,n);
    return ((i*r)&64)?q:-q


  }

  //ak die4
  export const soundLoose = i => {
    var n=6e4;
    var n1=1e5;
    if (i > n) return null;
    i=Math.pow(i,1.2-Math.sin(i/n1))*7;
    var x=Math.sin(i/30+Math.sin(i/1500));
    return Math.pow(x,9)*t(i,n);
  }

