const LOCAL_STORAGE_KEY = "road-to-rome-2023";

export function loadScore(): number {
    return parseFloat(localStorage.getItem(LOCAL_STORAGE_KEY)! ?? 0);
}

export function saveScore(score: number): void {
    localStorage.setItem(LOCAL_STORAGE_KEY, score.toFixed(1));
}

