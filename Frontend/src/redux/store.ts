import { configureStore } from '@reduxjs/toolkit';
import userDetailsReducer from './features/userDetailsSlice';

const store = configureStore({
  reducer: {
    user: userDetailsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
