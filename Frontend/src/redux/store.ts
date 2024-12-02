import { configureStore } from '@reduxjs/toolkit';
import userDetailsReducer from './features/userDetailsSlice';
import avatarReducer from './features/avatarSlice';

const store = configureStore({
  reducer: {
    user: userDetailsReducer,
    avatarData: avatarReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
