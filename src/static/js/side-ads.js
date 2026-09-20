const DESKTOP_RAIL = '(min-width: 1500px)';
const CLIENT = 'ca-pub-1115845392526625';
const SLOT = '1115845392';
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
    ad.dataset.adClient = CLIENT;
    ad.dataset.adSlot = SLOT;
    ad.dataset.adFormat = 'vertical';
    ad.dataset.fullWidthResponsive = 'false';

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
