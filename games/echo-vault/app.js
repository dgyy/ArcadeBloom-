import { seeded, echoRound, echoInput, echoPoints } from '../_shared/engine.js';
import { $, tone, seedForRun, finish } from '../_shared/shell.js';

const pads = [...document.querySelectorAll('.pad')];
let state = 'idle', random, round = 0, score = 0, lives = 3, sequence = [], cursor = 0;
let errors = 0, replayed = false, logs = [], course, generation = 0;
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
function enable(enabled) { pads.forEach(pad => pad.disabled = !enabled); }
function update() {
    $('#round').textContent = `${Math.min(round + 1, 12)} / 12`; $('#score').textContent = score; $('#lives').textContent = lives;
    $('#rule').textContent = course ? [course.reverse && 'Reverse', course.mirror && 'Mirror'].filter(Boolean).join(' + ') || 'Forward' : 'Forward';
    $('#progress').replaceChildren(...sequence.map((_, i) => { const dot = document.createElement('i'); if (i < cursor) dot.className = 'done'; return dot; }));
}
async function showSequence() {
    state = 'watch'; enable(false); $('#replay').disabled = true; $('#action').disabled = true;
    const token = ++generation;
    $('#status').textContent = `Watch ${course.sequence.length} tiles. Then repeat ${course.reverse ? 'in reverse order' : course.mirror ? 'with mirrored columns' : 'in the same order'}.`;
    await delay(650);
    for (const cell of course.sequence) {
        if (token !== generation) return;
        pads[cell].classList.add('lit'); tone(260 + cell * 65, .16);
        await delay(course.duration);
        if (token !== generation) return;
        pads[cell].classList.remove('lit');
        await delay(180);
    }
    if (token !== generation) return;
    state = 'input'; enable(true); $('#action').disabled = true;
    $('#replay').disabled = replayed;
    $('#status').textContent = course.reverse ? 'Your turn. Last tile first.' : 'Your turn. Repeat the sequence.';
}
function nextRound() {
    course = echoRound(random, round); sequence = echoInput(course.sequence, course);
    cursor = errors = 0; replayed = false; update(); void showSequence();
}
function end() {
    state = 'ended'; generation++; enable(false); $('#replay').disabled = true;
    $('#action').disabled = false; $('#action').textContent = 'Play again';
    $('#status').textContent = lives ? 'All twelve chambers opened.' : 'Vault sealed. Try a new run.';
    finish(score, `${round} of 12 chambers opened. Reverse and mirror rules arrive later; replays cost 100 points per chamber.`, logs);
}
function input(cell) {
    if (state !== 'input') return;
    pads[cell].classList.add('lit'); setTimeout(() => pads[cell].classList.remove('lit'), 140);
    if (cell !== sequence[cursor]) {
        lives--; errors++; tone(130, .2); pads[cell].classList.add('wrong'); setTimeout(() => pads[cell].classList.remove('wrong'), 200);
        $('#status').textContent = 'Wrong tile. Keep your place and try the next expected tile.'; update();
        if (!lives) { logs.push(`Chamber ${round + 1}: sealed after ${cursor} correct tiles`); end(); } return;
    }
    tone(260 + cell * 65); cursor++; update();
    if (cursor === sequence.length) {
        const points = echoPoints(sequence.length, errors, replayed); score += points;
        logs.push(`Chamber ${round + 1}: ${[course.reverse && 'Reverse', course.mirror && 'Mirror'].filter(Boolean).join(' + ') || 'Forward'} · +${points}${replayed ? ' · replay used' : ''}`);
        round++; update(); enable(false); $('#replay').disabled = true;
        if (round === 12) { end(); return; }
        state = 'between'; $('#action').disabled = false; $('#action').textContent = 'Next chamber';
        $('#status').textContent = `Chamber open. +${points} points.`;
    }
}
pads.forEach((pad, index) => pad.onclick = () => input(index));
$('#action').onclick = () => {
    if (state === 'idle' || state === 'ended') {
        random = seeded(seedForRun()); round = score = 0; lives = 3; logs = []; $('#mode').disabled = true; nextRound();
    } else if (state === 'between') nextRound();
    else if (state === 'paused') void showSequence();
};
$('#replay').onclick = () => {
    if (state !== 'input' || replayed) return;
    replayed = true; cursor = 0; update(); void showSequence();
};
document.addEventListener('keydown', e => {
    if (e.repeat || ['INPUT', 'SELECT'].includes(e.target.tagName)) return;
    if (/^[1-9]$/.test(e.key)) { e.preventDefault(); input(Number(e.key) - 1); }
});
document.addEventListener('visibilitychange', () => {
    if (document.hidden && state === 'watch') {
        generation++; pads.forEach(p => p.classList.remove('lit')); state = 'paused';
        $('#status').textContent = 'Playback paused while away. Watch it again when ready.';
        $('#action').disabled = false; $('#action').textContent = 'Resume playback';
    }
});
