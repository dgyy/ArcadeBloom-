const viewport = document.getElementById("viewport");
const container = document.getElementById("container");
const slides = [...document.getElementsByClassName("slide")];
const captured = [];
let vassals = [];

/* music vars */
let contexts = [];
let interval;

const config = {
  width: 1200,
  height: 910,
  base: [0, 2000, 0, 0, 0, 0],
  volmul: 2,
};
let music = false;
let sfx = true;
let winning = false;

const m = Math;
const randBetween = (min, max) => {
  return ~~(m.random() * (max - min + 1) + min);
};

const drum = [1, 0.5, 121, , 0.12, , , 4, , , , , , , , , , 0, 0.05];
const low = [
  0.7,
  0,
  200,
  0.1,
  3,
  0.2,
  ,
  3.5,
  ,
  ,
  ,
  ,
  0.02,
  ,
  ,
  ,
  ,
  0.72,
  0.12,
  0.5,
];
const dink = [
  0.7,
  0,
  206,
  0.01,
  0.1,
  0.1,
  1,
  1.77,
  ,
  ,
  50,
  0.07,
  ,
  0.1,
  ,
  ,
  0.2,
  0.51,
  0.3,
  0.07,
];
const trumpet = [
  0.5,
  0,
  100,
  0.03,
  0.53,
  0.45,
  2,
  2.2,
  ,
  ,
  50,
  0.25,
  0.2,
  0.1,
  ,
  ,
  0.13,
  0.35,
  0.1,
  0.1,
];

const bell = [
  0.5,
  0,
  166,
  0.002,
  0.7,
  0.9,
  ,
  2,
  0.3,
  ,
  ,
  ,
  0.01,
  ,
  ,
  ,
  ,
  0.6,
  0.07,
  0.86,
];

const emojis = [
  "🐕",
  "🐈",
  "🐁",
  "🐇",
  "🦊",
  "🐻",
  "🐴",
  "🦁",
  "🏰",
  "🌷",
  "⚔️",
  "📜",
  "👑",
  "🦄",
  "🍄",
  "🦔",
  "🌹",
  "🌻",
  "🌼",
  "🌱",
  "☘️",
  "🍀",
  "🌰",
  "🌲",
  "⚜️",
  "🐍",
  "🕊️",
  "🦉",
  "🦢",
  "🍓",
  "🍷",
  "🍇",
  "🍞",
  "🗝️",
  "🦗",
  "🔱",
  "🐸",
  "🦚",
  "🐔",
  "💀",
  "🦇",
  "🌈",
  "🐖",
  "🎀",
  "🤝🏻",
  "🥀",
  "🖤",
  "❤️",
  "🐌",
  "🦨",
  "🐢",
  "💎",
  "💪🏽",
  "🔥",
  "☄️",
  "☀️",
  "🕯️",
  "🥪",
  "🍖",
  "🧅",
  "🥄",
  "🦋",
  "🌮",
  "🐳",
];

// ZzFXMicro - Zuper Zmall Zound Zynth - v1.2.0 by Frank Force ~ 880 bytes
zzfxV = 0.3; // volume
zzfx = // play sound
  (
    p = 1,
    k = 0.05,
    b = 220,
    e = 0,
    r = 0,
    t = 0.1,
    q = 0,
    D = 1,
    u = 0,
    y = 0,
    v = 0,
    z = 0,
    l = 0,
    E = 0,
    A = 0,
    F = 0,
    c = 0,
    w = 1,
    m = 0,
    B = 0,
    M = Math,
    R = 44100,
    d = 2 * M.PI,
    G = (u *= (500 * d) / R / R),
    C = (b *= ((1 - k + 2 * k * M.random((k = []))) * d) / R),
    g = 0,
    H = 0,
    a = 0,
    n = 1,
    I = 0,
    J = 0,
    f = 0,
    x,
    h
  ) => {
    if (!sfx) return;
    p *= config.volmul;
    e = R * e + 9;
    m *= R;
    r *= R;
    t *= R;
    c *= R;
    y *= (500 * d) / R ** 3;
    A *= d / R;
    v *= d / R;
    z *= R;
    l = (R * l) | 0;
    for (h = (e + m + r + t + c) | 0; a < h; k[a++] = f)
      ++J % ((100 * F) | 0) ||
        ((f = q
          ? 1 < q
            ? 2 < q
              ? 3 < q
                ? M.sin((g % d) ** 3)
                : M.max(M.min(M.tan(g), 1), -1)
              : 1 - (((((2 * g) / d) % 2) + 2) % 2)
            : 1 - 4 * M.abs(M.round(g / d) - g / d)
          : M.sin(g)),
        (f =
          (l ? 1 - B + B * M.sin((d * a) / l) : 1) *
          (0 < f ? 1 : -1) *
          M.abs(f) ** D *
          zzfxV *
          p *
          (a < e
            ? a / e
            : a < e + m
            ? 1 - ((a - e) / m) * (1 - w)
            : a < e + m + r
            ? w
            : a < h - c
            ? ((h - a - c) / t) * w
            : 0)),
        (f = c
          ? f / 2 +
            (c > a ? 0 : ((a < h - c ? 1 : (h - a) / c) * k[(a - c) | 0]) / 2)
          : f)),
        (x = (b += u += y) * M.cos(A * H++)),
        (g += x - x * E * (1 - ((1e9 * (M.sin(a) + 1)) % 2))),
        n && ++n > z && ((b += v), (C += v), (n = 0)),
        !l || ++I % l || ((b = C), (u = G), (n ||= 1));
    p = zzfxX.createBuffer(1, h, R);
    p.getChannelData(0).set(k);
    b = zzfxX.createBufferSource();
    b.buffer = p;
    b.connect(zzfxX.destination);
    b.start();
    return b;
  };
