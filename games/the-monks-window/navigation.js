const windowScale = () => {
  const hScale = window.innerHeight / config.height;
  const wScale = window.innerWidth / config.width;
  config.size = hScale > wScale ? wScale : hScale;
  container.style = `transform: scale(${config.size})`;
};

window.onresize = windowScale;

const viewportTransform = (val) => {
  val = val.map((val) => -val);
  return `transform: rotateZ(${val[5]}deg) rotateY(${val[4]}deg) rotateX(${val[3]}deg) translate3d(${val[0]}px, ${val[1]}px, ${val[2]}px)`;
};

const contentTransform = (val) => {
  return `transform: translate(-50%, -50%) translate3d(${val[0]}px, ${val[1]}px, ${val[2]}px) rotateX(${val[3]}deg) rotateY(${val[4]}deg) rotateZ(${val[5]}deg);`;
};

let ns, points, degs, vals;
ns = null;
points = [0, 0, 0];
degs = [0, 0, 0];
viewport.style = viewportTransform(config.base);

const warbtn = document.getElementById("war");

const nextSlide = (ns) => {
  warbtn.classList.remove("shown");
  if (ns == "middle" && !winning) {
    speak("we bless you, and your efforts", 0.7);
    setTimeout(() => {
      warbtn.classList.add("shown");
      setTimeout(() => {
        zzfx(...bell);
      }, 800);
    }, 2900);
  }
  ns = document.getElementById(ns);
  slides.forEach((slide) => slide.classList.remove("active"));
  ns.classList.add("active");

  (points = [ns.dataset.x || 0, ns.dataset.y || 0, ns.dataset.z || 0]),
    (degs = [0, currentIndex * -10, 0]);

  vals = points.concat(degs);

  ns.style = contentTransform(vals);
  viewport.append(ns);

  container.style = `transform: scale(${config.size})`;

  windowScale();
  ns.style = contentTransform(vals);
  viewport.style = viewportTransform(vals);
  currentIndex = (currentIndex + 1) % slideValues.length;
};

slides.forEach((slide, index) => {
  points = Object.values(slide.dataset).map((n) => Number(n));
  degs = [0, index * -30, 0];

  vals = points.concat(degs);
  slide.style = contentTransform(vals);
});

const slideValues = ["middle", "gmatch", "gboard", "window"]; // Your array of slide values

/* Helpers */
let currentIndex = 0; // Initial index
