import { configureStore } from "@reduxjs/toolkit";
import signUpSlice from "@/lib/store/features/auth/sign-up-slice";

export const makeStore = () => {
  return configureStore({
    reducer: { signUp: signUpSlice },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
