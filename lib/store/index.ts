import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/lib/store/features/auth/auth";
import sidbarSlice from "@/lib/store/features/sidebar/sidebar";

export const makeStore = () => {
  return configureStore({
    reducer: { auth: authSlice, sidebar: sidbarSlice },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
