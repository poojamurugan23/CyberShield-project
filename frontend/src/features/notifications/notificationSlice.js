const initialState = {
  notifications: [],
};

export const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return { notifications: [action.payload, ...state.notifications] };
    default:
      return state;
  }
};