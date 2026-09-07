'use strict';

// Compose locally; the visitor explicitly sends through their own mail app.
const form = document.getElementById('submission-form');
const kind = document.getElementById('submission-kind');
const scenarioFields = document.getElementById('ai-dungeon-fields');
const scenarioInputs = scenarioFields.querySelectorAll('select');
const gameUrl = document.getElementById('game-url');
const aiUse = document.getElementById('game-ai');
const aiSource = document.getElementById('game-ai-source');
const aiSourceHelp = document.getElementById('ai-source-help');

function updateAiSource() {
    const usesAi = aiUse.value !== 'Not stated';
    aiSource.required = usesAi;
    aiSourceHelp.hidden = !usesAi;
}

function updateScenarioFields() {
    const isScenario = kind.value === 'Published AI Dungeon scenario';
    scenarioFields.hidden = !isScenario;
    scenarioInputs.forEach((input) => { input.disabled = !isScenario; });
    if (isScenario) aiUse.value = 'AI gameplay';
    gameUrl.setCustomValidity('');
    updateAiSource();
}

kind.addEventListener('change', updateScenarioFields);
aiUse.addEventListener('change', updateAiSource);
gameUrl.addEventListener('input', () => gameUrl.setCustomValidity(''));
updateScenarioFields();
form.hidden = false;
form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    if (kind.value === 'Published AI Dungeon scenario') {
        let hostname = '';
        try { hostname = new URL(gameUrl.value).hostname; } catch (_) { /* native URL validation handles this */ }
        if (hostname !== 'play.aidungeon.com') {
            gameUrl.setCustomValidity('Use the Published scenario share URL on play.aidungeon.com.');
            gameUrl.reportValidity();
            return;
        }
    }
    gameUrl.setCustomValidity('');
    const fields = [
        ['Submission type', 'kind'], ['Game', 'name'], ['Official URL', 'url'], ['Creator', 'creator'],
        ['Description / access requirements', 'description'], ['Licence / source', 'licence'],
        ['AI use', 'ai'], ['Creator AI explanation', 'aiSource'],
    ];
    if (kind.value === 'Published AI Dungeon scenario') {
        fields.push(['AI Dungeon content rating', 'scenarioRating'], ['Creator permission', 'scenarioPermission']);
    }
    const body = fields.map(([label, key]) => `${label}: ${String(data.get(key) || '').trim() || 'Not stated'}`).join('\n\n');
    const subject = `Game submission: ${String(data.get('name')).replace(/[\r\n]/g, ' ')}`;
    document.getElementById('draft-text').value = body;
    document.getElementById('draft-link').href = `mailto:hello@arcadebloom.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.getElementById('submission-draft').hidden = false;
    document.getElementById('draft-text').focus();
});