zzfxX = new AudioContext();

function weightedRandomNumber(min, max) {
  const lambda = 0.3;
  const exponent = -lambda * m.random();
  const scaled = ~~(
    ((m.pow(m.E, exponent) - 1) / (m.pow(m.E, -lambda) - 1)) *
    (max - min + 1)
  );

  return min + scaled;
}

/* Van JS: https://vanjs.org/ */
{
  let e, t, l, r, o, n, f, s, a, i, d, u, _, w, g, h, v, S, c, y, V, b;
  (n = (o = Object).getPrototypeOf),
    (f = document),
    (s = (e, t, l, r) => (e ?? (setTimeout(l, r), new Set())).add(t)),
    (a = (e, t, r) => {
      let o = l;
      l = t;
      try {
        return e(r);
      } catch (e) {
        return console.error(e), r;
      } finally {
        l = o;
      }
    }),
    (i = (e) => (e.t = e.t.filter((e) => e.l?.isConnected))),
    (u = n(
      (d = {
        get val() {
          return l?.add(this), this.o;
        },
        get oldVal() {
          return l?.add(this), this.i;
        },
        set val(e) {
          let l = this;
          if (e !== l.o) {
            l.o = e;
            let r = new Set();
            for (let e of [...l.u])
              v(e.f, e.s), (e.g = 1), e.h.forEach(r.add, r);
            for (let e of r) e.u = e.u.filter((e) => !e.g);
            l.t.length ? (t = s(t, l, V)) : (l.i = e);
          }
        },
      })
    )),
    (_ = n(a)),
    (w = (e) => ({ __proto__: d, o: e, i: e, t: [], u: [] })),
    (g = (e) => n(e ?? 0) === d),
    (h = (t, l) => {
      let o = new Set(),
        n = { f: t },
        d = a(t, o, l);
      for (let t of o)
        (r = s(r, t, () => (r.forEach(i), (r = e)), 1e3)), t.t.push(n);
      return (n.l = (d ?? f).nodeType ? d : new Text(d));
    }),
    (v = (e, t = w()) => {
      let l = new Set(),
        r = { f: e, h: l, s: t };
      t.val = a(e, l);
      for (let e of l) e.u.push(r);
      return t;
    }),
    (c = {}),
    (y = (t) =>
      new Proxy(
        (l, ...r) => {
          let [s, ...a] = n(r[0] ?? 0) === u ? r : [{}, ...r],
            i = t ? f.createElementNS(t, l) : f.createElement(l);
          for (let [t, r] of o.entries(s)) {
            let f = (l) =>
                l ? o.getOwnPropertyDescriptor(l, t) ?? f(n(l)) : e,
              s = l + "," + t,
              a = c[s] ?? (c[s] = f(n(i))?.set ?? 0),
              u = a ? a.bind(i) : i.setAttribute.bind(i, t),
              w = n(r ?? 0);
            w === d
              ? h(() => (u(r.val), i))
              : w !== _ || (t.startsWith("on") && !r.v)
              ? u(r)
              : h(() => (u(r()), i));
          }
          return S(i, ...a);
        },
        { get: (t, l) => t.bind(e, l) }
      )),
    (V = () => {
      let l = [...t].filter((e) => e.o !== e.i);
      t = e;
      for (let t of new Set(l.flatMap(i))) {
        let l = t.l,
          r = h(t.f, l);
        (t.l = e), r !== l && (r != e ? l.replaceWith(r) : l.remove());
      }
      for (let e of l) e.i = e.o;
    }),
    (b = {
      add: (S = (t, ...l) => {
        for (let r of l.flat(1 / 0)) {
          let l = n(r ?? 0),
            o = l === d ? h(() => r.val) : l === _ ? h(r) : r;
          o != e && t.append(o);
        }
        return t;
      }),
      _: (e) => ((e.v = 1), e),
      tags: y(),
      tagsNS: y,
      state: w,
      val: (e) => (g(e) ? e.val : e),
      oldVal: (e) => (g(e) ? e.oldVal : e),
      derive: v,
    }),
    (window.van = b);
}
const { div, button, span, h1, h2 } = van.tags;

