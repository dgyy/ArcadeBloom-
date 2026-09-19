import { seeded, lockRound, lockResult } from '../_shared/engine.js';
import { $, tone, seedForRun, finish } from '../_shared/shell.js';

let state = 'idle', random, round = 0, score = 0, lives = 3, combo = 0, perfects = 0, logs = [];
let course, angle = 0, last = 0, activeTime = 0;
function render() {
    $('#needle').setAttribute('transform', `rotate(${angle} 160 160)`);
    $('#round').textContent = `${Math.min(round + 1, 20)} / 20`;
    $('#score').textContent = score;
    $('#lives').textContent = lives;
    $('#combo').textContent = combo ? `×${(1 + Math.min(combo, 5) * .2).toFixed(1)}` : '×1.0';
}
function setupRound() {
    course = lockRound(random, round); angle = course.start; activeTime = 0; last = 0;
    const length = 2 * Math.PI * 110;
    $('#target').setAttribute('stroke-dasharray', `${length * course.width / 360} ${length}`);
    $('#target').setAttribute('transform', `rotate(${course.target - course.width / 2 - 90} 160 160)`);
    $('#status').textContent = `Lock ${round + 1}: ${course.direction === 1 ? 'clockwise' : 'counterclockwise'}${course.feint ? ', shifting target' : ''}. Catch the blue arc.`;
    $('#action').textContent = 'Lock now'; state = 'running'; render();
}
function end() {
    state = 'ended'; $('#action').textContent = 'Play again'; $('#pause').disabled = true;
    $('#status').textContent = lives ? 'All twenty locks attempted. Course complete.' : 'Signal lost. Your next run starts fresh.';
    finish(score, `${perfects} perfect locks. The last locks demand narrow timing windows and shifting targets.`, logs);
}
function attempt(timedOut = false) {
    const result = timedOut ? { hit: false, perfect: false, points: 0 } : lockResult(angle, course.target, course.width);
    if (result.hit) {
        const points = Math.round(result.points * (1 + Math.min(combo, 5) * .2));
        score += points; combo++; if (result.perfect) perfects++;
        logs.push(`Lock ${round + 1}: ${result.perfect ? 'Perfect' : 'Caught'} · +${points}`);
        $('#status').textContent = `${result.perfect ? 'Perfect center!' : 'Signal caught.'} +${points} points.`; tone(result.perfect ? 880 : 620);
    } else {
        lives--; combo = 0; logs.push(`Lock ${round + 1}: ${timedOut ? 'Timed out' : 'Missed'} · +0`);
        $('#status').textContent = timedOut ? 'Signal timed out after 9 seconds.' : 'Outside the arc. Chain reset.'; tone(160, .18);
    }
    round++; render();
    if (round >= 20 || !lives) { end(); return; }
    state = 'between'; $('#action').textContent = 'Next lock'; $('#pause').disabled = true;
}
$('#action').onclick = () => {
    if (state === 'idle' || state === 'ended') {
        random = seeded(seedForRun()); round = score = combo = perfects = 0; lives = 3; logs = [];
        $('#mode').disabled = true; setupRound(); $('#pause').disabled = false;
    } else if (state === 'between') { setupRound(); $('#pause').disabled = false; }
    else if (state === 'running') attempt();
    else if (state === 'paused') resume();
};
function pause() {
    if (state !== 'running') return;
    state = 'paused'; $('#status').textContent = 'Paused. Resume when you are ready.';
    $('#action').textContent = 'Resume'; $('#pause').textContent = 'Resume';
}
function resume() {
    state = 'running'; last = 0; $('#action').textContent = 'Lock now'; $('#pause').textContent = 'Pause';
    $('#status').textContent = 'Catch the blue arc.';
}
$('#pause').onclick = () => state === 'paused' ? resume() : pause();
document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); });
document.addEventListener('keydown', e => {
    if (e.code === 'Space' && !e.repeat && !['BUTTON', 'SELECT', 'INPUT', 'A'].includes(e.target.tagName)) { e.preventDefault(); $('#action').click(); }
});
function frame(time) {
    if (state === 'running') {
        const delta = last ? Math.min(time - last, 100) : 0; last = time;
        activeTime += delta;
        angle = (angle + course.direction * course.speed * delta / 1000 + 360) % 360;
        $('#needle').setAttribute('transform', `rotate(${angle} 160 160)`);
        if (course.feint && activeTime > 3500) {
            course.target = (course.target + course.direction * 22 * delta / 1000 + 360) % 360;
            $('#target').setAttribute('transform', `rotate(${course.target - course.width / 2 - 90} 160 160)`);
        }
        if (activeTime > 9000) attempt(true);
    }
    requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
