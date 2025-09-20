import { cube, pyramid } from "./tools"

export const addCastle = (
  colorContext: CanvasRenderingContext2D,
  heightContext: CanvasRenderingContext2D,
  x: number,
  y: number,
  side: number,
  height: number,
) => {
  const leftTopX = x - side / 2 | 0;
  const leftTopY = y - side / 2 | 0;

  // Walls
  const wallThickness = 5;

  colorContext.fillStyle = "#666667";
  heightContext.fillStyle = `rgb(${5}, 0 ,0)`;
  colorContext.fillRect(
    leftTopX - wallThickness * 3,
    leftTopY - wallThickness * 3,
    side + wallThickness * 8,
    side + wallThickness * 8
  );
  heightContext.fillRect(
    leftTopX - wallThickness * 3,
    leftTopY - wallThickness * 3,
    side + wallThickness * 8,
    side + wallThickness * 8
  );

  colorContext.fillStyle = "#888";
  heightContext.fillStyle = `rgb(${height}, 0 ,0)`;

  colorContext.fillRect(leftTopX, leftTopY, wallThickness, side);
  heightContext.fillRect(leftTopX, leftTopY, wallThickness, side);

  colorContext.fillRect(leftTopX, leftTopY, side, wallThickness);
  heightContext.fillRect(leftTopX, leftTopY, side, wallThickness);

  colorContext.fillRect(leftTopX, leftTopY + side, side, wallThickness);
  heightContext.fillRect(leftTopX, leftTopY + side, side, wallThickness);

  colorContext.fillRect(leftTopX + side, leftTopY, wallThickness, side + wallThickness);
  heightContext.fillRect(leftTopX + side, leftTopY, wallThickness, side + wallThickness);

  // Towers
  const towerThickness = wallThickness * 3;
  colorContext.fillStyle = "#999";
  heightContext.fillStyle = `rgb(${height + 30}, 0 ,0)`;
  colorContext.fillRect(leftTopX - wallThickness, leftTopY - wallThickness, towerThickness, towerThickness);
  heightContext.fillRect(leftTopX - wallThickness, leftTopY - wallThickness, towerThickness, towerThickness);

  colorContext.fillRect(leftTopX + side, leftTopY + side, towerThickness, towerThickness);
  heightContext.fillRect(leftTopX + side, leftTopY + side, towerThickness, towerThickness);

  colorContext.fillRect(leftTopX - wallThickness, leftTopY + side, towerThickness, towerThickness);
  heightContext.fillRect(leftTopX - wallThickness, leftTopY + side, towerThickness, towerThickness);

  colorContext.fillRect(leftTopX + side, leftTopY - wallThickness, towerThickness, towerThickness);
  heightContext.fillRect(leftTopX + side, leftTopY - wallThickness, towerThickness, towerThickness);

  // Keep
  heightContext.fillStyle = `rgb(${height + 40}, 0 ,0)`;
  colorContext.fillRect(x - wallThickness * 4, y - wallThickness * 4, side - wallThickness * 6, side - wallThickness * 6);
  heightContext.fillRect(x - wallThickness * 4, y - wallThickness * 4, side - wallThickness * 6, side - wallThickness * 6);
}
