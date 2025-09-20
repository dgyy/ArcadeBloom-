import { Grid } from 'grid';

export const renderDialog = (grid: Grid, text: string, locationBottom = true) => {
  const element = document.createElement('div');
  element.style.backgroundColor = 'white';
  if (locationBottom) element.style.gridArea = '8/1/8/11';
  else element.style.gridArea = '1/1/1/11';
  element.textContent = text;
  grid.uiHtmlGrid.appendChild(element);
};
