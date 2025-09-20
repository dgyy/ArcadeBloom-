export const restartGame = ({ initialState }) => ({
  type: "RESTART_GAME",
  payload: { initialState },
});

export function gameOverHandler(state, action) {
  const actions = {
    RESTART_GAME: () => action.payload.initialState,
  };

  return actions[action.type]?.(action.payload);
}
