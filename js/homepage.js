(function () {
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

    const RECENT_KEY = 'arcadebloom_recently_played';
    const NAV_ITEMS = [
        { id: 'home', label: 'Home', target: '#home-view' },
        { id: 'picks', label: 'Top Picks', target: '#top-picks' },
        { id: 'featured', label: 'Featured Games', target: '#featured-spotlight' },
        { id: 'new', label: 'New Releases', target: '#new-releases' },
        { id: 'recent', label: 'Recently Played', target: '#recently-played' },
        { id: 'action', label: 'Action', target: '#rail-action', categoryId: 'action' },
        { id: 'puzzle', label: 'Puzzle', target: '#rail-puzzle', categoryId: 'puzzle' },
        { id: 'casual', label: 'Casual', target: '#rail-casual', categoryId: 'casual' },
        { id: 'sports', label: 'Sports', target: '#rail-sports', categoryId: 'sports' }
    ];

    const COLLECTION_CONFIG = {
        home: { type: 'home' },
        picks: {
            title: 'Top Picks',
            description: 'Editor-curated standouts that blend instant fun with long-term replay value.',
            limit: 24,
            getGames: () => GameUtils.getPopularGames(24)
        },
        featured: {
            title: 'Featured Games',
            description: 'High-impact launches and refreshed classics highlighted by the ArcadeBloom team.',
            limit: 24,
            getGames: () => {
                const games = GameUtils.getFeaturedGames();
                return games.length ? games : GameUtils.getPopularGames(24);
            }
        },
        new: {
            title: 'New Releases',
            description: 'Fresh uploads and seasonal drops - check back often to catch the latest arrivals.',
            limit: 24,
            getGames: () => GameUtils.getNewestGames(24)
        },
        recent: {
            title: 'Recently Played',
            description: 'Picked up where you left off. Stored locally for this device only.',
            limit: 24,
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

    let activeNavItems = [];
    let activeNavId = 'home';
    const railRegistry = new Set();

    function scheduleIdle(work, timeout = 1500) {
        if (typeof window.requestIdleCallback === 'function') {
            window.requestIdleCallback(work, { timeout });
        } else {
            setTimeout(work, 0);
        }
    }

    window.addEventListener('resize', () => {
        railRegistry.forEach(entry => entry.update());
    });

    document.addEventListener('DOMContentLoaded', () => {
        if (typeof GameUtils === 'undefined') {
            console.warn('Game data not available yet.');
            return;
        }

        renderNav();
        renderStats();
        setupSearch();
        bindQuickLinks();
        handleNavSelection('home');

        renderTopPicks();
        renderFeaturedSpotlight();
        renderNewReleases();
        renderRecentlyPlayed();

        scheduleIdle(() => {
            renderCategoryRails();
        });
    });

    function renderNav() {
        const sidebarNav = document.getElementById('sidebar-nav');
        const mobileNav = document.getElementById('mobile-nav');
        const filteredItems = NAV_ITEMS.filter(shouldRenderNavItem);
        activeNavItems = filteredItems;

        if (sidebarNav) {
            sidebarNav.innerHTML = '';
        }
        if (mobileNav) {
            mobileNav.innerHTML = '';
        }

        filteredItems.forEach((item) => {
            const countData = getNavCountData(item);
            const formattedCount = countData === null ? null : formatNumber(countData);
            if (sidebarNav) {
                const sidebarBtn = document.createElement('button');
                sidebarBtn.type = 'button';
                sidebarBtn.className = `sidebar-link${activeNavId === item.id ? ' active' : ''}`;
                sidebarBtn.dataset.navId = item.id;
                if (item.target) {
                    sidebarBtn.dataset.target = item.target;
                }
                sidebarBtn.innerHTML = `
                    <span>${item.label}</span>
                    <span class="ml-auto text-xs font-semibold text-white/60${formattedCount === null ? ' hidden' : ''}" data-nav-count="${item.id}">
                        ${formattedCount ?? ''}
                    </span>
                `;
                sidebarBtn.addEventListener('click', () => handleNavSelection(item.id));
                sidebarNav.appendChild(sidebarBtn);
            }

            if (mobileNav) {
                const mobileBtn = document.createElement('button');
                mobileBtn.type = 'button';
                mobileBtn.className = `mobile-nav-pill${activeNavId === item.id ? ' active' : ''}`;
                mobileBtn.dataset.navId = item.id;
                mobileBtn.dataset.navLabel = item.label;
                mobileBtn.textContent = formattedCount === null ? item.label : `${item.label} (${formattedCount})`;
                mobileBtn.addEventListener('click', () => handleNavSelection(item.id));
                mobileNav.appendChild(mobileBtn);
            }
        });

        setActiveNav(activeNavId);
        updateNavCountDisplays();
    }

    function shouldRenderNavItem(item) {
        if (!item.categoryId) {
            return true;
        }
        return GameUtils.getGamesByCategory(item.categoryId).length > 0;
    }

    function getNavCountData(item) {
        if (!item || item.id === 'home') {
            return null;
        }
        if (item.id === 'recent') {
            return getRecentlyPlayed().length;
        }
        const games = getNavCollection(item);
        return games.length;
    }

    function getNavLimit(item) {
        if (!item) {
            return Infinity;
        }
        if (item.id === 'recent') {
            const config = COLLECTION_CONFIG[item.id];
            return config && Number.isFinite(config.limit) ? config.limit : Infinity;
        }
        const config = COLLECTION_CONFIG[item.id];
        if (config && Number.isFinite(config.limit)) {
            return config.limit;
        }
        if (item.categoryId) {
            return 24;
        }
        return Infinity;
    }

    function getNavCollection(item) {
        if (!item) {
            return [];
        }
        const config = COLLECTION_CONFIG[item.id];
        if (config && typeof config.getGames === 'function') {
            const result = config.getGames();
            return Array.isArray(result) ? result.filter(Boolean) : [];
        }
        if (item.categoryId) {
            const result = GameUtils.getGamesByCategory(item.categoryId) || [];
            return Array.isArray(result) ? result.filter(Boolean) : [];
        }
        return [];
    }

    function updateNavCountDisplays() {
        const sidebarNav = document.getElementById('sidebar-nav');
        const mobileNav = document.getElementById('mobile-nav');
        if (!sidebarNav && !mobileNav) {
            return;
        }
        activeNavItems.forEach(item => {
            const countData = getNavCountData(item);
            const formatted = countData === null ? null : formatNumber(countData);
            if (sidebarNav) {
                const span = sidebarNav.querySelector(`[data-nav-count="${item.id}"]`);
                if (span) {
                    if (formatted === null) {
                        span.textContent = '';
                        span.classList.add('hidden');
                    } else {
                        span.textContent = formatted;
                        span.classList.remove('hidden');
                    }
                }
            }
            if (mobileNav) {
                const button = mobileNav.querySelector(`[data-nav-id="${item.id}"]`);
                if (button) {
                    const baseLabel = button.dataset.navLabel || item.label;
                    button.textContent = formatted === null ? baseLabel : `${baseLabel} (${formatted})`;
                }
            }
        });
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

    function handleNavSelection(navId) {
        const item = NAV_ITEMS.find(nav => nav.id === navId);
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
            if (isActive) {
                link.classList.add('text-white', 'font-semibold');
                link.classList.remove('text-white/70');
            } else {
                link.classList.remove('text-white', 'font-semibold');
                if (!link.classList.contains('text-white/70')) {
                    link.classList.add('text-white/70');
                }
            }
        });
    }

    function showHomeView() {
        if (collectionView) {
            collectionView.classList.add('hidden');
        }
        if (homeView) {
            homeView.classList.remove('hidden');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showCollectionView(item) {
        if (homeView) {
            homeView.classList.add('hidden');
        }
        if (collectionView) {
            collectionView.classList.remove('hidden');
        }
        renderCollectionView(item);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderCollectionView(item) {
        if (!collectionView) {
            return;
        }
        const config = COLLECTION_CONFIG[item.id];
        if (!config) {
            if (collectionGrid) {
                collectionGrid.innerHTML = '';
            }
            if (collectionEmpty) {
                collectionEmpty.textContent = 'No games available yet.';
                collectionEmpty.classList.remove('hidden');
            }
            return;
        }

        const source = config.getGames ? config.getGames() : [];
        const games = Array.isArray(source) ? source : [];
        const limit = Number.isFinite(config.limit) ? config.limit : Infinity;
        const limitedGames = limit === Infinity ? games : games.slice(0, limit);

        if (collectionTitle) {
            collectionTitle.textContent = config.title || item.label;
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

        if (!limitedGames.length) {
            if (collectionEmpty) {
                collectionEmpty.textContent = 'No games available yet.';
                collectionEmpty.classList.remove('hidden');
            }
            updateNavCountDisplays();
            return;
        }

        if (collectionEmpty) {
            collectionEmpty.classList.add('hidden');
        }

        limitedGames.forEach(game => {
            if (!game) {
                return;
            }
            const card = createCollectionCard(game);
            collectionGrid.appendChild(card);
        });

        updateNavCountDisplays();
    }

    function createCollectionCard(game) {
        const link = document.createElement('a');
        link.className = 'glass-card overflow-hidden flex flex-col transition duration-200 hover:-translate-y-1';
        decorateLink(link, game);
        link.innerHTML = `
            <div class="relative h-44 bg-slate-900/60">
                <img src="${game.image}" alt="${game.name}" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/15 to-transparent"></div>
                <div class="absolute inset-x-0 bottom-0 p-4 space-y-2">
                    <h3 class="text-base font-semibold text-white leading-snug">${game.name}</h3>
                    <span class="inline-flex items-center text-[0.65rem] uppercase tracking-[0.3em] text-white/70 bg-white/10 px-2 py-1 rounded-full">${formatCategory(game.category)}</span>
                </div>
            </div>
        `;
        return link;
    }

    function renderStats() {
        const stats = GameUtils.getGameStats();
        const featuredCount = GameUtils.getFeaturedGames().length;
        updateText('stat-total-games', formatNumber(stats.totalGames));
        updateText('stat-featured', formatNumber(featuredCount));
        updateText('stat-total-plays', formatNumber(stats.totalPlays));
        updateText('stat-average-rating', Number(stats.averageRating || 0).toFixed(1));
    }

    function renderTopPicks() {
        const container = document.getElementById('top-rail');
        if (!container) {
            return;
        }
        container.innerHTML = '';

        const popularGames = GameUtils.getPopularGames(12);
        if (!popularGames.length) {
            container.innerHTML = '<p class="text-white/60 text-sm">No curated games available yet.</p>';
            return;
        }

        const cards = popularGames.slice(0, 8).map((game, index) =>
            createRailCard(game, {
                size: index < 2 ? 'wide' : 'default'
            })
        );

        const wrapper = buildRail(cards, {
            wrapperClass: 'mt-6',
            prevLabel: 'Previous picks',
            nextLabel: 'Next picks'
        });

        container.appendChild(wrapper);
    }

    function renderFeaturedSpotlight() {
        const container = document.getElementById('featured-rail');
        if (!container) {
            return;
        }
        container.innerHTML = '';

        const featuredGames = GameUtils.getFeaturedGames();
        const fallback = GameUtils.getPopularGames(4).filter(game => !featuredGames.some(item => item.slug === game.slug));
        const picks = (featuredGames.length ? featuredGames : fallback).slice(0, 4);

        if (!picks.length) {
            container.innerHTML = '<p class="text-white/60 text-sm">Add featured games in games-data.js to populate this spotlight.</p>';
            return;
        }

        const cards = picks.map(game => createRailCard(game));
        const wrapper = buildRail(cards, {
            wrapperClass: 'mt-4',
            prevLabel: 'Previous featured games',
            nextLabel: 'Next featured games'
        });

        container.appendChild(wrapper);
    }

    function renderNewReleases() {
        const container = document.getElementById('new-rail');
        if (!container) {
            return;
        }
        container.innerHTML = '';

        const newestGames = GameUtils.getNewestGames(10);
        if (!newestGames.length) {
            container.innerHTML = '<p class="text-white/60 text-sm">No recent submissions yet.</p>';
            return;
        }

        const cards = newestGames.map(game => createRailCard(game));
        const wrapper = buildRail(cards, {
            wrapperClass: 'mt-6',
            prevLabel: 'Previous new releases',
            nextLabel: 'Next new releases'
        });
        container.appendChild(wrapper);
    }

    function renderCategoryRails() {
        const host = document.getElementById('category-rails');
        if (!host) {
            return;
        }
        host.innerHTML = '';

        const categoryItems = activeNavItems.filter(item => item.categoryId);
        categoryItems.forEach(item => {
            const limit = getNavLimit(item);
            const rawGames = GameUtils.getGamesByCategory(item.categoryId) || [];
            const games = Number.isFinite(limit) ? rawGames.slice(0, limit) : rawGames;
            const section = document.createElement('section');
            const sectionId = item.target.startsWith('#') ? item.target.substring(1) : item.target;
            section.id = sectionId;
            section.className = 'glass-card p-6 sm:p-7';

            const header = document.createElement('div');
            header.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3';
            header.innerHTML = `
                <div>
                    <h3 class="text-xl font-semibold">${item.label}</h3>
                    <p class="text-white/60 text-sm mt-1">Scroll to explore ${item.label.toLowerCase()} picks.</p>
                </div>
                <span class="status-badge status-updated self-start sm:self-auto">ArcadeBloom</span>
            `;
            section.appendChild(header);

            if (games.length) {
                const nodes = games.map(game => createRailCard(game));
                const wrapper = buildRail(nodes, {
                    wrapperClass: 'mt-5',
                    prevLabel: `Previous ${item.label} games`,
                    nextLabel: `Next ${item.label} games`
                });
                section.appendChild(wrapper);
            } else {
                const empty = document.createElement('p');
                empty.className = 'text-white/60 text-sm mt-5';
                empty.textContent = 'No games in this category yet. Check back soon.';
                section.appendChild(empty);
            }

            host.appendChild(section);
        });
    }

    function renderRecentlyPlayed() {
        const container = document.getElementById('recently-rail');
        const emptyState = document.getElementById('recently-empty');
        const clearButton = document.getElementById('clear-recently');
        if (!container || !emptyState || !clearButton) {
            return;
        }

        container.innerHTML = '';
        const games = getRecentlyPlayed();

        if (!games.length) {
            emptyState.classList.remove('hidden');
            clearButton.classList.add('hidden');
            return;
        }

        emptyState.classList.add('hidden');
        clearButton.classList.remove('hidden');

        const nodes = games.map(game => createRailCard(game));
        const wrapper = buildRail(nodes, {
            wrapperClass: 'mt-6',
            prevLabel: 'Previous recently played games',
            nextLabel: 'Next recently played games'
        });
        container.appendChild(wrapper);

        if (activeNavId === 'recent') {
            const recentNav = NAV_ITEMS.find(nav => nav.id === 'recent');
            if (recentNav) {
                renderCollectionView(recentNav);
            }
        }

        clearButton.onclick = () => {
            clearRecentlyPlayed();
            renderRecentlyPlayed();
        };
    }

    function buildRail(nodes, options = {}) {
        const elements = Array.isArray(nodes) ? nodes.filter(Boolean) : [];
        const wrapperClass = ['rail-wrapper', options.wrapperClass || ''].filter(Boolean).join(' ').trim() || 'rail-wrapper';
        const trackClass = ['rail-track', options.trackClass || ''].filter(Boolean).join(' ').trim() || 'rail-track';

        const wrapper = document.createElement('div');
        wrapper.className = wrapperClass;

        const track = document.createElement('div');
        track.className = trackClass;
        elements.forEach(node => track.appendChild(node));
        wrapper.appendChild(track);

        const prevBtn = createArrowButton('prev', options.prevLabel);
        const nextBtn = createArrowButton('next', options.nextLabel);
        wrapper.appendChild(prevBtn);
        wrapper.appendChild(nextBtn);

        setupRailControls(track, prevBtn, nextBtn, options);

        return wrapper;
    }

    function setupRailControls(track, prevBtn, nextBtn, options = {}) {
        if (!track || !prevBtn || !nextBtn) {
            return;
        }

        const entry = {
            track,
            update: () => {
                if (!document.body.contains(track)) {
                    railRegistry.delete(entry);
                    return;
                }

                const maxScrollLeft = Math.max(track.scrollWidth - track.clientWidth, 0);
                const canScroll = maxScrollLeft > 8;

                toggleHidden(prevBtn, !canScroll);
                toggleHidden(nextBtn, !canScroll);

                if (!canScroll) {
                    prevBtn.disabled = true;
                    nextBtn.disabled = true;
                    prevBtn.setAttribute('aria-disabled', 'true');
                    nextBtn.setAttribute('aria-disabled', 'true');
                    return;
                }

                const nearStart = track.scrollLeft <= 8;
                const nearEnd = track.scrollLeft >= maxScrollLeft - 8;

                prevBtn.disabled = nearStart;
                nextBtn.disabled = nearEnd;
                prevBtn.setAttribute('aria-disabled', nearStart ? 'true' : 'false');
                nextBtn.setAttribute('aria-disabled', nearEnd ? 'true' : 'false');
            }
        };

        railRegistry.add(entry);

        const stepAmount = () => {
            if (typeof options.scrollStep === 'number' && options.scrollStep > 0) {
                return options.scrollStep;
            }
            const width = track.getBoundingClientRect().width || 0;
            return Math.max(width * 0.75, 220);
        };

        const scrollByDirection = direction => {
            track.scrollBy({ left: stepAmount() * direction, behavior: 'smooth' });
        };

        prevBtn.addEventListener('click', () => scrollByDirection(-1));
        nextBtn.addEventListener('click', () => scrollByDirection(1));
        track.addEventListener('scroll', () => requestAnimationFrame(entry.update));

        requestAnimationFrame(entry.update);
    }

    function createArrowButton(direction, customLabel) {
        const isPrev = direction === 'prev';
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `rail-button rail-button-${isPrev ? 'prev' : 'next'}`;
        button.dataset.direction = isPrev ? 'prev' : 'next';
        button.setAttribute('aria-label', customLabel || (isPrev ? 'Previous games' : 'Next games'));
        button.innerHTML = isPrev
            ? '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"></path><path d="M9 12h12"></path></svg>'
            : '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"></path><path d="M3 12h12"></path></svg>';
        return button;
    }

    function toggleHidden(element, hidden) {
        if (!element) {
            return;
        }
        const shouldHide = Boolean(hidden);
        element.classList.toggle('rail-button-hidden', shouldHide);
        element.setAttribute('aria-hidden', shouldHide ? 'true' : 'false');
    }

    function setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchButton = document.getElementById('search-button');
        const suggestionBox = document.getElementById('search-suggestions');

        if (!searchInput || !searchButton || !suggestionBox) {
            return;
        }

        const handleInput = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                suggestionBox.classList.add('hidden');
                suggestionBox.innerHTML = '';
                return;
            }

            const matches = GameUtils.searchGames(query).slice(0, 6);
            if (!matches.length) {
                suggestionBox.innerHTML = '<div class="px-4 py-3 text-sm text-white/60">No matches yet. Try another keyword.</div>';
                suggestionBox.classList.remove('hidden');
                return;
            }

            suggestionBox.innerHTML = '';
            matches.forEach(game => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'w-full text-left px-4 py-3 flex items-center justify-between gap-3 hover:bg-white/10 transition';
                item.innerHTML = `
                    <div>
                        <p class="font-semibold text-sm text-white">${game.name}</p>
                        <p class="text-xs uppercase tracking-[0.25em] text-white/50 mt-1">${game.category || 'Arcade'}</p>
                    </div>
                    <span class="text-xs text-white/50">${game.releaseDate || ''}</span>
                `;
                item.addEventListener('click', () => {
                    suggestionBox.classList.add('hidden');
                    recordRecentlyPlayed(game.slug);
                    renderRecentlyPlayed();
                    goToGame(game);
                });
                suggestionBox.appendChild(item);
            });

            suggestionBox.classList.remove('hidden');
        };

        searchInput.addEventListener('input', handleInput);
        searchInput.addEventListener('focus', handleInput);

        searchButton.addEventListener('click', () => {
            const query = searchInput.value.trim();
            if (!query) {
                window.location.href = 'all-games.html';
                return;
            }
            window.location.href = `all-games.html?search=${encodeURIComponent(query)}`;
        });

        searchInput.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                searchButton.click();
            }
        });

        document.addEventListener('click', event => {
            if (!suggestionBox.contains(event.target) && event.target !== searchInput) {
                suggestionBox.classList.add('hidden');
            }
        });
    }

    
    function createRailCard(game, options = {}) {
        if (!game) {
            return document.createElement('div');
        }

        const { statusType = null, size = 'default' } = options;
        const link = document.createElement('a');
        const classes = ['rail-item', 'group', 'block'];
        if (size === 'wide') {
            classes.push('wide');
        }
        if (size === 'tall') {
            classes.push('tall');
        }
        link.className = classes.join(' ');
        decorateLink(link, game);

        const badge = getStatusBadge(statusType);
        const categoryLabel = game.category ? `<span class="text-[0.65rem] uppercase tracking-[0.3em] text-white/55">${game.category}</span>` : '';

        link.innerHTML = `
            <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40">
                <img src="${game.image}" alt="${game.name}" class="w-full h-44 object-cover transition duration-500 group-hover:scale-105">
                <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent">
                    <div class="flex flex-col gap-2">
                        ${badge ? `<span class="status-badge ${badge.className}">${badge.label}</span>` : ''}
                        <h3 class="text-sm font-semibold text-white leading-snug">${game.name}</h3>
                        ${categoryLabel}
                    </div>
                </div>
            </div>
        `;

        return link;
    }

    function createSpotlightCard(game, statusType = 'hot') {
        const link = document.createElement('a');
        link.className = 'spotlight-card group block';
        decorateLink(link, game);

        const badge = getStatusBadge(statusType);
        const summary = truncate(game.description || '', 140);

        link.innerHTML = `
            <img src="${game.image}" alt="${game.name}" class="w-full h-64 md:h-72 object-cover">
            <div class="spotlight-overlay"></div>
            <div class="absolute inset-0 flex flex-col justify-end p-6 md:p-7">
                <div class="space-y-3">
                    ${badge ? `<span class="status-badge ${badge.className}">${badge.label}</span>` : ''}
                    <h3 class="text-2xl font-bold text-white">${game.name}</h3>
                    ${summary ? `<p class="text-white/70 text-sm">${summary}</p>` : ''}
                </div>
            </div>
        `;

        return link;
    }

    function buildDetailUrl(game) {
        const params = new URLSearchParams();
        if (game && typeof game.id !== 'undefined') {
            params.set('id', game.id);
        }
        if (game && game.name) {
            params.set('name', game.name);
        }
        if (game && game.category) {
            params.set('category', game.category);
        }
        if (game && game.slug) {
            params.set('slug', game.slug);
        }
        return `game-detail.html?${params.toString()}`;
    }

    function decorateLink(link, game) {
        if (!link || !game) {
            return;
        }
        const detailUrl = buildDetailUrl(game);
        link.dataset.slug = game.slug || '';
        link.href = detailUrl;
        link.removeAttribute('target');
        link.removeAttribute('rel');
        link.addEventListener('click', () => {
            recordRecentlyPlayed(game.slug);
            renderRecentlyPlayed();
        });
    }

    function getStatusBadge(type) {
        switch (type) {
            case 'hot':
                return { className: 'status-hot', label: 'Hot' };
            case 'new':
                return { className: 'status-new', label: 'New' };
            case 'updated':
                return { className: 'status-updated', label: 'Updated' };
            case 'top':
                return { className: 'status-top', label: 'Top' };
            default:
                return null;
        }
    }

    function getRecentlyPlayed() {
        const slugs = getStoredRecents();
        return slugs
            .map(slug => GameUtils.getGameBySlug(slug))
            .filter(Boolean);
    }

    function recordRecentlyPlayed(slug) {
        if (!slug) {
            return;
        }
        try {
            const stored = getStoredRecents();
            const filtered = stored.filter(item => item !== slug);
            filtered.unshift(slug);
            window.localStorage.setItem(RECENT_KEY, JSON.stringify(filtered.slice(0, 12)));
        } catch (error) {
            console.warn('Unable to persist recently played games.', error);
        }
        renderNav();
    }

    function clearRecentlyPlayed() {
        try {
            window.localStorage.removeItem(RECENT_KEY);
        } catch (error) {
            console.warn('Unable to clear history.', error);
        }
        renderNav();
    }

    function getStoredRecents() {
        try {
            const raw = window.localStorage.getItem(RECENT_KEY);
            if (!raw) {
                return [];
            }
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (error) {
            return [];
        }
    }

    function goToGame(game) {
        if (!game) {
            return;
        }
        const detailUrl = buildDetailUrl(game);
        window.location.href = detailUrl;
    }

    function isExternal(url) {
        return /^https?:\/\//i.test(url || '');
    }

    function truncate(text, maxLength) {
        if (!text) {
            return '';
        }
        return text.length > maxLength ? `${text.slice(0, maxLength - 1).trim()}...` : text;
    }

    function formatNumber(value) {
        const numeric = Number(value);
        return Number.isFinite(numeric) ? numeric.toLocaleString() : '0';
    }

    function updateText(id, value) {
        const node = document.getElementById(id);
        if (node) {
            node.textContent = value;
        }
    }
})();
