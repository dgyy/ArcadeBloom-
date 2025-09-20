export const makeStore = (initialState, reducer) => {
  let onChange;
  let state = initialState;
  return {
    dispatch: ({ type, payload }) => {
      state = reducer(state, { type, payload });
      if (onChange) {
        setTimeout(() => onChange(state), 0);
      }
    },
    onChange: (cb) => {
      onChange = cb;
    },
    get state() {
      return state;
    },
  };
};
