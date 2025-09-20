import { State } from './src/state.ts';

export declare global {
  interface Window {
    // How long to sleep between ticks
    wait: number;
    // If true game is stopped
    pause: boolean;
    // Game state. Assigning to this variable won't affect game
    state: State;
  }
}
