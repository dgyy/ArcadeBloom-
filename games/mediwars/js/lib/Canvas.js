/**
 * Generate a new canvas in memory
 * @param {number} width 
 * @param {number} height 
 * @param {HTMLCanvasElement} HTMLCanvasElement
 */
export const createCanvasContext = (width, height, canvasElement) => {
  const canvas = canvasElement ?? document.createElement('canvas');
  canvas.width = width * 2;
  canvas.height = height * 2;
  const context = canvas.getContext('2d');
  context.scale(2,2);

  return { canvas, context };
};
