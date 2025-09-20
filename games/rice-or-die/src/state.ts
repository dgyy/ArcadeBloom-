import { EnemyEntity } from 'entities/enemy-entity.ts';
import { TowerEntity } from 'entities/tower-entity.ts';

export type SystemState = {
  timer: number;
  wave: number;
  waveStarted: boolean;
  showingEndScreen: boolean;
};

export type UiState = {
  activeUnit: null | string;
  dialog: string | null;
};

export type PlayerState = {
  rice: number;
  life: number;
};

export type Village = { x: number; y: number; width: number; height: number };

export type State = {
  uiState: UiState;
  enemies: EnemyEntity[];
  towers: TowerEntity[];
  system: SystemState;
  player: PlayerState;
  village: Village;
};

const defaultState = {
  system: {
    timer: 0,
    wave: 1,
    waveStarted: false,
    showingEndScreen: false,
  },
  player: {
    rice: 2000,
    life: 50,
  },
  uiState: {
    activeUnit: null,
    dialog: null,
  },
  enemies: [],
  towers: [],
  village: {
    x: 39,
    y: 11,
    height: 7,
    width: 3,
  },
};

let state: State = JSON.parse(JSON.stringify(defaultState)) as State;

// get fresh and juicy copy of state
export const getState = () => JSON.parse(JSON.stringify(state)) as State;

export const updateState = (newState: State) => {
  state = newState;
};

// Get copy of UI state
export const getUiState = () => getState().uiState;

export const updateUiState = (newState: UiState) =>
  updateState({
    ...getState(),
    uiState: newState,
  });

export const getEnemiesState = (): EnemyEntity[] => getState().enemies;

export const updateEnemiesState = (newEntities: EnemyEntity[]) =>
  updateState({
    ...getState(),
    enemies: newEntities,
  });

export const getTowersState = (): TowerEntity[] => getState().towers;

export const updateTowersState = (newEntities: TowerEntity[]) =>
  updateState({
    ...getState(),
    towers: newEntities,
  });

export const getSystemState = (): SystemState => getState().system;

export const updateSystemState = (newSystem: Partial<SystemState>) => {
  return updateState({
    ...getState(),
    system: { ...getSystemState(), ...newSystem },
  });
};

export const getPlayerState = () => getState().player;

export const updatePlayerState = (newState: PlayerState) =>
  updateState({
    ...getState(),
    player: newState,
  });

export const resetState = () => {
  updateState(JSON.parse(JSON.stringify(defaultState)) as State);
};
