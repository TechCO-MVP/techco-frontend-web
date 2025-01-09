import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface SignUpState {
  email?: string;
  session?: string;
  company?: string;
  country?: string;
  companySize?: string;
  role?: string;
}

const initialState: SignUpState = {
  email: "",
  session: "",
  company: "",
  country: "",
  companySize: "",
  role: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<Partial<SignUpState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setAuthState } = authSlice.actions;

export const selectAuthState = (state: RootState) => state.auth;

export default authSlice.reducer;
