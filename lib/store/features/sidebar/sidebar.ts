import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface SidebarState {
  isOpen: boolean;
}

const initialState: SidebarState = {
  isOpen: false,
};

export const authSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setSidebarState: (state, action: PayloadAction<Partial<SidebarState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setSidebarState } = authSlice.actions;

export const selectSidebarState = (state: RootState) => state.sidebar;

export default authSlice.reducer;
