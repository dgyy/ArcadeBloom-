export const startGame = () => ({
  type: "START_GAME",
});

export function startingHandler(state, action) {
  const actions = {
    START_GAME: () => ({
      ...state,
      gameState: "STARTED",
    }),
  };

  return actions[action.type](action.payload);
}
