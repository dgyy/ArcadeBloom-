(function () {
    const NAV_ITEMS = [
        { id: 'home', label: 'Overview', target: '#home-view' },
        { id: 'picks', label: 'Top Picks', target: '#top-picks' },
        { id: 'featured', label: 'Featured Games', target: '#featured-spotlight' },
        { id: 'new', label: 'New Releases', target: '#new-releases' },
        { id: 'recent', label: 'Recently Played', target: '#recently-played', requiresRecent: true },
        { id: 'action', label: 'Action Games', target: '#rail-action', categoryId: 'action' },
        { id: 'puzzle', label: 'Puzzle Games', target: '#rail-puzzle', categoryId: 'puzzle' },
        { id: 'casual', label: 'Casual Games', target: '#rail-casual', categoryId: 'casual' },
        { id: 'sports', label: 'Sports Games', target: '#rail-sports', categoryId: 'sports' }
    ];

    const COLLECTION_BATCH_SIZE = 18;

    function categoryConfig(id, title, description) {
        return {
            title,
            description,
            getGames: () => GameUtils.getGamesByCategory(id)
        };
    }

    function formatRating(value) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric.toFixed(1) : 'N/A';
    }

    function formatPlays(value) {
        const numeric = Number(value);
        if (!Number.isFinite(numeric) || numeric <= 0) {
            return '0 plays';
        }
        if (numeric >= 1000000) {
            return `${(numeric / 1000000).toFixed(1)}M plays`;
        }
        if (numeric >= 1000) {
            return `${(numeric / 1000).toFixed(1)}K plays`;
        }
        return `${numeric} plays`;
    }

    function formatCategory(category) {
        if (!category) {
            return 'Game';
        }
        return category.split(/[-_\s]+/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }

const COLLECTION_CONFIG = {
        picks: {
            title: 'Top Picks',
            description: 'Editor-curated standouts that blend instant fun with long-term replay value.',
            limit: 30,
            getGames: () => GameUtils.getPopularGames(30)
        },
        featured: {
            title: 'Featured Games',
            description: 'High-impact launches and refreshed classics highlighted by the ArcadeBloom team.',
            limit: 30,
            getGames: () => {
                const featureds = GameUtils.getFeaturedGames();
                return featureds.length ? featureds : GameUtils.getPopularGames(30);
            }
        },
        new: {
            title: 'New Releases',
            description: 'Fresh uploads and seasonal drops - check back often to catch the latest arrivals.',
            limit: 30,
            getGames: () => GameUtils.getNewestGames(30)
        },
        recent: {
            title: 'Recently Played',
            description: 'Picked up where you left off. Stored locally for this device only.',
            limit: 30,
            getGames: () => getRecentlyPlayed()
        },
        action: categoryConfig('action', 'Action Games', 'High-intensity battles, reflex challenges, and hero moments.'),
        puzzle: categoryConfig('puzzle', 'Puzzle Games', 'Logic tests, brainteasers, and clever mechanics to unwind with.'),
        casual: categoryConfig('casual', 'Casual Games', 'Relaxed sessions with easy onboarding and endless replay potential.'),
        sports: categoryConfig('sports', 'Sports Games', 'Competitive matches and athletic sims for score chasers.')
    };

    const homeView = document.getElementById('home-view');
    const collectionView = document.getElementById('collection-view');
    const collectionTitle = document.getElementById('collection-title');
    const collectionDescription = document.getElementById('collection-description');
    const collectionGrid = document.getElementById('collection-grid');
    const collectionEmpty = document.getElementById('collection-empty');
    const sidebarNav = document.getElementById('sidebar-nav');
    const mobileNav = document.getElementById('mobile-nav');
    const collectionMeta = document.getElementById('collection-meta');
    const collectionSentinel = document.getElementById('collection-sentinel');

    const gameName = document.getElementById('game-name');
    const gameCategory = document.getElementById('game-category');
    const gameRating = document.getElementById('game-rating');
    const gamePlays = document.getElementById('game-plays');
    const gameDescription = document.getElementById('game-description');
    const gameInstructions = document.getElementById('game-instructions');
    const gameDeveloper = document.getElementById('game-developer');
    const gamePlatforms = document.getElementById('game-platforms');
    const gameNotes = document.getElementById('game-notes');

    const iframe = document.getElementById('game-iframe');
    const gameLoading = document.getElementById('game-loading');
    const gameError = document.getElementById('game-error');
    const btnErrorRetry = document.getElementById('btn-error-retry');
    const btnErrorOpen = document.getElementById('btn-error-open');

    const relatedList = document.getElementById('related-list');

    const btnBack = document.getElementById('btn-back');
    const btnOpenOriginal = document.getElementById('btn-open-original');
    const btnCopyLink = document.getElementById('btn-copy-link');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const btnRetry = document.getElementById('btn-retry');
    const gamePlaceholder = document.getElementById('game-placeholder');

    let collectionObserver = null;
    const collectionState = {
        navId: null,
        games: [],
        rendered: 0,
        total: 0
    };

    let activeNavId = 'home';
    let currentGame = null;
    let placeholderHideTimeout = null;

    document.addEventListener('DOMContentLoaded', () => {
        bindToolbar();
        bindQuickLinks();
        waitForData();
    });

    function categoryConfig(id, title, description) {
        return {
            title,
            description,
            limit: 30,
            getGames: () => GameUtils.getGamesByCategory(id)
        };
    }

    function waitForData() {
        if (typeof GameUtils === 'undefined') {
            setTimeout(waitForData, 50);
            return;
        }
        bootstrap();
    }

    function bootstrap() {
        setupSearch();
        renderNavigation();

        const params = new URLSearchParams(window.location.search);
        const gameId = Number.parseInt(params.get('id'), 10);
        const slug = params.get('slug');
        const rawName = params.get('name');

        let game = Number.isFinite(gameId) ? GameUtils.getGameById(gameId) : null;
        if (!game && slug) {
            game = GameUtils.getGameBySlug(slug);
        }
        if (!game && rawName) {
            const normalized = rawName.toLowerCase().replace(/\s+/g, '-');
            game = GameUtils.getGameBySlug(normalized);
        }

        if (!game) {
            showUnavailableState();
            return;
        }

        currentGame = game;
        recordRecentlyPlayed(game.slug);
        renderNavigation();
        populateGameData(game);
        renderRelatedGames(game);
        handleNavSelection('home');
    }

    function bindToolbar() {
        if (btnBack) {
            btnBack.addEventListener('click', () => {
                if (window.history.length > 1) {
                    window.history.back();
                } else {
                    window.location.href = 'index.html';
                }
            });
        }

        if (btnOpenOriginal) {
            btnOpenOriginal.addEventListener('click', () => {
                if (currentGame && currentGame.gameUrl) {
                    window.open(currentGame.gameUrl, '_blank', 'noopener');
                }
            });
        }

        if (btnCopyLink) {
            btnCopyLink.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(window.location.href);
                    btnCopyLink.textContent = 'Link Copied';
                    setTimeout(() => (btnCopyLink.textContent = 'Copy Game Link'), 2000);
                } catch (error) {
                    console.warn('Clipboard copy failed', error);
                }
            });
        }

        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                const container = document.getElementById('game-container');
                if (!container) {
                    return;
                }
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    container.requestFullscreen?.();
                }
            });
        }

        if (btnRetry) {
            btnRetry.addEventListener('click', () => {
                if (currentGame) {
                    loadGame(currentGame.gameUrl, true);
                }
            });
        }

        if (btnErrorRetry) {
            btnErrorRetry.addEventListener('click', () => {
                if (currentGame) {
                    loadGame(currentGame.gameUrl, true);
                }
            });
        }
    }

    function bindQuickLinks() {
        document.querySelectorAll('[data-nav-target]').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                const navId = link.dataset.navTarget;
                if (navId) {
                    handleNavSelection(navId);
                }
            });
        });
    }

    function populateGameData(game) {
        updateHeadMetadata(game);

        if (gameName) {
            gameName.textContent = game.name;
        }
        if (gameCategory) {
            gameCategory.textContent = formatCategory(game.category);
        }
        if (gameRating) {
            gameRating.textContent = `Rating ${formatRating(game.rating)}`;
        }
        if (gamePlays) {
            gamePlays.textContent = formatPlays(game.plays);
        }
        if (gameDescription) {
            gameDescription.textContent = game.description || 'Embark on a new challenge curated by ArcadeBloom.';
        }
        if (gameInstructions) {
            gameInstructions.textContent = game.instructions || 'Use on-screen prompts to begin playing immediately.';
        }
        if (gameDeveloper) {
            gameDeveloper.textContent = game.developer || 'Independent Creator';
        }
        if (gamePlatforms) {
            gamePlatforms.textContent = game.platforms || 'Web Browser';
        }
        if (gameNotes) {
            gameNotes.textContent = game.notes || 'Play directly in your browser - no downloads required.';
        }

        if (btnOpenOriginal) {
            btnOpenOriginal.href = game.gameUrl || '#';
        }
        if (btnErrorOpen) {
            btnErrorOpen.href = game.gameUrl || '#';
        }

        loadGame(game.gameUrl);
    }

    function updateHeadMetadata(game) {
        document.title = `${game.name} - Play Free Online | ArcadeBloom`;
        const desc = document.querySelector('meta[name="description"]');
        if (desc) {
            desc.setAttribute('content', `Play ${game.name} free online at ArcadeBloom. ${game.description || 'Instant browser gameplay.'}`);
        }
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.setAttribute('content', `${game.name} - Play Free Online`);
        }
        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) {
            ogDesc.setAttribute('content', game.description || 'Instant browser gameplay.');
        }
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) {
            ogImage.setAttribute('content', game.image || '/pic/logo/default.png');
        }
    }

    function loadGame(url, forceReload = false) {
        if (!iframe) {
            return;
        }
        if (!url) {
            showGameError();
            return;
        }

        showGamePlaceholder();
        gameLoading.classList.remove('hidden');
        gameLoading.classList.add('flex');
        gameError.classList.add('hidden');
        if (btnErrorOpen) {
            btnErrorOpen.classList.add('hidden');
        }
        iframe.onload = null;
        iframe.onerror = null;
        iframe.src = '';

        requestAnimationFrame(() => {
            iframe.onload = () => {
                gameLoading.classList.add('hidden');
                gameLoading.classList.remove('flex');
                hideGamePlaceholder();
            };
            iframe.onerror = () => {
                showGameError();
            };
            iframe.src = url;
        });

        if (forceReload) {
            iframe.contentWindow?.location.reload?.();
        }
    }

    function showGamePlaceholder() {
        if (!gamePlaceholder) {
            return;
        }
        if (placeholderHideTimeout) {
            clearTimeout(placeholderHideTimeout);
            placeholderHideTimeout = null;
        }
        gamePlaceholder.classList.remove('hidden');
    }

    function hideGamePlaceholder(delay = 200) {
        if (!gamePlaceholder) {
            return;
        }
        if (placeholderHideTimeout) {
            clearTimeout(placeholderHideTimeout);
        }
        placeholderHideTimeout = setTimeout(() => {
            gamePlaceholder.classList.add('hidden');
            placeholderHideTimeout = null;
        }, Math.max(0, delay));
    }

    function showGameError() {
        gameLoading.classList.add('hidden');
        gameLoading.classList.remove('flex');
        hideGamePlaceholder(0);
        gameError.classList.remove('hidden');
        if (btnErrorOpen) {
            btnErrorOpen.classList.toggle('hidden', !currentGame?.gameUrl);
        }
    }

    function renderRelatedGames(game) {
        if (!relatedList) {
            return;
        }
        relatedList.innerHTML = '';
        const related = (GameUtils.getGamesByCategory(game.category) || [])
            .filter(item => item.id !== game.id)
            .slice(0, 6);

        if (!related.length) {
            const empty = document.createElement('p');
            empty.className = 'text-white/60 text-sm';
            empty.textContent = 'No more games in this category yet. Check back soon!';
            relatedList.appendChild(empty);
            return;
        }

        related.forEach(item => {
            const card = document.createElement('a');
            card.className = 'related-card flex gap-4 p-3 hover:bg-white/10 transition';
            card.href = buildDetailUrl(item);
            card.innerHTML = `
                <div class="w-20 h-20 overflow-hidden rounded-xl bg-slate-900/70">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 space-y-1">
                    <p class="text-sm font-semibold text-white line-clamp-2">${item.name}</p>
                    <p class="text-xs text-white/50">${formatCategory(item.category)}</p>
                </div>
            `;
            relatedList.appendChild(card);
        });
    }

    function renderNavigation() {
        const items = NAV_ITEMS.filter(shouldRenderNavItem);

        if (sidebarNav) {
            sidebarNav.innerHTML = '';
        }
        if (mobileNav) {
            mobileNav.innerHTML = '';
        }

        items.forEach(item => {
            const count = getNavItemCount(item);
            if (sidebarNav) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = `sidebar-link${activeNavId === item.id ? ' active' : ''}`;
                button.dataset.navId = item.id;
                button.innerHTML = count === null
                    ? `<span>${item.label}</span>`
                    : `<span>${item.label}</span><span class="ml-auto text-xs font-semibold text-white/60">${count}</span>`;
                button.addEventListener('click', () => handleNavSelection(item.id));
                sidebarNav.appendChild(button);
            }

            if (mobileNav) {
                const pill = document.createElement('button');
                pill.type = 'button';
                pill.className = `mobile-nav-pill${activeNavId === item.id ? ' active' : ''}`;
                pill.dataset.navId = item.id;
                pill.textContent = count === null ? item.label : `${item.label} (${count})`;
                pill.addEventListener('click', () => handleNavSelection(item.id));
                mobileNav.appendChild(pill);
            }
        });

        setActiveNav(activeNavId);
    }

    function shouldRenderNavItem(item) {
        return Boolean(item);
    }

    function getNavItemCount(item) {
        if (!item || item.id === 'home') {
            return null;
        }
        return getCollectionGames(item).length;
    }

    function handleNavSelection(navId) {
        const item = NAV_ITEMS.find(entry => entry.id === navId);
        if (!item) {
            return;
        }

        setActiveNav(navId);

        if (navId === 'home') {
            showHomeView();
        } else {
            showCollectionView(item);
        }
    }

    function showHomeView() {
        if (collectionView) {
            collectionView.classList.add('hidden');
        }
        if (homeView) {
            homeView.classList.remove('hidden');
        }
        destroyCollectionObserver();
        if (collectionMeta) {
            collectionMeta.classList.add('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showCollectionView(navItem) {
        if (!collectionView) {
            return;
        }
        if (homeView) {
            homeView.classList.add('hidden');
        }
        collectionView.classList.remove('hidden');
        renderCollectionView(navItem);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderCollectionView(navItem) {
        if (!collectionView) {
            return;
        }
        const config = COLLECTION_CONFIG[navItem.id];
        if (!config) {
            collectionView.classList.add('hidden');
            return;
        }

        destroyCollectionObserver();
        toggleCollectionSentinel(false);

        const games = getCollectionGames(navItem);
        const totalGames = games.length;
        const limit = Number.isFinite(config.limit) ? config.limit : totalGames;
        const visibleGames = limit < totalGames ? games.slice(0, limit) : games;

        if (collectionTitle) {
            collectionTitle.textContent = config.title || navItem.label;
        }
        if (collectionDescription) {
            if (config.description) {
                collectionDescription.textContent = config.description;
                collectionDescription.classList.remove('hidden');
            } else {
                collectionDescription.classList.add('hidden');
            }
        }

        if (collectionGrid) {
            collectionGrid.innerHTML = '';
        }

        resetCollectionState(navItem.id, visibleGames);

        if (!collectionState.total) {
            if (collectionEmpty) {
                collectionEmpty.textContent = 'No games found for this category yet.';
                collectionEmpty.classList.remove('hidden');
            }
            updateCollectionMeta();
            return;
        }

        if (collectionEmpty) {
            collectionEmpty.classList.add('hidden');
        }

        renderCollectionBatch();

        if (collectionState.rendered < collectionState.total) {
            initCollectionObserver();
        } else {
            toggleCollectionSentinel(false);
        }
    }

    function getCollectionGames(navItem) {
        if (!navItem) {
            return [];
        }
        const config = COLLECTION_CONFIG[navItem.id];
        if (!config || typeof config.getGames !== 'function') {
            return [];
        }
        const raw = config.getGames();
        return Array.isArray(raw) ? raw.filter(Boolean) : [];
    }

    function decorateLink(link, game) {
        if (!link || !game) {
            return;
        }
        link.href = buildDetailUrl(game);
        link.dataset.slug = game.slug || '';
        link.addEventListener('click', () => {
            if (game.slug) {
                recordRecentlyPlayed(game.slug);
            }
        }, { once: true });
    }

    function createCollectionCard(game) {
        const link = document.createElement('a');
        link.className = 'glass-card overflow-hidden flex flex-col transition duration-200 hover:-translate-y-1';
        decorateLink(link, game);
        const description = (game.description || '').slice(0, 180);
        link.innerHTML = `
            <div class="relative h-44 bg-slate-900/60">
                <img src="${game.image}" alt="${game.name}" class="w-full h-full object-cover">
            </div>
            <div class="p-4 space-y-2">
                <h3 class="text-lg font-semibold text-white truncate">${game.name}</h3>
                <p class="text-white/60 text-sm leading-relaxed h-[3.6rem] overflow-hidden">${description}</p>
                <div class="flex items-center justify-between text-xs text-white/50">
                    <span>${formatCategory(game.category)}</span>
                    <span>Rating ${formatRating(game.rating)}</span>
                </div>
                <div class="text-xs text-white/50">${formatPlays(game.plays)}</div>
            </div>
        `;
        return link;
    }

    function resetCollectionState(navId, games) {
        collectionState.navId = navId;
        collectionState.games = Array.isArray(games) ? games : [];
        collectionState.rendered = 0;
        collectionState.total = collectionState.games.length;
    }

    function renderCollectionBatch() {
        if (!collectionGrid || collectionState.navId !== activeNavId) {
            return;
        }
        const games = collectionState.games;
        if (!Array.isArray(games) || !games.length) {
            toggleCollectionSentinel(false);
            updateCollectionMeta();
            return;
        }
        if (collectionState.rendered >= games.length) {
            toggleCollectionSentinel(false);
            destroyCollectionObserver();
            return;
        }

        const nextItems = games.slice(collectionState.rendered, collectionState.rendered + COLLECTION_BATCH_SIZE);
        nextItems.forEach(game => {
            if (!game) {
                return;
            }
            const card = createCollectionCard(game);
            collectionGrid.appendChild(card);
        });

        collectionState.rendered += nextItems.length;
        updateCollectionMeta();

        if (collectionState.rendered >= games.length) {
            toggleCollectionSentinel(false);
            destroyCollectionObserver();
        } else {
            toggleCollectionSentinel(true);
        }
    }

    function updateCollectionMeta() {
        if (!collectionMeta) {
            return;
        }
        const total = collectionState.total || 0;
        if (!total) {
            collectionMeta.classList.add('hidden');
            return;
        }
        const rendered = Math.min(collectionState.rendered, total);
        const label = rendered >= total
            ? `${total} games`
            : `Showing ${rendered} of ${total} games`;
        collectionMeta.textContent = label;
        collectionMeta.classList.remove('hidden');
    }

    function initCollectionObserver() {
        if (!collectionSentinel || collectionState.navId !== activeNavId) {
            return;
        }
        if (collectionState.rendered >= collectionState.games.length) {
            toggleCollectionSentinel(false);
            return;
        }
        destroyCollectionObserver();
        collectionObserver = new IntersectionObserver(entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                renderCollectionBatch();
            }
        }, { root: null, rootMargin: '200px 0px', threshold: 0.05 });
        collectionObserver.observe(collectionSentinel);
        toggleCollectionSentinel(true);
    }

    function destroyCollectionObserver() {
        if (collectionObserver) {
            collectionObserver.disconnect();
            collectionObserver = null;
        }
        toggleCollectionSentinel(false);
    }

    function toggleCollectionSentinel(show) {
        if (!collectionSentinel) {
            return;
        }
        if (show) {
            collectionSentinel.classList.remove('hidden');
        } else {
            collectionSentinel.classList.add('hidden');
        }
    }

    function setActiveNav(navId) {
        activeNavId = navId;

        document.querySelectorAll('#sidebar-nav .sidebar-link').forEach(button => {
            button.classList.toggle('active', button.dataset.navId === navId);
        });
        document.querySelectorAll('#mobile-nav .mobile-nav-pill').forEach(button => {
            button.classList.toggle('active', button.dataset.navId === navId);
        });

        document.querySelectorAll('[data-nav-target]').forEach(link => {
            const isActive = link.dataset.navTarget === navId;
            link.classList.toggle('text-white', isActive);
            link.classList.toggle('font-semibold', isActive);
            if (!isActive) {
                link.classList.add('text-white/70');
            } else {
                link.classList.remove('text-white/70');
            }
        });
    }

    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const suggestions = document.getElementById('search-suggestions');

        if (!searchInput || !searchButton || !suggestions) {
            return;
        }

        const handleInput = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                suggestions.classList.add('hidden');
                suggestions.innerHTML = '';
                return;
            }

            const matches = GameUtils.searchGames(query).slice(0, 6);
            if (!matches.length) {
                suggestions.innerHTML = '<div class="px-4 py-3 text-sm text-white/60">No matches yet. Try another keyword.</div>';
                suggestions.classList.remove('hidden');
                return;
            }

            suggestions.innerHTML = '';
            matches.forEach(game => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/10 transition';
                item.innerHTML = `
                    <div>
                        <p class="font-semibold text-sm text-white">${game.name}</p>
                        <p class="text-xs uppercase tracking-[0.25em] text-white/50 mt-1">${formatCategory(game.category)}</p>
                    </div>
                    <span class="text-xs text-white/50">${game.releaseDate || ''}</span>
                `;
                item.addEventListener('click', () => {
                    window.location.href = buildDetailUrl(game);
                });
                suggestions.appendChild(item);
            });

            suggestions.classList.remove('hidden');
        };

        searchInput.addEventListener('input', handleInput);
        searchInput.addEventListener('focus', handleInput);

        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                triggerSearch();
            }
        });

        searchButton.addEventListener('click', triggerSearch);

        function triggerSearch() {
            const query = searchInput.value.trim();
            if (!query) {
                window.location.href = 'all-games.html';
                return;
            }
            window.location.href = `all-games.html?search=${encodeURIComponent(query)}`;
        }

        document.addEventListener('click', event => {
            if (!suggestions.contains(event.target) && event.target !== searchInput) {
                suggestions.classList.add('hidden');
            }
        });
    }

    function buildDetailUrl(game) {
        if (!game) {
            return '#';
        }
        const params = new URLSearchParams();
        if (game.id) {
            params.set('id', game.id);
        }
        params.set('slug', game.slug || game.name.toLowerCase().replace(/\s+/g, '-'));
        return `game-detail.html?${params.toString()}`;
    }

    function getRecentlyPlayed() {
        const raw = getStoredRecents();
        return raw
            .map(slug => GameUtils.getGameBySlug(slug))
            .filter(Boolean);
    }

    function getStoredRecents() {
        try {
            const raw = window.localStorage.getItem('arcadebloom_recently_played');
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function recordRecentlyPlayed(slug) {
        if (!slug) {
            return;
        }
        try {
            const stored = getStoredRecents();
            const filtered = stored.filter(entry => entry !== slug);
            filtered.unshift(slug);
            window.localStorage.setItem('arcadebloom_recently_played', JSON.stringify(filtered.slice(0, 12)));
        } catch (error) {
            console.warn('Unable to persist recently played games.', error);
        }
        renderNavigation();
    }

    function showUnavailableState() {
        const host = document.getElementById('main-column');
        if (host) {
            host.innerHTML = '<div class="glass-card p-8 text-center space-y-3"><h2 class="text-2xl font-bold">Game unavailable</h2><p class="text-white/70 text-sm">This game might have been moved, renamed, or deleted. Head back to the homepage to pick another title.</p></div>';
        }
    }
})();
