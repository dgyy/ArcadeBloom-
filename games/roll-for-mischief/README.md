# Roll for Mischief - JS13kGames 2025 Entry

**Theme**: BLACK CAT  
**Size**: 12.8KB (99% of 13KB limit)  
**Category**: Online (Multiplayer)

## Game Description

A multiplayer cat battle royale with simplified Pathfinder 2nd Edition mechanics. Players control cats in a low-poly synthwave-esque city environment, surviving against other players, environmental hazards, and a roaming boss cat.

### Key Features

- **Multiplayer Battle Royale**: Real-time multiplayer using WebSocket/PartySocket
- **Pathfinder 2e Mechanics**: Simplified stats, combat, and diplomacy system
- **Boss Cat AI**: Roaming "Shadow Cat" boss with enhanced stats
- **Low-Poly 3D Rendering**: Custom canvas-based 3D renderer
- **Cat Classes**: Fighter, Rogue, Wizard, and Cleric cats with unique abilities

### Controls

- **WASD**: Camera controls
- **Arrow Keys**: Cat Movement Controls
- **X**: Attack
- **Z**: Stealth (if Rogue)
- **C**: Cast (if Wizard or Cleric)
- **H**: Heal (if Cleric)
- **T**: View Stat Block
- **Space**: End Turn
- **1**: Target Choice
- **2**: Target Choice
- **3**: Target Choice

### Gameplay

1. **Spawn**: Random cat character with Pathfinder 2nd Edition stats
2. **Explore**: Navigate city blocks and alleyways
3. **Encounter**: Meet other player cats and choose combat or diplomacy
4. **Survive**: Avoid the shrinking storm area and roaming boss
5. **Win**: Last cat standing wins the battle royale

## Technical Implementation

### Ultra-Compressed Architecture

The game uses extreme compression techniques to fit within 13KB:

- **Micro-Pathfinder**: Essential PF2e mechanics
- **Micro-Renderer**: 3D projection and rendering
- **Micro-Game**: Core game loop and networking
- **Function Minification**: Aggressive code compression

### Multiplayer Support

- **PartySocket Integration**: Uses competition-provided PartySocket when available
- **WebSocket Fallback**: Native WebSocket for local development
- **Offline Mode**: Graceful degradation for single-player experience
- **Real-time Sync**: Player positions, combat, and boss movement

### 3D Rendering System

- **Custom Projection**: Perspective projection without external libraries
- **Depth Sorting**: Painter's algorithm for polygon rendering
- **Procedural Geometry**: All models generated algorithmically
- **Low-Poly Style**: Minimal polygons for optimal performance

## Build System

### Development Build

```bash
npm install
npm run dev     # Start development server
npm test        # Run test suite
npm run build   # Build full-featured version (exceeds 13KB)
```

### Competition Build

```bash
node build-ultra.js  # Build ultra-compressed version
```

### Size Analysis

```bash
node optimize.js     # Analyze code size and optimization targets
npm run size        # Check current build size
```

## Project Structure

```
roll-for-mischief/
├── src/                    # Source code
│   ├── micro-pathfinder.js # Ultra-compressed P2e system
│   ├── micro-renderer.js   # Minimal 3D renderer
│   ├── micro-game.js       # Core game logic
│   └── index.html          # HTML template
├── dist/                   # Built game files
├── test/                   # Test suite
├── build-micro.js          # Ultra-compression build
└── cats-13k-micro.zip     # Final 13KB submission
```

## Competition Compliance

✅ **Size Limit**: 12.8KB (200ish bytes under the 13KB limit)  
✅ **Theme**: "BLACK CAT" - players are cats, boss is "Shadow Cat"  
✅ **Offline-First**: Works without internet connection  
✅ **Online Features**: Multiplayer via PartySocket (optional)  
✅ **No External Libraries**: Everything custom-built  
✅ **Browser Compatible**: Works in modern browsers

## Development Notes

### Original Full-Featured Version

The initial implementation included:

- Complete JRPG-style dialog system
- DOOM style billboard 3D cat sprites
- Inspired Pathfinder 2nd Edition spell system
- Comprehensive UI with bordered dialogs
- Extra player / Boss AI

**Total Size**: 20KB uncompressed, 12.8KB compressed

### Ultra-Compressed Version

To meet the 13KB limit, the game was drastically simplified:

- JS minification techniques
- Streamlined features
- Sprite compression
- Roadroller

**Final Size**: 12.8KB compressed

### Multiplayer Architecture

The game supports real-time multiplayer through:

- Room-based sessions via PartySocket
- Party-game Room based Join mechanics
- Game State/Chat broadcasts
- Player turn timeouts

## Future Enhancements

If size limits were relaxed, the game could be expanded with:

- Other Pathfinder 2nd Edition Mechanics (Diplomacy, Proper Stealth)
- Detailed 3D cat models and animations
- Complete Pathfinder 2e spell and feat system
- Interactive environment objects
- Sound effects and background music
- Advanced boss encounters with multiple phases
- Persistent leaderboards and statistics

---

_Created for JS13kGames 2025 competition - Theme: "BLACK CAT"_
