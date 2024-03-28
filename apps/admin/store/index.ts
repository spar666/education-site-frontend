"use client";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

export function makeStore() {
  return configureStore({
    reducer: { user: userReducer},
  });
}

const store = makeStore();

export default store;
