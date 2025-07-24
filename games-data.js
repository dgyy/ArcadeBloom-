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
        slug: "Hextris",
        category: "puzzle",
        image: "./pic/logo/Hextris.png",
        description: "Fast paced HTML5 puzzle game inspired by Tetris!",
        developer: "Logan Engstrom",
        releaseDate: "2015",
        controls: "mouse",
        rating: 4.8,
        plays: 1600,
        featured: true,
        tags: ["level", "puzzle"],
        gameUrl: "https://hextris.io/",
        instructions: [
            "Rotate the hexagon with arrow keys to match incoming blocks",
            "Stack three or more blocks of the same color to clear them",
            "Prevent the stack from reaching the outer boundary to survive"
        ]
    },
    {
        id: 2,
        name: "proxx",
        slug: "proxx",
        category: "puzzle",
        image: "./pic/logo/proxx.png",
        description: "A HTML5 game of proximity",
        developer: "mgerdes",
        releaseDate: "2020",
        controls: "mouse",
        rating: 4.6,
        plays: 1450,
        featured: true,
        tags: [ "sport"],
        gameUrl: "https://proxx.app/",
        instructions: [
            "Click tiles to reveal empty space or black holes",
            "Numbers show how many nearby black holes are adjacent",
            "Mark suspected black holes to avoid clicking them"
        ]
    }
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