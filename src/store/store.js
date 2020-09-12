import { configureStore } from '@reduxjs/toolkit';
import userSlice from './users/userSlice';

export default configureStore({
  reducer: {
    directory: userSlice,
  },
});
