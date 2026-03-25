import { createStore, combineReducers } from "redux";
import { authReducer } from "./features/auth/authslice";
import { caseReducer } from "./features/cases/caseSlice";
import { notificationReducer } from "./features/notifications/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  cases: caseReducer,
  notifications: notificationReducer,
});

export const store = createStore(rootReducer);
