// =============================================================================
// ArcadeBloom Game Data Configuration File
// =============================================================================
// This file contains all game data information
// To add new games, simply add game information to this file
// =============================================================================

// Game data array
const GAMES_DATABASE = [
    {
        id: 1,
        name: "Hextris",
        slug: "hextris",
        category: "puzzle",
        image: "./pic/logo/Hextris.png",
        description: "Hextris is a free, fast-paced hexagonal puzzle game that reinvents Tetris for modern players. Rotate a central hexagon to match falling colored blocks from six directions. Clear lines, build combos, and chase the global high score of 10,292 points. Features sleek minimalist design, cross-platform play on web/iOS/Android, and instant social sharing. Perfect for quick gaming sessions with deep strategic gameplay that rewards speed and spatial reasoning. No download required for browser play.",
        instructions: "Controls: Use arrow keys (web) or tap screen sides (mobile) to rotate the hexagon. Match 3+ same-colored blocks to clear them. Game ends when blocks reach the center.Strategy: Rotate early, group colors, create combos. Focus on clearing blocks before they stack up. Build chain reactions for higher scores. Pause to plan moves during intense moments.",
        releaseDate: "2015",
        rating: 4.8,
        plays: 20994,
        featured: true,
        tags: ["puzzle"],
        gameUrl: "https://hextris.io/",

    },
    {
        id: 2,
        name: "proxx",
        slug: "proxx",
        category: "puzzle",
        image: "./pic/logo/proxx.png",
        description: "PROXX is a free, modern minesweeper puzzle that challenges players to reveal tiles while avoiding hidden black holes. Features customizable grid sizes (5-40), difficulty presets, and dark neon visual design. Play offline with touch-friendly controls and vibration feedback. Perfect for strategic thinking with minimalist aesthetics and cross-device compatibility. No download required for instant browser play.",
        instructions: "Controls: Tap or click to reveal tiles. Long press to mark suspected mines. Game ends when all safe tiles are revealed or a mine is hit.Strategy: Use logic to deduce mine locations. Mark suspected mines with caution. Clear safe tiles before exploring unknown areas. Pause to plan moves during intense moments.",
        releaseDate: "2020",
        rating: 4.9,
        plays: 55646,
        featured: true,
        tags: ["sprot"],
        gameUrl: "https://proxx.app/",
    
    }
    ,
    {
        id: 3,
        name: "Girlfriend Tolerance Challenge",
        slug: "girlfriend-tolerance-challenge",
        category: "casual",
        image: "./pic/logo/GirlfriendToleranceChallenge.png",
        description: "Girlfriend Tolerance Challenge is a fun and engaging interactive simulation game designed to test players' emotional intelligence and quick thinking in everyday couple interactions. In this unique casual game, you'll face various scenarios and questions posed by your virtual girlfriend, and your responses will directly impact her Anger Meter. Choose the right answers to appease her, keep her in a good mood, and strive to survive more rounds. Through this game, you'll not only experience the dynamics of a relationship but also enhance your communication skills and emotional management in a lighthearted and enjoyable environment. Start the challenge now and see how many rounds you can endure to become a true Emotional Master !",
        instructions: "To play, click Start Challenge. Respond to dialogue, manage anger, and complete 10 rounds to win.",
        releaseDate: "2025",
        rating: 4.5,
        plays: 22827,
        featured: true,
        tags: ["Couple Interaction, Relationship Simulation, Reaction Time, Decision Making, Humor, Emotional Management, Relationship Challenge, Casual, Single Player"],
        gameUrl: "./games/Girlfriend Tolerance Challenge.html",
    },
    {
        id: 4,
        name: "Chronotron",
        slug: "chronotron",
        category: "sports",
        image: "./pic/logo/Chronotron.png", 
        description: "Chronotron is a unique puzzle-platformer where players wield the power to manipulate time. By pressing 'R', you can rewind your actions, leaving behind an Echo of your past self. These echoes will faithfully repeat your recorded movements, allowing you to cooperate with them to press distant buttons, collect unreachable keys, or create temporary platforms. The goal is to strategically utilize these temporal duplicates to overcome obstacles, open doors, and ultimately reach the exit portal in each challenging level. With intuitive controls and increasingly complex puzzles, Chronotron offers a fresh take on the platforming genre, demanding both quick reflexes and clever planning.",
        instructions: "Here are the streamlined operating instructions for Echoes: Master time manipulation with Echoes. Navigate puzzle-platform levels strategically using intuitive controls. Progress through dynamic challenges.",
        releaseDate: "2025",
        rating: 4.5,
        plays: 22827,
        featured: true,
        tags: ["Puzzle-Platformer, Time Manipulation, Temporal Duplicates, Echo Mechanics, Strategic Planning, Cooperative Puzzles, Action-Puzzle, Indie Game, Platforming"],
        gameUrl: "./games/Chronotron.html",
    },

    {
        id: 5,
        name: "Creative Sudoku",
        slug: "creative-sudoku",
        category: "puzzle",
        image: "./pic/logo/CreativeSudoku.png", 
        description: "Get ready for a Sudoku challenge like no other! Creative Sudoku blends classic number puzzle gameplay with stunning visual effects, offering four difficulty levels from Easy to Expert. We bring you the most beautiful and immersive online Sudoku experience with real-time validation, smart hints, particle animations, and multiple gradient themes. It's perfect for brain training, daily mental exercise, and stress relief. Our responsive design works flawlessly on desktop, tablet, and mobile devices. With a comprehensive scoring system, time tracking, and convenient keyboard navigation, Creative Sudoku is ideal for both beginners learning the ropes and experts seeking ultimate challenges. Experience our intelligent hint system, instant feedback, beautiful animations, customizable themes, and progressive difficulty scaling. Whether you're solving your first puzzle or your thousandth, Creative Sudoku delivers an engaging, premium gaming experience that makes number puzzles addictive and enjoyable.",
        instructions: "The objective of Creative Sudoku is simple: fill the 9×9 grid so that every row, column, and 3×3 box contains digits 1−9 exactly once. To get started, select your difficulty (Easy/Medium/Hard/Expert), choose a theme, and click any empty cell. You can click cells to select them, use number keys 1−9 to fill in digits, use arrow keys to navigate, and Backspace to erase; mobile users can use the on-screen number pad. You'll earn +10 points for correct answers, lose -5 points for mistakes, and -20 points for hints (up to 3 per game), with a +1000 bonus for completing a puzzle. Our smart validation system provides instant feedback with animations, showing green cells for correct answers and red cells that shake for errors. When you get stuck, remember to start with sections that have many pre-filled numbers, use elimination logic to narrow down possibilities, and save your hints for the most challenging moments, as expert puzzles can take 30+ minutes to solve completely.",
        releaseDate: "2025",
        rating: 4.8,
        plays: 22827,
        featured: true,
        tags: ["Sudoku, Puzzle Game, Brain Teaser, Logic Game, Mind Game, Number Game, Casual Game, Online Game, Free Game, Relaxing Game"],
        gameUrl: "./games/CreativeSudoku.html",
    },
    {
        id: 6,
        name: "ball-and-wall",
        slug: "ball-and-wall",
        category: "action",
        image: "./pic/logo/ball-and-wall.png", 
        description: "Ball And Wall is an Arkanoid-style game that brings back the classic arcade experience of brick-breaking fun. With its retro graphics and engaging gameplay, it offers players a chance to immerse themselves in two unique episodes: space and pegasus. The game is designed with both casual gamers and enthusiasts in mind, providing straightforward yet challenging levels that can be enjoyed directly from your browser.",
        instructions: "In Ball And Wall, you control a paddle at the bottom of the screen which moves left and right. Your goal is to bounce a ball off this paddle to hit and break all the bricks located at the top half of the play area. Each level presents a different arrangement of bricks, some of which may require multiple hits to destroy.",
        releaseDate: "2021",
        rating: 4.5,
        plays: 45827,
        featured: true,
        tags: ["puzzle-game, Arkanoid, Space Theme"],
        gameUrl: "https://ballandwall.com/",
    },
    {
        id: 7,
        name: "Captain-Rogers",
        slug: "Captain-Rogers",
        category: "action",
        image: "./pic/logo/Captain-Rogers.png", 
        description: "Ball And Wall is an Arkanoid-style game that brings back the classic arcade experience of brick-breaking fun. With its retro graphics and engaging gameplay, it offers players a chance to immerse themselves in two unique episodes: space and pegasus. The game is designed with both casual gamers and enthusiasts in mind, providing straightforward yet challenging levels that can be enjoyed directly from your browser.",
        instructions: "Use the left mouse button, you control Captain Rogers's spaceship. The objective is to maneuver through a dense asteroid field while battling enemies and collecting power-ups. Use your device's touch controls or keyboard arrows to move your spaceship left and right across the screen, avoiding collisions with asteroids and enemy fire. Shoot down adversaries to earn points and keep an eye out for power-ups that can enhance your ship's capabilities. The game challenges your reflexes and strategic thinking as you progress through increasingly difficult levels in the vastness of space. Enjoy this nostalgic yet innovative take on classic arcade shooters!",
        releaseDate: "2015",
        rating: 4.6,
        plays: 35827,
        featured: true,
        tags: ["puzzle-game, action"],
        gameUrl: "https://rogers.enclavegames.com/",
    },
    {
        id: 8,
        name: "flappybird",
        slug: "flappybird",
        category: "action",
        image: "./pic/logo/flappybird.png", 
        description: "Relive the classic arcade challenge with Flappy Bird! This simple yet addictive game puts your reflexes to the test as you navigate a tiny bird through a series of moving pipes. With its minimalist design and tough gameplay, Flappy Bird delivers endless fun and frustration in equal measure—can you beat your high score?",
        instructions: "Tap or click the screen to make the bird flap and stay airborne.  Avoid crashing into the pipes—they move from right to left, and each gap requires precise timing to pass through.",
        releaseDate: "2015",
        rating: 4.2,
        plays: 1347,
        featured: true,
        tags: ["puzzle-game, action"],
        gameUrl: "http://game.webxinxin.com/flappybird/",
    
    },
    {
        id: 9,
        name: "DrawAFish",
        slug: "DrawAFish",
        category: "action",
        image: "./pic/logo/DrawAFish.png", 
        description: "Draw a fish on the canvas, and if AI recognizes it, your creation joins a global virtual aquarium. Enjoy voting and collecting fish too. No installation needed—just open the webpage and start.",
        instructions: "1、Start drawing on the canvas (fish should face right!) 2、Watch the AI give feedback through background color changes 3、Submit your fish when you're happy with it 4、See it swim in the community tank with other creations 5、Vote and explore other artists' fish in the rankings",
        releaseDate: "2025",
        rating: 4.8,
        plays: 4327,
        featured: true,
        tags: ["puzzle-game, action"],
        gameUrl: "https://drawafish.com/",    
    },
    
];

