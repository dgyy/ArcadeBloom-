export interface State {
  onUpdate: (timeElapsed: number) => void;
  onEnter?: Function;
  onLeave?: Function;
}

export class StateMachine {
  private currentState: State

  constructor (initialState: State, ...enterArgs: any) {
    this.currentState = initialState
    this.currentState.onEnter?.(...enterArgs)
  }

  setState (newState: State, ...enterArgs: any) {
    this.currentState.onLeave?.()
    this.currentState = newState
    this.currentState.onEnter?.(...enterArgs)
  }

  getState () {
    return this.currentState
  }
}
