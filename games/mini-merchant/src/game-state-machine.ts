import { State, StateMachine } from './core/state-machine'

export let gameStateMachine: StateMachine

export function createGameStateMachine (
  initialState: State,
  ...initialArguments: any[]
) {
  gameStateMachine = new StateMachine(initialState, ...initialArguments)
}
