import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducers.ts";
import { socketListener } from "./middleware/socketListener.ts";

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefault) => getDefault().prepend(socketListener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;