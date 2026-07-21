'use strict';

const reviewedAt = '2026-07-21';
const reviewer = 'ArcadeBloom editorial';

function evidence(repo, licenceFile = 'LICENSE') {
    return {
        repositoryUrl: `https://github.com/${repo}`,
        readmeUrl: `https://github.com/${repo}/blob/main/README.md`,
        licenceUrl: `https://github.com/${repo}/blob/main/${licenceFile}`,
    };
}

function hold(sourceKey, repo, reason) {
    return { sourceKey, decision: 'hold', reviewedAt, reviewer, reason, evidence: evidence(repo) };
}

module.exports = [
    hold('github:m72900024/los-flight-simulator', 'm72900024/LOS-Flight-Simulator', 'The repository does not provide a durable author-supplied gameplay screenshot, and derivative-language signals require further rights review.'),
    {
        sourceKey: 'github:joelakaufmann-lgtm/depo-doom',
        decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('joelakaufmann-lgtm/depo-doom'),
        catalogue: {
            slug: 'depo-doom', name: 'Depo Doom', category: 'simulation',
            tagline: 'Control a fictional deposition record through questions, objections, exhibits, and tactical responses.',
            about: `Depo Doom is Joel A. Kaufmann's deposition-training arcade game, using the familiar presentation of rounds, health bars, counters, and momentum without depicting physical combat. Each fictional session begins by choosing one of five litigators and a witness from a twelve-character roster. A coin flip then places the player on either side of the table: taking the deposition by asking questions, or defending a witness by responding to opposing counsel.

The two roles exercise different judgment. Examiners establish foundations, work with exhibits, address evasive answers, and identify opportunities to impeach a contradiction. Defenders decide whether to make no objection, identify a form or foundation problem, protect privilege, or create a record about harassment. A simulated seven-hour clock adds pressure, while the review screen explains strong choices, missed issues, and questions that could have been framed more effectively. The cases, testimony, lawyers, and witnesses are expressly fictional, and the author labels the project a simplified training simulation rather than legal advice. The dependency-free single-page game is released under Apache-2.0.`,
            howToPlay: `Choose a litigator, then select a witness and circuit. After the coin flip assigns your role, read each prompt and use the on-screen choices to control the record. When taking the deposition, build the necessary foundation before pursuing important facts, introduce exhibits at the appropriate time, follow up on evasive testimony, and use prior material only when there is a sound basis for impeachment.

When defending, evaluate each incoming question instead of objecting automatically. Choose no objection when the question is proper, identify the specific form defect when it is not, protect privileged material with the appropriate instruction, and make a record when questioning becomes abusive. Watch the record and witness meters as well as the simulated time limit. At the end of the round, open the review and compare its explanation with your decisions before trying another lawyer, witness, or side of the table.`,
            keyFeatures: ['Two distinct examiner and defender roles', 'Five fictional litigators and twelve witness scenarios', 'Questions, exhibits, objections, privilege, and impeachment decisions', 'Post-round review explaining missed and effective choices', 'Self-contained browser game with synthesized presentation'],
            screenshots: ['/screenshots/depo-doom.png'], sourceName: 'Joel A. Kaufmann',
            sourceUrl: 'https://joelakaufmann-lgtm.github.io/depo-doom/', licence: 'Apache-2.0', licenceStatus: 'osi-approved',
            tags: ['text-based', 'skill-based', 'experimental', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-07-10', featured: false,
        },
    },
    {
        sourceKey: 'github:emollick/flipside', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('emollick/flipside'),
        catalogue: {
            slug: 'flipside', name: 'Flipside', category: 'strategy',
            tagline: 'Build an enchanted coin pouch and turn heads, tails, patterns, and reflips into escalating scores.',
            about: `Flipside is Ethan Mollick's seeded coin-flipping roguelike, built around a scoring rule that makes both outcomes useful. Heads contribute Chips, tails contribute Mult, and each toss scores the product of those two totals. The complete pattern adds another layer: all heads forms Midas, all tails forms Nocturne, alternating results form Pendulum, and palindromic sequences form Mirror. A limited shared supply of reflips turns a nearly completed pattern into a decision between chasing a stronger result and preserving resources.

A run spans eight antes, with four tosses available to beat each target. Between bets, earned currency buys passive Charms, enchanted coin materials, one-use Fortunes, and Omens that improve pattern levels. Every third bet introduces a boss rule that disrupts familiar plans. The broader progression includes six starting pouches, four stake tiers, five fixed challenge setups, daily shared seeds, endless play, relics, skip tags, and a persistent profile. The game, generated soundtrack, and art are original to the project, while the engine is tested through headless simulations and action fuzzing. Its single HTML source is MIT licensed.`,
            howToPlay: `Start a run and choose up to five coins for a toss. Resolve the flip, then read the Chips, Mult, and named pattern produced by the result. Spend a reflip on an individual coin when changing one face could complete a valuable pattern, or keep the current result and preserve the shared reflip pool for a later toss. You have four tosses to reach the displayed target for the bet.

After winning, use the shop to shape a build. Charms create passive scoring engines, coin materials alter individual coins, Fortunes provide single-use effects, and Omens raise the value of recurring patterns. Plan purchases around the current pouch instead of treating every upgrade as equally useful. Watch for the special constraint on every third boss bet and adapt before tossing. Across later runs, experiment with unlocked pouches and stake levels, or use challenge and daily modes when you want a fixed setup or shared seed.`,
            keyFeatures: ['Chips multiplied by Mult on every coin toss', 'Named head-and-tail patterns with limited individual reflips', 'More than fifty Charms plus coins, Fortunes, Omens, and relics', 'Eight-ante runs with thirteen disruptive boss rules', 'Daily seeds, challenges, endless mode, and persistent unlocks'],
            screenshots: ['/screenshots/flipside.png'], sourceName: 'Ethan Mollick', sourceUrl: 'https://play-flipside.netlify.app/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['roguelike', 'turn-based', 'procedurally-generated', 'brain-burner', 'open-source'],
            addedDate: reviewedAt, releaseDate: '2026-06-11', featured: false,
        },
    },
    hold('github:samirsaad786/the-hire-wire', 'SamirSaad786/the-hire-wire', 'No durable author-supplied gameplay screenshot was found, and derivative-language signals need further review.'),
    hold('github:axonos-org/become-the-brain-os', 'AxonOS-org/become-the-brain-os', 'The source and some interaction text are available, but no durable author-supplied gameplay screenshot was found.'),
    {
        sourceKey: 'github:romeototo/monster-tapper', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('romeototo/monster-tapper'),
        catalogue: {
            slug: 'monster-tapper-pro', name: 'Monster Tapper PRO', category: 'simulation',
            tagline: 'Tap through monster stages, recruit automatic damage, collect relics, and ascend for permanent power.',
            about: `Monster Tapper PRO is romeototo's browser idle RPG, combining direct clicking with automated damage and long-term progression. Tapping the monster core deals immediate damage and generates essence, while hired units from the barracks and arsenal continue attacking through damage-per-second effects. Rapid taps build a combo multiplier that can raise manual damage as high as five times its normal value, rewarding short bursts of active play rather than leaving every encounter to automation.

Every tenth stage is an elite boss fight with a thirty-second limit; failure sends the run back instead of allowing progress to continue unchecked. Beyond ordinary upgrades, active skills such as Berserk and Midas Touch, permanent passive bonuses, equippable pets, and boss relics create multiple ways to increase output. Biomes shift from forest and volcano settings to void and cyber themes as stages advance. Reaching stage fifty unlocks ascension, restarting the journey in exchange for a lasting global damage multiplier. Local storage preserves progress and calculates gains earned while the browser was closed. The responsive HTML, CSS, JavaScript, and synthesized Web Audio source is published under the MIT licence.`,
            howToPlay: `Click or tap the monster core repeatedly to deal damage and collect essence. Maintain a quick rhythm to fill the combo meter and multiply manual damage, especially when a boss timer is active. Spend essence on stronger tapping power and hire units that add automatic damage per second. Continue through ordinary stages until each tenth-stage boss appears, then concentrate taps and useful active skills to empty its health bar within thirty seconds.

Use the side panels to manage skills, passive bonuses, pets, relics, and achievements. Compare upgrades by the damage they add rather than buying only the cheapest option, and let hired heroes accumulate resources during idle periods. If a boss defeats the run, improve the current build before attempting that stage again. After reaching stage fifty, consider ascending: current stage progress restarts, but the permanent global multiplier makes the following journey faster and supports progress into later biomes and tougher elite encounters.`,
            keyFeatures: ['Manual tapping with a damage combo up to five times', 'Automatic damage from hired heroes and upgrades', 'Timed elite boss battle every ten stages', 'Pets, relics, active skills, passives, and achievements', 'Offline gains and an ascension-based permanent multiplier'],
            screenshots: ['/screenshots/monster-tapper-pro.png'], sourceName: 'romeototo', sourceUrl: 'https://romeototo.github.io/monster-tapper/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['idle', 'skill-based', 'retro', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-04-28', featured: false,
        },
    },
    hold('github:scottzzj/pixel-chicken', 'scottzzj/pixel-chicken', 'The reviewed documentation contains neither concrete controls nor a durable gameplay screenshot.'),
    hold('github:shriram2005/doraemon-game', 'Shriram2005/Doraemon-Game', 'The project directly uses a protected third-party character identity and requires separate rights review.'),
    {
        sourceKey: 'github:alienauthor2054/chemistry-sandbox', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('AlienAuthor2054/Chemistry-Sandbox', 'LICENSE.txt'),
        catalogue: {
            slug: 'chemistry-sandbox', name: 'Chemistry Sandbox', category: 'simulation',
            tagline: 'Place atoms, form molecular bonds, adjust temperature, and explore reactions in an interactive laboratory.',
            about: `Chemistry Sandbox is AlienAuthor2054's in-development molecular simulation for experimenting with high-school chemistry concepts. The browser laboratory lets players introduce hydrogen, carbon, nitrogen, and oxygen atoms into a two-dimensional world, launch them with chosen velocities, and observe how the particles move and combine. Rather than presenting reactions only as equations, it makes atoms selectable objects whose bonds, motion, and arrangement can be inspected and manipulated directly.

A built-in tutorial supplies chemistry context as well as interface guidance and takes roughly ten minutes to complete. The sandbox includes pause control, camera pan and zoom, selection boxes, copy and paste, deletion, complete clearing, and temperature controls that speed or slow the atoms. These tools support both small constructed molecules and wider reaction experiments. The author notes that desktop is currently the intended platform: the page loads on mobile, but many functions depend on mouse and keyboard combinations and are not available there. The project remains under development, so its value is exploratory rather than a substitute for laboratory work or a complete course. Source code is available under GPL-3.0.`,
            howToPlay: `Use the mouse wheel or number keys 1 through 4 to select hydrogen, carbon, nitrogen, or oxygen. Left-click the gray world to create an atom; drag before releasing to launch it with velocity. Shift-left-click an atom to remove it, or use Delete or X. Press Q to pause or resume the simulation while arranging a more controlled setup.

Right-click an atom to select it, or right-drag a box around several atoms. Hold Shift with those actions to remove objects from the selection. Copy and paste selected structures with Ctrl+C and Ctrl+V. Pan the camera by holding Ctrl while right-dragging, zoom with Ctrl plus the mouse wheel or the plus and minus keys, and reset the view with Ctrl+0. The bottom-right tools clear the entire world or raise and lower temperature. Begin with the in-game tutorial before attempting larger molecules or reaction experiments.`,
            keyFeatures: ['Interactive hydrogen, carbon, nitrogen, and oxygen atoms', 'Launch, select, copy, paste, and remove molecular structures', 'Pause, temperature, camera, and multi-selection tools', 'Ten-minute guided tutorial with chemistry context', 'Desktop-focused open-source experimental simulation'],
            screenshots: ['/screenshots/chemistry-sandbox.gif'], sourceName: 'AlienAuthor2054', sourceUrl: 'https://alienauthor2054.github.io/Chemistry-Sandbox/',
            licence: 'GPL-3.0', licenceStatus: 'osi-approved', tags: ['sandbox', 'physics', 'experimental', 'open-source'], addedDate: reviewedAt, releaseDate: '2025-03-05', featured: false,
        },
    },
    hold('github:sebastianvasquezechavarria1234/drive-simulator-3d-thre.js', 'sebastianvasquezechavarria1234/drive-simulator-3d-thre.js', 'A preview exists, but the reviewed documentation only describes local installation and does not verify concrete driving controls.'),
    hold('github:eeman1113/sootplane', 'Eeman1113/sootplane', 'The reviewed documentation contains neither concrete controls nor a durable gameplay screenshot.'),
    hold('github:mmgrt/lawbox', 'mmgrt/lawbox', 'Some mechanics are described, but no durable author-supplied gameplay screenshot was found.'),
    {
        sourceKey: 'github:okturan/epoch-td', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('okturan/epoch-td'),
        catalogue: {
            slug: 'epoch-tower-defense', name: 'Epoch', category: 'strategy',
            tagline: 'Defend three maps across ten technological ages with upgrades, merges, fusions, and doctrines.',
            about: `Epoch is okturan's single-file tower-defense game, following one defensive campaign from the Stone Age through the Space Age. Each of ten ages unlocks a tower with a distinct role, beginning with a basic Rock Hurler and adding splash, armor penetration, burning, knockback, ramping fire rate, homing missiles, damage amplification, support slowing, and an infinite-range orbital beam. Ten enemy archetypes force the player to revise a layout rather than relying on one universally strong tower.

Every tower can gain three ordinary levels and then choose one of two permanent specializations. Identical adjacent towers can merge into level four and five forms without losing invested gold, while six hidden neighbor recipes fuse different tower types into units unavailable from the shop. Adjacency also shares burning, radioactive, and fire-rate effects. Boss victories offer one of three doctrines from a twelve-perk pool, and later ages unlock aimed meteor, freeze, and fire-rate powers. The standard campaign contains fifty waves; surviving it opens Endless mode and a scored performance review. Canvas graphics, music, and effects are generated at runtime, and the MIT-licensed game works offline without external dependencies.`,
            howToPlay: `Choose one of the three maps. You begin with eighty gold and twenty lives. Select an available tower and place it on an open cell beside the fixed enemy route. Defeated enemies pay for more towers and upgrades; each ordinary leak costs one life and a boss leak costs five. Inspect later waves and diversify the board as armored, regenerating, splitting, shielded, and rushing enemies appear.

Select a placed tower to upgrade or sell it. At level three, choose one permanent specialization. Move or direct an identical neighboring tower onto it to merge without losing gold, and experiment with unlike neighbors to discover six fusion recipes. Position towers near Braziers, Reactors, and Drone Hubs to inherit their ammunition or speed effects. After each boss, choose one doctrine for the rest of the run. Aim the meteor and trigger freeze or the fire-rate burst when cooldowns allow. Survive wave fifty to win, then continue in Endless mode if desired.`,
            keyFeatures: ['Ten ages with one mechanically distinct tower each', 'Fifty-wave campaign across three maps plus Endless mode', 'Tower upgrades, branching specializations, merges, and hidden fusions', 'Twelve run-long doctrines and three cooldown powers', 'Runtime-generated visuals and audio in one offline HTML file'],
            screenshots: ['/screenshots/epoch-tower-defense.png'], sourceName: 'okturan', sourceUrl: 'https://okturan.github.io/epoch-td/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['tower-defense', 'turn-based', 'procedurally-generated', 'brain-burner', 'open-source'], addedDate: reviewedAt, releaseDate: '2026-07-18', featured: false,
        },
    },
    hold('github:araxis/borj', 'araxis/borj', 'Repository images are present, but the reviewed documentation contains no usable player-control evidence.'),
    {
        sourceKey: 'github:michaelsboost/algoarena', decision: 'approved', reviewedAt, reviewer,
        evidence: evidence('michaelsboost/AlgoArena', 'LICENSE.md'),
        catalogue: {
            slug: 'algoarena', name: 'AlgoArena', category: 'strategy',
            tagline: 'Pit rule-based trading bots against one simulated market, then join the contest manually.',
            about: `AlgoArena is Michael Schwartz's experimental trading-battle simulator, designed as a game and learning aid rather than a real brokerage tool. Several rule-based bots receive the same generated market conditions and compete on a shared leaderboard. Their approaches include support and resistance, trendlines, candlestick patterns, breakouts, and mean reversion, making it possible to compare how simple strategies behave under identical price movement.

The player can enter the same arena through a manual account, placing simulated trades and managing stop-loss and take-profit levels while the bots operate. The dashboard tracks open and realized profit, balances, win rates, average wins and losses, trade counts, and efficiency. A generated OHLC candlestick feed changes between trending, ranging, and ordinary regimes, with volatility and ATR influencing both bots and risk controls. Prop-style constraints impose daily-loss stops, lot limits, cooldowns, margin checks, and contract sizing, so reckless entries can end a session even though no real money is involved. The responsive browser project was built with kodeWeave and publishes its source under the MIT licence.`,
            howToPlay: `Launch the arena and choose which built-in strategies will participate. Start the simulated feed, then watch each bot respond to the same candles and market regime. Use the leaderboard and performance panels to compare balances, open profit, win rates, trade frequency, and average outcomes rather than judging a method from one isolated trade.

To compete manually, use B to buy, S to sell, and X to close all open positions. Drag stop-loss and take-profit levels on the chart, or scale into and out of a position when the simulated setup changes. Monitor margin, maximum lot size, daily loss, and cooldown restrictions before submitting another order. The feed is generated for the game and does not represent an executable market. Try the same lineup across different regimes to observe when breakout, trend, reversal, or discretionary decisions gain or lose an advantage.`,
            keyFeatures: ['Five rule-based strategies competing on identical data', 'Manual buy, sell, close, scaling, stop-loss, and take-profit controls', 'Generated OHLC feed with changing volatility and market regimes', 'Leaderboard and detailed trade-performance dashboard', 'Simulated margin, lot, cooldown, and daily-loss constraints'],
            screenshots: ['/screenshots/algoarena.jpeg'], sourceName: 'Michael Schwartz', sourceUrl: 'https://michaelsboost.github.io/AlgoArena/',
            licence: 'MIT', licenceStatus: 'osi-approved', tags: ['skill-based', 'experimental', 'turn-based', 'open-source'], addedDate: reviewedAt, releaseDate: '2025-09-28', featured: false,
        },
    },
    hold('github:alicelee2735/cosmic-bouncer', 'alicelee2735/Cosmic-Bouncer', 'Detailed mechanics are available, but no durable author-supplied gameplay screenshot was found and derivative-language signals need review.'),
    hold('github:abdullah-sheikh/solar-system-simulation', 'Abdullah-Sheikh/Solar-System-Simulation', 'Repository images exist, but the reviewed documentation does not verify player interaction or game objectives.'),
    hold('github:saacostam/3d-tower-defense', 'saacostam/3d-tower-defense', 'Tower placement is mentioned, but no durable author-supplied gameplay screenshot was found.'),
    hold('github:wangcc7/space-colony', 'wangcc7/space-colony', 'The reviewed source provides neither a durable gameplay screenshot nor enough control detail, and derivative-language signals need review.'),
    hold('github:imshota1009/bloom-keeper', 'imshota1009/Bloom-Keeper', 'Mechanics and controls are described, but no durable author-supplied gameplay screenshot was found.'),
];
