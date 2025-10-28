(function () {
    const RECENT_KEY = 'arcadebloom_recently_played';
    const NAV_ITEMS = [
        { id: 'home', label: 'Home', target: '#top-picks' },
        { id: 'picks', label: 'Top Picks', target: '#top-picks' },
        { id: 'featured', label: 'Featured Games', target: '#featured-spotlight' },
        { id: 'new', label: 'New Releases', target: '#new-releases' },
        { id: 'recent', label: 'Recently Played', target: '#recently-played' },
        { id: 'action', label: 'Action', target: '#rail-action', categoryId: 'action' },
        { id: 'puzzle', label: 'Puzzle', target: '#rail-puzzle', categoryId: 'puzzle' },
        { id: 'casual', label: 'Casual', target: '#rail-casual', categoryId: 'casual' },
        { id: 'sports', label: 'Sports', target: '#rail-sports', categoryId: 'sports' }
    ];

    let activeNavItems = [];
    const railRegistry = new Set();

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
        renderTopPicks();
        renderFeaturedSpotlight();
        renderNewReleases();
        renderCategoryRails();
        renderRecentlyPlayed();
        setupSearch();
        setupScrollSpy();
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

        filteredItems.forEach((item, index) => {
            if (sidebarNav) {
                const sidebarBtn = document.createElement('button');
                sidebarBtn.type = 'button';
                sidebarBtn.className = `sidebar-link${index === 0 ? ' active' : ''}`;
                sidebarBtn.dataset.target = item.target;
                const sidebarSegments = [];
                if (item.icon) {
                    sidebarSegments.push(`<span class="text-lg">${item.icon}</span>`);
                }
                sidebarSegments.push(`<span>${item.label}</span>`);
                sidebarBtn.innerHTML = sidebarSegments.join('');
                sidebarBtn.addEventListener('click', () => {
                    scrollToSection(item.target);
                    setActiveNav(item.target);
                });
                sidebarNav.appendChild(sidebarBtn);
            }

            if (mobileNav) {
                const mobileBtn = document.createElement('button');
                mobileBtn.type = 'button';
                mobileBtn.className = `mobile-nav-pill${index === 0 ? ' active' : ''}`;
                mobileBtn.dataset.target = item.target;
                mobileBtn.textContent = item.label;
                mobileBtn.addEventListener('click', () => {
                    scrollToSection(item.target);
                    setActiveNav(item.target);
                });
                mobileNav.appendChild(mobileBtn);
            }
        });

        if (filteredItems.length) {
            setActiveNav(filteredItems[0].target);
        }
    }

    function shouldRenderNavItem(item) {
        if (!item.categoryId) {
            return true;
        }
        return GameUtils.getGamesByCategory(item.categoryId).length > 0;
    }

    function scrollToSection(target) {
        const element = document.querySelector(target);
        if (!element) {
            return;
        }
        const header = document.querySelector('.nav-shell');
        const offset = header ? header.getBoundingClientRect().height + 24 : 80;
        const top = element.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: Math.max(top, 0), behavior: 'smooth' });
    }

    function setActiveNav(target) {
        if (!target) {
            return;
        }
        document.querySelectorAll('#sidebar-nav .sidebar-link').forEach(button => {
            button.classList.toggle('active', button.dataset.target === target);
        });
        document.querySelectorAll('#mobile-nav .mobile-nav-pill').forEach(button => {
            button.classList.toggle('active', button.dataset.target === target);
        });
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
            const games = GameUtils.getGamesByCategory(item.categoryId).slice(0, 8);
            const section = document.createElement('section');
            const sectionId = item.target.startsWith('#') ? item.target.substring(1) : item.target;
            section.id = sectionId;
            section.className = 'glass-card p-6 sm:p-7';

            const header = document.createElement('div');
            header.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3';
            const headingPieces = [];
            if (item.icon) {
                headingPieces.push(item.icon);
            }
            headingPieces.push(item.label);
            header.innerHTML = `
                <div>
                    <h3 class="text-xl font-semibold">${headingPieces.join(' ')}</h3>
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

    function setupScrollSpy() {
        if (!('IntersectionObserver' in window)) {
            return;
        }

        const sections = activeNavItems
            .map(item => {
                const element = document.querySelector(item.target);
                return element ? { element, target: item.target } : null;
            })
            .filter(Boolean);

        if (!sections.length) {
            return;
        }

        const observer = new IntersectionObserver(entries => {
            const visibleEntry = entries
                .filter(entry => entry.isIntersecting)
                .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

            if (visibleEntry && visibleEntry.target.id) {
                setActiveNav(`#${visibleEntry.target.id}`);
            }
        }, {
            rootMargin: '-35% 0px -55% 0px',
            threshold: [0.2, 0.4, 0.6]
        });

        sections.forEach(({ element }) => observer.observe(element));
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
    }

    function clearRecentlyPlayed() {
        try {
            window.localStorage.removeItem(RECENT_KEY);
        } catch (error) {
            console.warn('Unable to clear history.', error);
        }
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
