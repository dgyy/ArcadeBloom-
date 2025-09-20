let isPlaying = false;
let currentMusic: () => void = idle;
const gain = 0.3;
let timeoutId: ReturnType<typeof setInterval> | null = null;
let oscillators: OscillatorNode[] = [];

export function configSound(): void {
  function setAction() {
    currentMusic = action;
    if (isPlaying) {
      stop();
      currentMusic();
    }
  }
  function setIdle() {
    currentMusic = idle;
    if (isPlaying) {
      stop();
      currentMusic();
    }
  }
  window.addEventListener("beginLevel", setAction);
  window.addEventListener("reset", setIdle);
  window.addEventListener("gameOver", setIdle);
  window.addEventListener("gameComplete", setIdle);
  window.addEventListener("reset", () => {
    window.removeEventListener("reset", setIdle);
    window.removeEventListener("beginLevel", setAction);
    window.removeEventListener("gameOver", setIdle);
    window.removeEventListener("gameComplete", setIdle);
  });
}

export function startSound(button: HTMLElement): void {
  stop();
  isPlaying = !isPlaying;
  if (isPlaying) {
    currentMusic();
    button.innerHTML = "Music is on";
  } else {
    button.innerHTML = "Music is off";
  }
}

export function idle() {
  const steps = [
    14, 15, 14, 18, 19, 18, 14, 15, 14, 18, 19, 18, 8, 9, 8, 14, 15, 14, 10, 11,
    10, 12, 13, 12, 14, 15, 14, 12, 13, 12, 14, 15, 14, 12, 11, 12, 15, 14, 15,
    18, 17, 18, 14, 15, 14, 18, 17, 18, 17, 18, 18, 17, 17, 18, 18, 17, 17, 18,
    18,
  ];
  stop();
  play(steps, 350, 0.2);
}

export function action() {
  const steps = [
    19, 19, 20, 20, 19, 19, 20, 20, 19, 19, 20, 20, 19, 19, 20, 20, 16, 16, 16,
    16, 16, 16, 16, 16, 15, 15, 15, 15, 15, 15, 15, 15,
  ];
  stop();
  play(steps, 440, 0.1);
}

function stop() {
  oscillators.forEach((oscillator) => {
    oscillator.stop();
  });
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
}

export function play(steps: number[], frequency: number, tempo: number): void {
  playOnce(steps, frequency, tempo);
  timeoutId = setInterval(
    () => {
      playOnce(steps, frequency, tempo);
    },
    steps.length * tempo * 1000,
  );
}

export function playOnce(
  steps: number[],
  frequency: number,
  tempo: number,
): void {
  const audioCtx = new window.AudioContext();
  const gainNode = audioCtx.createGain();
  gainNode.connect(audioCtx.destination);
  gainNode.gain.value = 1;
  oscillators = steps.map((value, index) => {
    const oscillator = audioCtx.createOscillator();
    oscillator.type = "sine";
    oscillator.start(index * tempo);
    oscillator.frequency.setValueAtTime(
      frequency * 1.06 ** (13 - value),
      tempo * index,
    );
    gainNode.gain.setValueAtTime(gain, index * tempo);
    gainNode.gain.setTargetAtTime(0.0001, index * tempo + tempo - 0.02, 0.005);
    oscillator.stop(index * tempo + tempo);
    oscillator.connect(gainNode);
    return oscillator;
  });
}
