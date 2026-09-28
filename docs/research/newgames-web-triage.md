# `newgames.md` Web-first triage

Checked 2026-09-22. This is an actionable first-pass, not an exhaustive legal or compatibility audit of every repository in the source list. It prioritises projects with an author-controlled browser build and uses official sites, repositories, READMEs and licence files as evidence.

## Recommendation

Add the strongest projects as **outbound catalogue entries**. Do not mirror third-party games yet: ArcadeBloom's current positioning is an outbound directory, and ADR-0014's hosting allowlist only covers owner-requested games. “Self-hostable” below means technically and licensably plausible after an explicit policy decision, licence compliance review and, preferably, creator permission.

### Best direct-link candidates

| Priority | Project | Official browser play URL | Why it fits / caveat |
| --- | --- | --- | --- |
| 1 | **Anarch** | [Play in browser](https://drummyfish.gitlab.io/anarch/bin/web/anarch.html) | The creator's page links this build and dedicates the game and assets to CC0. Small, unusual, immediate play; also the cleanest future hosting candidate. [Official project page](https://drummyfish.gitlab.io/anarch/) · [source](https://gitlab.com/drummyfish/anarch) |
| 1 | **IsoCity** | [iso-city.com](https://iso-city.com/) | The live URL opens directly into the city builder. It is a current TypeScript/Next.js browser project under MIT. [repository](https://github.com/amilich/isometric-city) · [MIT licence](https://github.com/amilich/isometric-city/blob/main/LICENSE) |
| 1 | **Server Survival** | [Play](https://pshenok.github.io/server-survival/) | Purpose-built browser game, served directly from the repository with native ES modules and no build step; MIT. Strong thematic fit and easy outbound integration. [README](https://github.com/pshenok/server-survival/blob/main/README.md) · [licence](https://github.com/pshenok/server-survival/blob/main/LICENSE) |
| 1 | **Dungeon Crawl Stone Soup** | [Official play selector](https://crawl.develz.org/play.htm) | The official project supports browser WebTiles play and lets users choose a regional server. Account/server dependency should be disclosed. GPLv2+ covers the game code. [official README](https://github.com/crawl/crawl#how-to-play) |
| 1 | **Ancient Beast** | [Play](https://play.ancientbeast.com/) | Official browser client with bot and multiplayer modes. Code is AGPL-3.0 and art/audio CC BY-SA 4.0; direct linking avoids operational and share-alike complexity. [official site](https://ancientbeast.com/) · [repository/licensing](https://github.com/FreezingMoon/AncientBeast#license) |
| 2 | **Hurry Curry!** | [Browser version](https://hurrycurry-web.metamuffin.org/) | The official site exposes a browser build. It is a cooperative multiplayer game and depends on its service, so availability is less self-contained. [official site and licence](https://hurrycurry.org/) · [source](https://codeberg.org/hurrycurry/hurrycurry) |
| 2 | **OpenLara demo** | [WebGL demo](http://xproger.info/projects/OpenLara/) | The repository explicitly calls this a WebGL build with a demo level. List it as a demo, not as the full *Tomb Raider* game. The engine is BSD-2-Clause, but original Tomb Raider data and branding are separate rights. [official repository](https://github.com/XProger/OpenLara) · [licence](https://github.com/XProger/OpenLara/blob/master/LICENSE) |
| 2 | **OpenPanzer** | [Play](https://www.linuxconsulting.ro/openpanzer/) | Official page says the HTML5 game supports major desktop and mobile browsers. Code is GPL-2.0-or-later; its page credits graphics and sounds to OpenIcons. Prefer linking because the combined asset provenance deserves a deeper audit before mirroring. [official page](https://www.linuxconsulting.ro/openpanzer/) · [repository](https://github.com/nicupavel/openpanzer) |
| 2 | **Open Golf** | [Play](https://mgerdes.github.io/minigolf.html) | Working author-hosted Web build. The repository is MIT and credits Kenney assets, but its documented build scripts target native platforms, so keep the author build as the play URL. [repository](https://github.com/mgerdes/Open-Golf) · [licence](https://github.com/mgerdes/Open-Golf/blob/master/LICENSE) |
| 2 | **Fish Folk: Jumpy** | [Web demo](https://fishfolk.github.io/jumpy/player/latest/) | Official README identifies a browser demo. Code is MIT/Apache-2.0, while media assets are CC BY-NC; suitable for linking, risky to mirror on an ad-supported/commercial site. [repository](https://github.com/fishfolk/jumpy) · [licence details](https://github.com/fishfolk/jumpy/blob/main/LICENSE) |
| 2 | **Fish Folk: Punchy** | [Web demo](https://fishfolk.github.io/punchy/player/latest/) | Author-hosted browser build of the Bevy game. The repository uses MIT/Apache-2.0 for code, but bundled media must be checked separately; prefer the official demo. [repository](https://github.com/fishfolk/punchy) · [licence](https://github.com/fishfolk/punchy/blob/main/LICENSE) |
| 2 | **Whatajong** | [Play](https://whatajong.com/) | Author-hosted Web game and MIT-licensed Vite/Electron project. A reasonable direct listing and a plausible static-hosting candidate after confirming all bundled assets. [repository](https://github.com/masylum/whatajong) |
| 3 | **micropolisJS** | [Play](https://www.graememcc.co.uk/micropolisJS/) | Direct browser game and genuine JavaScript port. GPLv3 plus name/trademark conditions make linking much cleaner than republishing. [repository](https://github.com/graememcc/micropolisJS) · [licence](https://github.com/graememcc/micropolisJS/blob/main/LICENSE) |
| Defer | **Trigger Rally Online Edition** | `https://triggerrally.com/` | The candidate URL failed a repeat TLS/live check on 2026-09-22. Do not publish it until the creator-controlled play address is stable again. Historical asset/licensing questions also rule out mirroring. [repository](https://github.com/CodeArtemis/TriggerRally) · [asset issue](https://sourceforge.net/p/trigger-rally/feature-requests/19/) |

Before catalogue work, recheck the live URL, identify the named creator, capture licence text and confirm that a usable screenshot may be linked or reproduced. A working homepage alone is insufficient.

### Direct-link candidates with reservations

- **Hnefatafl** has an active [official project site](https://hnefatafl.org/) and AGPL-3.0-or-later source, but the checked URL is documentation rather than a confirmed instant-play page. Defer it until a stable creator-controlled browser game URL is identified. The project has moved its canonical source to [Codeberg](https://codeberg.org/dcampbell/hnefatafl).
- **Athena Crisis** offers a browser demo at [athenacrisis.com](https://athenacrisis.com/), but it is open-core. Its README says campaign, multiplayer, art, music and other content are proprietary and remotely loaded; only non-content code is MIT. Link the official demo if editorially desired; do not self-host or describe the complete game as open source. [Official repository explanation](https://github.com/nkzw-tech/athena-crisis#what-is-open-source-and-what-isnt)
- **Dead Ascend** has an [official game page](https://blackgrain.dk/games/deadascend/), but the page currently points users to app stores rather than exposing a verified browser build. The QML repository being MIT does not create a Web play URL. [source](https://github.com/larpon/DeadAscend)
- **Citybound** currently runs from its [author-controlled Web page](https://aeplay.org/citybound), so it can be evaluated as an outbound link. The official repository still describes experimental builds and a custom Rust simulation/backend architecture; verify a complete play session before publication and do not treat it as a simple static-hosting candidate. [README](https://github.com/citybound/citybound)
- **Mindustry** has an official [website](https://mindustrygame.github.io/) but its official distribution is downloadable/mobile/Steam; it does not present a supported browser game. Third-party Web ports should not be substituted for an author play URL. [official repository](https://github.com/Anuken/Mindustry)

## Realistically self-hostable, subject to a policy change

These are the only strong hosting prospects found in this pass:

| Project | Technical shape | Licence/operational condition |
| --- | --- | --- |
| **Anarch** | Existing small static Web build | CC0; retain provenance even though attribution is not required. |
| **Server Survival** | Static files, native ES modules, no backend/build required | MIT notice must ship with the copy. |
| **IsoCity** | Next.js browser application; can be built and deployed | MIT notice required; verify its very large asset set before copying. |
| **Whatajong** | Vite-based browser client | MIT at repository level; audit bundled fonts, audio and images. |
| **OpenLara demo** | Existing WebGL build | BSD-2-Clause covers the engine only; host only the repository's authorised demo data, never commercial Tomb Raider data. |

**Ancient Beast**, **Hurry Curry!** and **Dungeon Crawl Stone Soup WebTiles** are Web-native but include server/runtime operations. They are not drop-in Cloudflare Pages games. **Fish Folk: Jumpy** carries non-commercial media terms, while **micropolisJS**, **OpenPanzer** and **Trigger Rally** need asset/trademark review; none should be first hosting experiments.

## Not suitable for ArcadeBloom Web hosting

The remainder of `newgames.md` is dominated by the following groups. They may be good open-source desktop games, but they do not meet a Web-first directory's requirement for a stable, official browser play URL.

1. **Native desktop/mobile games and engines.** Hypersomnia, Endless Sky, Pioneer, CorsixTH, OpenLoco, OpenRCT2, OpenTTD, Unknown Horizons, the listed FPS titles, VVVVVV, most racing games, 0 A.D., Beyond All Reason, OpenHV, OpenRA, Warzone 2100, Widelands, Zero-K, Brogue CE, Cataclysm: DDA, Shattered Pixel Dungeon, Naev, Oolite, Veloren, Taisei, FreeCol, FreeOrion, Wesnoth, Unciv and VCMI are chiefly C/C++/Rust/Java/Godot/Unity/native applications. Porting them is a software project, not catalogue ingestion.
2. **Interpreters, source ports and replacement engines requiring commercial data.** ScummVM, Julius, EDuke32/Raze, Chocolate Doom, FTEQW, ECWolf, Commander Genius, Rigel Engine, Daggerfall Unity, Exult, GemRB, OpenMW, DevilutionX, fheroes2 and OpenXcom generally require users to supply original game data or cover only an engine. They are unsuitable for ArcadeBloom-hosted play packages.
3. **Decompilations and commercial-IP reimplementations.** Twilight Princess, Zelda 3, Super Mario 64, Portal64, Doom/Quake/Wolfenstein source releases, Duke Nukem/Shadow Warrior/AvP ports, OpenGOAL, Fallout CE, RE3/OpenRW, Command & Conquer source releases and Warcraft/StarCraft importers carry obvious game-data, trademark and copyright boundaries. An open code licence does not grant distribution rights to original assets, ROMs, maps, story or branding.
4. **Server-heavy multiplayer projects.** Liblast, DDraceNetwork, Space Station 14 and similar games require persistent authoritative services, matchmaking or community infrastructure. They do not fit a static Cloudflare Pages deployment and should only be linked if the creator offers a stable browser client.
5. **Tooling rather than a standalone browser game.** ScummVM, OpenAge, Permafrost Engine, Tomb Engine, Warsmash and the various engine repositories are development/runtime projects. Listing a project homepage as “Play” would mislead visitors.

## Proposed ingestion order

1. Prepare catalogue metadata for **Anarch, IsoCity, Server Survival, Dungeon Crawl Stone Soup, Ancient Beast, Hurry Curry!, OpenLara demo and OpenPanzer**.
2. Verify screenshots and current browser behaviour for **Open Golf, Jumpy, Punchy, Whatajong, micropolisJS, Citybound and Trigger Rally** before publishing.
3. Treat every other item as deferred unless a stable author-controlled browser build is found later.
4. If ArcadeBloom wants to host any third-party title, amend the hosting ADR/allowlist first and record the exact upstream commit, all licences, asset provenance, update process and creator permission status.