const synth = window.speechSynthesis;
let voice, utterance;

const speak = (text, volume = 0.4) => {
  if (!sfx) return;
  if (synth.cancel) synth.cancel();
  utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = voice;
  utterance.volume = volume * config.volmul;
  utterance.rate = 0.8;
  synth.speak(utterance);
};

const win = () => {
  [...document.getElementsByClassName("circle")].forEach((circle, i) => {
    circle.innerText = vassals[i % vassals.length];
  });
  winning = true;
  music = false;
  contexts.forEach((ac) => {
    if (ac && ac.state == "running") {
      ac.close();
    }
  });
  contexts = [];
  if (interval) {
    clearInterval(interval);
  }
  war.style.display = "none";
  chooser.style.display = "none";
  holder.style.opacity = "1";
  zzfx(...low);
  zzfx(
    ...[
      0.7,
      0,
      200,
      0.1,
      3,
      0.2,
      ,
      3.5,
      ,
      ,
      100,
      ,
      0.25,
      ,
      ,
      ,
      ,
      0.42,
      0.12,
      0.5,
    ]
  );
  zzfx(...[0.7, 0, 400, 0.1, 3, 0.2, , 3.5, , , , , , , , , , 0.72, 0.12, 0.5]);

  let highs = [...document.getElementsByClassName("circle")]
    .concat([...document.getElementsByClassName("light")])
    .concat([document.getElementById("central")]);

  setTimeout(() => {
    nextSlide("middle");
    document.body.classList.add("winning");
    document.getElementById("winners").style.display = "block";
    speak("We bless you, and your wonderful efforts.");
    setTimeout(() => {
      const mPart = ["svg_1", "svg_2", "svg_3", "svg_4"];
      let mIndex = -1;
      const monk = document.getElementById("monk");
      const lyric = 0.3;

      setInterval(() => {
        mIndex += 1;
        const part = document.getElementById(mPart[mIndex % mPart.length]);
        part.style.transform = `translate3d(${
          Math.random() * 10 - 5
        }px,0px, 0)`;
        if (it % 2 == 0) {
          zzfx(...[0.03, 0, 1501, , 0.12, , , 2, , , , , , , , , , 0, 0.05]);
        } else {
          zzfx(...[0.06, 0, 501, , 0.12, , , 2, , , , , , , , , , 0, 0.05]);
        }
      }, 200);

      setInterval(() => {
        zzfx(...[1, 0, 121, , 0.12, , , 4, , , , , , , , , , 0, 0.05]);

        [...new Array(4)].forEach(
          () =>
            (highs[
              ~~(Math.random() * highs.length)
            ].style.filter = `hue-rotate(${Math.random() * 360}deg)`)
        );

        monk.style.filter = `hue-rotate(${Math.random() * 20 - 10}deg)`;
      }, 400);

      setInterval(() => {
        monk.style.transform = `scale(1.5) translate3d(${
          Math.random() * 180
        }%,350px, 0) rotate(${Math.random() > 0.5 ? -3 : 3}deg`;
      }, 5000);
      let it = 0;
      setInterval(() => {
        it += 1;
        const random = randomName(emojis[~~(Math.random() * emojis.length)]);

        if (it % 3 == 0) {
          document.getElementById("winners").classList.remove("window");
          nextSlide("middle");
        }

        if (it % 4 == 0) {
          Math.random() > 0.5
            ? Math.random() > 0.5
              ? speak("My lady? My lady lady? wha?", lyric)
              : speak("My lord? What's up.", lyric)
            : speak(
                `My goodness, ${random.split(",")[0]}, a trip to ${random
                  .split(", of")[1]
                  .trim()}? ${
                  Math.random() > 0.5 ? "Never been there!" : "Sounds Lovely!"
                }`,
                lyric
              );
        } else {
          speak(
            [
              "Hello, ",
              "Hi there, ",
              "My dear, ",
              "Welcome, ",
              "We bless your efforts, ",
            ][~~(Math.random() * 5)] + random.split(",")[0],
            lyric
          );
        }
      }, 10000);
      setInterval(() => {
        [...new Array(4)].forEach((o, i) => {
          setTimeout(() => {
            zzfx(...bell);
            highs.forEach(
              (el) => (el.style.filter = `hue-rotate(${90 * (i + 1)}deg)`)
            );
          }, i * 1000);
        });
      }, 25000);
    }, 5000);
  }, 5000);
};
