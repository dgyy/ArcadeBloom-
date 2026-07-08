// =============================================================================
// ArcadeBloom site configuration
// =============================================================================
// Authoritative source for the 6 top-level categories (ADR-0002), nav structure,
// and global site metadata. Referenced by every template.
//
// Changing the category set is a breaking change — see docs/adr/0002-top-level-taxonomy.md.
// =============================================================================

module.exports = {
    name: 'ArcadeBloom',
    tagline: 'Discover the best web games — and play them where they live.',
    description:
        'A curated directory of browser games from across the web. Read independent reviews and how-to-play guides, then jump straight to the original source. No walled garden, no re-hosting — just the best games, found faster.',
    url: 'https://arcadebloom.com',
    locale: 'en',

    // The fixed 6 top-level categories. Order = nav order.
    // Each must reach >=20 seeded games before its landing page ships.
    categories: [
        {
            slug: 'puzzle',
            name: 'Puzzle',
            blurb: 'Logic, numbers, patterns and spatial reasoning.',
            intro:
                'Puzzle games reward careful thought over quick reflexes. This is where you will find sudoku, match-cascade, spatial block-fitting, minesweeper descendants and everything that asks you to stop and think before you click. The web is unusually rich in open-source puzzle experiments, and we collect the ones that are actually worth your fifteen minutes — clean designs, fair rules, and a real "aha" moment at the core.',
        },
        {
            slug: 'action',
            name: 'Action',
            blurb: 'Reflex-driven shooters, fighters and brawlers.',
            intro:
                'Action games are about reacting faster than the game can kill you. Shooters, arena brawlers, bullet-dodgers and reflex tests live here. The browser action scene is dominated by short, intense loops — the kind of thing you load for three minutes and lose an hour to — and the open-source community has produced surprisingly polished entries that rival native downloads.',
        },
        {
            slug: 'arcade',
            name: 'Arcade',
            blurb: 'Classic, retro and score-attack arcade experiments.',
            intro:
                'Arcade is the home of the high-score chase: classic coin-op DNA rebuilt for the browser, plus the thriving "tiny game" scene around events like js13k. These are tight, single-mechanism games built around one good idea. Many of the best are under 13 kilobytes and still feel more alive than multi-gigabyte releases.',
        },
        {
            slug: 'strategy',
            name: 'Strategy',
            blurb: 'Tower defense, tactics, resource and planning games.',
            intro:
                'Strategy games ask you to win before the battle starts — through positioning, build order, or long-term resource planning. Tower defense, turn-based tactics, and management puzzles all land here. The web has a deep bench of indie strategy experiments, often more honest about their mechanics than bigger-budget cousins because there is no tutorial budget to hide behind.',
        },
        {
            slug: 'racing-sports',
            name: 'Racing & Sports',
            blurb: 'Speed, competition and athletic sim.',
            intro:
                'Racing and sports games on the web tend to be lean and arcade-leaning rather than full simulations — quick to pick up, easy to drop. We keep racing and sports together because the browser catalog of each is small; splitting them would just create two thin pages. When the volume grows enough to justify it, this category will split into two.',
        },
        {
            slug: 'simulation',
            name: 'Simulation',
            blurb: 'Idle, management, sandbox and life-sim.',
            intro:
                'Simulation games model a system and let you poke at it: idle clickers that run while you sleep, city-builders that fit in a tab, sandbox toys with no goal at all. The web is the natural home for simulation experiments because they are cheap to build and easy to share. We collect the ones with a real model underneath, not just a progress bar.',
        },
    ],

    // Nav bar order. Categories are pulled in dynamically in templates.
    staticNav: [
        { label: 'Featured', href: '/featured/' },
        { label: 'New', href: '/new/' },
    ],

    // Footer company links
    footerLinks: [
        { label: 'About', href: '/about/' },
        { label: 'Contact', href: '/contact/' },
        { label: 'Privacy Policy', href: '/privacy/' },
        { label: 'Terms of Service', href: '/terms/' },
    ],

    // Thresholds (thin-content guards — see CONTEXT.md / plan phase 4)
    minGamesPerCategory: 20,
    minGamesPerTag: 8,
    gamesPerPage: 24,
};