// Game category configuration
const GAME_CATEGORIES = [
    {
        id: "all",
        name: "All Games",
        icon: "grid",
        color: "blue",
        description: "Browse all available games"
    },
    {
        id: "action",
        name: "Action Games",
        icon: "lightning",
        color: "red",
        description: "Fast-paced games with exciting gameplay"
    },
    {
        id: "puzzle",
        name: "Puzzle Games",
        icon: "puzzle",
        color: "blue",
        description: "Challenge your mind with brain teasers"
    },
    {
        id: "strategy",
        name: "Strategy Games",
        icon: "strategy",
        color: "green",
        description: "Plan, build, and conquer in these games"
    },
    {
        id: "casual",
        name: "Casual Games",
        icon: "casual",
        color: "purple",
        description: "Easy to play, fun to master"
    },
    {
        id: "sports",
        name: "Sports Games",
        icon: "sports",
        color: "orange",
        description: "Athletic competitions and sports simulations"
    },
    {
        id: "racing",
        name: "Racing Games",
        icon: "racing",
        color: "yellow",
        description: "High-speed racing and driving games"
    }
];

// Utility functions
const GameUtils = {
    // Get all games
    getAllGames: () => GAMES_DATABASE,

    // Get featured games
    getFeaturedGames: () => GAMES_DATABASE.filter(game => game.featured),

    // Get games by category
    getGamesByCategory: (category) => {
        if (category === 'all') return GAMES_DATABASE;
        return GAMES_DATABASE.filter(game => game.category === category);
    },

    // Get single game by ID
    getGameById: (id) => GAMES_DATABASE.find(game => game.id === parseInt(id)),

    // Get single game by slug
    getGameBySlug: (slug) => GAMES_DATABASE.find(game => game.slug === slug),

    // Search games
    searchGames: (query) => {
        const lowercaseQuery = query.toLowerCase();
        return GAMES_DATABASE.filter(game =>
            game.name.toLowerCase().includes(lowercaseQuery) ||
            game.description.toLowerCase().includes(lowercaseQuery) ||
            game.category.toLowerCase().includes(lowercaseQuery) ||
            game.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
        );
    },

    // Get random games
    getRandomGames: (count = 6) => {
        const shuffled = [...GAMES_DATABASE].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    },

    // Get related games (same category)
    getRelatedGames: (gameId, count = 4) => {
        const currentGame = GameUtils.getGameById(gameId);
        if (!currentGame) return [];

        const relatedGames = GAMES_DATABASE
            .filter(game => game.id !== gameId && game.category === currentGame.category)
            .sort(() => 0.5 - Math.random())
            .slice(0, count);

        return relatedGames;
    },

    // Get popular games (sorted by play count)
    getPopularGames: (count = 10) => {
        return [...GAMES_DATABASE]
            .sort((a, b) => b.plays - a.plays)
            .slice(0, count);
    },

    // Get newest games (sorted by release date)
    getNewestGames: (count = 10) => {
        return [...GAMES_DATABASE]
            .sort((a, b) => b.id - a.id) // Simple ID sorting, should use date in real projects
            .slice(0, count);
    },

    // Get all categories
    getAllCategories: () => GAME_CATEGORIES,

    // Get category information by category ID
    getCategoryById: (id) => GAME_CATEGORIES.find(cat => cat.id === id),

    // Get game statistics
    getGameStats: () => {
        return {
            totalGames: GAMES_DATABASE.length,
            totalCategories: GAME_CATEGORIES.length - 1, // Excluding "all" category
            totalPlays: GAMES_DATABASE.reduce((total, game) => total + game.plays, 0),
            averageRating: (GAMES_DATABASE.reduce((total, game) => total + game.rating, 0) / GAMES_DATABASE.length).toFixed(1)
        };
    }
};

// Export to global scope (for HTML pages)
if (typeof window !== 'undefined') {
    window.GAMES_DATABASE = GAMES_DATABASE;
    window.GAME_CATEGORIES = GAME_CATEGORIES;
    window.GameUtils = GameUtils;
}

// Node.js export (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        GAMES_DATABASE,
        GAME_CATEGORIES,
        GameUtils
    };
} 