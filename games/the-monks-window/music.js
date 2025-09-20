const len = 0.5;
const musicVolume = 0.02 * config.volmul;

const P = (D, index) => {
  contexts[index] = new AudioContext();
  const ac = contexts[index];

  I = +len;
  with (ac)
    with ((G = createGain()))
      for (i = 0; i < D.length; i++)
        with (createOscillator())
          if (D[(i = +i)] && D[i] != "0")
            connect(G),
              G.connect(destination),
              start(i * I + 0.3),
              frequency.setValueAtTime(
                440 * 1.06 ** (-105 + D.charCodeAt(i) - 14),
                i * I + 0.2
              ),
              frequency.setTargetAtTime(
                440 * 1.06 ** (-105 + D.charCodeAt(i) - 10),
                i * I + 0.25,
                0.02
              ),
              (type = "triangle"), //sine or triangle or square or sawtooth
              gain.setTargetAtTime(0.01, i * I + 0.2, 0.01),
              gain.setValueAtTime(musicVolume + 0.008, i * I + 0.3),
              gain.setTargetAtTime(
                (m.random() + 0.004) * musicVolume,
                i * I + 0.3 + 0.1,
                0.05
              ),
              gain.setTargetAtTime(0.001, i * I + 0.3 + I, 0.05),
              stop(i * I + 0.3 + I - 0.01);

  setTimeout(() => {
    if (ac.state == "running") {
      ac.close();
    }
  }, (D.length * I + 0.3 + I - 0.01) * 1000);
};

const songs = [
  "xzxzxzl0lnlnlng0dddgggd0nlodnlodnlodq0nlonlq",
  "bhh0bhh0bhhjjji0bhh0bhh0bhhiilln0ppn0ppn0pqb",
  "aaae0aaae0cccaaaeeea00hhhm00jjjr00lllmmmlqlm",
  "lm0fedc0op0ihgf0lm0fedc0lm0fefi0lmnolmnolmno",
  "lp0phijk00lp0phijkk0lpkj0ijki0lp0lp0lp0phijk",
];

const playMusic = (delay) => {
  const song = songs[~~(m.random() * songs.length)];
  contexts = [null, null];

  P(song, 0);
  setTimeout(() => {
    P(song, 1);
  }, delay || 0);
};

const toggleSFX = (e) => {
  if (e) {
    e.target.classList.toggle("strike");
  }

  sfx = !sfx;
  if (!sfx) {
    if (synth.cancel) synth.cancel();
  }
};

const toggleMusic = (e) => {
  if (e) {
    e.target.classList.toggle("strike");
  }
  music = !music;

  contexts.forEach((ac) => {
    if (ac.state == "running") {
      ac.close();
    }
  });
  contexts = [];
  if (interval) {
    clearInterval(interval);
  }
  if (!music) {
    return;
  }

  playMusic();
  interval = setInterval(() => {
    if (!music) {
      return;
    }

    playMusic(~~(m.random() * 8) * 250);
  }, 30000);
};
