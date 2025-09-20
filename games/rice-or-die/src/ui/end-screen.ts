import { Grid } from 'grid';
import { resetState, updateEnemiesState, updateTowersState } from 'state';

export const renderEndScreen = (grid: Grid, endText: string) => {
  updateEnemiesState([]);
  updateTowersState([]);
  grid.uiHtmlGrid.innerHTML = '';
  const container = document.createElement('div');
  container.textContent = endText;
  container.style.backgroundColor = 'black';
  container.style.color = 'white';
  container.style.gridArea = `1/1/28/49`;
  container.style.display = 'grid';
  container.style.gridTemplateColumns = `repeat(${1}, 1fr)`;
  container.style.gridTemplateRows = `repeat(${6},1fr)`;
  grid.uiHtmlGrid.appendChild(container);
  const button = document.createElement('button');
  button.textContent = 'Start a new game click here';
  button.style.background = 'red';
  button.style.fontSize = '20px';

  container.appendChild(button);
  button.onclick = resetState;
};
