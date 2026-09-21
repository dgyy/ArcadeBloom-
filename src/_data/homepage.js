const games = require('./games');
const tags = require('./tags');
const site = require('./site');
const { createDirectoryPolicy } = require('../../scripts/lib/directory-policy');

const isPublic = createDirectoryPolicy(games);
const publicGames = games.filter((game) => isPublic(game.sourceKey));
const newest = (a, b) => b.addedDate.localeCompare(a.addedDate);
const illustrated = (a, b) => Number(Boolean(b.screenshots.length)) - Number(Boolean(a.screenshots.length)) || newest(a, b);
const spotlight = publicGames.find((game) => game.slug === 'circle-club');
const picks = publicGames.filter((game) => game !== spotlight && game.screenshots.length)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || newest(a, b)).slice(0, 6);
const displayed = new Set([spotlight, ...picks].filter(Boolean).map((game) => game.slug));
const latest = publicGames.filter((game) => !displayed.has(game.slug)).sort(newest).slice(0, 6);
latest.forEach((game) => displayed.add(game.slug));
const ai = publicGames.filter((game) => game.ai && !displayed.has(game.slug))
    .sort((a, b) => Number(b.ai.types.includes('ai-gameplay')) - Number(a.ai.types.includes('ai-gameplay')) || newest(a, b)).slice(0, 6);
const used = new Set([spotlight, ...picks, ...latest, ...ai].filter(Boolean).map((game) => game.slug));
const themes = [
    { slug: 'quick-fix', title: 'A little break. A new obsession.', description: 'Small games for your next spare moment.' },
    { slug: 'brain-burner', title: 'Give your brain something to do', description: 'Patterns, puzzles and satisfying little breakthroughs.' },
].flatMap((theme) => {
    const candidates = publicGames.filter((game) => game.tags.includes(theme.slug));
    if (candidates.length < site.minGamesPerTag) return [];
    const selected = candidates.filter((game) => !used.has(game.slug)).sort(illustrated).slice(0, 6);
    if (selected.length < 4) return [];
    selected.forEach((game) => used.add(game.slug));
    return [{ ...theme, games: selected }];
});

module.exports = {
    spotlight, picks, latest, ai, themes,
    shortcuts: ['quick-fix', 'brain-burner', 'physics', 'sandbox', 'retro', 'text-based']
        .map((slug) => tags.find((tag) => tag.slug === slug))
        .filter((tag) => tag && publicGames.filter((game) => game.tags.includes(tag.slug)).length >= site.minGamesPerTag),
    more: publicGames.filter((game) => !used.has(game.slug)).sort(illustrated).slice(0, 12),
};
