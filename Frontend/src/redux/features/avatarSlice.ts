// save active avatarid and the avatar data array to match the avatar id with active avatar id to get the details of the avatar and show it for user

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
    avatarData: []
}

const avatarSlice = createSlice({
    name: "avatar",
    initialState,
    reducers: {
      setAvatarData: (state, action: PayloadAction<any>) => {
        state.avatarData = action.payload;
      }
    }
})

export const { setAvatarData } = avatarSlice.actions;

export default avatarSlice.reducer;