import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import stateSlice from "./stateSlice";
import { response } from "./stateSlice";

function saveToLocalStorage(state: response[]) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serialisedState = localStorage.getItem("persistantState");
    if (serialisedState === null) return undefined;
    return JSON.parse(serialisedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

const rootReducer = combineReducers({
  stateSlice,
  preloadedState: loadFromLocalStorage(),
})

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer
  })
}

export const store = setupStore();

store.subscribe(() => saveToLocalStorage(store.getState().stateSlice.wishList));

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector