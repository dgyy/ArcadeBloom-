// =============================================================================
// ArcadeBloom controlled tag vocabulary
// =============================================================================
// Two groups, ~40 tags total. Each game references 3–5 of these BY SLUG.
// Free-text tags are forbidden — see CONTEXT.md (Taxonomy > Tag).
//
// Adding/removing/renaming a tag here is the ONLY way to change tags site-wide.
// A tag page is only generated when >= minGamesPerTag games carry it (thin-content guard).
//
// group: 'gameplay' = drill-down under a top-level category
// group: 'mood'     = scenario / feeling / play-context (the discovery layer)
// =============================================================================

module.exports = [
    // ---- Gameplay subtypes -------------------------------------------------
    { slug: 'roguelike', name: 'Roguelike', group: 'gameplay',
      description: 'Procedurally generated runs with permadeath — each attempt is a fresh, high-stakes build.' },
    { slug: 'tower-defense', name: 'Tower Defense', group: 'gameplay',
      description: 'Place and upgrade defensive structures to survive escalating waves of enemies.' },
    { slug: 'match-3', name: 'Match-3', group: 'gameplay',
      description: 'Swap adjacent tiles to form matching lines and trigger cascading clears.' },
    { slug: 'platformer', name: 'Platformer', group: 'gameplay',
      description: 'Jump, run and time your moves across gaps and hazards on layered platforms.' },
    { slug: 'bullet-hell', name: 'Bullet Hell', group: 'gameplay',
      description: 'Dense bullet patterns you weave through by the pixel. Pure dodging endurance.' },
    { slug: 'turn-based', name: 'Turn-Based', group: 'gameplay',
      description: 'Take your time — every action resolves before the next one begins.' },
    { slug: 'sandbox', name: 'Sandbox', group: 'gameplay',
      description: 'Open-ended systems with no fixed goal. The fun is in what you make of them.' },
    { slug: 'idle', name: 'Idle / Incremental', group: 'gameplay',
      description: 'Numbers go up while you are away. Surprisingly deep optimization under the surface.' },
    { slug: 'card-game', name: 'Card Game', group: 'gameplay',
      description: 'Deck-builders, solitaire variants and card-driven combat systems.' },
    { slug: 'board-game', name: 'Board Game', group: 'gameplay',
      description: 'Digital adaptations of tabletop classics — chess, Go, Reversi, modern euros.' },
    { slug: 'shooter', name: 'Shooter', group: 'gameplay',
      description: 'Aim, fire, repeat. From twin-stick to vertical-scrolling space shooters.' },
    { slug: 'rhythm', name: 'Rhythm', group: 'gameplay',
      description: 'Time your inputs to music. Reflexes measured in beats per minute.' },
    { slug: 'racing', name: 'Racing', group: 'gameplay',
      description: 'Beat the clock or the field. Lap times, drift lines and checkpoint sprints.' },
    { slug: 'sports', name: 'Sports', group: 'gameplay',
      description: 'Athletic competition translated to the browser — arcade-leaning, not simulation.' },
    { slug: 'survival', name: 'Survival', group: 'gameplay',
      description: 'Manage hunger, health and threats against a closing clock. One more day.' },
    { slug: 'puzzle-room', name: 'Escape / Puzzle Room', group: 'gameplay',
      description: 'Self-contained rooms where every object is a clue. Pure deduction.' },
    { slug: 'physics', name: 'Physics', group: 'gameplay',
      description: 'Mechanics driven by a simulated world — gravity, momentum, soft-body chaos.' },
    { slug: 'text-based', name: 'Text-Based', group: 'gameplay',
      description: 'Words are the engine. Choose-your-own-adventure, MUDs and interactive fiction.' },
    { slug: 'rts', name: 'Real-Time Strategy', group: 'gameplay',
      description: 'Gather, build, and command armies in continuous time. APM matters.' },

    // ---- Mood / scenario ---------------------------------------------------
    { slug: 'quick-fix', name: 'Quick Fix', group: 'mood',
      description: 'Three minutes, tops. Games that load instantly and end before you notice.' },
    { slug: 'brain-burner', name: 'Brain Burner', group: 'mood',
      description: 'Brutal logic that punishes sloppy thinking. The opposite of a time-killer.' },
    { slug: 'couch-co-op', name: 'Couch Co-op', group: 'mood',
      description: 'Built for two or more players sharing one screen. Best with a friend.' },
    { slug: 'multiplayer', name: 'Multiplayer', group: 'mood',
      description: 'Real opponents, real time. The game only works with other humans in it.' },
    { slug: 'zen', name: 'Zen', group: 'mood',
      description: 'No fail state, no rush. Click, drift, unwind. The anti-stress playlist.' },
    { slug: 'hardcore', name: 'Hardcore', group: 'mood',
      description: 'Punishing by design. You will die, you will learn, you will try again.' },
    { slug: 'retro', name: 'Retro', group: 'mood',
      description: 'Pixel art, CRT scanlines and chiptune — games that look like they time-traveled.' },
    { slug: 'minimal', name: 'Minimal', group: 'mood',
      description: 'One mechanic, one color palette, no clutter. The design strips everything away.' },
    { slug: 'experimental', name: 'Experimental', group: 'mood',
      description: 'Strange mechanics that do not fit any genre. Play it to find out what it is.' },
    { slug: 'story-rich', name: 'Story-Rich', group: 'mood',
      description: 'The narrative is the point. Worth playing for the writing alone.' },
    { slug: 'relaxing', name: 'Relaxing', group: 'mood',
      description: 'Ambient and low-stakes. The kind of thing you play to decompress.' },
    { slug: 'skill-based', name: 'Skill-Based', group: 'mood',
      description: 'No RNG, no upgrades — your improvement is the only progression.' },
    { slug: 'procedurally-generated', name: 'Procedurally Generated', group: 'mood',
      description: 'New layout, new run, every time. Built for replayability.' },
    { slug: 'open-source', name: 'Open Source', group: 'mood',
      description: 'Code on GitHub. Read it, fork it, learn from it — the full source is public.' },
    { slug: '13kb', name: '13KB Jam Entry', group: 'mood',
      description: 'Built for js13k or similar size-limited jams. Incredible craft in 13 kilobytes.' },
    { slug: 'classic', name: 'Classic', group: 'mood',
      description: 'A foundational entry — the genre would not be the same without it.' },
];
