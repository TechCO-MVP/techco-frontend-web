import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/lib/store/features/auth/auth";
import sidbarSlice from "@/lib/store/features/sidebar/sidebar";
import notificationsSlice from "./features/notifications/notifications";
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      sidebar: sidbarSlice,
      notifications: notificationsSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
