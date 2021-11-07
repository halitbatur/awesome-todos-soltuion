import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

// import { AnyAction } from "redux";
import { RootState } from "../../app/store";

export interface Notification {
  id: string;
  message: string;
  error?: boolean;
}
const initialState = [] as Notification[];

// function isRejectedAction(
//   action: AnyAction
// ): action is PayloadAction<{ message: string }> {
//   return action.type.endsWith("rejected");
// }

const slice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clear: () => initialState,
    add: (state, action: PayloadAction<string>) => {
      state.unshift({ message: action.payload, id: nanoid() });
    },
    remove: (state, action: PayloadAction<Partial<Notification>>) =>
      state.filter((m) => m.id !== action.payload.id),
  },
  // extraReducers: (builder) => {
  //   builder.addMatcher(
  //     isRejectedAction,
  //     (state, action) => {
  //       state.push({
  //         message: action.error.data.message,
  //         error: true,
  //         id: nanoid(),
  //       });
  //     }
  //   );
  // },
});

export const {
  clear: clearNotifications,
  add: addNotification,
  remove: removeNotification,
} = slice.actions;

export const selectNotifications = (state: RootState) => state.notifications;

export default slice.reducer;
