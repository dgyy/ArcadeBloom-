import { cameraScale, vec2, setCanvasFixedSize } from './libs/littlejs.esm.min.js';
import { gameSettings } from './main.js';

export const canvasState = { biomeCanvas: null };
export function setupBiomeCanvas() {
    if (!canvasState.biomeCanvas) {
        
        setCanvasFixedSize(vec2(window.innerWidth, window.innerHeight)); // Set the canvas size to the window size
        const canvas = document.createElement('canvas');
        canvas.width = window.innerWidth; // generate in full quality
        canvas.height = window.innerHeight; // generate in full quality
        canvasState.biomeCanvas = canvas;
        console.log('Biome canvas created with scale', cameraScale);
        
    }
}

export function adjustCanvasSize() {
    gameSettings.mapCanvas.width = window.innerWidth;
    gameSettings.mapCanvas.height = window.innerHeight;
}