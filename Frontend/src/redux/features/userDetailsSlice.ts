import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  user: null,
};

const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, clearUser } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;