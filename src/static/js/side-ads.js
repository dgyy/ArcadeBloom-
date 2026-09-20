const DESKTOP_RAIL = '(min-width: 1600px)';
const CLIENT = 'ca-pub-1115845392526625';
const SLOTS = {
    left: '8427263236',
    right: '3039205182',
};
const media = window.matchMedia(DESKTOP_RAIL);
let libraryPromise;

function createRail(side) {
    const rail = document.createElement('aside');
    rail.className = `game-side-ad game-side-ad--${side}`;
    rail.setAttribute('aria-label', `${side === 'left' ? 'Left' : 'Right'} advertisement`);

    const label = document.createElement('p');
    label.className = 'game-side-ad__label';
    label.textContent = 'Advertisement';

    const ad = document.createElement('ins');
    ad.className = 'adsbygoogle';
    ad.style.display = 'inline-block';
    ad.style.width = '160px';
    ad.style.height = '600px';
    ad.dataset.adClient = CLIENT;
    ad.dataset.adSlot = SLOTS[side];

    const statusObserver = new MutationObserver(() => {
        if (/^unfill/.test(ad.dataset.adStatus || '')) rail.hidden = true;
        if (ad.dataset.adStatus === 'filled') rail.hidden = false;
    });
    statusObserver.observe(ad, { attributes: true, attributeFilter: ['data-ad-status'] });

    rail.append(label, ad);
    document.body.append(rail);
    return ad;
}

function loadLibrary() {
    if (libraryPromise) return libraryPromise;
    libraryPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT}`;
        script.addEventListener('load', resolve, { once: true });
        script.addEventListener('error', reject, { once: true });
        document.head.append(script);
    });
    return libraryPromise;
}

function requestAds(ads) {
    for (const ad of ads) {
        try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (_) {
            ad.dataset.adStatus = 'unavailable';
        }
    }
}

function updateSideAds() {
    if (!media.matches) {
        document.querySelectorAll('.game-side-ad').forEach(rail => rail.remove());
        return;
    }
    if (document.querySelector('.game-side-ad')) return;
    const ads = [createRail('left'), createRail('right')];
    loadLibrary().then(() => requestAds(ads)).catch(() => {
        ads.forEach(ad => { ad.dataset.adStatus = 'unavailable'; });
    });
}

updateSideAds();
media.addEventListener('change', updateSideAds);
