// @/state/store.ts
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./reducers/app";

const store = configureStore({
	reducer: {
		app: appReducer,
	},
	// devTools: import.meta.env.NODE_ENV !== "production" ? true : false,
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;