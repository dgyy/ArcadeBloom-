'use strict';

const reviewedAt = '2026-07-21';
const reviewer = 'ArcadeBloom editorial';
const evidence = (repo, branch = 'main') => ({ repositoryUrl: `https://github.com/${repo}`, readmeUrl: `https://github.com/${repo}/blob/${branch}/README.md`, licenceUrl: `https://github.com/${repo}/blob/${branch}/LICENSE` });
const hold = (sourceKey, repo, reason, branch) => ({ sourceKey, decision: 'hold', reviewedAt, reviewer, reason, evidence: evidence(repo, branch) });

module.exports = [
    hold('github:mohammadfirmansyah/tank-destroyer', 'mohammadfirmansyah/tank-destroyer', 'Controls are documented, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    hold('github:lmellblom/tddd23-arrows', 'lmellblom/TDDD23-Arrows', 'The extracted images are individual game assets rather than a reviewed gameplay capture, and the README does not document controls.'),
    {
        sourceKey: 'github:galiyo118/magic-arena', decision: 'approved', reviewedAt, reviewer, evidence: evidence('Galiyo118/magic-arena'),
        catalogue: {
            slug: 'magic-arena', name: 'Magic Arena', category: 'action',
            tagline: 'Create a room, choose one of five wizard classes, and race other players to ten eliminations.',
            about: `Magic Arena is Galiyo118's top-down multiplayer wizard game for as many as eight browser players. A host creates a room and shares its four-letter code, everyone selects a class in the lobby, and any participant can start the match. The server chooses one of three arenas at random, tracks combat authoritatively, and ends the round when a player reaches ten eliminations. A rematch resets scores and selects another map.

Five classes provide different basic and special attacks. Pyromancer combines fireballs with a burning cone, Frostweaver slows targets and constructs a temporary wall, Stormcaller pairs chain bolts with a delayed area strike, Hexblade fights at close range and roots opponents, and Alchemist throws acid before creating a field that heals allies and then harms enemies. Players can change class while waiting to respawn, allowing counter-picks during a match. Eliminations restore twenty-five health, passive regeneration supports recovery, new spawns receive brief protection, and every hit applies knockback. The Node and Socket.IO server owns movement, collision, damage, effects, and victory decisions, while Phaser clients send input and interpolate received state. Runtime-generated sprites and synthesized audio accompany the MIT-licensed source.`,
            howToPlay: `Create a room and share its four-letter code, or join a friend's room with their code. Choose a wizard class in the lobby and start when the group is ready. Move with WASD, aim with the mouse, and hold the left button for repeated basic attacks. Right-click to use the class special ability, press Space to dash, and hold Shift to sprint. Hold Tab to inspect the live scoreboard and press M to mute sound.

The first player to ten eliminations wins. Use walls and arena spacing to avoid projectiles, and remember that successful eliminations restore health. Watch each special cooldown rather than using it without a clear target. You may switch class during a respawn wait, so change when another player's range, wall, root, or healing field consistently counters the current choice. Freshly spawned players have two seconds of protection; reposition instead of firing into that window. After the scoreboard appears, select rematch for a clean score and a newly chosen random map.`,
            keyFeatures: ['Private four-letter rooms for up to eight players', 'Five classes with distinct basic and special attacks', 'First-to-ten server-authoritative combat', 'Three randomly selected arenas and mid-match class switching', 'Runtime-generated pixel sprites and synthesized effects'],
            screenshots: ['/screenshots/magic-arena.png'], sourceName: 'Galiyo118', sourceUrl: 'https://magic-arena-production.up.railway.app/', licence: 'MIT', licenceStatus: 'osi-approved',
            tags: ['multiplayer', 'shooter', 'skill-based', 'couch-co-op', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-07-19', featured: false,
        },
    },
    hold('github:thecrusader25225/space-shooter', 'thecrusader25225/space-shooter', 'Images exist, but the reviewed documentation provides insufficient concrete control and objective evidence.'),
    hold('github:steve-levesque/portfolio-unity-fpstutorial', 'steve-levesque/Portfolio-Unity-FPSTutorial', 'The repository is identified as an FPS tutorial portfolio and provides no reviewed gameplay controls.'),
    hold('github:rajdeep-ghosh/space-shooter', 'rajdeep-ghosh/space-shooter', 'Images exist, but the reviewed documentation provides insufficient concrete control and objective evidence.'),
    hold('github:awf-cpu/taba', 'awf-cpu/taba', 'Repository images exist, but the reviewed documentation provides no concrete player controls and derivative-language signals need review.'),
    hold('github:dereckmezquita/ts-bouncy-balls', 'dereckmezquita/ts-bouncy-balls', 'Some input text and images are available, but the reviewed documentation does not establish a game objective, scoring loop, or fail condition.'),
    { sourceKey: 'github:michaelkolesidis/cherry-charm', decision: 'rejected', reviewedAt, reviewer, reason: 'The project is a simulated slot machine with adjustable bets, coin balances, reels, and winning combinations; gambling content is outside the intended catalogue.', evidence: evidence('michaelkolesidis/cherry-charm') },
    {
        sourceKey: 'github:bhanu2006-24/racing-game', decision: 'approved', reviewedAt, reviewer, evidence: evidence('bhanu2006-24/racing-game'),
        catalogue: {
            slug: 'poly-city-racer-turbo', name: 'Poly City Racer: Turbo', category: 'racing-sports',
            tagline: 'Race three AI cars for three laps through a procedurally built neon city with drifting and nitro.',
            about: `Poly City Racer: Turbo is Bhanu Pratap Saini's three-dimensional browser race through a neon cyberpunk city. A curved circuit runs between more than three hundred procedurally placed buildings, with fog, lighting, particle effects, and a camera whose field of view changes as the car accelerates. The championship consists of three laps against three computer-controlled opponents, and a position display plus minimap tracks the developing order.

The driving model includes acceleration, friction, reversing, steering, controlled drifts, a higher nitro speed limit, and collision responses. Opponents follow the course with differing speed strategies and collision avoidance, while leaving the road and striking buildings can reverse the player's momentum. Nitro produces its strongest benefit on a straight, whereas braking and measured steering preserve speed through bends. A countdown separates the menu from the start and a dedicated victory presentation marks a first-place finish. The current release focuses on one procedural city circuit and desktop keyboard input; multiple tracks, time trials, mobile controls, and multiplayer remain roadmap ideas rather than catalogue claims. The self-contained Three.js, JavaScript, HTML, and CSS project is released under the MIT licence.`,
            howToPlay: `Press W or Up to accelerate. Use S or Down to brake and reverse, and steer with A and D or the Left and Right arrows. Hold Shift for nitrous boost, use Space for additional braking, and press R to reset the car if it becomes stuck or leaves the useful course area.

Complete three laps before the three AI opponents. Build speed on straights, but release acceleration or brake before a tight bend so the drift remains controllable. Save nitro for sections where the car can travel straight long enough to use its higher maximum speed; activating it while turning often carries the car into a building and costs more time than it gains. Follow the minimap and position display to judge whether an opponent is close. Avoid city structures because collisions reverse momentum. Crossing the final line ahead of all three rivals triggers the victory screen.`,
            keyFeatures: ['Three-lap championship against three AI drivers', 'Procedural neon city with more than three hundred buildings', 'Acceleration, braking, reversing, drifting, and nitro physics', 'Real-time position tracking and minimap', 'Dynamic camera, fog, lighting, and driving particles'],
            screenshots: ['/screenshots/poly-city-racer-turbo.png'], sourceName: 'Bhanu Pratap Saini', sourceUrl: 'https://bhanu2006-24.github.io/racing-game/', licence: 'MIT', licenceStatus: 'osi-approved',
            tags: ['racing', 'skill-based', 'physics', 'open-source'], addedDate: reviewedAt, releaseDate: '2025-11-23', featured: false,
        },
    },
    hold('github:md-abu-kayser/drive-mad', 'md-abu-kayser/drive-mad', 'Controls are described, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:xmgzxmgz/tetris-99', 'xmgzxmgz/TETRIS-99', 'The project uses protected Tetris branding and lacks sufficient independent source evidence.'),
    {
        sourceKey: 'github:helmedeiros/cat-hop-cloud', decision: 'approved', reviewedAt, reviewer, evidence: evidence('helmedeiros/Cat-Hop-Cloud'),
        catalogue: {
            slug: 'cat-hop-cloud', name: 'Cat Hop Cloud', category: 'puzzle',
            tagline: 'Plan numbered cloud jumps, visit every checkpoint, and return home before the cat’s luck runs out.',
            about: `Cat Hop Cloud is Helme de Medeiros's compact route-planning puzzle, originally built for the 2024 js13kGames competition as a self-contained file below thirteen compressed kilobytes. A lost black cat begins on cloud zero with one hundred luck points. The goal is to visit every checkpoint and return to the starting cloud while retaining some luck, but each numbered jump costs the same amount of luck as its distance.

Cloud effects complicate the calculation. Thunder consumes two additional points, lucky clouds restore five, wind adds one free step to the next jump, and one-way clouds force the following move to travel exactly two positions. After the fifth turn, every later turn also costs one extra luck, discouraging wasteful cycles. Version two contains ten hand-designed levels that progressively introduce checkpoint routing, wind boosts, forced movement, and combinations of all cloud types. Because players choose jump distance directly with number keys, the puzzle is about predicting the landing sequence and its resource cost rather than controlling an animation in real time. Shapes are drawn from code and the game has no external dependencies or bundled image art. Its complete source is available under the MIT licence.`,
            howToPlay: `Press a number from 1 through 9 to jump that many clouds forward. Each jump normally spends luck equal to its distance. Visit every checkpoint, then land back on cloud zero with at least one luck point remaining. Press R to reset the current level and I to show or hide the instruction panel.

Before choosing a number, count the landing cloud and include its effect in the route. Thunder costs two extra luck, lucky clouds restore five, and wind makes the next jump travel one additional cloud without raising its base cost. A one-way cloud requires the following jump to be exactly two. From turn six onward, each turn has an extra one-point penalty, so a short move is not always cheaper when it adds another turn. Work backward from required checkpoints and the return to cloud zero, then use wind or lucky clouds to make the total route affordable.`,
            keyFeatures: ['Ten hand-designed route-planning levels', 'Luck resource spent according to jump distance', 'Thunder, wind, lucky, checkpoint, and one-way clouds', 'Late-turn penalty discouraging inefficient paths', 'Single-file sub-13KB competition build'],
            screenshots: ['/screenshots/cat-hop-cloud.gif'], sourceName: 'Helme de Medeiros', sourceUrl: 'https://helmedeiros.github.io/Cat-Hop-Cloud/', licence: 'MIT', licenceStatus: 'osi-approved',
            tags: ['brain-burner', 'turn-based', '13kb', 'minimal', 'open-source'], addedDate: reviewedAt, releaseDate: '2024-09-13', featured: false,
        },
    },
    hold('github:davidpatlas-ai/cable-game', 'DavidPatlas-AI/cable-game', 'The reviewed repository provides neither concrete controls nor a durable gameplay screenshot, and its source identity requires separate AI-origin review.'),
    hold('github:bodhiprotocol/tetris', 'BodhiProtocol/tetris', 'The project uses protected Tetris branding, has no durable gameplay screenshot, and is explicitly described as AI generated.'),
    hold('github:r0mb0/lexiclash_street_edition', 'R0mb0/LexiClash_Street_Edition', 'The README displays a Crafted with AI attribution badge, requiring a separate originality review.'),
    hold('github:inottn/2048', 'inottn/2048', 'The reviewed repository provides neither concrete controls nor a durable gameplay screenshot and uses an established game identity.'),
    hold('github:bte808/fun-20260529-a-buffer-relay', 'bte808/fun-20260529-a-buffer-relay', 'Controls are described, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    hold('github:ivanbbaev/snake-game', 'IvanBBaev/snake-game', 'Controls are described, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:yureitzk/pinpoint', 'yureitzk/pinpoint', 'Controls are described, but no durable author-supplied gameplay screenshot was found.'),
];
