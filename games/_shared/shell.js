import { challenge } from './engine.js';

export const $ = selector => document.querySelector(selector);
export const slug = document.body.dataset.game;
export const incoming = challenge(location.search);
let currentSeed = incoming?.seed || '';
let lastResult = null;
let sounds = false;
let audio;
let records = [];
try {
    const saved = JSON.parse(localStorage.getItem(slug + ':runs') || '[]');
    if (Array.isArray(saved)) records = saved.filter(r => r && Number.isInteger(r.score) && r.score >= 0 && r.score <= 20000 && typeof r.seed === 'string').slice(0, 20);
} catch { /* Private browsing still supports play. */ }

$('#best').textContent = records.length ? Math.max(...records.map(r => r.score)).toLocaleString() : '—';
if (incoming) {
    $('#invitation').hidden = false;
    $('#invitation').textContent = incoming.score === null ? 'Shared course loaded. Play the same challenge.' : `Your friend scored ${incoming.score.toLocaleString()}. Same course. Your turn.`;
}

export function seedForRun() {
    const mode = $('#mode').value;
    currentSeed = mode === 'daily' ? 'd-' + new Date().toISOString().slice(0, 10)
        : mode === 'shared' && incoming ? incoming.seed
        : 'p-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36);
    $('#course').textContent = currentSeed.startsWith('d-') ? 'Daily · ' + currentSeed.slice(2) : 'Practice course';
    if (incoming && currentSeed !== incoming.seed) {
        $('#invitation').textContent = 'You selected a different course. Choose Friend’s course to replay the shared challenge.';
    } else if (incoming) {
        $('#invitation').textContent = incoming.score === null ? 'Shared course loaded. Play the same challenge.' : `Your friend scored ${incoming.score.toLocaleString()}. Same course. Your turn.`;
    }
    lastResult = null;
    $('#results').hidden = true;
    $('#share-status').textContent = '';
    $('#copy-fallback').hidden = true;
    return currentSeed;
}

if (incoming) {
    const option = new Option('Friend’s course', 'shared', true, true);
    $('#mode').add(option);
}

export function tone(note = 440, duration = .1) {
    if (!sounds) return;
    try {
        audio ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audio.state === 'suspended') void audio.resume();
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.frequency.value = note;
        gain.gain.setValueAtTime(.035, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + duration);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(); oscillator.stop(audio.currentTime + duration);
    } catch { /* Sound is optional. */ }
}
$('#sound').onclick = () => {
    sounds = !sounds;
    $('#sound').setAttribute('aria-pressed', String(sounds));
    $('#sound').textContent = sounds ? 'Sound on' : 'Sound off';
    tone();
};

export function finish(score, summary, rounds) {
    lastResult = { score, seed: currentSeed, summary };
    records.unshift({ score, seed: currentSeed }); records = records.slice(0, 20);
    try { localStorage.setItem(slug + ':runs', JSON.stringify(records)); } catch { /* Scores are optional. */ }
    $('#best').textContent = Math.max(...records.map(r => r.score)).toLocaleString();
    $('#final-score').textContent = score.toLocaleString();
    $('#summary').textContent = summary;
    $('#comparison').textContent = incoming?.seed === currentSeed && incoming.score !== null
        ? score > incoming.score ? `You beat the shared score by ${score - incoming.score}.` : score === incoming.score ? 'A perfect tie. Try a rematch.' : `${incoming.score - score} points to catch the shared score.` : 'Send this course to a friend. See what they can do.';
    $('#round-log').replaceChildren(...rounds.map(text => {
        const li = document.createElement('li'); li.textContent = text; return li;
    }));
    $('#results').hidden = false;
    $('#mode').disabled = false;
    $('#results').focus({ preventScroll: true });
    $('#results').scrollIntoView({ block: 'nearest' });
}

$('#again').onclick = () => {
    $('#action').click();
    $('.console').scrollIntoView({ block: 'center' });
};

$('#share').onclick = async () => {
    if (!lastResult) return;
    const url = new URL(location.href); url.search = ''; url.hash = '';
    url.searchParams.set('seed', lastResult.seed); url.searchParams.set('score', lastResult.score);
    try {
        await navigator.clipboard.writeText(url.href);
        $('#share-status').textContent = 'Challenge link copied. Send it to a friend.';
    } catch {
        $('#copy-fallback').hidden = false;
        $('#copy-link').value = url.href; $('#copy-link').focus(); $('#copy-link').select();
        $('#share-status').textContent = 'Select and copy this challenge link.';
    }
};
$('#save').onclick = () => {
    if (!lastResult) return;
    const canvas = document.createElement('canvas'); canvas.width = 1200; canvas.height = 630;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = slug === 'pulse-lock' ? '#112941' : '#302445'; ctx.fillRect(0, 0, 1200, 630);
    ctx.strokeStyle = slug === 'pulse-lock' ? '#89dfed' : '#ffb5a0'; ctx.lineWidth = 4;
    ctx.strokeRect(35, 35, 1130, 560); ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif'; ctx.fillText(document.body.dataset.title, 80, 120);
    ctx.font = 'bold 140px sans-serif'; ctx.fillText(lastResult.score.toLocaleString(), 80, 295);
    ctx.font = '28px sans-serif'; ctx.fillText('Same course. Can you beat my score?', 80, 370);
    ctx.font = '24px sans-serif'; ctx.fillText(lastResult.seed, 80, 435);
    ctx.fillText('arcadebloom.com/play/' + slug + '/', 80, 530);
    canvas.toBlob(blob => {
        if (!blob) return;
        const url = URL.createObjectURL(blob); const a = document.createElement('a');
        a.href = url; a.download = slug + '-' + lastResult.score + '.png'; a.click();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        $('#share-status').textContent = 'Score card saved. Copy the challenge link too, so your friend gets the same course.';
    });
};
$('#clear-records').onclick = () => {
    records = []; $('#best').textContent = '—';
    try { localStorage.removeItem(slug + ':runs'); } catch { /* No persistent storage. */ }
    $('#record-status').textContent = 'Local records cleared.';
};
