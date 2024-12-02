import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface SignUpState {
  email?: string;
  company?: string;
  contry?: string;
  terms?: boolean;
}

const initialState: SignUpState = {
  email: "",
  company: "",
  contry: "",
  terms: false,
};

export const singUpSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setSignUpState: (state, action: PayloadAction<Partial<SignUpState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSignUpState } = singUpSlice.actions;

export const selectSignUpState = (state: RootState) => state.signUp;

export default singUpSlice.reducer;
