import { combineReducers } from "@reduxjs/toolkit";
import {
  authReducer,
  channelReducer,
  messageReducer,
  modalReducer,
  socketReducer,
} from "./slices";

const rootReducer = combineReducers({
  authReducer,
  modalReducer,
  channelReducer,
  messageReducer,
  socketReducer,
});

export default rootReducer;
