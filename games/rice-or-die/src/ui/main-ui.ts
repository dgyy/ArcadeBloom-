import {
  AttackPower,
  TowerCd,
  TowerEntity,
  TowerRange,
  UnitPrices,
  UpdatePaths,
  units,
} from 'entities/tower-entity';
import { Grid } from 'grid';
import {
  getPlayerState,
  getSystemState,
  getTowersState,
  getUiState,
  updatePlayerState,
  updateSystemState,
  updateTowersState,
  updateUiState,
} from 'state';

type Action = {
  name: string;
  handler: (grid: Grid) => () => void;
};

const actions: Action[] = [
  {
    name: 'Start Wave',
    handler: (grid: Grid) => () => {
      updateSystemState({ ...getSystemState(), waveStarted: true, timer: 0 });
      renderUi(grid);
    },
  },
];

export const renderUi = (grid: Grid) => {
  grid.uiHtmlGrid.innerHTML = '';
  const uiContainer = renderUiContainer(grid);
  renderStatus(uiContainer);
  const selectedUnit = getTowersState().find((t) => t.selected);
  if (selectedUnit) return renderTowerInfo(uiContainer, grid, selectedUnit);
  renderUnits(uiContainer, grid);
  renderActions(uiContainer, grid);
};

const renderTowerInfo = (container: HTMLDivElement, grid: Grid, tower: TowerEntity) => {
  const updatePaths = UpdatePaths[tower.name];
  if (!tower.class) {
    updatePaths.forEach((e) => {
      if (!tower.color) return;
      const element = document.createElement('div');
      element.style.backgroundColor = 'gray';
      element.style.width = `100%`;
      element.style.cursor = 'pointer';
      element.textContent = e.name;
      const price = document.createElement('div');
      price.style.whiteSpace = 'break-spaces';
      const info =
        e.name !== 'Rice plantation'
          ? `Attack:${e.stats.attack}\nRange:${e.stats.range}\nCoolDown:${e.stats.cd}`
          : `Produce: 100 rice\nin intervals`;
      price.textContent = `Rice: ${e.price}\n\n${info}`;
      element.appendChild(price);
      element.onclick = () => {
        const state = getUiState();
        updateUiState(state);
        const newTowers = getTowersState().map((t) => {
          if (t.selected && getPlayerState().rice >= e.price) {
            updatePlayerState({ ...getPlayerState(), rice: getPlayerState().rice - e.price });
            return { ...t, stats: e.stats, class: e.name, selected: false };
          }
          return t;
        });
        updateTowersState(newTowers);
        renderUi(grid);
      };
      container.appendChild(element);
    });
  }
  const element = document.createElement('div');
  element.style.backgroundColor = 'blue';
  element.style.color = 'white';
  element.style.width = `100%`;
  element.style.cursor = 'pointer';
  element.textContent = 'Back';
  element.onclick = () => {
    updateTowersState(getTowersState().map((t) => ({ ...t, selected: false })));
    renderUi(grid);
  };
  container.appendChild(element);
};

const renderUiContainer = (grid: Grid) => {
  const menuHtmlContainer = document.createElement('div');
  menuHtmlContainer.style.backgroundColor = 'white';
  menuHtmlContainer.style.gridArea = `1/42/28/49`;
  menuHtmlContainer.style.display = 'grid';
  menuHtmlContainer.style.gridTemplateColumns = `repeat(${1}, 1fr)`;
  menuHtmlContainer.style.gridTemplateRows = `repeat(${6},1fr)`;
  grid.uiHtmlGrid.appendChild(menuHtmlContainer);
  return menuHtmlContainer;
};

const renderStatus = (container: HTMLDivElement) => {
  const waveStatus = document.createElement('div');
  waveStatus.style.width = `100%`;
  waveStatus.style.cursor = 'pointer';
  waveStatus.textContent = `Wave ${getSystemState().wave}/10`;
  const riceStatus = document.createElement('div');
  riceStatus.textContent = `Rice: ${getPlayerState().rice}`;
  const lifeStatus = document.createElement('div');
  lifeStatus.textContent = `Life: ${getPlayerState().life}`;
  const statusContainer = document.createElement('div');
  statusContainer.style.backgroundColor = 'orange';
  statusContainer.appendChild(waveStatus);
  statusContainer.appendChild(riceStatus);
  statusContainer.appendChild(lifeStatus);
  container.appendChild(statusContainer);
};

const renderUnits = (container: HTMLDivElement, grid: Grid) => {
  const state = getUiState();
  units.forEach((e) => {
    const element = document.createElement('div');
    element.style.backgroundColor = 'gray';
    if (e === state.activeUnit) element.style.backgroundColor = 'red';
    element.style.width = `100%`;
    element.style.cursor = 'pointer';
    element.textContent = e;
    const price = document.createElement('div');
    price.style.whiteSpace = 'break-spaces';
    const info =
      e !== 'Rice Farmer'
        ? `Attack:${AttackPower[e]}\nRange:${TowerRange[e]}\nCoolDown:${TowerCd[e]}`
        : `Produce: 50 rice\nin intervals`;
    price.textContent = `Rice: ${UnitPrices[e]}\n\n${info}`;
    element.appendChild(price);
    element.onclick = () => {
      const state = getUiState();
      state.activeUnit = e;
      updateUiState(state);
      renderUi(grid);
    };
    container.appendChild(element);
  });
};

const renderActions = (container: HTMLDivElement, grid: Grid) => {
  if (getSystemState().waveStarted) return;

  const currentActions = actions;

  currentActions.forEach((e) => {
    const element = document.createElement('div');
    element.style.backgroundColor = 'blue';
    element.style.color = 'white';
    element.style.width = `100%`;
    element.style.cursor = 'pointer';
    element.textContent = e.name;
    element.onclick = e.handler(grid);
    container.appendChild(element);
  });
};
