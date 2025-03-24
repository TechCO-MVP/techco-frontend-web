import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/lib/store";

export interface NotificationsState {
  showCandidateDetails?: {
    phaseId: string;
    cardId: string;
  };
}

const initialState: NotificationsState = {};

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotificationsState: (
      state,
      action: PayloadAction<Partial<NotificationsState>>,
    ) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setNotificationsState } = notificationsSlice.actions;

export const selectNotificationsState = (state: RootState) =>
  state.notifications;

export default notificationsSlice.reducer;
