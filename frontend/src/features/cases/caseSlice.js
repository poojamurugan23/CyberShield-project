const initialState = {
  cases: [],
};

export const caseReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CASES":
      return { cases: action.payload };
    case "ADD_CASE":
      return { cases: [action.payload, ...state.cases] };
    default:
      return state;
  }
};