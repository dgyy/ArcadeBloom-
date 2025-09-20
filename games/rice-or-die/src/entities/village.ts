import { Grid } from 'grid';
import { getState } from '../state.ts';

export const renderVillage = (grid: Grid) => {
  const village = getState().village;
  const element = document.createElement('div');
  element.style.gridArea = `${village.y}/${village.x}/${village.y + village.height}/${
    village.x + village.width
  }`;
  element.style.background = 'transparent';
  element.style.backgroundImage = "url('./v.png')";
  element.style.backgroundSize = '32px';
  grid.entityGrid.appendChild(element);
  return element;
};

export const getVillageCoordinates = () => {
  const villagePosition = {
    x: getState().village.x,
    y: getState().village.y,
  };
  // Get all coordinates inside village
  const villageCoordinates = [];
  for (let i = 0; i < getState().village.width; i++) {
    for (let j = 0; j < getState().village.height; j++) {
      villageCoordinates.push({ x: villagePosition.x + i, y: villagePosition.y + j });
    }
  }
  return villageCoordinates;
};

export const isInsideVillage = (x: number, y: number): boolean => {
  return getVillageCoordinates().some((villagePosition) => {
    return villagePosition.x === x && villagePosition.y === y;
  });
};
